from io import StringIO
from typing import List, TypedDict
from uuid import UUID
import numpy as np
import pandas as pd

# ---
# series
# ---


def basic_series():
    # Default index
    srs1 = pd.Series([1, 2, 3, 4])  # 0 1 2 3 # 1 2 3 4
    srs2 = pd.Series([1, 2, 3, 4])
    srs1.values  # array([ 1, 2, 3, 4 ])
    srs1.index  # RangeIndex(start=0, stop=4, step=1)
    srs1[0]  # 1
    srs1 = srs1.append(srs2)  # concatenate series

    # With index
    srs1 = pd.Series([1, 2, 3, 4, 5], index=['a', 'b', 'c', 'd', 'e'])
    srs1  # a b c d e # 1 2 3 4 5
    srs1.values  # array([ 1, 2, 3, 4, 5 ])
    srs1.index  # Int64Index([ 'a', 'b', 'c', 'd', 'e' ], dtype='object')
    srs1['a']  # 1
    srs1[0:3]  # a b c d # 1 2 3 4
    srs1[['a', 'b', 'c']]  # a b c # 1 2 3
    srs1[srs1 == 2]  # b 2
    srs1[srs1 != 2]  # a c d e # 1 3 4 5
    srs1[~(srs1 == 2)]  # a c d e # 1 3 4 5
    srs1[(srs1.gt(1)) & (srs1.lt(4))]  # b c # 2 3
    srs1[(srs1.lt(2)) | (srs1.gt(4))]  # a e # 1 5

    srs2[~(srs2.isin(srs1))]  # return srs2 elements that aren't in srs1

    # Convert series
    srs = pd.Series([1, 2, 3, 4, 5], index=['a', 'b', 'c', 'd', 'e'])
    dict1 = srs.to_dict()  # series to dict
    srs.to_csv('file_name.csv')  # series to csv
    srs.to_json()  # series to json
    srs.to_list()  # series to list (values)

    # Series from dict
    pd.Series(dict1)  # dict to series

    # Naming a series
    srs = pd.Series([1, 2, 3, 4, 5], index=['a', 'b', 'c', 'd', 'e'])
    srs.name = 'My Series'
    srs.index.name = 'Letters'


def basic_series_methods():
    srs1 = pd.Series([1, 2, 3, 4])  # 0 1 2 3 # 1 2 3 4
    srs2 = pd.Series([1, 2, 3, 4])

    # math methods
    srs1.abs()  # return series with absolute value of each element
    srs1.round()  # round each elem to number of decimals (0 if no arg passed)
    srs1.add(srs2)  # return series with (element-wise) sum of two series
    srs1.mul(srs2)  # return series with (element-wise) product of two series
    srs1.div(srs2)  # return series with (element-wise) float division of two series

    # comparison methods
    srs1.gt(srs2)  # elem1 > elem2 (element-wise), returns series of booleans
    srs1.ge(srs2)  # elem1 >= elem2 (element-wise), returns series of booleans
    srs1.lt(srs2)  # elem1 < elem2 (element-wise), returns series of booleans
    srs1.le(srs2)  # elem1 <= elem2 (element-wise), returns series of booleans
    srs1.eq(srs2)  # elem1 == elem2 (element-wise), returns series of booleans
    srs1.ne(srs2)  # elem1 != elem2 (element-wise), returns series of booleans

    # boolean methods
    srs1.any()  # are any elements in the series True
    srs1.all()  # are all elements in the series True

    # stats methods
    srs1.count()  # number of (non-null, non-NaN) observations in the series
    srs1.sum()  # return sum of series
    srs1.max()  # return max value of series
    srs1.min()  # return min value of series
    srs1.mean()  # return mean of series
    srs1.mode()  # return mode of series
    srs1.std()  # return standard deviation of series
    srs1.var()  # return (unbiased) variance of series
    srs1.agg(['min', 'max', 'mean'])  # return series with min/max/mean values

    # misc methods
    srs1.copy()  # create copy of series
    srs1.between(1, 4)  # 1 <= elem <= 4 (element-wise), returns series of booleans
    srs1.clip(0, 10)  # elem < 0 ? 0 : elem; elem > 10 ? 10 : elem (returns series)
    srs1.isin(srs1)  # elem1 in srs2 ? True : False (returns series of booleans)
    srs1.unique()  # return series with only unique values
    srs1.value_counts()  # returns series -- srs.values as index, counts as values


