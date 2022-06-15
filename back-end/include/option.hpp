#pragma once

#include <cmath>
#include <iostream>
#include <string>
#include <unordered_set>
#include <vector>

#include "Pricer.hpp"

using namespace std;

class Option : public Pricer
{
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
    double upScale;
    double downScale;
    double upProbability;
    double downProbability;

public:
    vector<vector<double>> prices;
    Option() {}
    Option(string type, bool isCallOption, double stockPrice, double strikePrice, double annualRate,
           double annualVolatility, int maturityDay, int periodPerDay,
           unordered_set<int> exerciseDays = unordered_set<int>())
        : type(type),
          isCallOption(isCallOption),
          stockPrice(stockPrice),
          strikePrice(strikePrice),
          annualRate(annualRate),
          annualVolatility(annualVolatility),
          maturityDay(maturityDay),
          periodPerDay(periodPerDay)
    {
        numPeriods = maturityDay * periodPerDay;
        period = (double)1 / 365 / periodPerDay;
        periodRate = exp(annualRate * period);
        upScale = exp(annualVolatility * sqrt(period));
        downScale = 1 / upScale;
        upProbability = (periodRate - downScale) / (upScale - downScale);
        downProbability = 1 - upProbability;

        if (type[0] == 'E' || type[0] == 'e')
        {
            exerciseTimes.insert(numPeriods);
        }
        else if (type[0] == 'A' || type[0] == 'a')
        {
            for (int i = 1; i <= numPeriods; i++)
            {
                exerciseTimes.insert(i);
            }
        }
        else if (type[0] == 'B' || type[0] == 'b')
        {
            for (auto exerciseDay : exerciseDays)
            {
                for (int i = 0; i < periodPerDay; i++)
                {
                    exerciseTimes.insert(exerciseDay * periodPerDay - i);
                }
            }
            exerciseTimes.insert(numPeriods);
        }
        else
        {
            cout << "WRONG TYPE!" << endl;
            exit(0);
        }
    }

    double getPrice() override
    {
        prices = vector<vector<double>>(numPeriods + 1, vector<double>(numPeriods + 1, 0));
        prices[0][0] = stockPrice;

        // forward
        for (int i = 1; i <= numPeriods; i++)
        {
            for (int j = 0; j < i; j++)
            {
                prices[i][j] = prices[i - 1][j] * upScale;
            }
            prices[i][i] = prices[i - 1][i - 1] * downScale;
        }
        for (int i = 0; i <= numPeriods; i++)
        {
            prices[numPeriods][i] =
                max(isCallOption ? (prices[numPeriods][i] - strikePrice) : (strikePrice - prices[numPeriods][i]),
                    (double)0);
        }

        // backward
        for (int i = numPeriods - 1; i >= 0; i--)
        {
            for (int j = 0; j <= i; j++)
            {
                double keepReturn =
                    (upProbability * prices[i + 1][j] + downProbability * prices[i + 1][j + 1]) / periodRate;

                double strikeReturn =
                    exerciseTimes.count(i) == 0
                        ? 0
                        : max(isCallOption ? (prices[i][j] - strikePrice) : (strikePrice - prices[i][j]), (double)0);
                prices[i][j] = max(keepReturn, strikeReturn);
            }
        }

        return prices[0][0];
    }
};
