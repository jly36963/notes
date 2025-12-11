# Scikit-learn

- simple and efficient tools for data mining and data analysis
- built on numpy, scipy, and matplotlib

## capabilities

- classification: categorize objects
- regression: predicting a continuous-valued attribute associated with an object
- clustering: automatic grouping of similar objects into sets
- dimensionality reduction: reducing the number of random variables to consider
- model selection: comparing, validating, and choosing parameters/models.
- preprocessing: feature extraction and normalization

# svm: supervised learning models (with associated algorithms) for classification/regression analysis

- non-probabilistic binary linear classifier
- model represents points in space, categories are divided by a clear gap (optimal hyperplane)
- effective in high dimensional spaces, memory efficient, kernels are customizable (versatile)
- poor performance if num_featuers is much greater than num_samples.
- svm does not directly provide probability estimates, they are calcuated using an expeensive cross-validation.
