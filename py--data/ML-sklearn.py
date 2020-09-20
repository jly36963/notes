# ------------
# sklearn
# ------------

# simple and efficient tools for data mining and data analysis
# built on numpy, scipy, and matplotlib
# capabilities:
    # classification -- categorize objects
    # regression -- predicting a continuous-valued attribute associated with an object
    # clustering -- automatic grouping of similar objects into sets
    # dimensionality reduction -- reducing the number of random variables to consider
    # model selection - comparing, validating, and choosing parameters/models.
    # preprocessing -- feature extraction and normalization

# ------------
# imports 
# ------------

import math
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import sklearn
from sklearn.model_selection import train_test_split
from sklearn import linear_model
from sklearn import svm
from sklearn import metrics
from sklearn.svm import SVC
from sklearn.linear_model import LinearRegression
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import GaussianNB

%matplotlib inline
sns.set_style('whitegrid')

# ------------
# linear regression example (numpy)
# ------------

# import dataset
from sklearn.datasets import load_boston
boston = load_boston()
# make df from dataset
df1 = pd.DataFrame(boston.data)
df1.columns = boston.feature_names
df1['Price'] = boston.target
# plot data (linear fit)
sns.lmplot(x = 'RM', y='Price', data=df1) # col1, col2, df

# univariate linear regression (one input)
    # y = mx + b # line equation
    # y = Ap # rewritten as matrices
        # A = [x 1] # horizontal
        # P = [m b] # vertical
x = df1['RM'] # column (medium room values)
x = np.vstack(x) # vertical stack (506 rows, 1 col)
x = np.array( list(map(lambda n: [n,1], x)), dtype='float') # x = np.array( [ [value,1] for value in x] )
y = df1['Price']
result = np.linalg.lstsq(x,y) # least squares method
m, b = result[0]
squared_error = result[1]
rmse = np.sqrt(squared_error/len(x))
print("y=mx+b")
print(f"y={round(m,2)}x+{round(b,2)}")
print(f"total squared_error: {squared_error}")
print(f"rmse: {rmse}")

# for a normal distribution: 
    # 68% of values are within 1 std
    # 95% are within 2 std
    # 99.7 % are within 3 std

# ------------
# linear regression (sklearn) (multivariate)
# ------------

# coefficient of determination (R^2) 
    # proportion of variance in y that is predictable from x
    # correlation (squared) between y_pred and y_true. ranges from 0 to 1.
    # R^2 == 0 means y cannot be predicted
    # R^2 == 1 means y can be predicted without error.

# linear regression estimator object
    # lr = LinearRegression() # estimator object
    # lr.fit() # fits linear model
    # lr.predict() # predict Y using linear model
    # lr.score() # coefficient of determination
# estimator object attributes
    # lr.coef_ # estimated coefficients (2D array of shape -- (n_targets, n_features))
    # lr.intercept_ # y-intercept

# multivariate
    # y(w,x) = w + wx + wx + wx + wx ...
    # output = intercept + coef1*input1 + coef2*input2 + coef3*input3 ...

# create estimator
lr = LinearRegression() # sklearn.linear_model.LinearRegression
# import dataset
from sklearn.datasets import load_boston
boston = load_boston()
# make df from dataset
df1 = pd.DataFrame(boston.data)
df1.columns = boston.feature_names
df1['Price'] = boston.target
# set x & y
x_multi = df1.drop('Price',1) # df1 without 'Price' col
y_target = df1['Price'] # 'Price' col
# fit
lr.fit(x_multi, y_target)
# lr attributes
intercept = round(lr.intercept_, 2)
coef = len(lr.coef_)
print(f"estimated intercept: {intercept}")
print(f"number of coefficients: {coef}")
# df2 (coefficients)
df2 = pd.DataFrame(df1.columns)
df2.columns = ['Features']
df2['Coefficient Estimate'] = pd.Series(lr.coef_)

# ------------
# linear regression (sklearn) (train test split)
# ------------

# create estimator
lr = LinearRegression() # sklearn.linear_model.LinearRegression
# import dataset
from sklearn.datasets import load_boston
boston = load_boston()
# make df from dataset
df1 = pd.DataFrame(boston.data)
df1.columns = boston.feature_names
df1['Price'] = boston.target
# set x & y
x_multi = df1.drop('Price',1) # df1 without 'Price' col
y_true = df1['Price'] # 'Price' col
# train test split
x_train, x_test, y_train, y_test = sklearn.model_selection.train_test_split(x_multi, y_true)
# fit
lr.fit(x_train, y_train)
# predict
y_pred_train = lr.predict(x_train) # test the training set
y_pred_test = lr.predict(x_test) # test the test set
# rmse
mse_train = np.mean((y_train-y_pred_train) ** 2)
mse_test = np.mean((y_test-y_pred_test) ** 2)
rmse_train = np.sqrt(mse_train / len(x_train))
rmse_test = np.sqrt(mse_test / len(x_train))
print(f"rmse_train: {rmse_train}")
print(f"rmse_test: {rmse_test}")

