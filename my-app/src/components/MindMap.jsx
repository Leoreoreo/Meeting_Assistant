import React, { useState, useEffect, use } from 'react';
import { ReactFlow, ReactFlowProvider, Background, Controls, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InputKeywords from './InputKeywords';
import Transcript from './Transcript';
// import jsonData from '../data/nodesAndEdges.json';
import { getOpenAIResponse } from '../data/callOpenai';

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

const convertToFlow = (data) => {
  const nodes = [];
  const edges = [];

  // Track vertical positions per depth to stack siblings
  const levelYTracker = {};

  const traverse = (item, parentId = null, depth = 0) => {
    const nodeId = item.id.toString();

    // Determine Y based on how many nodes are already on this level
    if (!levelYTracker[depth]) levelYTracker[depth] = 0;
    const y = levelYTracker[depth] * 120;
    const x = depth * 300;
    levelYTracker[depth] += 1;

    // Create node
    nodes.push({
      id: nodeId,
      type: 'rightHandle',
      data: { label: item.label, transcript: item.transcript || '' },
      position: { x, y },
    });

    // Create edge
    if (parentId) {
      edges.push({
        id: `e${parentId}-${nodeId}`,
        source: parentId.toString(),
        target: nodeId,
      });
    }

    // Traverse children
    if (item.children && item.children.length > 0) {
      item.children.forEach((child) => traverse(child, nodeId, depth + 1));
    }
  };

  data.forEach((item) => traverse(item));
  return { nodes, edges };
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
  const [structuredData, setStructuredData] = useState([]);

  // useEffect(() => {
  //   // Filter entries from jsonData where the item's time is <= current time
  //   const visibleItems = jsonData.filter(item => item.time <= time);
  
  //   // Build nodes and edges arrays
  //   const newNodes = visibleItems.map(item => ({
  //     ...item.node,
  //     type: 'rightHandle'
  //   }));
  
  //   const newEdges = visibleItems
  //     .map(item => item.edge)
  //     .filter(edge => Object.keys(edge).length > 0); // Remove empty edge objects
  
  //   setNodes(newNodes);
  //   setEdges(newEdges);
  // }, [time]);

  useEffect(() => {
    if (time % 5 !== 4) 
      return;
    // console.log('Current Transcript:', transcript);
    // Call OpenAI API when transcript changes
    const prompt = `
      You are a dynamic mind map generator for a meeting's contents.
      You will receive an existing mind map and an updated version of transcript.
      Your task is to generate an updated mind map based on the transcript.
      Mind map format, original mind map, and updated transcript are provided below.
      ------------------------------------------\n
      <Mind Map Format: start>:\n
      [
        {
          id: int (Node ID),
          label: string (Topic, should be a very brief title),
          children: [
            {
              id: int (Node ID),
              label: string (Sub Topic, should be a very brief summary),
              transcript: "This is the portion of transcript for Sub Topic 1",
            },
            {
              id: int (Node ID),
              label: string (Sub Topic, should be a very brief summary),
              transcript: "This is the portion of transcript for Sub Topic 2",
            }
          ]
        }
      ]
      <Mind Map Format: end>\n
      --------------------------------------------\n
      <Original Mind Map: start>:
      ${JSON.stringify(structuredData)}
      <Original Mind Map: end>\n
      --------------------------------------------\n
      <Updated Meeting Transcript: start>:
      ${transcript}
      <Original Meeting Transcript: end>\n
      --------------------------------------------\n
      <Note>:
      1. DO NOT CHANGE the existing mind map structure (you can edit the transcript, but not label of leaves).
      2. You DON'T have to make a change. If the updated part of transcript is not related to the meeting at all, please return the original mind map.
      3. You CAN change the labels of the root node, or add new root nodes when suitable.
      4. If a leaf node has a very long transcript, you can split it into multiple sub-nodes.
      4. Return ONLY the JSON format mind map (list of dictionary).
    `;
    try {
      const ProcessTranscript = async () => {
        const data = await getOpenAIResponse(prompt);
        console.log('Processed Transcript:\n', data);
        if (!data || data.length === 0) {
          console.error('No data returned from OpenAI API');
          return;
        }
        const parsed = JSON.parse(data);
        setStructuredData(parsed);
        const { nodes: newNodes, edges: newEdges } = convertToFlow(parsed);
        setNodes(newNodes);
        setEdges(newEdges);
      };
      ProcessTranscript();
    }
    catch (error) {
      console.error('Error structurelizing transcript:', error);
    }
  }, [transcript]);

  const handleNodeClick = (event, node) => {
    if (node?.data?.transcript) {
      setSelectedTranscript(node.data.transcript);
      setOpen(true);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', position: 'relative' }}>
      {/* Gradient Stripe with Logo */}
      <Box
        sx={{
          height: '50px', // Adjust height as needed
          background: 'linear-gradient(to right,rgb(133, 62, 208),rgb(53, 109, 207))', // Gradient
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center', // Center logo horizontally
          padding: '0 20px', // Add some padding
          flex: 1,
          position: 'relative'
        }}
      >
        <img
          src="src/assets/MindEcho.svg" // Replace with your logo path
          alt="Logo"
          style={{ height: '80px', width: '200px' }} // Adjust logo size
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', flexGrow: 1 }}>
        {/* Input Keywords Section */}
        <Box sx={{ flex: 1}}>
          <InputKeywords transcript={transcript} />
        </Box>

        {/* Map Content */}
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 2 }}>
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
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
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
          {/* Transcript Section */}
          <Transcript setTime={setTime} setTranscript={setTranscript} />
        </Box>
      </Box>
    </Box>
  );
};

export default MindMap;