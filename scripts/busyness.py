import pickle
from datetime import datetime

file_name = 'scripts\zone_237.pkl'

#Get Taxi Zone ID
zone = file_name.rstrip('.pkl')
zone = int(zone.lstrip('scripts\zone_'))
print(type(zone))
print(zone)

#Open the pickle file model
# with (open(file_name, "rb")) as f:
#     model = pickle.load(f)

# type(model)

#Set up Day variables
monday = 0
tuesday =0
wednesday = 0
thursday = 0
friday = 0
saturday = 0
sunday = 0

#Choose today as the Amble day
now = datetime.now()
# print(now.day)
# print(now)
if now.day == 1:
    monday = 1
elif now.day == 2:
    tuesday = 1
elif now.day == 3:
    wednesday = 1
elif now.day == 4:
    thursday = 1
elif now.day == 5:
    friday = 1
elif now.day == 6:
    saturday = 1
elif now.day == 7:
    sunday = 1

#Set up Weather Variables
windy =  0
cloudy = 0
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