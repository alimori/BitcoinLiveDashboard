import { aggregateTradesToCandle } from './candle-aggregator';
import { BinanceTrade } from '../../models/trade.model';
import { UTCTimestamp } from 'lightweight-charts';


describe('aggregateTradesToCandle', () => {
  it('should return null for an empty trade array', () => {
    const result = aggregateTradesToCandle([]);
    expect(result).toBeNull();
  });

  it('should correctly aggregate trades into a candle', () => {
    const trades: BinanceTrade[] = [
      { e: 'trade', E: 0, s: 'BTCUSDT', t: 1, p: '100.00', q: '0.1', b: 1, a: 2, T: 1690000000000, m: true, M: true },
      { e: 'trade', E: 0, s: 'BTCUSDT', t: 2, p: '105.00', q: '0.2', b: 3, a: 4, T: 1690000001000, m: true, M: true },
      { e: 'trade', E: 0, s: 'BTCUSDT', t: 3, p: '95.00',  q: '0.3', b: 5, a: 6, T: 1690000002000, m: true, M: true },
      { e: 'trade', E: 0, s: 'BTCUSDT', t: 4, p: '110.00', q: '0.4', b: 7, a: 8, T: 1690000003000, m: true, M: true },
      { e: 'trade', E: 0, s: 'BTCUSDT', t: 5, p: '102.00', q: '0.5', b: 9, a: 10, T: 1690000004000, m: true, M: true },
    ];

    const result = aggregateTradesToCandle(trades);

    expect(result).toEqual({
      time: 1690000000 as UTCTimestamp,
      open: 100.0,
      high: 110.0,
      low: 95.0,
      close: 102.0,
    });
  });
});
