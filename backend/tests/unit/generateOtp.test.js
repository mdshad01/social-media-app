import { describe, expect, it } from '@jest/globals';
import generateOtp from '../../utils/generateOtp.js';

describe('generateOtp Utility', () => {
  
  it('should generate a 6-digit OTP', () => {
    const otp = generateOtp();
    
    expect(otp).toBeDefined();
    expect(otp.length).toBe(6);
  });

  it('should generate OTP as a string', () => {
    const otp = generateOtp();
    
    expect(typeof otp).toBe('string');
  });

  it('should generate OTP with only numbers', () => {
    const otp = generateOtp();
    
    expect(/^\d{6}$/.test(otp)).toBe(true);
  });

  it('should generate different OTPs on multiple calls', () => {
    const otp1 = generateOtp();
    const otp2 = generateOtp();
    const otp3 = generateOtp();
    
    // At least one should be different (very high probability)
    const allSame = otp1 === otp2 && otp2 === otp3;
    expect(allSame).toBe(false);
  });

  it('should generate OTP between 100000 and 999999', () => {
    const otp = generateOtp();
    const otpNumber = parseInt(otp);
    
    expect(otpNumber).toBeGreaterThanOrEqual(100000);
    expect(otpNumber).toBeLessThanOrEqual(999999);
  });
});
