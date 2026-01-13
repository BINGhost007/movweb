import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@example.com',
    avatar: user?.avatar || '',
    preferences: {
      language: 'English',
      notifications: true,
      autoplay: true,
      quality: 'Auto'
    }
  });

  const handleSave = () => {
    // In a real app, this would save to the backend
    setIsEditing(false);
    console.log('Profile updated:', profile);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data if needed
  };

  const watchingStats = {
    totalWatched: 0,
    favoriteGenre: 'Drama',
    watchTime: '0 hours',
    completedMovies: 0
  };

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Profile</h1>
            <p className="text-gray-400">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-3xl font-bold">
                      {profile.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{profile.name}</h2>
                  <p className="text-gray-400">{profile.email}</p>
                </div>

                <div className="space-y-4">
                  <div className="text-center pt-4 border-t border-gray-800">
                    <div className="text-2xl font-bold text-red-500">{watchingStats.totalWatched}</div>
                    <div className="text-gray-400 text-sm">Movies Watched</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">{watchingStats.completedMovies}</div>
                    <div className="text-gray-400 text-sm">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-500">{watchingStats.watchTime}</div>
                    <div className="text-gray-400 text-sm">Watch Time</div>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Personal Information */}
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                      />
                    ) : (
                      <p className="text-white">{profile.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                      />
                    ) : (
                      <p className="text-white">{profile.email}</p>
                    )}
                  </div>
                </div>
                
                {isEditing && (
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={handleSave}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Viewing Preferences */}
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Viewing Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-white font-medium">Autoplay Next Episode</label>
                      <p className="text-gray-400 text-sm">Automatically play the next episode</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.preferences.autoplay}
                        onChange={(e) => setProfile({
                          ...profile,
                          preferences: {...profile.preferences, autoplay: e.target.checked}
                        })}
                        className="sr-only peer"
                        disabled={!isEditing}
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-white font-medium">Email Notifications</label>
                      <p className="text-gray-400 text-sm">Receive updates about new releases</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.preferences.notifications}
                        onChange={(e) => setProfile({
                          ...profile,
                          preferences: {...profile.preferences, notifications: e.target.checked}
                        })}
                        className="sr-only peer"
                        disabled={!isEditing}
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Preferred Video Quality</label>
                    {isEditing ? (
                      <select
                        value={profile.preferences.quality}
                        onChange={(e) => setProfile({
                          ...profile,
                          preferences: {...profile.preferences, quality: e.target.value}
                        })}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                      >
                        <option value="Auto">Auto</option>
                        <option value="4K">4K Ultra HD</option>
                        <option value="1080p">1080p HD</option>
                        <option value="720p">720p HD</option>
                      </select>
                    ) : (
                      <p className="text-white">{profile.preferences.quality}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Language</label>
                    {isEditing ? (
                      <select
                        value={profile.preferences.language}
                        onChange={(e) => setProfile({
                          ...profile,
                          preferences: {...profile.preferences, language: e.target.value}
                        })}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                      </select>
                    ) : (
                      <p className="text-white">{profile.preferences.language}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Security */}
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Account Security</h3>
                <div className="space-y-4">
                  <button className="w-full text-left bg-gray-800 hover:bg-gray-700 rounded-lg p-4 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Change Password</h4>
                        <p className="text-gray-400 text-sm">Update your password</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>

                  <button className="w-full text-left bg-gray-800 hover:bg-gray-700 rounded-lg p-4 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                        <p className="text-gray-400 text-sm">Add an extra layer of security</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>

                  <button className="w-full text-left bg-gray-800 hover:bg-gray-700 rounded-lg p-4 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Downloaded Content</h4>
                        <p className="text-gray-400 text-sm">Manage offline downloads</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>

              {/* Subscription */}
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Subscription</h3>
                <div className="bg-red-600 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-bold text-lg">Premium Plan</h4>
                      <p className="text-red-100">Unlimited movies and TV shows</p>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold text-lg">$15.99</div>
                      <div className="text-red-100 text-sm">per month</div>
                    </div>
                  </div>
                </div>
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                  Manage Subscription
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;