# ---
# dataframes
# ---

def basic_df_io():
    # clipboard (read)
    df = pd.read_clipboard()  # read from clipboard (pip install xsel)
    # csv (write/read)
    csv = df.to_csv('data.csv')  # writes csv file
    df = pd.read_csv('data.csv')  # read from csv file (path as arg)
    df = pd.read_csv(
        'data.csv',
        index_col=0,  # None -- no col provided, 0 -- use col index 0 as index
        header=0  # None -- no header provided, 0 -- use row index 0 as header
    )
    df = pd.read_csv(
        'data.txt',
        header=None,
        names=['col1', 'col2', 'col3', 'col4', 'col5']  # column headers
    )
    # json (write/read)
    json = df.to_json('data.json', orient='split')  # writes json file (split formatted)
    df = pd.read_json('data.json', orient='split')
    # dict (read/write)
    df = pd.DataFrame.from_dict(
        {'row1': [0, 1, 2, 3], 'row2': [4, 5, 6, 7], 'row3': [8, 9, 10, 11]},
        orient='index',
        columns=['col1', 'col2', 'col3', 'col4']
    )
    df.to_dict()
    # excel (write/read) (pip install xlrd openpyxl)
    df.to_excel('data.xlsx', sheet_name='Sheet1')
    df = pd.read_excel(
        'data.xlsx',
        index_col=0,  # None -- no col provided, 0 -- use col index 0 as index
        header=0,  # None -- no header provided, 0 -- use row index 0 as header
        sheet_name=0  # index -- 0, string -- 'Sheet1'
    )


class Ninja(TypedDict):
    id: UUID
    first_name: str
    last_name: str
    age: int


NINJAS_RECORDS: List[Ninja] = [
    {'id': UUID('fa6c4c93-fb64-4cd7-8b21-0e5e0f717fd6'), 'first_name': 'Kakashi', 'last_name': 'Hatake', 'age': 27},
    {'id': UUID('2c6c74c3-b9d6-4d49-a113-4f1a8164abe3'), 'first_name': 'Tenzo', 'last_name': 'Yamato', 'age': 26},
    {'id': UUID('2e9093d5-f466-40bb-be14-993276f0a497'), 'first_name': 'Iruka', 'last_name': 'Umino', 'age': 25},
    {'id': UUID('71547b9d-f28e-4511-b767-860bc37f148f'), 'first_name': 'Itachi', 'last_name': 'Uchiha', 'age': 21},
]

ninjas_dtypes = {'id': 'str', 'first_name': 'str', 'last_name': 'str', 'age': 'int64'}


def basic_df_attributes():
    df = pd.DataFrame(NINJAS_RECORDS)

    df  # displays table as dataframe
    df.columns  # show column labels
    df.ColumnName  # returns series of column values
    df['Column Name']  # returns series of column values
    df.index  # show row labels
    df.shape  # show dimensions as tuple
    df.size  # show number of elements as integer
    df.dtypes  # underlying types used


def basic_df_creation():
    # create df (dictionary) (columns)
    df = pd.DataFrame.from_dict(
        {'col1': [0, 1, 2, 3], 'col2': ['a', 'b', 'c', 'd']}
    )

    # create df (dictionary) (rows)
    df = pd.DataFrame.from_dict(
        {'row1': [0, 1, 2, 3], 'row2': [4, 5, 6, 7], 'row3': [8, 9, 10, 11]},
        orient='index',
        columns=['col1', 'col2', 'col3', 'col4']
    )

    # create df (nested array)
    df = pd.DataFrame(
        [[0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24]],
        index=['a', 'b', 'c', 'd', 'e'],
        columns=['col1', 'col2', 'col3', 'col4', 'col5']
    )
    # create df (np.arange)
    df = pd.DataFrame(
        np.arange(25).reshape(5, 5),
        index=['a', 'b', 'c', 'd', 'e'],
        columns=['col1', 'col2', 'col3', 'col4', 'col5']
    )
    # select df
    df['col1']  # column col1
    df[['col1', 'col2', 'col3']]  # columns col1 n2 n3
    df[(df['col3'].lt(20)) & (df['col3'].gt(5))]  # rows b c d

