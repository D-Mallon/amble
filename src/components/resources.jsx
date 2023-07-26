import React, { useRef, useEffect, useState,useContext } from 'react';
import {Link, useNavigate} from 'react-router-dom';

import { createTheme,ThemeProvider  } from '@mui/material/styles';
import MenuBar2 from './MenuBar2';
import './HomePage2.css';
import MyButton from './mainbutton';
import MyFunctionButton from './functionbutton';
import MapBackground from './mapbackground';

// import './quotes.css';
import axios from 'axios';

function Resources() {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    GetNewQuote();
    }, []);

  let GetNewQuote = () => {
        axios.get('users/getquote')
        .then((response) => {
        const quotationsData = response.data;
        const quoteAuthors = Object.keys(quotationsData);
        // console.log(quoteAuthors)
        const randomIndex = Math.floor(Math.random() * quoteAuthors.length);
        const randomAuthor = quoteAuthors[randomIndex];
        const randomQuote = quotationsData[randomAuthor];
        setQuote(randomQuote);
        setAuthor(randomAuthor);
        })
        .catch((error) => {
        console.error('Error fetching data:', error);
    });
};

const theme = createTheme({
    palette: {
      primary: {
        main: '#004d40',
      },
      secondary: {
        main: '#004d40',
      },
    },
  });
  
    return (
      <div className='landing-page-container'>
      
      <div className='menubar-area'>
      <MenuBar2 />
      </div>
      
      <div className='resources-pics-container'>
      
        <div className ="quotebox">
        <div className="quote">
          <h2>{quote}</h2>
          <small>- {author}</small>
        </div>
        <div className="btn-container">
        <button className="btn" onClick={GetNewQuote}>Get a new thought</button>
        </div>
      </div>

          {/* <div  className='home-button-container'>
          <MyButton/>
          </div> */}
      </div>
   
        <div className='endbar'></div>
        </div>
    );
  }
  export default Resources;