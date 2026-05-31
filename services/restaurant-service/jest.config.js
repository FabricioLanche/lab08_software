module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  collectCoverageFrom: ['src/**/*.ts', '!src/index.ts', '!src/infrastructure/api/server.ts'],
  coverageDirectory: './coverage',
  coverageReporters: ['lcov', 'text-summary'],
};
