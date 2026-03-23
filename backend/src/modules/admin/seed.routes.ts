import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../../utils/prisma';
import bcrypt from 'bcryptjs';

const router = Router();

// Simple seed endpoint (protect with a secret in production)
router.post('/seed', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const secret = req.headers['x-seed-secret'];
    if (secret !== process.env.SEED_SECRET) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Check if already seeded
    const existingUser = await prisma.user.findUnique({ where: { email: 'demo@example.com' } });
    if (existingUser) {
      res.json({ message: 'Database already seeded' });
      return;
    }

    const passwordHash = await bcrypt.hash('password123', 12);
    const user = await prisma.user.create({
      data: { email: 'demo@example.com', passwordHash, name: 'Demo User' },
    });

    const courses = [
      {
        slug: 'typescript-masterclass',
        title: 'TypeScript Masterclass',
        description: 'Master TypeScript from basics to advanced generics, decorators, and real-world patterns.',
        sections: [
          {
            title: 'TypeScript Basics',
            videos: [
              { title: 'What is TypeScript?', youtubeUrl: 'https://www.youtube.com/watch?v=BwuLxPH8IDs', durationSeconds: 540 },
              { title: 'Types & Interfaces', youtubeUrl: 'https://www.youtube.com/watch?v=ydkQlJhodio', durationSeconds: 720 },
            ],
          },
        ],
      },
      {
        slug: 'javascript-fundamentals',
        title: 'JavaScript Fundamentals',
        description: 'Learn JavaScript from scratch — variables, functions, DOM manipulation, async/await.',
        sections: [
          {
            title: 'Getting Started',
            videos: [
              { title: 'Introduction to JavaScript', youtubeUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk', durationSeconds: 480 },
              { title: 'Variables & Data Types', youtubeUrl: 'https://www.youtube.com/watch?v=edlFjlzxkSI', durationSeconds: 600 },
            ],
          },
        ],
      },
    ];

    for (const course of courses) {
      const subject = await prisma.subject.create({
        data: {
          title: course.title,
          slug: course.slug,
          description: course.description,
          isPublished: true,
        },
      });

      for (let si = 0; si < course.sections.length; si++) {
        const sectionData = course.sections[si];
        const section = await prisma.section.create({
          data: {
            subjectId: subject.id,
            title: sectionData.title,
            orderIndex: si + 1,
          },
        });

        for (let vi = 0; vi < sectionData.videos.length; vi++) {
          const v = sectionData.videos[vi];
          await prisma.video.create({
            data: {
              sectionId: section.id,
              title: v.title,
              youtubeUrl: v.youtubeUrl,
              orderIndex: vi + 1,
              durationSeconds: v.durationSeconds,
            },
          });
        }
      }

      await prisma.enrollment.create({
        data: { userId: user.id, subjectId: subject.id },
      });
    }

    res.json({ message: 'Database seeded successfully', user: { id: user.id, email: user.email } });
  } catch (err) {
    next(err);
  }
});

export default router;
