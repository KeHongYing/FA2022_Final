#ifndef _VASICEK
#define _VASICEK

#include <random>

vector<double> getVasicekRate(double r0, double K, double theta, double sigma, int N, int seed)
{
    if (K < 0)
    {
        return vector<double>(N + 1, r0);
    }

    srand(seed);
    default_random_engine generator;
    normal_distribution<double> distribution(0.0, 1.0);

    double dt = 1.0 / N;
    vector<double> rates = {r0};
    for (int i = 0; i < N; i++)
    {
        double dr = K * (theta - rates[-1]) * dt + sigma * sqrt(dt) * distribution(generator);
        rates.push_back(rates.back() + dr);
    }

    return rates;
}

#endif