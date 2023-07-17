import json
import random
from math import radians, sin, cos, sqrt, atan2

with open('src/json-files/park_locations.json') as file1:
    data1 = json.load(file1)
with open('src/json-files/park_node_locations.json') as file2:
    data2 = json.load(file2)

merged_data = {**data1, **data2} # Merge the dictionaries

merged_json = json.dumps(merged_data, indent=4) # Convert the merged dictionary to JSON format

with open('src/json-files/nodes_final.json', 'w') as merged_file: #Write to a file
    merged_file.write(merged_json)

# Load park data from JSON file
# with open("src/json-files/park_locations.json") as json_file:
with open("src/json-files/nodes_final.json") as json_file: 
    data = json.load(json_file)

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
    

def magic(user_latitude, user_longitude, hour):


    print(f"Starting location: ({user_latitude}, {user_longitude})")
    print("-----------------------------------------")

    # Define the predefined distance to be covered
    predefined_distance = 5  # Adjust this value as needed

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
        selected_park = min(closest_parks, key=lambda park: park["busi"][hour])
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
        park_busi = selected_park["busi"][hour]
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


# from collections import defaultdict # Allows merging of dictionaries with overwriting common keys

# #Function to merge dictionaries
# def merge_json(json1, json2):
#     merged_json = defaultdict(list)
#     for key, value in json1.items():
#         merged_json[key].append(value) # Add values from json1
#     for key, value in json2.items():
#         merged_json[key].append(value)  # Add values from json2
#     return merged_json

# # Load park data from JSON file
# with open("src/json-files/park_locations.json") as json_file:
#     data = json.load(json_file)

# #Toggle to decide whether to include Library data
# include_park_nodes = True
# # Load library data from JSON file
# if include_park_nodes == True:
#     with open("src/json-files/park_node_locations.json") as json_file:
#         parknode_data = json.load(json_file)
#     merged_json = merge_json(data,parknode_data) #Would need to save this to 'data' if wanted to use in file
    
#     x = merged_json["data"][0][0]['location']['latitude']
#     print(x)
#     print(type(x))
    
#     with open("src/json-files/merged.json",'w') as json_file:
#         json.dump(merged_json, json_file, indent=4)


# def merge_json_files(file_paths):
#     merged_contents = []

#     for file_path in file_paths:
#         with open(file_path, 'r', encoding='utf-8') as file_in:
#             merged_contents.extend(json.load(file_in))

#     with open('src/json-files/nodes_final.json', 'w', encoding='utf-8') as file_out:
#         json.dump(merged_contents, file_out, indent=4)

# paths = [
#     'src/json-files/park_locations.json',
#     'src/json-files/park_node_locations.json'
# ]

# merge_json_files(paths)