import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Typography, Button, Paper } from '@mui/material';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { transcriptData } from '../data/videotranscript';

const Transcript = ({ setTime, setTranscript }) => {
  const {
    transcript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [videoSrc, setVideoSrc] = useState(null);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const videoRef = useRef(null);
  const transcriptRef = useRef(null);  // Reference to the TextField for scrolling

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoSrc(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      SpeechRecognition.startListening({ continuous: true });
      console.log('Listening for speech...');
    };

    const handlePause = () => {
      SpeechRecognition.stopListening();
      console.log('Stopped listening for speech.');
    };

    const handleTimeUpdate = () => {
      const currentTime = Math.floor(video.currentTime);
      setTime(currentTime);
      const visibleTranscript = transcriptData
        .filter(line => line.time <= currentTime)
        .map(line => line.text)
        .join(' ')
        .trim();
      setCurrentTranscript(visibleTranscript);
      setTranscript(visibleTranscript);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [videoSrc]);

  useEffect(() => {
    // Scroll to the bottom of the TextField when the transcript updates
    const textField = transcriptRef.current;
    if (textField) {
      textField.scrollTop = textField.scrollHeight;
    }
  }, [currentTranscript]); // Trigger scroll when the transcript changes

  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser does not support speech recognition.</span>;
  }

  return (
    <Box sx={{ display: 'flex', height: "30vh", flexDirection: 'row', padding: 2, borderTop: '1px solid #ddd', backgroundColor: 'white', overflow: 'hidden' }}>
      
      {/* Video Section on the Left */}
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '30%', padding: 1, backgroundColor: 'white', overflow: 'hidden', height: '80%' }}>
        <Paper
          sx={{
            display: 'flex',
            flexDirection: 'column', // Stack elements vertically
            justifyContent: 'center',
            alignItems: 'center',
            padding: 2,
            backgroundColor: 'rgb(162, 191, 242)',
            height: '20vh', // Optional: Adjust height as needed
            overflowY: 'auto',
          }}
        >

          {!videoSrc && (
            <>
              <input
                accept="video/*"
                type="file"
                id="upload-video"
                onChange={handleVideoUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="upload-video">
                <Button
                  variant="contained"
                  component="span"
                  sx={{
                    backgroundColor: 'rgb(175, 116, 239)',
                    color: 'white',
                    fontSize: '1rem',
                    '&:hover': {
                      backgroundColor: 'rgb(133, 62, 208)',
                    },
                  }}
                >
                  Upload Video
                </Button>
              </label>
            </>
          )}

          {videoSrc && (
            <video ref={videoRef} controls width="100%" style={{ height: '100%', objectFit: 'contain' }}>
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </Paper>
      </Box>
  
      {/* Transcript Section on the Right */}
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '70%', padding: 1, backgroundColor: 'white', height: '80%' }}>
        <Paper sx={{ padding: 2, backgroundColor: 'rgb(162, 191, 242)', height: '20vh' }}>
          <Typography variant="h4" gutterBottom sx={{ color: 'white', textAlign: 'center' }}>Transcript</Typography>
          <TextField
            value={currentTranscript}
            multiline
            rows={2.75}  // Shrink the height of the transcript field
            fullWidth
            variant="outlined"
            sx={{
              backgroundColor: 'rgb(174, 204, 255)',
              color: 'black',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgb(253, 253, 253)',
                },
              },
              '& .MuiInputBase-input': {
                color: 'black',
              },
            }}
            inputRef={transcriptRef}  // Reference to scroll the TextField
          />
        </Paper>
      </Box>
  
    </Box>
  );
  
};

export default Transcript;
