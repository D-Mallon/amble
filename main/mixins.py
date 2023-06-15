from django.conf import settings
import requests
import json
import datetime
from humanfriendly import format_timespan

'''Handles directions from Google'''
def Directions(*args, **kwargs):
	lat_a = kwargs.get("lat_a")
	long_a = kwargs.get("long_a")
	lat_wp1 = kwargs.get("lat_wp1")
	long_wp1 = kwargs.get("long_wp1")
	lat_wp2 = kwargs.get("lat_wp2")
	long_wp2 = kwargs.get("long_wp2")
	lat_wp3 = kwargs.get("lat_wp3")
	long_wp3 = kwargs.get("long_wp3")
	lat_b = kwargs.get("lat_b")
	long_b = kwargs.get("long_b")

	origin = f'{lat_a},{long_a}'
	destination = f'{lat_b},{long_b}'
	waypoints = f'{lat_wp1},{long_wp1}|{lat_wp2},{long_wp2}|{lat_wp3},{long_wp3}'
	result = requests.get(
		'https://maps.googleapis.com/maps/api/directions/json?',
		 params={
		 'origin': origin,
		 'destination': destination,
		 'waypoints': waypoints,
		 "key": settings.GOOGLE_API_KEY
		 })

	directions = result.json()

	#print(f'{directions}')
	if directions["status"] == "OK":
		routes = directions["routes"][0]["legs"]
		distance = 0
		duration = 0
		route_list = []
		for route in range (len(routes)):
			distance += int(routes[route]["distance"]["value"])
			duration += int(routes[route]["duration"]["value"])
			
			route_step = {
			'origin' : routes[route]["start_address"],
			'destination' : routes[route]["end_address"],
			'distance' : routes[route]["distance"]["text"],
			'duration' : routes[route]["duration"]["text"],
			
			'steps' : [
				[
				s["distance"]["text"],
				s["duration"]["text"],
				s["html_instructions"],
				]
				for s in routes[route]["steps"]]
			}
			route_list.append(route_step)
			#print(f'{route} {route_list}')
	return {
		"origin": route_step['origin'],
		"destination": route_step['destination'],
		"distance": f"{round(distance)} ft or {round(distance/5280,2)} miles",
		"duration": format_timespan(duration),
		"route": route_list
		}