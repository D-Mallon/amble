import json
import random

with open("src/components/parks.json") as json_file:
    data = json.load(json_file)

latitudes = []
longitudes = []

for park_id, park_data in data.items():
    latitudes.append(park_data["location"]["latitude"])
    longitudes.append(park_data["location"]["longitude"])

min_latitude = min(latitudes)
max_latitude = max(latitudes)
min_longitude = min(longitudes)
max_longitude = max(longitudes)

user_latitude = round(random.uniform(min_latitude, max_latitude), 7)
user_longitude = round(random.uniform(min_longitude, max_longitude), 7)

print(min_longitude)
print(max_longitude)
print(user_longitude)
