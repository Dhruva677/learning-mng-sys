import SubjectsList from '../components/SubjectsList';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/10 text-gray-300 px-3 py-1 rounded-full mb-5">
              ↑ LEARN AT YOUR OWN PACE
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Skills for your present<br />
              <span className="text-blue-400">and your future.</span>
            </h1>
            <p className="mt-4 text-gray-400 text-lg max-w-md">
              World-class courses taught by expert instructors. Start learning today and unlock your potential.
            </p>
            <div className="flex gap-3 mt-8">
              <a href="#courses" className="bg-white text-gray-900 font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-100 transition-colors">
                Browse courses ↓
              </a>
              <Link href="/register" className="border border-white/30 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-white/10 transition-colors">
                Sign up free
              </Link>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            {[
              { value: '6+', label: 'Expert Courses' },
              { value: '500K+', label: 'Students Enrolled' },
              { value: '4.7★', label: 'Average Rating' },
              { value: '100%', label: 'Free to Try' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 border border-white/10 rounded-xl px-6 py-5 text-center w-36">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900">All courses</h2>
        <p className="text-gray-500 text-sm mt-1 mb-8">6 courses — new content added every month</p>
        <SubjectsList />
      </section>
    </>
  );
}
