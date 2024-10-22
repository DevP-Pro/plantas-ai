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
  const totalArea = dimensions.width * dimensions.length;

  // Definir áreas específicas para diferentes tipos de cômodos
  const zoneAllocation = {
    private: 0.4 * totalArea, // Zona privada (quartos e banheiros) ocupa 40% da área
    social: 0.4 * totalArea,  // Zona social (sala de estar, jantar, cozinha) ocupa 40%
    service: 0.2 * totalArea, // Zona de serviço ocupa 20%
  };

  // Agrupamento por zona
  const zones = {
    private: [],
    social: [],
    service: [],
  };

  // Distribuir cômodos nas zonas
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

  // Adicionar as zonas ao layout final
  layout.push(...zones.private, ...zones.social, ...zones.service);

  return layout;
}




router.post('/generate-ai', (req, res) => {
  const { dimensions, rooms } = req.body;

  // Validação básica
  if (!dimensions || !rooms) {
    return res.status(400).json({ error: 'Dimensões e cômodos são obrigatórios' });
  }

  // Simulação de uma chamada para a IA para gerar um layout mais detalhado
  const layout = generateLayoutWithAI(dimensions, rooms);

  // Retorna o layout gerado pela IA
  res.status(200).json({
    message: 'Layout gerado pela IA com sucesso',
    layout,
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
