import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { transcriptData } from '../videotranscript';

const Transcript = () => {
  const {
    transcript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [videoSrc, setVideoSrc] = useState(null);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const videoRef = useRef(null);

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
      const visibleTranscript = transcriptData
        .filter(line => line.time <= currentTime)
        .map(line => line.text)
        .join(' ')
        .trim();
      setCurrentTranscript(visibleTranscript);
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

  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser does not support speech recognition.</span>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', padding: 2, borderTop: '1px solid #ddd', backgroundColor: 'white' }}>
      <Box sx={{ width: '50%', padding: 1, backgroundColor: 'white' }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'black' }}>Video Player</Typography>
        <input
          accept="video/*"
          type="file"
          onChange={handleVideoUpload}
          style={{ marginBottom: '10px', backgroundColor: 'white', border: '1px solid #ccc', padding: '8px' }}
        />
        {videoSrc && (
          <video ref={videoRef} controls width="100%">
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </Box>

      <Box sx={{ width: '50%', padding: 1, backgroundColor: 'white' }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'black' }}>Real-time Transcript</Typography>
        <TextField
          value={currentTranscript}
          multiline
          rows={12}
          fullWidth
          variant="outlined"
          InputProps={{
            readOnly: true,
          }}
          sx={{
            backgroundColor: 'white',
            color: 'black',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#ddd',
              },
            },
            '& .MuiInputBase-input': {
              color: 'black',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Transcript;
