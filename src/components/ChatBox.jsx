import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './ChatBox.css';

function ChatBox() {
    const {inputValues, setInputValues} = useContext(AuthContextProvider)
    const [message, setMessage] = useState("");
    const [locationFound, setLocationFound] = useState(false);
    const [availableChoices, setAvailableChoices] = useState();
    const [messages, setMessages] = useState([
        {
            sender: 'Amble',
            text: "Hi! I'm the Amble assistant. How can I make your walk even better?",
        },
        {
            sender: 'Amble',
            text: "You have several options: \n\t1: Add a quiet cafe. \n\t2: Add a restaurant. \n\t3: Tell me more about a stop.\n\t4: Find points of interest along the way. \n\t5: Advice on mental health walking.",
        },
    ]);

    const [cafeOption, setCafeOption] = useState(false);
    const [restaurantOption, setRestaurantOption] = useState(false);
    const [stopInfo, setStopInfo] = useState(false);
    const [poiInfo, setPoiInfo] = useState(false);
    const [mentalHealthInfo, setMentalHealthInfo] = useState(false);

    const sendMessage = (e) => {
        e.preventDefault();
        const first_options = ["1", "2", "3", "4", "5"];
        if (first_options.includes(message)) {
            setMessages([...messages, { sender: 'Me', text: `I'm picking option ${message}.`}]);
            if (message === "1") {
                setCafeOption(true);
            } else if (message === "2") {
                setRestaurantOption(true);
            } else if (message === "3") {
                setStopInfo(true);   
            } else if (message === "4") {
                setPoiInfo(true);
            } else if (message === "5") {
                setMentalHealthInfo(true);
            }
            handleOption(message, inputValues["waypoints"], [inputValues["weekday"], inputValues["hour"]], false, null); //backend call for suggestions

        } else if (cafeOption) {
            // Handle user response for cafe choice (1)
            const choice = message.toLowerCase().replace('cafe', '').trim();
            if (availableChoices.includes(choice)) {
                setMessages([...messages, { sender: 'Me', text: `I'm picking ${choice}.`}, { sender: 'Amble', text: `Wonderful! Enjoy your walk and your coffee!`}]);
                setCafeOption(false); // Reset cafeOption state
                // Call backend function to add cafe to route and generate next message
            } 
        } else if (restaurantOption) {
            // Handle user response for restaurant choice (2)
            const choice = message.toLowerCase().replace('restaurant', '').trim();
            if (availableChoices.includes(choice)) {
                setMessages([...messages, { sender: 'Me', text: `I'm picking ${choice}.`}, { sender: 'Amble', text: `Wonderful! Enjoy your walk and your meal!`}]);
                setCafeOption(false); // Reset cafeOption state
                // Call backend function to add cafe to route and generate next message
            } 
        } else if (stopInfo) {
            // Handle user response for stop information choice (3)
            const choice = message.toLowerCase().replace('location ', '').trim();
            if (availableChoices.includes(choice)) {
                setMessages([...messages, { sender: 'Me', text: `I'm picking Location ${choice}.` }]);
                const chosenLocation = inputValues["waypoints"][availableChoices[parseInt(choice)-1]];
                handleOption("3", inputValues["waypoints"], [inputValues["weekday"], inputValues["hour"]], true, chosenLocation); //backend call for chosen location info
                setStopInfo(false); // Reset state
            }        
        } else if (poiInfo) {
            // Handle user response for POI information choice (4)
            setPoiInfo(false); // Reset state
        } else if (mentalHealthInfo) {
            // Handle user response for mental health advice choice (5)
            setMentalHealthInfo(false); // Reset state
        } else {
            setMessages([...messages, { sender: 'Amble', text: "I'm sorry, I didn't understand that. Please choose one of the options by typing the number." }]);
        }
        setMessage("");
    }

    const handleOption = (option, waypoints, time, ai_call=false, location_choice=null) => {
        axios({
            method: 'post',
            url: '/chatbox',
            data: {
                user_choice: option,
                waypoints: waypoints, 
                time: time, 
                ai_call: ai_call,
                location_choice: location_choice,
            }
        })
    .then(response => response.json())
    .then(data => {
        if (option == "1" | option == "2") {
            const {new_message, location_found, available_choices} = data;
            const ambleMessages = new_message.split('\n');
            const newMessages = ambleMessages.map(text => ({ sender: 'Amble', text }));
            setMessages(prevMessages => [...prevMessages, ...newMessages]);
            setLocationFound(location_found);
            setAvailableChoices(available_choices);
        } else if (option == "3") {
            if (!stopInfo) {
                const {new_message, location_found, available_choices} = data;
                setMessages([...messages, { sender: 'Amble', text: new_message }]);
                setLocationFound(location_found);
                setAvailableChoices(available_choices);
            } else {
                const new_message = data;
                setMessages([...messages, { sender: 'Amble', text: new_message }]);
                setStopInfo(false);
            }
        } else if (option === "4") {
            const new_message = data;
            const waypoint = data.waypoint;
            const waypointIndex = inputValues["waypoints"].indexOf(waypoint);
            const poiMessage = `It is located close to your stop number ${waypointIndex + 1}, ${waypoint["name"]}. Enjoy your walk and your little exploration!`;
            setMessages([...messages, { sender: 'Amble', text: new_message }, { sender: 'Amble', text: poiMessage }]);
        }
    });
    }

    return (
        <div className="chatbox">
            <div className="messages">
                {messages.map((msg, i) =>
                    <div className={msg.sender} key={i}>
                        <p>{msg.text}</p>
                    </div>
                )}
            </div>
            <form onSubmit={sendMessage}>
                <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
                <button type="submit">Enter</button>
            </form>
        </div>
    )
}

export default ChatBox;
