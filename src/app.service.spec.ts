import { of } from 'rxjs';
import { AppService } from './app.service';
import type { CountryService } from './country/country.service';

describe('AppService - Unit Testing', () => {
  const getCountryStatsMessageSpy = jest.fn(() => of('COUNTRY_STATS_MESSAGE'));
  const countryServiceMock: Partial<CountryService> = {
    getStatsMessage: getCountryStatsMessageSpy,
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

  it('should call CountryService.getStatsMessage() in order to reply nasional', (done) => {
    appService.replyNasional().subscribe({
      next: () => {
        expect(getCountryStatsMessageSpy).toBeCalled();
      },
      error: done,
      complete: done,
    });
  });
});
