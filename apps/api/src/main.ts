import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const corsOrigins = configService.get<string>("cors.origins")?.split(",") || [];
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Org-Id", "X-Requested-With"],
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle("OSP API")
    .setDescription("Organization Structure Platform API")
    .setVersion("1.0")
    .addBearerAuth()
    .addCookieAuth("tah_session")
    .addTag("auth", "Authentication endpoints")
    .addTag("organizations", "Organization management")
    .addTag("org-units", "Organizational unit management")
    .addTag("org-unit-types", "Organizational unit type management")
    .addTag("tree", "Tree structure endpoints")
    .addTag("audit", "Audit log endpoints")
    .addTag("app-features", "Application features manifest")
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api/docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = configService.get<number>("port") || 3001;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
