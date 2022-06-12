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
    const resource = `${optionType}/${optionStyle}/${spotPrice}/${strikePrice}/${interestRate}/${volatility}/${matureTime}/${periods}/${exerciseDate}`;
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
