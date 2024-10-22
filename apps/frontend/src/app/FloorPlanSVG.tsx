import React, { useEffect } from 'react';
import interact from 'interactjs';

interface Room {
  type: string;
  area: number;
}

interface Dimensions {
  width: number;
  length: number;
}

interface Recess {
  frontalRecess: number;
  lateralRecess: number;
  backRecess: number;
}

interface FloorPlanSVGProps {
  layout: Room[];
  dimensions: Dimensions;
  availableWidth: number;
  availableLength: number;
  recesses: Recess;
}

const FloorPlanSVG: React.FC<FloorPlanSVGProps> = ({ layout, dimensions, availableWidth, availableLength, recesses }) => {
  const scale = 10;

  useEffect(() => {
    interact('.draggable')
      .draggable({
        listeners: {
          move(event) {
            const target = event.target;
            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            target.style.transform = `translate(${x}px, ${y}px)`;
            target.setAttribute('data-x', x.toString());
            target.setAttribute('data-y', y.toString());
          },
        },
      })
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
          move(event) {
            const target = event.target;
            let x = (parseFloat(target.getAttribute('data-x')) || 0);
            let y = (parseFloat(target.getAttribute('data-y')) || 0);

            target.style.width = `${event.rect.width}px`;
            target.style.height = `${event.rect.height}px`;

            x += event.deltaRect.left;
            y += event.deltaRect.top;

            target.style.transform = `translate(${x}px, ${y}px)`;

            target.setAttribute('data-x', x.toString());
            target.setAttribute('data-y', y.toString());
          },
        },
        modifiers: [
          interact.modifiers.restrictSize({
            min: { width: 50, height: 50 },
          }),
        ],
      });
  }, []);

  // Verificação adicional para garantir que recesses não sejam indefinidos
  const lateralRecess = recesses?.lateralRecess || 0;
  const frontalRecess = recesses?.frontalRecess || 0;
  const backRecess = recesses?.backRecess || 0;

  let currentX = lateralRecess * scale;
  let currentY = frontalRecess * scale;

  return (
    <svg
      width={dimensions.width * scale}
      height={dimensions.length * scale}
      style={{ border: '1px solid black', marginTop: '20px' }}
    >
      {/* Desenhar a área útil disponível após os recuos */}
      <rect
        x={lateralRecess * scale}
        y={frontalRecess * scale}
        width={availableWidth * scale}
        height={availableLength * scale}
        fill="none"
        stroke="red"
        strokeDasharray="5,5"
      />

      {/* Renderizar os cômodos dentro da área útil */}
      {layout.map((room, index) => {
        const roomWidth = Math.sqrt(room.area) * scale;
        const roomHeight = Math.sqrt(room.area) * scale;

        const rect = (
          <rect
            key={index}
            className="draggable"
            x={currentX}
            y={currentY}
            width={roomWidth}
            height={roomHeight}
            fill="lightblue"
            stroke="black"
            data-x="0"
            data-y="0"
          />
        );

        currentX += roomWidth;
        if (currentX >= (lateralRecess + availableWidth) * scale) {
          currentX = lateralRecess * scale;
          currentY += roomHeight;
        }

        return rect;
      })}
    </svg>
  );
};

export default FloorPlanSVG;
