# MindEcho - Meeting Assistant

## 🎯 Overview

MindEcho is an innovative accessibility tool designed to empower people with hearing and speaking disabilities during meetings. The application provides real-time meeting transcript capturing, dynamic mind map generation, and AI-powered speech autocompletion to help users actively participate in conversations.

## ✨ Key Features

### 🧠 Dynamic Mind Map Generation
- **Real-time Processing**: Automatically generates and updates mind maps as the meeting progresses
- **Interactive Visualization**: Click on any node to view detailed transcript segments
- **Hierarchical Structure**: Organizes meeting content into main topics and subtopics
- **Visual Navigation**: Drag, zoom, and pan through the mind map for easy exploration

### 🎤 Speech Recognition & Transcript
- **Live Transcription**: Captures speech in real-time using browser's speech recognition
- **Video Integration**: Upload and play meeting videos with synchronized transcript display
- **Time-synchronized Content**: Transcript updates based on video playback position
- **Auto-scrolling**: Transcript automatically scrolls to show the most recent content

### 💬 AI-Powered Speech Assistance
- **Keyword-based Input**: Enter keywords to express your thoughts
- **Smart Suggestions**: AI generates contextually relevant responses based on meeting content
- **Text-to-Speech**: Convert AI-generated responses to speech for verbal participation
- **Context Awareness**: Responses are tailored to the current meeting discussion

### 🎨 Modern User Interface
- **Responsive Design**: Clean, intuitive interface that works across different screen sizes
- **Accessibility Focused**: Designed with accessibility principles in mind
- **Real-time Updates**: Live updates without page refreshes
- **Interactive Elements**: Hover effects, smooth transitions, and intuitive controls

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **Material-UI (MUI)** - Component library for consistent design
- **ReactFlow** - Interactive node-based diagrams for mind maps
- **React Speech Recognition** - Browser-based speech recognition
- **Axios** - HTTP client for API calls

### Backend Processing
- **Python** - Backend scripts for transcript processing
- **OpenAI API** - GPT models for content analysis and generation
- **JSON** - Data format for structured content storage

### Key Dependencies
- `@xyflow/react` - React Flow for mind map visualization
- `react-speech-recognition` - Speech-to-text functionality
- `@mui/material` - UI components and theming
- `axios` - API communication

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager
- OpenAI API key
- Modern web browser with speech recognition support

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Meeting_Assistant
   ```

2. **Install dependencies**
   ```bash
   cd my-app
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the `my-app` directory:
   ```env
   REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Backend Setup (Optional)
If you want to use the Python scripts for transcript processing:

1. **Install Python dependencies**
   ```bash
   cd backend/scripts
   pip install openai
   ```

2. **Configure API key**
   Update the API key in `divide_text.py`

## 📱 How to Use

### 1. Upload Meeting Content
- Click "Upload Video" to upload a meeting recording
- The video player will appear with playback controls
- Speech recognition will automatically start when you play the video

### 2. View Real-time Transcript
- The transcript section displays live speech-to-text conversion
- Content updates automatically as the video plays
- Scroll through the transcript to review previous content

### 3. Explore the Mind Map
- The mind map updates every 5 seconds with new content
- Click on any node to view detailed transcript segments
- Use mouse controls to zoom, pan, and navigate the map
- Nodes are color-coded and interactive with hover effects

### 4. Express Your Thoughts
- Enter keywords in the left panel to describe what you want to say
- Click "Organize my thoughts!" to generate AI-powered responses
- Use the "Speak" button to convert text to speech
- Responses are contextually relevant to the current meeting discussion

## 🏗️ Project Structure

```
Meeting_Assistant/
├── my-app/                    # Frontend React application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── MindMap.jsx    # Main mind map component
│   │   │   ├── Transcript.jsx # Speech recognition & video
│   │   │   ├── InputKeywords.jsx # Keyword input interface
│   │   │   ├── PredictedOutput.jsx # AI response generation
│   │   │   └── callOpenai.js  # OpenAI API integration
│   │   ├── assets/           # Images and static files
│   │   └── App.jsx           # Main application component
│   └── package.json          # Dependencies and scripts
├── backend/                   # Backend processing scripts
│   └── scripts/
│       ├── divide_text.py    # Transcript processing
│       └── subdivide.py      # Additional processing utilities
└── README.md                 # This file
```

## 🔧 Configuration

### OpenAI API Setup
1. Get an API key from [OpenAI](https://platform.openai.com/)
2. Add it to your `.env` file as `REACT_APP_OPENAI_API_KEY`
3. The application uses GPT-3.5-turbo for content generation

### Browser Compatibility
- Chrome (recommended for best speech recognition)
- Firefox
- Safari
- Edge

**Note**: Speech recognition requires HTTPS in production environments.

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues, feature requests, or pull requests.

### Development Guidelines
- Follow React best practices
- Use Material-UI components for consistency
- Test speech recognition functionality across browsers
- Ensure accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenAI for providing the GPT API
- React Flow team for the excellent diagramming library
- Material-UI for the comprehensive component library
- The speech recognition community for browser-based solutions

## 📞 Support

For support, questions, or feedback, please open an issue in the repository or contact the development team.

---

**MindEcho** - Making meetings accessible for everyone. 🎯✨
