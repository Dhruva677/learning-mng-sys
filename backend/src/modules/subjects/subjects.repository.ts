import prisma from '../../utils/prisma';

export async function getAllPublishedSubjects() {
  return prisma.subject.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { sections: true, enrollments: true } } },
  });
}

export async function getSubjectById(id: number) {
  return prisma.subject.findUnique({
    where: { id },
    include: { _count: { select: { sections: true, enrollments: true } } },
  });
}

export async function getSubjectWithTree(id: number) {
  return prisma.subject.findUnique({
    where: { id },
    include: {
      sections: {
        orderBy: { orderIndex: 'asc' },
        include: { videos: { orderBy: { orderIndex: 'asc' } } },
      },
    },
  });
}

export async function getFirstVideoOfSubject(subjectId: number) {
  const section = await prisma.section.findFirst({
    where: { subjectId },
    orderBy: { orderIndex: 'asc' },
    include: { videos: { orderBy: { orderIndex: 'asc' }, take: 1 } },
  });
  return section?.videos[0] ?? null;
}

export async function enrollUser(userId: number, subjectId: number) {
  return prisma.enrollment.upsert({
    where: { userId_subjectId: { userId, subjectId } },
    create: { userId, subjectId },
    update: {},
  });
}
