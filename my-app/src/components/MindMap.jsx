import React, { useState, useEffect, use } from 'react';
import { ReactFlow, ReactFlowProvider, Background, Controls, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Draggable from 'react-draggable';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InputKeywords from './InputKeywords';
import Transcript from './Transcript';
import jsonData from '../data/nodesAndEdges.json';

// Custom node with right-side handle
const RightHandleNode = ({ data }) => {
  return (
    <div style={{
      padding: 10,
      border: '1px solid #ccc',
      borderRadius: 8,
      background: '#fff',
      minWidth: 100,
      textAlign: 'center'
    }}>
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
      <Box sx={{ display: 'flex', height: '80vh' }}>
        <InputKeywords transcript={transcript} />
        <Box sx={{ flex: 1, position: 'relative' }}>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              fitView
              nodeTypes={nodeTypes}
              onNodeClick={handleNodeClick}
              style={{
                backgroundColor: 'white',
                color: 'black',
              }}
            >
              <Background color="#ddd" gap={16} />
              <Controls />
            </ReactFlow>
          </ReactFlowProvider>
          <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Transcript
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