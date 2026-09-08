import { db } from '@/db';
import { courses } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const DEMO_JOURNEY_ID = '00000000-0000-0000-0000-000000000001';

export async function ensureDemoJourney() {
  const [existing] = await db
    .select()
    .from(courses)
    .where(eq(courses.id, DEMO_JOURNEY_ID))
    .limit(1);

  return existing || null;
}
