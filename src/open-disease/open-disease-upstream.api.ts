import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map, Observable, retry } from 'rxjs';
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
        retry(3),
        map((response) => {
          if (response.status > 400) {
            throw new Error(response.statusText);
          }
          return response;
        }),
        map((response) => ({
          cases: response.data.cases,
          todayCases: response.data.todayCases,
          deaths: response.data.deaths,
          todayDeaths: response.data.todayCases,
          recovered: response.data.recovered,
          todayRecovered: response.data.todayRecovered,
          active: response.data.active,
          critical: response.data.critical,
          updatedAt: new Date(response.data.updated),
        })),
      );
  }

  getProvinceStats(): Observable<never> {
    throw new Error('Method not implemented.');
  }
}
