import prisma from '../../utils/prisma';

export async function getVideoById(id: number) {
  return prisma.video.findUnique({ where: { id }, include: { section: true } });
}
