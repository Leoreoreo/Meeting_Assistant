import React, { useState, useEffect, use } from 'react';
import { ReactFlow, Background, Controls, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Box } from '@mui/material';
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
  const [nodes, setNodes] = useState([
    { id: '1', data: { label: 'Root Node' }, position: { x: 50, y: 5 }, type: 'rightHandle' },
  ]);
  const [edges, setEdges] = useState([]);
  const [jsonIndex, setJsonIndex] = useState(0);
  const [transcript, setTranscript] = useState(""); // State to hold transcript content
  const [time, setTime] = useState(0); // State to hold time

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
  
    setNodes([
      {
        id: 'root',
        data: { label: 'Root Node' },
        position: { x: 50, y: 5 },
        type: 'rightHandle'
      },
      ...newNodes
    ]);
  
    setEdges(newEdges);
  }, [time]);

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

      <Transcript setTime={setTime} setTranscript={setTranscript} />
    </Box>
  );
};

export default MindMap;