import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CountryModule } from './country/country.module';

@Module({
  imports: [ScheduleModule.forRoot(), CountryModule],
})
export class AppModule {}
