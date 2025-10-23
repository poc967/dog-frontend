'use client';

import { useState, useEffect } from 'react';
import SingleDog from '@/app/components/SingleDog';
import { getDog, getActivity } from '@/app/api/dog';
import { getNotes } from '@/app/api/notes';
import Loading from '@/app/components/Loading';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';

const SingleDogContainer = ({ params }) => {
  const { hasRole, token } = useAuth();
  const [dog, setDog] = useState(null);
  const [activityHistory, setActivityHistory] = useState(null);
  const [notes, setNotes] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return; // Wait for token to be available

      try {
        setLoading(true);
        const [dogData, activityData, notesData] = await Promise.all([
          getDog(params.slug, token),
          getActivity(params.slug, token),
          getNotes(params.slug, token),
        ]);

        setDog(dogData);
        setActivityHistory(activityData);
        setNotes(notesData.notes);
      } catch (error) {
        console.error('Error fetching dog data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.slug, token]);

  if (loading || !dog) {
    return <Loading />;
  }

  return (
    <SingleDog
      dogId={params.slug}
      dog={dog}
      activityHistory={activityHistory}
      notes={notes}
      token={token}
    />
  );
};

const SingleDogPage = ({ params }) => {
  return (
    <ProtectedRoute requiredRole="volunteer">
      <SingleDogContainer params={params} />
    </ProtectedRoute>
  );
};

export default SingleDogPage;
