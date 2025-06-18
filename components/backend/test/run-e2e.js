// Скрипт для запуска e2e тестов с поддержкой путей
require('ts-node/register');
require('tsconfig-paths/register');

// Запускаем Jest программно
const { runCLI } = require('jest');

const config = {
  config: JSON.stringify({
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    testEnvironment: 'node',
    testRegex: '.e2e-spec.ts$',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    moduleNameMapper: {
      '^src/(.*)$': '<rootDir>/../src/$1',
    },
    moduleDirectories: ['node_modules', '<rootDir>/../'],
  }),
  _: ['./test'],
  runInBand: true,
  detectOpenHandles: true,
};

runCLI(config, [process.cwd()])
  .then((result) => {
    if (!result.results.success) {
      process.exit(1);
    }
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }); 