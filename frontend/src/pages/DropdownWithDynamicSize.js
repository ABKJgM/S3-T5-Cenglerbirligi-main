import React, { useState } from "react";

const ExpandableDropdown = ({ value, onChange, options, placeholder, disabled }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = () => {
    if (!disabled) setIsExpanded(true);
  };

  const handleCollapse = () => setIsExpanded(false);

  const handleSelect = (e) => {
    onChange(e);
    setIsExpanded(false);
  };

  return (
    <select
      value={value}
      onChange={handleSelect}
      onClick={handleExpand}
      onBlur={handleCollapse}
      size={isExpanded ? Math.min(options.length + 1, 10) : 1}
      disabled={disabled}
      className="dropdown"
    >
      <option value="">{placeholder}</option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default ExpandableDropdown;
