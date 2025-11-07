import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

jest.mock('fs');
jest.mock('fs/promises');
jest.mock('path');

const mockedExistsSync = jest.mocked(existsSync);
const mockedReadFile = jest.mocked(readFile);
const mockedJoin = jest.mocked(join);

describe('doStuffByTimeout', () => {
  let mockCallback: jest.Mock;
  let setTimeoutSpy: jest.SpyInstance;

  beforeAll(() => {
    jest.useFakeTimers();
    setTimeoutSpy = jest.spyOn(global, 'setTimeout');
  });

  beforeEach(() => {
    mockCallback = jest.fn();
    setTimeoutSpy.mockClear();
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
    setTimeoutSpy.mockRestore();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    jest.spyOn(global, 'setTimeout');
    doStuffByTimeout(callback, 5);
    expect(setTimeout).toHaveBeenCalledWith(callback, 5);
  });

  test('should call callback only after timeout', () => {
    const timeout = 1000;
    doStuffByTimeout(mockCallback, timeout);

    expect(mockCallback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(timeout - 1);
    expect(mockCallback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  let mockCallback: jest.Mock;
  let setIntervalSpy: jest.SpyInstance;

  beforeAll(() => {
    jest.useFakeTimers();
    setIntervalSpy = jest.spyOn(global, 'setInterval');
  });

  beforeEach(() => {
    mockCallback = jest.fn();
    setIntervalSpy.mockClear();
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
    setIntervalSpy.mockRestore();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    jest.spyOn(global, 'setInterval');
    doStuffByInterval(callback, 4);
    expect(setInterval).toHaveBeenCalledWith(callback, 4);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const interval = 500;
    doStuffByInterval(mockCallback, interval);

    expect(mockCallback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(interval);
    expect(mockCallback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(interval);
    expect(mockCallback).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(interval * 3);
    expect(mockCallback).toHaveBeenCalledTimes(5);
  });
});

describe('readFileAsynchronously', () => {
  beforeEach(() => {
    mockedExistsSync.mockClear();
    mockedReadFile.mockClear();
    mockedJoin.mockClear();
  });

  test('should call join with pathToFile', async () => {
    const testPath = 'path/to/file.txt';
    mockedJoin.mockReturnValue('mocked/full/path');
    mockedExistsSync.mockReturnValue(false);

    await readFileAsynchronously(testPath);

    expect(mockedJoin).toHaveBeenCalledTimes(1);
    expect(mockedJoin).toHaveBeenCalledWith(__dirname, testPath);
  });

  test('should return null if file does not exist', async () => {
    const mockedPath = 'mocked/nonexistent/path';
    mockedJoin.mockReturnValue(mockedPath);
    mockedExistsSync.mockReturnValue(false);

    const result = await readFileAsynchronously('nonexistent.txt');

    expect(result).toBeNull();
    expect(mockedExistsSync).toHaveBeenCalledWith(mockedPath);
    expect(mockedReadFile).not.toHaveBeenCalled();
  });

  test('should return file content if file exists', async () => {
    const fileContent = 'This is the file content';
    const mockedPath = 'mocked/existent/path';

    mockedJoin.mockReturnValue(mockedPath);
    mockedExistsSync.mockReturnValue(true);
    mockedReadFile.mockResolvedValue(Buffer.from(fileContent));

    const result = await readFileAsynchronously('existent.txt');

    expect(result).toBe(fileContent);
    expect(mockedExistsSync).toHaveBeenCalledWith(mockedPath);
    expect(mockedReadFile).toHaveBeenCalledWith(mockedPath);
  });
});
