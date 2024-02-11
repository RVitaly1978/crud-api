/** @type { import('ts-jest').JestConfigWithTsJest } */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['/src/**/?(*.)+(test).ts'],
  testPathIgnorePatterns: ['/node_modules/'],

  // moduleFileExtensions: ['ts', 'js', 'json'],
  // moduleNameMapper: {
  //   '^axios$': require.resolve('axios'),
  // },
  // restoreMocks: true,
  // resetMocks: true,
  // moduleDirectories: ['node_modules', '<rootDir>/src'],
  // transform: {
  //   '^.+\\.ts?$': 'ts-jest',
  // },
};
