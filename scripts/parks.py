import requests
import random
import json

################# Getting Taxi Zone Location ##########################
from shapely.geometry import Point, Polygon

# Load taxi zone data from JSON file
with open("src/components/location.json") as json_file:
    alldata = json.load(json_file)

#Extract the Manhattan zones
taxi_zone_name = []
taxi_zone_number = []
taxi_zone_multipolygon = []

for zone in alldata["data"]:
    if zone[-1] == 'Manhattan':
        taxi_zone_name.append(zone[-3])
        taxi_zone_number.append(zone[-2])
        taxi_zone_multipolygon.append(zone[-5])

# #Check Number of Taxi Zones
count = 0        
for i in range(len(taxi_zone_number)):     
    count += 1   
    f'Total Number of Taxi Zones = {count} \n'

#Function to clean polygon data and output Polygon object
def get_zone_poly(num):
    #Tidy up coordinates of Zone
    taxi_zone_multipolygon[num] = taxi_zone_multipolygon[num].strip('MULTIPOLYGON (((') #clean up first entry
    zone = taxi_zone_multipolygon[num].split(',')
    for i in range(len(zone)): # clean up other bits found
        zone[i] = zone[i].lstrip()
        zone[i] = zone[i].lstrip('((')
        zone[i] = zone[i].rstrip(')))')

    #Calculate the lat and long of different points in the Zone
    coord = []

    for d in range(0,len(zone)):
        pt = zone[d].split(' ')
        pt_lat = float(pt[0])
        pt_lon = float(pt[1])
        lat_lon = (pt_lat,pt_lon)
        coord.append(lat_lon)

    #Create Polygon object
    zone_poly = Polygon(coord)
    zone_details = [taxi_zone_number[num],taxi_zone_name[num],zone_poly]
    return(zone_details)

#Get all the Taxi Zone data - number, name, polygon - for all zones
all_zones = []
for i in range(count):
    all_zones.append(get_zone_poly(i))

###########################Build Parks Json File####################
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

    # Get what Taxi Zone the Park is in
        point = Point(longitude, latitude)
        for i in range(count): 
            if(point.within(all_zones[i][-1])):
                taxizone = all_zones[i][0]

        # Add park data to the dictionary
        park_data[park_id] = {
            "name": park_name,
            "location": {"latitude": latitude, "longitude": longitude},
            "taxizone": taxizone,
            "busi": random.randint(0, 100) / 100,
            "poll": random.randint(0, 100) / 100,
        }

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

    filtered_data = {}
    
    count = 0 #counts the number of parks
    for key, park in park_data.items():
        count += 1
        latitude = park["location"]["latitude"]
        longitude = park["location"]["longitude"]

        if (min_lat <= latitude <= max_lat) and (min_lon <= longitude <= max_lon) and (key not in parks_to_remove):
            filtered_data[key] = park
    
    # Convert the dictionary to a JSON object
    json_data = json.dumps(filtered_data, indent=4)
    
    print(json_data)
    print(f'No. of Parks = {count}')

    # Export the dictionary as a JSON file
    with open("parks.json", "w") as outfile:
        json.dump(filtered_data , outfile, indent=4)
        print("Exported park data to parks.json")

else:
    print("Error: Failed to fetch park data.")
