# Installation & Setup Guide

This guide will walk you through setting up the AI Customer Support Bot step-by-step.

## Prerequisites

Before starting, make sure you have:

1. **Node.js (v18 or higher)** installed
   - Check: Open terminal and run `node --version`
   - If not installed: Download from https://nodejs.org/

2. **npm (Node Package Manager)** - comes with Node.js
   - Check: Run `npm --version`

3. **Google Gemini API Key**
   - Get it from: https://makersuite.google.com/app/apikey

## Step-by-Step Installation

### Step 1: Navigate to Project Directory

Open your terminal/command prompt and navigate to the project:

```bash
cd "c:\Users\Shivam Pant\Desktop\Ai\ai-customer-support"
```

### Step 2: Install Dependencies

Install all required npm packages:

```bash
npm install
```

**What this does:**
- Installs Next.js, React, and React DOM
- Installs Prisma for database management
- Installs Google Generative AI SDK
- Installs Tailwind CSS for styling
- Downloads all other dependencies

**Expected output:** You should see a progress bar and a list of installed packages.

**Time:** ~2-3 minutes depending on internet speed.

### Step 3: Set Up Environment Variables

Create your environment configuration file:

**On Windows:**
```bash
copy .env.example .env
```

**On Mac/Linux:**
```bash
cp .env.example .env
```

Now edit the `.env` file with a text editor and add your Gemini API key:

```env
DATABASE_URL="file:./dev.db"
GEMINI_API_KEY=YOUR_ACTUAL_API_KEY_HERE
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Important:** Replace `YOUR_ACTUAL_API_KEY_HERE` with your real API key from Google AI Studio.

### Step 4: Generate Prisma Client

Generate the Prisma database client:

```bash
npm run db:generate
```

**What this does:**
- Generates TypeScript types for your database
- Creates the Prisma Client for database queries

**Expected output:** "Generated Prisma Client"

### Step 5: Create Database Schema

Run the database migration to create tables:

```bash
npm run db:migrate
```

**What happens:**
- You'll be prompted to enter a migration name
- Type: `init` and press Enter
- Creates SQLite database file at `prisma/dev.db`
- Creates tables: User, Session, Message, FAQ

**Expected output:** "Your database is now in sync with your schema."

### Step 6: Import Sample FAQs

Load the sample FAQs and generate embeddings:

```bash
npm run import:faqs
```

**What this does:**
- Reads FAQs from `data/faqs.json`
- Sends each FAQ to Gemini AI to generate embeddings
- Stores FAQs and embeddings in the database

**Time:** 1-2 minutes (depends on number of FAQs)

**Expected output:**
```
🚀 Starting FAQ import process...
📄 Reading FAQs from data/faqs.json...
📊 Found 10 FAQs to import

Processing: "What are your business hours?..."
✅ Imported successfully

[...more FAQs...]

📈 Import Summary:
✅ Successfully imported: 10
❌ Errors: 0

🎉 FAQ import complete!
```

### Step 7: Start the Development Server

Launch the application:

```bash
npm run dev
```

**Expected output:**
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
event - compiled client and server successfully
```

**The app is now running!** Open your browser and visit: **http://localhost:3000**

## Verification Checklist

After installation, verify everything works:

- [ ] Can you see the chat interface at http://localhost:3000?
- [ ] Can you type a message and get a response?
- [ ] Does the AI respond based on the FAQs?
- [ ] Are messages showing in the chat window?

## Common Installation Issues

### Issue 1: "npm not found"

**Solution:** Install Node.js from https://nodejs.org/ and restart your terminal.

### Issue 2: "GEMINI_API_KEY not found"

**Solution:** 
1. Check that `.env` file exists in the root directory
2. Verify the API key is on the correct line without spaces
3. Restart the dev server after changing `.env`

### Issue 3: "Database locked" error

**Solution:**
```bash
# Stop the dev server (Ctrl+C)
# Delete the database
rm prisma/dev.db
# Or on Windows:
del prisma\dev.db

# Recreate it
npm run db:migrate
npm run import:faqs
npm run dev
```

### Issue 4: "Port 3000 already in use"

**Solution:**
```bash
# Use a different port
npm run dev -- -p 3001
# Then visit http://localhost:3001
```

### Issue 5: Prisma Client errors

**Solution:**
```bash
# Regenerate Prisma Client
npm run db:generate
```

## Starting the Project (Future Use)

After initial setup, to start the project:

1. Open terminal in project directory:
   ```bash
   cd "c:\Users\Shivam Pant\Desktop\Ai\ai-customer-support"
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open browser to: http://localhost:3000

## Stopping the Project

To stop the development server:
- Press `Ctrl + C` in the terminal
- Type `Y` if prompted to confirm

## File Structure After Installation

```
ai-customer-support/
├── node_modules/          # Installed dependencies (created by npm install)
├── prisma/
│   ├── dev.db            # SQLite database (created by migration)
│   ├── dev.db-journal    # Database journal file
│   └── migrations/       # Database migration history
├── .env                  # Your environment variables (you created this)
├── .next/               # Next.js build files (created on first run)
└── [other project files]
```

## Next Steps

1. **Customize FAQs**: Edit `data/faqs.json` and run `npm run import:faqs`
2. **Modify UI**: Edit `src/pages/index.js` for chat interface changes
3. **Adjust AI behavior**: Edit `src/lib/prompts.js` for response style
4. **Add features**: Explore the API endpoints in `src/pages/api/`

## Getting Help

If you encounter issues:
1. Check this troubleshooting guide
2. Review error messages carefully
3. Check the main README.md for additional information
4. Verify all prerequisites are installed correctly

---

**Congratulations!** You've successfully installed the AI Customer Support Bot. 🎉
