import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  test('should generate linked list from values 1', () => {
    const input = ['A', 'B', 'C'];

    const expected = {
      value: 'A',
      next: {
        value: 'B',
        next: {
          value: 'C',
          next: {
            value: null,
            next: null,
          },
        },
      },
    };

    expect(generateLinkedList(input)).toStrictEqual(expected);
  });

  test('should generate linked list from values 2', () => {
    const input = [10, 20, 30, 40];

    expect(generateLinkedList(input)).toMatchSnapshot();
  });
});
