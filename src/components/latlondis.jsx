import React, { useState } from 'react';
import axios from 'axios';

const RouteInputs = () => {
  const [formData, setFormData] = useState({
    latitude: '',
    longitude: '',
    distance: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post('/users', formData, {
        // Need this header as axios sends dorm data as application/json which is not compatible with django request.POST
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
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="latitude">Latitude:</label>
        <input
          type="text"
          name="latitude"
        //   value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="longitude">Longitude:</label>
        <input
          type="text"
          name="longitude"
        //   value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="distance">Distance:</label>
        <input
        type="text"
          name="distance"
        //   value={formData.name}
          onChange={handleChange}
        ></input>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default RouteInputs;