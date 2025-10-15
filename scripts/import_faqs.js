import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

function normalizeEmbedding(raw) {
	const flatten = candidate => {
		if (!Array.isArray(candidate)) return null;
		const flattened = candidate.flat(Infinity);
		return flattened.length && flattened.every(value => typeof value === 'number' && Number.isFinite(value))
			? flattened
			: null;
	};
	const candidates = [
		raw,
		raw?.embedding,
		raw?.values,
		raw?.data?.[0]?.embedding,
		raw?.data?.[0]?.values
	];
	for (const candidate of candidates) {
		const normalized = flatten(candidate);
		if (normalized) {
			return normalized;
		}
	}
	return [];
}

async function importFAQs() {
	try {
		console.log('🚀 Starting FAQ import process...\n');

		// Dynamic import of user-provided embedding helper so we can provide actionable errors
		let getEmbedding;
		try {
			// Note: user should export `getEmbedding(text: string): Promise<any>` from src/lib/gemini.js
			const mod = await import(path.join(__dirname, '../src/lib/gemini.js'));
			if (typeof mod.getEmbedding !== 'function') {
				throw new Error('Module does not export getEmbedding(text)');
			}
			getEmbedding = mod.getEmbedding;
		} catch (err) {
			console.error('❌ Embedding helper not found or invalid at src/lib/gemini.js');
			console.error('Please create src/lib/gemini.js that exports async function getEmbedding(text) and calls the Gemini 2.5 embedding API.');
			console.error('Example (very condensed):');
			console.error('  export async function getEmbedding(text) { /* call Gemini 2.5 embeddings and return raw result */ }');
			throw err;
		}

		// small retry/backoff wrapper for embedding generation
		async function getEmbeddingWithRetry(text, attempts = 3) {
			let delay = 500;
			for (let i = 0; i < attempts; i++) {
				try {
					return await getEmbedding(text);
				} catch (err) {
					const lastAttempt = i === attempts - 1;
					console.warn(`⚠️  Embedding generation failed (attempt ${i + 1}/${attempts}): ${err.message}`);
					if (lastAttempt) throw err;
					await new Promise(r => setTimeout(r, delay));
					delay *= 2;
				}
			}
		}

		// Check if data/faqs.json exists
		const faqPath = path.join(__dirname, '../data/faqs.json');

		let faqs;
		if (fs.existsSync(faqPath)) {
			console.log('📄 Reading FAQs from data/faqs.json...');
			faqs = JSON.parse(fs.readFileSync(faqPath, 'utf8'));
		} else {
			console.log('📄 No faqs.json found, using sample FAQs...');
			// Sample FAQs for demo
			faqs = [
				{
					question: "What are your business hours?",
					answer: "We are open Monday through Friday, 9 AM to 6 PM EST. Our customer support team is available during these hours to assist you.",
					source: "general"
				},
				{
					question: "How do I reset my password?",
					answer: "To reset your password: 1) Click 'Forgot Password' on the login page, 2) Enter your email address, 3) Check your email for a reset link, 4) Follow the link and create a new password.",
					source: "account"
				},
				{
					question: "What is your refund policy?",
					answer: "We offer a 30-day money-back guarantee on all purchases. If you're not satisfied, contact our support team within 30 days of purchase for a full refund.",
					source: "billing"
				},
				{
					question: "How do I contact customer support?",
					answer: "You can reach our customer support team via: 1) This chat interface, 2) Email at support@example.com, 3) Phone at 1-800-123-4567 during business hours.",
					source: "general"
				},
				{
					question: "Do you offer technical support?",
					answer: "Yes! Our technical support team is available to help with any technical issues. You can reach them through this chat, or by calling our dedicated tech support line at 1-800-TECH-HELP.",
					source: "technical"
				}
			];
		}

		console.log(`📊 Found ${faqs.length} FAQs to import\n`);

		const faqDelegate = prisma.faq ?? prisma.fAQ ?? prisma.FAQ;
		if (!faqDelegate) {
			throw new Error('FAQ model missing in Prisma Client. Verify your schema and that `question` is a unique field for upsert.');
		}

		let imported = 0;
		let errors = 0;

		for (const faq of faqs) {
			try {
				console.log(`Processing: "${(faq.question || '').substring(0, 50)}..."`);

				// Validate FAQ structure
				if (!faq.question || !faq.answer) {
					console.log('⚠️  Skipping invalid FAQ (missing question or answer)\n');
					errors++;
					continue;
				}

				// Generate embedding for the answer (with retry/backoff)
				const rawEmbedding = await getEmbeddingWithRetry(faq.answer);
				const embedding = normalizeEmbedding(rawEmbedding);

				// Validate embedding
				if (!Array.isArray(embedding) || embedding.length === 0) {
					throw new Error('Invalid embedding generated. Ensure your getEmbedding returns an array of numbers or an object containing embedding/data structure.');
				}

				// Store in database
				// Note: Ensure your Prisma schema's `embedding` field matches how you're storing embeddings (e.g., Float[] or Json).
				await faqDelegate.upsert({
					where: { question: faq.question },
					update: {
						answer: faq.answer,
						source: faq.source || 'unknown',
						embedding
					},
					create: {
						question: faq.question,
						answer: faq.answer,
						source: faq.source || 'unknown',
						embedding
					}
				});

				console.log('✅ Imported successfully\n');
				imported++;

				// Small delay to avoid rate limiting
				await new Promise(resolve => setTimeout(resolve, 500));

			} catch (error) {
				console.error(`❌ Error importing FAQ: ${error.message}`);
				console.error(`   Question: ${faq.question}\n`);
				errors++;
			}
		}

		console.log('\n📈 Import Summary:');
		console.log(`✅ Successfully imported: ${imported}`);
		console.log(`❌ Errors: ${errors}`);
		console.log('\n🎉 FAQ import complete!');

	} catch (error) {
		console.error('❌ Fatal error during import:', error);
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}
}

// Run the import
importFAQs();
