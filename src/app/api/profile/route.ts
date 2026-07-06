import sql from '@/app/api/utils/sql';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const profile = await sql`
      SELECT * FROM profiles WHERE id = ${session.user.id}
    `;

    if (profile.length === 0) {
      // Create profile if it doesn't exist
      const newProfile = await sql`
        INSERT INTO profiles (id, full_name, role)
        VALUES (${session.user.id}, ${session.user.name}, 'client')
        RETURNING *
      `;
      return Response.json(newProfile[0]);
    }

    return Response.json(profile[0]);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { full_name, age, gender, height, current_weight, goal_weight, daily_calorie_goal } = body;

  try {
    const updatedProfile = await sql`
      UPDATE profiles
      SET 
        full_name = ${full_name},
        age = ${age},
        gender = ${gender},
        height = ${height},
        current_weight = ${current_weight},
        goal_weight = ${goal_weight},
        daily_calorie_goal = ${daily_calorie_goal},
        updated_at = NOW()
      WHERE id = ${session.user.id}
      RETURNING *
    `;

    return Response.json(updatedProfile[0]);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
