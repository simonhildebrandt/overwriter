import React, { useState } from 'react';


export default function useSVGDragScrollable(width, height) {
  const [viewX, setViewX] = useState(width * -0.5);
  const [viewY, setViewY] = useState(height * -0.5);

  const [drag, setDrag] = useState(null);

  const onPointerDown = event => {
    const { clientX, clientY } = event;
    setDrag({ clientX, clientY })
  };
  const onPointerUp = event => setDrag(null);
  const onPointerMove = event => {
    const { clientX, clientY } = event;
    if (!drag) return;

    event.preventDefault();
    event.stopPropagation();

    setViewX(x => x - (clientX - drag.clientX));
    setViewY(y => y - (clientY - drag.clientY));
    setDrag({ clientX, clientY });
  };

  return {
    viewX,
    viewY,
    pointerHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp
    }
  }
}
