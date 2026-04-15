// Mock email service - prevents real emails during tests
export default async function sendEmail() {
  // Do nothing - just return success
  return Promise.resolve(true);
}
