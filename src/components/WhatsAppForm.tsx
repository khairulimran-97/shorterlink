import { useState } from 'react';
import { MessageSquare, Copy, ExternalLink } from 'lucide-react';
import { countryCodes } from '../data/countryCodes';

export default function WhatsAppForm() {
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+60');
  const [message, setMessage] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  const formatPhoneNumber = (phoneNumber: string, dialCode: string) => {
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    
    if (dialCode === '+60' && cleanNumber.startsWith('0')) {
      return cleanNumber.slice(1);
    } else if (dialCode === '+62' && cleanNumber.startsWith('0')) {
      return cleanNumber.slice(1);
    } else if (dialCode === '+66' && cleanNumber.startsWith('0')) {
      return cleanNumber.slice(1);
    } else if (dialCode === '+44' && cleanNumber.startsWith('0')) {
      return cleanNumber.slice(1);
    }
    
    return cleanNumber;
  };

  const generateLink = () => {
    const formattedPhone = formatPhoneNumber(phone, countryCode);
    const dialCode = countryCode.replace('+', '');
    const fullPhone = dialCode + formattedPhone;
    const link = `https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`;
    setGeneratedLink(link);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <select
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          className="w-full sm:w-40 px-3 py-2 border rounded-lg bg-white text-sm sm:text-base"
        >
          {countryCodes.map((country) => (
            <option key={country.code} value={country.dial_code}>
              {country.name} ({country.dial_code})
            </option>
          ))}
        </select>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-lg text-sm sm:text-base"
          placeholder="Phone number"
        />
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg h-24 text-sm sm:text-base"
        placeholder="Enter your message..."
      />

      <button
        onClick={generateLink}
        className="w-full px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 text-sm sm:text-base"
      >
        <MessageSquare className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2" />
        Generate WhatsApp Link
      </button>

      {generatedLink && (
        <div className="p-3 sm:p-4 border rounded-lg">
          <div className="flex items-center justify-between gap-2">
            <input
              type="text"
              value={generatedLink}
              readOnly
              className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-xs sm:text-sm"
            />
            <button
              onClick={copyToClipboard}
              className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-800"
            >
              <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <a
              href={generatedLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-800"
            >
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          </div>

          <div className="mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2 text-sm sm:text-base">Preview:</h3>
            <div className="whitespace-pre-wrap text-sm sm:text-base">{message}</div>
          </div>
        </div>
      )}
    </div>
  );
}
