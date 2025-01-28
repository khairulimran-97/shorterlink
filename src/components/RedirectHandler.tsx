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
          const { data: groupData, error: groupError } = await supabase
            .from('whatsapp_groups')
            .select('id')
            .eq('group_id', groupId)
            .single();

          if (groupError) {
            console.error('Group error:', groupError);
            setError(`WhatsApp group not found (${groupError.message})`);
            return;
          }

          if (!groupData) {
            console.log('No group data found');
            setError('WhatsApp group not found');
            return;
          }

          // Then, get all phone numbers for this group
          const { data: numbers, error: numbersError } = await supabase
            .from('whatsapp_numbers')
            .select('country_code, phone_number')
            .eq('group_id', groupData.id);

          if (numbersError) {
            console.error('Numbers error:', numbersError);
            setError('Failed to fetch WhatsApp numbers');
            return;
          }

          if (!numbers || numbers.length === 0) {
            console.log('No numbers found');
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
          
          console.log('Redirecting to:', whatsappUrl);
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
          console.error('Link error:', linkError);
          setError('Link not found');
          return;
        }

        if (linkData) {
          console.log('Redirecting to:', linkData.original_url);
          let url = linkData.original_url;
          if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
          }
          window.location.replace(url);
        } else {
          console.log('No link data found');
          setError('Link not found');
        }
      } catch (err) {
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
      </div>
    </div>
  );
}
