import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { OpenDiseaseUpstreamAPI } from '../open-disease/open-disease-upstream.api';
import { UpstreamAPI } from '../upstream-api.abstract';
import { CountryController } from './country.controller';
import { CountryService } from './country.service';

@Module({
  imports: [CacheModule.register(), HttpModule],
  controllers: [CountryController],
  providers: [
    CountryService,
    { provide: UpstreamAPI, useClass: OpenDiseaseUpstreamAPI },
  ],
  exports: [CountryService],
})
export class CountryModule {}
