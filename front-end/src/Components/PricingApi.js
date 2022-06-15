class PricingApi {
  constructor(serviceAddress) {
    this.serviceAddress = serviceAddress;
  }

  makeURL(
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
    exerciseDate
  ) {
    const exercise =
      exerciseDate === "" ? "_" : exerciseDate.replaceAll(" ", "_");
    const resource = `${modelType}/${optionType}/${optionStyle}/${spotPrice}/${strikePrice}/${interestRate}/${volatility}/${matureTime}/${periods}/${K}/${N}/${exercise}`;
    console.log(resource);
    return new URL(resource, this.serviceAddress);
  }

  calculate(
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
    handler
  ) {
    fetch(
      this.makeURL(
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
