import React from 'react';

import { keyFor } from './utils';

import Hex from './hex';


colors = [
"#196774",
"#90A19D",
"#F0941F",
"#EF6024",
"#363432",
]


export default function Tile({tile, letters, selected, onClick, onLetterDrop}) {
  const { row, col } = tile;

  const active = selected && selected.row == row && selected.col == col;
  const tileX = col * 70 - 35 * row + 230;
  const tileY = 60 * row + 100;

  const { letter, team } = letters[keyFor(tile)] || {};
  const color = colors[team] || 'white';

  const handleLetterDrop = letter => onLetterDrop(tile, letter);

  return <Hex
    transform={`translate(${tileX} ${tileY})`}
    color={color}
    active={active}
    letter={letter}
    onClick={() => onClick(row, col)}
    onLetterDrop={handleLetterDrop}
  />
}