# residual plot
    # visualization: where is the error occuring? 
    # residual = y_train - y_pred_train
    # testing to see if linear regression is a good choise
train = plt.scatter(y_pred_train,(y_train - y_pred_train), c='b', alpha=0.5)
test = plt.scatter(y_pred_test, (y_test - y_pred_test), c='r', alpha=0.5)
plt.legend((train,test), ('Training', 'Test'), loc='lower left')
plt.title('Residual PLots')

# ------------
# logistic function
# ------------

# sigmoid function is a special case of the logistic function (1 / (1 + e^-t))

# logistic function
def logistic(t):
    return (1.0 / (1 + math.exp((-1.0)*t)))
# input/output
t = np.linspace(-6,6,500)
y = np.array([logistic(n) for n in t])
# plot
plt.plot(t,y)
plt.title('Logistic Function Example')


# ------------
# logistic regression (classification) (binary classification example)
# ------------

import statsmodels.api as sm
# dataset as df
df1 = sm.datasets.fair.load_pandas().data
# create 'Had_Affair' col
df1['Had_Affair'] = df1['affairs'].apply(lambda x: 0 if x==0 else 1)
# compare
df2 = df1.groupby('Had_Affair').mean().applymap(lambda x: round(x,1))
# plot (categorical plot)
sns.catplot(x='rate_marriage', data=df1, kind='count', hue='Had_Affair', palette='coolwarm')

# skipped this section (dummy variables)

# ------------
# multi-class classification (logistic regression)
# ------------

# import dataset
from sklearn.datasets import load_iris
# extract dataset
iris = load_iris()
x = iris.data
y = iris.target
# get df from dataset
df_x = pd.DataFrame(x,columns=['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'])
df_y = pd.DataFrame(y, columns=['Species'])
# replace
df_y = df_y.replace({0 : 'Setosa', 1 : 'Versicolour', 2 : 'Virginica'})
# combine
df1 = pd.concat([df_x, df_y], axis=1)
# visualize
sns.pairplot(df1, hue='Species')
sns.catplot(x='Petal Length', data=df1, kind='count', hue='Species')

# logistic regression object
logr = LogisticRegression(solver='lbfgs') # default solver will be changed to 'lbfgs' in 0.22
x_train, x_test, y_train, y_test = train_test_split(df_x, df_y, test_size=0.3, random_state=101)
logr.fit(x_train, y_train.values.ravel()) # expects 1d array, not column (use ravel)
# prediction
from sklearn import metrics
y_pred = logr.predict(x_test)
acc = metrics.accuracy_score(y_test, y_pred)
print(f"accuracy: {acc}")

# ------------
# multi-class classification (k-nearest neighbors) (knn)
# ------------

# plot known (labeled) values, plot testing set. classify testing set based on nearest neighbors
    # if k = 3, take 3 closest labeled neighbors and classify based on the majority.
    # k should usually be odd (prevent ties wherever possible)


# import dataset
from sklearn.datasets import load_iris
# extract dataset
iris = load_iris()
x = iris.data
y = iris.target
# get df from dataset
df_x = pd.DataFrame(x,columns=['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'])
df_y = pd.DataFrame(y, columns=['Species'])
# replace
df_y = df_y.replace({0 : 'Setosa', 1 : 'Versicolour', 2 : 'Virginica'})
# combine
df1 = pd.concat([df_x, df_y], axis=1)
# train test split
x_train, x_test, y_train, y_test = train_test_split(df_x, df_y, test_size=0.3, random_state=101)
# import knn
from sklearn.neighbors import KNeighborsClassifier
knn = KNeighborsClassifier(n_neighbors=5) # k = 5
knn.fit(x_train, y_train)
# prediction
y_pred = knn.predict(x_test)
acc = metrics.accuracy_score(y_test, y_pred)
print(f"accuracy: {acc}")


# ------------
# support vector classification 1
# ------------

# svm: supervised learning models (with associated algorithms) for classification/regression analysis
    # non-probabilistic binary linear classifier
    # model represents points in space, categories are divided by a clear gap (optimal hyperplane)
    # effective in high dimensional spaces, memory efficient, kernels are customizable (versatile)
    # poor performance if num_featuers is much greater than num_samples.
    # svm does not directly provide probability estimates, they are calcuated using an expeensive cross-validation.

# import dataset
from sklearn.datasets import load_iris
# extract dataset
iris = load_iris()
x = iris.data
y = iris.target
# get df from dataset
df_x = pd.DataFrame(x,columns=['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'])
df_y = pd.DataFrame(y, columns=['Species'])
# replace
df_y = df_y.replace({0 : 'Setosa', 1 : 'Versicolour', 2 : 'Virginica'})
# combine
df1 = pd.concat([df_x, df_y], axis=1)
# train test split
x_train, x_test, y_train, y_test = train_test_split(df_x, df_y, test_size=0.3, random_state=101)
# model
model = SVC(gamma='scale') # gamma='auto' will soon be deprecated
model.fit(x_train, y_train.values.ravel()) # expects 1d array, not column (use ravel)
# prediction
y_pred = model.predict(x_test)
acc = metrics.accuracy_score(y_test, y_pred)
print(f"acc: {round(acc,2)}")

