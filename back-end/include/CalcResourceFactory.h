#pragma once

#include <string>
#include <tuple>
#include <unordered_set>

#include "IResourceFactory.h"
#include "option.hpp"

class CalcResourceFactory : public IResourceFactory
{

public:
    CalcResourceFactory();
    shared_ptr<Resource> get_resource() const final;

private:
    unordered_set<int> string_to_unordered_set(string s, string delimiter);
    double calculate(string optionType, string optionStyle, double spotPrice, double strikePrice, double interestRate, double volatility, int matureDate, int periods, double K, string exerciseDatesStr);
    tuple<string, string, double, double, double, double, int, int, double, string> get_path_parameters(const shared_ptr<Session> session) const;
    string to_json(float result);
    void get_handler(const shared_ptr<Session> session);

    shared_ptr<Resource> _resource;
    Option _option;
};