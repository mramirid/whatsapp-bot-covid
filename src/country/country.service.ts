import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { randomUUID } from 'crypto';
import { from, map, of, switchMap, tap } from 'rxjs';
import { UpstreamAPI } from '../upstream-api.abstract';
import type { CountryStats } from './country-stats.interface';

@Injectable()
export class CountryService {
  private readonly COUNTRY_CACHE_KEY = randomUUID();

  constructor(
    private readonly upstreamAPI: UpstreamAPI,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  getTodayStatsMessage() {
    return this.getTodayStats().pipe(
      map((stats) => this.formatStats(stats)),
      map(
        (stats) =>
          '*Statistik COVID-19 di Indonesia*\n\n' +
          `Total: ${stats.cases} (+${stats.todayCases})\n` +
          `Sembuh: ${stats.recovered} (+${stats.todayRecovered})\n` +
          `Meninggal: ${stats.deaths} (+${stats.todayDeaths})\n` +
          `Dirawat: ${stats.active}\n` +
          `Kritis: ${stats.critical}\n\n` +
          `Tetap jaga kesehatan dan patuhi protokol kesehatan.\n\n` +
          `_Pembaharuan terakhir pada ${stats.updatedAt}._`,
      ),
    );
  }

  private getTodayStats() {
    return from(
      this.cacheManager.get<CountryStats>(this.COUNTRY_CACHE_KEY),
    ).pipe(
      switchMap((cachedStats) =>
        cachedStats ? of(cachedStats) : this.upstreamAPI.getCountryStats(),
      ),
      tap((stats) => {
        this.cacheManager.set(this.COUNTRY_CACHE_KEY, stats, 10_000);
      }),
    );
  }

  private formatStats(stats: CountryStats): Record<keyof CountryStats, string> {
    const numberFormatter = new Intl.NumberFormat('id-ID');
    const dateFormatter = new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'long',
    });

    return {
      cases: numberFormatter.format(stats.cases),
      todayCases: numberFormatter.format(stats.todayCases),
      recovered: numberFormatter.format(stats.recovered),
      todayRecovered: numberFormatter.format(stats.todayRecovered),
      deaths: numberFormatter.format(stats.deaths),
      todayDeaths: numberFormatter.format(stats.todayDeaths),
      active: numberFormatter.format(stats.active),
      critical: numberFormatter.format(stats.critical),
      updatedAt: dateFormatter.format(stats.updatedAt),
    };
  }
}
