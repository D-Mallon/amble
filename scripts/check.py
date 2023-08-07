import json
from os import path
import os

#Function to open Json file
def openJson(dir,file):
    if path.isfile(os.path.join(dir, file)) is False:
        raise Exception(f"{file} File not found")
    with open(os.path.join(dir, file)) as f:
        return(json.load(f))

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
all_nodes_no_crime_in_bscore = 'all_nodes_no_crime_in_bscore.json'

allnodes = openJson(json_dir,all_nodes)
taxizone = [4,12,13,24,41,42,43,45,48,50,68,74,75,79,87,88,90,100,107,113,114,116,120,125
            ,127,128,137,140,141,142,143,144,148,151,152,158,161,162,163,164,166,170,186,202
            ,209,211,224,229,230,231,232,233,234,236,237,238,239,243,244,246,249,261,262,263]

# fileresults = 'cscores.txt'
# file = open(fileresults, "a")

for num in taxizone:
    # print(allnodes['data'])
    cscores = []
    for Obj in allnodes['data']:
        if str(num) == str(Obj['taxi-zone']):
            # print(Obj['c-score'])
            cscores.append(round(Obj['c-score'],3))
    # file.write(f'For taxizone = {num}, c-scores = {set(cscores)} \n')
    # print(f'For taxizone = {num}, c-scores = {set(cscores)}')

  