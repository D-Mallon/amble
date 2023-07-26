import React, { useState } from 'react';
import axios from 'axios';
import "./login.css";

import {Link, useNavigate} from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    password: '',
  });

  const errorMessageElement = document.getElementById("error-message");

  const handleChange = (e) => {
    setFormData({
      ...formData, [e.target.name]: e.target.value,});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    axios
    .post('/users/registration', formData, {
      // Need this header as axios sends Form data as application/json which is not compatible with django request.POST
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      if (error.response.status === 400) {
        console.log("It may be that Username already exists.");
        const errorMessage = "Username already exist! Please try entering a different email.";
        errorMessageElement.textContent = errorMessage;
      } else if (error.response) {
        console.log(error.response);
        console.log("server responded");
      } else if (error.request) {
        console.log("network error");
      } else {
        console.log(error);
      }
    });
  };

  return (
    <div>
      <div className="login-area">

      <div>
        <h1 className="signup-text1">Sign up for a free account</h1>
        <p className="signup-text2">
          Already have an account yet?{" "}
          <Link to="/loginCheck" className="signup-text3">
            Sign in.
          </Link>
        </p> 
        </div>
    <form onSubmit={handleSubmit}>
            <div>
            <label htmlFor="first_name">First Name:</label>
            <input
                type="text"
                name="first_name"
                className='first_name'
                id="first_name"
                // value={formData.first_name}
                onChange={handleChange}
                ></input>
            </div>
            <div>
            <label htmlFor="last_name">Last Name:</label>
            <input
                type="text"
                name="last_name"
                className='last_name'
                // value={formData.last_name}
                onChange={handleChange}
                ></input>
            </div>
            <div>
                <label htmlFor="username">Email (will be your username):</label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    // value={formData.email}
                    onChange={handleChange}
                    ></input>
            </div>
            <div>
                <label htmlFor="address">Address:</label>
                <input
                    type="text"
                    name="address"
                    className='address'
                    id="address"
                    // value={formData.address}
                    onChange={handleChange}
                    ></input>
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input
                    type="text"
                    name="password"
                    className='password'
                    id="password"
                    // value={formData.password}
                    onChange={handleChange}
                    ></input>
            </div>
            <div id="error-message"></div>
            <div className="wrapper-function-login">
    <a className="wrapper-function-text-login" href="#" type="submit" onClick={handleSubmit}><span>Sign Up</span></a>
    </div>
          
    </form>
    </div>
    </div>
  );
};

export default Login;