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

  // Gerar o layout de acordo com a quantidade de cada tipo de cômodo
  Object.keys(rooms).forEach((roomType) => {
    const roomCount = rooms[roomType];
    for (let i = 0; i < roomCount; i++) {
      let area;
      switch (roomType) {
        case 'bedrooms':
          area = 12; // Área média de um quarto
          break;
        case 'bathrooms':
          area = 4; // Área média de um banheiro
          break;
        case 'kitchen':
          area = 10; // Área média de uma cozinha
          break;
        case 'livingRoom':
          area = 15; // Área média de uma sala de estar
          break;
        default:
          area = 8; // Área padrão para outros cômodos
      }
      layout.push({ type: roomType, area });
    }
  });

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
