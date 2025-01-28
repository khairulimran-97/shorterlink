import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function RedirectHandler() {
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    const handleRedirect = async () => {
      const path = window.location.pathname.substring(1);
      const logs: string[] = [`Current path: ${path}`];
      setDebugInfo(logs.join('\n'));
      
      if (!path) {
        logs.push('No path found');
        setDebugInfo(logs.join('\n'));
        return;
      }

      try {
        // Check if it's a WhatsApp route
        if (path.startsWith('ws/')) {
          logs.push('WhatsApp route detected');
          const groupId = path.substring(3);
          logs.push(`Group ID: ${groupId}`);
          setDebugInfo(logs.join('\n'));
          
          // First, get the group data
          const { data: groupData, error: groupError } = await supabase
            .from('whatsapp_groups')
            .select('id')
            .eq('group_id', groupId)
            .single();

          if (groupError) {
            logs.push(`Group error: ${groupError.message}`);
            setDebugInfo(logs.join('\n'));
            setError(`WhatsApp group not found (${groupError.message})`);
            return;
          }

          if (!groupData) {
            logs.push('No group data found');
            setDebugInfo(logs.join('\n'));
            setError('WhatsApp group not found');
            return;
          }

          logs.push(`Found group with ID: ${groupData.id}`);
          setDebugInfo(logs.join('\n'));

          // Then, get all phone numbers for this group
          const { data: numbers, error: numbersError } = await supabase
            .from('whatsapp_numbers')
            .select('country_code, phone_number')
            .eq('group_id', groupData.id);

          if (numbersError) {
            logs.push(`Numbers error: ${numbersError.message}`);
            setDebugInfo(logs.join('\n'));
            setError('Failed to fetch WhatsApp numbers');
            return;
          }

          if (!numbers || numbers.length === 0) {
            logs.push('No numbers found for group');
            setDebugInfo(logs.join('\n'));
            setError('No WhatsApp numbers found for this group');
            return;
          }

          logs.push(`Found ${numbers.length} numbers for group`);
          logs.push('Available numbers:');
          numbers.forEach((n, i) => {
            logs.push(`${i + 1}. ${n.country_code}${n.phone_number}`);
          });
          setDebugInfo(logs.join('\n'));

          // Select a random number
          const randomIndex = Math.floor(Math.random() * numbers.length);
          const selectedNumber = numbers[randomIndex];
          
          logs.push(`Selected number at index ${randomIndex}`);
          logs.push(`Selected: ${selectedNumber.country_code}${selectedNumber.phone_number}`);
          
          // Format the WhatsApp URL
          const formattedCountryCode = selectedNumber.country_code.replace('+', '');
          const formattedNumber = selectedNumber.phone_number.replace(/\D/g, '');
          const whatsappUrl = `https://wa.me/${formattedCountryCode}${formattedNumber}`;
          
          logs.push(`Redirecting to: ${whatsappUrl}`);
          setDebugInfo(logs.join('\n'));
          
          window.location.replace(whatsappUrl);
          return;
        }

        // Handle regular short links
        const { data: linkData, error: linkError } = await supabase
          .from('links')
          .select('original_url')
          .eq('short_id', path)
          .single();

        if (linkError) {
          logs.push(`Link error: ${linkError.message}`);
          setDebugInfo(logs.join('\n'));
          setError('Link not found');
          return;
        }

        if (linkData) {
          logs.push(`Found link: ${linkData.original_url}`);
          let url = linkData.original_url;
          if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
          }
          logs.push(`Redirecting to: ${url}`);
          setDebugInfo(logs.join('\n'));
          window.location.replace(url);
        } else {
          logs.push('No link data found');
          setDebugInfo(logs.join('\n'));
          setError('Link not found');
        }
      } catch (err: any) {
        logs.push(`Error: ${err.message}`);
        setDebugInfo(logs.join('\n'));
        console.error('Redirect error:', err);
        setError('Failed to process redirect');
      }
    };

    handleRedirect();
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
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
        {debugInfo && (
          <pre className="mt-4 text-xs text-gray-600 bg-gray-100 p-4 rounded max-w-full overflow-auto">
            {debugInfo}
          </pre>
        )}
      </div>
    </div>
  );
}
