import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import PrettoSlider from "../Components/PrettoSlider";

export default function ControlPanel() {
  const [interestRate, setInterestRate] = React.useState(3);
  const [volitility, setValitility] = React.useState(30);

  const handleChangeInterestRate = (event, newValue) => {
    setInterestRate(newValue);
  };
  const handleChangeVolitility = (event, newValue) => {
    setValitility(newValue);
  };

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
        <PrettoSlider
          aria-label="Annual Interest Rate"
          value={interestRate}
          onChange={handleChangeInterestRate}
          valueLabelDisplay="auto"
        />
        <PrettoSlider
          aria-label="Volitility"
          value={volitility}
          onChange={handleChangeVolitility}
          valueLabelDisplay="auto"
        />
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
