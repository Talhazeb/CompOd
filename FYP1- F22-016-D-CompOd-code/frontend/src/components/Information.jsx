import React from "react";

import { TextField } from "@mui/material";
import Stack from "@mui/material/Stack";

export default function Information({ heading, cardData }) {
  const [data, setData] = React.useState(cardData);
  return (
    <div>
      <div>
        <Stack direction="row" spacing={2}>
          <TextField
            type="text"
            value={data}
            onChange={(e) => setData(e.target.value)}
            style={{
              width: "30rem",
              margin: "10px",
              backgroundColor: "#F5F5F5",
            }}
            InputProps={{ disableUnderline: true }}
            label={heading}
            variant="outlined"
          />
        </Stack>
      </div>
    </div>
  );
}
