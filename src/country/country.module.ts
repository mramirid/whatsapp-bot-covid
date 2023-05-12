import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { CountryController } from './country.controller';
import { CountryService } from './country.service';

@Module({
  imports: [CacheModule.register(), HttpModule],
  controllers: [CountryController],
  providers: [CountryService],
})
export class CountryModule {}
