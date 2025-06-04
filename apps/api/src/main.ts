import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, Logger, VersioningType } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: new ConsoleLogger({
            prefix: 'MTD-TAX', // Default is "Nest"
        }),
    });
    const logger = new Logger('Bootstrap');

    // app.use(helmet());
    app.enableCors({
        origin: process.env.ALLOWED_ORIGINS?.split(',') || [
            'http://localhost:3000',
        ],
        credentials: true,
    });

    // Performance
    // app.use(compression());

    // Rate limiting
    // app.use(rateLimit({
    //   windowMs: 15 * 60 * 1000, // 15 minutes
    //   max: 100, // limit each IP to 100 requests per windowMs
    // }));

    app.setGlobalPrefix('api');

    app.enableVersioning({
        type: VersioningType.URI,
        prefix: 'v',
        defaultVersion: '1',
    });

    // Global filters
    app.useGlobalFilters(new GlobalExceptionFilter());

    // Global interceptors
    app.useGlobalInterceptors(new ResponseInterceptor());

    const config = new DocumentBuilder()
        .setTitle('API Documentation')
        .setDescription('The API description')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    await app.listen(process.env.PORT ?? 8000);
    logger.log(
        `Application is running on: http://localhost:${process.env.PORT ?? 8000}`,
    );
    logger.log(
        `Swagger documentation: http://localhost:${process.env.PORT ?? 8000}/api/docs`,
    );
}
void bootstrap();
