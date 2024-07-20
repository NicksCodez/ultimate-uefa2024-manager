import { capitalizeFirstLetters } from '../StringFunctions';

describe('capitalizeFirstLetters', () => {
  test('capitalizes the first letter of each word in a single word string', () => {
    expect(capitalizeFirstLetters('hello')).toBe('Hello');
  });

  test('capitalizes the first letter of each word in a multi-word string', () => {
    expect(capitalizeFirstLetters('hello world')).toBe('Hello World');
  });

  test('handles empty strings', () => {
    expect(capitalizeFirstLetters('')).toBe('');
  });

  test('handles strings with multiple spaces between words', () => {
    expect(capitalizeFirstLetters('hello    world')).toBe('Hello    World');
  });

  test('handles strings with leading and trailing spaces', () => {
    expect(capitalizeFirstLetters('  hello world  ')).toBe('  Hello World  ');
  });

  test('handles strings with special characters', () => {
    expect(capitalizeFirstLetters('hello-world')).toBe('Hello-world');
  });

  test('handles strings with mixed case', () => {
    expect(capitalizeFirstLetters('hElLo WoRLd')).toBe('HElLo WoRLd');
  });
});