# ------------
# support vector classification 2 (linear vs polynomial vs gaussian radial basis function)
# ------------

# import dataset
from sklearn.datasets import load_iris
# extract dataset
iris = load_iris()
x = iris.data
y = iris.target
# get df from dataset
df_x = pd.DataFrame(x,columns=['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'])
df_y = pd.DataFrame(y, columns=['Species'])
# replace
df_y = df_y.replace({0 : 'Setosa', 1 : 'Versicolour', 2 : 'Virginica'})
# combine
df1 = pd.concat([df_x, df_y], axis=1)
# train test split
x_train, x_test, y_train, y_test = train_test_split(df_x, df_y, test_size=0.3, random_state=101)
# create models
svc = SVC(kernel='linear', C=1.0, gamma='scale')
svc.fit(x_train, y_train.values.ravel())
rbf_svc = SVC(kernel='rbf', C=1.0, gamma=0.7)
rbf_svc.fit(x_train, y_train.values.ravel())
poly_svc = SVC(kernel='poly', degree=3, C=1.0, gamma='scale')
poly_svc.fit(x_train, y_train.values.ravel())
lin_svc = SVC(C=1.0, gamma='scale')
lin_svc.fit(x_train, y_train.values.ravel())
# predict
y_pred_svc = svc.predict(x_test)
y_pred_rbf_svc = rbf_svc.predict(x_test)
y_pred_poly_svc = poly_svc.predict(x_test)
y_pred_lin_svc = lin_svc.predict(x_test)
# accuracy
acc_svc = metrics.accuracy_score(y_test, y_pred_svc)
acc_rbf_svc = metrics.accuracy_score(y_test, y_pred_rbf_svc)
acc_poly_svc = metrics.accuracy_score(y_test, y_pred_poly_svc)
acc_lin_svc = metrics.accuracy_score(y_test, y_pred_lin_svc)
print(f"acc_svc: {acc_svc}")
print(f"acc_rbf_svc: {acc_rbf_svc}")
print(f"acc_poly_svc: {acc_poly_svc}")
print(f"acc_lin_svc: {acc_lin_svc}")

# skipped visualization part (mesh grid)

# ------------
# gaussian naive bayes (multiclass classification)
# ------------

# operates with the naive assumption that every feature is independent of each other

# import dataset
from sklearn.datasets import load_iris
# extract dataset
iris = load_iris()
x = iris.data
y = iris.target
# get df from dataset
df_x = pd.DataFrame(x,columns=['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'])
df_y = pd.DataFrame(y, columns=['Species'])
# replace
df_y = df_y.replace({0 : 'Setosa', 1 : 'Versicolour', 2 : 'Virginica'})
# combine
df1 = pd.concat([df_x, df_y], axis=1)
# train test split
x_train, x_test, y_train, y_test = train_test_split(df_x, df_y, test_size=0.3, random_state=101)
# create models
model = GaussianNB()
model.fit(x_train, y_train.values.ravel())
# prediction
y_pred = model.predict(x_test)
acc = metrics.accuracy_score(y_test, y_pred)
print(round(acc, 2))

# ------------
# decision trees and random forests
# ------------

# decision trees
    # ensemble learner -- ensemble of weak learners
    # binary questions

from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

# make blobs (random clusters of points)
x,y = make_blobs(n_samples=500,centers=4,random_state=8,cluster_std=2.4)
plt.figure(figsize=(6,6))
plt.scatter(x[:,0], x[:,1], c=y, s=50, cmap='jet') # axis, axis, classifier, size, colors

model = DecisionTreeClassifier(max_depth=4, random_state=0)
model = RandomForestClassifier(n_estimators=100, random_state=0)

# skipped this section

# ------------
# random forest regression
# ------------

from sklearn.ensemble import RandomForestRegressor

# create fake data
x = 10 * np.random.rand(100)
def f(x):
    noise = 0.2 * np.random.rand(len(x))
    return np.sin(5*x) + np.sin(0.5 * x) + noise
y = f(x)
plt.figure
plt.errorbar(x,y,yerr=0.1,fmt='o')

# test data is made up -- does it match the train data?
x_test = np.linspace(0,10,1000)
model = RandomForestRegressor(100)
model.fit(x[:,None],y)
y_pred = model.predict(x_test[:,None])
y_true = f(x_test)

# plot train and test values
plt.errorbar(x,y,0.1,fmt='o') # train points
plt.plot(x_test,y_pred,'-r') # prediction line 
plt.plot(x_test,y_true, '-k', alpha=0.5) # true line




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------



