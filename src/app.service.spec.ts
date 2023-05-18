import { of } from 'rxjs';
import { AppService } from './app.service';
import type { CountryService } from './country/country.service';

const getStatsMessageSpy = jest.fn(() => of('COUNTRY_STATS_MESSAGE'));
const countryServiceMock: Partial<CountryService> = {
  getStatsMessage: getStatsMessageSpy,
};
const appService = new AppService(countryServiceMock as any);

describe('replyHello()', () => {
  it('should reply hello correctly', () => {
    expect(appService.replyHello('Amir')).toMatchSnapshot();
  });
});

describe('replyHelp()', () => {
  it('should reply help correctly', () => {
    expect(appService.replyHelp()).toMatchSnapshot();
  });
});

describe('replyUnknown()', () => {
  it('should reply unknown correctly', () => {
    expect(appService.replyUnknown()).toMatchSnapshot();
  });
});

describe('replyNasional()', () => {
  it('should call CountryService.getStatsMessage() in order to reply nasional', (done) => {
    appService.replyNasional().subscribe({
      next: () => {
        expect(getStatsMessageSpy).toBeCalled();
      },
      error: done,
      complete: done,
    });
  });
});
