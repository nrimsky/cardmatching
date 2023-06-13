import React from "react";

const shapes = {
  circle: <circle cx="50" cy="50" r="40" />,
  square: <rect width="80" height="80" />,
  triangle: <polygon points="50,5 5,95 95,95" />,
  star: <polygon points="50,5 20,95 95,35 5,35 80,95" />,
};

function Card({ number, shape, color, isSelectable, onClick }) {
  const ShapeSVG = shapes[shape];
  if (!ShapeSVG) {
    return null;
  }

  const items = [];
  for (let i = 0; i < number; i++) {
    items.push(
      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        {React.cloneElement(ShapeSVG, { fill: color })}
      </svg>
    );
  }

  return (
    <div
      className={isSelectable ? "card selectable-card" : "card"}
      onClick={onClick}
    >
      {items}
    </div>
  );
}

export default Card;
