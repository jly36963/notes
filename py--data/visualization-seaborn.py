# ---------------
# SEABORN
# ---------------

# api reference
# https://seaborn.pydata.org/api.html


# ---------------
# imports
# ---------------

# numpy & pandas
import numpy as np
import pandas as pd
from pandas import Series, DataFrame
# stats
from scipy import stats
# plots
import matplotlib
import matplotlib.pyplot as plt
import seaborn as sns; sns.set(style='white', color_codes=True)

# needed in jupyter notebooks
%matplotlib inline

# ---------------
# matplotlib colors
# ---------------

# hex
    # #000000
# css4
    # aqua, aquamarine, azure, beige, black, blue, brown, chartreuse, chocolate,
    # coral, crimson, cyan, darkblue, darkgreen, fuchsia, gold, goldenrod, green,
    # grey, indigo, ivory, khaki, lavender, lightblue, lightgreen, lime, magenta,
    # maroon, navy, olive, orange, orangered, orchid, pink, plum, purple, red,
    # salmon, sienna, silver, tan, teal, tomato, turquoise, violet, wheat, white,
    # yellow, yellowgreen

# ---------------
# matplotlib
# ---------------

# histogram (multiple datasets)
ds1 = np.random.randn(100)
ds2 = np.random.randn(80)
plt.hist(ds1, density=True,color='red',alpha=.5,bins=[-4,-3,-2,-1,0,1,2,3,4])
plt.hist(ds2, density=True,color='blue',alpha=.5,bins=[-4,-3,-2,-1,0,1,2,3,4])

# histogram (with arguments)
ds3 = np.random.randn(100)
plt.hist(
    ds3,
    alpha=.8, # 0-1 transparency
    bins=10, # int -- number of equal bins (default 10), list -- edges of bins ([1,2,3,4])
    histtype='bar', # bar (traditional), barstacked, step (generates lineplot), stepfilled
    align='mid', # left (centered on left bin edge), mid, right
    orientation='vertical', # vertical, horizontal
    color='#aaaaff', # str -- color, list -- colors (1:1 color:ds ratio)
    label='label1', # str -- label, list -- labels for multiple datasets
    density=True # idk lol
)

# histogram methods
plt.xlabel('label for x')
plt.ylabel('label for y')
plt.title('histogram title')
plt.text([60, .025, 'my text here']), # x, y, text_to_display
plt.axis([40,160,0,0.03]) # xmin, xmax, ymin, ymax
plt.show()

# ---------------
# seaborn (jointplot)
# ---------------

# jointplot (basic)
ds1 = np.random.randn(1000)
ds2 = np.random.randn(1000)
sns.jointplot(ds1,ds2)

# jointplot (hex)
ds1 = np.random.randn(1000)
ds2 = np.random.randn(1000)
sns.jointplot(
    kind='hex', # scatter, reg, resid, kde (density), hex
    color='lavender', # color to use (matplotlib colors)
    x=ds1, # ds for x
    y=ds2, # ds for y
)

# jointplot (kde -- kernel density estimation plot)
ds1 = np.random.randn(1000)
ds2 = np.random.randn(1000)
sns.jointplot(
    kind='kde', # scatter, reg, resid, kde (density), hex
    color='indigo', # color to use (matplotlib colors)
    x=ds1, # ds for x
    y=ds2, # ds for y
)

# ---------------
# seaborn (rugplot)
# ---------------

# rugplot (plot an array of datapoints as sticks on an axis)
ds1 = np.random.randn(100)
sns.rugplot(ds1, height=1, axis='x', color='fuchsia')

# rugplot with histogram
ds1 = np.random.randn(100)
plt.hist(ds1, density=True,color='lightblue',alpha=.5,bins=[-3,-2,-1,0,1,2,3])
sns.rugplot(ds1, height=.05, axis='x', color='black')

# ---------------
# seaborn (kde)
# ---------------

# kde (kernal density estimation plot) (probability density function)
    # gaussian distribution plots on every data point -- sum of gaussian curves.

# manual kde (create kernels)
ds1 = np.random.randn(100) # data set
sns.rugplot(ds1)
x_min = ds1.min() - 2 # left bound
x_max = ds1.max() + 2 # right bound
x_axis = np.linspace(x_min, x_max, 100) # 100 equally spaced points between min/max
bandwidth = ((4 * (ds1.std() ** 5)) / (3 * len(ds1)))**(1/5) # bandwidth
kernel_list = []
for data_point in ds1:
    # create kernel for each point, append to kernel_list
    kernel = stats.norm(data_point, bandwidth).pdf(x_axis)
    kernel_list.append(kernel)
    # scale for plotting
    kernel = kernel / kernel.max()
    kernel = kernel * 0.4
    # plot
    plt.plot(x_axis, kernel, color='black', alpha=0.5)
# limit y axis
plt.ylim(0,1)

