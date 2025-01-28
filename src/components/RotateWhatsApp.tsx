import { useState } from 'react';
import { Plus, Trash2, Link as LinkIcon, Copy, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { countryCodes } from '../data/countryCodes';

interface PhoneNumber {
  countryCode: string;
  number: string;
}

export default function RotateWhatsApp() {
  const [groupName, setGroupName] = useState('');
  const [shortId, setShortId] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([{ countryCode: '+60', number: '' }]);
  const [generatedLink, setGeneratedLink] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const addPhoneNumber = () => {
    setPhoneNumbers([...phoneNumbers, { countryCode: '+60', number: '' }]);
  };

  const removePhoneNumber = (index: number) => {
    setPhoneNumbers(phoneNumbers.filter((_, i) => i !== index));
  };

  const updatePhoneNumber = (index: number, field: keyof PhoneNumber, value: string) => {
    const newNumbers = [...phoneNumbers];
    newNumbers[index] = { ...newNumbers[index], [field]: value };
    setPhoneNumbers(newNumbers);
  };

  const formatPhoneNumber = (phoneNumber: string, dialCode: string) => {
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    return cleanNumber.startsWith('0') ? cleanNumber.slice(1) : cleanNumber;
  };

  const ensureTablesExist = async () => {
    const { error: checkError } = await supabase
      .from('whatsapp_groups')
      .select('id')
      .limit(1);

    if (checkError && checkError.code === '42P01') {
      // Tables don't exist, create them
      const createGroupsTable = `
        create table if not exists public.whatsapp_groups (
          id uuid default gen_random_uuid() primary key,
          group_id text not null unique,
          name text not null,
          created_at timestamp with time zone default timezone('utc'::text, now()) not null
        );
      `;

      const createNumbersTable = `
        create table if not exists public.whatsapp_numbers (
          id uuid default gen_random_uuid() primary key,
          group_id uuid references whatsapp_groups(id) on delete cascade,
          phone_number text not null,
          country_code text not null,
          created_at timestamp with time zone default timezone('utc'::text, now()) not null
        );
      `;

      const createIndexes = `
        create index if not exists whatsapp_groups_group_id_idx on public.whatsapp_groups(group_id);
        create index if not exists whatsapp_numbers_group_id_idx on public.whatsapp_numbers(group_id);
      `;

      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: createGroupsTable + createNumbersTable + createIndexes
      });

      if (createError) throw createError;
    }
  };

  const generateLink = async () => {
    if (!groupName.trim() || !shortId.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (phoneNumbers.some(p => !p.number.trim())) {
      setError('Please fill in all phone numbers');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Ensure tables exist
      await ensureTablesExist();

      // Create WhatsApp group
      const { data: groupData, error: groupError } = await supabase
        .from('whatsapp_groups')
        .insert([
          { group_id: shortId, name: groupName }
        ])
        .select()
        .single();

      if (groupError) throw groupError;

      // Add phone numbers
      const phoneNumbersToInsert = phoneNumbers.map(p => ({
        group_id: groupData.id,
        phone_number: formatPhoneNumber(p.number, p.countryCode),
        country_code: p.countryCode
      }));

      const { error: numbersError } = await supabase
        .from('whatsapp_numbers')
        .insert(phoneNumbersToInsert);

      if (numbersError) throw numbersError;

      const baseUrl = window.location.origin;
      setGeneratedLink(`${baseUrl}/${shortId}`);
      
      // Reset form
      setGroupName('');
      setShortId('');
      setPhoneNumbers([{ countryCode: '+60', number: '' }]);
    } catch (err) {
      setError('Failed to create WhatsApp group. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="Group Name"
        />

        <input
          type="text"
          value={shortId}
          onChange={(e) => setShortId(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="Custom Short ID (e.g., teamsale)"
        />

        <div className="space-y-3">
          {phoneNumbers.map((phone, index) => (
            <div key={index} className="flex gap-2">
              <select
                value={phone.countryCode}
                onChange={(e) => updatePhoneNumber(index, 'countryCode', e.target.value)}
                className="w-40 px-3 py-2 border rounded-lg bg-white"
              >
                {countryCodes.map((country) => (
                  <option key={country.code} value={country.dial_code}>
                    {country.name} ({country.dial_code})
                  </option>
                ))}
              </select>
              <input
                type="tel"
                value={phone.number}
                onChange={(e) => updatePhoneNumber(index, 'number', e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg"
                placeholder="Phone number"
              />
              {phoneNumbers.length > 1 && (
                <button
                  onClick={() => removePhoneNumber(index)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={addPhoneNumber}
          className="w-full px-4 py-2 text-gray-600 border border-dashed rounded-lg hover:border-gray-400"
        >
          <Plus className="inline-block w-5 h-5 mr-2" />
          Add Another Number
        </button>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          onClick={generateLink}
          disabled={loading}
          className="w-full px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 disabled:bg-green-300"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            </span>
          ) : (
            <>
              <LinkIcon className="inline-block w-5 h-5 mr-2" />
              Generate Rotating WhatsApp Link
            </>
          )}
        </button>

        {generatedLink && (
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between gap-2">
              <input
                type="text"
                value={generatedLink}
                readOnly
                className="flex-1 px-3 py-2 bg-gray-50 rounded-lg"
              />
              <button
                onClick={copyToClipboard}
                className="p-2 text-gray-600 hover:text-gray-800"
              >
                <Copy className="w-5 h-5" />
              </button>
              <a
                href={generatedLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-gray-800"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
