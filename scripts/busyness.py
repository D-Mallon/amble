import pickle
import json
import os
import datetime
import numpy as np
import pandas as pd

import warnings # Stops warning from appearing
warnings.filterwarnings('ignore')

#Create File Paths
pickle_dir = r"C:\Users\corma\COMP47360\ucdSummerProject\src\pickle_files" # pickle files directory
taxipath = r"C:\Users\corma\COMP47360\ucdSummerProject\src\components" #taxi zone data (name and number)
busyscore = r"C:\Users\corma\COMP47360\ucdSummerProject\src\components" #Busyness Score data

#Open the taxi zone data file 
with (open(os.path.join(taxipath, 'taxizones.json'), "rb")) as f:
    taxi_data = json.load(f)
#Get rid of unwanted taxi zones
del taxi_data["103"]
del taxi_data["153"]
del taxi_data["194"]

#Create column heading for dataframe
columns_names = ['Hour', 'Temperature', 'Humidity', 'Wind Speed', 'Precipitation',
       'TImestamp', 'PULocationID_100', 'PULocationID_107', 'PULocationID_113',
       'PULocationID_114', 'PULocationID_116', 'PULocationID_12',
       'PULocationID_120', 'PULocationID_125', 'PULocationID_127',
       'PULocationID_128', 'PULocationID_13', 'PULocationID_137',
       'PULocationID_140', 'PULocationID_141', 'PULocationID_142',
       'PULocationID_143', 'PULocationID_144', 'PULocationID_148',
       'PULocationID_151', 'PULocationID_152', 'PULocationID_158',
       'PULocationID_161', 'PULocationID_162', 'PULocationID_163',
       'PULocationID_164', 'PULocationID_166', 'PULocationID_170',
       'PULocationID_186', 'PULocationID_202', 'PULocationID_209',
       'PULocationID_211', 'PULocationID_224', 'PULocationID_229',
       'PULocationID_230', 'PULocationID_231', 'PULocationID_232',
       'PULocationID_233', 'PULocationID_234', 'PULocationID_236',
       'PULocationID_237', 'PULocationID_238', 'PULocationID_239',
       'PULocationID_24', 'PULocationID_243', 'PULocationID_244',
       'PULocationID_246', 'PULocationID_249', 'PULocationID_261',
       'PULocationID_262', 'PULocationID_263', 'PULocationID_4',
       'PULocationID_41', 'PULocationID_42', 'PULocationID_43',
       'PULocationID_45', 'PULocationID_48', 'PULocationID_50',
       'PULocationID_68', 'PULocationID_74', 'PULocationID_75',
       'PULocationID_79', 'PULocationID_87', 'PULocationID_88',
       'PULocationID_90', 'Day_Friday', 'Day_Monday', 'Day_Saturday',
       'Day_Sunday', 'Day_Thursday', 'Day_Tuesday', 'Day_Wednesday']

#Create an empty dataframe
df = pd.DataFrame(columns=columns_names)

#Function to calculate timestamp and day of the week from inputs
def create_ts(hour): 
    year = 2023 #User Input
    month = 7 #User Input - month January = 1, December = 12
    day = 11 #User Input - day in the month

    #Create Date and Time variables for use in the Pickle File
    xdate = datetime.datetime(year, month, day, hour) #Produces datetime object
    dow = xdate.weekday() #Produces Day of the Week
    timestamp = datetime.datetime.timestamp(xdate) #Produces Timestamp Object.  Will be updated with hour data later
    return(dow,timestamp)

#Function to Update the day variables that comes from User Input
def getDay(x,dow): # In this case, day of the week (dow) = 4 (Friday)
    if x == dow:
        return True
    else:
        return False

#Get weather data
import requests
api_key = '8b51b58a6fb24f35968113807231107' #Key for Weather API
url = f'http://api.weatherapi.com/v1/forecast.json?key={api_key}&q=New York City&days=1&aqi=no&alerts=no'
response = requests.get(url)
data = response.json()

#Create Weather Variables
temp = []
hum = []
wind = []
percip = []

#Weather variables from Weather API
for i in range(24):
    temp.append(float(data['forecast']['forecastday'][0]['hour'][i]['temp_f']))
    hum.append(float(data['forecast']['forecastday'][0]['hour'][i]["humidity"]))
    wind.append(float(data['forecast']['forecastday'][0]['hour'][i]['wind_mph']))
    percip.append(float(data['forecast']['forecastday'][0]['hour'][i]["precip_in"]))

