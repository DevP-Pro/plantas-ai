import React, { useState } from 'react';
import FloorPlanSVG from './FloorPlanSVG'; // Importar o componente SVG

const FloorPlanForm = () => {
  const [dimensions, setDimensions] = useState({ width: '', length: '' });
  const [rooms, setRooms] = useState({ bedrooms: 0, bathrooms: 0, kitchen: 0, livingRoom: 0 });
  const [layout, setLayout] = useState<any[]>([]); // Estado para armazenar o layout gerado

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDimensions({
      ...dimensions,
      [name]: value,
    });
  };

  const handleRoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRooms({
      ...rooms,
      [name]: parseInt(value),
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Chamar a rota que simula a geração de layout com IA
      const response = await fetch('http://localhost:3333/api/floorplan/generate-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dimensions, rooms }),
      });

      const data = await response.json();
      setLayout(data.layout); // Armazena o layout gerado no estado
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Planta Baixa - Detalhes do Terreno</h2>

        <label htmlFor="width">Largura do Terreno (em metros):</label>
        <input
          type="number"
          id="width"
          name="width"
          value={dimensions.width}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="length">Comprimento do Terreno (em metros):</label>
        <input
          type="number"
          id="length"
          name="length"
          value={dimensions.length}
          onChange={handleInputChange}
          required
        />

        <h2>Quantidade de Cômodos</h2>

        <label htmlFor="bedrooms">Quartos:</label>
        <input
          type="number"
          id="bedrooms"
          name="bedrooms"
          value={rooms.bedrooms}
          onChange={handleRoomChange}
          min="0"
          required
        />

        <label htmlFor="bathrooms">Banheiros:</label>
        <input
          type="number"
          id="bathrooms"
          name="bathrooms"
          value={rooms.bathrooms}
          onChange={handleRoomChange}
          min="0"
          required
        />

        <label htmlFor="kitchen">Cozinhas:</label>
        <input
          type="number"
          id="kitchen"
          name="kitchen"
          value={rooms.kitchen}
          onChange={handleRoomChange}
          min="0"
          required
        />

        <label htmlFor="livingRoom">Salas de Estar:</label>
        <input
          type="number"
          id="livingRoom"
          name="livingRoom"
          value={rooms.livingRoom}
          onChange={handleRoomChange}
          min="0"
          required
        />

        <button type="submit">Gerar Planta Baixa com IA</button>
      </form>

      {/* Renderizar o layout gráfico com SVG */}
      {layout.length > 0 && (
        <FloorPlanSVG
          layout={layout}
          dimensions={{
            width: Number(dimensions.width), // Conversão de string para number
            length: Number(dimensions.length), // Conversão de string para number
          }}
        />
      )}
    </div>
  );
};

export default FloorPlanForm;