# ---
# df indexing (at, loc, iat, iloc)
# ---


def basic_df_indexing():
    # loc -- arrays as indexers, can assign new columns/indices, slower
    # iloc -- arrays as indexers, cannot assign new columns/indices, slower
    # at -- no arrays as indexers, can assign new columns/indices, faster
    # iat -- no arrays as indexers, cannot assign new columns/indices, faster

    df = pd.DataFrame(NINJAS_RECORDS)

    # indexing
    df['first_name']  # returns column as series
    df[['first_name', 'last_name']]  # returns columns as df

    # loc
    df.loc[1]  # returns row as series (index)
    df.loc[[1, 2, 3]]  # returns rows as df (list of indices)

    df.loc[4, 'first_name']  # returns value at specific index/column (index, column)
    df.loc[1:4, 'last_name']  # returns series of values (row slice, column)

    # loc (set)
    df.loc[1, 'first_name'] = 'Kaka'  # set a value
    df.loc[:, 'village'] = 'Hidden Leaf'  # set all values for row
    df.loc[1:4, 'age'] = 30  # set values for a slice

    # iloc (purely integer based loc)
    df.iloc[4]  # returns row as series (index)
    df.iloc[[4, 5, 6]]  # returns rows as df (list of indices)
    df.iloc[0:3]  # return slice as df (slice of indices)
    df.iloc[4, 5]  # return value at specific index/column (index, column)
    df.iloc[0:2, 0:3]  # return row/column slices as df (row slice, col slice)

    # iloc (set)
    df.iloc[0, 2] = 'Sensei'  # set a value (row 0, column 2)
    df.iloc[1:4, 4] = 29  # set values for a slice

    # at
    df.at[1, 'first_name']  # value at specific index/column
    df.at[1, 'first_name'] = '?'  # set value at specific index/column

    # iat (purely integer based at)
    df.iat[0, 1]  # value at specific index/column
    df.iat[0, 1] = 'Kakashi'  # set value at specific index/column

    # loc + at
    df.loc[4].at['last_name']  # value within a series (loc + at)


def basic_df_methods():
    df = pd.DataFrame(NINJAS_RECORDS)

    df1 = pd.DataFrame(np.ones((5, 5)))
    df2 = pd.DataFrame(np.arange(25).reshape(5, 5))

    # math
    df1.abs()  # return df containing abs value of each element
    df1.add(df2)  # elem1 + elem2 (element-wise), return df
    df1.sub(df2)  # elem1 - elem2 (element-wise), return df
    df1.mul(df2)  # elem1 * elem2 (element-wise), return df
    df1.div(df2)  # elem1 / elem2 (element-wise), return df

    # comparison
    df1.gt(df2)  # elem1 > elem2 ? True : False (return df)
    df1.ge(df2)  # elem1 >= elem2 ? True : False (return df)
    df1.lt(df2)  # elem1 < elem2 ? True : False (return df)
    df1.le(df2)  # elem1 <= elem2 ? True : False (return df)

    # stats (aggregate) (default -- columns)
    df2.describe()  # returns df with count/mean/std/min/max/etc of each column
    df2.sum()  # returns series of sums
    df2.sum(axix=1)  # returns series of sums (rows instead of columns)
    df2.prod()  # returns series of products
    df2.max()  # returns series of max values (df.idxmax -- index)
    df2.min()  # returns series of min values (df.idxmin -- index)
    df2.mean()  # returns series of means
    df2.median()  # returns series of medians
    df2.mode()  # returns series of modes
    df2.std()  # returns series of std
    df2.var()  # returns series of var
    df2.count()  # returns series of element counts
    df2.agg(['sum', 'mean'])  # returns df (multiple series of aggregates)
    df2.agg(['sum', 'min', 'max', 'mean', 'median', 'std', 'count'])

    # column (series) methods
    df['age'].mean()  # returns single value (mean of col) (mean of series)
    df['age'].max()  # returns single value (mean of col) (mean of series)
    df['age'].min()  # returns single value (mean of col) (mean of series)

    # misc
    df.T  # transpose axes
    df.head()  # show first 5 rows, df.head(3) shows 3 rows
    df.tail()  # show last 5 rows, df.tail(3) shows 3 rows


