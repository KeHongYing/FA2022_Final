#pragma once

#include <cmath>
#include <iostream>
#include <random>
#include <string>
#include <unordered_set>
#include <vector>

#include "Pricer.hpp"

using namespace std;

class Vasicek : public Pricer {
    string type;
    bool isCallOption;
    double stockPrice;
    double strikePrice;
    double annualRate;
    double annualVolatility;
    int maturityDay;
    int periodPerDay;
    unordered_set<int> exerciseTimes;

    int numPeriods;
    double period;
    double periodRate;
    double numSimulates;
    double reversionSpeed;

   public:
    vector<vector<double>> prices;
    Vasicek() {}
    Vasicek(string type, bool isCallOption, double stockPrice, double strikePrice, double annualRate,
            double annualVolatility, int maturityDay, int periodPerDay, double reversionSpeed, double numSimulates,
            unordered_set<int> exerciseDays = unordered_set<int>())
        : type(type),
          isCallOption(isCallOption),
          stockPrice(stockPrice),
          strikePrice(strikePrice),
          annualRate(annualRate),
          annualVolatility(annualVolatility),
          maturityDay(maturityDay),
          periodPerDay(periodPerDay),
          reversionSpeed(reversionSpeed),
          numSimulates(numSimulates) {
        numPeriods = maturityDay * periodPerDay;
        period = (double)1 / 365 / periodPerDay;
        periodRate = exp(annualRate * period);

        if (type[0] == 'E' || type[0] == 'e') {
            exerciseTimes.insert(numPeriods);
        } else if (type[0] == 'A' || type[0] == 'a') {
            for (int i = 1; i <= numPeriods; i++) {
                exerciseTimes.insert(i);
            }
        } else if (type[0] == 'B' || type[0] == 'b') {
            for (auto exerciseDay : exerciseDays) {
                for (int i = 0; i < periodPerDay; i++) {
                    exerciseTimes.insert(exerciseDay * periodPerDay - i);
                }
            }
            exerciseTimes.insert(numPeriods);
        } else {
            cout << "WRONG TYPE!" << endl;
            exit(0);
        }
    }

    double getSinglePrice() {
        default_random_engine generator(time(nullptr));
        normal_distribution<double> distribution(0.0, 1.0);

        double tmpStockPrice = stockPrice;
        double tmpRate = periodRate;
        double discoutRate = 1;
        double price = 0;
        for (int i = 0; i < numPeriods; i++) {
            tmpRate = tmpRate + reversionSpeed * (periodRate - tmpRate) * period +
                      annualVolatility * sqrt(period) * distribution(generator);
            tmpStockPrice *= tmpRate;
            discoutRate *= periodRate;
            // cout << tmpStockPrice << " ";
            if (exerciseTimes.count(i) != 0) {
                price = max(price, (isCallOption ? (tmpStockPrice - strikePrice) : (strikePrice - tmpStockPrice)) /
                                       discoutRate);
            }
        }
        // cout << endl;

        return price;
    }

    double getPrice() override {
        double price = 0;
        for (int _ = 0; _ < numSimulates; _++) {
            price += getSinglePrice();
        }

        return price / numSimulates;
    }
};
