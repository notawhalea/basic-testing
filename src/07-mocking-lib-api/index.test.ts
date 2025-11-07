import { throttledGetDataFromApi } from '.';
import axios from 'axios';

jest.mock('axios');
jest.mock('lodash', () => ({
  __esModule: true,
  ...jest.requireActual('lodash'),
  throttle: jest.fn(
    (fn) =>
      (...args: unknown[]) =>
        fn(...args),
  ),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('throttledGetDataFromApi', () => {
  const BASE_URL = 'https://jsonplaceholder.typicode.com';
  const MAIN_PATH = './todos/1';

  test('should create instance with provided base url', async () => {
    const axiosClient = { get: jest.fn };

    mockedAxios.create.mockReturnValue(axiosClient as never);

    await throttledGetDataFromApi(MAIN_PATH);
    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: BASE_URL,
    });
  });

  test('should perform request to correct provided url', async () => {
    const axiosClient = { get: jest.fn().mockResolvedValue({ data: 'todo' }) };

    mockedAxios.create.mockReturnValue(axiosClient as never);
    await throttledGetDataFromApi(MAIN_PATH);

    expect(axiosClient.get).toHaveBeenCalledWith(MAIN_PATH);
  });

  test('should return response data', async () => {
    const resData = 'resTodo';
    const axiosClient = { get: jest.fn().mockResolvedValue({ data: resData }) };

    mockedAxios.create.mockReturnValue(axiosClient as never);
    await expect(throttledGetDataFromApi(MAIN_PATH)).resolves.toBe(resData);
  });
});
