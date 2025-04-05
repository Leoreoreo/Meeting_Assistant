import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { getOpenAIResponse } from '../data/callOpenai';

const PredictedOutput = ({ keywords, transcript, predict, setPredict }) => {
  const [prediction, setPrediction] = useState(' ');
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
        const prompt = `
            Assume you are a user currently in a meeting. 
            <Meeting transcript>: 
            ${transcript}

            You are to express your views based on the transcript above and the keywords provided.
            <Keywords>: 
            ${keywords.join(', ')}
            
            Note: 
            1. Use the FIRST PERSON to express your views. 
            2. Limit your output within 2-3 sentences.
            3. Focus on more recent transcript lines.
            4. Make sure your output is relevant to the keywords provided.
        `;
        // console.log('Prompt:', prompt);
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
    setPredict(false); // Reset 'predict' state after prediction is made
  }, [keywords, transcript, predict]); // Re-run the request when keywords, transcript, or predict changes

  useEffect(() => {
    console.log('Prediction:', prediction);
  }, [prediction]); // Log the prediction whenever it changes

//   useEffect(() => {
//     if (predict) {
//       // Reset 'predict' state after prediction is made
//       setPrediction('');
//     }
//   }, [predict]);

  // Function to speak the prediction text
  const handleSpeak = () => {
    if (prediction) {
      const speech = new SpeechSynthesisUtterance(prediction);
      speech.lang = 'en-US';
      speech.rate = 2;
      window.speechSynthesis.speak(speech);
    }
  };

  return (
    <Box sx={{ padding: 0, marginTop: 2 }}>
      {error && <Typography color="error">{error}</Typography>}
      {prediction && (
        <Paper
            sx={{
            display: 'flex',
            flexDirection: 'column',
            //justifyContent: 'center', // Remove or adjust if not needed
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingX: 2,
            backgroundColor: 'rgb(205, 163, 250)',
            height: '50vh', // Keep the fixed height
            overflowY: 'auto', // Keep the overflow for scrolling
            textAlign: 'center',
            }}
        >
            <Button
                variant="contained"
                color="secondary"
                onClick={handleSpeak}
                sx={{
                    backgroundColor: 'rgb(175, 116, 239)',
                    color: 'white',
                    margin: 1,
                    flexShrink: 0, // Prevent button from shrinking
                    '&:hover': {
                    backgroundColor: 'rgb(133, 62, 208)',
                    },
                }}
            >
                Speak
            </Button>
            {loading && <Typography color='white'>Loading...</Typography>}
            <Typography
            color="white"
            sx={{
                flexGrow: 1, // Allow text to grow
                overflowY: 'auto', // Enable scrolling for text
            }}
            >
            {prediction}
            </Typography>
        </Paper>
        )}
    </Box>
  );
};

export default PredictedOutput;
