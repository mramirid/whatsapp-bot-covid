import { CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { CountryService } from './country.service';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  getStatsMessage() {
    return this.countryService.getTodayStatsMessage();
  }
}
