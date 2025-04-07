import SingleDog from '@/app/components/SingleDog';
import { getDog, getActivity } from '@/app/core/dogApi';
import { getNotes } from '@/app/core/notes';
import { Suspense } from 'react';
import Loading from '@/app/components/Loading';

const SingleDogContainer = async ({ params }) => {
  const dog = await getDog(params.slug);
  const activityHistory = await getActivity(params.slug);
  const notes = await getNotes(params.slug);

  return (
    <Suspense fallback={Loading}>
      <SingleDog
        dogId={params.slug}
        dog={dog}
        activityHistory={activityHistory}
        notes={notes.notes}
      />
    </Suspense>
  );
};

export default SingleDogContainer;
