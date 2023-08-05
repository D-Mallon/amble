import json
from os import path
import os
import time
import datetime
import statistics

####### Start time - to get run time #########
start_time = time.time()

#Function to open Json file
def openJson(dir,file):
    if path.isfile(os.path.join(dir, file)) is False:
        raise Exception(f"{file} File not found")
    with open(os.path.join(dir, file)) as f:
        return(json.load(f))

#Function to create some time elements
def create_ts(): 
    import pytz #Allows you to get time in different time
    nyc_zone = pytz.timezone("America/New_York") 
    nyc_time = datetime.datetime.now(nyc_zone)
    year = nyc_time.year
    month = nyc_time.month
    day = nyc_time.day
    hour= nyc_time.hour
    xdate = datetime.datetime(year, month, day, hour) #Produces datetime object
    dow = xdate.weekday() #Produces Day of the Week
    timestamp = datetime.datetime.timestamp(xdate) #Produces Timestamp Object.
    return(timestamp)

#Function to get c-scores
def getCrime(busyObj_crime):
    crime_score = {}
    crime_score[202] = 0.5 # Create dummy value (based on median value) for this missing zone
    for d in busyObj_crime['data']:
        crime_score[d["taxi-zone"]] = d["c-score"]
    # mean_crime = statistics.mean(list_crime_scores)
    # median_crime = statistics.median(list_crime_scores)
    # range_crime = max(list_crime_scores)-min(list_crime_scores)
    # std_crime = statistics.stdev(list_crime_scores)
    return(crime_score)   

#Function to Update Nodes Busyness Scores
def update_nodes(nodes,new_busyObj):
   
    #Function for get b-scores
    def getBusy(taxizone):
        all_hours = {}
        for d in new_busyObj:
            if d["Taxi Zone ID"] == taxizone:
                all_hours[d["Hour"]] = round(d["Busyness Predicted"],4)
        return(all_hours)

    #Get the node file
    if path.isfile(os.path.join(json_dir, nodes)) is False:
        raise Exception(f"{nodes} File not found")
    with open(os.path.join(json_dir, nodes)) as f:
        Obj = json.load(f)

    #Update the b-score and timestamp
    for n in Obj["data"]:
        taxizone = str(n["taxi-zone"])
        n["b-score"] = (getBusy(taxizone))
        n["last_updated"] = create_ts()

    #Write the updated json file with new busyness scores
    with open(os.path.join(json_dir, nodes), 'w') as f:
        json.dump(Obj, f, indent =4)

######################### Main Script  ###############################################
#Get path to json directory
json_dir = r"src\json-files" 

#json busyness files
busy_taxi = 'busy_taxi_final.json'
busy_bike = 'busy_bike_final.json'

#Names for json location files
park = 'park_locations.json'
library = 'library_locations.json'
parknode = 'park_node_locations.json'
community = 'community_locations.json'
museum = 'museum_art_locations.json'
worship = 'worship_locations.json'
walking_node = 'walking_node_locations.json'
all_nodes = 'all_nodes.json'
all_nodes_no_crime_in_bscore = 'all_nodes.json'

#Open taxi busyness json file
busyObj_taxi = openJson(json_dir,busy_taxi)

#Open bike busyness json file
busyObj_bike = openJson(json_dir,busy_bike)

 #Weightings for Busyness
taxi_weight = 0.64 #Based on MAE
bike_weight = 0.36 #Based on MAE
crime_weight = 0.20 #% of busyness score based on crime levels

#For checking
zone = '202'
time = 17

#Change bike timestamp heading to taxi timestamp heading
for Obj in busyObj_bike:
    if 'start_timestamp' in Obj:
        Obj['Timestamp'] = Obj.pop('start_timestamp')

#Create dummy rows for missing bike data
for i in range(24):
    bike_202 = {'Timestamp':create_ts(),'Busyness Predicted': -0.2, 'Taxi Zone ID': '202','Hour':i}
    bike_128 = {'Timestamp':create_ts(),'Busyness Predicted': -0.2, 'Taxi Zone ID': '128','Hour':i}
    busyObj_bike.append(bike_202)
    busyObj_bike.append(bike_128)

################## Checks ########################################
print(f'\nFor Zone {zone} at time {time}\n-----------------------')
for Obj in busyObj_taxi:
    if Obj['Taxi Zone ID'] == zone and  Obj['Hour'] == time:
        busy = Obj['Busyness Predicted']
        print(f'Taxi Busyness before weighting = {busy}')

for Obj in busyObj_bike:
    if Obj['Taxi Zone ID'] == zone and  Obj['Hour'] == time:
        busy = Obj['Busyness Predicted']
        print(f'Bike Busyness before weighting = {busy}')

#Build inputs for new combined bike and taxi data
new_busyObj = busyObj_taxi.copy()

for i in range(len(new_busyObj)):
    taxiID = new_busyObj[i]['Taxi Zone ID']
    hour = new_busyObj[i]['Hour']

    for j in range(len(busyObj_bike)):
        if taxiID == busyObj_bike[j]['Taxi Zone ID'] and hour == busyObj_bike[j]['Hour']:
            new_busyObj[i]['Busyness Predicted'] = (new_busyObj[i]['Busyness Predicted'] * taxi_weight) + (busyObj_bike[j]['Busyness Predicted'] * bike_weight)

update_nodes(all_nodes_no_crime_in_bscore,new_busyObj)


include_crime = True #Decide whether to include crime scores or not

#Open all nodes json file to get crime score
crime = 'all_nodes.json'
busyObj_crime = openJson(json_dir,crime)
crime_score = getCrime(busyObj_crime)
crime_score['202'] = 0.5

if include_crime == True:
    #Build Inputs for Crime data
    for Obj in new_busyObj:
        id = int(Obj['Taxi Zone ID'])
        for k,v in crime_score.items():
            if id == k:
                Obj['Busyness Predicted'] = Obj['Busyness Predicted'] * (1-crime_weight) + v * crime_weight

#Update the Nodes
update_nodes(park,new_busyObj)
update_nodes(library,new_busyObj)
update_nodes(parknode,new_busyObj)
update_nodes(community,new_busyObj)
update_nodes(museum,new_busyObj)
update_nodes(worship,new_busyObj)
update_nodes(walking_node,new_busyObj)
update_nodes(all_nodes,new_busyObj)

# ####### End time - to get run time #########
# end_time = time.time()
# run_time = round((end_time - start_time),1)
# print(f'Run time to populate busyness scores for all 24 hours = {run_time} seconds')

#After combining Checks
print(f'\nFor Zone {zone} at time {time}\n-----------------------')
for Obj in busyObj_taxi:
    if Obj['Taxi Zone ID'] == zone and  Obj['Hour'] == time:
        busy = Obj['Busyness Predicted']
        print(f'Taxi Busyness after weighting = {busy}')

for Obj in busyObj_bike:
    if Obj['Taxi Zone ID'] == zone and  Obj['Hour'] == time:
        busy = Obj['Busyness Predicted']
        print(f'Bike Busyness after weighting = {busy}')

for Obj in busyObj_crime:
    for k,v in crime_score.items():
        if zone == str(k):
            print(f'Crime score = {v}')

for Obj in new_busyObj:
    if Obj['Taxi Zone ID'] == zone and  Obj['Hour'] == time:
        busy = Obj['Busyness Predicted']
        if include_crime == True:
            print(f'Crime Busyness = {busy}')
        else:
            print(f'Taxi/Bike Busyness = {busy}')