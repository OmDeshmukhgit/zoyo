// In CustomSelect.tsx
import React, { useState, useRef, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  ariaLabel?: string;
}

const CustomSelect: React.FC<Props> = ({
  value,
  onChange,
  options,
  placeholder = "Select...",
  ariaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        selectRef.current &&
        !selectRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  console.log("CustomSelect options prop:", options);
  const selectedOption = options.find(opt => opt.value === value) || {
    value: "",
    label: placeholder,
  };

  return (
    <div 
      className="relative w-full" 
      ref={selectRef}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={ariaLabel}
        className="w-full px-4 py-3 border-2 border-zomato-red/30 rounded-xl shadow-md 
                 focus:outline-none focus:ring-4 focus:ring-zomato-red/50 focus:border-zomato-red 
                 text-zomato-textDark font-bold bg-zomato-cream hover:border-zomato-red hover:shadow-lg 
                 transition-all transform hover:scale-[1.02] cursor-pointer flex items-center justify-between text-left"
      >
        <span className={value ? "text-zomato-textDark" : "text-zomato-gray"}>
          {selectedOption.label}
        </span>
        <svg
          className={`w-5 h-5 text-zomato-red transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute left-0 top-full mt-2 w-full bg-zomato-cream border-2 border-zomato-red/30 rounded-xl shadow-2xl overflow-hidden z-50 animate-fadeIn"
        >
          <div className="max-h-60 overflow-y-auto" role="menu">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                role="menuitem"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left font-semibold transition-all duration-150 ${
                  value === option.value
                    ? "bg-gradient-to-r from-zomato-red to-zomato-lightRed text-zomato-cream shadow-md"
                    : "text-zomato-textDark hover:bg-gradient-to-r hover:from-zomato-red/10 hover:to-zomato-orange/10 hover:text-zomato-red"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;