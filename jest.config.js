module.exports = {
  preset: 'jest-preset-preact',
  setupFiles: ['<rootDir>/test/__mocks__/setupTests.js'],
  testURL: 'http://localhost:8080',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!(lazy-space)/)'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/test/__mocks__/fileMocks.js',
  },
}
