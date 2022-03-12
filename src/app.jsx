import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';

import { download, has, traverse } from 'dictionarily';

import Tile from './tile';
import { keyFor, buildField, adjacent, coil, add } from './utils';


const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`

const Wrapper = styled.div`
  overflow: auto;
  justify-content: center;
  flex-grow: 1;
  flex-shrink: 1;
`

const Palette = styled.div`
  background-color: gray;
  position: absolute;
  cursor: pointer;
  font-size: 24px;
  width: 64px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 8px;
`

const Panel = styled.div`
  flex-grow: 1;
`

const center = { row: 5, col: 5};

function Field({scale, onClick, letters, selected, tiles}) {
  return <svg
    width={800 * scale}
    height={800 * scale}
    viewBox={`0 0 800 800`}
  >
    { tiles.map((tile, key) =>
      <Tile
        key={key}
        tile={tile}
        letters={letters}
        selected={selected}
        onClick={onClick}
      />
    )}
  </svg>
}

function Controls({onZoom}) {
  return <Palette>
    <div onClick={() => onZoom(0.9)}>-</div>
    <div onClick={() => onZoom(1.1)}>+</div>
  </Palette>
}

function Game({dict, existingLetters, tiles}) {
  const [scale, setScale] = useState(0.5);
  const [available, setAvailable] = useState("aabcdef".split(""))

  function onZoom(zoom) {
    setScale(s => s * zoom);
  }

  function onClick(row, col) {
    setSelected({row, col});

    const existingLetter = existingLetters[keyFor({row, col})];
    if (existingLetter) {
      setNewWord([...newWord, {
        row,
        col,
        letter: existingLetter.letter,
        color: 'blue'
      }]);
    }
  }

  const [newWord, setNewWord] = useState([]);
  const [selected, setSelected] = useState(null);

  const letters = newWord.reduce((acc, letter) => {
    acc[keyFor(letter)] = letter;
    return acc;
  }, {});

  const allLetters = {...existingLetters, ...letters};

  const remaining = [...available];
  newWord.forEach(item => {
    const { letter } = item;
    const index = remaining.indexOf(letter);
    if (index !== -1) remaining.splice(index, 1);
  });

  useEffect(() => {
    function handleKeyPress(event) {
      const { key } = event;
      if (key >= 'a' && key <= 'z') {
        if (selected) {
          if (letters[keyFor(selected)]) {
            // error - letter already placed
            return;
          }

          if (!remaining.includes(key)) {
            // error - not available letter
            return;
          }

          if (newWord.length > 0) {
            const previous = newWord[newWord.length - 1];
            if (!adjacent(selected, previous)) {
              // Error not adjacent
              return;
            }
          }

          const { row, col } = selected;
          setNewWord([...newWord, {
            row,
            col,
            letter: event.key,
            color: 'blue'
          }]);
        }
      }
    }
    document.addEventListener("keypress", handleKeyPress);
    return () => document.removeEventListener("keypress", handleKeyPress);
  }, [selected, letters]);


  const backspace = () => setNewWord(newWord.slice(0, newWord.length - 1));
  const clear = () => setNewWord([]);


  const actualNewWord = newWord.map(l => l.letter).join('');

  const isValid = newWord.length > 3 ? (
    has(dict, actualNewWord)
  ) : false;

  return <Container>
    <Controls onZoom={onZoom}/>
    <Wrapper>
      <Field
        scale={scale}
        selected={selected}
        onClick={onClick}
        letters={allLetters}
        tiles={tiles}
      />
    </Wrapper>
    <Panel>
      <div>{ available.join(', ') }</div>
      <div>{ remaining.join(', ') }</div>
      <div>{ newWord.map(letter => letter.letter).join(', ') } {isValid ? '✅' : '❌'}</div>
      <div>
        <button onClick={backspace} disabled={newWord.length < 1}>backspace</button>
        <button onClick={clear}>clear</button>
      </div>
    </Panel>
  </Container>
}



export default function App() {
  const [dict, setDict] = useState(null);
  const [existingLetters, setExistingLetters] = useState(null);
  const tiles = useMemo(buildField);

  useEffect(() => {
    download().then(dict => {
      setDict(dict);

      const words = [];
      traverse(dict, node => {
        if (node.prefix.length == 7) words.push(node.prefix);
      }, {wordsOnly: true});

      const seedWord = words[Math.floor(Math.random() * words.length)]

      const newLetters = coil.reduce((acc, offset, index) => {
        const pos = add(center, offset);
        acc[keyFor(pos)] = {
          ...pos,
          letter: seedWord[index],
          color: 'yellow',
        }
        return acc;
      }, {});

      setExistingLetters(newLetters);
    });
  }, []);

  if (!dict) return 'loading';

  return <Game dict={dict} existingLetters={existingLetters} tiles={tiles} />;
}