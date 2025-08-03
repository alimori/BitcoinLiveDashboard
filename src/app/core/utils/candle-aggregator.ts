import { UTCTimestamp } from "lightweight-charts";
import { BinanceTrade, Candle } from "../../models/trade.model";


export function aggregateTradesToCandle(trades: BinanceTrade[]): Candle | null {
    if (trades.length === 0) return null;

    const open = parseFloat(trades[0].p);
    const close = parseFloat(trades[trades.length - 1].p);
    const prices = trades.map((t) => parseFloat(t.p));
    const high = Math.max(...prices);
    const low = Math.min(...prices);
    const time = Math.floor(trades[0].T / 1000) as UTCTimestamp; // ✅ fixed typing

    return { time, open, high, low, close };
}
