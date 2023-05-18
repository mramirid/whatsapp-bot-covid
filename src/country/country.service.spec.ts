import { CacheModule, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test } from '@nestjs/testing';
import type { Cache } from 'cache-manager';
import { clone } from 'lodash';
import { catchError, delay, of, switchMap, throwError } from 'rxjs';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { UpstreamAPI } from '../upstream-api/upstream-api.abstract';
import type { CountryStats } from './country-stats.interface';
import { CountryService } from './country.service';

const dummyStats: CountryStats = {
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

describe('Unit Testing', () => {
  const getCacheMock = jest.fn();
  const setCacheMock = jest.fn();

  const getCountryStatsMock = jest.fn();

  let service: CountryService;

  let statsCacheKey: string;

  beforeEach(async () => {
    const cacheManagerMock: Partial<Cache> = {
      get: getCacheMock,
      set: setCacheMock,
    };

    const upstreamAPIMock: UpstreamAPI = {
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

  describe('getStats()', () => {
    it('should get the stats from the cache if available', async () => {
      getCacheMock.mockResolvedValueOnce(dummyStats);

      const gettingStats = firstValueFrom(service['getStats']());

      await expect(gettingStats).resolves.toBe(dummyStats);
      expect(getCacheMock).toHaveBeenCalledWith(statsCacheKey);
    });

    it('should fetch the stats from the upstream API if it is not available in the cache', async () => {
      getCacheMock.mockResolvedValueOnce(undefined);
      getCountryStatsMock.mockReturnValueOnce(of(dummyStats));

      const gettingStats = firstValueFrom(service['getStats']());

      await expect(gettingStats).resolves.toBe(dummyStats);
      expect(getCountryStatsMock).toHaveBeenCalled();
    });

    it('should cache the stats fetched from the upstream API', async () => {
      getCacheMock.mockResolvedValueOnce(undefined);
      getCountryStatsMock.mockReturnValueOnce(of(dummyStats));

      const gettingStats = firstValueFrom(service['getStats']());

      await expect(gettingStats).resolves.toBe(dummyStats);
      expect(setCacheMock).toHaveBeenCalledWith(statsCacheKey, dummyStats);
    });

    it('should fetch the upstream API three times if it fails initially', (done) => {
      getCacheMock.mockResolvedValueOnce(undefined);
      getCountryStatsMock
        .mockReturnValueOnce(throwError(() => new Error()))
        .mockReturnValueOnce(throwError(() => new Error()))
        .mockReturnValueOnce(of(dummyStats));

      let numFetches = 0;

      service['getStats']()
        .pipe(
          catchError((_, caught) => {
            numFetches++;

            // We just incremented the counter here, so retry, do not throw.
            return caught;
          }),
        )
        .subscribe({
          next: () => {
            numFetches++;
          },
          error: done,
          complete: () => {
            expect(numFetches).toBe(3);
            done();
          },
        });
    });

    it('should not cache the stats if upstream API requests fail', (done) => {
      getCacheMock.mockResolvedValueOnce(undefined);
      getCountryStatsMock.mockReturnValue(throwError(() => new Error()));

      service['getStats']().subscribe({
        error: () => {
          expect(setCacheMock).not.toBeCalled();
          done();
        },
      });
    });
  });

  describe('localizeStats()', () => {
    const numberFormatter = new Intl.NumberFormat('id-ID');
    const dateFormatter = new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'long',
    });

    it('should return formatted stats localized in Indonesian', () => {
      const formattedStats = service['localizeStats'](dummyStats);

      expect(formattedStats).toEqual({
        cases: numberFormatter.format(dummyStats.cases),
        todayCases: numberFormatter.format(dummyStats.todayCases),
        recovered: numberFormatter.format(dummyStats.recovered),
        todayRecovered: numberFormatter.format(dummyStats.todayRecovered),
        deaths: numberFormatter.format(dummyStats.deaths),
        todayDeaths: numberFormatter.format(dummyStats.todayDeaths),
        active: numberFormatter.format(dummyStats.active),
        critical: numberFormatter.format(dummyStats.critical),
        updatedAt: dateFormatter.format(dummyStats.updatedAt),
      });
    });
  });
});

describe('Integration Testing', () => {
  const CACHE_TTL = 5000;

  let service: CountryService;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CacheModule.register({ ttl: CACHE_TTL })],
      providers: [
        CountryService,
        {
          provide: UpstreamAPI,
          useValue: { getCountryStats: () => of(clone(dummyStats)) },
        },
      ],
    }).compile();

    service = module.get(CountryService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  afterEach(async () => {
    await cacheManager.reset();
  });

  describe('getStats()', () => {
    it('should return the stats fetched from the upstream API in the first call', async () => {
      const cachedStats = await cacheManager.get<CountryStats>(
        service['STATS_CACHE_KEY'],
      );

      const stats = await firstValueFrom(service['getStats']());

      expect(stats).not.toBe(cachedStats);
    });

    it('should return the stats from the cache in the second call', async () => {
      const cachedFirstStats = await firstValueFrom(
        service['getStats']().pipe(
          switchMap(() =>
            cacheManager.get<CountryStats>(service['STATS_CACHE_KEY']),
          ),
        ),
      );

      const secondStats = await firstValueFrom(service['getStats']());

      expect(secondStats).toBe(cachedFirstStats);
    });

    it(
      "should refetch the stats if the previous cached stats' lifespan exceeds five seconds",
      async () => {
        const cachedFirstStats = await firstValueFrom(
          service['getStats']().pipe(
            switchMap(() =>
              cacheManager.get<CountryStats>(service['STATS_CACHE_KEY']),
            ),
            delay(CACHE_TTL + 1000),
          ),
        );

        const secondStats = await firstValueFrom(service['getStats']());

        expect(secondStats).not.toBe(cachedFirstStats);
      },
      CACHE_TTL * 2,
    );
  });

  describe('getStatsMessage()', () => {
    it('should return the stats as a message with the correct format', async () => {
      const gettingTodayStatsMessage = firstValueFrom(
        service.getStatsMessage(),
      );

      await expect(gettingTodayStatsMessage).resolves.toMatchSnapshot();
    });
  });
});
