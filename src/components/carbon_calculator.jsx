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

const Carbon = () => {
    const [value, setValue] = useState(0);

    const dist = 5;
    const co2_per_mile = 0.77;
    const total_co2 = (dist * co2_per_mile).toFixed(2);
    const co2_per_tree_per_year = 22;
    const tree_per_mile = 1/(co2_per_tree_per_year / co2_per_mile);
    const percentage_of_tree = tree_per_mile * dist * 3; 
    const num_trees = 4 * dist;
    console.log (percentage_of_tree);

return (
    <div className="landing-page-container">

        <div className="menubar-area">
          <MenuBar2 />
        </div>
        
        <div>
            <h3>See how many new trees your walking is equivalent to!</h3>
            <button onClick={() => alert('If you did this walk 3 times a week for a year that is a Carbon Savings equivalent to planting '+ num_trees + ' trees')}>Number of Trees</button>
        </div>

        <div className='endbar'></div>
    </div>
    ); 

};
export default Carbon;