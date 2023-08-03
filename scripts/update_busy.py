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
    
#Function to get b-scores
def getBusy(taxizone):
    all_hours = {}
    for d in new_busyObj:
        if d["Taxi Zone ID"] == taxizone:
            all_hours[d["Hour"]] = round(d["Busyness Predicted"],4)
    return(all_hours)   

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
    crime_score[202] = 0.5
    for d in busyObj_crime['data']:
        crime_score[d["taxi-zone"]] = d["c-score"]

    list_crime_scores = list(crime_score.values())
    mean_crime = statistics.mean(list_crime_scores)
    median_crime = statistics.median(list_crime_scores)
    range_crime = max(list_crime_scores)-min(list_crime_scores)
    std_crime = statistics.stdev(list_crime_scores)
    # Print the results
    # print("\nMean of Crime Scores: ", mean_crime)
    # print("Median of Crime Scores: ", median_crime)
    # print("Range of Crime Scores: ", range_crime)
    # print("Standard Deviation of Crime Scores: ", std_crime)
    # print(len(list_crime_scores))
    # print(crime_score)
    return(crime_score)   

#Function to Update Nodes Busyness Scores (incorporates some of the earlier functions)
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

    #Update the b-score
    for n in Obj["data"]:
        taxizone = str(n["taxi-zone"])
        n["b-score"] = (getBusy(taxizone))
        n["last_updated"] = create_ts()
    # print(Obj["data"])

    #Write the updated json file with new busyness scores
    with open(os.path.join(json_dir, nodes), 'w') as f:
        json.dump(Obj, f, indent =4)

#Get path to json directory
json_dir = r"src\json-files" 

#json busyness files
busy_taxi = 'busy_taxi_final.json'
busy_bike = 'busy_bike_final.json'

#Open all nodes json file for crime score
crime = 'all_nodes.json'
busyObj_crime = openJson(json_dir,crime)
getCrime(busyObj_crime)

#json location files
park = 'park_locations.json'
library = 'library_locations.json'
parknode = 'park_node_locations.json'
community = 'community_locations.json'
museum = 'museum_art_locations.json'
worship = 'worship_locations.json'
walking_node = 'walking_node_locations.json'
all_nodes = 'all_nodes.json'

#Open taxi busyness json file
busyObj_taxi = openJson(json_dir,busy_taxi)

#Open bike busyness json file
busyObj_bike = openJson(json_dir,busy_bike)

 #Weightings for Busyness
taxi_weight = 0.64
bike_weight = 0.36
# crime_weight = 0.10

# print(busyObj)
for Obj in busyObj_taxi:
    if Obj['Taxi Zone ID'] == '128' or Obj['Taxi Zone ID'] == '202':
        # taxi_Obj = Obj['Taxi Zone ID']
        # standard_Obj = Obj['Busyness Predicted'] 
        weighted_Obj = Obj['Busyness Predicted'] * 1.0
    else:
        # taxi_Obj = Obj['Taxi Zone ID']
        # standard_Obj = Obj['Busyness Predicted'] 
        weighted_Obj = Obj['Busyness Predicted'] * 0.64

for Obj in busyObj_bike:
    # taxi_Obj = Obj['Taxi Zone ID']
    # standard_Obj = Obj['Busyness Predicted'] 
    weighted_Obj = Obj['Busyness Predicted'] * 0.36

#Create dummy values in Bike object for 2 missing taxi zones 
print(f'Pre addition = {len(busyObj_bike)}')
bike_202 = {'Timestamp':create_ts(),'Busyness Predicted': 0, 'Taxi Zone ID': '202'}
bike_128 = {'Timestamp':create_ts(),'Busyness Predicted': 0, 'Taxi Zone ID': '202'}
for i in range(24):
    bike_202['Hour'] = i
    bike_128['Hour'] = i
    busyObj_bike.append(bike_202)
    busyObj_bike.append(bike_128)
print(bike_202)
print(f'After addition = {len(busyObj_bike)}')

new_busyObj = []
for i in range(len(busyObj_taxi)):
    new_busyObj.append(busyObj_taxi[i]['Busyness Predicted'] + busyObj_bike[i]['Busyness Predicted'])

#Update the Nodes
# update_nodes(park, new_busyObj)
# update_nodes(library)
# update_nodes(parknode)
# update_nodes(community)
# update_nodes(museum)
# update_nodes(worship)
# update_nodes(walking_node)
# update_nodes(all_nodes)

# ####### End time - to get run time #########
# end_time = time.time()
# run_time = round((end_time - start_time),1)
# print(f'Run time to populate busyness scores for all 24 hours = {run_time} seconds')