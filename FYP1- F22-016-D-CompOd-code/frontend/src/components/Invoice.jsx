import React from "react";

import { Button, CircularProgress } from "@mui/material";
import { Stack } from "@mui/system";
import Typography from "@mui/material/Typography";

import SummaryReportIcon from "@mui/icons-material/Description";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { useNavigate } from "react-router-dom";


export default function Invoice({invoiceMedicine}) {
    const navigate = useNavigate();
    console.log("Invoice: ", invoiceMedicine);

    const [invoice, setInvoice] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [rloading, setRLoading] = React.useState(false);

  const handleClick = () => {
    setLoading(true);
    // Wait for 5 seconds
    setTimeout(() => {
        setInvoice(invoiceMedicine);
        setLoading(false);
        setRLoading(true);
    }, 5000);
  };

  const viewReport = () => {
    navigate("/InvoicePDF", { state: { data: invoiceMedicine } });
  };


  return (
    <div>
      <Stack direction="row" spacing={1}>
        <Typography variant="h5" component="div" gutterBottom>
          Generate Invoice
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          startIcon={loading ? <CircularProgress size={20} /> : <SummaryReportIcon />}
          style={{ marginLeft: "21rem" }}
          onClick={handleClick}
          disabled={invoiceMedicine.length === 0}
        >
          Generate
        </Button>
        <Button
          id="viewReport"
          variant="outlined"
          size="large"
          sx={{ marginTop: "20px" }}
          startIcon={<VisibilityIcon />}
          disabled={rloading? false : true}
          onClick={viewReport}
        >
          View Report
        </Button>
      </Stack>
    </div>
  );
}