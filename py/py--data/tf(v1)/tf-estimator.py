# ----------------
# neural network (example 5) (linear regression) (Estimator API)
# ----------------

# tf.estimator has several model types
    # tf.estimator.LinearClassifier (constructs a linear classification model)
    # tf.estimator.LinearRegressor (constructs a linear regression model)
    # tf.estimator.DNNClassifier (constructs a densely connected neural network)
    # tf.estimator.DNNRegressor (constructs a densely connected neural network)
    # tf.estimator.DNNLinearCombinedClassiier (linear & neural network -- classifier)
    # tf.estimator.DNNLinearCombinedRegressor (linear & neural network -- regression)

# estimator api workflow
    # define list of feature columns
    # create estimator model
    # create data input function
    # call train, evaluate, and predict methods on estimator object.

# DNN
    # dense -- a neuron is connected to each neuron in the next layer.

# ----------------
# tf.estimator (linear regressor)
# ----------------

# data
x_data = np.linspace(0.0, 10.0, 10000)
y_actual = (0.5 * x_data) + 5 + noise
feat_cols = [ tf.feature_column.numeric_column(key='x', shape=[1]) ]
estimator = tf.estimator.LinearRegressor(feature_columns=feat_cols)
# import
from sklearn.model_selection import train_test_split
# train_test_split
x_train, x_eval, y_train, y_eval = train_test_split(
    x_data, y_actual, test_size=0.3, random_state=101
)
print(x_train.shape)
print(x_eval.shape)
# input func, train input func, eval input func
input_func = tf.estimator.inputs.numpy_input_fn(
    x={'x': x_train}, y=y_train, batch_size=8, num_epochs=None, shuffle=True
)
train_input_func = tf.estimator.inputs.numpy_input_fn(
    x={'x': x_train}, y=y_train, batch_size=8, num_epochs=1000, shuffle=False
)
eval_input_func = tf.estimator.inputs.numpy_input_fn(
    x={'x': x_eval}, y=y_eval, batch_size=8, num_epochs=1000, shuffle=False
)

# train, evaluate
estimator.train(input_fn=input_func, steps=1000)
train_metrics = estimator.evaluate(input_fn=train_input_func, steps=1000)
eval_metrics = estimator.evaluate(input_fn=eval_input_func, steps=1000)
print('TRAINING DATA METRICS')
print(train_metrics)
print('EVAL METRICS')
print(eval_metrics)

# predict
brand_new_data = np.linspace(0,10,10)
input_fn_predict = tf.estimator.inputs.numpy_input_fn(
    x={'x': brand_new_data}, shuffle=False
)
predictions = list(estimator.predict(input_fn=input_fn_predict))
predictions = list(map(lambda x: x['predictions'], predictions))
print(predictions)

# plot
plt.plot(x_data, y_actual, '*')
plt.plot(brand_new_data, predictions, 'r*')

# ----------------
# tf.estimator (DNN regressor)
# ----------------

# df
df1 = pd.read_csv('cal_housing_clean.csv')
# prepare for split
x_data = df1.drop('medianHouseValue', axis=1)
y_val = df1['medianHouseValue']
# split
x_train, x_test, y_train, y_test = train_test_split(
    x_data, y_val, test_size=0.3, random_state=101
)
# scaler (values 0-1)
from sklearn.preprocessing import MinMaxScaler
scaler = MinMaxScaler()
scaler.fit(x_train)
x_train = pd.DataFrame(
    data=scaler.transform(x_train), columns=x_train.columns, index=x_train.index
)
x_test = pd.DataFrame(
    data=scaler.transform(x_test), columns=x_test.columns, index=x_test.index
)
# feature columns (conversion)
age = tf.feature_column.numeric_column('housingMedianAge')
rooms = tf.feature_column.numeric_column('totalRooms')
bedrooms = tf.feature_column.numeric_column('totalBedrooms')
pop = tf.feature_column.numeric_column('population')
households = tf.feature_column.numeric_column('households')
income = tf.feature_column.numeric_column('medianIncome')
# feature columns
feat_cols = [age, rooms, bedrooms, pop, households, income]
# input func
input_func = tf.estimator.inputs.pandas_input_fn(
    x=x_train, y=y_train, batch_size=10, num_epochs=1000, shuffle=True
)
# model
model = tf.estimator.DNNRegressor(hidden_units=[6,6,6], feature_columns=feat_cols)
# train
model.train(input_fn=input_func, steps=20000)
# predict
predict_input_func = tf.estimator.inputs.pandas_input_fn(
    x=x_test, batch_size=10, num_epochs=1, shuffle=False
)
predictions = list(model.predict(predict_input_func))
predictions = list(map(lambda x: x['predictions'][0], predictions)) # get value out of dict/array
print(predictions)

