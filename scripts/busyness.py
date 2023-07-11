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

#Open the taxi zone data file 
with (open(os.path.join(taxipath, 'taxizones.json'), "rb")) as f:
    taxi_data = json.load(f)

#Get rid of unwanted taxi zones
del taxi_data["103"]
del taxi_data["153"]
del taxi_data["194"]

num_zones = len(taxi_data) # Number of taxi zones remaining
#taxi = 0 # Not used except to add to features list

#Determine what day and month to get the busyness scores for
year = 2023 #User Input
month = 2 #User Input - month January = 1, December = 12
day = 1 #User Input - day in the month
hour = 23 #Initially set to 23 but will be updated later

#Create Date and Time variables for use in the Pickle File
xdate = datetime.datetime(year, month, day, hour) #Produces datetime object
dow = xdate.weekday() #Produces Day of the Week
timestamp = datetime.datetime.timestamp(xdate) #Produces Timestamp Object.  Will be updated with hour data later

#Function to Update the day variables that comes from User Input
def getDay(x,dow): # In this case, day of the week (dow) = 4 (Friday)
    if x == dow:
        return 'True'
    else:
        return 'False'

#Compare the day of the week (dow) with the number of the day.  If it matches, that day = 1, else = 0 
monday = getDay(0,dow)
tuesday = getDay(1,dow)
wednesday = getDay(2,dow)
thursday = getDay(3,dow)
friday = getDay(4,dow)
saturday = getDay(5,dow)
sunday = getDay(6,dow)
day_of_week_features = [friday, monday, saturday, sunday, thursday, tuesday, wednesday,]

#Set up weather variables - will need to come from api calls but dummy at the moment
temperature = 46
humidity = 44
wind_speed = 10
precipitation = 0

# temperature = 0
# humidity = 10
# wind_speed = 50
# precipitation = 50

weather_features = [temperature, humidity, wind_speed, precipitation]

# Function for Setting up the Input values for the model.
def createX():
    features = []
    for i in taxi_data.keys():
        features.append(i)
    features.append(hour)
    features.extend(weather_features)
    features.append(timestamp)
    features.extend(day_of_week_features)
    #features.append(taxi)
    return features

#Create columns in the dataframe
df = pd.DataFrame(columns=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,
                           26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,
                           51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77])

#df['taxi_zone'] = pd.DataFrame(taxi_data.keys())
#print(df.head())

#For each taxi zone and for each hour create inputs in a dataframe
for k,v in taxi_data.items(): #k is number of the taxi zone and v is the taxi zone name
    try:
        features = createX() # Create the features for the model
     
        #Update the inputs for each of the taxi zone dummy variables
        for i in range(num_zones):
            #features[-1] = k
            if features[i] == k: #If the taxi zone number matches k, then replace k with 1
                features[i] = 'True'
            else:
                features[i] = 'False' #If the taxi zone number does not match k, then replace k with 0
        
        # Create set of inputs for each hour in a dataframe
        for i in range(24): 
            features[num_zones] = i #Update the hour

            a = datetime.datetime(year, month, day, i) #Update the timestamp
            features[num_zones+5] = datetime.datetime.timestamp(a) #Update the timestamp
            
            #Create a dataframe adding in the set of features
            df.loc[len(df)] = features

    except EnvironmentError:
        print('Failed to open file')
    except IOError:
        print('File not found')

# #Rename last column to taxi_zone
# df = df.rename(columns={78:'taxi_zone'})
# df2 = df.drop(['taxi_zone'], axis = 1)

#Check what's being input into the model
print('\nFirst 60 rows of inputs \n ----------------------------------------')
print(df[[1,2,3,62,63,64,65,66,70]].head(60)) #1,2,3 are 1st 3 taxi zones, 62, 63, 64 are last 3 zones. 
print('\nLast 60 rows of inputs \n ----------------------------------------') 
print(df[[1,2,3,62,63,64,65,66,70]].tail(60)) #65 is hour, 66 is temp and 70 is timestamp

#Open the Pickle File
pickle_file = "2017_model.pkl"
busy_model = pickle.load(open(os.path.join(pickle_dir, pickle_file), 'rb'))

#Make the predictions
busyness_predictions = busy_model.predict(df) # Make the predictions

#Add predictions column to df
df['Pickle Busyness Predicted'] = busyness_predictions

