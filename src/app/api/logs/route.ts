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
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  try {
    const logs = await sql`
      SELECT l.*, f.name as food_name
      FROM daily_logs l
      LEFT JOIN foods f ON l.food_id = f.id
      WHERE l.user_id = ${session.user.id} AND l.log_date = ${date}
      ORDER BY l.created_at ASC
    `;

    return Response.json(logs);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { food_id, quantity_g, meal_type, log_date } = body;

  try {
    // Get nutritional info from foods table
    const food = await sql`SELECT * FROM foods WHERE id = ${food_id}`;
    if (food.length === 0) return Response.json({ error: 'Food not found' }, { status: 404 });

    const f = food[0];
    const multiplier = quantity_g / 100;

    const calories = Math.round(f.calories_per_100g * multiplier);
    const protein = f.protein_per_100g * multiplier;
    const carbs = f.carbs_per_100g * multiplier;
    const fat = f.fat_per_100g * multiplier;

    const newLog = await sql`
      INSERT INTO daily_logs (user_id, food_id, quantity_g, meal_type, log_date, calories, protein, carbs, fat)
      VALUES (${session.user.id}, ${food_id}, ${quantity_g}, ${meal_type}, ${log_date}, ${calories}, ${protein}, ${carbs}, ${fat})
      RETURNING *
    `;

    return Response.json(newLog[0]);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
