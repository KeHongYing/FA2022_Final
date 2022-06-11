import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Fade from "@mui/material/Fade";
import ControlPanel from "./ControlPanel";
import DisplayPanel from "./DisplayPanel";
import PricingApi from "../Components/PricingApi";

function ScrollTop(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      "#back-to-top-anchor"
    );

    if (anchor) {
      anchor.scrollIntoView({
        block: "center",
      });
    }
  };

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Fade>
  );
}

ScrollTop.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default function Main(props) {
  const { title } = props;

  const [price, setPrice] = React.useState(100);
  const [spotPrice, setSpotPrice] = React.useState(100);
  const [strikePrice, setStrikePrice] = React.useState(100);
  const [interestRate, setInterestRate] = React.useState(3);
  const [volatility, setVolatility] = React.useState(30);
  const [matureTime, setMatureTime] = React.useState(60);
  const [periods, setPeriods] = React.useState(5);
  const [optionType, setOptionType] = React.useState("put");
  const [optionStyle, setOptionStyle] = React.useState("europe");

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar id="back-to-top-anchor" />
      <DisplayPanel price={price}></DisplayPanel>
      <ControlPanel
        spotPrice={spotPrice}
        setSpotPrice={setSpotPrice}
        strikePrice={strikePrice}
        setStrikePrice={setStrikePrice}
        interestRate={interestRate}
        setInterestRate={setInterestRate}
        volatility={volatility}
        setVolatility={setVolatility}
        matureTime={matureTime}
        setMatureTime={setMatureTime}
        periods={periods}
        setPeriods={setPeriods}
        optionType={optionType}
        setOptionType={setOptionType}
        optionStyle={optionStyle}
        setOptionStyle={setOptionStyle}
        setPrice={setPrice}
        pricingApi={new PricingApi("http://localhost:8080")}
      ></ControlPanel>
      <ScrollTop {...props}>
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </React.Fragment>
  );
}