#Print out inputs and busyness scores
print('\nFirst 60 rows of inputs and predictions \n ----------------------------------------')
print(df[[1,2,3,62,63,64,65,66,70,'Pickle Busyness Predicted']].head(60))
print('\nLast 60 rows of inputs and predictions \n ----------------------------------------')
print(df[[1,2,3,62,63,64,65,66,70,'Pickle Busyness Predicted']].tail(60))

#df['taxi_zone'] = ''


# ########### Accessing Data from Database ###################################
# import psycopg2 #For getting the fetch method

# conn = psycopg2.connect(
#    database="namesDB", user='postgres', password='password', host='127.0.0.1', port= '5432'
# ) #Establish the connection

# conn.autocommit = True #Set auto commit false
# cursor = conn.cursor() #Create a cursor object
# cursor.execute('''SELECT * from users_userroute''') #Retrieve data
# result = cursor.fetchone(); #Fetch 1st row from the table
# #print(result)
# conn.commit() #Commit changes in the database
# conn.close() #Close the connection

# walk_start_time = float(result[4])
# print(f'Walk Start Time {walk_start_time}')








# #Write the busyness file to the pickle directory
# with open(os.path.join(pickle_dir, 'busyness_file'), 'w') as f:
#     f.write(json.dumps(taxi_zones_busyness))

# print(df.head())
# print(df.tail())
# print(df.info())

#     #print(X)  #Prints all the input features
        #     result = busy_model.predict(X_predict) # Make the prediction for that hour
        #     #print(f'Timestamp = {X[num_zones+5]} , Hour = {X[num_zones]} , for taxi zone {k} Busyness Score = {result}')
        #     busy_score_list.append(result) # Add that prediction to the list

        # print(busy_score_list)
        # #Add the busyness score list for that zone
        # taxi_zones_busyness[k] = busy_score_list
        # #print(taxi_zones_busyness)

  # # Convert the list to a NumPy array
            # X_array = np.array(X)  
            # X_reshaped = X_array.reshape(1, -1)
            # #print(X_reshaped)  #Prints all the input features

# #Get Taxi Zone ID
# zone = file_name.rstrip('.pkl')
# zone = int(zone.lstrip('scripts\zone_'))

# #Read test model prediction file and check for actual results
# path3 = r"C:\Users\corma\Desktop\Research Project" #csv file to check pickle prediction
# df = pd.read_csv(os.path.join(path3, 'df2.csv'))
# X = df.drop("PU_Busyness", axis=1)
# y = df["PU_Busyness"]
# for i in range(len(X)):
#     row = X.iloc[i]
#     reshaped_data = np.reshape(row, (1, -1))
#     busyness = model.predict(reshaped_data)
#     diff = ((y[i]-busyness)/y[i] * 100).round(1)
#     #print(f'Model Busyness Score = {busyness} vs Table Busyness Score = {y[i]} a {diff}% difference - for row {i} ')

# #Set up Weather Descriptions Variables - will need to come from api calls
# windy =  0
# cloudy = 0
# cloudy_windy =  0
# drizzle_fog =  0
# drizzle_fog_windy = 0
# fair =  0
# fair_windy = 0
# fog = 0
# fog_windy = 0
# haze = 0
# heavy_rain =  0
# heavy_rain_windy =  0
# heavy_tstorm = 0
# light_drizzle = 0
# light_drizzle_windy = 0
# light_rain = 0
# light_rain_windy = 0
# light_rain_thunder = 0
# light_rain_thunder_2 =  0        
# light_sleet_windy = 0
# light_snow = 0
# light_snow_windy =  0
# mist = 0
# mostly_cloudy = 0
# mostly_cloudy_windy =  0
# partly_cloudy = 0
# partly_cloudy_windy =  0
# rain = 0
# rain_windy = 0
# sleet_windy = 0
# snow = 0
# snow_windy = 0
# snow_sleet_windy = 0
# tstorm = 0
# tstorm_windy = 0
# thunder = 0
# thunder_vicinity = 0
# wintry_mix = 0
# wintry_mix_windy = 0

# import pytz
# nyc = pytz.timezone("America/New_York")
# now= datetime.now(nyc)
# time_date = datetime.timestamp(now)
#print(time_date)

# test = [friday,monday,saturday,sunday,thursday,tuesday,wednesday]
# for i in test:
#     print(i)