import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: { email: 'demo@example.com', passwordHash, name: 'Demo User' },
  });

  // ─── COURSE DATA ────────────────────────────────────────────────────────────
  const courses = [
    {
      slug: 'typescript-masterclass',
      title: 'TypeScript Masterclass',
      description: 'Master TypeScript from basics to advanced generics, decorators, and real-world patterns used in production apps.',
      thumbnail: 'https://img.youtube.com/vi/BwuLxPH8IDs/maxresdefault.jpg',
      sections: [
        {
          title: 'TypeScript Basics',
          videos: [
            { title: 'What is TypeScript?', youtubeUrl: 'https://www.youtube.com/watch?v=BwuLxPH8IDs', durationSeconds: 540 },
            { title: 'Types & Interfaces', youtubeUrl: 'https://www.youtube.com/watch?v=ydkQlJhodio', durationSeconds: 720 },
            { title: 'Functions & Generics', youtubeUrl: 'https://www.youtube.com/watch?v=nViEqpgwxHE', durationSeconds: 660 },
          ],
        },
        {
          title: 'Advanced TypeScript',
          videos: [
            { title: 'Utility Types', youtubeUrl: 'https://www.youtube.com/watch?v=Fgcu_iB2X04', durationSeconds: 780 },
            { title: 'Decorators', youtubeUrl: 'https://www.youtube.com/watch?v=O6A-u_FoEX8', durationSeconds: 600 },
            { title: 'TypeScript with React', youtubeUrl: 'https://www.youtube.com/watch?v=jrKcJxF0lAU', durationSeconds: 840 },
          ],
        },
      ],
    },
    {
      slug: 'docker-in-2-hours',
      title: 'Docker in 2 Hours',
      description: 'Learn Docker from scratch — containers, images, volumes, networking, and Docker Compose for full-stack apps.',
      thumbnail: 'https://img.youtube.com/vi/pg19Z8LL06w/maxresdefault.jpg',
      sections: [
        {
          title: 'Docker Fundamentals',
          videos: [
            { title: 'What is Docker?', youtubeUrl: 'https://www.youtube.com/watch?v=pg19Z8LL06w', durationSeconds: 480 },
            { title: 'Images & Containers', youtubeUrl: 'https://www.youtube.com/watch?v=Gjnup-PuquQ', durationSeconds: 600 },
            { title: 'Dockerfile Deep Dive', youtubeUrl: 'https://www.youtube.com/watch?v=LQjaJINkQXY', durationSeconds: 720 },
          ],
        },
        {
          title: 'Docker Compose & Networking',
          videos: [
            { title: 'Docker Compose Basics', youtubeUrl: 'https://www.youtube.com/watch?v=HG6yIjZapSA', durationSeconds: 660 },
            { title: 'Volumes & Persistence', youtubeUrl: 'https://www.youtube.com/watch?v=p2PH_YPCsis', durationSeconds: 540 },
            { title: 'Multi-container Apps', youtubeUrl: 'https://www.youtube.com/watch?v=MVIcrmeV_6c', durationSeconds: 780 },
          ],
        },
      ],
    },
    {
      slug: 'sql-in-4-hours',
      title: 'SQL in 4 Hours',
      description: 'Complete SQL course covering SELECT, JOINs, subqueries, indexes, transactions, and database design principles.',
      thumbnail: 'https://img.youtube.com/vi/HXV3zeQKqGY/maxresdefault.jpg',
      sections: [
        {
          title: 'SQL Basics',
          videos: [
            { title: 'Introduction to SQL', youtubeUrl: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', durationSeconds: 600 },
            { title: 'SELECT & Filtering', youtubeUrl: 'https://www.youtube.com/watch?v=7S_tz1z_5bA', durationSeconds: 720 },
            { title: 'Sorting & Aggregation', youtubeUrl: 'https://www.youtube.com/watch?v=p3qvj9hO_Bo', durationSeconds: 540 },
          ],
        },
        {
          title: 'Advanced SQL',
          videos: [
            { title: 'JOINs Explained', youtubeUrl: 'https://www.youtube.com/watch?v=9yeOJ0ZMUYw', durationSeconds: 780 },
            { title: 'Subqueries & CTEs', youtubeUrl: 'https://www.youtube.com/watch?v=m1KcNV-Zhmc', durationSeconds: 660 },
            { title: 'Indexes & Performance', youtubeUrl: 'https://www.youtube.com/watch?v=fsG1XaZEa78', durationSeconds: 600 },
          ],
        },
      ],
    },
    {
      slug: 'python-full-course',
      title: 'Python Full Course',
      description: 'Learn Python programming from zero to hero — data structures, OOP, file handling, APIs, and automation scripts.',
      thumbnail: 'https://img.youtube.com/vi/_uQrJ0TkZlc/maxresdefault.jpg',
      sections: [
        {
          title: 'Python Basics',
          videos: [
            { title: 'Python Introduction', youtubeUrl: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc', durationSeconds: 720 },
            { title: 'Variables & Data Types', youtubeUrl: 'https://www.youtube.com/watch?v=khKv-8q7YmY', durationSeconds: 600 },
            { title: 'Control Flow', youtubeUrl: 'https://www.youtube.com/watch?v=DZwmZ8Usvnk', durationSeconds: 540 },
          ],
        },
        {
          title: 'Python OOP & Advanced',
          videos: [
            { title: 'Functions & Modules', youtubeUrl: 'https://www.youtube.com/watch?v=9Os0o3wzS_I', durationSeconds: 660 },
            { title: 'Object-Oriented Python', youtubeUrl: 'https://www.youtube.com/watch?v=JeznW_7DlB0', durationSeconds: 780 },
            { title: 'File Handling & APIs', youtubeUrl: 'https://www.youtube.com/watch?v=SqvVm3QiQVk', durationSeconds: 720 },
          ],
        },
      ],
    },
    {
      slug: 'react-complete-guide',
      title: 'React Complete Guide',
      description: 'Build modern React apps with hooks, context, React Query, and Next.js. Includes real project walkthroughs.',
      thumbnail: 'https://img.youtube.com/vi/bMknfKXIFA8/maxresdefault.jpg',
      sections: [
        {
          title: 'React Fundamentals',
          videos: [
            { title: 'React Introduction', youtubeUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8', durationSeconds: 600 },
            { title: 'Components & Props', youtubeUrl: 'https://www.youtube.com/watch?v=Ke90Tje7VS0', durationSeconds: 720 },
            { title: 'State & useState', youtubeUrl: 'https://www.youtube.com/watch?v=O6P86uwfdR0', durationSeconds: 540 },
          ],
        },
        {
          title: 'React Hooks & Patterns',
          videos: [
            { title: 'useEffect & Lifecycle', youtubeUrl: 'https://www.youtube.com/watch?v=0ZJgIjIuY7U', durationSeconds: 660 },
            { title: 'useContext & State Mgmt', youtubeUrl: 'https://www.youtube.com/watch?v=5LrDIWkK_Bc', durationSeconds: 780 },
            { title: 'Custom Hooks', youtubeUrl: 'https://www.youtube.com/watch?v=6ThXsUwLWvc', durationSeconds: 600 },
          ],
        },
      ],
    },
    {
      slug: 'javascript-fundamentals',
      title: 'JavaScript Fundamentals',
      description: 'Learn JavaScript from scratch — variables, functions, DOM manipulation, async/await, and ES6+ features.',
      thumbnail: 'https://img.youtube.com/vi/W6NZfCO5SIk/maxresdefault.jpg',
      sections: [
        {
          title: 'Getting Started',
          videos: [
            { title: 'Introduction to JavaScript', youtubeUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk', durationSeconds: 480 },
            { title: 'Variables & Data Types', youtubeUrl: 'https://www.youtube.com/watch?v=edlFjlzxkSI', durationSeconds: 600 },
            { title: 'Operators & Expressions', youtubeUrl: 'https://www.youtube.com/watch?v=UjozQOaGt1k', durationSeconds: 540 },
          ],
        },
        {
          title: 'Functions & Async',
          videos: [
            { title: 'Functions Basics', youtubeUrl: 'https://www.youtube.com/watch?v=N8ap4k_1QEQ', durationSeconds: 720 },
            { title: 'Arrow Functions', youtubeUrl: 'https://www.youtube.com/watch?v=h33Srr5J9nY', durationSeconds: 660 },
            { title: 'Promises & Async/Await', youtubeUrl: 'https://www.youtube.com/watch?v=PoRJizFvM7s', durationSeconds: 780 },
          ],
        },
      ],
    },
  ];

  // ─── SEED COURSES ────────────────────────────────────────────────────────────
  for (const course of courses) {
    const subject = await prisma.subject.upsert({
      where: { slug: course.slug },
      update: { title: course.title, description: course.description, thumbnail: course.thumbnail },
      create: {
        title: course.title,
        slug: course.slug,
        description: course.description,
        thumbnail: course.thumbnail,
        isPublished: true,
      },
    });

    for (let si = 0; si < course.sections.length; si++) {
      const sectionData = course.sections[si];
      const section = await prisma.section.upsert({
        where: { subjectId_orderIndex: { subjectId: subject.id, orderIndex: si + 1 } },
        update: { title: sectionData.title },
        create: { subjectId: subject.id, title: sectionData.title, orderIndex: si + 1 },
      });

      for (let vi = 0; vi < sectionData.videos.length; vi++) {
        const v = sectionData.videos[vi];
        await prisma.video.upsert({
          where: { sectionId_orderIndex: { sectionId: section.id, orderIndex: vi + 1 } },
          update: { title: v.title, youtubeUrl: v.youtubeUrl },
          create: {
            sectionId: section.id,
            title: v.title,
            youtubeUrl: v.youtubeUrl,
            orderIndex: vi + 1,
            durationSeconds: v.durationSeconds,
          },
        });
      }
    }

    // Enroll demo user in all courses
    await prisma.enrollment.upsert({
      where: { userId_subjectId: { userId: user.id, subjectId: subject.id } },
      update: {},
      create: { userId: user.id, subjectId: subject.id },
    });
  }

  console.log(`✅ Seeded ${courses.length} courses. Login: demo@example.com / password123`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