#Create dataframe for every taxi Zone and for every hour
for k,v in taxi_data.items(): #k is number of the taxi zone and v is the taxi zone name
    #Create Dictionaries to capture the data for different columns
    new_row1 = {} #Taxi zone data - whether the input is True or False
    new_row = {}  # All other data

    #Create values for the taxi zone columns (64 of them)
    for column in df.columns[1:]:
        if column[:13] == 'PULocationID_': # If column is a taxi zone column
            if column[13:] == k: #If column ending matches the taxi zone number
                new_row1.update({column:True}) #Make that entry True
            else:
                new_row1.update({column:False}) #Else make that entry False
     
    #Create values for all other variables 
    for i in range(24): #For each hour (in a 24 hour period) add values to a new row
        new_row.update({'Hour':i})
        new_row.update({'Temperature':temp[i]})
        new_row.update({'Humidity':hum[i]})
        new_row.update({'Wind Speed':wind[i]})
        new_row.update({'Precipitation':percip[i]})

        result = create_ts(i) #create timestamp based on the hour value (i)
        new_row.update({'TImestamp':result[1]})

        dow = result[0] #update day of week based on timestamp.  Then update values in day columns
        new_row.update({'Day_Monday':getDay(0,dow)})
        new_row.update({'Day_Tuesday':getDay(1,dow)})
        new_row.update({'Day_Wednesday':getDay(2,dow)})
        new_row.update({'Day_Thursday':getDay(3,dow)})
        new_row.update({'Day_Friday':getDay(4,dow)})
        new_row.update({'Day_Saturday':getDay(5,dow)})
        new_row.update({'Day_Sunday':getDay(6,dow)})

        new_dict = {**new_row, **new_row1} #Merge the two dictionaries
        df = pd.concat([df, pd.DataFrame([new_dict])], ignore_index=True) #Add the merged row to dataframe
        new_row = {} #Reset for the next hour

#Open the Pickle File
pickle_file = "2017_model.pkl"
busy_model = pickle.load(open(os.path.join(pickle_dir, pickle_file), 'rb'))

#Make the predictions
busyness_predictions = busy_model.predict(df) # Make the predictions

#Add predictions column to df
df['Busyness Predicted'] = busyness_predictions
print(df[['Busyness Predicted','Hour', 'Temperature','TImestamp','Day_Tuesday','PULocationID_4','PULocationID_24','PULocationID_107']].head(60))

df.to_csv("os.path.join(busyscore, busyscore.csv")














# # time_data = int(data['forecast']['forecastday'][0]['hour'][0]['time'][10:13])
# temp_data = float(data['forecast']['forecastday'][0]['hour'][0]['temp_f'])
# wind_data = float(data['forecast']['forecastday'][0]['hour'][0]['wind_mph'])
# precip_data = float(data['forecast']['forecastday'][0]['hour'][0]["precip_in"])
# hum_data = float(data['forecast']['forecastday'][0]['hour'][0]["humidity"])
# print(time_data,temp_data, wind_data,precip_data,hum_data)

# #Open dataframe file
# df = pd.read_csv(os.path.join(data_path, '2017_mergedTaxiWeather.csv')) 
# df['Day'] = df['Day'].str.strip()
# df = df.drop("Description", axis=1)
# df = pd.get_dummies(df, columns=["PULocationID","Day"])
# df = df.drop("PU_Busyness", axis=1)
# df = df.drop(df.index[:])

# print(df_busy.columns)

# count = 0
# taxizones = []
# for col in df_busy.columns:
#     if col[:13] == 'PULocationID_':
#         taxizones.append(col)
#     count += 1
#     # print(col)
# print(f'Total number of columns = {count}')
# # print(f'Taxi Zones = {taxizones}')
# print(f'Total Number of Taxi Zones = {len(taxizones)}')

# day_of_week_features = [friday, monday, saturday, sunday, thursday, tuesday, wednesday,]

# #Set up weather variables - will need to come from api calls but dummy at the moment
# temperature = 46
# humidity = 44
# wind_speed = 10
# precipitation = 0

# weather_features = [temperature, humidity, wind_speed, precipitation]

# # Function for Setting up the Input values for the model.
# def createX():
#     features = []
#     for i in taxi_data.keys():
#         features.append(i)
#     features.append(hour)
#     features.extend(weather_features)
#     features.append(timestamp)
#     features.extend(day_of_week_features)
#     #features.append(taxi)
#     return features

# #For each taxi zone and for each hour create inputs in a dataframe
# for k,v in taxi_data.items(): #k is number of the taxi zone and v is the taxi zone name
#     try:
#         features = createX() # Create the features for the model
     
#         #Update the inputs for each of the taxi zone dummy variables
#         for i in range(num_zones):
#             #features[-1] = k
#             if features[i] == k: #If the taxi zone number matches k, then replace k with 1
#                 features[i] = 'True'
#             else:
#                 features[i] = 'False' #If the taxi zone number does not match k, then replace k with 0
        
#         # Create set of inputs for each hour in a dataframe
#         for i in range(24): 
#             features[num_zones] = i #Update the hour

#             a = datetime.datetime(year, month, day, i) #Update the timestamp
#             features[num_zones+5] = datetime.datetime.timestamp(a) #Update the timestamp
            
