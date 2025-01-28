import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function RedirectHandler() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleRedirect = async () => {
      const path = window.location.pathname.substring(1); // Remove leading slash
      if (!path) return;

      try {
        // Check if it's a WhatsApp route
        if (path.startsWith('ws/')) {
          const groupId = path.substring(3); // Remove 'ws/' prefix
          const { data: groupData, error: groupError } = await supabase
            .from('whatsapp_groups')
            .select('id')
            .eq('group_id', groupId)
            .single();

          if (groupError) throw groupError;

          if (groupData) {
            const { data: numbers, error: numbersError } = await supabase
              .from('whatsapp_numbers')
              .select('country_code, phone_number')
              .eq('group_id', groupData.id);

            if (numbersError) throw numbersError;

            if (numbers && numbers.length > 0) {
              const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
              const whatsappUrl = `https://wa.me/${randomNumber.country_code.replace('+', '')}${randomNumber.phone_number}`;
              window.location.href = whatsappUrl;
              return;
            }
          }
          setError('WhatsApp group not found');
          return;
        }

        // Handle regular short links
        const { data: linkData, error: linkError } = await supabase
          .from('links')
          .select('original_url')
          .eq('short_id', path)
          .single();

        if (linkError) throw linkError;

        if (linkData) {
          window.location.href = linkData.original_url;
        } else {
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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Redirecting...</p>
    </div>
  );
}
