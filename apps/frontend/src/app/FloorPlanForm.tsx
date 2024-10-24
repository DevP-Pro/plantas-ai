import React, { useState } from 'react';
import FloorPlanSVG from './FloorPlanSVG'; // Importar o componente SVG

const FloorPlanForm = () => {
  const [dimensions, setDimensions] = useState({ width: '', length: '' });
  const [rooms, setRooms] = useState({ bedrooms: 0, bathrooms: 0, kitchen: 0, livingRoom: 0 });
  const [useOptimization, setUseOptimization] = useState(false); // Estado para a escolha da função otimizada
  const [layoutData, setLayoutData] = useState<any>(null); // Armazenar dados do layout, incluindo recessos e dimensões úteis

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

  const handleOptimizationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUseOptimization(e.target.checked); // Atualiza o estado quando o usuário muda o checkbox
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:3333/api/floorplan/generate-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dimensions, rooms, optimization: useOptimization }), // Inclui a flag de otimização
      });
  
      const data = await response.json();
      console.log('Dados recebidos do backend:', data); // Verificar se os dados estão corretos
      setLayoutData(data); // Armazena o layout e as dimensões úteis no estado
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

        {/* Checkbox para escolha da otimização */}
        <div>
          <label htmlFor="optimization">Usar otimização avançada?</label>
          <input
            type="checkbox"
            id="optimization"
            name="optimization"
            checked={useOptimization}
            onChange={handleOptimizationChange}
          />
        </div>
  
        <button type="submit">Gerar Planta Baixa com IA</button>
      </form>
  
      {/* Verificação de segurança antes de renderizar o layout */}
      {layoutData ? (
        layoutData.recesses ? (
          <FloorPlanSVG
            layout={layoutData.layout}
            dimensions={{
              width: Number(dimensions.width),
              length: Number(dimensions.length),
            }}
            availableWidth={layoutData.availableWidth}
            availableLength={layoutData.availableLength}
            recesses={layoutData.recesses}
          />
        ) : (
          <p>Erro: Recessos não definidos.</p>
        )
      ) : (
        <p>Aguardando dados do layout...</p>
      )}
    </div>
  );
};

export default FloorPlanForm;
