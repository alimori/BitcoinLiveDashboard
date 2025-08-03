// core/services/bitcoin-http.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { BitcoinHttpService } from './bitcoin-http.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UTCTimestamp } from 'lightweight-charts';

describe('BitcoinHttpService', () => {
  let service: BitcoinHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BitcoinHttpService],
    });

    service = TestBed.inject(BitcoinHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch and map candles with custom number of candles', () => {
    const mockApiResponse = [
      [1690000000000, '29000.00', '29100.00', '28950.00', '29050.00'],
    ];

    const expected = [
      {
        time: 1690000000 as UTCTimestamp,
        open: 29000.0,
        high: 29100.0,
        low: 28950.0,
        close: 29050.0,
      },
    ];

    service.getLastCandles(1).subscribe((result) => {
      expect(result).toEqual(expected);
    });

    const req = httpMock.expectOne(
      'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=1'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockApiResponse);
  });

  it('should use default limit = 1000 when no argument is passed', () => {
    service.getLastCandles().subscribe();

    const req = httpMock.expectOne(
      'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=1000'
    );
    expect(req.request.method).toBe('GET');
    req.flush([]); // empty response
  });
});
