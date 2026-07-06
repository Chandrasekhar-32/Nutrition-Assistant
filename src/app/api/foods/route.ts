import sql from '@/app/api/utils/sql';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  try {
    let foods;
    if (q) {
      foods = await sql`
        SELECT * FROM foods 
        WHERE LOWER(name) LIKE LOWER(${'%' + q + '%'})
        LIMIT 20
      `;
    } else {
      foods = await sql`SELECT * FROM foods LIMIT 20`;
    }

    return Response.json(foods);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
