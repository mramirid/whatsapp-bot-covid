import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test } from '@nestjs/testing';
import { catchError, of, throwError } from 'rxjs';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import type { CountryStats } from '../upstream-api/interfaces/country-stats.interface';
import { UpstreamAPI } from '../upstream-api/upstream-api.abstract';
import { CountryService } from './country.service';

const countryStats: Readonly<CountryStats> = {
  cases: 131_524_885,
  todayCases: 45_442_552,
  deaths: 3_352_999,
  todayDeaths: 823_993,
  recovered: 90_332,
  todayRecovered: 7223,
  active: 583,
  critical: 2,
  updatedAt: new Date('2023-05-14T01:24:30.408Z'),
};

describe('CountryService - Unit Testing', () => {
  const getCacheMock = jest.fn();
  const setCacheMock = jest.fn();

  const getCountryStatsMock = jest.fn();

  let service: CountryService;

  let statsCacheKey: string;

  beforeEach(async () => {
    const cacheManagerMock = {
      get: getCacheMock,
      set: setCacheMock,
    };

    const upstreamAPIMock = {
      getCountryStats: getCountryStatsMock,
    };

    const module = await Test.createTestingModule({
      providers: [
        CountryService,
        { provide: CACHE_MANAGER, useValue: cacheManagerMock },
        { provide: UpstreamAPI, useValue: upstreamAPIMock },
      ],
    }).compile();

    service = module.get(CountryService);
    statsCacheKey = service['STATS_CACHE_KEY'];
  });

  afterEach(() => {
    getCacheMock.mockReset();
    setCacheMock.mockReset();
    getCountryStatsMock.mockReset();
  });

  describe('getTodayStatsMessage()', () => {
    it('should return the stats as a message with the correct format', async () => {
      getCacheMock.mockResolvedValueOnce(undefined);
      getCountryStatsMock.mockReturnValueOnce(of(countryStats));

      const gettingTodayStatsMessage = firstValueFrom(
        service.getTodayStatsMessage(),
      );

      await expect(gettingTodayStatsMessage).resolves.toMatchSnapshot();
    });
  });

  describe('getTodayStats()', () => {
    it('should get the stats from the cache if available', async () => {
      getCacheMock.mockResolvedValueOnce(countryStats);

      const gettingTodayStats = firstValueFrom(service['getTodayStats']());

      await expect(gettingTodayStats).resolves.toBe(countryStats);
      expect(getCacheMock).toHaveBeenCalledWith(statsCacheKey);
    });

    it('should fetch the stats from the upstream API if it is not available in the cache', async () => {
      getCacheMock.mockResolvedValueOnce(undefined);
      getCountryStatsMock.mockReturnValueOnce(of(countryStats));

      const gettingTodayStats = firstValueFrom(service['getTodayStats']());

      await expect(gettingTodayStats).resolves.toBe(countryStats);
      expect(getCountryStatsMock).toHaveBeenCalled();
    });

    it('should cache the stats after fetching the stats from the upstream API', async () => {
      getCacheMock.mockResolvedValueOnce(undefined);
      getCountryStatsMock.mockReturnValueOnce(of(countryStats));

      const gettingTodayStats = firstValueFrom(service['getTodayStats']());

      await expect(gettingTodayStats).resolves.toBe(countryStats);
      expect(setCacheMock).toHaveBeenCalledWith(statsCacheKey, countryStats);
    });

    it('should fetch the upstream API three times if it fails initially', (done) => {
      getCacheMock.mockResolvedValueOnce(undefined);
      getCountryStatsMock
        .mockReturnValueOnce(throwError(() => new Error()))
        .mockReturnValueOnce(throwError(() => new Error()))
        .mockReturnValueOnce(of(countryStats));

      let numFetches = 0;

      service['getTodayStats']()
        .pipe(
          catchError((_, caught) => {
            numFetches++;

            // We just incremented the counter here, so retry, do not throw.
            return caught;
          }),
        )
        .subscribe({
          complete: () => {
            expect(++numFetches).toBe(3);

            done();
          },
        });
    });

    it('should not cache the stats if upstream API requests fail', (done) => {
      getCacheMock.mockResolvedValueOnce(undefined);
      getCountryStatsMock.mockReturnValue(throwError(() => new Error()));

      service['getTodayStats']().subscribe({
        error: () => {
          expect(setCacheMock).not.toBeCalled();
          done();
        },
      });
    });
  });

  describe('formatStats()', () => {
    const numberFormatter = new Intl.NumberFormat('id-ID');
    const dateFormatter = new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'long',
    });

    it('should return formatted stats localized in Indonesian', () => {
      const formattedStats = service['formatStats'](countryStats);

      expect(formattedStats).toEqual({
        cases: numberFormatter.format(countryStats.cases),
        todayCases: numberFormatter.format(countryStats.todayCases),
        recovered: numberFormatter.format(countryStats.recovered),
        todayRecovered: numberFormatter.format(countryStats.todayRecovered),
        deaths: numberFormatter.format(countryStats.deaths),
        todayDeaths: numberFormatter.format(countryStats.todayDeaths),
        active: numberFormatter.format(countryStats.active),
        critical: numberFormatter.format(countryStats.critical),
        updatedAt: dateFormatter.format(countryStats.updatedAt),
      });
    });
  });
});
