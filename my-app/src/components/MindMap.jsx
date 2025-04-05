import React, { useState, useEffect, use } from 'react';
import { ReactFlow, ReactFlowProvider, Background, Controls, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InputKeywords from './InputKeywords';
import Transcript from './Transcript';
import jsonData from '../data/nodesAndEdges.json';

// Custom node with right-side handle
const RightHandleNode = ({ data }) => {
  return (
    <div
      style={{
        padding: '12px 16px',
        border: '1px solid #ccc',
        borderRadius: 12,
        background: 'rgb(208, 170, 248)',
        minWidth: 120,
        textAlign: 'center',
        fontWeight: 900,
        color: 'white',
        fontSize: '0.95rem',
        boxShadow: '0 1px 3px rgb(162, 191, 242)',
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgb(162, 191, 242)';
        e.currentTarget.style.background = 'rgb(175, 116, 239)';
        e.currentTarget.style.transform = 'scale(1.03)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgb(162, 191, 242)';
        e.currentTarget.style.background = 'rgb(208, 170, 248)';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {data.label}
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
};


const nodeTypes = {
  rightHandle: RightHandleNode,
};

const MindMap = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [transcript, setTranscript] = useState(""); // State to hold transcript content
  const [time, setTime] = useState(0); // State to hold time
  const [selectedTranscript, setSelectedTranscript] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Filter entries from jsonData where the item's time is <= current time
    const visibleItems = jsonData.filter(item => item.time <= time);
  
    // Build nodes and edges arrays
    const newNodes = visibleItems.map(item => ({
      ...item.node,
      type: 'rightHandle'
    }));
  
    const newEdges = visibleItems
      .map(item => item.edge)
      .filter(edge => Object.keys(edge).length > 0); // Remove empty edge objects
  
    setNodes(newNodes);
    setEdges(newEdges);
  }, [time]);

  const handleNodeClick = (event, node) => {
    const entry = jsonData.find(item => item.node.id === node.id);
    if (entry && entry.transcript) {
      setSelectedTranscript(entry.transcript);
      setOpen(true);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Gradient Stripe with Logo */}
      <Box
        sx={{
          height: '50px', // Adjust height as needed
          background: 'linear-gradient(to right,rgb(133, 62, 208),rgb(53, 109, 207))', // Gradient
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center', // Center logo horizontally
          padding: '0 20px', // Add some padding
        }}
      >
        <img
          src="src/assets/MindEcho.svg" // Replace with your logo path
          alt="Logo"
          style={{ height: '80px', width: '200px' }} // Adjust logo size
        />
      </Box>

      {/* Map Content */}
      <Box sx={{ display: 'flex', height: 'calc(80vh - 100px)', flex: 1 }}>
        <InputKeywords transcript={transcript} />
        <Box sx={{ flex: 1, position: 'relative'}}>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              fitView
              nodeTypes={nodeTypes}
              panOnScroll
              zoomOnScroll
              zoomOnPinch
              panOnDrag
              onNodeClick={handleNodeClick}
              style={{
                backgroundColor: 'white',
                background: 'white',
                color: 'black',
              }}
            >
              <Background color="#ddd" gap={16} />
              <Controls />
            </ReactFlow>
          </ReactFlowProvider>
          <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Details (transcript):
              <IconButton onClick={() => setOpen(false)} size="small">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1">{selectedTranscript}</Typography>
            </DialogContent>
          </Dialog>
        </Box>
      </Box>

      <Transcript setTime={setTime} setTranscript={setTranscript} />
    </Box>
  );
};

export default MindMap;