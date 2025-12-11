# Stats notes (stat)

- variables
  - random: variable whose value is subject to variations due to chance.
  - discrete random: categorical variables (countable number of possible values)
  - continuous random: numerical variables (infinitely many possible values)

- distribution functions
  - probability distribution:
    - each measureable subset of possible outcomes is assigned a probability.
  - pmf (probability mass function):
    - prob that a discrete random var is exactly equal to some value
  - cmf (cumulative mass function):
    - discrete probability distribution
    - prob distribution characterized by pmf
  - pdf (probability density function):
    - func that describes relative likelihood for random var to take given value
  - cdf (cumulative density function):
    - continous probability distribution
    - prob that var takes value <= x
  - ppf (percent point function)
    - value that corresponds to a provided percentile

- central limit theorem:
  - distribution of sample means approximates a normal distribution
  - large num of iterations, certain conditions, produces normal distribution.

- distributions
  - continuous
    - normal: gaussian distribution, bell shaped distribution
      - mean of 0, std of 1
    - uniform: all values have same frequency
    - exponential: the time between successes as time flows by continuously.
  - discrete
    - bernoulli: two possible outcomes (success/failure)
      - `q = 1 - p` (prob_of_failure = 1 - prob_of_success)
      - 1 trial, 2 possible outcomes (yes/no) (success/failure)
      - bernoulli deals with single trial, binomial deals with multiple trials.
    - binomial: num of successes in a fixed number of independent trials,
    - negative binomial: num of successes until threshold of failures is met.
    - geometric: the time between successes in a series of independent trials.
    - poisson: the number of occurrences in a fixed period of time,

- distribution (shape)
  - skewness
    - asymmetry in prob distribution.
    - negative skew (tail left)
      - extreme values on negative end (bring down mean)
    - positive skew (tail right)
      - extreme values on positive end (bring up mean)
  - kurtosis
    - measure of the peakedness of the probability distribution
    - the sharpness of the peak of a frequency-distribution curve.

- multivariate basic metrics
  - covariance: strength of correlation between 2+ sets of random variates
    - calculate
      - sum( (x_i - x_mean) * (y_i - y_mean) ) / (observations - 1)
    - interpret
      - positive covariance: they tend to increase/decrease together
      - negative covariance: they tend to increase/decrease inversely
    - weakness
      - not normalized
      - can't be used to compare variances over data sets with different scales
    - alternative
      - correlation provides better understanding of relationship between two
        variables
      - correlation is "normalized variance"

- correlation
  - extent to which two or more variables fluctuate together
  - positive correlation indicates the extent to which the variables inc/dec in
    parallel.
  - `sum( (x_i - x_mean) * (y_i - y_mean) ) / ( (observations - 1) * (std_x * std_y) )`
  - correlation coefficient: `covariance / (std_x * std_y)`

- pearson correlation coefficient
  - interpret (p-value)
    - positive: positive correlation
    - 0: no correlation
    - negative: negative correlation

- hypothesis testing
  - null hypothesis
    - no statistically significant difference exists in a set of observations
  - interpret
    - p > alpha (.05)
      - null hypothesis supported
      - may not have statistically significant difference
    - p < alpha (.05)
      - null hypothesis rejected
      - may have statistically significant difference
  - many tests compare means
    - are the sample means equal or significantly different?

- methods of hypothesis testing
  - ANOVA (one-way analysis of variance)
    - returns: statistic (computed f-value), pvalue (associated p-value from
      F-distribution)
    - tests null hypothesis: that multiple populations have the same
      mean/variance
    - when only using two populations/means -- f_test is equivalent to t_test

- post about hypothesis testing
  - t-test, z-test, f-test, anova, etc
  - https://towardsdatascience.com/statistical-tests-when-to-use-which-704557554740

- bootstrapping
  - process
    - take sample of population
    - calculate statistic
    - repeat
    - take average of calculated statistics
  - bootstrap (95% confidence intervals)
  - https://towardsdatascience.com/calculating-confidence-interval-with-bootstrapping-872c657c058d
