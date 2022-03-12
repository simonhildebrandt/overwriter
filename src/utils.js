export const keyFor = ({row, col}) => `${row}-${col}`;

export function buildField() {
  const tiles = [];

  for (var row = 0; row < 11; row++) {
    const maxCols = row < 6 ? 6 + row : 16 - row;

    for (var i = 0; i < maxCols; i++) {
      var col = row < 5 ? i : i + row - 5;

      tiles.push({row, col});
    }
  }

  return tiles;
}


export function adjacent(current, previous) {
  const {row, col} = current;
  const {row: prevRow, col: prevCol} = previous;

  /*
     11 01
    09 P 03
     07 05
  */

  if (prevRow == row - 1 && prevCol == col) return 1;
  if (prevRow == row && prevCol == col + 1) return 3;
  if (prevRow == row + 1 && prevCol == col + 1) return 5;
  if (prevRow == row + 1 && prevCol == col) return 7;
  if (prevRow == row && prevCol == col - 1) return 9;
  if (prevRow == row - 1 && prevCol == col - 1) return 11;
}

export const add = (a, b) => ({ row: a.row + b.row, col: a.col + b.col });

export const coil = [
  { row: 0, col: 0 },
  { row: -1, col: 0 },
  { row: 0, col: 1 },
  { row: 1, col: 1 },
  { row: 1, col: 0 },
  { row: 0, col: -1 },
  { row: -1, col: -1 },
];
