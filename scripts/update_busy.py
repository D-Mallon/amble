import json
from os import path
import os
import time


####### Start time - to get run time #########
start_time = time.time()

#Function to open Json file
def openJson(dir,file):
    if path.isfile(os.path.join(dir, file)) is False:
        raise Exception(f"{file} File not found")
    with open(os.path.join(dir, file)) as f:
        return(json.load(f))

json_dir = r"src\json-files" 

#Create path to busyness json file and open it
file_busy = 'busyness.json'
busyObj = openJson(json_dir,file_busy)

#Create path to parks json file and open it
file_park = 'park_locations.json'
parkObj = openJson(json_dir,file_park)

#Create path to libraries json file and open it
file_library = 'library_locations.json'
libraryObj = openJson(json_dir,file_library)

#Create path to park nodes json file and open it
file_parknode = 'park_node_locations.json'
parkNodeObj = openJson(json_dir,file_parknode)

#################### Update Busyness Scores ##################################
#Function to get Busyness scores from json file
def getBusy(taxizone):
    all_hours = {}
    for d in busyObj:
        if d["Taxi Zone ID"] == taxizone:
            all_hours[d["Hour"]] = round(d["Busyness Predicted"],0)
    return(all_hours)

# Update park data with latest busyness scores
for park in parkObj["data"]:
    taxizone = str(park["taxi-zone"])
    park["b-score"] = (getBusy(taxizone))

#Save the updated json file
with open(os.path.join(json_dir, file_park), 'w') as f:
    json.dump(parkObj, f, indent =4)

# Update park node data with latest busyness scores
for parknode in parkNodeObj["data"]:
    taxizone = str(parknode["taxi-zone"])
    parknode["b-score"] = (getBusy(taxizone))

#Save the updated park node json file
with open(os.path.join(json_dir, file_parknode), 'w') as f:
    json.dump(parkNodeObj, f, indent =4)

# Update library data with latest busyness scores
for library in libraryObj["data"]:
    taxizone = str(library["taxi-zone"])
    library["b-score"] = (getBusy(taxizone))

#Save the updated library json file
with open(os.path.join(json_dir, file_library), 'w') as f:
    json.dump(libraryObj, f, indent =4)

####### End time - to get run time #########
end_time = time.time()
run_time = round((end_time - start_time),1)
print(f'Run time to populate busyness scores for all 24 hours = {run_time} seconds')