import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import PrettoSlider from "../Components/PrettoSlider";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import MonteCaro from "../Components/MonteCaro";

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
    setPrice,
    exerciseDate,
    setExerciseDate,
    setTreePath,
    modelType,
    setModelType,
    K,
    setK,
    N,
    setN,
    pricingApi,
  } = props;

  const [isBermuda, setIsBermuda] = React.useState(false);
  const [isInvalidSpotPrice, setIsInvalidSpotPrice] = React.useState(false);
  const [isInvalidStrikePrice, setIsInvalidStrikePrice] = React.useState(false);
  const [isInvalidMatureDate, setIsInvalidMatureDate] = React.useState(false);
  const [isInvalidPeriods, setIsInvalidPeriods] = React.useState(false);
  const [isInvalidExercise, setIsInvalidExercise] = React.useState(false);

  function modifyPrice() {
    if (
      !(
        isInvalidSpotPrice ||
        isInvalidStrikePrice ||
        isInvalidMatureDate ||
        isInvalidPeriods ||
        isInvalidExercise
      )
    ) {
      pricingApi.calculate(
        modelType,
        optionType,
        optionStyle,
        spotPrice,
        strikePrice,
        interestRate,
        volatility,
        matureTime,
        periods,
        K,
        N,
        exerciseDate,
        (result, prices) => {
          setPrice(result > 0 ? result : "Invalid");
          setTreePath(prices);
        }
      );
    }
  }

  useEffect(() => {
    modifyPrice();
  }, [
    optionType,
    optionStyle,
    spotPrice,
    strikePrice,
    interestRate,
    volatility,
    matureTime,
    periods,
    exerciseDate,
    K,
    N,
    modelType,
  ]);

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
          <InputLabel id="model-type-select-label">Option Type</InputLabel>
          <Select
            labelId="model-type-select-label"
            id="model-type-simple-select"
            value={modelType}
            label="Model Type"
            onChange={(event) => {
              setModelType(event.target.value);
            }}
          >
            <MenuItem value="binomial">Binomial</MenuItem>
            <MenuItem value="mc">Monte-Carlo</MenuItem>
          </Select>
        </FormControl>
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
              setIsBermuda(event.target.value === "bermuda");
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
          error={isInvalidSpotPrice}
          type="number"
          id="spotPriceInput"
          label="Spot Price"
          defaultValue={spotPrice}
          helperText={isInvalidSpotPrice ? "Not Positive Number" : " "}
          onChange={(event) => {
            console.log(event.target.value);
            setSpotPrice(event.target.value);
            setIsInvalidSpotPrice(
              event.target.value < 0 || event.target.value === ""
            );
          }}
        />
        <TextField
          error={isInvalidStrikePrice}
          type="number"
          id="strikePriceInput"
          label="Strike Price"
          defaultValue={strikePrice}
          helperText={isInvalidStrikePrice ? "Not Positive Number" : " "}
          onChange={(event) => {
            setStrikePrice(event.target.value);
            setIsInvalidStrikePrice(
              event.target.value < 0 || event.target.value === ""
            );
          }}
        />
      </div>
      <div>
        <PrettoSlider
          name="Annual Interest Rate"
          value={interestRate}
          setValue={setInterestRate}
        />
        <PrettoSlider
          name="Volitility"
          value={volatility}
          setValue={setVolatility}
        />
      </div>
      <div>
        <TextField
          error={isInvalidMatureDate}
          type="number"
          id="matureTimeInput"
          label="Mature Time"
          defaultValue={matureTime}
          helperText={isInvalidMatureDate ? "Not Natural Number" : " "}
          onChange={(event) => {
            setMatureTime(event.target.value);
            setIsInvalidMatureDate(
              event.target.value < 0 ||
                event.target.value.includes(".") ||
                event.target.value === ""
            );
          }}
        />
        <TextField
          error={isInvalidPeriods}
          type="number"
          id="periodsPerDayInput"
          label="Periods per Day"
          defaultValue={periods}
          helperText={isInvalidPeriods ? "Not Natural Number" : " "}
          onChange={(event) => {
            setPeriods(event.target.value);
            setIsInvalidPeriods(
              event.target.value < 0 ||
                event.target.value.includes(".") ||
                event.target.value === ""
            );
          }}
        />
      </div>
      <div>
        <TextField
          disabled={!isBermuda}
          error={isInvalidExercise}
          id="exerciseDateInput"
          label="Exercise Date"
          defaultValue=""
          helperText={isInvalidExercise ? "Invalid Format" : "e.g. 10 20 30 40"}
          onChange={(event) => {
            const v = event.target.value.trim();
            setExerciseDate(event.target.value);
            setIsInvalidExercise(
              v !== "" &&
                !v
                  .split(" ")
                  .every(
                    (n) => n !== "" && !isNaN(n) && n > 0 && !n.includes(".")
                  )
            );
          }}
        />
      </div>
      {/* <div>
        <Button
          variant="contained"
          disabled={
            isInvalidSpotPrice ||
            isInvalidStrikePrice ||
            isInvalidMatureDate ||
            isInvalidPeriods ||
            isInvalidExercise
          }
          onClick={() => {
            modifyPrice();
          }}
        >
          Pricing
        </Button>
      </div> */}
      <div>
        <MonteCaro
          setK={setK}
          modelType={modelType}
          N={N}
          setN={setN}
        ></MonteCaro>
      </div>
    </Box>
  );
}
