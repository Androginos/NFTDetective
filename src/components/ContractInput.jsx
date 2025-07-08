import React, { useState } from 'react';
import './ContractInput.css';

const ContractInput = () => {
  const [contractData, setContractData] = useState('');

  const handleInputChange = (e) => {
    // Sadece alfanumeric karakterlere izin ver
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
    setContractData(value);
  };

  const handleInvestigate = () => {
    if (contractData.trim()) {
      console.log('Investigating contract:', contractData);
      // Burada kontrat verisi ile investigation logic'i eklenecek
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleInvestigate();
    }
  };

  return (
    <div className="contract-input-container">
      <div className="contract-input-wrapper">
        <input
          type="text"
          className="contract-input"
          value={contractData}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Contract information to be analyzed."
          maxLength={50}
        />
        <button
          className="investigate-button"
          onClick={handleInvestigate}
          disabled={!contractData.trim()}
        >
          Analysis
        </button>
      </div>
    </div>
  );
};

export default ContractInput; 