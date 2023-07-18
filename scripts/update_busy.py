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
    
#Function fo get b-scores
def getBusy(taxizone):
    all_hours = {}
    for d in busyObj:
        if d["Taxi Zone ID"] == taxizone:
            all_hours[d["Hour"]] = round(d["Busyness Predicted"],0)
    return(all_hours)    

#Function to Update Nodes Busyness Scores  (incorporates some of the earlier functions)
def update_nodes(nodes):

    #Function fo get b-scores
    def getBusy(taxizone):
        all_hours = {}
        for d in busyObj:
            if d["Taxi Zone ID"] == taxizone:
                all_hours[d["Hour"]] = round(d["Busyness Predicted"],0)
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
    # print(Obj["data"])

    #Write the updated json file with new busyness scores
    with open(os.path.join(json_dir, nodes), 'w') as f:
        json.dump(Obj, f, indent =4)

#Get path to json directory
json_dir = r"src\json-files" 

#json busyness file
busy = 'busyness.json'

#json location files
park = 'park_locations.json'
library = 'library_locations.json'
parknode = 'park_node_locations.json'
community = 'community_locations.json'
museum = 'museum_art_locations.json'
worship = 'worship_locations.json'
walking_node = 'walking_node_locations.json'

#Create path to busyness json file and open it
busyObj = openJson(json_dir,busy)
if path.isfile(os.path.join(json_dir, busy)) is False:
    raise Exception(f"{busy} File not found")

with open(os.path.join(json_dir, busy)) as f:
    busyObj = json.load(f)

#Update the Nodes
update_nodes(park)
update_nodes(library)
update_nodes(parknode)
update_nodes(community)
update_nodes(museum)
update_nodes(worship)
update_nodes(walking_node)

# #Create paths to json files and open them
# busyObj = openJson(json_dir,file_busy)

# parkObj = openJson(json_dir,file_park)
# libraryObj = openJson(json_dir,file_library)
# parkNodeObj = openJson(json_dir,file_parknode)

# #################### Update Busyness Scores ##################################
# # Update park data with latest busyness scores
# for park in parkObj["data"]:
#     taxizone = str(park["taxi-zone"])
#     park["b-score"] = (getBusy(taxizone))

# #Save the updated parks json file
# with open(os.path.join(json_dir, file_park), 'w') as f:
#     json.dump(parkObj, f, indent =4)

# # Update park node data with latest busyness scores
# for parknode in parkNodeObj["data"]:
#     taxizone = str(parknode["taxi-zone"])
#     parknode["b-score"] = (getBusy(taxizone))

# #Save the updated park node json file
# with open(os.path.join(json_dir, file_parknode), 'w') as f:
#     json.dump(parkNodeObj, f, indent =4)

# # Update library data with latest busyness scores
# for library in libraryObj["data"]:
#     taxizone = str(library["taxi-zone"])
#     library["b-score"] = (getBusy(taxizone))

# #Save the updated library json file
# with open(os.path.join(json_dir, file_library), 'w') as f:
#     json.dump(libraryObj, f, indent =4)

####### End time - to get run time #########
end_time = time.time()
run_time = round((end_time - start_time),1)
print(f'Run time to populate busyness scores for all 24 hours = {run_time} seconds')