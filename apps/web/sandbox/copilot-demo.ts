// Minimal Copilot demo — self-contained & runnable with ts-node

function add(a: number, b: number): number {
  return a + b;
}

function isPalindrome(str: string): boolean {
  return str === str.split('').reverse().join('');
}

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

// Quick sanity logs so you see output
console.log('add(2, 3) =', add(2, 3));
console.log('isPalindrome("racecar") =', isPalindrome('racecar'));

fetchJson('https://jsonplaceholder.typicode.com/todos/1')
  .then((data: unknown) => console.log('Sample JSON:', data))
  .catch((err: unknown) => console.error('Error:', err));
