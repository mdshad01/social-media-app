import { describe, expect, it, jest } from '@jest/globals';
import catchAsync from '../../utils/catchAsync.js';

describe('catchAsync Utility', () => {
  
  it('should wrap an async function', () => {
    const asyncFn = async (req, res, next) => {
      res.status(200).json({ success: true });
    };
    
    const wrappedFn = catchAsync(asyncFn);
    
    expect(typeof wrappedFn).toBe('function');
  });

  it('should call the wrapped function with req, res, next', async () => {
    const mockFn = jest.fn().mockResolvedValue(true);
    const wrappedFn = catchAsync(mockFn);
    
    const req = {};
    const res = {};
    const next = jest.fn();
    
    await wrappedFn(req, res, next);
    
    expect(mockFn).toHaveBeenCalledWith(req, res, next);
  });

  it('should catch errors and pass to next()', async () => {
    const error = new Error('Test error');
    const asyncFn = async () => {
      throw error;
    };
    
    const wrappedFn = catchAsync(asyncFn);
    const next = jest.fn();
    
    await wrappedFn({}, {}, next);
    
    expect(next).toHaveBeenCalledWith(error);
  });

  it('should not call next() if no error occurs', async () => {
    const asyncFn = async (req, res) => {
      res.status(200).json({ success: true });
    };
    
    const wrappedFn = catchAsync(asyncFn);
    const next = jest.fn();
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    await wrappedFn({}, res, next);
    
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should handle async errors properly', async () => {
    const error = new Error('Async error');
    const asyncFn = async () => {
      throw error;  // Use throw instead of Promise.reject
    };
    
    const wrappedFn = catchAsync(asyncFn);
    const next = jest.fn();
    
    await wrappedFn({}, {}, next);
    
    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0].message).toBe('Async error');
  });
});
