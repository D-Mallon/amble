import React, { useState } from 'react';
import axios from 'axios';
import "./latlondis.css";

const RouteInputs = () => {
  const [formData, setFormData] = useState({
    latitude: '',
    longitude: '',
    distance: '',
    hour: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post('/users', formData, {
        // Need this header as axios sends Form data as application/json which is not compatible with django request.POST
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => {
        console.log(response.data);
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
    <div className="latlondis-area">
      <h3>Route Planner Inputs</h3>
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="latitude">Starting Latitude:</label>
        <input
          type="text"
          name="latitude"
        //   value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="longitude">Starting Longitude:</label>
        <input
          type="text"
          name="longitude"
        //   value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="distance">Distance to walk:</label>
        <input
        type="text"
          name="distance"
        //   value={formData.name}
          onChange={handleChange}
        ></input>
      </div>
      <div>
        <label htmlFor="distance">Hour (to start walk):</label>
        <input
        type="text"
          name="hour"
        //   value={formData.name}
          onChange={handleChange}
        ></input>
      </div>

      <button type="submit" className='submit-button'>Submit</button>
    </form>
    </div>
  );
};

export default RouteInputs;