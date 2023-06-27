import requests
import random
import json

# Define the Overpass API query
overpass_query = """
[out:json];
area[name="Manhattan"]->.searchArea;
(
  way(area.searchArea)["leisure"="park"];
  relation(area.searchArea)["leisure"="park"];
);
out center;
"""

# Send the HTTP GET request to the Overpass API
response = requests.get(
    "https://overpass-api.de/api/interpreter", params={"data": overpass_query}
)

# Check if the request was successful (HTTP status code 200)
if response.status_code == 200:
    # Parse the JSON response
    data = response.json()

    # Create a dictionary to hold the park data
    park_data = []

    # Extract park information from the response
    parks = data.get("elements", [])

    # Process the park data
    for park in parks:
        park_id = park["id"]
        park_name = park.get("tags", {}).get("name", "Unknown Park")
        latitude = park.get("center", {}).get("lat")
        longitude = park.get("center", {}).get("lon")

        # Add park data to the dictionary
        park_data.append({
            "id": park_id,
            "name": park_name,
            "location": {"latitude": latitude, "longitude": longitude},
            "busi": random.randint(0, 100) / 100,
            "poll": random.randint(0, 100) / 100,
        })

    min_lat = 40.6
    max_lat = 40.9
    min_lon = -74.1
    max_lon = -73.9
    parks_to_remove = [95163097, 
                       468946468, 
                       48686595, 
                       33819583, 
                       129002500, 
                       608663280, 
                       39015952, 
                       367859701, 
                       25428484, 
                       222233979, 
                       367660740,
                       56469108,
                       2389631,
                       9791559]

    filtered_data = []

    for park in park_data:
        id = park["id"]
        latitude = park["location"]["latitude"]
        longitude = park["location"]["longitude"]

        if (min_lat <= latitude <= max_lat) and (min_lon <= longitude <= max_lon) and (id not in parks_to_remove):
            filtered_data.append(park)

    json_data = {"data": filtered_data}

    # Export the dictionary as a JSON file
    with open("src/components/parks.json", "w") as outfile:
        json.dump(json_data, outfile, indent=4)
        print("Exported park data to parks.json")
else:
    print("Error: Failed to fetch park data.")
