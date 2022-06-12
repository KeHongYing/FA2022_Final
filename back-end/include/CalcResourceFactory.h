#pragma once

#include <string>
#include <tuple>

#include "IResourceFactory.h"

class CalcResourceFactory : public IResourceFactory
{

public:
    CalcResourceFactory();
    shared_ptr<Resource> get_resource() const final;

private:
    double calculate(string optionType, string optionStyle, double spotPrice, double strikePrice, double interestRate, double volatility, int matureDate, int periods);
    tuple<string, string, double, double, double, double, int, int> get_path_parameters(const shared_ptr<Session> session) const;
    string to_json(float result);
    void get_handler(const shared_ptr<Session> session);

    shared_ptr<Resource> _resource;
};