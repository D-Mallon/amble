import React, { useState, useRef,useEffect } from 'react';
import './MenuBar.css';

import WidgetsRoundedIcon from '@mui/icons-material/WidgetsRounded';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from '@mui/icons-material/Close';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StyleRoundedIcon from '@mui/icons-material/StyleRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

export default function MenuBar() {
  const [isOptionsVisible, setOptionsVisible] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const optionsRef = useRef(null);
  const profileButtonRef = useRef(null);

  const hideElements = () => {
    document.querySelector('.additional-block-close-menubar').classList.add('hide');
    document.querySelector('.overlay').classList.add('hide');
    document.querySelector('.menu-bar').classList.add('hide');
  };
  
  const exitMenu = () => {
    // 其他逻辑
    hideElements();
  };


  const toggleOptions = () => {
    setOptionsVisible(!isOptionsVisible);
  };

 const toggleMenu = () => {
  if (!isMenuVisible) {
    setMenuVisible(true);
  } else {
    exitMenu();
    setTimeout(() => {
      setMenuVisible(false);
    }, 1000);
  }
};
  const handleClickOutside = (event) => {
    if (
      optionsRef.current &&
      !optionsRef.current.contains(event.target) &&
      !profileButtonRef.current.contains(event.target)
    ) {
      setOptionsVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <div className="menubar-container">
      <div className="menu-button-wrapper">
        <WidgetsRoundedIcon
          className="menu-button"
          sx={{ fontSize: 28, color: 'white' }}
          onClick={toggleMenu}
        />
      </div>
      <div className="profile-button-wrapper">
        <PersonRoundedIcon
          className={`profile-button ${isOptionsVisible ? 'active' : ''}`}
          sx={{ fontSize: 31, color: 'white' }}
          onClick={toggleOptions}
          ref={profileButtonRef}
        />
        {isOptionsVisible && (
          <div className="options-box" ref={optionsRef}>
            <button className="option"> <span className="option-text">Sign Up</span></button>
            <button className="option"><span className="option-text">Log In</span></button>
          </div>
        )}
      </div>
      <div className="history-button-wrapper"><StyleRoundedIcon  className='history-button'
          sx={{ fontSize: 30, color: 'white' }}/></div>
      {/* <div className="favorite-button-wrapper"><StarRoundedIcon  className='history-button'
          sx={{ fontSize: 50, color: 'black' }}/></div> */}
      {isMenuVisible && (
        <>
        <div className={`menu-bar ${isMenuVisible ? 'show' : ''}`}>
          <button className="option-bottom-menu">Home Page</button>
          <button className="option-bottom-menu">Plan Page</button>
          <button className="option-bottom-menu">Green Inform Page</button>
          <button className="option-bottom-menu">About</button>
        </div>
      
         <div
         className="overlay"
         
       ></div>
         <div className="additional-block-close-menubar">
                <CloseIcon sx={{ fontSize: 27 , color: 'white'}} onClick={toggleMenu}/>
              </div>
       </>
      )}
    </div>
  );
}
