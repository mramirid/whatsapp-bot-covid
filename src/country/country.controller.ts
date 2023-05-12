import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { CountryService } from './country.service';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(86_400_000)
  getStatsMessage() {
    return this.countryService.getTodayStatsMessage();
  }
}
