import React, { useState, useEffect } from 'react';
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Box } from '@mui/material';
import InputKeywords from './InputKeywords';
import Transcript from './Transcript';
import jsonData from '../data/nodesAndEdges.json';

const MindMap = () => {
  const [nodes, setNodes] = useState([
    { id: '1', data: { label: 'Root Node' }, position: { x: 250, y: 5 } },
  ]);
  const [edges, setEdges] = useState([]);
  const [jsonIndex, setJsonIndex] = useState(0);

  // Spacebar handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault(); // prevent scroll
        if (jsonIndex < jsonData.length) {
          const { node, edge } = jsonData[jsonIndex];
          setNodes((prev) => [...prev, node]);
          setEdges((prev) => [...prev, edge]);
          setJsonIndex((prev) => prev + 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown); // Cleanup
  }, [jsonIndex]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Box sx={{ display: 'flex', height: '80vh' }}>
        <InputKeywords />
        <Box sx={{ flex: 1, position: 'relative' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
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
      
      <Transcript />
    </Box>
  );
};

export default MindMap;
