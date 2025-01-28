import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function RedirectHandler() {
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    const handleRedirect = async () => {
      const path = window.location.pathname.substring(1);
      console.log('Processing path:', path);
      const logs: string[] = [`Current path: ${path}`];
      
      if (!path) {
        setError('No path found');
        return;
      }

      try {
        if (path.startsWith('ws/')) {
          const groupId = path.substring(3);
          console.log('WhatsApp groupId:', groupId);
          logs.push(`Processing WhatsApp group: ${groupId}`);
          
          const { data: groups, error: groupError } = await supabase
            .from('whatsapp_groups')
            .select('*')
            .eq('group_id', groupId);

          console.log('Groups query result:', { groups, groupError });
          logs.push(`Groups query result: ${JSON.stringify(groups)}`);

          if (groupError) {
            throw new Error(`Group query failed: ${groupError.message}`);
          }

          if (!groups || groups.length === 0) {
            throw new Error('WhatsApp group not found');
          }

          const group = groups[0];
          console.log('Found group:', group);
          logs.push(`Found group: ${JSON.stringify(group)}`);

          const { data: numbers, error: numbersError } = await supabase
            .from('whatsapp_numbers')
            .select('*')
            .eq('group_id', group.id);

          console.log('Numbers query result:', { numbers, numbersError });
          logs.push(`Numbers query result: ${JSON.stringify(numbers)}`);

          if (numbersError) {
            throw new Error(`Numbers query failed: ${numbersError.message}`);
          }

          if (!numbers || numbers.length === 0) {
            throw new Error('No WhatsApp numbers found for this group');
          }

          const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
          console.log('Selected number:', randomNumber);
          logs.push(`Selected number: ${JSON.stringify(randomNumber)}`);

          const formattedNumber = `${randomNumber.country_code}${randomNumber.phone_number}`.replace(/\D/g, '');
          const whatsappUrl = `https://wa.me/${formattedNumber}`;
          
          console.log('Redirecting to:', whatsappUrl);
          logs.push(`Redirecting to: ${whatsappUrl}`);
          setDebugInfo(logs.join('\n'));
          
          window.location.href = whatsappUrl;
          return;
        }

        // Handle regular short links
        const { data: link, error: linkError } = await supabase
          .from('links')
          .select('original_url')
          .eq('short_id', path)
          .single();

        if (linkError) {
          throw new Error('Link not found');
        }

        if (!link) {
          throw new Error('Invalid link');
        }

        let url = link.original_url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'https://' + url;
        }

        window.location.href = url;
      } catch (err: any) {
        console.error('Redirect error:', err);
        logs.push(`Error: ${err.message}`);
        setDebugInfo(logs.join('\n'));
        setError(err.message || 'Failed to process redirect');
      }
    };

    handleRedirect();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-red-600 mb-4">{error}</p>
        <pre className="text-xs text-gray-600 bg-gray-100 p-4 rounded max-w-full overflow-auto">
          {debugInfo}
        </pre>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <p className="mt-4 text-gray-600">Redirecting...</p>
      <pre className="mt-4 text-xs text-gray-600 bg-gray-100 p-4 rounded max-w-full overflow-auto">
        {debugInfo}
      </pre>
    </div>
  );
}