# ---
# misc
# ---


def misc_series():
    srs1 = pd.Series([1, 2, 3, 4, 5], index=['a', 'b', 'c', 'd', 'e'], dtype=np.int64)

    # copy series
    srs2 = srs1.copy()

    # filter
    srs2[srs2.gt(2)]  # c d e # 3 4 5

    # membership testing
    1 in srs2  # True

    # adding series
    srs = pd.Series([1, 2, 3, 4, 5], index=['a', 'b', 'c', 'd', 'e'])
    srs2 = srs.add(srs)  # a b c d e # 2 4 6 8 10

    # series reindexing
    srs1 = pd.Series([1, 2, 3, 4, 5], index=['a', 'b', 'c', 'd', 'e'])
    srs1.reindex(['a', 'b', 'c', 'd', 'e', 'f'])  # e & f will be NaN
    srs1.reindex(['a', 'b', 'c', 'd', 'e', 'f'], fill_value=0)  # e & f will be 0

    # drop entry
    srs = pd.Series([1, 2, 3, 4, 5], index=['a', 'b', 'c', 'd', 'e'])
    srs.drop('b')

    # data alignment
    srs1 = pd.Series([1, 2, 3, 4, 5], index=['a', 'b', 'c', 'd', 'e'])
    srs2 = pd.Series([1, 2, 3, 4, 5, 6], index=['a', 'b', 'c', 'd', 'e', 'f'])
    srs1.add(srs2)  # a-e (normal) f (NaN)

    # sorting
    srs = pd.Series([1, 2, 3, 4, 5], index=['a', 'b', 'c', 'd', 'e'])
    srs.sort_index()  # sort by indices
    srs.sort_index(ascending=False, inplace=True, na_position='last')  # add args
    srs.sort_values()  # order by values
    srs.sort_values(ascending=False, inplace=False, na_position='last')  # add args

    # testing null (isna, notna)
    srs.isnull()  # returns series of booleans (null ? True : False)
    srs.notnull()  # returns series of booleans (value_exists ?  True : False)

    # omit null values
    srs = pd.Series([1, 2, 3, 4, 5], index=['a', 'b', 'c', 'd', 'e'])
    srs['c'] = np.nan
    srs.dropna()  # drop NaN values
    srs[srs.notnull()]  # filter out NaN values

    # index hierarchy (levels)
    srs = pd.Series(np.arange(6),
                    index=[[1, 1, 1, 2, 2, 2], ['a', 'b', 'c', 'a', 'b', 'c']]
                    )  # 1a 1b 1c 2a 2b 2c
    srs[1]  # a b c # 0 1 2 (series)
    srs[:, 'a']  # 1 2 # 0 4 (all higher-level index, lower-level index 'a')
    srs[1]['a']  # 0 (value)

    # concatenate series
    srs1 = pd.Series([0, 1, 2], index=['a', 'b', 'c'])
    srs2 = pd.Series([4, 5, 6], index=['d', 'e', 'f'])
    srs = pd.concat([srs1, srs2], axis=0)

    # combine series
    srs1 = pd.Series([1, 1, np.nan, 1, 1], index=['a', 'b', 'c', 'd', 'e'])
    srs2 = pd.Series([1, 2, 3, 4, 5], index=['a', 'b', 'c', 'd', 'e'])
    srs1.combine_first(srs2)  # combine, srs1 overrides srs2

# ---
# dataframes (misc)
# ---


