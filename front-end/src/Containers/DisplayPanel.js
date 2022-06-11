import * as React from "react";
import Typography from "@mui/material/Typography";

export default function DisplayPanel(props) {
  const { price } = props;
  return (
    <Typography gutterBottom color="common.black">
      Option Price: {price}
    </Typography>
  );
}
