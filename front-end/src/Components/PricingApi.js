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
    periods
  ) {
    const resource = `${optionType}/${optionStyle}/${spotPrice}/${strikePrice}/${interestRate}/${volatility}/${matureTime}/${periods}`;
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
        periods
      )
    )
      .then((res) => res.json())
      .then(
        (response) => {
          handler(response["result"]);
        },
        (err) => {
          handler(err);
          console.log(err);
        }
      );
  }
}

export default PricingApi;
