import React from 'react';

import styled from 'styled-components';


const Text = styled.text`
font-family: Roboto;
font-size: 40px;
text-anchor: middle;
dominant-baseline: middle;
cursor: pointer;
pointer-events: none;
`


const noop = () => {};


export default function Hex({
   transform,
   letter,
   color = 'white',
   active = false,
   onClick = noop,
   disabled = false,
   onLetterDrop = noop,
  }) {

  const handleOver = event => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }

  const handleDrop = event => onLetterDrop(event.dataTransfer.getData('letter'));

  return <g
    transform={transform}
    opacity={disabled ? 0.5 : 1}
    onDragOver={handleOver}
    onDrop={handleDrop}
  >
    <path
      stroke={letter ? "black" : 'gray'}
      fill={color}
      strokeWidth={active ? 4 : 2}
      d="M0 -30L30 -15V20L0 35L-30 20V-15Z"
      onClick={onClick}
    />
    <Text y="6">{letter?.toUpperCase()}</Text>
  </g>
}
