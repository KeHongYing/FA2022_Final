import React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

export default function MonteCaro(props) {
  const { setK, modelType, N, setN } = props;
  const [tmpK, setTmpK] = React.useState(0);
  const [isInvalidN, setIsInvalidN] = React.useState(false);

  if (modelType === "mc") {
    return (
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <Typography gutterBottom color="common.black">
          Vasicek
        </Typography>
        <Typography gutterBottom color="common.black">
          K: {tmpK}%
        </Typography>
        <Slider
          disabled={modelType !== "mc"}
          aria-label="K-Slider"
          valueLabelDisplay="auto"
          value={tmpK}
          onChange={(event) => {
            setTmpK(event.target.value);
          }}
          onChangeCommitted={(event) => {
            setK(tmpK);
          }}
        />
        <TextField
          error={isInvalidN}
          type="number"
          id="mcNInput"
          label="N"
          defaultValue={N}
          helperText={isInvalidN ? "Not Natural Number" : " "}
          onChange={(event) => {
            setN(event.target.value);
            setIsInvalidN(
              event.target.value <= 0 ||
                event.target.value.includes(".") ||
                event.target.value === ""
            );
          }}
        />
      </Box>
    );
  }
}
