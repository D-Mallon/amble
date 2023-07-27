import React, { useRef, useEffect, useState,useContext } from 'react';
import {Link, useNavigate} from 'react-router-dom';

import { createTheme,ThemeProvider  } from '@mui/material/styles';
import MenuBar2 from './MenuBar2';
import './resources.css';
import MyButton from './mainbutton';
import MyFunctionButton from './functionbutton';
import MapBackground from './mapbackground';

import axios from 'axios';

const ChatGPT = () => {
    const [userInput, setUserInput] = useState('');
    const [response, setResponse] = useState('');
  
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

const lat = 40.7505;
const lon = -73.9934;
const node = 'Yeshiva University Museum';
const dist = 10;
const address = '415 East Houston Street, 10002 Manhattan';
const date = 'July 27';

  // Define options
  const options = [
    { value: '', label: 'Select a Resource:' },
    { value: `Tell me one thing good that happened on ${date}`, label: '1. Tell me something good that happened on this date' },
    { value: `Give me a short paragraph on ${node}`, label: '2. What is an interesting place I might visit as I amble' },
    { value: `Suggest some mindfulness classes around ${address} `, label: '3. Suggest some mindfulness classes on my route' },
    { value: `On average how many calories will I burn on a ${dist} mile walk?`, label: '4. On average how many calories will I burn?' },
    { value: `What point of interest is found around longitude ${lon} and latitude ${lat}?`, label: '5. Is there anything interesting to see on my amble ?' }
  ];

  return (
    <div className='landing-page-container'>
      
      <div className='menubar-area'>
      <MenuBar2 />
      </div>
        <div>
          <select value={userInput} onChange={handleChange}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
          
        <div>
          <button className='submit-button' onClick={handleSubmit}>Submit</button>
        </div>
          <br></br>
          <br></br>
        <div>
          {response && <div>{response}
          </div>}
        </div>
        <br></br>
        <br></br>
        <div className='endbar'></div>
          
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          Quotes from 'They Said So' : Resources powered by ChatGPT
        </div>
        
    </div>
  );
};

export default ChatGPT;