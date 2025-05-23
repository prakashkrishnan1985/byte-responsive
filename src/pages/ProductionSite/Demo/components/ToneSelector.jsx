import React from 'react';

const ToneSelector = ({
  tones,
  selectedTone,
  onToneSelect
}) => {
  return (
    <div className="tone-selection">
      {tones.map(tone => (
        <button
          key={tone}
          className={selectedTone === tone ? 'selected-tone' : ''}
          onClick={() => onToneSelect(tone)}
        >
          {tone}
        </button>
      ))}
    </div>
  );
};

export default ToneSelector;