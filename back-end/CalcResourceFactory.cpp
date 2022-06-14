#include "CalcResourceFactory.h"

#include <sstream>
#include <iomanip>
#include "json.hpp"
#include "option.hpp"
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
        "/{periods: [-+]?[0-9]*}"
        "/{K: [-+]?[0-9]*}"
        "/{exerciseDates: [0-9_]*}");
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

unordered_set<int> CalcResourceFactory::string_to_unordered_set(string s, string delimiter = "_")
{
    unordered_set<int> res;
    size_t pos = 0;
    while ((pos = s.find(delimiter)) != std::string::npos)
    {
        string tmp = s.substr(0, pos);
        if (!tmp.empty())
        {
            res.insert(stoi(tmp));
        }
        s.erase(0, pos + delimiter.length());
    }
    if (!s.empty())
    {
        res.insert(stoi(s));
    }

    return res;
}

double CalcResourceFactory::calculate(string optionType, string optionStyle, double spotPrice, double strikePrice, double interestRate, double volatility, int matureDate, int periods, double K, string exerciseDatesStr)
{
    std::cout << optionType << " " << optionStyle << " " << spotPrice << " " << strikePrice << " " << interestRate << " " << volatility << " " << matureDate << " " << periods << " " << K << endl;
    std::cout << exerciseDatesStr << endl;
    bool isCallOption = optionType[0] == 'c' || optionType[0] == 'C';
    unordered_set<int> exerciseDates = string_to_unordered_set(exerciseDatesStr);
    _option = Option(optionStyle, isCallOption, spotPrice, strikePrice, interestRate, volatility, matureDate, periods, K, exerciseDates);
    return _option.getPrice();
}

tuple<string, string, double, double, double, double, int, int, double, string> CalcResourceFactory::get_path_parameters(
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
    auto K = atof(request->get_path_parameter("K").c_str()) / 100.0;
    auto exerciseDatesStr = request->get_path_parameter("exerciseDates");
    return make_tuple(optionType, optionStyle, spotPrice, strikePrice, interestRate, volatility, matureDate, periods, K, exerciseDatesStr);
}

string CalcResourceFactory::to_json(float result)
{
    json jsonResult;
    jsonResult["result"] = result;
    jsonResult["prices"] = _option.prices;
    return jsonResult.dump();
}

void CalcResourceFactory::get_handler(const shared_ptr<Session> session)
{
    const auto [optionType, optionStyle, spotPrice, strikePrice, interestRate, volatility, matureDate, periods, K, exerciseDatesStr] = get_path_parameters(session);
    auto result = calculate(optionType, optionStyle, spotPrice, strikePrice, interestRate, volatility, matureDate, periods, K, exerciseDatesStr);
    auto content = to_json(result);
    session->close(OK, content,
                   {{"Content-Length", to_string(content.size())}});
}