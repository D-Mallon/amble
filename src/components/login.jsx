import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    password: '',
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    axios
    .post('/users', formData)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      if (error.response) {
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
    <form onSubmit={handleSubmit}>
        <div>
            <label htmlFor="first_name">First Name:</label>
            <input
                type="text"
                name="first_name"
                id="first_name"
                value={formData.first_name}
                onChange={handleChange}
            />
        </div>
        <div>
            <label htmlFor="last_name">Last Name:</label>
            <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
            />
        </div>
        <div>
            <label htmlFor="email">Email:</label>
            <input
                type="text"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
            />
        </div>
        <div>
            <label htmlFor="address">Address:</label>
            <input
                type="text"
                name="address"
                id="address"
                value={formData.address}
                onChange={handleChange}
            />
        </div>
        <div>
            <label htmlFor="password">Password:</label>
            <input
                type="text"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
            />
        </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default Login;