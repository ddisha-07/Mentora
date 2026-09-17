async function verifyEndpoints() {
  const endpoints = [
    { url: 'http://localhost:3000/api/blogs', name: 'GET /api/blogs' },
    { url: 'http://localhost:3000/api/leaderboard', name: 'GET /api/leaderboard' },
    { url: 'http://localhost:3000/api/quizzes/00000000-0000-0000-0000-000000000001', name: 'GET /api/quizzes/[id]' },
    { url: 'http://localhost:3000/api/journeys/active/roadmap', name: 'GET /api/journeys/active/roadmap' },
  ];

  console.log('Testing live Next.js API endpoints powered by Firebase Firestore...\n');

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url);
      const data = await res.json();
      console.log(`[${res.status}] ${ep.name}`);
      if (ep.url.includes('/blogs')) {
        console.log(` -> Returned ${data.data?.length} blogs, total: ${data.total}`);
      } else if (ep.url.includes('/leaderboard')) {
        console.log(` -> Returned ${data.leaderboard?.length} leaderboard entries, top user: ${data.leaderboard?.[0]?.name} (${data.leaderboard?.[0]?.totalPoints} pts)`);
      } else if (ep.url.includes('/quizzes')) {
        console.log(` -> Returned quiz: "${data.title}", questions: ${data.questions?.length}`);
      } else if (ep.url.includes('/roadmap')) {
        console.log(` -> Returned journey: "${data.journey?.title}", levels: ${data.levels?.length}, total modules: ${data.journey?.totalModules}`);
      }
    } catch (e) {
      console.error(`Failed to fetch ${ep.name}:`, e.message);
    }
    console.log('');
  }
}

verifyEndpoints();
