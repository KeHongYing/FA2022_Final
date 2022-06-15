#include "CalcResourceFactory.h"

#include <iomanip>
#include <iostream>
#include <sstream>

#include "Pricer.hpp"
#include "Vasicek.hpp"
#include "json.hpp"
#include "option.hpp"

using namespace nlohmann;

CalcResourceFactory::CalcResourceFactory() {
    _resource = make_shared<Resource>();
    _resource->set_path(
        "/{modelType: binomial|mc}"
        "/{optionType: put|call}"
        "/{optionStyle: american|europe|bermuda}"
        "/{spotPrice: [-+]?[0-9]*\\.?[0-9]*}"
        "/{strikePrice: [-+]?[0-9]*\\.?[0-9]*}"
        "/{interestRate: [-+]?[0-9]*}"
        "/{volatility: [-+]?[0-9]*}"
        "/{matureDate: [-+]?[0-9]*}"
        "/{periods: [-+]?[0-9]*}"
        "/{reversionSpeed: [-+]?[0-9]*}"
        "/{numSimulates: [-+]?[0-9]*}"
        "/{exerciseDates: [0-9_]*}");
    _resource->set_method_handler("GET", [&](const auto session) { get_handler(session); });
}

shared_ptr<Resource> CalcResourceFactory::get_resource() const { return _resource; }

unordered_set<int> CalcResourceFactory::string_to_unordered_set(string s, string delimiter = "_") {
    unordered_set<int> res;
    size_t pos = 0;
    while ((pos = s.find(delimiter)) != std::string::npos) {
        string tmp = s.substr(0, pos);
        if (!tmp.empty()) {
            res.insert(stoi(tmp));
        }
        s.erase(0, pos + delimiter.length());
    }
    if (!s.empty()) {
        res.insert(stoi(s));
    }

    return res;
}

double CalcResourceFactory::calculate(string modelType, string optionType, string optionStyle, double spotPrice,
                                      double strikePrice, double interestRate, double volatility, int matureDate,
                                      int periods, double reversionSpeed, int numSimulates, string exerciseDatesStr) {
    std::cout << modelType << " " << optionType << " " << optionStyle << " " << spotPrice << " " << strikePrice << " "
              << interestRate << " " << volatility << " " << matureDate << " " << periods << " " << reversionSpeed
              << " " << numSimulates << endl;
    std::cout << exerciseDatesStr << endl;
    bool isCallOption = optionType[0] == 'c' || optionType[0] == 'C';
    unordered_set<int> exerciseDates = string_to_unordered_set(exerciseDatesStr);

    if (modelType[0] == 'b' || modelType[0] == 'B')
        _pricer = new Option(optionStyle, isCallOption, spotPrice, strikePrice, interestRate, volatility, matureDate,
                             periods, exerciseDates);
    else if (modelType[0] == 'm' || modelType[0] == 'M')
        _pricer = new Vasicek(optionStyle, isCallOption, spotPrice, strikePrice, interestRate, volatility, matureDate,
                              periods, reversionSpeed, numSimulates, exerciseDates);
    
    double price = _pricer->getPrice();
    delete _pricer;

    return price;
}

tuple<string, string, string, double, double, double, double, int, int, double, int, string>
CalcResourceFactory::get_path_parameters(const shared_ptr<Session> session) const {
    const auto &request = session->get_request();
    const auto modelType = request->get_path_parameter("modelType");
    const auto optionType = request->get_path_parameter("optionType");
    const auto optionStyle = request->get_path_parameter("optionStyle");
    auto spotPrice = atof(request->get_path_parameter("spotPrice").c_str());
    auto strikePrice = atof(request->get_path_parameter("strikePrice").c_str());
    auto interestRate = atof(request->get_path_parameter("interestRate").c_str()) / 100.0;
    auto volatility = atof(request->get_path_parameter("volatility").c_str()) / 100.0;
    auto matureDate = atof(request->get_path_parameter("matureDate").c_str());
    auto periods = atof(request->get_path_parameter("periods").c_str());
    auto reversionSpeed = atof(request->get_path_parameter("reversionSpeed").c_str()) / 100.0;
    auto numSimulates = atof(request->get_path_parameter("numSimulates").c_str());
    auto exerciseDatesStr = request->get_path_parameter("exerciseDates");
    return make_tuple(modelType, optionType, optionStyle, spotPrice, strikePrice, interestRate, volatility, matureDate,
                      periods, reversionSpeed, numSimulates, exerciseDatesStr);
}

string CalcResourceFactory::to_json(float result) {
    json jsonResult;
    jsonResult["result"] = result;
    return jsonResult.dump();
}

void CalcResourceFactory::get_handler(const shared_ptr<Session> session) {
    const auto [modelType, optionType, optionStyle, spotPrice, strikePrice, interestRate, volatility, matureDate,
                periods, reversionSpeed, numSimulates, exerciseDatesStr] = get_path_parameters(session);
    auto result = calculate(modelType, optionType, optionStyle, spotPrice, strikePrice, interestRate, volatility,
                            matureDate, periods, reversionSpeed, numSimulates, exerciseDatesStr);
    auto content = to_json(result);
    session->close(OK, content, {{"Content-Length", to_string(content.size())}});
}