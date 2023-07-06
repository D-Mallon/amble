import React from 'react';

const DatasetToggle = ({ datasets, onToggle }) => {
  const handleToggle = (event) => {
    const datasetName = event.target.name;
    const isChecked = event.target.checked;
    onToggle(datasetName, isChecked);
  };

  return (
    <div className="dataset-toggle">
      {datasets.map(dataset => (
        <label key={dataset.name}>
          <input
            type="checkbox"
            name={dataset.name}
            checked={dataset.visible}
            onChange={handleToggle}
          />
          {dataset.label}
        </label>
      ))}
    </div>
  );
};

export default DatasetToggle;
