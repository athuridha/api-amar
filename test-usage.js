const fetch = require('node-fetch');

async function testUsage() {
    const deviceId = 'debug-device-' + Date.now();

    console.log('Testing with Device ID:', deviceId);

    // 1. First usage (10)
    console.log('\n--- Usage 1: +10 ---');
    const res1 = await fetch('https://api.athuridha.my.id/api/license/use', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, count: 10 })
    });
    const data1 = await res1.json();
    console.log('Response 1:', data1);

    // 2. Second usage (5)
    console.log('\n--- Usage 2: +5 ---');
    const res2 = await fetch('https://api.athuridha.my.id/api/license/use', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, count: 5 })
    });
    const data2 = await res2.json();
    console.log('Response 2:', data2);

    if (data2.used === 15) {
        console.log('\n✅ TEST PASSED: Usage is incrementing correctly (10 + 5 = 15)');
    } else {
        console.log('\n❌ TEST FAILED: Usage did not increment correctly');
    }
}

testUsage();
