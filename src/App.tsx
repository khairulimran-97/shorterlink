import { useState } from 'react';
import URLShortener from './components/URLShortener';
import WhatsAppForm from './components/WhatsAppForm';
import RotateWhatsApp from './components/RotateWhatsApp';

export default function App() {
  const [activeTab, setActiveTab] = useState<'url' | 'whatsapp' | 'rotate'>('url');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-2xl mx-auto p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">Link Shortener</h1>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
          <div className="flex flex-col sm:flex-row gap-2 sm:space-x-1 mb-6">
            <button
              onClick={() => setActiveTab('url')}
              className={`py-2 px-4 rounded-lg ${
                activeTab === 'url'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              URL Shortener
            </button>
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`py-2 px-4 rounded-lg ${
                activeTab === 'whatsapp'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              WhatsApp Link
            </button>
            <button
              onClick={() => setActiveTab('rotate')}
              className={`py-2 px-4 rounded-lg ${
                activeTab === 'rotate'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Rotate WhatsApp
            </button>
          </div>

          {activeTab === 'url' && <URLShortener />}
          {activeTab === 'whatsapp' && <WhatsAppForm />}
          {activeTab === 'rotate' && <RotateWhatsApp />}
        </div>
      </div>
    </div>
  );
}
