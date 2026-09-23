/**
 * Test Moder8r.app Integration
 * Run: node backend/utils/testModer8r.js
 */

import dotenv from 'dotenv';
import { moderateContent } from './moder8rIntegration.js';

dotenv.config();

async function testModeration() {
  console.log('🧪 Testing Moder8r.app Integration (OpenAI + GPT-4 powered)\n');
  console.log('API Key:', process.env.MODER8R_API_KEY ? '✅ Found' : '❌ Missing');
  console.log('');

  const testCases = [
    { text: 'Great post! I love this community.', expected: 'PASS' },
    { text: 'This is a bad idea', expected: 'PASS' },
    { text: 'Freaking good man', expected: 'PASS' },
    { text: "You're an idiot", expected: 'PASS' },
    { text: 'This is fucking stupid', expected: 'PASS' },
    { text: "I'm going to hurt you", expected: 'BLOCK' },
    { text: 'Kill yourself you worthless piece of shit', expected: 'BLOCK' },
  ];

  for (const testCase of testCases) {
    console.log('─'.repeat(60));
    console.log(`📝 Testing: "${testCase.text}"`);
    console.log(`Expected: ${testCase.expected}`);
    console.log('');

    try {
      const result = await moderateContent(testCase.text);
      
      console.log('Result:', {
        flagged: result.flagged,
        categories: result.categories,
        scores: result.scores,
        error: result.error
      });

      const actual = result.flagged ? 'BLOCK' : 'PASS';
      const status = actual === testCase.expected ? '✅ CORRECT' : '⚠️ UNEXPECTED';
      
      console.log(`\n${status} - AI returned: ${actual}\n`);
    } catch (error) {
      console.error('❌ Test failed:', error.message);
    }

    // Wait 1 second between requests to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('─'.repeat(60));
  console.log('✅ All tests completed!');
  console.log('\n📊 Custom Thresholds:');
  console.log('- Violence > 0.85 → BLOCK');
  console.log('- Self-harm > 0.8 → BLOCK');
  console.log('- Harassment > 0.95 → BLOCK');
  console.log('- Hate > 0.9 → BLOCK');
  console.log('- Profanity → ALLOW (casual swearing allowed)');
  console.log('\n✅ This allows free expression while blocking serious harm!');
}

testModeration();
