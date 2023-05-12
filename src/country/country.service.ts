import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { isError } from 'lodash';
import { firstValueFrom, map, retry } from 'rxjs';
import type { CountryStats } from './country-stats.interface';

@Injectable()
export class CountryService implements OnModuleInit {
  private lastStats: CountryStats | undefined;

  private readonly logger = new Logger(CountryService.name);

  constructor(private readonly httpService: HttpService) {}

  async onModuleInit() {
    this.lastStats = await firstValueFrom(this.fetchStats());
    this.logger.log('onModuleInit successfully initialized the country stats');
  }

  @Cron(CronExpression.EVERY_DAY_AT_6PM, { timeZone: 'Asia/Jakarta' })
  handleFetchStats() {
    this.fetchStats()
      .pipe(retry({ count: 24, delay: 3_600_000 }))
      .subscribe({
        next: (stats) => {
          this.lastStats = stats;
          this.logger.log('CRON successfully updated the country stats');
        },
        error: (error) => {
          const message = isError(error)
            ? error.message
            : 'CRON failed to fetch the country stats';
          this.logger.error(message);
        },
      });
  }

  private fetchStats() {
    return this.httpService
      .get<CountryStats>(
        'https://corona.lmao.ninja/v2/countries/Indonesia?yesterday=true&strict=true&query=',
      )
      .pipe(
        map((response) => {
          if (response.status > 500) {
            throw new Error(response.statusText);
          }

          return response.data;
        }),
      );
  }

  getLastStatsAsMessage() {
    const numberFormatter = new Intl.NumberFormat('id-ID');

    const cases = numberFormatter.format(this.lastStats?.cases ?? 0);
    const todayCases = numberFormatter.format(this.lastStats?.todayCases ?? 0);
    const recovered = numberFormatter.format(this.lastStats?.recovered ?? 0);
    const todayRecovered = numberFormatter.format(
      this.lastStats?.todayRecovered ?? 0,
    );
    const deaths = numberFormatter.format(this.lastStats?.deaths ?? 0);
    const todayDeaths = numberFormatter.format(
      this.lastStats?.todayDeaths ?? 0,
    );
    const active = numberFormatter.format(this.lastStats?.active ?? 0);
    const critical = numberFormatter.format(this.lastStats?.critical ?? 0);
    const updated = new Date(
      this.lastStats?.updated ?? Date.now(),
    ).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'long' });

    return (
      'Statistik COVID-19 di Indonesia\n\n' +
      `Total kasus: ${cases} (+${todayCases})\n` +
      `Sembuh: ${recovered} (+${todayRecovered})\n` +
      `Meninggal: ${deaths} (+${todayDeaths})\n` +
      `Dirawat: ${active}\n` +
      `Kritis: ${critical}\n\n` +
      `Tetap jaga kesehatan dan rajin cuci tangan.\n\n` +
      `Pembaharuan terakhir pada ${updated}.`
    );
  }
}
