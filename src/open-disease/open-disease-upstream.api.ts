import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import type { CountryStats } from '../country/country-stats.interface';
import { UpstreamAPI } from '../upstream-api.abstract';
import type { OpenDiseaseCountryStats } from './open-disease-country-stats.interface';

@Injectable()
export class OpenDiseaseUpstreamAPI extends UpstreamAPI {
  constructor(private readonly httpService: HttpService) {
    super();
  }

  getCountryStats(): Observable<CountryStats> {
    return this.httpService
      .get<OpenDiseaseCountryStats>(
        'https://corona.lmao.ninja/v2/countries/ID?yesterday=true&strict=true&query=',
      )
      .pipe(
        map((response) => {
          if (response.status >= 400) {
            throw new Error(
              'Open Disease API responded an error with status ' +
                response.status,
              { cause: response },
            );
          }

          return response.data;
        }),
        map((stats) => ({
          cases: stats.cases,
          todayCases: stats.todayCases,
          deaths: stats.deaths,
          todayDeaths: stats.todayCases,
          recovered: stats.recovered,
          todayRecovered: stats.todayRecovered,
          active: stats.active,
          critical: stats.critical,
          updatedAt: new Date(stats.updated),
        })),
      );
  }

  getProvinceStats(): Observable<never> {
    throw new Error('Method not implemented.');
  }
}
