import React from "react";

const ToggleSwitch = ({ checked, onChange, size = 60 }) => {
  const height = size / 2;
  const circleSize = height - 4;

  return (
    <div
      onClick={onChange}
      className={`cursor-pointer transition-all duration-300`}
      style={{
        width: `${size}px`,
        height: `${height}px`,
        backgroundColor: checked ? "#97a97c" : "#e5e7eb", // violet / gris
        borderRadius: `${height}px`,
        display: "flex",
        alignItems: "center",
        padding: "2px",
        justifyContent: checked ? "flex-end" : "flex-start",
        position: "relative",
      }}
    >
      <div
        style={{
          width: `${circleSize}px`,
          height: `${circleSize}px`,
          backgroundColor: "white",
          borderRadius: "9999px",
        }}
      />
    </div>
  );
};

export default ToggleSwitch;
