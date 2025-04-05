// src/components/InputKeywords.jsx
import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Chip, Button, Paper } from '@mui/material';
import PredictedOutput from './PredictedOutput'; // Import the new component

const InputKeywords = ({ transcript }) => {
  // State to store the user's input
  const [input, setInput] = useState('');
  
  // State to store the list of keywords entered by the user
  const [keywords, setKeywords] = useState([]);
  
  // State to control when prediction should be triggered
  const [predict, setPredict] = useState(false);

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

  // Trigger prediction on button click
  const handlePredictClick = () => {
    setPredict(true); // Set to true to trigger prediction
  };

  // useEffect(() => {
  //   console.log('Current Transcript:', transcript);
  // }, [transcript]);  // Log whenever the transcript changes

  return (
    <Box sx={{ width: '300px', padding: 2, borderRight: '1px solid #ddd', backgroundColor: 'white' }}>
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
      <Paper
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: 2,
          backgroundColor: '#f5f5f5',
          height: '15vh',  // Fixed height
          overflowY: 'auto',  // Vertical scroll when the content overflows
          borderRadius: '8px',  // Optional: rounded corners for Paper
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1, // Space between keywords
            overflowX: 'auto', // Horizontal scroll when needed
            paddingBottom: 2,
          }}
        >
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
      </Paper>


      {/* Button to trigger prediction */}
      <Box sx={{ marginTop: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePredictClick}
          sx={{
            backgroundColor: 'black',
            color: 'white',
            fontSize: '1rem',
            '&:hover': {
              backgroundColor: '#555', // grey-ish
            },
          }}
          disabled={keywords.length === 0} // Disable if no keywords entered
        >
          Predict
        </Button>
      </Box>

      {/* Predicted Output below the keywords */}
      <PredictedOutput keywords={keywords} transcript={transcript} predict={predict} />
    </Box>
  );
};

export default InputKeywords;
