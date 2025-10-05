# BrainClone Setup Instructions

## Gemini AI Integration Setup

To enable the journaling and chat features, you need to set up a Gemini AI API key:

### 1. Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key

### 2. Set Environment Variable
Create a `.env.local` file in the frontend directory:

```bash
# In /frontend/.env.local
NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Features Enabled
With the API key set up, you'll have access to:

- **Journaling**: Add daily memories and experiences
- **AI Analysis**: Gemini processes your entries and extracts entities, relationships, and insights
- **Knowledge Graph Integration**: New memories are connected to your existing graph
- **Context-Aware Chat**: Ask questions about your memories with full context

### 4. How It Works

#### Journaling Flow:
1. User writes about their day/experiences
2. Gemini analyzes the text and extracts:
   - People, places, events mentioned
   - Emotions and topics
   - Relationships between entities
   - Insights and patterns
3. New nodes and connections are added to the knowledge graph
4. User can explore their memories in the 3D visualization

#### Chat Flow:
1. User asks questions about their memories
2. Gemini has full context of the knowledge graph
3. AI provides insights by connecting different memories
4. Responses are personalized based on the user's actual experiences

### 5. Privacy & Security
- All data processing happens through Google's Gemini API
- Journal entries are analyzed but not stored by Google
- Your knowledge graph data remains in your control
- API key should be kept secure and not shared

### 6. Troubleshooting
- Make sure the API key is correctly set in `.env.local`
- Check browser console for any API errors
- Ensure you have sufficient Gemini API quota
- Verify the API key has the necessary permissions