# rmse -- sklearn.metrics
from sklearn.metrics import mean_squared_error
mse = mean_squared_error(y_test, predictions)
rmse = mse ** (1/2)
print(rmse)

# if rmse is high -- try more steps, more layers [6,6,6,6,6]

# ----------------
# tf.estimator (linear classifier)
# ----------------

# create df from csv
df1 = pd.read_csv('pima-indians-diabetes.csv')
df1.head()
# normalize
cols_to_norm = ['Number_pregnant', 'Glucose_concentration', 'Blood_pressure', 'Triceps', 'Insulin', 'BMI', 'Pedigree', 'Age']
df1[cols_to_norm] = df1[cols_to_norm].apply( lambda x: (x - x.min()) / (x.max() - x.min()) )
num_preg = tf.feature_column.numeric_column('Number_pregnant')
plasma_gluc = tf.feature_column.numeric_column('Glucose_concentration')
dias_press = tf.feature_column.numeric_column('Blood_pressure')
tricep = tf.feature_column.numeric_column('Triceps')
insulin = tf.feature_column.numeric_column('Insulin')
bmi = tf.feature_column.numeric_column('BMI')
diabetes_pedigree = tf.feature_column.numeric_column('Pedigree')
age = tf.feature_column.numeric_column('Age')
# group
unique_group_values = df1['Group'].unique()
assigned_group = tf.feature_column.categorical_column_with_vocabulary_list('Group',unique_group_values)
assigned_group = tf.feature_column.categorical_column_with_hash_bucket('Group', hash_bucket_size=10) # automatic, up to 10
# continuous to categorical column (feature engineering)
df1['Age'].hist(bins=20) # show histogram
age_bucket = tf.feature_column.bucketized_column(age,boundaries=[20,30,40,50,60,70,80,90])
# feature columns
feat_cols = [num_preg, plasma_gluc, dias_press, tricep, insulin, bmi, diabetes_pedigree, age_bucket]
# class
x_data = df1.drop('Class',axis=1) # drop 'Class' column
labels = df1['Class'] # diabetes boolean
# train test split
x_train, x_test, y_train, y_test = train_test_split(
    x_data, labels, test_size=0.3, random_state=101
)
# input func
input_func = tf.estimator.inputs.pandas_input_fn(
    x=x_train, y=y_train, batch_size=10, num_epochs=1000, shuffle=True
)
# model
model = tf.estimator.LinearClassifier(
    feature_columns=feat_cols, n_classes=2
)
# train model
model.train(input_fn=input_func, steps=1000)
# eval
eval_input_func = tf.estimator.inputs.pandas_input_fn(
    x=x_test, y=y_test, batch_size=10, num_epochs=1, shuffle=False
)
results = model.evaluate(eval_input_func)
print(results)
# predict
pred_input_func = tf.estimator.inputs.pandas_input_fn(
    x=x_test, batch_size=10, num_epochs=1, shuffle=False
)
predictions = list(model.predict(pred_input_func))
print(predictions)


# ----------------
# tf.estimator (dnn classifier)
# ----------------

