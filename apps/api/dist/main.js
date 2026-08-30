"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
let cachedApp;
async function bootstrap() {
    if (cachedApp)
        return cachedApp;
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log'],
    });
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const origins = frontendUrl.split(',').map((s) => s.trim());
    app.enableCors({
        origin: origins,
        credentials: true,
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false,
    }));
    await app.init();
    cachedApp = app;
    return app;
}
if (require.main === module) {
    bootstrap().then(async (app) => {
        const port = process.env.PORT || 3000;
        await app.listen(port);
        console.log(`API running on http://localhost:${port}`);
    });
}
exports.default = async (req, res) => {
    const app = await bootstrap();
    const expressApp = app.getHttpAdapter().getInstance();
    return expressApp(req, res);
};
//# sourceMappingURL=main.js.map