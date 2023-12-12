module.exports = {
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,ts,jsx,tsx,mjs}'],
  testMatch: ['<rootDir>/src/**/__tests__/**/*.{js,ts,jsx,mjs}'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules',
  ],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|webp|svg|ttf|woff|woff2)$':
      '<rootDir>/__mocks__/image.js',
    '\\.(css|scss)$': 'identity-obj-proxy',
    '@/(?!components$)(.+)$': '<rootDir>/src/$1',
  },
  setupFiles: ['./src/setup-test.js'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  moduleDirectories: ['node_modules', 'src',],
  coverageReporters: [
    'clover',
    'json',
    'lcov',
    'text',
    ['text-summary', { skipFull: true }],
  ],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 60,
      functions: 70,
      lines: 70,
    },
  },
};
