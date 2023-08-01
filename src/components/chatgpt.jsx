import React, { useRef, useEffect, useState,useContext } from 'react';
import {Link, useNavigate} from 'react-router-dom';

import { createTheme,ThemeProvider  } from '@mui/material/styles';
import MenuBar2 from './MenuBar2';
import './resources.css';
// import { globalArray } from './useRouteDisplay.jsx';
import MyButton from './mainbutton';
import MyFunctionButton from './functionbutton';
import MapBackground from './mapbackground';
import Box from "@mui/material/Box";
import { ArrayContext, useWaypointsArray } from '../context/ArrayContext';

import axios from 'axios';

const ChatGPT = () => {
    const [userInput, setUserInput] = useState('');
    const [response, setResponse] = useState('');
    const { globalArray, setGlobalArrayValue } = useWaypointsArray();
    console.log(globalArray)

    // Create a list with the data from the amble
    const name = [];
    const type = [];
    const address = []; 
    const coord = [];
    for (let item in globalArray){
      // console.log(item + ':', globalArray[item]['name']);
      const tempitem_name = globalArray[item]['name'];
      if (tempitem_name !== null && tempitem_name !== 'Unknown Park') {
        name.push(globalArray[item]['name']);
    }
    const tempitem_type = globalArray[item]['type'];
      if (tempitem_type !== null) {
        type.push(globalArray[item]['type']);
    }
    const tempitem_address = globalArray[item]['address'];
      if (tempitem_address !== null && tempitem_address !== 'null' ) {
        address.push(globalArray[item]['address']);
    }
    const tempitem_coord = globalArray[item]['location'];
    if (tempitem_coord !== null && tempitem_coord !== 'null' ) {
      const lat = tempitem_coord['latitude']
      const lon = tempitem_coord['longitude']
      coord.push({'latitude': lat, 'longitude':lon});
  }
  }
  console.log(name);
  console.log(type);
  console.log(address);
  console.log(coord);
    
    const handleChange = (event) => {
      setUserInput(event.target.value);
    };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/users/chatgpt', {
        input: userInput,
      });
      setResponse(response.data.message);
      console.log(response.data.message);
    } catch (error) {
      console.error('Error fetching response from backend:', error);
    }
  };

  const theme = createTheme({
    palette: {
      primary: {main: '#004d40',},
      secondary: {main: '#004d40',},
    },
  });

const dist = 7;

const currentDate = new Date();
const dates = { month: 'long', day: 'numeric' };
const formattedDate = currentDate.toLocaleString(undefined, dates);

  // Define options
  const options = [
    { value: '', label: 'Some interesting stuff about your amble'},
    { value: `Tell me one thing good that happened on ${formattedDate}`, label: '1. Tell me something good that happened on this date' },
    { value: `Give me a short paragraph on ${name[1]} in Manhattan`, label: '2. Where is an interesting place I might visit as I amble' },
    { value: `Suggest some mindfulness classes around ${address[0]} `, label: '3. Suggest some mindfulness classes on my route' },
    { value: `On average how many calories will I burn on a ${dist} mile walk?`, label: '4. On average how many calories will I burn?' },
    { value: `What point of interest is found around longitude ${coord[0]['longitude']} and latitude ${coord[0]['latitude']}?`, label: '5. What else is interesting as I amble?' },
    { value: `Who was born on ${formattedDate}?`, label: '6. Who was born on this day?' }
  ];

  return (
    <div className="landing-page-container">
      <div>
      <div className="imageresources-container">
            </div>


        <select value={userInput} onChange={handleChange}>
            {options.map((option) => (
            <option key={option.value} value={option.value} >{option.label}</option>
            ))}
        </select>
      </div>

      <div className="btn-container">
        <button className='btn' onClick={handleSubmit}>Choose something</button>
      </div>

      <div className="response-container">
        {response && <div>{response}
          </div>}
      </div>
      
          <br></br>
          <br></br>
      
       
      <div className="attribution-text">
          Get a reflection from 'They Said So' : Chose something powered by ChatGPT
      </div>
        <br></br>
      <div className='endbar'></div>
    </div>    
   
  );
};

export default ChatGPT;