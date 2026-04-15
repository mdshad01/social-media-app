import { describe, expect, it } from '@jest/globals';
import AppError from '../../utils/appError.js';

describe('AppError Utility', () => {
  
  it('should create an error with message and status code', () => {
    const error = new AppError('Something went wrong', 400);
    
    expect(error.message).toBe('Something went wrong');
    expect(error.statusCode).toBe(400);
  });

  it('should set status to "fail" for 4xx errors', () => {
    const error400 = new AppError('Bad request', 400);
    const error404 = new AppError('Not found', 404);
    
    expect(error400.status).toBe('fail');
    expect(error404.status).toBe('fail');
  });

  it('should set status to "error" for 5xx errors', () => {
    const error500 = new AppError('Server error', 500);
    const error503 = new AppError('Service unavailable', 503);
    
    expect(error500.status).toBe('error');
    expect(error503.status).toBe('error');
  });

  it('should be an instance of Error', () => {
    const error = new AppError('Test error', 400);
    
    expect(error instanceof Error).toBe(true);
    expect(error instanceof AppError).toBe(true);
  });

  it('should capture stack trace', () => {
    const error = new AppError('Test error', 400);
    
    expect(error.stack).toBeDefined();
    expect(typeof error.stack).toBe('string');
  });

  it('should handle different status codes correctly', () => {
    const testCases = [
      { code: 400, expectedStatus: 'fail' },
      { code: 401, expectedStatus: 'fail' },
      { code: 403, expectedStatus: 'fail' },
      { code: 404, expectedStatus: 'fail' },
      { code: 422, expectedStatus: 'fail' },
      { code: 500, expectedStatus: 'error' },
      { code: 502, expectedStatus: 'error' },
      { code: 503, expectedStatus: 'error' }
    ];

    testCases.forEach(({ code, expectedStatus }) => {
      const error = new AppError('Test', code);
      expect(error.status).toBe(expectedStatus);
    });
  });
});
