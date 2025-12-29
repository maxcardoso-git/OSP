import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import configuration from "./config/configuration";
import { AuthModule } from "./modules/auth/auth.module";
import { AppFeaturesModule } from "./modules/app-features/app-features.module";
import { OrganizationsModule } from "./modules/organizations/organizations.module";
import { OrgUnitTypesModule } from "./modules/org-unit-types/org-unit-types.module";
import { OrgUnitsModule } from "./modules/org-units/org-units.module";
import { TreeModule } from "./modules/tree/tree.module";
import { AuditModule } from "./modules/audit/audit.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: [".env.local", ".env"],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>("database.host"),
        port: configService.get<number>("database.port"),
        username: configService.get<string>("database.username"),
        password: configService.get<string>("database.password"),
        database: configService.get<string>("database.database"),
        schema: configService.get<string>("database.schema"),
        autoLoadEntities: true,
        synchronize: configService.get<string>("database.synchronize") === "true",
        logging: configService.get<string>("database.logging") === "true",
        ssl: configService.get<string>("database.ssl") === "true" 
          ? { rejectUnauthorized: false } 
          : false,
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    AppFeaturesModule,
    OrganizationsModule,
    OrgUnitTypesModule,
    OrgUnitsModule,
    TreeModule,
    AuditModule,
  ],
})
export class AppModule {}
