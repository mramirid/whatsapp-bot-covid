import { Module } from '@nestjs/common';
import { CountryModule } from './country/country.module';

@Module({ imports: [CountryModule] })
export class AppModule {}
