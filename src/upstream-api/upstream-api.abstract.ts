import type { Observable } from 'rxjs';
import type { CountryStats } from './country-stats.interface';

export abstract class UpstreamAPI {
  abstract getCountryStats(): Observable<CountryStats>;
  abstract getProvinceStats(name: string): Observable<never>;
}
