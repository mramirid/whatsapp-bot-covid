import type { Observable } from 'rxjs';
import type { CountryStats } from './interfaces/country-stats.interface';

export abstract class UpstreamAPI {
  abstract getCountryStats(): Observable<CountryStats>;
}
