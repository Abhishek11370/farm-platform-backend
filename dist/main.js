"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Global pipes
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    // Global filter
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    // Global interceptor
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor());
    // Logger middleware
    // LoggerMiddleware registration moved to AppModule (Nest best practice)
    const port = parseInt(process.env.PORT || '5003', 10);
    await app.listen(port);
    console.log(`🚀 Application listening on port ${port}`);
}
bootstrap();
