import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function WhatsAppRedirect() {
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    const handleWhatsAppRedirect = async () => {
      const path = window.location.pathname;
      const groupId = path.replace('/ws/', '');
      
      console.log('WhatsApp route detected, group ID:', groupId);
      
      try {
        // Get the group data
        const { data: groupData, error: groupError } = await supabase
          .from('whatsapp_groups')
          .select('*')
          .eq('group_id', groupId)
          .single();

        if (groupError) {
          console.error('Group error:', groupError);
          setDebugInfo(`Group Query Error: ${JSON.stringify(groupError)}`);
          setError(`WhatsApp group not found (${groupError.message})`);
          return;
        }

        if (!groupData) {
          setDebugInfo('No group data found for ID: ' + groupId);
          setError('WhatsApp group not found');
          return;
        }

        // Get all phone numbers for this group
        const { data: numbers, error: numbersError } = await supabase
          .from('whatsapp_numbers')
          .select('country_code, phone_number')
          .eq('group_id', groupData.id);

        if (numbersError) {
          console.error('Numbers error:', numbersError);
          setDebugInfo(`Numbers Query Error: ${JSON.stringify(numbersError)}`);
          setError('Failed to fetch WhatsApp numbers');
          return;
        }

        if (!numbers || numbers.length === 0) {
          setDebugInfo('No numbers found for group ID: ' + groupData.id);
          setError('No WhatsApp numbers found for this group');
          return;
        }

        // Select a random number
        const randomIndex = Math.floor(Math.random() * numbers.length);
        const selectedNumber = numbers[randomIndex];
        
        // Format the WhatsApp URL
        const formattedCountryCode = selectedNumber.country_code.replace('+', '');
        const formattedNumber = selectedNumber.phone_number.replace(/\D/g, '');
        const whatsappUrl = `https://wa.me/${formattedCountryCode}${formattedNumber}`;
        
        window.location.href = whatsappUrl;
      } catch (err) {
        console.error('Redirect error:', err);
        setDebugInfo(`General Error: ${JSON.stringify(err)}`);
        setError('Failed to process redirect');
      }
    };

    handleWhatsAppRedirect();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-red-600 mb-4">{error}</p>
        {debugInfo && (
          <pre className="text-xs text-gray-600 bg-gray-100 p-4 rounded max-w-full overflow-auto">
            {debugInfo}
          </pre>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Redirecting to WhatsApp...</p>
    </div>
  );
}