# create df from csv
df1 = pd.read_csv('pima-indians-diabetes.csv')
df1.head()
# normalize
cols_to_norm = ['Number_pregnant', 'Glucose_concentration', 'Blood_pressure', 'Triceps', 'Insulin', 'BMI', 'Pedigree', 'Age']
df1[cols_to_norm] = df1[cols_to_norm].apply( lambda x: (x - x.min()) / (x.max() - x.min()) )
num_preg = tf.feature_column.numeric_column('Number_pregnant')
plasma_gluc = tf.feature_column.numeric_column('Glucose_concentration')
dias_press = tf.feature_column.numeric_column('Blood_pressure')
tricep = tf.feature_column.numeric_column('Triceps')
insulin = tf.feature_column.numeric_column('Insulin')
bmi = tf.feature_column.numeric_column('BMI')
diabetes_pedigree = tf.feature_column.numeric_column('Pedigree')
age = tf.feature_column.numeric_column('Age')
# group
unique_group_values = df1['Group'].unique()
assigned_group = tf.feature_column.categorical_column_with_vocabulary_list('Group',unique_group_values)
assigned_group = tf.feature_column.categorical_column_with_hash_bucket('Group', hash_bucket_size=10) # automatic, up to 10
# continuous to categorical column (feature engineering)
df1['Age'].hist(bins=20) # show histogram
age_bucket = tf.feature_column.bucketized_column(age,boundaries=[20,30,40,50,60,70,80,90])
# dnn -- categorical column needs embedding_column
embedded_group_col = tf.feature_column.embedding_column(assigned_group, dimension=4)
feat_cols = [num_preg, plasma_gluc, dias_press, tricep, insulin, bmi, diabetes_pedigree, embedded_group_col, age_bucket]
# input func
input_func = tf.estimator.inputs.pandas_input_fn(
    x_train, y_train, batch_size=10, num_epochs=1000, shuffle=True
)
# DNN classifier (model) (won't work)
dnn_model = tf.estimator.DNNClassifier(
    hidden_units=[10,10,10], feature_columns=feat_cols, n_classes=2
)
# train 
dnn_model.train(input_fn=input_func, steps=1000)
# eval
eval_input_func = tf.estimator.inputs.pandas_input_fn(
    x=x_test, y=y_test, batch_size=10, num_epochs=1, shuffle=False
)
dnn_model.evaluate(eval_input_func)

# ----------------
# tf.estimator (linear classifier 2)
# ----------------

# df
df1 = pd.read_csv('census_data.csv')
# convert to boolean
df1['income_bracket'].unique() 
df1['income_bracket'] = df1['income_bracket'].apply(lambda x: 0 if x==' <=50K' else 1)
# prepare for split
x_data = df1.drop('income_bracket', axis=1)
y_labels = df1['income_bracket']
# split
x_train, x_test, y_train, y_test = train_test_split(
    x_data, y_labels, test_size=0.3, random_state=101
)
# categorical feature columns
gender = tf.feature_column.categorical_column_with_vocabulary_list('gender',['Female','Male'])
occupation = tf.feature_column.categorical_column_with_hash_bucket('occupation', hash_bucket_size=1000)
marital_status = tf.feature_column.categorical_column_with_hash_bucket('marital_status', hash_bucket_size=1000)
relationship = tf.feature_column.categorical_column_with_hash_bucket('relationship', hash_bucket_size=1000)
education = tf.feature_column.categorical_column_with_hash_bucket('education', hash_bucket_size=1000)
workclass = tf.feature_column.categorical_column_with_hash_bucket('workclass', hash_bucket_size=1000)
native_country = tf.feature_column.categorical_column_with_hash_bucket('native_country', hash_bucket_size=1000)
# continuous feature columns
age = tf.feature_column.numeric_column('age')
education_num = tf.feature_column.numeric_column('education_num')
capital_gain = tf.feature_column.numeric_column('capital_gain')
capital_loss = tf.feature_column.numeric_column('capital_loss')
hours_per_week = tf.feature_column.numeric_column('hours_per_week')
# feature columns
feat_cols = [
    gender,occupation,marital_status,relationship,education,
    workclass,native_country,age,education_num,capital_gain,
    capital_loss,hours_per_week
]
# input function
input_func = tf.estimator.inputs.pandas_input_fn(
    x=x_train,y=y_train,batch_size=100,num_epochs=None,shuffle=True
)
# model
model = tf.estimator.LinearClassifier(feature_columns=feat_cols)
# train
model.train(input_fn=input_func, steps=10000)
# eval/predict
pred_fn = tf.estimator.inputs.pandas_input_fn(
    x=x_test, batch_size=len(x_test), shuffle=False
)
predictions = list(model.predict(input_fn=pred_fn))
predictions = list(map(lambda x: x['class_ids'][0], predictions))

# classification report (sklearn.metrics)
from sklearn.metrics import classification_report
report = classification_report(y_true=y_test, y_pred=predictions)
print(report)
