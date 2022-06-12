#include "CalcResourceFactory.h"

#include <sstream>
#include <iomanip>
#include "json.hpp"
#include <iostream>

using namespace nlohmann;

CalcResourceFactory::CalcResourceFactory()
{
    _resource = make_shared<Resource>();
    _resource->set_path(
        "/{optionType: put|call}"
        "/{optionStyle: american|europe|bermuda}"
        "/{spotPrice: [-+]?[0-9]*\\.?[0-9]*}"
        "/{strikePrice: [-+]?[0-9]*\\.?[0-9]*}"
        "/{interestRate: [-+]?[0-9]*}"
        "/{volatility: [-+]?[0-9]*}"
        "/{matureDate: [-+]?[0-9]*}"
        "/{periods: [-+]?[0-9]*}");
    _resource->set_method_handler("GET",
                                  [&](const auto session)
                                  {
                                      get_handler(session);
                                  });
}

shared_ptr<Resource> CalcResourceFactory::get_resource() const
{
    return _resource;
}

double CalcResourceFactory::calculate(string optionType, string optionStyle, double spotPrice, double strikePrice, double interestRate, double volatility, int matureDate, int periods)
{
    std::cout << optionType << " " << optionStyle << " " << spotPrice << " " << strikePrice << " " << interestRate << " " << volatility << " " << matureDate << " " << periods << endl;
    return 1234;
}

tuple<string, string, double, double, double, double, int, int> CalcResourceFactory::get_path_parameters(
    const shared_ptr<Session> session) const
{
    const auto &request = session->get_request();
    const auto optionType = request->get_path_parameter("optionType");
    const auto optionStyle = request->get_path_parameter("optionStyle");
    auto spotPrice = atof(request->get_path_parameter("spotPrice").c_str());
    auto strikePrice = atof(request->get_path_parameter("strikePrice").c_str());
    auto interestRate = atof(request->get_path_parameter("interestRate").c_str()) / 100.0;
    auto volatility = atof(request->get_path_parameter("volatility").c_str()) / 100.0;
    auto matureDate = atof(request->get_path_parameter("matureDate").c_str());
    auto periods = atof(request->get_path_parameter("periods").c_str());
    return make_tuple(optionType, optionStyle, spotPrice, strikePrice, interestRate, volatility, matureDate, periods);
}

string CalcResourceFactory::to_json(float result)
{
    ostringstream str_stream;
    str_stream << result;
    json jsonResult = {
        {"result", str_stream.str()}};
    return jsonResult.dump();
}

void CalcResourceFactory::get_handler(const shared_ptr<Session> session)
{
    const auto [optionType, optionStyle, spotPrice, strikePrice, interestRate, volatility, matureDate, periods] = get_path_parameters(session);
    auto result = calculate(optionType, optionStyle, spotPrice, strikePrice, interestRate, volatility, matureDate, periods);
    auto content = to_json(result);
    session->close(OK, content,
                   {{"Content-Length", to_string(content.size())}});
}