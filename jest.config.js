module.exports = {
  preset: 'ts-jest',
  testMatch: ['**/__tests__/**/*.test.ts'],


  testEnvironment: 'jsdom', // Use jsdom for DOM-related tests
  /*testEnvironment: 'node', */
  
};