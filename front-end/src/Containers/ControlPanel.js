import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import PrettoSlider from "../Components/PrettoSlider";

export default function ControlPanel() {
  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          id="spotPriceInput"
          label="Spot Price"
          defaultValue="100"
          helperText="Spot Price"
        />
        <TextField
          id="strikePriceInput"
          label="Strike Price"
          defaultValue="100"
          helperText="Strike Price"
        />
      </div>
      <div>
        <PrettoSlider name="Annual Interest Rate" defaultValue={3} />
        <PrettoSlider name="Volitility" defaultValue={30} />
      </div>
      <div>
        <TextField
          id="matureTimeInput"
          label="Mature Time"
          defaultValue="60"
          helperText="Mature Time"
        />
        <TextField
          id="periodsPerDayInput"
          label="Periods per Day"
          defaultValue="5"
          helperText="Periods per Day"
        />
      </div>
    </Box>
  );
}
