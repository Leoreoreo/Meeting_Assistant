// src/components/MindMap.jsx
import React, { useState, useRef } from 'react';
import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css'; // Import global styles for ReactFlow
import { Box, Button, TextField, Typography } from '@mui/material';
import InputKeywords from './InputKeywords';

const MindMap = () => {
  // Dummy nodes and edges
  const [nodes, setNodes] = useState([
    { id: '1', data: { label: 'Root Node' }, position: { x: 250, y: 5 } },
    { id: '2', data: { label: 'Node 1' }, position: { x: 100, y: 150 } },
    { id: '3', data: { label: 'Node 2' }, position: { x: 400, y: 150 } },
    { id: '4', data: { label: 'Node 3' }, position: { x: 250, y: 300 } },
  ]);

  const [edges, setEdges] = useState([
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e1-3', source: '1', target: '3', animated: true },
    { id: 'e1-4', source: '1', target: '4', animated: true },
  ]);

  // Video upload and speech-to-text
  const [videoSrc, setVideoSrc] = useState(null);
  const [transcript, setTranscript] = useState('');
  const videoRef = useRef(null);

  // Web Speech API for speech-to-text
  const [recognition, setRecognition] = useState(null);

  // Initialize speech recognition
  const initializeSpeechRecognition = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const recognitionInstance = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;

      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('');
        setTranscript(transcript);
      };

      setRecognition(recognitionInstance);
    } else {
      alert('Speech Recognition API not supported in this browser.');
    }
  };

  const startRecognition = () => {
    if (recognition) {
      recognition.start();
    }
  };

  const stopRecognition = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoSrc(URL.createObjectURL(file)); // Set the video source to the uploaded file
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Main content with Mind Map */}
      <Box sx={{ display: 'flex', height: '80vh' }}>
        {/* Left panel for InputKeywords */}
        <InputKeywords />
        
        {/* Right panel for ReactFlow (Mind Map) */}
        <Box sx={{ flex: 1 }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            style={{
              backgroundColor: 'white',  // White background for React Flow
              color: 'black',  // Set text color to black
            }}
          >
            <Background color="#ddd" gap={16} /> {/* Lighter background grid */}
            <Controls />
          </ReactFlow>
        </Box>
      </Box>

      {/* Bottom section for Video and Transcript */}
        <Box sx={{ display: 'flex', flexDirection: 'row', padding: 2, borderTop: '1px solid #ddd', backgroundColor: 'white' }}>
        {/* Video player section */}
        <Box sx={{ width: '50%', padding: 1, backgroundColor: 'white' }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'black' }}>Video Player</Typography>
            <input
            accept="video/*"
            type="file"
            onChange={handleVideoUpload}
            style={{ marginBottom: '10px', backgroundColor: 'white', border: '1px solid #ccc', padding: '8px' }}
            />
            {videoSrc && (
            <video ref={videoRef} controls width="100%">
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            )}
            <Box sx={{ marginTop: '10px' }}>
            <Button variant="contained" color="primary" onClick={initializeSpeechRecognition}>
                Start Transcript
            </Button>
            <Button variant="contained" color="secondary" onClick={startRecognition} sx={{ marginLeft: '10px' }}>
                Start Listening
            </Button>
            <Button variant="contained" color="secondary" onClick={stopRecognition} sx={{ marginLeft: '10px' }}>
                Stop Listening
            </Button>
            </Box>
        </Box>

        {/* Transcript section */}
        <Box sx={{ width: '50%', padding: 1, backgroundColor: 'white' }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'black' }}>Real-time Transcript</Typography>
            <TextField
            value={transcript}
            multiline
            rows={4}  // Reduced height to make it more compact
            fullWidth
            variant="outlined"
            InputProps={{
                readOnly: true,
            }}
            sx={{
                backgroundColor: 'white',
                color: 'black',
                '& .MuiOutlinedInput-root': {
                '& fieldset': {
                    borderColor: '#ddd',
                },
                },
                '& .MuiInputBase-input': {
                color: 'black',  // Ensure the text is black
                },
            }}
            />
        </Box>
        </Box>

    </Box>
  );
};

export default MindMap;
