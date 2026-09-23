import { useSession } from '@clerk/react';
import { useState } from 'react';
import { supabaseClient } from '@/lib/supabase';

const useFetch = (cb, options = {}) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const { session } = useSession();

  const fn = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const supabaseAccessToken = await session.getToken({
        template: 'supabase',
      });
      const supabase = await supabaseClient(supabaseAccessToken);
      const response = await cb(supabase, options, ...args);
      setData(response.data);
      setError(null);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn };
};

export default useFetch;
