import React, { useState } from 'react';

import styled from 'styled-components';


import Hex from './hex';



const Letters = styled.div`
  height: 50px;
  display: flex;
`

const Letter = styled.div`
  width: 50px;
  height: 50px;
`


export default function AvailableLetters({available, remaining, selectedIndex, onSelect}) {
  const handleStart = letter => event => {
    event.dataTransfer.setData('letter', letter);
    event.dataTransfer.dropEffect = "move";
  }



  return <Letters>
    { available.map((letter, index) => (
      <Letter key={index} draggable="true" onClick={() => onSelect(index)} onDragStart={handleStart(letter)}>
        <svg width="50" height="50" viewBox="0 0 80 80">
          <Hex
            active={selectedIndex == index}
            transform="translate(40 40)"
            letter={letter}
            disabled={!remaining.includes(letter)}
          />
        </svg>
      </Letter>
    ))}
  </Letters>;
}
