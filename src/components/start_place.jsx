import React from 'react';
import axios from 'axios';
import "./Comms.css";

const StartPlace = ({ inputValues, setInputValues }) => {

    const handleInputChange = (index, value) => {
        setInputValues((prevInputValues) => {
            const updatedValues = [...prevInputValues];
            updatedValues[index] = value;
            return updatedValues;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        axios
          .post('/users', inputValues, {
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
            <form onSubmit={handleSubmit}>
            <label htmlFor="latitude">Latitude:</label>
            <input
                type="number"
                value={inputValues[0]}
                placeholder='Enter start latitude'
                onChange={(e) => handleInputChange(0, e.target.value)}
            />
            <label htmlFor="longitude">Longitude:</label>
            <input
                type="number"
                value={inputValues[1]}
                placeholder='Enter start longitude'
                onChange={(e) => handleInputChange(1, e.target.value)}
            />
            <button type="submit">Submit</button>
        </form>
        </div >
    );
}

export default StartPlace;