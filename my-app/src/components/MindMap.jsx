import React, { useState, useEffect } from 'react';
import { ReactFlow, Background, Controls, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Box } from '@mui/material';
import InputKeywords from './InputKeywords';
import Transcript from './Transcript';
import jsonData from '../data/nodesAndEdges.json';
// import useVideoTime from './useVideoTime.js';
// const currentTime = useVideoTime(videoRef); 

  
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
  const [nodes, setNodes] = useState([
    { id: '1', data: { label: 'Root Node' }, position: { x: 50, y: 5 }, type: 'rightHandle' },
  ]);
  const [edges, setEdges] = useState([]);
  const [jsonIndex, setJsonIndex] = useState(0);
  const [transcript, setTranscript] = useState(""); // State to hold transcript content

  // Spacebar handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault(); // prevent scroll
        if (jsonIndex < jsonData.length) {
          const { node, edge } = jsonData[jsonIndex];
          const typedNode = { ...node, type: 'rightHandle' }; // assign custom type
          setNodes((prev) => [...prev, typedNode]);
          setEdges((prev) => [...prev, edge]);
          setJsonIndex((prev) => prev + 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown); // Cleanup
  }, [jsonIndex]);
  // // time handler
  // useEffect(() => {
  //   const addNodeAtTime = () => {
  //     if (jsonIndex < jsonData.length) {
  //       const { node, edge, time } = jsonData[jsonIndex];

  //       if (time <= currentTime) {
  //           const typedNode = { ...node, type: 'rightHandle' }; // Assign custom type
  //           setNodes((prev) => [...prev, typedNode]);
  //           setEdges((prev) => [...prev, edge]);
  //           setJsonIndex((prev) => prev + 1);
  //       }
  //     }
  //   };

  //   // Every time the time-based condition is met, add a new node
  //   const interval = setInterval(() => {
  //     addNodeAtTime();
  //   }, 1000); // Check every second for new nodes to add

  //   return () => clearInterval(interval); // Cleanup interval on component unmount
  // }, [jsonIndex]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Box sx={{ display: 'flex', height: '80vh' }}>
        <InputKeywords transcript={transcript} />
        <Box sx={{ flex: 1, position: 'relative' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            nodeTypes={nodeTypes}
            style={{
              backgroundColor: 'white',
              color: 'black',
            }}
          >
            <Background color="#ddd" gap={16} />
            <Controls />
          </ReactFlow>
        </Box>
      </Box>

      <Transcript setTranscript={setTranscript} />
    </Box>
  );
};

export default MindMap;