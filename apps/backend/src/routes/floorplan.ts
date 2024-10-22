import { Router } from 'express';

const router = Router();

function generateFloorPlan(
  dimensions: { width: number; length: number },
  rooms: { [key: string]: number }
): any[] | { error: string } {
  const layout = [];

  const totalArea = dimensions.width * dimensions.length; // Área total do terreno
  const numRooms = Object.values(rooms).reduce((acc, count) => acc + count, 0); // Total de cômodos

  // Verifique se há espaço suficiente no terreno para acomodar os cômodos
  if (numRooms === 0) {
    return { error: 'Nenhum cômodo foi especificado' };
  }

  const roomArea = totalArea / numRooms; // Área média por cômodo

  // Distribui os cômodos pelo layout (proporcionalmente à área)
  Object.keys(rooms).forEach((roomType) => {
    const count = rooms[roomType];
    for (let i = 0; i < count; i++) {
      layout.push({
        type: roomType,
        area: roomArea, // Para simplificação, todos os cômodos terão a mesma área
      });
    }
  });

  return layout;
}

// Função simulada para a IA gerar um layout
function generateLayoutWithAI(dimensions: { width: number; length: number }, rooms: { [key: string]: number }) {
  const layout = [];

  // Definir os recuos obrigatórios
  const frontalRecess = 3; // Recuo frontal de 3 metros
  const lateralRecess = 1.5; // Recuo lateral de 1,5 metros
  const backRecess = 1.5; // Recuo de fundo de 1,5 metros

  // Ajustar as dimensões disponíveis para construção considerando os recuos
  const availableWidth = dimensions.width - 2 * lateralRecess;
  const availableLength = dimensions.length - frontalRecess - backRecess;

  // Exemplo simples de distribuição de cômodos (pode ser melhorado conforme necessário)
  const totalAvailableArea = availableWidth * availableLength;
  const zoneAllocation = {
    private: 0.4 * totalAvailableArea,
    social: 0.4 * totalAvailableArea,
    service: 0.2 * totalAvailableArea,
  };

  // Distribuir cômodos nas zonas (exemplo simples)
  if (rooms.bedrooms) {
    const areaPerRoom = zoneAllocation.private / rooms.bedrooms;
    for (let i = 0; i < rooms.bedrooms; i++) {
      layout.push({ type: 'Quarto', area: areaPerRoom });
    }
  }

  if (rooms.bathrooms) {
    const areaPerRoom = zoneAllocation.private / rooms.bathrooms;
    for (let i = 0; i < rooms.bathrooms; i++) {
      layout.push({ type: 'Banheiro', area: areaPerRoom });
    }
  }

  if (rooms.livingRoom) {
    const areaPerRoom = zoneAllocation.social / rooms.livingRoom;
    for (let i = 0; i < rooms.livingRoom; i++) {
      layout.push({ type: 'Sala de Estar', area: areaPerRoom });
    }
  }

  if (rooms.kitchen) {
    const areaPerRoom = zoneAllocation.social / rooms.kitchen;
    for (let i = 0; i < rooms.kitchen; i++) {
      layout.push({ type: 'Cozinha', area: areaPerRoom });
    }
  }

  // Retornar layout, dimensões úteis e recessos
  return {
    layout,
    availableWidth,
    availableLength,
    recesses: {
      frontalRecess,
      lateralRecess,
      backRecess,
    },
  };
}


router.post('/generate-ai', (req, res) => {
  const { dimensions, rooms } = req.body;

  // Validação básica
  if (!dimensions || !rooms) {
    return res.status(400).json({ error: 'Dimensões e cômodos são obrigatórios' });
  }

  // Gerar o layout, incluindo recessos e dimensões úteis
  const layoutData = generateLayoutWithAI(dimensions, rooms);

  // Retorna o layout gerado pela IA junto com os recessos e dimensões úteis
  res.status(200).json({
    message: 'Layout gerado pela IA com sucesso',
    layout: layoutData.layout,
    availableWidth: layoutData.availableWidth,
    availableLength: layoutData.availableLength,
    recesses: layoutData.recesses,
  });
});


router.post('/generate', (req, res) => {
  const { dimensions, rooms } = req.body;

  // Validação básica
  if (!dimensions || !rooms) {
    return res
      .status(400)
      .json({ error: 'Dimensões e cômodos são obrigatórios' });
  }

  // Gera o layout da planta baixa
  const layout = generateFloorPlan(dimensions, rooms);

  // Verifica se houve algum erro na geração do layout
  if ('error' in layout) {
    return res.status(400).json({ error: layout.error });
  }

  // Retorna o layout gerado
  res.status(200).json({
    message: 'Dados recebidos com sucesso',
    layout,
  });
});

export default router;
