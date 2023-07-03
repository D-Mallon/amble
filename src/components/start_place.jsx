import React, { useState } from 'react';

const StartPlace = ({inputValues, setInputValues, displayRoute}) => {

    const handleInputChange = (index, value) => {
        setInputValues((prevInputValues) => {
            const updatedValues = [...prevInputValues];
            updatedValues[index] = value;
            return updatedValues;
        });
    };

    console.log('StartPlace inputValues:', inputValues);

    return (
        <div>
            Start Latitude:
            <input
                type="number"
                value={inputValues[0]}
                placeholder='Enter start latitude'
                onChange={(e) => handleInputChange(0, e.target.value)}
            />
            Start Longitude:
            <input
                type="number"
                value={inputValues[1]}
                placeholder='Enter start longitude'
                onChange={(e) => handleInputChange(1, e.target.value)}
            />
            End Latitude:
            <input
                type="number"
                value={inputValues[2]}
                placeholder='Enter end latitude'
                onChange={(e) => handleInputChange(2, e.target.value)}
            />
            End Longitude:
            <input
                type="number"
                value={inputValues[3]}
                placeholder='Enter end longitude'
                onChange={(e) => handleInputChange(3, e.target.value)}
            />
        </div>
    );
}

export default StartPlace;