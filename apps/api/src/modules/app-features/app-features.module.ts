import { Module } from "@nestjs/common";
import { AppFeaturesController } from "./app-features.controller";

@Module({
  controllers: [AppFeaturesController],
})
export class AppFeaturesModule {}
