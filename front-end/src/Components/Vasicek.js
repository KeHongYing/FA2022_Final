import React from "react";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

export default function Vasicek(props) {
  const { setK } = props;
  const [tmpK, setTmpK] = React.useState(0);
  const [checked, setChecked] = React.useState(false);

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <FormControlLabel
        value="end"
        control={
          <Checkbox
            checked={checked}
            onChange={(event, check) => {
              setChecked(check);
              setK(check ? tmpK : -1);
            }}
          />
        }
        label={
          <Typography gutterBottom color="common.black">
            Vasicek
          </Typography>
        }
        labelPlacement="end"
      />
      <Typography gutterBottom color="common.black">
        K: {tmpK}%
      </Typography>
      <Slider
        disabled={!checked}
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
    </Box>
  );
}
