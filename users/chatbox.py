from dotenv import load_dotenv
import os

load_dotenv()

MAPS_APIKEY = os.environ.get('MAPS_APIKEY')
OPENAI_APIKEY = os.environ.get('OPENAI_APIKEY')

import populartimes
import openai
import random
import textwrap
from users.populartimes_module import get_least_busy_locations, get_day_and_hour

openai.api_key = OPENAI_APIKEY

###deprecated
def start_conversation(): 
    # gpt starts chat with base state message and awaits user's decision
    print("Amble: Hi! I'm the Amble assistant. How can I make your walk even better?")
    print("Amble: You have several options: \n\t1: Add a quiet cafe. \n\t2: Add a restaurant. \n\t3: Tell me more about a stop.\n\t4: Find points of interest along the way. \n\t5: Advice on mental health walking.")
    user_choice = input("Amble: Please choose one of the option by typing the number.")
    while True:
        if user_choice in ["1", "2", "3", "4", "5"]:
            print(f"Me: I'm picking option {user_choice}.")
            break
        else:
            # Inform user about invalid input
            input("Amble: I'm sorry, I didn't understand that. Please choose one of the options by typing the number.")
    return user_choice

### Option 1 & 2: Cafe Scenario, Restaurant Scenario
def get_quiet_indicator(place):
    trip_time = get_day_and_hour()
    weekday = trip_time[0]
    hour = trip_time[1]
    for pop_time in place['populartimes']:
        if pop_time['name'] == weekday:
            usual_populartimes = pop_time['data'][hour]
            break
    try:
        current_populartimes = place['current_popularity']
    except KeyError:
        current_populartimes = None
    if usual_populartimes <= 10:
        return ['very quiet', usual_populartimes, current_populartimes]
    elif 10 < usual_populartimes <= 30:
        return ['quiet', usual_populartimes, current_populartimes]
    elif 30 < usual_populartimes <= 60:
        return ['moderate', usual_populartimes, current_populartimes]
    else:
        return ['busy', usual_populartimes, current_populartimes]
    
def populate_busy_message(suggestion, place_type):
    messages = []
    valid_options = []
    for i in range(len(suggestion)):
        if suggestion[i] is not None:
            valid_options.append(str(i+1))  # record valid option
            place_info = suggestion[i][0]
            ref_point_info = suggestion[i][2]
            quietness = get_quiet_indicator(place_info)
            if quietness[2] != None: 
                message = f"\t{place_type.capitalize()} {i+1}: {place_info['name']} is close to {ref_point_info['name']}, located at {place_info['address']}.\n\tAt this time, it's usually {quietness[0]} (with a quietness rating of {quietness[1]}/100), and currently it's {quietness[2]}/100."
            else:
                message = f"\t{place_type.capitalize()} {i+1}: {place_info['name']} is close to {ref_point_info['name']}, located at {place_info['address']}.\n\tAt this time, it's usually {quietness[0]} (with a quietness rating of {quietness[1]}/100)."
            messages.append(message)
        else:
            messages.append(f"\t{place_type.capitalize()} {i+1}: No more suggestions available.")
    if not valid_options:
        return f"No {place_type} suggestions available at this time.", False, []
    return "\n".join(messages), True, valid_options

### Option 3&4&5: Stop Information, POI Information, Mental Health Advice
def get_location_info(location_name, location_address):
    openai.api_key = OPENAI_APIKEY
    prompt = f"Generate a detailed description about {location_name},{location_address} Manhattan, focusing on its relation to mental health and self-improvement without restating its location."
    try:
        response = openai.Completion.create(
            engine="text-davinci-001",
            prompt=prompt,
            max_tokens=100
        )
        return f"Amble: {response.choices[0].text.strip()}"
    except Exception as e:
        #print(f"Error: {e}")
        return "Amble: I'm sorry, I couldn't find any extra information at this time. Try again later."
    
