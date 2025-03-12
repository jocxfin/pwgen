import React from 'react';

const Slider = ({ label, value, onChange, min, max, id }) => {
  
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="my-4 animate-fade-in animate-stagger-3">
      <div className="flex justify-between mb-3">
        <label htmlFor={id} className="text-sm md:text-base font-medium text-white/90">{label}</label>
        <span className="px-3 py-1 bg-primary-dark rounded-lg text-accent font-medium text-sm">
          {value}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          id={id}
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 appearance-none cursor-pointer bg-transparent z-10 relative"
          style={{
            WebkitAppearance: 'none',
            MozAppearance: 'none'
          }}
        />
        
        {/* Track background */}
        <div className="absolute inset-0 h-2 bg-primary-dark rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        
        {/* Custom thumb styling via CSS */}
        <style jsx>{`
        input[type=range] {
        margin-top: 0;
        margin-bottom: 0;
        height: 18px;
        padding: 0;
        }
        
        input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 18px;
        height: 18px;
        border-radius: 50%;
          background: white;
          cursor: pointer;
          border: 2px solid #8b5cf6;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
        position: relative;
        z-index: 10;
        transition: all 0.2s ease;
        margin-top: -13px; 
        }
        
        input[type=range]::-moz-range-thumb {
        width: 18px;
        height: 18px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
        border: 2px solid #8b5cf6;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
          position: relative;
          z-index: 10;
          transition: all 0.2s ease;
        }
        
        input[type=range]::-webkit-slider-runnable-track {
            height: 2px;
            background: transparent;
          }
          
          input[type=range]::-moz-range-track {
            height: 2px;
            background: transparent;
          }
          
          input[type=range]:focus::-webkit-slider-thumb {
            box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.3);
            transform: scale(1.1);
          }
          
          input[type=range]:focus::-moz-range-thumb {
            box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.3);
            transform: scale(1.1);
          }
        `}</style>
        
        {/* Min/max labels */}
        <div className="flex justify-between mt-1 text-xs text-white/50">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  );
};

export default Slider;
