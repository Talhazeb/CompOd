import React from "react";
import Typography from '@mui/material/Typography';

const root = {
    maxWidth: '800px',
    display: 'flex'
}

const outputText = {
    marginLeft: '8px',
    color: '#ef395a',
}

export default function TranscribeOutput({classes, transcribedText, interimTranscribedText}){
  if (transcribedText.length === 0 && interimTranscribedText.length === 0) {
    return <Typography variant="body1">...</Typography>;
  }

  return (
    <div style={root}>
      <Typography variant="body1">{transcribedText}</Typography>
      <Typography style={outputText} variant="body1">{interimTranscribedText}</Typography>
    </div>
  )
}