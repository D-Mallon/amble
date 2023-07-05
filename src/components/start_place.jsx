import React from 'react';
import axios from 'axios';
import "./Comms.css";

const StartPlace = ({ inputValues, setInputValues }) => {

  const handleInputChange = (e) => {
    setInputValues({ ...inputValues, [e.target.name]: e.target.value });
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();

    console.log("handleInputSubmit", inputValues);

    axios.post('/users', inputValues, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => {
        console.log("errorless:", response.data);
        setInputValues({ ...inputValues, endLatitude: response.data["dest"][1], endLongitude: response.data["dest"][0]});
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log("server responded with error");
        } else if (error.request) {
          console.log("network error");
        } else {
          console.log(error);
        }
      });
  };

  return (
    <div className="comms">
      <form onSubmit={handleInputSubmit}>
        <label htmlFor="latitude">Latitude:</label>
        <input
          type="text"
          name="startLatitude"
          value={inputValues.startLatitude}
          onChange={handleInputChange}
        />
        <label htmlFor="longitude">Longitude:</label>
        <input
          type="text"
          name="startLongitude"
          value={inputValues.startLongitude}
          onChange={handleInputChange}
        />
        <button type="submit">Submit</button>
      </form>
    </div >
  );
}

export default StartPlace;