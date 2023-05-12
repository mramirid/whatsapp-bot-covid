import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, map, retry } from 'rxjs';
import type { CountryStats } from './country-stats.interface';

@Injectable()
export class CountryService {
  constructor(private readonly httpService: HttpService) {}

  async getTodayStatsAsMessage() {
    const lastStats = await firstValueFrom(this.fetchStats());

    const numberFormatter = new Intl.NumberFormat('id-ID');
    const dateFormatter = new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'long',
    });

    const cases = numberFormatter.format(lastStats.cases);
    const todayCases = numberFormatter.format(lastStats.todayCases);
    const recovered = numberFormatter.format(lastStats.recovered);
    const todayRecovered = numberFormatter.format(lastStats.todayRecovered);
    const deaths = numberFormatter.format(lastStats.deaths);
    const todayDeaths = numberFormatter.format(lastStats.todayDeaths);
    const active = numberFormatter.format(lastStats.active);
    const critical = numberFormatter.format(lastStats.critical);
    const updated = dateFormatter.format(lastStats.updated);

    return (
      'Statistik COVID-19 di Indonesia\n\n' +
      `Total: ${cases} (+${todayCases})\n` +
      `Sembuh: ${recovered} (+${todayRecovered})\n` +
      `Meninggal: ${deaths} (+${todayDeaths})\n` +
      `Dirawat: ${active}\n` +
      `Kritis: ${critical}\n\n` +
      `Tetap jaga kesehatan dan rajin cuci tangan.\n\n` +
      `Pembaharuan terakhir pada ${updated}.`
    );
  }

  private fetchStats() {
    return this.httpService
      .get<CountryStats>(
        'https://corona.lmao.ninja/v2/countries/ID?yesterday=true&strict=true&query=',
      )
      .pipe(
        retry(3),
        map((response) => {
          if (response.status > 500) {
            throw new Error(response.statusText);
          }

          return response.data;
        }),
      );
  }
}
