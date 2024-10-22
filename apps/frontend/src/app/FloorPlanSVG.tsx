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

  let currentX = recesses.lateralRecess * scale;
  let currentY = recesses.frontalRecess * scale;

  return (
    <svg
      width={dimensions.width * scale}
      height={dimensions.length * scale}
      style={{ border: '1px solid black', marginTop: '20px' }}
    >
      {/* Desenhar a área útil disponível após os recuos */}
      <rect
        x={recesses.lateralRecess * scale}
        y={recesses.frontalRecess * scale}
        width={availableWidth * scale}
        height={availableLength * scale}
        fill="none"
        stroke="red"
        strokeDasharray="5,5"
      />

            {/* Renderizar a área de luz */}
            {layout.map((room, index) => {
        if (room.type === 'Área de Luz') {
          return (
            <rect
              key={index}
              className="draggable"
              x={currentX}
              y={currentY}
              width={Math.sqrt(room.area) * scale}
              height={Math.sqrt(room.area) * scale}
              fill="yellow"
              stroke="black"
              data-x="0"
              data-y="0"
            />
          );
        }
        return null;
      })}

      {/* Renderizar a área de lazer */}
      {layout.map((room, index) => {
        if (room.type === 'Área de Lazer') {
          // Posicionar a área de lazer no fundo do terreno
          const leisureX = recesses.lateralRecess * scale;
          const leisureY = (recesses.frontalRecess + availableLength - Math.sqrt(room.area)) * scale;

          return (
            <rect
              key={index}
              className="draggable"
              x={leisureX}
              y={leisureY}
              width={Math.sqrt(room.area) * scale}
              height={Math.sqrt(room.area) * scale}
              fill="green"
              stroke="black"
              data-x="0"
              data-y="0"
            />
          );
        }
        return null;
      })}

      {/* Renderizar os outros cômodos */}
      {layout.map((room, index) => {
        if (room.type !== 'Área de Luz' && room.type !== 'Área de Lazer') {
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
          if (currentX >= (recesses.lateralRecess + availableWidth) * scale) {
            currentX = recesses.lateralRecess * scale;
            currentY += roomHeight;
          }

          return rect;
        }
        return null;
      })}
    </svg>
  );
};

export default FloorPlanSVG;
