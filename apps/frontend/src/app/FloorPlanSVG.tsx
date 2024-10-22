import React from 'react';

interface Room {
  type: string;
  area: number;
}

interface Dimensions {
  width: number;
  length: number;
}

interface FloorPlanSVGProps {
  layout: Room[];
  dimensions: Dimensions;
}

const FloorPlanSVG: React.FC<FloorPlanSVGProps> = ({ layout, dimensions }) => {
  const scale = 10; // Escala para ajustar a visualização

  const totalRooms = layout.length;

  // Cálculo básico de quantas colunas e linhas
  const columns = Math.ceil(Math.sqrt(totalRooms)); // Número de colunas para a grade
  const rows = Math.ceil(totalRooms / columns); // Número de linhas necessário

  // Largura e altura de cada cômodo, proporcional ao número de colunas/linhas
  const roomWidth = (dimensions.width * scale) / columns;
  const roomHeight = (dimensions.length * scale) / rows;

  let currentX = 0;
  let currentY = 0;

  return (
    <svg
      width={dimensions.width * scale}
      height={dimensions.length * scale}
      style={{ border: '1px solid black', marginTop: '20px' }}
    >
      {layout.map((room, index) => {
        const rect = (
          <rect
            key={index}
            x={currentX}
            y={currentY}
            width={roomWidth}
            height={roomHeight}
            fill="lightblue"
            stroke="black"
          />
        );

        currentX += roomWidth;
        if (currentX >= dimensions.width * scale) {
          currentX = 0;
          currentY += roomHeight;
        }

        return rect;
      })}
    </svg>
  );
};

export default FloorPlanSVG;
