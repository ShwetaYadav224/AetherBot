// Basic test to verify Jest setup works
const sum = (a, b) => a + b;

describe('Basic Test Suite', () => {
  test('should pass basic arithmetic', () => {
    expect(sum(1, 1)).toBe(2);
  });

  test('should handle string operations', () => {
    expect('hello'.toUpperCase()).toBe('HELLO');
  });

  test('should validate array operations', () => {
    const arr = [1, 2, 3];
    expect(arr.length).toBe(3);
    expect(arr).toContain(2);
  });
});