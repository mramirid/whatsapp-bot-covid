import { of } from 'rxjs';
import { AppService } from './app.service';
import type { CountryService } from './country/country.service';

describe('AppService - Unit Testing', () => {
  const getTodayStatsMessageMock = jest.fn(() => of('TODAY_STATS_MESSAGE'));
  const countryServiceMock: Partial<CountryService> = {
    getTodayStatsMessage: getTodayStatsMessageMock,
  };
  const appService = new AppService(countryServiceMock as any);

  it('should reply hello correctly', () => {
    expect(appService.replyHello('Amir')).toMatchSnapshot();
  });

  it('should reply help correctly', () => {
    expect(appService.replyHelp()).toMatchSnapshot();
  });

  it('should reply unknown correctly', () => {
    expect(appService.replyUnknown()).toMatchSnapshot();
  });

  it('should call CountryService.getTodayStatsMessage() in order to reply nasional', (done) => {
    appService.replyNasional().subscribe({
      next: () => {
        expect(getTodayStatsMessageMock).toBeCalled();
      },
      error: done,
      complete: done,
    });
  });
});
