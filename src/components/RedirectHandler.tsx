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
          
          // First, get the group data
          const { data: groupData, error: groupError } = await supabase
            .from('whatsapp_groups')
            .select('*')
            .eq('group_id', groupId)
            .single();

          if (groupError) {
            console.error('Group error:', groupError);
            setError('WhatsApp group not found');
            return;
          }

          if (!groupData) {
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
          
          // Redirect to WhatsApp
          window.location.href = whatsappUrl;
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
