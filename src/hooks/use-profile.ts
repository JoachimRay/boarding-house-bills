import { fetchProfile, type Profile } from '@/data/customer';
import { useEffect, useState } from 'react';

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    let live = true;

    fetchProfile()
      .then((row) => {
        if (live) setProfile(row);
      })
      .catch(() => {
        if (live) setProfile(null);
      });

    return () => {
      live = false;
    };
  }, []);

  return profile;
}
