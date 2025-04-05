// src/components/PredictedOutput.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Paper } from '@mui/material';
import { getOpenAIResponse } from '../data/callOpenai';


const PredictedOutput = ({ keywords, transcript, predict }) => {
  const [prediction, setPrediction] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!predict || keywords.length === 0 || !transcript) {
      return; // Do not fetch if prediction is not triggered or there's no input
    }

    const fetchPrediction = async () => {
      setLoading(true);
      setError(null);

      try {
        // Use environment variable to access the API key
        const prompt = `Given the following keywords: ${keywords.join(', ')} and the transcript of the meeting: "${transcript}", what is the user's intention?`;
        console.log('Prompt:', prompt); // Log the prompt for debugging
        const data = await getOpenAIResponse(prompt);
        setPrediction(data);
      } catch (err) {
        setError('Error fetching the prediction');
        console.error('OpenAI API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [keywords, transcript, predict]); // Re-run the request when keywords, transcript, or predict changes

  useEffect(() => {
    console.log('Prediction:', prediction);
    }, [prediction]); // Log the prediction whenever it changes
  useEffect(() => {
    if (predict) {
      // Reset 'predict' state after prediction is made
      setPrediction('');
    }
  }, [predict]);

  return (
    <Box sx={{ padding: 2, marginTop: 2 }}>
        {loading && <Typography>Loading...</Typography>}
        {error && <Typography color="error">{error}</Typography>}
        {prediction && (
            <Paper sx={{ padding: 2, backgroundColor: '#f5f5f5', height: '20vh', overflowY: 'auto' }}>
            <Typography variant="h6">Predicted User Intention:</Typography>
            <Typography>{prediction}</Typography>
            </Paper>
        )}
    </Box>
  );
};

export default PredictedOutput;
