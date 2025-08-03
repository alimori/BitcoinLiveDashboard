import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { CandlestickChartComponent } from './candlestick-chart.component';
import { BitcoinWebSocketService } from '../../core/services/bitcoin-websocket.service';
import { of, Subject } from 'rxjs';

describe('CandlestickChartComponent', () => {
  let component: CandlestickChartComponent;
  let fixture: ComponentFixture<CandlestickChartComponent>;
  let mockWebSocketService: jasmine.SpyObj<BitcoinWebSocketService>;
  let tradeStream$: Subject<any>;

  beforeEach(async () => {
    tradeStream$ = new Subject();

    mockWebSocketService = jasmine.createSpyObj('BitcoinWebSocketService', ['connect', 'disconnect']);
    mockWebSocketService.connect.and.returnValue(tradeStream$.asObservable());

    await TestBed.configureTestingModule({
      imports: [CandlestickChartComponent],
      providers: [
        { provide: BitcoinWebSocketService, useValue: mockWebSocketService },
        provideHttpClient(), // ✅ This resolves the HttpClient error
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CandlestickChartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should update latestPrice when trade data comes in', () => {
    fixture.detectChanges();
    tradeStream$.next({ p: '29755.12' });
    expect(component.latestPrice).toBe('29755.12');
  });

  it('should call disconnect on destroy', () => {
    fixture.detectChanges();
    fixture.destroy();
    expect(mockWebSocketService.disconnect).toHaveBeenCalled();
  });
});
