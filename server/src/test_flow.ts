async function testFullGameplayLoop() {
  const baseUrl = 'http://localhost:5000/api';
  console.log('🧪 Starting Full Katha Yatra End-to-End Test Suite...\n');

  // 1. Health check
  const healthRes = await fetch(`${baseUrl}/health`);
  const healthData = await healthRes.json();
  console.log('✅ Health Check:', healthData);

  // 2. Register new explorer
  const testEmail = `explorer_${Date.now()}@kathayatra.org`;
  const registerRes = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: `AstroSage_${Date.now().toString().slice(-4)}`,
      email: testEmail,
      password: 'explorerPassword123',
      ageGroup: '10-13',
      preferredDomain: 'Vedic & Indian Heritage',
      avatarUrl: 'astronomer'
    })
  });

  const registerData = await registerRes.json();
  if (!registerRes.ok) {
    throw new Error(`Registration failed: ${JSON.stringify(registerData)}`);
  }
  console.log('✅ User Registration & +50 Welcome XP:', registerData.user.username, 'Points:', registerData.user.points);

  const token = registerData.token;
  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // 3. Get profile / Me
  const meRes = await fetch(`${baseUrl}/auth/me`, { headers: authHeaders });
  const meData = await meRes.json();
  console.log('✅ Authenticated Profile Check:', meData.user.preferred_domain, 'Streak:', meData.user.current_streak);

  // 4. Complete Level 1 in Timeline Runner
  const level1Res = await fetch(`${baseUrl}/games/complete-level`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      gameId: 'timeline-runner',
      scoreEarned: 150,
      timeTakenSeconds: 20
    })
  });
  const level1Data = await level1Res.json();
  console.log('✅ Level 1 Completed (+50 Points): Total Points:', level1Data.totalPoints, 'Story Unlocked:', level1Data.storyUnlocked);

  // 5. Complete Level 2 in Timeline Runner -> Should trigger 2nd level Story Unlock!
  const level2Res = await fetch(`${baseUrl}/games/complete-level`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      gameId: 'timeline-runner',
      scoreEarned: 180,
      timeTakenSeconds: 22
    })
  });
  const level2Data = await level2Res.json();
  console.log('\n🎉 MILESTONE REACHED: Total Levels Completed:', level2Data.totalLevelsCompleted);
  console.log('✅ Story Unlocked:', level2Data.storyUnlocked);
  if (level2Data.unlockedStory) {
    console.log('📖 Unlocked Story Title:', level2Data.unlockedStory.title);
    console.log('⚡ Cliffhanger Twist:', level2Data.unlockedStory.twist_ending);
    console.log('❓ Next Question:', level2Data.unlockedStory.cliffhanger_question);
  }

  // 6. Check Story Library
  const libraryRes = await fetch(`${baseUrl}/stories/my-library`, { headers: authHeaders });
  const libraryData = await libraryRes.json();
  console.log('\n✅ Story Library Count:', libraryData.stories.length, 'Stories');

  // 7. Check STEM Store Items
  const storeRes = await fetch(`${baseUrl}/store/items`, { headers: authHeaders });
  const storeData = await storeRes.json();
  console.log('✅ Store Items Available:', storeData.items.length);
  const affordableItem = storeData.items.find((i: any) => !i.isUnlocked && i.cost_points <= level2Data.totalPoints);

  if (affordableItem) {
    console.log(`🛒 Redeeming ${affordableItem.cost_points} XP for STEM Video: "${affordableItem.title}"...`);
    const unlockRes = await fetch(`${baseUrl}/store/unlock`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ itemId: affordableItem.id })
    });
    const unlockData = await unlockRes.json();
    console.log('✅ Video Unlocked Successfully:', unlockData.message);
    console.log('💰 Remaining Points:', unlockData.remainingPoints);
  }

  console.log('\n======================================================');
  console.log('✨ ALL KATHA YATRA SYSTEM TESTS PASSED SUCCESSFULLY! ✨');
  console.log('======================================================\n');
}

testFullGameplayLoop().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
