import pickle
import json
import os
# import sklearn
# import numpy as np
# import pandas as pd
import datetime

import warnings # Stops warning from appearing
warnings.filterwarnings('ignore')

#Create File Paths
pickle_dir = r"C:\Users\corma\COMP47360\ucdSummerProject\src\pickle_files" # pickle files directory
taxipath = r"C:\Users\corma\COMP47360\ucdSummerProject\src\components" #taxi zone data (name and number)

#Open the taxi zone data file and create variable for taxi zone number
with (open(os.path.join(taxipath, 'taxizones.json'), "rb")) as f:
    taxi_data = json.load(f)
taxi_zone_number = 0 #This is a dummy variable.  Will be updated later

#Determine what day and month to get the busyness scores for
day = 7 # day in the month - User Input
month = 7 # month January = 1, December = 12 - User Input
year = 2023

#Create Date and Time variables for use in the Pickle File
xdate = datetime.datetime(year, month, day) #Produces datetime object
dow = xdate.weekday() #Produces Day of the Week
timestamp = datetime.datetime.timestamp(xdate) #Produces Timestamp Object will be updated with hour data later

#Function to Update the day variables that comes from User Input
def getDay(x,dow): # In this case, day of the week (dow) = 4 (Friday)
    if x == dow:
        return 1
    else:
        return 0

#Compare the day of the week (dow) with the number of the day.  If it matches, that day = 1, else = 0 
monday = getDay(0,dow)
tuesday = getDay(1,dow)
wednesday = getDay(2,dow)
thursday = getDay(3,dow)
friday = getDay(4,dow)
saturday = getDay(5,dow)
sunday = getDay(6,dow)

hour = 0 #Default value

#Set up weather variables - will need to come from api calls but dummy at the moment
temperature = 46
humidity = 44
wind_speed = 10
precipitation = 0

#Set up the Input values for the model.
X = [taxi_zone_number,
    hour,
    temperature,
    humidity,
    wind_speed,
    precipitation,
    timestamp,
    friday,
    monday,
    saturday,
    sunday,
    thursday,
    tuesday,
    wednesday,
    ]

#Open the Pickle File
pickle_file = "2017_model.pkl"
busy_model = pickle.load(open(os.path.join(pickle_dir, pickle_file), 'rb'))

#Create a dictionary to add busyness scores (for 1 day) for all zones
taxi_zones_busyness = {} 

#For each taxi zone
for k,v in taxi_data.items(): #k is name of the taxi zone and v is the taxi zone number
    try:
        
        busy_score_list = [] # List for busyness score for each hour
        X[0] = v # insert taxi zone number
        
        # Calculate busyness scores for each hour
        for i in range(24): 
            X[1] = i #Update the hour

            a = datetime(year, month, day, i) #Update the timestamp
            X[6] = datetime.timestamp(a) #Update the timestamp

            result = busy_model.predict([X]) # Make the prediction for that hour
            print(f'Timestamp = {X[6]} , Hour = {X[1]} , for taxi zone {v} Busyness Score = {result}')
            busy_score_list.append(result) # Add that prediction to the list

        #Add the busyness score list for that zone
        taxi_zones_busyness[v] = busy_score_list
        print(taxi_zones_busyness)

    except EnvironmentError:
        print('Failed to open file')
    except IOError:
        print('File not found')

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