# 🚀 How to Run BrainClone App - Complete Guide

## 📋 Prerequisites

Before running the app, make sure you have:
- **Python 3.13** (required for backend)
- **Node.js** (for frontend)
- **pnpm** (package manager)
- **Homebrew** (for installing dependencies on macOS)

## 🛠️ Step-by-Step Setup

### 1. **Check Your Environment**
```bash
# Check Python version (must be 3.13)
python3 --version

# Check Node.js
node --version

# Check pnpm
pnpm --version
```

### 2. **Install Python 3.13 (if needed)**
```bash
# Install Python 3.13 using Homebrew
brew install python@3.13

# Verify installation
/opt/homebrew/bin/python3 --version
```

### 3. **Setup Backend**

#### Navigate to backend directory:
```bash
cd /Users/ramakant/Downloads/brainclone-frontend-main/backend
```

#### Create virtual environment:
```bash
/opt/homebrew/bin/python3 -m venv venv
```

#### Activate virtual environment:
```bash
source venv/bin/activate
```

#### Install dependencies:
```bash
pip install "fastapi[all]" "uvicorn[standard]" python-multipart neo4j asyncpg pgvector pydantic-settings "python-jose[cryptography]" httpx redis numpy scikit-learn tenacity structlog python-dotenv celery
pip install r2r==3.4.1
pip install deprecated
```

### 4. **Setup Frontend**

#### Navigate to frontend directory:
```bash
cd /Users/ramakant/Downloads/brainclone-frontend-main/frontend
```

#### Install dependencies:
```bash
pnpm install
```

### 5. **Start the Services**

#### Start Backend (Terminal 1):
```bash
cd /Users/ramakant/Downloads/brainclone-frontend-main/backend
source venv/bin/activate
python -m src.main
```

#### Start Frontend (Terminal 2):
```bash
cd /Users/ramakant/Downloads/brainclone-frontend-main/frontend
pnpm dev
```

## 🌐 Access Your App

### **Frontend Application:**
- **URL**: `http://localhost:3000` or `http://localhost:3002`
- **What you'll see**: 3D graph visualization interface

### **Backend API:**
- **Health Check**: `http://localhost:8000/health`
- **API Documentation**: `http://localhost:8000/docs`
- **API Base**: `http://localhost:8000/api/v1`

## 🎯 What You Can Do

### **1. View the 3D Graph**
- Open `http://localhost:3000` in your browser
- You'll see a 3D interactive graph visualization
- Navigate with mouse: drag to rotate, scroll to zoom

### **2. Upload Documents**
- Use the frontend interface to upload PDFs, images, or text files
- The app will extract entities (people, places, events) automatically

### **3. Create Entities Manually**
- Use the API to create entities:
```bash
curl -X POST "http://localhost:8000/api/v1/graph/entities" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "type": "person",
    "description": "A sample person",
    "confidence_score": 0.9
  }'
```

### **4. Search Your Data**
- Use hybrid search to find information across documents and graph
- Search for people, events, locations, or any text

### **5. Query the Graph**
- Execute Cypher queries to explore relationships:
```bash
curl -X POST "http://localhost:8000/api/v1/graph/cypher?query=MATCH%20(n)%20RETURN%20n"
```

## 🔧 Troubleshooting

### **Backend Issues:**
- **Port 8000 busy**: Kill existing processes: `lsof -ti:8000 | xargs kill -9`
- **Python version error**: Make sure you're using Python 3.13
- **Missing dependencies**: Re-run the pip install commands

### **Frontend Issues:**
- **Port 3000 busy**: The app will automatically use port 3002
- **Build errors**: Delete `node_modules` and run `pnpm install` again
- **API connection errors**: Make sure backend is running on port 8000

### **Database Issues:**
- **Neo4j connection**: The app uses a cloud Neo4j instance (configured in .env)
- **No data**: Upload documents or create entities manually to populate the graph

## 📊 Key Features

### **3D Graph Visualization**
- Interactive 3D force-directed graph
- Different colors for different entity types (people, events, locations)
- Click and drag to explore relationships

### **Document Processing**
- Upload PDFs, images, text files
- Automatic entity extraction using AI
- Relationship detection between entities

### **Search Capabilities**
- Hybrid search across documents and graph
- Vector similarity search
- Graph traversal queries

### **API Endpoints**
- RESTful API for all operations
- Interactive documentation at `/docs`
- Real-time graph updates

## 🎉 You're Ready!

Once both services are running:
1. **Frontend**: `http://localhost:3000` - Your main app interface
2. **Backend**: `http://localhost:8000/docs` - API documentation

The app will automatically connect the frontend to the backend, and you can start exploring your knowledge graph!

## 💡 Pro Tips

1. **Keep both terminals open** - Backend and frontend need to run simultaneously
2. **Use the API docs** - Visit `/docs` to test endpoints interactively
3. **Start with sample data** - Upload a few documents to see the magic happen
4. **Explore the 3D graph** - The visualization is the most impressive feature!

Happy exploring! 🚀
