import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ArrowLeft } from 'lucide-react';
export default function NotFoundPage() {
  return (
  <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
    <Trophy size={56} className="text-green-200 mb-6" />
    <h1 className="text-7xl font-bold text-green-600 mb-4">
      404
    </h1>
    <p className="text-gray-900 text-xl font-semibold mb-2">
      Page not found
    </p>
    <p className="text-gray-500 mb-8">
      Looks like this shot went out of bounds.
    </p>
    <Link
      to="/"
      className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium transition-all"
    >
      <ArrowLeft size={16} />
      Back to Home
    </Link>
  </div>
  );
}
