import { simpleCalculator, Action } from './index';

const validTestCases = [
  {
    a: 1,
    b: 2,
    action: Action.Add,
    expected: 3,
    description: 'positive numbers',
  },
  {
    a: -1,
    b: 5,
    action: Action.Add,
    expected: 4,
    description: 'with negative number',
  },
  {
    a: 10.5,
    b: 0.5,
    action: Action.Add,
    expected: 11,
    description: 'with decimals',
  },

  {
    a: 10,
    b: 4,
    action: Action.Subtract,
    expected: 6,
    description: 'positive result',
  },
  {
    a: 5,
    b: 10,
    action: Action.Subtract,
    expected: -5,
    description: 'negative result',
  },
  {
    a: 10,
    b: -5,
    action: Action.Subtract,
    expected: 15,
    description: 'subtracting a negative',
  },

  {
    a: 7,
    b: 3,
    action: Action.Multiply,
    expected: 21,
    description: 'positive multiplication',
  },
  {
    a: 2,
    b: -3,
    action: Action.Multiply,
    expected: -6,
    description: 'multiplication with negative',
  },
  {
    a: 100,
    b: 0,
    action: Action.Multiply,
    expected: 0,
    description: 'multiplication by zero',
  },

  {
    a: 20,
    b: 5,
    action: Action.Divide,
    expected: 4,
    description: 'integer division',
  },
  {
    a: 1,
    b: 2,
    action: Action.Divide,
    expected: 0.5,
    description: 'decimal result',
  },
  {
    a: 10,
    b: 0,
    action: Action.Divide,
    expected: Infinity,
    description: 'division by zero (Infinity)',
  },

  {
    a: 2,
    b: 3,
    action: Action.Exponentiate,
    expected: 8,
    description: 'positive base and exponent',
  },
  {
    a: 5,
    b: 0,
    action: Action.Exponentiate,
    expected: 1,
    description: 'exponent of zero',
  },
  {
    a: 9,
    b: 0.5,
    action: Action.Exponentiate,
    expected: 3,
    description: 'fractional exponent (square root)',
  },
];

const invalidTestCases = [
  { a: 1, b: 2, action: 'INVALID_OP', description: 'invalid action string' },
  { a: 1, b: 2, action: null, description: 'null action' },
  { a: 1, b: 2, action: 999, description: 'invalid action number' },

  { a: '5', b: 5, action: Action.Add, description: 'A is string' },
  { a: true, b: 5, action: Action.Add, description: 'A is boolean' },
  {
    a: undefined,
    b: 5,
    action: Action.Add,
    description: 'A is undefined/missing',
  },
  { a: null, b: 5, action: Action.Add, description: 'A is null' },

  { a: 5, b: '5', action: Action.Subtract, description: 'B is string' },
  { a: 5, b: false, action: Action.Subtract, description: 'B is boolean' },
  {
    a: 5,
    b: undefined,
    action: Action.Subtract,
    description: 'B is undefined/missing',
  },
  { a: 5, b: null, action: Action.Subtract, description: 'B is null' },
];

describe('simpleCalculator table tests', () => {
  test.each(validTestCases)(
    'should correctly calculate $a $action $b = $expected ($description)',
    ({ a, b, action, expected }) => {
      const input = { a, b, action };
      expect(simpleCalculator(input)).toBe(expected);
    },
  );

  test.each(invalidTestCases)(
    'should return null for invalid input where $description',
    ({ a, b, action }) => {
      const input = { a, b, action };
      expect(simpleCalculator(input)).toBeNull();
    },
  );
});