# manual kde (sum kernels)
sum_of_kde = np.sum(kernel_list, axis=0) # get sum
fig = plt.plot(x_axis, sum_of_kde, color='indigo') # plot sum
sns.rugplot(ds1) # rugplot
plt.yticks([]) # clear ticks
plt.suptitle('Sum of basis functions')

# seaborn kde (various bandwidths)
ds1 = np.random.randn(100) # data set
sns.kdeplot(ds1, color='black') # auto bw
for bw in np.arange(.5, 2, .25):
    sns.kdeplot(ds1, bw=bw, lw=1.8, label=bw) # manual bw

# seaborn kde (different kernels)
ds1 = np.random.randn(100) # data set
kernel_options = ['biw', 'cos', 'epa', 'gau', 'tri', 'triw']
for k in kernel_options:
    sns.kdeplot(ds1, kernel=k, label=k)

# cdf (cumulative distribution function)
ds1 = np.random.randn(100) # data set
sns.kdeplot(ds1, cumulative=True) 

# kde (multivariate) (DEPRECATED)
mean = [0,0] # mean
cov = [[1,0], [0,100]] # covariance
ds2 = np.random.multivariate_normal(mean=mean, cov=cov, size=1000) # multivariate normal distribution
df1 = pd.DataFrame(ds2, columns=['X','Y']) # dataset as dataframe
sns.kdeplot(df1) # kdeplot of dataframe

# kde (multivariate) (multiple vectors)
mean = [0,0] # mean
cov = [[1,0], [0,100]] # covariance
ds2 = np.random.multivariate_normal(mean=mean, cov=cov, size=1000) # multivariate normal distribution
df1 = pd.DataFrame(ds2, columns=['X','Y']) # dataset as dataframe
sns.kdeplot(df1['X'], df1['Y'], shade=True)

# kde (jointplot)
mean = [0,0] # mean
cov = [[1,0], [0,100]] # covariance
ds2 = np.random.multivariate_normal(mean=mean, cov=cov, size=1000) # multivariate normal distribution
df1 = pd.DataFrame(ds2, columns=['X','Y']) # dataset as dataframe
sns.jointplot('X', 'Y', df1, kind='kde')

# ---------------
# seaborn (combining plot styles)
# ---------------

# distplot (histogram + kde)
ds1 = np.random.randn(100)
sns.distplot(ds1, bins=25) # bins default 10

# distplot (histogram + kde + rugplot)
ds1 = np.random.randn(100)
sns.distplot(
    ds1, 
    hist=True, hist_kws={'color': 'lightblue', 'label': 'hist'},
    kde=True, kde_kws={'color': 'lightgreen', 'label': 'kde'},
    rug=True, rug_kws={'color': 'lightgray', 'label': 'rug'}
)

# distplot (with series)
ds1 = np.random.randn(100)
srs1 = pd.Series(ds1, name='ds1')
sns.distplot(srs1, bins=25)

# ---------------
# box and violin plots
# ---------------

# box plot
    # 5 key components
        # first quartile, median, third quartile
        # min (Q1 - 1.5 * IQR, not lowest value), max (Q3 + 1.5 * IQR, not highest value)
            # IQR -- interquartile range (distance between Q1 & Q3)
            # outliers lie beyond min/max
    # ends cover min/max, box covers first-third quartile, line over median

ds1 = np.random.randn(100)
ds2 = np.random.randn(100)
sns.boxplot(data=[ds1, ds2])
sns.boxplot(data=[ds1, ds2], whis=np.inf) # use outliers instead of min/max

# violin plot
ds1 = stats.norm(0,5).rvs(100) # normal distribution, 100 points
ds2 = np.concatenate([
    stats.gamma(5).rvs(50) - 1,
    stats.gamma(5).rvs(50) * (-1)
]) # gamma distribution, 50 points

sns.boxplot(data=[ds1,ds2]) # boxplot (why we may need violin plot)
sns.violinplot(data=[ds1,ds2], inner='quartile') # inner -- quartile, point, stick

# violin plot (version 2)
tips = sns.load_dataset('tips') # example dataset (df)
tips['tip_pct'] = 100*(tips['tip']/tips['total_bill'])
sns.violinplot(x='size', y='tip_pct', data=tips, inner='quartile')

# ---------------
# regression plots
# ---------------

# linear regression
tips = sns.load_dataset('tips') # example dataset (df)
tips.head() # first 5 rows
sns.lmplot(x='total_bill', y='tip', data=tips) # col1, col2, df

# linear regression (custom)
tips = sns.load_dataset('tips') # example dataset (df)
sns.lmplot(
    x='total_bill', y='tip', data=tips,
    scatter_kws={'marker':'o', 'color':'indianred'},
    line_kws={'linewidth':1, 'color':'blue'}
)

# polynomial regression (higher order polynomials)
tips = sns.load_dataset('tips') # example dataset (df)
sns.lmplot(x='total_bill', y='tip', data=tips, order=3) # third order polynomial

