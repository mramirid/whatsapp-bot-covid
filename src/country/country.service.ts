import { Injectable } from '@nestjs/common';
import { map, retry } from 'rxjs';
import { UpstreamAPI } from '../upstream-api.abstract';
import type { CountryStats } from './country-stats.interface';

@Injectable()
export class CountryService {
  constructor(private readonly upstreamAPI: UpstreamAPI) {}

  getTodayStatsMessage() {
    return this.upstreamAPI.getCountryStats().pipe(
      retry(3),
      map((stats) => this.formatStatsToStrings(stats)),
      map(
        (stats) =>
          'Statistik COVID-19 di Indonesia\n\n' +
          `Total: ${stats.cases} (+${stats.todayCases})\n` +
          `Sembuh: ${stats.recovered} (+${stats.todayRecovered})\n` +
          `Meninggal: ${stats.deaths} (+${stats.todayDeaths})\n` +
          `Dirawat: ${stats.active}\n` +
          `Kritis: ${stats.critical}\n\n` +
          `Tetap jaga kesehatan dan rajin cuci tangan.\n\n` +
          `Pembaharuan terakhir pada ${stats.updatedAt}.`,
      ),
    );
  }

  private formatStatsToStrings(
    stats: CountryStats,
  ): Record<keyof CountryStats, string> {
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
