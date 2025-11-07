import {
  BankAccount,
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';
import { random } from 'lodash';

jest.mock('lodash', () => ({
  random: jest.fn(),
}));

const mockRandom = random as jest.Mock;

describe('BankAccount', () => {
  let account: BankAccount;

  beforeEach(() => {
    account = getBankAccount(100);

    mockRandom.mockClear();
    mockRandom.mockImplementation(jest.fn());
  });
  test('should create account with initial balance', () => {
    expect(account.getBalance()).toBe(100);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const withdrawalAmount = 150;

    expect(() => account.withdraw(withdrawalAmount)).toThrow(
      InsufficientFundsError,
    );
    expect(() => account.withdraw(withdrawalAmount)).toThrow(
      'Insufficient funds: cannot withdraw more than 100',
    );
    expect(account.getBalance()).toBe(100);
  });

  test('should throw error when transferring more than balance', () => {
    const receiver = getBankAccount(0);
    const transferAmount = 150;

    expect(() => account.transfer(transferAmount, receiver)).toThrow(
      InsufficientFundsError,
    );
    expect(account.getBalance()).toBe(100);
    expect(receiver.getBalance()).toBe(0);
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => account.transfer(10, account)).toThrow(TransferFailedError);
    expect(() => account.transfer(10, account)).toThrow('Transfer failed');
    expect(account.getBalance()).toBe(100);
  });

  test('should deposit money', () => {
    account.deposit(50);
    expect(account.getBalance()).toBe(150);
  });

  test('should withdraw money', () => {
    account.withdraw(30);
    expect(account.getBalance()).toBe(70);
  });

  test('should transfer money', () => {
    const receiver = getBankAccount(200);
    const amount = 40;

    account.transfer(amount, receiver);

    expect(account.getBalance()).toBe(60);
    expect(receiver.getBalance()).toBe(240);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    mockRandom.mockImplementation((min, max) => {
      if (min === 0 && max === 1) return 1;

      if (min === 0 && max === 100) return 42;
      return 0;
    });

    await expect(account.fetchBalance()).resolves.toBe(42);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const newBalance = 777;
    const fetchBalanceMock = jest
      .fn()
      .mockResolvedValue(newBalance) as jest.Mock<Promise<number | null>, []>;

    account.fetchBalance = fetchBalanceMock;

    await account.synchronizeBalance();

    expect(fetchBalanceMock).toHaveBeenCalled();
    expect(account.getBalance()).toBe(newBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    account.fetchBalance = jest.fn().mockResolvedValue(null) as jest.Mock<
      Promise<number | null>,
      []
    >;

    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );

    expect(account.getBalance()).toBe(100);
  });
});
