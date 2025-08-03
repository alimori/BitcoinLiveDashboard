import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UTCTimestamp } from 'lightweight-charts';
import { map } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class BitcoinHttpService {
    constructor(private http: HttpClient) { }

    getLastCandles(number: number = 1000) {
        const url = `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=${number}`;

        return this.http.get<any[]>(url).pipe(
            map((data) =>
                data.map((candle) => ({
                    time: Math.floor(candle[0] / 1000) as UTCTimestamp, // ✅ FIXED
                    open: parseFloat(candle[1]),
                    high: parseFloat(candle[2]),
                    low: parseFloat(candle[3]),
                    close: parseFloat(candle[4]),
                }))
            )
        );
    }
}
