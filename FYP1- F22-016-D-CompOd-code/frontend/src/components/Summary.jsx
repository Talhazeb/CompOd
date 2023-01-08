import React from "react";

import { Button, CircularProgress } from "@mui/material";
import { Stack } from "@mui/system";
import Typography from "@mui/material/Typography";

import SummaryReportIcon from "@mui/icons-material/Description";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { useNavigate } from "react-router-dom";

export default function Summary({ data }) {
  const navigate = useNavigate();

  const [summary, setSummary] = React.useState("");

  const [loading, setLoading] = React.useState(false);

  const handleClick = () => {
    setLoading(true);
    fetch("http://localhost:5000/summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: data,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.answer);
        setSummary(data.answer);
        setLoading(false);
        // navigate("/viewPDF", { state: { data: data.answer } });
      });
  };

  const viewReport = () => {
    navigate("/viewPDF", { state: { data: summary } });
  };

  return (
    <div>
      <Stack direction="row" spacing={1}>
        <Typography variant="h5" component="div" gutterBottom>
          Summarize Report
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          startIcon={loading ? <CircularProgress size={20} /> : <SummaryReportIcon />}
          style={{ marginLeft: "20rem" }}
          onClick={handleClick}
          disabled={data.length === 0}
        >
          Generate
        </Button>
        <Button
          id="viewReport"
          variant="outlined"
          size="large"
          sx={{ marginTop: "20px" }}
          startIcon={<VisibilityIcon />}
          disabled={summary.length === 0}
          onClick={viewReport}
        >
          View Report
        </Button>
      </Stack>
    </div>
  );
}