# linear regression (no fit)
tips = sns.load_dataset('tips') # example dataset (df)
tips['tip_pct'] = 100*(tips['tip']/tips['total_bill'])
sns.lmplot(x='total_bill', y='tip_pct', data=tips, fit_reg=False)

# linear regression (discrete)
tips = sns.load_dataset('tips') # example dataset (df)
tips['tip_pct'] = 100*(tips['tip']/tips['total_bill'])
sns.lmplot(x='size', y='tip_pct', data=tips) # size of party, tip percent

# linear regression (jitter) (spreads discrete values)
tips = sns.load_dataset('tips') # example dataset (df)
tips['tip_pct'] = 100*(tips['tip']/tips['total_bill'])
sns.lmplot(x='size', y='tip_pct', data=tips, x_jitter=.1)

# linear regression (estimator)
tips = sns.load_dataset('tips') # example dataset (df)
tips['tip_pct'] = 100*(tips['tip']/tips['total_bill'])
sns.lmplot(x='size', y='tip_pct', data=tips, x_estimator=np.mean)

# linear regression (estimator) (order)
tips = sns.load_dataset('tips') # example dataset (df)
tips['tip_pct'] = 100*(tips['tip']/tips['total_bill'])
sns.lmplot(x='size', y='tip_pct', data=tips, x_estimator=np.mean, order=2)

# linear regression (hue) (categorize)
tips = sns.load_dataset('tips') # example dataset (df)
tips['tip_pct'] = 100*(tips['tip']/tips['total_bill'])
sns.lmplot(x='total_bill', y='tip_pct', data=tips, hue='day') # categorize by day

# local regression (LOESS)
tips = sns.load_dataset('tips') # example dataset (df)
tips['tip_pct'] = 100*(tips['tip']/tips['total_bill'])
sns.lmplot(x='total_bill', y='tip_pct', data=tips, lowess=True)

# regplot 
tips = sns.load_dataset('tips') # example dataset (df)
tips['tip_pct'] = 100*(tips['tip']/tips['total_bill'])
sns.regplot(x='total_bill', y='tip_pct', data=tips)

# regplot + violinplot (subplots)
tips = sns.load_dataset('tips') # example dataset (df)
tips['tip_pct'] = 100*(tips['tip']/tips['total_bill'])
fig, (axis1, axis2) = plt.subplots(nrows=1, ncols=2, sharey=True)
sns.regplot(x='total_bill', y='tip_pct', data=tips, ax=axis1)
sns.violinplot(x='size', y='tip_pct', data=tips, ax=axis2, inner='quartile')


# ---------------
# heatmaps & clustered matrices
# ---------------

# heatmap
df_flight = sns.load_dataset('flights') # sample dataset (df)
df_flight = df_flight.pivot(index='month', columns='year', values='passengers') # pivot table
sns.heatmap(df_flight)

# heatmap (center) (value at center is neutral, values diverge from there)
df_flight = sns.load_dataset('flights') # sample dataset (df)
df_flight = df_flight.pivot(index='month', columns='year', values='passengers') # pivot table
sns.heatmap(df_flight, center=df_flight.loc['January',1955])

# heatmap + barplot (subplots)
df_flight = sns.load_dataset('flights') # sample dataset (df)
df_flight = df_flight.pivot(index='month', columns='year', values='passengers') # pivot table
fig, (axis1, axis2, axis3) = plt.subplots(nrows=3,ncols=1)
srs_fpy = df_flight.sum() # sum of flights per year
srs_years = pd.Series(srs_fpy.index.values)
df_years = pd.DataFrame(srs_years)
srs_flights = pd.Series(srs_fpy.values)
df_flights = pd.DataFrame(srs_flights)
df1 = pd.concat((df_years, df_flights), axis=1)
df1.columns = ['YEAR', 'FLIGHTS']

sns.barplot(x='YEAR', y='FLIGHTS', data=df1, ax=axis1)
sns.heatmap(df_flight, cmap='Blues', ax=axis2, cbar_ax=axis3, cbar_kws={'orientation':'horizontal'})

# cluster map (matrix cluster grid) (group like cols/rows together) 
df_flight = sns.load_dataset('flights') # sample dataset (df)
df_flight = df_flight.pivot(index='month', columns='year', values='passengers') # pivot table
sns.clustermap(df_flight) # args: col_cluster, row_cluster, standard_scale, z_score
sns.clustermap(df_flight, col_cluster=False) # only cluster rows
sns.clustermap(df_flight, row_cluster=False) # only cluster cols

# ---------------
# categorical plot
# ---------------

import statsmodels.api as sm
# dataset as df
df1 = sm.datasets.fair.load_pandas().data
# create 'Had_Affair' col
df1['Had_Affair'] = df1['affairs'].apply(lambda x: 0 if x==0 else 1)
# compare
df2 = df1.groupby('Had_Affair').mean().applymap(lambda x: round(x,1))
# plot (categorical plot)
sns.catplot(x='age', data=df1, kind='count', hue='Had_Affair', palette='coolwarm')


# ---------------
# sns.pairplot
# ---------------

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


# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------
