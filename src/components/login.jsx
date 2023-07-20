import React, { useState } from 'react';
import axios from 'axios';
import "./login.css";

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
        const errorMessage = "Email address may already exist! Please try entering a different email.";
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
    <div className="login-area">
      <h3>Registration Form</h3>
    <form onSubmit={handleSubmit}>
            <div>
            <label htmlFor="first_name">First Name:</label>
            <input
                type="text"
                name="first_name"
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
                // value={formData.last_name}
                onChange={handleChange}
                ></input>
            </div>
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    type="text"
                    name="email"
                    id="email"
                    // value={formData.email}
                    onChange={handleChange}
                    ></input>
            </div>
            <div>
                <label htmlFor="address">Address:</label>
                <input
                    type="text"
                    name="address"
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
                    id="password"
                    // value={formData.password}
                    onChange={handleChange}
                    ></input>
            </div>
            <div id="error-message"></div>
      <button type="submit" className='submit-button'>Submit</button>
          
    </form>
    </div>
  );
};

export default Login;