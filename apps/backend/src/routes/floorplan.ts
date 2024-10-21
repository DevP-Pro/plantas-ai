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
