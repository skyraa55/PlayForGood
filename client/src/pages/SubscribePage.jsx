import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Check, Zap, Calendar, ArrowRight, Trophy, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function SubscribePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState('');

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: '£9.99',
      period: '/month',
      icon: Zap,
      badge: null,
      features: ['Monthly prize draw entry','Score tracking (5 scores)','Charity contribution','Cancel anytime'],
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: '£89.99',
      period: '/year',
      icon: Calendar,
      badge: 'Best Value — Save 25%',
      features: ['All Monthly features','25% discount','Priority support','Bonus draw entries','Annual highlights report'],
    },
  ];

  const handleSubscribe = async (plan) => {
    if (user?.subscription_status === 'active') {
      toast('You already have an active subscription!', { icon: '✅' });
      navigate('/dashboard');
      return;
    }
    setLoading(plan);
    try {
      const res = await api.post('/subscriptions/checkout', { plan });
      window.location.href = res.data.url;
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to start checkout');
      setLoading('');
    }
  };

  return (
  <div className="min-h-screen bg-gray-50">
    <Navbar />

    <div className="pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-green-600 text-xs font-medium mb-4">
            <Trophy size={12} />
            Choose Your Plan
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Start Playing with Purpose
          </h1>

          <p className="text-gray-600 max-w-xl mx-auto">
            Every subscription enters you into monthly prize draws and drives real charitable impact.
          </p>
        </div>

        {/* Active subscription notice */}
        {user?.subscription_status === 'active' && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
            <p className="text-green-600 font-medium">
              You already have an active subscription!
            </p>
            <Link
              to="/dashboard"
              className="text-green-500 text-sm underline"
            >
              Go to Dashboard
            </Link>
          </div>
        )}

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map(({ id, name, price, period, icon: Icon, badge, features }) => (
            <div
              key={id}
              className={`relative flex flex-col bg-white border border-gray-200 rounded-xl p-6 ${
                badge ? 'border-green-300 shadow-md' : ''
              }`}
            >
              {/* Badge */}
              {badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-green-500 text-white text-xs font-bold rounded-full whitespace-nowrap">
                  {badge}
                </div>
              )}

              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                  <Icon size={20} className="text-green-600" />
                </div>

                <div>
                  <h3 className="text-gray-900 font-bold text-lg">
                    {name}
                  </h3>

                  <div className="flex items-end gap-1">
                    <span className="text-2xl font-bold text-green-600">
                      {price}
                    </span>
                    <span className="text-gray-500 text-sm pb-0.5">
                      {period}
                    </span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-6 flex-1">
                {features.map(f => (
                  <li
                    key={f}
                    className="flex items-center gap-2.5 text-sm text-gray-600"
                  >
                    <Check
                      size={15}
                      className="text-green-500 flex-shrink-0"
                    />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Button */}
              <button
                onClick={() => handleSubscribe(id)}
                disabled={!!loading || user?.subscription_status === 'active'}
                className={
                  badge
                    ? 'w-full bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all'
                    : 'w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all'
                }
              >
                {loading === id ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {user?.subscription_status === 'active'
                      ? 'Already Active'
                      : `Get ${name}`}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-8 flex items-center justify-center gap-6 text-gray-500 text-sm">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-green-500" />
            Secure Stripe payments
          </div>

          <div className="flex items-center gap-2">
            <Check size={14} className="text-green-500" />
            Cancel anytime
          </div>
        </div>

      </div>
    </div>

    <Footer />
  </div>
);
}
