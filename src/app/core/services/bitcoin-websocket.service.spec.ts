import { TestBed } from '@angular/core/testing';
import { BitcoinWebSocketService } from './bitcoin-websocket.service';
import { BinanceTrade } from '../../models/trade.model';
import { Subject } from 'rxjs';
import { WebSocketFactoryService } from './websocket-factory.service';

class MockWebSocketSubject extends Subject<any> {
  isClosed = false;
  completeCalled = false;

  override complete() {
    this.isClosed = true;
    this.completeCalled = true;
    super.complete();
  }
}

describe('BitcoinWebSocketService', () => {
  let service: BitcoinWebSocketService;
  let mockSocket: MockWebSocketSubject;
  let mockFactory: jasmine.SpyObj<WebSocketFactoryService>;

  beforeEach(() => {
    mockSocket = new MockWebSocketSubject();
    mockFactory = jasmine.createSpyObj('WebSocketFactoryService', ['create']);
    mockFactory.create.and.returnValue(mockSocket as any);

    TestBed.configureTestingModule({
      providers: [
        BitcoinWebSocketService,
        { provide: WebSocketFactoryService, useValue: mockFactory },
      ],
    });

    service = TestBed.inject(BitcoinWebSocketService);
  });

  it('should connect and emit trade data', (done) => {
    const tradeData: BinanceTrade = {
      e: 'trade',
      E: Date.now(),
      s: 'BTCUSDT',
      t: 123456,
      p: '10000',
      q: '0.01',
      b: 100,
      a: 101,
      T: Date.now(),
      m: false,
      M: true,
    };

    service.connect().subscribe((msg) => {
      expect(msg).toEqual(tradeData);
      done();
    });

    mockSocket.next(tradeData);
  });

  it('should not reconnect if already connected', () => {
    service.connect();
    service.connect();

    expect(mockFactory.create).toHaveBeenCalledTimes(1);
  });

  it('should complete socket on disconnect', () => {
    service.connect();
    service.disconnect();

    expect(mockSocket.completeCalled).toBeTrue();
    expect(mockSocket.isClosed).toBeTrue();
  });
});
