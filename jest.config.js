/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

const config = {
  // automock: false,
  clearMocks: true,
  collectCoverage: true,
  // collectCoverageFrom: undefined,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/'],
  // coverageProvider: "babel",
  coverageReporters: ['json', 'text', 'lcov', 'clover'],
  // coverageThreshold: undefined,
  // dependencyExtractor: undefined,
  // errorOnDeprecated: false,
  // fakeTimers: {
  //   "enableGlobally": false
  // },
  // forceCoverageMatch: [],
  // globals: {
  //   'ts-jest': {
  //     isolatedModules: true,
  //   },
  // },
  moduleDirectories: ['src', 'node_modules'],
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|webp|svg|ttf|woff|woff2)$': '<rootDir>/__mocks__/image.js',
    '\\.(css|scss)$': 'identity-obj-proxy',
    '^@src/(.*)$': '<rootDir>/src/$1'
  },
  // modulePathIgnorePatterns: [],
  // notify: false,
  // notifyMode: "failure-change",
  preset: 'ts-jest',
  // projects: undefined,
  // reporters: undefined,
  // resetMocks: false,
  // resetModules: false,
  // resolver: undefined,
  // restoreMocks: false,
  roots: ['<rootDir>'],
  setupFiles: ['./src/setup-test.js'],
  // setupFilesAfterEnv: [],
  // slowTestThreshold: 5,
  // snapshotSerializers: [],
  testEnvironment: 'jest-environment-jsdom',
  testEnvironmentOptions: {},
  testMatch: ['<rootDir>/src/**/__tests__/**/*.[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/'],
  // testRegex: [],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'babel-jest'
  },
  transformIgnorePatterns: ['/node_modules/'],
  // unmockedModulePathPatterns: undefined,
  verbose: true
  // watchPathIgnorePatterns: [],
  // watchman: true,
};

module.exports = config;
