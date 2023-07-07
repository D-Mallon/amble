import pickle
import json
from datetime import datetime
import os
import sklearn
import numpy as np
import pandas as pd

import pytz
nyc = pytz.timezone("America/New_York")
now= datetime.now(nyc)
time_date = datetime.timestamp(now)
#print(time_date)

import warnings # Stops warning from appearing
warnings.filterwarnings('ignore')

#Create File Paths
pickle_dir = r"C:\Users\corma\COMP47360\ucdSummerProject\src\pickle_files" # pickle files directory
taxipath = r"C:\Users\corma\COMP47360\ucdSummerProject\src\components" #taxi zone data
path3 = r"C:\Users\corma\Desktop\Research Project" #csv file to check pickle prediction

#Open the taxi zone data file
with (open(os.path.join(taxipath, 'taxizones.json'), "rb")) as f:
    taxi_data = json.load(f)
 
#Determine what date and month to get the busyness scores
day = 6 # day in the month - User Input
month = 7 #month January = 1, December = 12 - User Input
year = 2023

#Set up Time and Date variables - will need to come from User
hour = 0
timestamp = 0 #based on Year, Month, day, hour
friday = 0
monday = 0
saturday = 0
sunday = 0
thursday = 1
tuesday =0
wednesday = 0

#Set up weather variables - will need to come from api calls
temperature = 46
humidity = 44
wind_speed = 10
precipitation = 0

#Set up Weather Descriptions Variables - will need to come from api calls
windy =  0
cloudy = 1
cloudy_windy =  0
drizzle_fog =  0
drizzle_fog_windy = 0
fair =  0
fair_windy = 0
fog = 0
fog_windy = 0
haze = 0
heavy_rain =  0
heavy_rain_windy =  0
heavy_tstorm = 0
light_drizzle = 0
light_drizzle_windy = 0
light_rain = 0
light_rain_windy = 0
light_rain_thunder = 0
light_rain_thunder_2 =  0        
light_sleet_windy = 0
light_snow = 0
light_snow_windy =  0
mist = 0
mostly_cloudy = 0
mostly_cloudy_windy =  0
partly_cloudy = 0
partly_cloudy_windy =  0
rain = 0
rain_windy = 0
sleet_windy = 0
snow = 0
snow_windy = 0
snow_sleet_windy = 0
tstorm = 0
tstorm_windy = 0
thunder = 0
thunder_vicinity = 0
wintry_mix = 0
wintry_mix_windy = 0

X = [hour,
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
windy,
cloudy,
cloudy_windy,
drizzle_fog,
drizzle_fog_windy,
fair,
fair_windy,
fog,
fog_windy,
haze,
heavy_rain,
heavy_rain_windy,
heavy_tstorm,
light_drizzle,
light_drizzle_windy,
light_rain,
light_rain_windy,
light_rain_thunder,
light_rain_thunder_2,        
light_sleet_windy,
light_snow,
light_snow_windy,
mist,
mostly_cloudy,
mostly_cloudy_windy,
partly_cloudy,
partly_cloudy_windy,
rain,
rain_windy,
sleet_windy,
snow,
snow_windy,
snow_sleet_windy,
tstorm,
tstorm_windy,
thunder,
thunder_vicinity,
wintry_mix,
wintry_mix_windy
]

#Get all the taxi zone pickle files
for k,v in taxi_data.items():

#For each zone get the model
    try:
        pickle_file = "zone_"+v+".pkl"
        busy_model = pickle.load(open(os.path.join(pickle_dir, pickle_file), 'rb'))
        busy_score_list = []

        for i in range(24): # Calculate busyness scores for each hour for each model
            X[0] = i #hour
            a = datetime(year, month, day, i)
            X[5] = datetime.timestamp(a) #timestamp
            result = busy_model.predict([X])
            print(f'Timestamp = {X[5]} , Hour = {X[0]} , Busyness Score = {result}')
            busy_score_list.append(result)
    
    except EnvironmentError:
        print('Failed to open file')
    except IOError:
        print('File not found')

# #Get Taxi Zone ID
# zone = file_name.rstrip('.pkl')
# zone = int(zone.lstrip('scripts\zone_'))

# #Read test model prediction file and check for actual results
# df = pd.read_csv(os.path.join(path3, 'df2.csv'))
# X = df.drop("PU_Busyness", axis=1)
# y = df["PU_Busyness"]
# for i in range(len(X)):
#     row = X.iloc[i]
#     reshaped_data = np.reshape(row, (1, -1))
#     busyness = model.predict(reshaped_data)
#     diff = ((y[i]-busyness)/y[i] * 100).round(1)
#     #print(f'Model Busyness Score = {busyness} vs Table Busyness Score = {y[i]} a {diff}% difference - for row {i} ')

# #Choose today as the Amble day
# now = datetime.now()
# if now.day == 1:
#     monday = 1
# elif now.day == 2:
#     tuesday = 1
# elif now.day == 3:
#     wednesday = 1
# elif now.day == 4:
#     thursday = 1
# elif now.day == 5:
#     friday = 1
# elif now.day == 6:
#     saturday = 1
# elif now.day == 7:
#     sunday = 1