def misc_df():
    df = pd.DataFrame(NINJAS_RECORDS)
    # copy df
    df.copy()

    # rename columns
    df.rename(columns={'id': 'ID', 'first_name': 'First Name', 'last_name': 'Last Name', 'age': "Age"})
    df.rename(columns=lambda x: x.strip())  # strip whitespace from headers

    # copy a df (choose existing columns)
    pd.DataFrame(df, columns=['col1', 'col2', 'col4'])
    # copy a df (new column -- each element will have value NaN)
    pd.DataFrame(df, columns=['col1', 'NewColumn'])

    # assign value to each element in a column
    df['Column Name'] = "New Value"
    df['Column Name'] = np.arange(df.shape[0])

    # use value/index (as series) to update a value in a specific column
    # in a specific column, values (at associated indices) will be replaced
    value = pd.Series(['New Value'], index=[4])
    values = pd.Series(['val1, val2'], index=[0, 2])
    df['Column Name'] = value
    df['Column Name'] = values

    # delete column
    del df['Unwanted Column']  # in-place only
    df.drop(['Unwanted Column 1', 'Unwanted Column 2'], axis=1)

    # reindex df (reindex) (TODO: update this)
    df1 = pd.DataFrame(
        np.random.randn(25).reshape(5, 5),
        index=['a', 'b', 'c', 'd', 'e'],
        columns=['col1', 'col2', 'col3', 'col4', 'col5']
    )
    df2 = df1.reindex(['a', 'b', 'c', 'd', 'e', 'f'], fill_value=0)
    df3 = df2.reindex(columns=['col1', 'col2', 'col3', 'col4', 'col5', 'col6'], fill_value=0)

    # df.drop()
    df = pd.DataFrame(
        np.arange(25).reshape(5, 5),
        index=['a', 'b', 'c', 'd', 'e'],
        columns=['col1', 'col2', 'col3', 'col4', 'col5']
    )
    df = df.drop('c')  # drop row
    df = df.drop('col3', axis=1)  # drop column

    # data alignment
    df1 = pd.DataFrame(
        np.arange(25).reshape(5, 5),
        index=['a', 'b', 'c', 'd', 'e'],
        columns=['col1', 'col2', 'col3', 'col4', 'col5']
    )
    df2 = pd.DataFrame(
        np.arange(36).reshape(6, 6),
        index=['a', 'b', 'c', 'd', 'e', 'f'],
        columns=['col1', 'col2', 'col3', 'col4', 'col5', 'col6']
    )
    df1.add(df2)  # adds where row/col match, else NaN
    df1.add(df2, fill_value=0)  # fills empty elements (df1) prior to adding

    # add series to df
    srs1 = pd.Series([1, 2, 3, 4, 5], index=['col1', 'col2', 'col3', 'col4', 'col5'])
    df1 = pd.DataFrame(
        np.arange(1, 26, 1).reshape(5, 5),
        index=['a', 'b', 'c', 'd', 'e'],
        columns=['col1', 'col2', 'col3', 'col4', 'col5']
    )
    df1.add(srs1)  # srs1 will be added to each row of df1

    # sorting
    df1 = pd.DataFrame(
        np.arange(1, 26, 1).reshape(5, 5),
        index=['a', 'b', 'c', 'd', 'e'],
        columns=['col1', 'col2', 'col3', 'col4', 'col5']
    )
    df.sort_index()
    df.sort_values(by=['col1'])  # sort by values of col1
    df.sort_values(by=['col1'], ascending=False, inplace=True, na_position='last')
    df.sort_values(by=['col1', 'col2'])  # primary sort - col1, secondary sort - col2

    # missing values (NaN)
    df = pd.DataFrame(
        np.arange(1, 26, 1).reshape(5, 5),
        index=['a', 'b', 'c', 'd', 'e'],
        columns=['col1', 'col2', 'col3', 'col4', 'col5']
    )
    df.loc['b', 'col2'] = np.nan  # assign NaN
    df.dropna()  # drops all rows with NaN values
    df.dropna(how='all')  # drops all rows with all NaN values
    df.dropna(axis=1)  # drops all cols with NaN values
    df.dropna(thresh=3)  # drops all rows with less than 3 real data points
    df.fillna(1)  # fill all NaN with 1
    df.fillna({'col1': 0, 'col2': 1})  # column-specific fills

    # df from multi-level series (higher-level index as row, lower-level as col)
    srs = pd.Series(np.arange(6),
                    index=[[1, 1, 1, 2, 2, 2], ['a', 'b', 'c', 'a', 'b', 'c']]
                    )
    df = srs.unstack()  # rows -- 1 2 # cols -- a b c

    # merge df
    df1 = pd.DataFrame.from_dict(
        {'row1': ['Landon', 26], 'row2': ['Kakashi', 27], 'row3': ['Iruka', 26], 'row4': ['Yamato', 26]},
        orient='index',
        columns=['Name', 'Age']
    )
    df2 = pd.DataFrame.from_dict(
        {'row1': ['Landon', 'Guitar'],
         'row2': ['Kakashi', 'Reading'],
         'row3': ['Iruka', 'Teaching'],
         'row4': ['Yamato', 'Carpentry']},
        orient='index', columns=['Name', 'Hobby'])
    # merge (3 methods)
    df3 = df1.merge(
        df2,
        how='inner',  # inner -- matches only, outer -- all, left -- all left rows, right -- all right rows
        on='Name',  # merge on 'Name' col (merge by multiple columns -- on=['First Name','Last Name'])
    )
    df3 = df1.merge(
        df2,
        how='inner',  # inner -- matches only, outer -- all, left -- all left rows, right -- all right rows
        left_on='Name',  # join left table by 'Name'
        right_on='Name'  # join right table by 'Name' (join by index col -- right_index=True )
    )
    df3 = pd.merge(
        df1, df2,  # DFs to use
        on='Name',  # merge on 'Name' col
        how='inner'  # inner -- matches only, outer -- all, left -- all left rows, right -- all right rows
    )

    # concatenate df
    df1 = pd.DataFrame(
        np.arange(1, 26, 1).reshape(5, 5),
        index=['a', 'b', 'c', 'd', 'e'],
        columns=['col1', 'col2', 'col3', 'col4', 'col5']
    )
    df2 = pd.DataFrame(
        np.arange(26, 51, 1).reshape(5, 5),
        index=['f', 'g', 'h', 'i', 'j'],
        columns=['col1', 'col2', 'col3', 'col4', 'col5']
    )
    df = pd.concat(
        [df1, df2],
        axis=0,  # 0 -- add rows, 1 -- add cols
        ignore_index=False,  # ignores old indices, creates new ones
        join='outer'  # outer -- use all col, inner -- only use shared col
    )

    # combine df
    df1 = pd.DataFrame(
        [[1, 1, np.nan], [1, np.nan, 1], [1, 1, np.nan]],
        index=['a', 'b', 'c', ],
        columns=['col1', 'col2', 'col3']
    )
    df2 = pd.DataFrame(
        [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
        index=['a', 'b', 'c', ],
        columns=['col1', 'col2', 'col3']
    )
    df = df1.combine_first(df2)  # combine, df1 overrides df2 (if conflict)

    # stack/unstack (single-level df --> multilevel series)
    df = pd.DataFrame(
        np.arange(8).reshape(2, 4),  # 2 rows, 4 cols
        index=['a', 'b'],
        columns=['i', 'ii', 'iii', 'iv']
    )
    srs = df.stack()  # multilevel series (keep null values -- dropna=False)
    df = srs.unstack()  # df

    # stack/unstack (multilevel series -- > df)
    srs1 = pd.Series([1, 2, 3, 4, 5], index=['a', 'b', 'c', 'd', 'e'])
    srs2 = pd.Series([1, 2, 3, 4, 5], index=['a', 'b', 'c', 'd', 'e'])
    srs = pd.concat([srs1, srs2], keys=['i', 'ii'])  # multilevel series
    df = srs.unstack()  # df

    # pivot tables (turn two col into index/col)
    df = pd.DataFrame.from_dict(
        {
            'row1': ['a', 1, 14],
            'row2': ['a', 2, 27],
            'row3': ['a', 3, 21],
            'row4': ['b', 1, 12],
            'row5': ['b', 2, 16],
            'row6': ['b', 3, 25],
            'row7': ['c', 1, 14],
            'row8': ['c', 2, 19],
            'row9': ['c', 3, 26],
        },
        orient='index',
        columns=['col1', 'col2', 'col3']
    )
    df = df.pivot('col1', 'col2', 'col3')  # index, col, val

    # find duplicates df
    df = pd.DataFrame({'col1': ['a', 'a', 'a', 'b', 'b', 'b'], 'col2': [1, 1, 2, 1, 1, 2]})  # 5 rows, 2 cols
    df.duplicated()  # duplicate ? true : false (returns series of booleans)
    df[~df.duplicated()]  # df with duplicates removed
    df.drop_duplicates()  # drop duplicates

    # map df (map one column)
    df = pd.DataFrame(
        np.arange(1, 26, 1).reshape(5, 5),
        index=['a', 'b', 'c', 'd', 'e'],
        columns=['col1', 'col2', 'col3', 'col4', 'col5']
    )
    df['col1'] = df['col1'].map(lambda x: x**2)
    df['col1'] = df['col1'].map(lambda x: f'number: {x}')

    # applymap df (map entire df)
    df = pd.DataFrame(
        np.arange(1, 26, 1).reshape(5, 5),
        index=['a', 'b', 'c', 'd', 'e'],
        columns=['col1', 'col2', 'col3', 'col4', 'col5']
    )
    df = df.applymap(lambda x: x**2)
    df = df.applymap(lambda x: f'number: {x}')

    # replace
    df = pd.DataFrame(
        np.arange(1, 26, 1).reshape(5, 5),
        index=['a', 'b', 'c', 'd', 'e'],
        columns=['col1', 'col2', 'col3', 'col4', 'col5']
    )
    df.replace(5, 6)  # replace 5 with 6
    df.replace([1, 2, 3, 4], 5)  # replace 1,2,3,4 with 5
    df.replace([1, 2, 3, 4], [4, 3, 2, 1])  # 1 to 4, 2 to 3, etc
    df.replace({4: 5})  # replace 4 with 5 (replace with dictionary)

    # rename index & column (map)
    df = pd.DataFrame(
        np.arange(1, 13, 1).reshape(3, 4),  # 3 rows, 4 cols
        index=[1, 2, 3],
        columns=[' col1', ' col2', ' col3', ' col4']
    )
    df.index = df.index.map(lambda x: x + 1)  # increase all index by one
    df.columns = df.columns.map(lambda x: x.strip())  # strip whitespace
    df.columns = df.columns.map(lambda x: x.replace('col', 'column'))  # 'col' to 'column'
    df.columns = df.columns.map(lambda x: x.upper())  # cols to uppercase

    # rename index & column (rename)
    df = pd.DataFrame(
        np.arange(1, 13, 1).reshape(3, 4),  # 3 rows, 4 cols
        index=[1, 2, 3],
        columns=[' col1', ' col2', ' col3', ' col4']
    )
    df.rename(index=lambda x: x + 1, columns=lambda x: x.strip().capitalize())

    # binning (bin edges as list)
    numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    bins = [0, 5, 10, 15, 20]
    nums_cat = pd.cut(
        numbers,  # list
        bins  # bins (list of bin edges)
    )
    nums_cat.categories  # list of bins
    nums_cat.value_counts()  # series (index -- bins, values -- counts)

    # binning (number of bins as int)
    numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    nums_cat = pd.cut(
        numbers,  # list
        3,  # bins
        precision=0,  # number of decimals (bins) (default 3)
        labels=['small', 'medium', 'large']
    )

    # outliers
    np.random.seed(12345)
    df = pd.DataFrame(np.random.randn(5, 4))  # 5 rows, 4 cols
    df.describe()  # returns df (each col -- count, mean, std, min, %, max)

    col1 = df[0]
    col1[np.abs(col1) > 1]  # find all values in df[0] where df[0] > 1 (abs val)

    df[np.abs(df[0]) > 1]  # return df (all rows where df[0] > 1 (abs val)
    df[df.isnull().any(1)]  # return df (any row where elem == NaN)

    df[df.gt(3)] = np.sign(df) * 3  # return df (if elem > 3, elem = 3)

    # permutation
    df = pd.DataFrame(
        np.arange(1, 26, 1).reshape(5, 5),
        index=[0, 1, 2, 3, 4],
        columns=['col1', 'col2', 'col3', 'col4', 'col5']
    )
    df = df.take(np.random.permutation(5))  # shuffle indices

    # groupby df (groups rows by values)
    df = pd.DataFrame({
        'col1': ['a', 'b', 'c', 'b', 'a'],
        'col2': ['i', 'ii', 'ii', 'iii', 'iii'],
        'col3': ['A', 'C', 'B', 'C', 'A'],
        'col4': [1, 2, 3, 1, 1],
        'col5': [2, 4, 6, 8, 10]
    })
    group_obj1 = df['col4'].groupby(df['col2'])  # SeriesGroupBy object
    group_obj1.mean()  # i ii iii # 1 2.5 1 (series)

    group_obj2 = df.groupby('col1')  # SeriesGroupBy object
    group_obj2.mean()  # returns df -- index (col1), cols (col4, col5), values (mean)
    group_obj2.size()  # returns series -- index (groups), values (counts)

    group_obj3 = df.groupby(['col1', 'col2'])  # SeriesGroupBy object
    group_obj3.mean()  # returns df -- multi-level index, cols (col4, col5), values (mean)

    for group_name, group_rows in group_obj2:
        print(f"group: {group_name}")
        print(group_rows)
        print('\n')

    for (col1, col2), group_rows in group_obj3:
        print(f'col1: {col1}, col2: {col2}')
        print(group_rows)
        print('\n')

    group_dict = dict(list(group_obj2))
    group_dict['a']  # returns df (groupy by col1, show 'a' group rows)

    # groupby df (group columns by category) (using dict & using series)
    df = pd.DataFrame({
        'int1': [1, 2, 3, 1, 1],
        'int2': [2, 4, 6, 8, 10],
        'float1': [1.2, 2.3, 3.15, 1.56, 1.33],
        'float2': [2.76, 4.44, 6.57, 8.5, 10.11]
    })
    categories = {'int1': 'int', 'int2': 'int', 'float1': 'float', 'float2': 'float'}
    categories = pd.Series(
        ['int', 'int', 'float', 'float'],
        index=['int1', 'int2', 'float1', 'float2']
    )
    group_obj = df.groupby(categories, axis=1)  # SeriesGroupBy object
    sums = group_obj.sum()

    # groupby df (multi-index, group columns by level)
    cols = pd.MultiIndex.from_arrays(
        [['a', 'a', 'a', 'b', 'b'], [1, 2, 3, 1, 2]],
        names=['col', 'sub_col']
    )
    df = pd.DataFrame(
        np.arange(1, 26, 1).reshape(5, 5),
        columns=cols
    )
    group_obj = df.groupby(level=0, axis=1)
    sums = group_obj.sum()

    # split, apply, combine (apply -- apply function along axis)
    df = pd.DataFrame({
        'wine': ['a', 'a', 'a', 'b', 'b', 'c', 'c', 'c'],
        'quality': [7, 8, 10, 8, 5, 9, 7, 6],
        'percent_alc': [4.5, 6, 12, 3.75, 7, 9, 10, 5]
    })

    def ranker(df):
        df['alc_content_rank'] = np.arange(len(df)) + 1
        return df

    df.sort_values('percent_alc', ascending=False, inplace=True)
    df = df.groupby('wine').apply(ranker)
    df = df.sort_values('wine')
    df[df.alc_content_rank == 1]  # show rows with highest rank

    # io.StringIO
    data = '''\
    id,animal,intelligence
    1,dog,smart
    2,dog,smart
    3,cat,dumb
    4,cat,dumb
    5,dog,dumb
    6,cat,smart
    '''
    df = pd.read_csv(StringIO(data))

    # cross tabulation (frequency counter) (compare two columns -- similar to pivot)
    pd.crosstab(df['animal'], df['intelligence'], margins=True)

    # loc & conditional
    df.loc[df['col1'] == 'value']


def basic_multi_level_df():

    # multi-level df
    df = pd.DataFrame(
        np.arange(1, 17, 1).reshape(4, 4),
        index=[['a', 'a', 'b', 'b'], [1, 2, 1, 2]],
        columns=[['A', 'A', 'B', 'B'], ['i', 'ii', 'i', 'ii']]
    )
    df.index.names = ['primary_i', 'secondary_i']  # name higher/lower indices
    df.columns.names = ['primary_col', 'secondary_col']
    df.swaplevel()  # swap inner-most row levels
    df.swaplevel(axis=1)  # swap inner most column levels
    df.swaplevel('primary_i', 'secondary_i')  # swap row levels by name

    df.sort_index(level=0)  # sort by outer index
    df.sort_index(level=[0, 1])  # primary sort by outer, secondary sort by inner
