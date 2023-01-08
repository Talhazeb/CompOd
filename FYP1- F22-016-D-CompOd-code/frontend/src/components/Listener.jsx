import React, { useState, useEffect, useRef } from "react";
import { ReactMic } from "react-mic";
import axios from "axios";
import { PulseLoader } from "react-spinners";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";

import TranscribeOutput from "../services/TranscribeOutput";

const root = {
  display: "flex",
  flex: "1",
  margin: "100px 0px 100px 0px",
  alignItems: "center",
  textAlign: "center",
  flexDirection: "column",
};

const title = {
  marginBottom: "30px",
};

const settingsSection = {
  marginBottom: "20px",
  display: "flex",
  width: "100%",
};

const buttonsSection = {
  marginBottom: "40px",
};

const recordIllustration = {
  width: "100px",
};

export default function Listener({ getData, getTranscription }) {
  const [transcribedData, setTranscribedData] = useState([]);
  const [interimTranscribedData] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [selectedModel, setSelectedModel] = useState(1);
  const [transcribeTimeout, setTranscribeTimout] = useState(5);
  const [stopTranscriptionSession, setStopTranscriptionSession] =
    useState(false);

  const intervalRef = useRef(null);

  const stopTranscriptionSessionRef = useRef(stopTranscriptionSession);
  stopTranscriptionSessionRef.current = stopTranscriptionSession;

  const selectedLangRef = useRef(selectedLanguage);
  selectedLangRef.current = selectedLanguage;

  const selectedModelRef = useRef(selectedModel);
  selectedModelRef.current = selectedModel;

  const modelOptions = ["tiny", "base", "small", "medium", "large"];

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  function handleTranscribeTimeoutChange(newTimeout) {
    setTranscribeTimout(newTimeout);
  }

  function startRecording() {
    setStopTranscriptionSession(false);
    setIsRecording(true);
    intervalRef.current = setInterval(
      transcribeInterim,
      transcribeTimeout * 1000
    );
  }

  function stopRecording() {
    clearInterval(intervalRef.current);
    setStopTranscriptionSession(true);
    setIsRecording(false);
    setIsTranscribing(false);
  }

  function onStop(recordedBlob) {
    transcribeRecording(recordedBlob);
    setIsTranscribing(true);
  }

  function transcribeInterim() {
    clearInterval(intervalRef.current);
    setIsRecording(false);
  }

  function onData(recordedBlob) {
    // console.log('chunk of real-time data is: ', recordedBlob);
  }

  function transcribeRecording(recordedBlob) {
    const headers = {
      "content-type": "multipart/form-data",
    };
    const formData = new FormData();
    formData.append("language", selectedLangRef.current);
    formData.append("model_size", modelOptions[selectedModelRef.current]);
    formData.append("audio_data", recordedBlob.blob, "temp_recording");
    // Get user media device

    axios
      .post("http://68.178.200.63:9000/transcribe", formData, { headers })
      .then((res) => {
        setTranscribedData((oldData) => [
          ...oldData,
          res.data["transcription"],
        ]);
        console.log("Report: ", res.data["report"]);
        getData(res.data["report"]);
        getTranscription(res.data["transcription"]);

        // Transfer res.data['report'] to Sidebarnav.jsx for mapping and displaying the report

        setIsTranscribing(false);
        intervalRef.current = setInterval(
          transcribeInterim,
          transcribeTimeout * 1000
        );
      });

    if (!stopTranscriptionSessionRef.current) {
      setIsRecording(true);
    }
  }

  return (
    <div style={root}>
      <div style={title}>
        <Typography
          variant="h4"
          // Make the title in box with gradient background and white text color
          style={{
            // Gradient from Dark Blue to Light Blue
            background: "linear-gradient(90deg, #0D1B2A 0%, #1E88E5 100%)",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          Live Transcription
        </Typography>
      </div>
      <div style={settingsSection}>
        {/* <SettingsSections disabled={isTranscribing || isRecording} possibleLanguages={supportedLanguages} selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage} modelOptions={modelOptions} selectedModel={selectedModel} onModelChange={setSelectedModel}
          transcribeTimeout={transcribeTimeout} onTranscribeTiemoutChanged={handleTranscribeTimeoutChange} /> */}
      </div>
      <div style={buttonsSection}>
        {!isRecording && !isTranscribing && (
          <Button
            onClick={startRecording}
            variant="outlined"
            startIcon={<MicIcon />}
            size="large"
          >
            Start
          </Button>
        )}
        {(isRecording || isTranscribing) && (
          <Button
            onClick={stopRecording}
            variant="outlined"
            color="error"
            disabled={stopTranscriptionSessionRef.current}
            endIcon={<MicOffIcon />}
          >
            Stop
          </Button>
        )}
      </div>

      <div className="recordIllustration">
        <ReactMic
          record={isRecording}
          className="sound-wave"
          onStop={onStop}
          onData={onData}
          strokeColor="#3b9698"
          backgroundColor="#fafbfc"
        />
      </div>

      <div>
        <TranscribeOutput
          transcribedText={transcribedData}
          interimTranscribedText={interimTranscribedData}
        />
        <PulseLoader
          sizeUnit={"px"}
          size={20}
          color="green"
          loading={isTranscribing}
        />
      </div>
    </div>
  );
}
