import { generateScript } from './src/lib/api.js';
import { getKeys } from './src/lib/api.js';

// Mock localStorage for getKeys
global.localStorage = {
  getItem: () => 'fake-key'
};

try {
  await generateScript('Trains', 'English', 'video', '5-10 minutes', 'Tutorial');
} catch (e) {
  console.log("ERROR TYPE:", e.name);
  console.log("ERROR MESSAGE:", e.message);
  console.log("STACK:", e.stack);
}
