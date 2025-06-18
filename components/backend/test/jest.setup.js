// Настройка для корректного разрешения путей в тестах
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('../tsconfig.json');

// Увеличиваем таймаут для тестов до 30 секунд
jest.setTimeout(30000);

// Корректное завершение всех асинхронных операций после тестов
afterAll(async () => {
  // Даем время на закрытие всех соединений
  await new Promise(resolve => setTimeout(resolve, 1000));
});

module.exports = {
  // Другие настройки Jest
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, { prefix: '<rootDir>/' }),
}; 