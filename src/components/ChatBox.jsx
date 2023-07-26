import React, { useState, useEffect, useContext } from 'react';
import { ArrayContext } from "../context/ArrayContext";
import axios from 'axios';
import './ChatBox.css';

function ChatBox() {
    //const {inputValues, setInputValues} = useContext(AuthContext)
    const [tempTime, setTempTime] = useState(["Monday", 15]);
    const {globalArray, setGlobalArrayValue, getGlobalArrayItem, addToGlobalArray} = useContext(ArrayContext);
    const [message, setMessage] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [suggestionsArray, setSuggestionsArray] = useState([]);
    const [locationFound, setLocationFound] = useState(false);
    const [availableChoices, setAvailableChoices] = useState();
    const [chosenLocation, setChosenLocation] = useState();
    
    const baseOptions = [
        { value: '1', text: "Add a quiet cafe to my walk." },
        { value: '2', text: "Add a quiet restaurant to my walk." },
        { value: '3', text: "Tell me more about a stop on my walk." },
        { value: '4', text: "Find another point of interest along my walk." },
        { value: '5', text: "Give me some advice on walking for my mental health." },
      ];
    
    const initialOptions = ['1', '2', '3', '4', '5'];
    console.log("initialOptions:", initialOptions);
    const [allOptions, setAllOptions] = useState(initialOptions);
    console.log("allOptions:", allOptions);
    // Filter the base options to include only those that are still in allOptions.
    const filteredOptions = baseOptions.filter(baseOption => allOptions.includes(baseOption.value));
    let menuMessage = [
        {
          sender: 'Amble',
          text: "Hi! I'm the Amble assistant. How can I make your walk even better?",
          type: "text",
          stage: "menu",
          value: null
        },
        ...filteredOptions.map(option => ({
          sender: 'Amble',
          text: `\n \t ${option.value}: ${option.text}`,
          type: "clickable",
          stage: "menu",
          value: `${option.value}`
        }))
      ];
      console.log("filteredOptions", filteredOptions);
      console.log("menuMessage", menuMessage);
    const [messages, setMessages] = useState(menuMessage);

    const backMessage = '\nBack to options.'
    
    const [cafeOption, setCafeOption] = useState(false);
    const [restaurantOption, setRestaurantOption] = useState(false);
    const [stopInfo, setStopInfo] = useState(false);
    const [poiInfo, setPoiInfo] = useState(false);
    const [mentalHealthInfo, setMentalHealthInfo] = useState(false);

    // This function will be called when an option is selected.
    const selectOption = (selectedOption) => {
        // Remove the selected option from the list of options.
        const newOptions = allOptions.filter(option => option !== selectedOption);
        setAllOptions(newOptions);

        // Update the menu messages.
        const filteredOptions = baseOptions.filter(baseOption => newOptions.includes(baseOption.value));
        const newMenuMessage = [
            {
            sender: 'Amble',
            text: "How else can I make your walk even better?",
            type: "text",
            stage: "menu",
            value: null
            },
            ...filteredOptions.map(option => ({
            sender: 'Amble',
            text: `\n \t ${option.value}: ${option.text}`,
            type: "clickable",
            stage: "menu",
            value: `${option.value}`
            }))
        ];
        setMessages(newMenuMessage);
    }

    useEffect(() => {
        function replaceNoneWithNull(text) {
          // Replace None with "null", and replace single quote wrapped keys with double quote wrapped ones
          let replacedText = text.replace(/None/g, "null").replace(/'([^']+)':/g, '"$1":');
          // Removing trailing comma
          replacedText = replacedText.replace(/,(\s*})/g, '$1');
          return replacedText;
        }
      
        //temporary setGlobalArray for testing purposes
        let tempArray = `[{"id": "L3","name": "Macomb's Bridge Branch","type": "library","address": "2650 Adam Clayton Powell Jr. Boulevard, 10039 Manhattan","internet_access": None,
        "wheelchair_accessible": None,"opening_hours": None,"grid-id": 1371,"taxi-zone": 42,"precinct": 32,"b-score": None,"c-score": 0.5270044010715652,"rating": 1.5,"location": {"latitude": 40.8265379,"longitude": -73.9358448},"last_updated": None},
    {"id": "MA7","name": "International Center of Photography","type": "museum_art","address": "1133 6th Avenue, 10036 Manhattan","internet_access": None,"wheelchair_accessible": None,
        "opening_hours": None,"grid-id": 501,"taxi-zone": 230,"precinct": 14,"b-score": None,"c-score": 1.0,"rating": 1.5,"location": {"latitude": 40.7557394,"longitude": -73.9837251},"last_updated": None},
    {"id": "P22899286","name": "Madison Square Park","type": "park","address": None,"internet_access": None,"wheelchair_accessible": None,"opening_hours": "06:00-23:00",
        "grid-id": 419,"taxi-zone": 234,"precinct": 13,"b-score": None,"c-score": 0.6499952162265595,"rating": 1.5,"location": {"latitude": 40.7421868,"longitude": -73.987872},"last_updated": None},
    {"id": "WN23","name": None,"type": "walking_node","address": None,"internet_access": None,"wheelchair_accessible": None,"opening_hours": None,"grid-id": 82,"taxi-zone": 158,
        "precinct": 6,"b-score": None,"c-score": 0.5094001148105626,"rating": 1.5,"location": {"latitude": 40.7342479,"longitude": -74.01191},"last_updated": None},
    {"id": "WN24","name": None,"type": "walking_node","address": None,"internet_access": None,"wheelchair_accessible": None,"opening_hours": None,"grid-id": 52,
        "taxi-zone": 158,"precinct": 6,"b-score": None,"c-score": 0.5094001148105626,"rating": 1.5,"location": {"latitude": 40.7333014,"longitude": -74.0132614},}]`;
        
        let correctedArray = replaceNoneWithNull(tempArray);
        let parsedArray = JSON.parse(correctedArray);
        setGlobalArrayValue(parsedArray);
      }, []);  // Note the empty dependency array


    // Helper function for message splitting
    const addMessageToState = (message, sender, type = 'text', stage = 'menu', skip_first = false, value = null) => {
        // Split the message into separate lines
        const messageLines = message.split('\n');
        // Filter out empty lines and map each line to a message object
        const newMessages = messageLines
            .filter(line => line.trim() !== '')
            .map((line, index) => ({
                sender,
                text: line,
                type: skip_first && index === 0 ? 'text' : type,  // change type for the first line if skip_first is true
                stage,
                value: value ? value.toString() : (skip_first ? index.toString() : (index + 1).toString())  // convert to string
            }));
        // Add the new messages to the state
        setMessages(prevMessages => [...prevMessages, ...newMessages]);
    };


    // New function for filtering and generating option 3
    const handleStopInfoOptions = (waypoints) => {
        const locations = waypoints.filter(point => point.type !== "walking_node" && point.type !== "park_node");
        if (locations.length > 0) {
            let message = "\n Great choice! For which location would you like extra information?";
            let stopMessage = '';
            for (let i = 0; i < locations.length; i++) {
                stopMessage += `\n Location ${i + 1}: ${locations[i].name}\n`;
            }
            addMessageToState(message, 'Amble', "text", "option 3", false, null);
            addMessageToState(stopMessage, 'Amble', "clickable", "option 3");
            const availableChoices = locations.map((_, index) => `${index + 1}`);
            setAvailableChoices(availableChoices);
            setLocationFound(locations);
        } else {
            let message = "\n I'm sorry, I couldn't find any suitable locations at this time.";
            addMessageToState(message, 'Amble', "text", "option 3", false, null);
        }
    };


    const sendMessage = (e, value = null) => {
        if (e && typeof e.preventDefault === 'function') {
        e.preventDefault();
        }
        const first_options = ["1", "2", "3", "4", "5"];
        if (first_options.includes(value) && !cafeOption && !restaurantOption && !stopInfo && !poiInfo && !mentalHealthInfo) {
            let answerPrompt = ''
            if (value === "1") {
                answerPrompt = `\n${value}! Let's go for a coffee.`
                addMessageToState(answerPrompt, 'Me', "text", "option 1", false, null);
                setCafeOption(true);
                handleOption(value, globalArray, tempTime, false, null); //backend call for suggestions
            } else if (value === "2") {
                answerPrompt = `\n${value}! Let's go for a meal.`
                addMessageToState(answerPrompt, 'Me', "text", "option 2", false, null);
                setRestaurantOption(true);
                handleOption(value, globalArray, tempTime, false, null); //backend call for suggestions
            } else if (value === "3") {
                answerPrompt = `\n${value}! I want to find out more.`
                addMessageToState(answerPrompt, 'Me', "text", "option 3", false, null);
                setStopInfo(true);
                handleStopInfoOptions(globalArray); //reduces API calls to one
            } else if (value === "4") {
                answerPrompt = `\n${value}! I want to explore a little.`
                addMessageToState(answerPrompt, 'Me', "text", "option 4", false, null);
                setPoiInfo(true);
                handleOption(value, globalArray, tempTime, false, null);
            } else if (value === "5") {
                answerPrompt = `\n${value}! I want to take care of my mental health.`
                addMessageToState(answerPrompt, 'Me', "text", "option 5", false, null);
                setMentalHealthInfo(true);
                handleOption(value, globalArray, tempTime, false, null);
            }
            
        } else if (cafeOption) {
            // Handle user response for cafe choice (1)
            const choice = value.toLowerCase().replace('cafe', '').trim();
            if (availableChoices.includes(choice)) {
               setMessages([...messages, 
                { sender: 'Me', text: `Cafe ${choice} sounds great!`, type: 'text', stage: "option 1", value: null},
                { sender: 'Amble', text: `Wonderful! I added this cafe to your walk.`, type: 'text', stage: "option 1", value: null},
                { sender: 'Amble', text: `Enjoy your walk and your coffee!`, type: 'text', stage: "option 1", value: null},
                { sender: 'System', text: 'Back to options.', type: 'clickable', stage: "option 1", value: "1"}
              ]);
              setCafeOption(false); // Reset cafeOption state
              
                // Add cafe to route (globalArray)
                const picked_location = suggestionsArray[parseInt(choice) - 1];
                if (picked_location) {
                const closest_waypoint = picked_location[picked_location.length - 1];
                const new_format = {
                    id: picked_location[0].id, 
                    name: picked_location[0].name,
                    type: "cafe", 
                    address: picked_location[0].address, 
                    location: {latitude: picked_location[0].coordinates.lat, longitude: picked_location[0].coordinates.lng}
                  };

                const index_of_closest_waypoint = globalArray.findIndex(
                    item => item.name === closest_waypoint.name); 
                addToGlobalArray(new_format, index_of_closest_waypoint + 1);   
                }
            } 
        } else if (restaurantOption) {
            // Handle user response for restaurant choice (2)
            const choice = value.toLowerCase().replace('restaurant', '').trim();
            if (availableChoices.includes(choice)) {
                setMessages([...messages, 
                    { sender: 'Me', text: `I'd like to go to restaurant ${choice}.`, type: 'text', stage: "option 2", value: null}, 
                    { sender: 'Amble', text: `Wonderful! I added this restaurant to your walk.`, type: 'text', stage: "option 2", value: null},
                    { sender: 'Amble', text: `Enjoy your walk and your meal!`, type: 'text', stage: "option 2", value: null},
                    { sender: 'System', text: 'Back to options.', type: 'clickable', stage: "option 2", value: "2"}
                ]);
                setRestaurantOption(false); // Reset state
                
                // Add cafe to route (globalArray)
                const picked_location = suggestionsArray[parseInt(choice) - 1];
                if (picked_location) {
                const closest_waypoint = picked_location[picked_location.length - 1];
                const new_format = {
                    id: picked_location[0].id, 
                    name: picked_location[0].name,
                    type: "restaurant", 
                    address: picked_location[0].address, 
                    location: {latitude: picked_location[0].coordinates.lat, longitude: picked_location[0].coordinates.lng}
                    };

                const index_of_closest_waypoint = globalArray.findIndex(
                    item => item.name === closest_waypoint.name); 
                addToGlobalArray(new_format, index_of_closest_waypoint + 1);    
                }
            }
        } else if (stopInfo) {
            // Handle user response for stop information choice (3)
            const choice = value.toLowerCase().replace('location ', '').trim();
            if (availableChoices.includes(choice)) {
                setMessages([...messages, { sender: 'Me', text: `Tell me more about location ${choice}.`, type: 'text', stage: "option 3", value: null}]);
                const chosenLocation = locationFound[parseInt(choice) - 1];
                console.log("chosenLocation", chosenLocation);
                handleOption("3", globalArray, tempTime, true, chosenLocation); //backend call for chosen location info
                setStopInfo(false); // Reset state
            }      
        }   else if (poiInfo) {
            // Handle user response for POI information choice (4)
            setPoiInfo(false); // Reset state
        }  else if (mentalHealthInfo) {
            // Handle user response for mental health advice choice (5)
            setMentalHealthInfo(false); // Reset state
        } else {
            setMessages([...messages, { sender: 'Amble', text: "I'm sorry, I didn't understand that. Please choose one of the options by typing the number.", type: 'text', stage: "standard", value: null}]);
        }
        setMessage(""); 
    }

    const handleOption = (option, waypoints, time, ai_call=false, location_choice=null) => {
        axios({
            method: 'post',
            url: '/users/chatbox',
            data: {
                user_choice: option,
                waypoints: waypoints, 
                time: time, 
                ai_call: ai_call,
                location_choice: location_choice,
            }
        })
        .then(response => {
            const data = response.data.data;
            if (option === "1" || option === "2") {
                const newMessage = data[0];
                const locationFound = data[1];
                const availableChoices = data[2];
                const suggestionsArray = data[3];
            
                addMessageToState(newMessage, 'Amble', "clickable", `option ${option}`, true);

                // Update the state only after processing the data
                setLocationFound(locationFound);
                setAvailableChoices(availableChoices);
                setSuggestionsArray(suggestionsArray);
          
            } else if (option == "3") {
                const newMessage = data;
                addMessageToState(newMessage, 'Amble', 'text', 'option 3');
                addMessageToState(backMessage, 'System', 'clickable', 'option 3', false, "3");
            } else if (option === "4") {
                let newMessage = data[0];
                const waypoint_sample = data[2][0];
                addMessageToState(newMessage, 'Amble', 'text', 'option 4');

                waypoint_sample.forEach((waypoint) => {
                    // find the index of this waypoint in your global waypoints array
                    const waypointIndex = globalArray.findIndex(globalWaypoint => globalWaypoint.id === waypoint.id);
                    if (waypointIndex !== -1) {
                        if (waypoint["name"] != null) {
                            newMessage = `\n It is located close to your stop number ${waypointIndex + 1}, ${waypoint["name"]}.`;
                        } else {
                            newMessage = `\n It is located close to your stop number ${waypointIndex + 1}.`;
                        }
                        addMessageToState(newMessage, 'Amble', 'text', 'option 4');
                    }
                newMessage = "\n Enjoy your walk and a little exploration!"
                addMessageToState(newMessage, 'Amble', 'text', 'option 4', false, null);
                addMessageToState(backMessage, 'System', 'clickable', 'option 4', false, "4");
                });
            } else if (option === "5") {
                const adviceMessage = data;
                addMessageToState(adviceMessage, 'Amble');
                const addMessage = "\n Every little step on your walk is a great step for your mental health! \n Enjoy your walk!"
                addMessageToState(addMessage, 'Amble', 'text', 'option 5', false, null);
                addMessageToState(backMessage, 'System', 'clickable', 'option 4', false, "5");
                setMentalHealthInfo(false); // Reset state
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }


    return (
        <ArrayContext.Provider>
            <div className="ChatBox">
                <h2>Chat with Amble</h2>
                <div className="messages">
                    {messages.map((message, index) => {
                        if (message.sender === 'System') {
                            return (
                                <div key={index} className="System" onClick={() => selectOption(message.value)}>
                                    <p>{message.text}</p>
                                </div>
                            );
                        } else if (message.sender === 'Me') {
                            return (
                                <div key={index} className="Me">
                                    <p>{message.text}</p>
                                </div>
                            );
                        } else if (message.sender === "Amble") {
                            if (message.type === "clickable") {
                                return (
                                    <div key={index} className="Amble" onClick={() => sendMessage(null, message.value)}>
                                        <p>{message.text}</p>
                                    </div>
                                );
                            } else {
                                return (
                                    <div key={index} className="Amble">
                                        <p>{message.text}</p>
                                    </div>
                                );
                            }
                        }
                    })}
                </div>
            </div>
        </ArrayContext.Provider>
    );
    
}

export default ChatBox;