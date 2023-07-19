import React, { useState } from 'react';
import Select from 'react-select';
import axios from 'axios';

const options = [
    { value: 'park', label: 'Parks' },
    { value: 'libary', label: 'Libraries' },
    { value: 'worship', label: 'Places of Worship' },
    { value: 'community', label: 'Community Centres' },
    { value: 'museum', label: 'Museum & Art Galleries' },
    { value: 'walk', label: 'Other Walking Nodes' },
    { value: 'other_park', label: 'Other Park Nodes' },
  ];

  const UserPreferences = () => {
    const [selectedOptions, setSelectedOptions] = useState([]);
  
    const handleSelectChange = (selected) => {
      setSelectedOptions(selected);
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
  
      const selectedValues = selectedOptions.map((option) => option.value);
  
      // Make the POST request
      axios
        .post('/users', { selectedOptions: selectedValues })
        .then((response) => {
          // Handle successful response
          console.log(response.data);
        })
        .catch((error) => {
          // Handle error
          console.error(error);
        });
    };
  
    return (
      <div className="preference-area">
      <form onSubmit={handleSubmit}>
        <h3>Select Amble Preferences</h3>
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

  export default UserPreferences;