def get_poi_info(waypoints):
    openai.api_key = OPENAI_APIKEY
    descriptions = []
    max_descriptions = 1
    # Randomly sample up to max_descriptions waypoints
    waypoints_sample = random.sample(waypoints, min(max_descriptions, len(waypoints)))
    for waypoint in waypoints_sample:
        location_name = waypoint.get('name')
        location_address = waypoint.get('location')
        if not location_name and not location_address:
            continue  # Skip if both are missing
        # Define prompt with name and location, or just location if name is missing
        if location_name:
            prompt = f"Provide a brief, single sentence description (up t0 100 characters including spaces) of a notable Point of Interest near {location_name}, Manhattan. This description should highlight the POI's relevance to mental health and self-improvement. Do not restate the location's address."
        else:
            prompt = f"Provide a brief, single sentence description (up t0 100 characters including spaces) of a notable Point of Interest near {location_address}, Manhattan. This description should highlight the POI's relevance to mental health and self-improvement. Do not restate the location's address."
        try:
            response = openai.Completion.create(
                engine="text-davinci-001",
                prompt=prompt,
                max_tokens=300 
            )
            description = f"Amble: {response.choices[0].text.strip()}"
            descriptions.append(textwrap.shorten(description, width=300, placeholder="..."))
        except Exception as e:
            #print(f"Error: {e}")
            descriptions.append("Amble: I'm sorry, I couldn't find any points of interest along your way. Try again later.")
    # Join descriptions into a single message, ensuring it does not exceed 300 characters
    message = ' '.join(descriptions)
    message = textwrap.shorten(message, width=300, placeholder="...")
    return message, waypoint

#################################################################
def option_handler(user_choice, waypoints, time, ai_call=False, location_choice=None):
    if user_choice == "1":
        # Add a quiet cafe to the route
        trip_time = get_day_and_hour(time) # weekday, hour format
        suggestion = get_least_busy_locations(MAPS_APIKEY, [waypoints], 'cafe', trip_time)
        message = "Amble: Great choice! These are the suggestions I have for you:\n"
        populated_message, location_found, available_choices = populate_busy_message(suggestion, "cafe")
        if location_found:
            choice_message = "Amble: Which cafe would you like to add to your route?"
            message.append(populated_message, choice_message)
            return message, location_found, available_choices
        else:
            sorry_message = "Amble: I'm sorry, I couldn't find any suitable locations at this time."
            return message.append(sorry_message)
        
    if user_choice == "2":
        trip_time = get_day_and_hour(time) # weekday, hour format
        # Add a quiet restaurant to the route
        suggestion = get_least_busy_locations(MAPS_APIKEY, [waypoints], 'restaurant', trip_time)
        message = "Amble: Great choice! These are the suggestions I have for you:\n"
        populated_message, location_found, available_choices = populate_busy_message(suggestion, "restaurant")
        if location_found:
            choice_message = "Amble: Which restaurant would you like to add to your route?"
            message.append(populated_message, choice_message)
            return message, location_found, available_choices
        else:
            sorry_message = "Amble: I'm sorry, I couldn't find any suitable locations at this time."
            return message.append(sorry_message)

    if user_choice == "3":
        if not ai_call:
            # Tell me more about a stop
            locations = [point for point in waypoints if point["type"] != "walking_node" and point["type"] != "park_node"]
            if not locations:
                message = "Amble: I'm sorry, I couldn't find any suitable locations at this time."
                return message, False, []
            else:
                message = "Amble: Great choice! Here are some locations you might be interested in:\n"
                for i, location in enumerate(locations):
                    message += f"\tLocation {i + 1}: {location['name']}\n"
                message += "Amble: For which location would you like extra information?\n"
            return message, True, [str(i+1) for i in range(len(locations))]
        elif ai_call:
            location = location_choice
            location_name = location["name"]
            location_address = location["address"]
            message = get_location_info(location_name, location_address)
            message.append("Amble: Enjoy your walk!")
            return message, False, []
        
    if user_choice == "4":
        # Get information about points of interest along the way
        message, waypoint = get_poi_info(waypoints)
        if "I'm sorry, I couldn't find any points of interest along your way. Try again later." in message:
            # Error handling: no POIs found
            return message, False, []
        else:
            # Success: return message and waypoint
            return message, True, [waypoint]
