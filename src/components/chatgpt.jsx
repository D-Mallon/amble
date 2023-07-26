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
      const response = await axios.post('users/chatbot_view/', {
        input: userInput,
      });
      setResponse(response.data.message);
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

  return (
    <div className='landing-page-container'>
      <div className='menubar-area'>
      <MenuBar2 />
      </div>
        <div className='resources-pics-container'>
          <div>
          <select value={selectedStatement} onChange={handleChange}>
            <option value="">Select a Resource</option>
            <option value="Fact">1. Tell me one fact that will cheer up my day</option>
            <option value="Museum">2. Give me a short paragraph on the Yeshiva University Museum</option>
            <option value="Mindfulness">3. Suggest some mindfulness classes around 415 East Houston Street, 10002 Manhattan</option>
            <option value="Calories">4. On average how many calorifies will I burn on a 5 mile walk</option>
            <option value="Location">5. Is there anything interesting at longitude -73.9934 and latitude 40.7505</option>
          </select>
          <button className='submit-button' onClick={handleSubmit}>Submit</button>
          {response && <div>{response}
          </div>}
        </div>
      </div>
        <div className='endbar'></div>
    </div>
  );
};

export default ChatGPT;