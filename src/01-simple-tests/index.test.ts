import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    const input = { a: 5, b: 10, action: Action.Add };
    expect(simpleCalculator(input)).toBe(15);
  });

  test('should subtract two numbers', () => {
    const input = { a: 10, b: 4, action: Action.Subtract };
    expect(simpleCalculator(input)).toBe(6);
  });

  test('should multiply two numbers', () => {
    const input = { a: 7, b: 3, action: Action.Multiply };
    expect(simpleCalculator(input)).toBe(21);
  });

  test('should divide two numbers', () => {
    const input = { a: 20, b: 5, action: Action.Divide };
    expect(simpleCalculator(input)).toBe(4);
  });

  test('should exponentiate two numbers', () => {
    const input = { a: 2, b: 3, action: Action.Exponentiate };
    expect(simpleCalculator(input)).toBe(8);
  });

  test('should return null for invalid action', () => {
    const input = { a: 1, b: 2, action: '%' };
    expect(simpleCalculator(input)).toBeNull();

    const input2 = { a: 1, b: 2, action: null };
    expect(simpleCalculator(input2)).toBeNull();
  });

  test('should return null for invalid arguments', () => {
    const input1 = { a: '5', b: 5, action: Action.Add };
    expect(simpleCalculator(input1)).toBeNull();

    const input2 = { a: 5, b: '5', action: Action.Add };
    expect(simpleCalculator(input2)).toBeNull();

    const input3 = { a: 5, b: null, action: Action.Add };
    expect(simpleCalculator(input3)).toBeNull();
  });
});
