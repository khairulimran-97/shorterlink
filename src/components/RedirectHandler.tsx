import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function RedirectHandler() {
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    const handleRedirect = async () => {
      const path = window.location.pathname.substring(1); // Remove leading slash
      console.log('Current path:', path);
      
      if (!path) {
        console.log('No path found');
        return;
      }

      try {
        // Check if it's a WhatsApp route
        if (path.startsWith('ws/')) {
          console.log('WhatsApp route detected');
          const groupId = path.substring(3); // Remove 'ws/' prefix
          console.log('Group ID:', groupId);
          
          // First, get the group data
          const groupQuery = supabase
            .from('whatsapp_groups')
            .select('*')
            .eq('group_id', groupId)
            .single();
          
          console.log('Executing group query:', groupQuery);
          const { data: groupData, error: groupError } = await groupQuery;

          if (groupError) {
            console.error('Group error:', groupError);
            setDebugInfo(`Group Query Error: ${JSON.stringify(groupError)}`);
            setError(`WhatsApp group not found (${groupError.message})`);
            return;
          }

          console.log('Group data:', groupData);

          if (!groupData) {
            console.log('No group data found');
            setDebugInfo('No group data found for ID: ' + groupId);
            setError('WhatsApp group not found');
            return;
          }

          // Then, get all phone numbers for this group
          const numbersQuery = supabase
            .from('whatsapp_numbers')
            .select('country_code, phone_number')
            .eq('group_id', groupData.id);

          console.log('Executing numbers query');
          const { data: numbers, error: numbersError } = await numbersQuery;

          if (numbersError) {
            console.error('Numbers error:', numbersError);
            setDebugInfo(`Numbers Query Error: ${JSON.stringify(numbersError)}`);
            setError('Failed to fetch WhatsApp numbers');
            return;
          }

          console.log('Numbers data:', numbers);

          if (!numbers || numbers.length === 0) {
            console.log('No numbers found');
            setDebugInfo('No numbers found for group ID: ' + groupData.id);
            setError('No WhatsApp numbers found for this group');
            return;
          }

          // Select a random number
          const randomIndex = Math.floor(Math.random() * numbers.length);
          const selectedNumber = numbers[randomIndex];
          console.log('Selected number:', selectedNumber);
          
          // Format the WhatsApp URL
          const formattedCountryCode = selectedNumber.country_code.replace('+', '');
          const formattedNumber = selectedNumber.phone_number.replace(/\D/g, '');
          const whatsappUrl = `https://wa.me/${formattedCountryCode}${formattedNumber}`;
          
          console.log('Redirecting to:', whatsappUrl);
          window.location.href = whatsappUrl;
          return;
        }

        // Handle regular short links
        console.log('Regular link redirect');
        const { data: linkData, error: linkError } = await supabase
          .from('links')
          .select('original_url')
          .eq('short_id', path)
          .single();

        if (linkError) {
          console.error('Link error:', linkError);
          setDebugInfo(`Link Query Error: ${JSON.stringify(linkError)}`);
          setError('Link not found');
          return;
        }

        if (linkData) {
          console.log('Redirecting to:', linkData.original_url);
          window.location.href = linkData.original_url;
        } else {
          console.log('No link data found');
          setError('Link not found');
        }
      } catch (err) {
        console.error('Redirect error:', err);
        setDebugInfo(`General Error: ${JSON.stringify(err)}`);
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
      <p className="text-gray-600">Redirecting...</p>
    </div>
  );
}
