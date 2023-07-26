import json
import random
from math import radians, sin, cos, sqrt, atan2
import time

#Create File Path
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent

# ####### Start time - to get run time #########
# start_time = time.time()

#Set up the base nodes (from Park Locations)
file_path_par = BASE_DIR /'src'/'json-files'/'park_locations.json'
with open(file_path_par) as json_file:
    basedata = json.load(json_file)

#Create a new dictionary and add the base nodes to it
data = {}
data.update(basedata)

#Check what other nodes have been selected in preferences
other_nodes_dict = {}
file_path_pre = BASE_DIR /'src'/'json-files'/'preferences.json'
with open(file_path_pre) as json_file:
    prefdata = json.load(json_file)
t = True
for x in prefdata["data_from_frontend"]["selectedOptions"]:
    other_nodes_dict.update({x:t})
    # print(other_nodes_dict)

#Add the nodes
for k,v in other_nodes_dict.items():
    if v == True:
        f = k+'.json'
        file_path_oth = BASE_DIR /'src'/'json-files'/f
        with open(file_path_oth) as file:
            nodes = json.load(file)
        # print(nodes)
        # print(type(nodes))
        data ={'data':data['data'] + nodes['data']}
        
# #Create a json object and Write to a json file
merged_json = json.dumps(data, indent=4) 
file_path_mer = BASE_DIR /'src'/'json-files'/'nodes_final.json'
with open(file_path_mer, 'w') as merged_file: 
    merged_file.write(merged_json)

# ####### End time - to get run time #########
# end_time = time.time()
# run_time = round((end_time - start_time),1)
# print(f'Run time to load all nodes = {run_time} seconds')

# Extract latitude and longitude values
latitudes = []
longitudes = []

for park_data in data["data"]:
    latitudes.append(park_data["location"]["latitude"])
    longitudes.append(park_data["location"]["longitude"])

# Function to calculate the distance between two coordinates using the haversine formula
def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Radius of the Earth in kilometers

    lat1_rad = radians(lat1)
    lon1_rad = radians(lon1)
    lat2_rad = radians(lat2)
    lon2_rad = radians(lon2)

    dlon = lon2_rad - lon1_rad
    dlat = lat2_rad - lat1_rad

    a = sin(dlat / 2) ** 2 + cos(lat1_rad) * cos(lat2_rad) * sin(dlon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    distance = R * c
    return distance
    
def magic(user_latitude, user_longitude, hour, dist):

    print(f"Starting location: ({user_latitude}, {user_longitude})")
    print("-----------------------------------------")

    # Define the predefined distance to be covered
    if dist > 10:
        dist = dist/10

    predefined_distance = dist  # Adjust this value as needed

    visited_parks = []  # List to store visited parks

    while predefined_distance > 0:
        closest_parks = []  # List to store closest parks
        closest_distances = []  # List to store distances to closest parks

        # Calculate distances to all parks from the current location
        for park_data in data["data"]:
            if park_data not in visited_parks:
                park_latitude = park_data["location"]["latitude"]
                park_longitude = park_data["location"]["longitude"]
                distance = calculate_distance(
                    user_latitude, user_longitude, park_latitude, park_longitude
                )
                closest_distances.append(distance)
                closest_parks.append(park_data)

        # Sort the parks based on distance and select the 7 closest parks
        sorted_indices = sorted(range(len(closest_distances)), key=lambda k: closest_distances[k])
        closest_parks = [closest_parks[i] for i in sorted_indices[:7]]

        # Select the park with the lowest combination of "busi" values
        selected_park = min(closest_parks, key=lambda park: park["b-score"][hour])
        # print(selected_park["busi"][hour])

        # Calculate distance to the selected park
        park_latitude = selected_park["location"]["latitude"]
        park_longitude = selected_park["location"]["longitude"]
        distance_to_park = calculate_distance(
            user_latitude, user_longitude, park_latitude, park_longitude
        )

        # Reduce the predefined distance by the distance to the selected park
        predefined_distance -= distance_to_park

        # Add the selected park to the visited parks list
        visited_parks.append(selected_park)

        # Print information about the current journey
        park_name = selected_park["name"]
        park_busi = selected_park["b-score"][hour]
        # print(f"Visiting Park: {park_name}")
        # print(f"Busyness Rating: {park_busi}")
        # print(f"Remaining Distance: {predefined_distance} km")
        # print(f"Location: ({park_latitude}, {park_longitude})")
        # print("-------------------------")

        # Update the user's location for the next iteration
        user_latitude = park_latitude
        user_longitude = park_longitude

    # print("Visited Parks:")
    # for park in visited_parks:
    #     print(f"Latitude: {park['location']['latitude']}, Longitude: {park['location']['longitude']}")

    visited_locations = [(park['location']['latitude'], park['location']['longitude']) for park in visited_parks]
    # print(visited_locations)
    return visited_locations

# magic(40.74218481889335, -73.98786664009094)

# Latitue: 40
# Longitude: -74



# ########### Accessing Data from Database (using fetch) ###################################
# import psycopg2 

# #Make a connection
# conn = psycopg2.connect(
#    database="namesDB", user='postgres', password='password', host='127.0.0.1', port= '5432'
# ) 

# conn.autocommit = True #Set auto commit false
# cursor = conn.cursor() #Create a cursor object
# cursor.execute('''SELECT * from users_userroute''') #Retrieve data
# result = cursor.fetchone(); #Fetch 1st row from the table
# print(result)
# conn.commit() #Commit changes in the database
# conn.close() #Close the connection