#             #Create a dataframe adding in the set of features
#             df.loc[len(df)] = features

#     except EnvironmentError:
#         print('Failed to open file')
#     except IOError:
#         print('File not found')

# # #Rename last column to taxi_zone
# # df = df.rename(columns={78:'taxi_zone'})
# # df2 = df.drop(['taxi_zone'], axis = 1)

# #Check what's being input into the model
# print('\nFirst 60 rows of inputs \n ----------------------------------------')
# print(df[[1,2,3,62,63,64,65,66,70]].head(60)) #1,2,3 are 1st 3 taxi zones, 62, 63, 64 are last 3 zones. 
# print('\nLast 60 rows of inputs \n ----------------------------------------') 
# print(df[[1,2,3,62,63,64,65,66,70]].tail(60)) #65 is hour, 66 is temp and 70 is timestamp

# #Print out inputs and busyness scores
# print('\nFirst 60 rows of inputs and predictions \n ----------------------------------------')
# print(df[[1,2,3,62,63,64,65,66,70,'Pickle Busyness Predicted']].head(60))
# print('\nLast 60 rows of inputs and predictions \n ----------------------------------------')
# print(df[[1,2,3,62,63,64,65,66,70,'Pickle Busyness Predicted']].tail(60))

# # ########### Accessing Data from Database ###################################
# # import psycopg2 #For getting the fetch method

# # conn = psycopg2.connect(
# #    database="namesDB", user='postgres', password='password', host='127.0.0.1', port= '5432'
# # ) #Establish the connection

# # conn.autocommit = True #Set auto commit false
# # cursor = conn.cursor() #Create a cursor object
# # cursor.execute('''SELECT * from users_userroute''') #Retrieve data
# # result = cursor.fetchone(); #Fetch 1st row from the table
# # #print(result)
# # conn.commit() #Commit changes in the database
# # conn.close() #Close the connection

# # #Write the busyness file to the pickle directory
# # with open(os.path.join(pickle_dir, 'busyness_file'), 'w') as f:
# #     f.write(json.dumps(taxi_zones_busyness))

# # print(df.head())
# # print(df.tail())
# # print(df.info())

# #     #print(X)  #Prints all the input features
#         #     result = busy_model.predict(X_predict) # Make the prediction for that hour
#         #     #print(f'Timestamp = {X[num_zones+5]} , Hour = {X[num_zones]} , for taxi zone {k} Busyness Score = {result}')
#         #     busy_score_list.append(result) # Add that prediction to the list

#         # print(busy_score_list)
#         # #Add the busyness score list for that zone
#         # taxi_zones_busyness[k] = busy_score_list
#         # #print(taxi_zones_busyness)

#   # # Convert the list to a NumPy array
#             # X_array = np.array(X)  
#             # X_reshaped = X_array.reshape(1, -1)
#             # #print(X_reshaped)  #Prints all the input features

# # #Get Taxi Zone ID
# # zone = file_name.rstrip('.pkl')
# # zone = int(zone.lstrip('scripts\zone_'))

# # #Read test model prediction file and check for actual results
# # path3 = r"C:\Users\corma\Desktop\Research Project" #csv file to check pickle prediction
# # df = pd.read_csv(os.path.join(path3, 'df2.csv'))
# # X = df.drop("PU_Busyness", axis=1)
# # y = df["PU_Busyness"]
# # for i in range(len(X)):
# #     row = X.iloc[i]
# #     reshaped_data = np.reshape(row, (1, -1))
# #     busyness = model.predict(reshaped_data)
# #     diff = ((y[i]-busyness)/y[i] * 100).round(1)
# #     #print(f'Model Busyness Score = {busyness} vs Table Busyness Score = {y[i]} a {diff}% difference - for row {i} ')

# # import pytz
# # nyc = pytz.timezone("America/New_York")
# # now= datetime.now(nyc)
# # time_date = datetime.timestamp(now)
# #print(time_date)

# #Open the taxi zone data file 
# with (open(os.path.join(taxipath, 'taxizones.json'), "rb")) as f:
#     taxi_data = json.load(f)
# #Get rid of unwanted taxi zones
# del taxi_data["103"]
# del taxi_data["153"]
# del taxi_data["194"]
# num_zones = len(taxi_data) # Number of taxi zones remaining

    # except EnvironmentError:
    #     print('Failed to open file')
    # except IOError:
    #     print('File not found')

    #Get Taxi Zone Column Headings

# print(df[['PULocationID_4','PULocationID_12','PULocationID_13']].head(60))
# print(df[['PULocationID_4','PULocationID_12','PULocationID_13']].tail(60))
# print(df[['Hour','TImestamp','Day_Monday','Day_Sunday','Day_Tuesday','Day_Wednesday','PULocationID_4' ]].head(60))