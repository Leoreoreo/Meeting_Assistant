// src/components/InputKeywords.jsx
import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Chip } from '@mui/material';

const InputKeywords = ({ transcript }) => {
  // State to store the user's input
  const [input, setInput] = useState('');
  
  // State to store the list of keywords entered by the user
  const [keywords, setKeywords] = useState([]);

  // Handle input change
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // Handle 'Enter' key press to add keyword
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && input.trim() !== '') {
      setKeywords((prevKeywords) => [...prevKeywords, input.trim()]);
      setInput(''); // Clear the input field after adding
    }
  };

  useEffect(() => {
    console.log('Current Transcript:', transcript);
  }, [transcript]);  // Log whenever the transcript changes

  return (
    <Box sx={{ width: '300px', padding: 2, borderRight: '1px solid #ddd', backgroundColor: 'white'}}>
        <Typography variant="h6" gutterBottom sx={{ color: '#333' }}>
        Express yourself with keywords!
        </Typography>

      {/* TextField for input */}
      <TextField
        label="Input Keywords"
        placeholder="Type keywords to express your thoughts!"
        fullWidth
        multiline
        rows={2}  // Shrinking the height of the input block
        value={input}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress} // Detect "Enter" key press
        sx={{
          marginBottom: 2,
          backgroundColor: '#fff', // Make the input field white for contrast
          borderRadius: 1,
          boxShadow: 1,
        }}
      />
      
      {/* Display keywords in a horizontal row with scroll */}
      <Box sx={{
        marginTop: 2,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1, // Space between keywords
        overflowX: 'auto', // Horizontal scroll when needed
        paddingBottom: 2,
      }}>
        {keywords.map((keyword, index) => (
          <Chip
            key={index}
            label={keyword}
            variant="outlined"
            sx={{
              backgroundColor: '#e0e0e0',
              color: '#333',
              border: '1px solid #ccc',
              borderRadius: '16px',
              padding: '6px 12px',
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default InputKeywords;
