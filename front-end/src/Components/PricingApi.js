class PricingApi {
  constructor(serviceAddress) {
    this.serviceAddress = serviceAddress;
  }

  makeURL(
    optionType,
    optionStyle,
    spotPrice,
    strikePrice,
    interestRate,
    volatility,
    matureTime,
    periods,
    exerciseDate
  ) {
    const exercise =
      exerciseDate === "" ? "_" : exerciseDate.replaceAll(" ", "_");
    const resource = `${optionType}/${optionStyle}/${spotPrice}/${strikePrice}/${interestRate}/${volatility}/${matureTime}/${periods}/${exercise}`;
    return new URL(resource, this.serviceAddress);
  }

  calculate(
    optionType,
    optionStyle,
    spotPrice,
    strikePrice,
    interestRate,
    volatility,
    matureTime,
    periods,
    exerciseDate,
    handler
  ) {
    fetch(
      this.makeURL(
        optionType,
        optionStyle,
        spotPrice,
        strikePrice,
        interestRate,
        volatility,
        matureTime,
        periods,
        exerciseDate
      ),
      { method: "GET", mode: "cors" }
    )
      .then((res) => res.json())
      .then(
        (response) => {
          handler(response["result"], response["prices"]);
        },
        (err) => {
          handler(err);
          console.log(err);
        }
      );
  }
}

export default PricingApi;
