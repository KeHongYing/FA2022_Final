import * as React from "react";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

export default function PrettoSlider(props) {
  const { name, value, setValue } = props;

  const [tmpVal, setTmpVal] = React.useState(value);

  return (
    <div>
      <Typography gutterBottom color="common.black">
        {name}: {value}%
      </Typography>
      <Slider
        aria-label={name}
        value={tmpVal}
        onChange={(event) => {
          setTmpVal(event.target.value);
        }}
        onChangeCommitted={(event) => {
          setValue(tmpVal);
        }}
        valueLabelDisplay="auto"
      />
    </div>
  );
}
