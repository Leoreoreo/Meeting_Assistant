// src/components/MindMap.jsx
import React, { useState, useRef } from 'react';
import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css'; // Import global styles for ReactFlow
import { Box, Button, TextField, Typography } from '@mui/material';
import InputKeywords from './InputKeywords';
import Transcript from './Transcript';

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
        
        <Transcript />

    </Box>
  );
};

export default MindMap;
