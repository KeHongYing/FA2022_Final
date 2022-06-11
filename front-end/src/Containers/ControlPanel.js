import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import PrettoSlider from "../Components/PrettoSlider";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function ControlPanel(props) {
  const {
    spotPrice,
    setSpotPrice,
    strikePrice,
    setStrikePrice,
    interestRate,
    setInterestRate,
    volatility,
    setVolatility,
    matureTime,
    setMatureTime,
    periods,
    setPeriods,
    optionType,
    setOptionType,
    optionStyle,
    setOptionStyle,
  } = props;

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
        <FormControl sx={{ m: 1, minWidth: 150 }}>
          <InputLabel id="option-type-select-label">Option Type</InputLabel>
          <Select
            labelId="option-type-select-label"
            id="option-type-simple-select"
            value={optionType}
            label="Option Type"
            onChange={(event) => {
              setOptionType(event.target.value);
            }}
          >
            <MenuItem value="put">Put</MenuItem>
            <MenuItem value="call">Call</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 150 }}>
          <InputLabel id="option-style-select-label">Option Style</InputLabel>
          <Select
            labelId="option-style-select-label"
            id="option-style-simple-select"
            value={optionStyle}
            label="Option Style"
            onChange={(event) => {
              setOptionStyle(event.target.value);
            }}
          >
            <MenuItem value="american">American</MenuItem>
            <MenuItem value="europe">Europe</MenuItem>
            <MenuItem value="bermuda">Bermuda</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div>
        <TextField
          id="spotPriceInput"
          label="Spot Price"
          defaultValue={spotPrice}
          helperText="Spot Price"
          onChange={(event) => {
            setSpotPrice(event.target.value);
          }}
        />
        <TextField
          id="strikePriceInput"
          label="Strike Price"
          defaultValue={strikePrice}
          helperText="Strike Price"
          onChange={(event) => {
            setStrikePrice(event.target.value);
          }}
        />
      </div>
      <div>
        <PrettoSlider name="Annual Interest Rate" value={interestRate} setValue={setInterestRate}/>
        <PrettoSlider name="Volitility" value={volatility} setValue={setVolatility}/>
      </div>
      <div>
        <TextField
          id="matureTimeInput"
          label="Mature Time"
          defaultValue={matureTime}
          helperText="Mature Time"
          onChange={(event) => {
            setMatureTime(event.target.value);
          }}
        />
        <TextField
          id="periodsPerDayInput"
          label="Periods per Day"
          defaultValue={periods}
          helperText="Periods per Day"
          onChange={(event) => {
            setPeriods(event.target.value);
          }}
        />
      </div>
    </Box>
  );
}
