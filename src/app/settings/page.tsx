'use client';

import { useState } from 'react';

// Mock settings data for UI development
const mockSettings = {
  account: {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    password: '••••••••••••',
  },
  notifications: {
    email: true,
    push: true,
    sms: false,
    eventReminders: true,
    vendorMessages: true,
    marketingUpdates: false,
  },
  privacy: {
    profileVisibility: 'public',
    shareEventHistory: true,
    allowDataCollection: true,
  },
  appearance: {
    theme: 'light',
    density: 'comfortable',
    fontSize: 'medium',
  },
  billing: {
    plan: 'Professional',
    nextBillingDate: new Date('2025-09-15'),
    paymentMethod: 'Visa ending in 4242',
  },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(mockSettings);
  const [activeSection, setActiveSection] = useState('account');
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  const handleInputChange = (section: string, field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const handleToggleChange = (section: string, field: string) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: !prev[section as keyof typeof prev][field as keyof typeof prev[keyof typeof prev]],
      },
    }));
  };

  const handleSave = () => {
    // In a real app, we would send the updated settings to an API endpoint
    console.log('Saving settings:', settings);
    setShowSavedMessage(true);
    setTimeout(() => {
      setShowSavedMessage(false);
    }, 3000);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        {showSavedMessage && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Your settings have been saved successfully.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Settings Navigation */}
            <div className="w-full md:w-64 bg-gray-50 p-6 border-r border-gray-200">
              <nav className="space-y-1">
                {['account', 'notifications', 'privacy', 'appearance', 'billing'].map((section) => (
                  <button
                    key={section}
                    onClick={() => setActiveSection(section)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeSection === section
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                ))}
              </nav>
            </div>

            {/* Settings Content */}
            <div className="flex-1 p-6">
              {activeSection === 'account' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={settings.account.name}
                        onChange={(e) => handleInputChange('account', 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={settings.account.email}
                        onChange={(e) => handleInputChange('account', 'email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <div className="flex">
                        <input
                          type="password"
                          id="password"
                          value={settings.account.password}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="ml-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                          Change
                        </button>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Danger Zone</h3>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'notifications' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base font-medium text-gray-900 mb-3">Notification Channels</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm text-gray-700">Email Notifications</span>
                            <p className="text-xs text-gray-500">Receive updates about your events via email</p>
                          </div>
                          <div className="flex items-center">
                            <button
                              type="button"
                              onClick={() => handleToggleChange('notifications', 'email')}
                              className={`${
                                settings.notifications.email ? 'bg-blue-600' : 'bg-gray-200'
                              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                            >
                              <span
                                className={`${
                                  settings.notifications.email ? 'translate-x-5' : 'translate-x-0'
                                } inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                              />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm text-gray-700">Push Notifications</span>
                            <p className="text-xs text-gray-500">Receive real-time updates in your browser</p>
                          </div>
                          <div className="flex items-center">
                            <button
                              type="button"
                              onClick={() => handleToggleChange('notifications', 'push')}
                              className={`${
                                settings.notifications.push ? 'bg-blue-600' : 'bg-gray-200'
                              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                            >
                              <span
                                className={`${
                                  settings.notifications.push ? 'translate-x-5' : 'translate-x-0'
                                } inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                              />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm text-gray-700">SMS Notifications</span>
                            <p className="text-xs text-gray-500">Receive text messages for urgent updates</p>
                          </div>
                          <div className="flex items-center">
                            <button
                              type="button"
                              onClick={() => handleToggleChange('notifications', 'sms')}
                              className={`${
                                settings.notifications.sms ? 'bg-blue-600' : 'bg-gray-200'
                              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                            >
                              <span
                                className={`${
                                  settings.notifications.sms ? 'translate-x-5' : 'translate-x-0'
                                } inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-gray-900 mb-3">Notification Types</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm text-gray-700">Event Reminders</span>
                            <p className="text-xs text-gray-500">Get reminders about upcoming events</p>
                          </div>
                          <div className="flex items-center">
                            <button
                              type="button"
                              onClick={() => handleToggleChange('notifications', 'eventReminders')}
                              className={`${
                                settings.notifications.eventReminders ? 'bg-blue-600' : 'bg-gray-200'
                              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                            >
                              <span
                                className={`${
                                  settings.notifications.eventReminders ? 'translate-x-5' : 'translate-x-0'
                                } inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                              />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm text-gray-700">Vendor Messages</span>
                            <p className="text-xs text-gray-500">Get notified when vendors send you messages</p>
                          </div>
                          <div className="flex items-center">
                            <button
                              type="button"
                              onClick={() => handleToggleChange('notifications', 'vendorMessages')}
                              className={`${
                                settings.notifications.vendorMessages ? 'bg-blue-600' : 'bg-gray-200'
                              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                            >
                              <span
                                className={`${
                                  settings.notifications.vendorMessages ? 'translate-x-5' : 'translate-x-0'
                                } inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                              />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm text-gray-700">Marketing Updates</span>
                            <p className="text-xs text-gray-500">Receive news and promotional offers</p>
                          </div>
                          <div className="flex items-center">
                            <button
                              type="button"
                              onClick={() => handleToggleChange('notifications', 'marketingUpdates')}
                              className={`${
                                settings.notifications.marketingUpdates ? 'bg-blue-600' : 'bg-gray-200'
                              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                            >
                              <span
                                className={`${
                                  settings.notifications.marketingUpdates ? 'translate-x-5' : 'translate-x-0'
                                } inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'privacy' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacy Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="profileVisibility" className="block text-sm font-medium text-gray-700 mb-1">
                        Profile Visibility
                      </label>
                      <select
                        id="profileVisibility"
                        value={settings.privacy.profileVisibility}
                        onChange={(e) => handleInputChange('privacy', 'profileVisibility', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="public">Public - Anyone can view your profile</option>
                        <option value="private">Private - Only you can view your profile</option>
                        <option value="contacts">Contacts Only - Only your contacts can view your profile</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-gray-700">Share Event History</span>
                        <p className="text-xs text-gray-500">Allow vendors to see your past events</p>
                      </div>
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => handleToggleChange('privacy', 'shareEventHistory')}
                          className={`${
                            settings.privacy.shareEventHistory ? 'bg-blue-600' : 'bg-gray-200'
                          } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                        >
                          <span
                            className={`${
                              settings.privacy.shareEventHistory ? 'translate-x-5' : 'translate-x-0'
                            } inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                          />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-gray-700">Data Collection</span>
                        <p className="text-xs text-gray-500">Allow us to collect usage data to improve our services</p>
                      </div>
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => handleToggleChange('privacy', 'allowDataCollection')}
                          className={`${
                            settings.privacy.allowDataCollection ? 'bg-blue-600' : 'bg-gray-200'
                          } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                        >
                          <span
                            className={`${
                              settings.privacy.allowDataCollection ? 'translate-x-5' : 'translate-x-0'
                            } inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                          />
                        </button>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Data Management</h3>
                      <div className="space-y-4">
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                          Download My Data
                        </button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                          Request Data Deletion
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'appearance' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Appearance Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
                        Theme
                      </label>
                      <select
                        id="theme"
                        value={settings.appearance.theme}
                        onChange={(e) => handleInputChange('appearance', 'theme', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System Default</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="density" className="block text-sm font-medium text-gray-700 mb-1">
                        Density
                      </label>
                      <select
                        id="density"
                        value={settings.appearance.density}
                        onChange={(e) => handleInputChange('appearance', 'density', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="comfortable">Comfortable</option>
                        <option value="compact">Compact</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700 mb-1">
                        Font Size
                      </label>
                      <select
                        id="fontSize"
                        value={settings.appearance.fontSize}
                        onChange={(e) => handleInputChange('appearance', 'fontSize', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'billing' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Billing Settings</h2>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Current Plan</h3>
                          <p className="text-sm text-gray-600 mt-1">{settings.billing.plan}</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                          Upgrade
                        </button>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-gray-900 mb-3">Billing Information</h3>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Next Billing Date</span>
                          <p className="mt-1">
                            {settings.billing.nextBillingDate.toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Payment Method</span>
                          <p className="mt-1">{settings.billing.paymentMethod}</p>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-base font-medium text-gray-900 mb-3">Payment Methods</h3>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        Add Payment Method
                      </button>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-base font-medium text-gray-900 mb-3">Billing History</h3>
                      <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Invoice
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                August 15, 2025
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                $49.99
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Paid
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                                <button>Download</button>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                July 15, 2025
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                $49.99
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Paid
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                                <button>Download</button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-4 flex justify-end">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
