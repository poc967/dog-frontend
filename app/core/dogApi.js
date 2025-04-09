'use server';

export async function getDog(slug) {
  const res = await fetch(`http://localhost:8080/dog/${slug}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export async function getActivity(slug) {
  const res = await fetch(`http://localhost:8080/activity/${slug}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export async function createAlert(dogId, alert, category, tab) {
  const body = {
    data: alert,
    priority: category,
  };
  const res = await fetch(
    `http://localhost:8080/dog/${dogId}/${tab.toLowerCase()}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    throw new Error('Failed to POST data');
  }

  return res.json();
}
