import React, { useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import "./user_pref.css";

const options = [
    { value: 'park', label: 'Parks' },
    { value: 'libary', label: 'Libraries' },
    { value: 'worship', label: 'Places of Worship' },
    { value: 'community', label: 'Community Centres' },
    { value: 'museum', label: 'Museums & Art Galleries' },
    { value: 'walk', label: 'Other Walking Nodes' },
    { value: 'other_park', label: 'Other Park Nodes' },
  ];

  const UserPreference = () => {
    const [selectedOptions, setSelectedOptions] = useState([]);
  
    const handleSelectChange = (selected) => {
      setSelectedOptions(selected);
    };
  
    const selectedValues = selectedOptions.map((option) => option.value);

    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log(selectedValues);
      
      // Make the POST request
      axios
        .post('/users/preferences', { selectedOptions: selectedValues, headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }})
       
        .then((response) => {
          // Handle successful response
          console.log(response.data);
          console.log("Where is the data?");
        })
        // If error, alert console
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
      <div className="preferences-area">
        <h3>Select Amble Preferences</h3>
      <form onSubmit={handleSubmit}>
        <Select
            options={options}
            isMulti
            value={selectedOptions}
            onChange={handleSelectChange}
        />
        <button type="submit" className='submit-button'>Submit</button>
      </form>
      </div>
    );
  };

  export default UserPreference;