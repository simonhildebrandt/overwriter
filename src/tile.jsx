import React from 'react';

import styled from 'styled-components';

import { keyFor } from './utils';



const Text = styled.text`
font-family: Roboto;
font-size: 40px;
text-anchor: middle;
dominant-baseline: middle;
cursor: pointer;
pointer-events: none;
`

export default function Tile({tile, letters, selected, onPointerDown, onPointerMove, onPointerUp, onClick}) {
  const { row, col } = tile;

  const active = selected && selected.row == row && selected.col == col;
  const tileX = col * 70 - 35 * row + 230;
  const tileY = 60 * row + 100;

  const { letter, color } = letters[keyFor(tile)] || {};

  return <g transform={`translate(${tileX} ${tileY})`}>
    <path
      stroke={letter ? "black" : 'gray'}
      fill={color ? color : "white"}
      strokeWidth={active ? 4 : 2}
      d="M0 -30L30 -15V20L0 35L-30 20V-15Z"
      onClick={() => onClick(row, col)}
    />
    <Text y="6">{letter?.toUpperCase()}</Text>
  </g>
}
