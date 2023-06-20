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
    park_data = {}

    # Extract park information from the response
    parks = data.get("elements", [])

    # Process the park data
    for park in parks:
        park_id = park["id"]
        park_name = park.get("tags", {}).get("name", "Unknown Park")
        latitude = park.get("center", {}).get("lat")
        longitude = park.get("center", {}).get("lon")

        # Add park data to the dictionary
        park_data[park_id] = {
            "name": park_name,
            "location": {"latitude": latitude, "longitude": longitude},
            "busi": random.randint(0, 100) / 100,
            "poll": random.randint(0, 100) / 100,
        }

    # Convert the dictionary to a JSON object
    json_data = json.dumps(park_data, indent=4)
    print(json_data)

    # Export the dictionary as a JSON file
    with open("src/components/parks.json", "w") as outfile:
        json.dump(park_data, outfile, indent=4)

    print("Exported park data to park_data.json")

else:
    print("Error: Failed to fetch park data.")
