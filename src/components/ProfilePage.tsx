import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Purchase = Database['public']['Tables']['purchases']['Row'];

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;

      try {
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch purchases
        const { data: purchasesData, error: purchasesError } = await supabase
          .from('purchases')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (purchasesError) throw purchasesError;
        setPurchases(purchasesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-400">Please sign in to view your profile.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-blue-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-black/50 backdrop-blur-lg rounded-lg border border-blue-400/30 p-8 mb-8"
        >
          <h1 className="text-3xl font-light text-blue-400 mb-6">Profile</h1>
          {error ? (
            <div className="text-red-400 mb-4">{error}</div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <p className="text-white">{profile?.email}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                <p className="text-white">{profile?.full_name || 'Not set'}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Member Since</label>
                <p className="text-white">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString()
                    : 'Unknown'}
                </p>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-black/50 backdrop-blur-lg rounded-lg border border-blue-400/30 p-8"
        >
          <h2 className="text-2xl font-light text-blue-400 mb-6">Purchase History</h2>
          {purchases.length === 0 ? (
            <p className="text-gray-400">No purchases yet.</p>
          ) : (
            <div className="space-y-4">
              {purchases.map((purchase) => (
                <div
                  key={purchase.id}
                  className="border-b border-blue-400/20 last:border-0 pb-4 last:pb-0"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-white">Order #{purchase.id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(purchase.created_at || '').toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white">${purchase.amount}</p>
                      <p className="text-sm text-blue-400">{purchase.status}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {Array.isArray(purchase.items) && purchase.items.length > 0 && (
                      <ul className="list-disc list-inside">
                        {purchase.items.map((item: any, index: number) => (
                          <li key={index}>
                            {item.name} x{item.quantity}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;