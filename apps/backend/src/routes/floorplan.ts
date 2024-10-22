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

  const totalAvailableArea = availableWidth * availableLength;

  // Distribuir o espaço entre zonas privadas, sociais e de serviço
  const zoneAllocation = {
    private: 0.4 * totalAvailableArea,  // Zona privada (quartos e banheiros) ocupa 40% da área
    social: 0.4 * totalAvailableArea,   // Zona social (sala de estar, jantar, cozinha) ocupa 40%
    service: 0.2 * totalAvailableArea,  // Zona de serviço ocupa 20%
  };

  const zones = {
    private: [],
    social: [],
    service: [],
  };

  // Zona Privada (quartos e banheiros)
  if (rooms.bedrooms) {
    const areaPerRoom = zoneAllocation.private / rooms.bedrooms;
    for (let i = 0; i < rooms.bedrooms; i++) {
      zones.private.push({ type: 'Quarto', area: areaPerRoom });
    }
  }

  if (rooms.bathrooms) {
    const areaPerRoom = zoneAllocation.private / rooms.bathrooms;
    for (let i = 0; i < rooms.bathrooms; i++) {
      zones.private.push({ type: 'Banheiro', area: areaPerRoom });
    }
  }

  // Zona Social (sala de estar, sala de jantar e cozinha)
  if (rooms.livingRoom) {
    const areaPerRoom = zoneAllocation.social / rooms.livingRoom;
    for (let i = 0; i < rooms.livingRoom; i++) {
      zones.social.push({ type: 'Sala de Estar', area: areaPerRoom });
    }
  }

  if (rooms.kitchen) {
    const areaPerRoom = zoneAllocation.social / rooms.kitchen;
    for (let i = 0; i < rooms.kitchen; i++) {
      zones.social.push({ type: 'Cozinha', area: areaPerRoom });
    }
  }

  // Zona de Serviço (exemplo: lavanderia, despensa)
  if (rooms.serviceArea) {
    const areaPerRoom = zoneAllocation.service / rooms.serviceArea;
    for (let i = 0; i < rooms.serviceArea; i++) {
      zones.service.push({ type: 'Área de Serviço', area: areaPerRoom });
    }
  }

  // Adicionar as zonas ao layout final (mantendo a ordem lógica)
  layout.push(...zones.private, ...zones.social, ...zones.service);

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
