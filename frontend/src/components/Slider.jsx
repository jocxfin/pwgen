import React from 'react';

const Slider = ({ label, value, onChange, min, max, id }) => {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <label htmlFor={id} className="text-sm md:text-base">{label}: {value}</label>
      </div>
      <input
        type="range"
        id={id}
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-accent1 rounded-lg appearance-none cursor-pointer accent-accent2"
      />
    </div>
  );
};

export default Slider;
