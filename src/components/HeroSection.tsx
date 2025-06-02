// src/components/HeroSection.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 mb-8 text-white">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 mb-6 md:mb-0">
          <h2 className="text-2xl font-bold mb-4">
            Organize Your Work Like Never Before
          </h2>
          <p className="text-indigo-100 mb-6">
            Create, manage, and track your tasks with our powerful kanban board. 
            Stay productive and never miss a deadline.
          </p>
          <Link
            href="/tasks"
            className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            View All Tasks
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="w-64 h-48 bg-white bg-opacity-20 rounded-lg flex items-center justify-center relative">
            <Image
              src="/next.svg"
              alt="TaskFlow Kanban Board"
              width={100}
              height={40}
              className="opacity-75"
              style={{ width: 'auto', height: 'auto' }}
            />
            <span className="absolute bottom-4 text-indigo-100 text-sm font-semibold">📋 Kanban Board</span>
          </div>
        </div>
      </div>
    </div>
  );
}