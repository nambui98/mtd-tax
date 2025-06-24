/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, Logger, VersioningType } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: new ConsoleLogger({
            prefix: 'MTD-TAX', // Default is "Nest"
        }),
    });
    const logger = new Logger('Bootstrap');

    const reflector = app.get('Reflector');

    app.useGlobalGuards(new JwtAuthGuard(reflector));

    // app.use(helmet());
    app.enableCors({
        origin: [
            'https://fe-production-8c9c.up.railway.app',
            'https://dev-12345.aatax.ai',
            'http://localhost:3000',
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Accept',
            'Authorization',
            'skipauth',
            'X-Requested-With',
            'Origin',
        ],
        exposedHeaders: ['Content-Range', 'X-Content-Range'],
        credentials: true,
        maxAge: 3600,
    });

    // Performance
    // app.use(compression());

    // Rate limiting
    // app.use(
    //     rateLimit({
    //         windowMs: 15 * 60 * 1000, // 15 minutes
    //         max: 100, // limit each IP to 100 requests per windowMs
    //     }),
    // );

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

    // Enable validation
    app.useGlobalPipes(new ValidationPipe());

    const config = new DocumentBuilder()
        .setTitle('API Documentation')
        .setDescription('The API description')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    await app.listen(process.env.PORT || 8000);
    logger.log(
        `Application is running on: http://localhost:${process.env.PORT || 8000}`,
    );
    logger.log(
        `Swagger documentation: http://localhost:${process.env.PORT || 8000}/api/docs`,
    );
}
void bootstrap();
