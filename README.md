# AI Customer Support Bot 🤖

An intelligent customer support chatbot powered by Google Gemini AI for accurate, context-aware responses. Features a modern React interface with dark mode, animations, and professional styling.

## ✨ Features

- **🚀 Google Gemini 2.0 Flash** for natural language understanding
- **🎯 Smart escalation**: Automatically escalates complex queries to human agents
- **💾 Session management**: Maintains conversation context across messages
- **🎨 Modern React UI**: Built with Vite, React Router, and Framer Motion
- **🌙 Dark/Light theme**: Elegant theme switching with system preference detection
- **⚡ Real-time animations**: Smooth transitions and micro-interactions
- **📊 Confidence scoring**: Each response includes a confidence level
- **📱 Responsive design**: Works perfectly on desktop and mobile
- **🔧 Professional formatting**: Clean message rendering with enhanced typography

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **React Hot Toast** - Elegant notifications

### Backend & AI
- **Node.js** - JavaScript runtime
- **Google Gemini AI** - embedding-001 & gemini-2.0-flash-exp
- **Prisma ORM** - Type-safe database client
- **SQLite** - Lightweight database for development

### Features
- **Theme System** - Context-based dark/light mode
- **Session Management** - Persistent conversations
- **Message Formatting** - Clean text processing and rendering

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Google Gemini API Key** - [Get it here](https://makersuite.google.com/app/apikey)

## 🚀 Installation Steps

### Step 1: Navigate to Project

```bash
cd "c:\Users\Shivam Pant\Desktop\Ai\ai-customer-support"
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages including:
- React, Vite, and React Router
- Framer Motion for animations
- Tailwind CSS for styling
- Prisma for database management
- Google Generative AI SDK
- Lucide icons and React Hot Toast

### Step 3: Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
copy .env.example .env
```

Edit `.env` and add your Gemini API key:

```env
DATABASE_URL="file:./dev.db"
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
VITE_API_BASE_URL=http://localhost:5001
```

**To get your Gemini API key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key and paste it in your `.env` file

### Step 4: Initialize Database

Generate Prisma client and create the database:

```bash
npm run db:generate
npm run db:migrate
```

When prompted for migration name, use: `init`

### Step 5: Import Sample FAQs

Import sample FAQs and generate embeddings:

```bash
npm run import:faqs
```

This process takes 1-2 minutes to generate embeddings for all FAQs.

### Step 6: Start Development Servers

Start both the frontend and backend:

```bash
# Start the React frontend (Vite dev server)
npm run dev

# In another terminal, start the backend API server
npm run server
```

The application will be available at:
- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend API**: http://localhost:5001 (Node.js server)

## 💬 Usage

1. Open your browser to `http://localhost:5173`
2. Choose from quick action buttons or type your question
3. Toggle between light/dark themes using the theme switcher
4. The AI responds based on your FAQ knowledge base
5. Complex queries are automatically escalated to human agents

## 📁 Project Structure

```
ai-customer-support/
├── public/                    # Static assets
├── src/
│   ├── components/           # React components
│   │   ├── ChatBot.js       # Legacy chat component
│   │   └── ThemeToggle.jsx  # Theme switching component
│   ├── contexts/            # React contexts
│   │   └── ThemeContext.jsx # Theme management
│   ├── lib/                 # Core libraries
│   │   ├── db.js           # Prisma database client
│   │   ├── gemini.js       # Gemini AI integration
│   │   ├── prompts.js      # AI prompt templates
│   │   └── vector.js       # Vector similarity functions
│   ├── pages/              # Page components
│   │   ├── ChatPage.jsx    # Main chat interface
│   │   └── index.js        # Legacy Next.js page
│   ├── server/             # Backend API server
│   ├── styles/             # Global styles
│   │   └── globals.css     # Tailwind and custom CSS
│   ├── utils/              # Utility functions
│   │   └── responseFormatter.js # Message formatting
│   ├── App.jsx             # Main React app component
│   └── main.jsx            # React entry point
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── dev.db             # SQLite database
├── scripts/
│   └── import_faqs.js      # FAQ import utility
├── data/
│   └── faqs.json          # Sample FAQ data
├── .env                    # Environment variables (create this)
├── .env.example           # Example environment file
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── tailwind.config.cjs    # Tailwind CSS configuration
└── README.md              # This file
```

## 📜 Available Scripts

- `npm run dev` - Start Vite development server (frontend)
- `npm run server` - Start Node.js API server (backend)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run import:faqs` - Import FAQs and generate embeddings

## 🔍 How It Works

### 1. RAG (Retrieval-Augmented Generation)

When a user sends a message:

1. **Embedding Generation**: User message → vector embedding
2. **Similarity Search**: Find top 5 most similar FAQs using cosine similarity
3. **Context Building**: Relevant FAQs + conversation history → AI prompt
4. **AI Response**: Gemini generates contextual response
5. **Confidence Scoring**: Response includes confidence score (0-1)
6. **Message Formatting**: Clean, professional text rendering

### 2. Modern UI Features

- **Theme System**: Automatic dark/light mode with system preference detection
- **Animations**: Smooth page transitions, message animations, loading states
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Message Formatting**: Enhanced rendering with bullet points, numbered lists, headers
- **Toast Notifications**: Real-time feedback for user actions
- **Connection Status**: Live API connection monitoring

### 3. Escalation Logic

Messages escalate to human agents when:
- Confidence score < 0.5
- Keywords detected: "refund", "fraud", "legal", "human agent", etc.
- User explicitly requests human assistance

## 🎨 Customization

### Adding Your Own FAQs

1. Edit `data/faqs.json`:

```json
[
  {
    "question": "Your custom question?",
    "answer": "Your detailed answer here.",
    "source": "category",
    "priority": 1
  }
]
```

2. Regenerate embeddings:

```bash
npm run import:faqs
```

### Customizing UI Theme

Edit `tailwind.config.cjs` to modify:
- Color schemes and gradients
- Animation configurations
- Custom utilities and components
- Typography and spacing

### Adjusting AI Behavior

Edit `src/lib/prompts.js` to modify:
- System prompt and personality
- Response format and style
- Escalation keywords and thresholds
- Confidence scoring logic

### Changing AI Models

Edit `src/lib/gemini.js` to use different models:
- `gemini-2.0-flash-exp` (latest, fastest)
- `gemini-1.5-pro` (more capable, slower)
- `gemini-1.5-flash` (balanced performance)

## 🔧 Troubleshooting

### Frontend Issues

**Vite dev server won't start:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Theme not working:**
- Check if `ThemeContext` is properly wrapped around your app
- Verify Tailwind dark mode is configured as 'class'

### Backend Issues

**Database locked error:**
```bash
# Reset database
rm prisma/dev.db
npm run db:migrate
npm run import:faqs
```

**API connection failed:**
- Ensure backend server is running on port 5001
- Check `VITE_API_BASE_URL` in `.env`
- Verify Gemini API key is correct

### Common Port Issues

**Port 5173 already in use:**
```bash
npm run dev -- --port 3000
```

**Port 5001 already in use:**
```bash
# Edit server/index.js to use different port
# Or kill existing process
```

## 📈 Production Deployment

For production deployment, consider:

### Performance Optimizations
- **Database**: Migrate to PostgreSQL with pgvector
- **Vector Store**: Use Pinecone, Weaviate, or Supabase
- **Caching**: Add Redis for sessions and responses
- **CDN**: Serve static assets via CDN

### Security & Monitoring
- **Rate Limiting**: Implement API request limits
- **Authentication**: Add user authentication system
- **Logging**: Add structured logging and monitoring
- **Error Tracking**: Integrate error monitoring service

### Scaling
- **Load Balancing**: Multi-instance deployment
- **Database Sharding**: For high-volume usage
- **Microservices**: Split into separate services

## 📝 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | SQLite database path | Yes | `file:./dev.db` |
| `VITE_GEMINI_API_KEY` | Google Gemini API key | Yes | - |
| `VITE_API_BASE_URL` | Backend API base URL | Yes | `http://localhost:5001` |

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - Feel free to use for personal or commercial projects.

## 💪 Support

For help and questions:

1. Check the troubleshooting section
2. Review [Vite documentation](https://vitejs.dev/)
3. Check [Gemini AI documentation](https://ai.google.dev/)
4. Review [Tailwind CSS documentation](https://tailwindcss.com/)

---

**Built with ❤️ using React, Vite, Tailwind CSS, and Google Gemini AI**

*Modern AI-powered customer support with beautiful animations and dark mode support*
