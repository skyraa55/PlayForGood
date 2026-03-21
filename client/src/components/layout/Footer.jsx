import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Heart, Github } from 'lucide-react';

export default function Footer() {
  return (
  <footer className="bg-white border-t border-gray-200 mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl mb-3">
            <div className="w-8 h-8 bg-[#006B3A] rounded-lg flex items-center justify-center">
              <Trophy size={16} className="text-white" />
            </div>
            <span className="text-gray-900">PlayForGood</span>
          </Link>
          <p className="text-gray-600 text-sm max-w-xs leading-relaxed">
            Play golf. Win prizes. Change lives. A subscription platform where your game drives charitable impact.
          </p>
        </div>
        <div>
          <p className="text-gray-900 font-semibold mb-3 text-sm">Platform</p>
          <div className="flex flex-col gap-2">
            {[['/', 'Home'], ['/charities', 'Charities'], ['/draws', 'Draws'], ['/subscribe', 'Subscribe']].map(([to, label]) => (
              <Link
                key={to}
                to={to}
                className="text-gray-600 hover:text-green-600 text-sm transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-gray-900 font-semibold mb-3 text-sm">Account</p>
          <div className="flex flex-col gap-2">
            {[['/login', 'Log In'], ['/register', 'Register'], ['/dashboard', 'Dashboard']].map(([to, label]) => (
              <Link
                key={to}
                to={to}
                className="text-gray-600 hover:text-green-600 text-sm transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-gray-500 text-xs">
          © {new Date().getFullYear()} PlayForGood All rights reserved.
        </p>
        <p className="text-gray-500 text-xs flex items-center gap-1.5">
          Made with <Heart size={11} className="text-[#006B3A] fill-[#006B3A]" /> for charitable golf
        </p>
      </div>
    </div>
  </footer>
);
}
