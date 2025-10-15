# AI Customer Support Bot 🤖

An intelligent customer support chatbot powered by Google Gemini AI with Retrieval-Augmented Generation (RAG) for accurate, context-aware responses.

## Features ✨

- **RAG-powered responses**: Uses vector similarity search to find relevant FAQ answers
- **Google Gemini 2.0 Flash** for natural language understanding
- **Smart escalation**: Automatically escalates complex queries to human agents
- **Session management**: Maintains conversation context across messages
- **Real-time chat interface**: Clean, modern UI built with Next.js and Tailwind CSS
- **SQLite database**: Zero-config local development with Prisma ORM
- **Confidence scoring**: Each response includes a confidence level

## Tech Stack 🛠️

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **AI**: Google Gemini AI (embedding-001 & gemini-1.5-flash)
- **Vector Search**: In-memory cosine similarity

## Prerequisites 📋

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Google Gemini API Key** - [Get it here](https://makersuite.google.com/app/apikey)

## Installation Steps 🚀

### Step 1: Clone or Navigate to the Project

```bash
cd "c:\Users\Shivam Pant\Desktop\Ai\ai-customer-support"
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js and React
- Prisma (database ORM)
- Google Generative AI SDK
- Tailwind CSS

### Step 3: Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
copy .env.example .env
```

Then edit `.env` and add your Gemini API key:

```env
DATABASE_URL="file:./dev.db"
GEMINI_API_KEY=your_actual_gemini_api_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**To get your Gemini API key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key and paste it in your `.env` file

### Step 4: Initialize the Database

Generate Prisma client and create the database:

```bash
npm run db:generate
npm run db:migrate
```

When prompted for a migration name, you can use: `init`

### Step 5: Import Sample FAQs

Import the sample FAQs and generate embeddings:

```bash
npm run import:faqs
```

This will:
- Create sample FAQ entries
- Generate embeddings using Gemini AI
- Store them in the SQLite database

**Note**: This process may take 1-2 minutes as it generates embeddings for each FAQ.

### Step 6: Start the Development Server

```bash
npm run dev
```

The application will start at: **http://localhost:3000**

## Usage 💬

1. Open your browser and go to `http://localhost:3000`
2. Start typing your questions in the chat interface
3. The AI will respond based on the FAQ knowledge base
4. Questions that require human assistance will be automatically escalated

## Project Structure 📁

```
ai-customer-support/
├── prisma/
│   └── schema.prisma          # Database schema
├── scripts/
│   └── import_faqs.js         # FAQ import script
├── src/
│   ├── lib/
│   │   ├── db.js              # Prisma client
│   │   ├── gemini.js          # Gemini AI wrapper
│   │   ├── prompts.js         # Prompt templates
│   │   └── vector.js          # Vector similarity functions
│   ├── pages/
│   │   ├── _app.js            # Next.js app wrapper
│   │   ├── index.js           # Main chat interface
│   │   └── api/
│   │       ├── chat.js        # Chat API endpoint
│   │       └── session.js     # Session management API
│   └── styles/
│       └── globals.css        # Global styles
├── .env                       # Environment variables (create this)
├── .env.example              # Example environment file
├── package.json              # Dependencies and scripts
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── README.md                 # This file
```

## Available Scripts 📜

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run import:faqs` - Import FAQs and generate embeddings

## How It Works 🔍

### 1. RAG (Retrieval-Augmented Generation)

When a user sends a message:

1. **Embedding Generation**: User's message is converted to a vector embedding
2. **Similarity Search**: System finds top 5 most similar FAQs using cosine similarity
3. **Context Building**: Relevant FAQs + conversation history are added to the prompt
4. **AI Response**: Gemini generates a contextual response
5. **Confidence Scoring**: Response includes a confidence score (0-1)

### 2. Escalation Logic

Messages are escalated to human agents if:
- Confidence score is below 0.5
- Message contains keywords: "refund", "fraud", "legal", "human agent", etc.
- User explicitly requests to speak with a person

### 3. Session Management

- Each conversation gets a unique session ID
- Messages are stored with timestamps
- Conversation history is maintained for context

## Customization 🎨

### Adding Your Own FAQs

1. Create a `data/faqs.json` file:

```json
[
  {
    "question": "Your question here?",
    "answer": "Your detailed answer here.",
    "source": "category"
  }
]
```

2. Run the import script:

```bash
npm run import:faqs
```

### Adjusting AI Behavior

Edit `src/lib/prompts.js` to modify:
- System prompt
- Response format
- Escalation keywords
- Confidence thresholds

### Changing AI Model

Edit `src/lib/gemini.js` to use different Gemini models:
- `gemini-1.5-flash` (fast, current)
- `gemini-1.5-pro` (more capable)
- `gemini-pro` (previous generation)

## Troubleshooting 🔧

### Database Issues

If you encounter database errors:

```bash
# Reset the database
rm prisma/dev.db
npm run db:migrate
npm run import:faqs
```

### API Key Issues

If you get authentication errors:
- Verify your `GEMINI_API_KEY` in `.env`
- Ensure the key is active in Google AI Studio
- Check for any spaces or quotes around the key

### Port Already in Use

If port 3000 is busy:

```bash
# Use a different port
npm run dev -- -p 3001
```

## Scaling Considerations 📈

For production use, consider:

- **Database**: Migrate from SQLite to PostgreSQL with pgvector
- **Vector Store**: Use Pinecone, Weaviate, or Supabase for better performance
- **Caching**: Add Redis for session and response caching
- **Rate Limiting**: Implement API rate limiting
- **Authentication**: Add user authentication
- **Monitoring**: Add logging and error tracking

## Environment Variables Reference 📝

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | SQLite database path | Yes | `file:./dev.db` |
| `GEMINI_API_KEY` | Google Gemini API key | Yes | - |
| `NEXT_PUBLIC_BASE_URL` | Application base URL | No | `http://localhost:3000` |

## License 📄

MIT License - feel free to use this project for learning or commercial purposes.

## Support 💪

For issues or questions:
1. Check the troubleshooting section above
2. Review the Gemini AI documentation
3. Check Prisma documentation for database issues

## Contributing 🤝

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

---

**Built with ❤️ using Next.js and Google Gemini AI**
