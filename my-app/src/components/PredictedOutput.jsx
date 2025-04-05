import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { getOpenAIResponse } from '../data/callOpenai';

const PredictedOutput = ({ keywords, transcript, predict }) => {
  const [prediction, setPrediction] = useState('dummy');
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
        const prompt = `Provided with the following keywords given by the user: ${keywords.join(', ')} and the transcript of the meeting: "${transcript}", imagine you are the user, use first person to express your views. Limit your output within 3 sentences.`;
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
      speech.lang = 'en-US';  // You can change the language here if needed
      window.speechSynthesis.speak(speech);
    }
  };

  return (
    <Box sx={{ padding: 0, marginTop: 2 }}>
      {loading && <Typography color='black'>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      {prediction && (
        <Paper 
            sx={{
            display: 'flex',
            flexDirection: 'column', // Stack the content vertically
            justifyContent: 'center', // Center content vertically
            alignItems: 'center', // Center content horizontally
            backgroundColor: 'rgb(205, 163, 250)',
            maxHeight: '15vh',
            overflowY: 'auto',
            textAlign: 'center', // Ensure text is centered inside the Box
            }}
        >
            <Button
                variant="contained"
                color="secondary"
                onClick={handleSpeak}
                sx={{
                    display: 'flex',
                    backgroundColor: 'rgb(175, 116, 239)',
                    color: 'white',
                    marginTop: 12,
                    '&:hover': {
                        backgroundColor: 'rgb(133, 62, 208)',
                    },
                }}
                >
                Speak
            </Button>
            
            <Typography color='white' sx={{ marginTop: 1 }}>
                {prediction}
            </Typography>
        </Paper>
    )}
    </Box>
  );
};

export default PredictedOutput;
