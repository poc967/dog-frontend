'use server';

export async function getNotes(slug) {
  const res = await fetch(
    `https://still-garden-24228-4efab39a388a.herokuapp.com/note/${slug}`,
    {
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export async function createNote(text, dogs) {
  let body = {
    dogs,
    text: text,
  };
  const res = await fetch(
    'https://still-garden-24228-4efab39a388a.herokuapp.com/note/new',
    {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}
