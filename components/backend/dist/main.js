"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const path_1 = require("path");
const fs_1 = require("fs");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('CARD.COOP')
        .setDescription('API для авторизации и управления пользователями')
        .setVersion('1.0')
        .addBearerAuth()
        .addServer('http://localhost:3015')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    const outputPath = (0, path_1.join)(__dirname, '..', 'swagger.json');
    (0, fs_1.writeFileSync)(outputPath, JSON.stringify(document, null, 2), 'utf8');
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(3015);
}
bootstrap();
//# sourceMappingURL=main.js.map