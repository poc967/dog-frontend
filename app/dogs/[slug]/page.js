'use server';

import SingleDog from '@/app/components/SingleDog';

async function getDog(params) {
  'use server';
  const res = await fetch(`http://localhost:8080/dog/${params.slug}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

async function getActivity(params) {
  const res = await fetch(`http://localhost:8080/activity/${params.slug}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

const SingleDogContainer = async ({ params }) => {
  let data = await getDog(params);
  let activityData = await getActivity(params);
  data['dog']['activity_history'] = activityData.message;
  return <SingleDog dog={data} getDog={getDog} />;
};

export default SingleDogContainer;
