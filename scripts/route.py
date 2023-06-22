import json
import random
from math import radians, sin, cos, sqrt, atan2

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

# Load park data from JSON file
with open("src/components/parks.json") as json_file:
    data = json.load(json_file)

# Extract latitude and longitude values
latitudes = []
longitudes = []

for park_id, park_data in data.items():
    latitudes.append(park_data["location"]["latitude"])
    longitudes.append(park_data["location"]["longitude"])

min_latitude = min(latitudes)
max_latitude = max(latitudes)
min_longitude = min(longitudes)
max_longitude = max(longitudes)

# Generate random starting point within the park boundaries
user_latitude = round(random.uniform(min_latitude, max_latitude), 7)
user_longitude = round(random.uniform(min_longitude, max_longitude), 7)

print(f"Starting location: {user_latitude}, {user_longitude}")
print("-----------------------------------------")

# Define the predefined distance to be covered
predefined_distance = 7  # Adjust this value as needed

visited_parks = []  # List to store visited parks

while predefined_distance > 0:
    closest_parks = []  # List to store closest parks
    closest_distances = []  # List to store distances to closest parks

    # Calculate distances to all parks from the current location
    for park_id, park_data in data.items():
        if park_id not in visited_parks:
            park_latitude = park_data["location"]["latitude"]
            park_longitude = park_data["location"]["longitude"]
            distance = calculate_distance(
                user_latitude, user_longitude, park_latitude, park_longitude
            )
            closest_distances.append(distance)
            closest_parks.append(park_id)

    # Sort the parks based on distance and select the 7 closest parks
    sorted_indices = sorted(range(len(closest_distances)), key=lambda k: closest_distances[k])
    closest_parks = [closest_parks[i] for i in sorted_indices[:7]]

    # Select the park with the lowest combination of "busi" and "poll" values
    selected_park = min(closest_parks, key=lambda park: data[park]["busi"] + data[park]["poll"])

    # Calculate distance to the selected park
    park_latitude = data[selected_park]["location"]["latitude"]
    park_longitude = data[selected_park]["location"]["longitude"]
    distance_to_park = calculate_distance(
        user_latitude, user_longitude, park_latitude, park_longitude
    )

    # Reduce the predefined distance by the distance to the selected park
    predefined_distance -= distance_to_park

    # Add the selected park to the visited parks list
    visited_parks.append(selected_park)

    # Print information about the current journey
    park_name = data[selected_park]["name"]
    park_busi = data[selected_park]["busi"]
    park_poll = data[selected_park]["poll"]
    print(f"Visiting Park: {park_name}")
    print(f"Busyness Rating: {park_busi}")
    print(f"Pollution Level: {park_poll}")
    print(f"Remaining Distance: {predefined_distance} km")
    print("-------------------------")

    # Update the user's location for the next iteration
    user_latitude = park_latitude
    user_longitude = park_longitude
