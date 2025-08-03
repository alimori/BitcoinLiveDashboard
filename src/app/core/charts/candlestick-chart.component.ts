import {
    AfterViewInit,
    Component,
    ElementRef,
    OnDestroy,
    ViewChild,
} from '@angular/core';
import {
    createChart,
    IChartApi,
    ISeriesApi,
    UTCTimestamp,
} from 'lightweight-charts';
import { Subscription, interval } from 'rxjs';
import { BitcoinWebSocketService } from '../../core/services/bitcoin-websocket.service';
import { BitcoinHttpService } from '../../core/services/bitcoin-http.service';
import { aggregateTradesToCandle } from '../utils/candle-aggregator';
import { BinanceTrade, HistoricalCandle } from '../../models/trade.model';

@Component({
    selector: 'app-candlestick-chart',
    templateUrl: './candlestick-chart.component.html',
    styleUrls: ['./candlestick-chart.component.scss'],
})
export class CandlestickChartComponent implements AfterViewInit, OnDestroy {
    @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
    latestPrice: string = '';

    private chart!: IChartApi;
    private candleSeries!: ISeriesApi<'Candlestick'>;
    private tradesBuffer: BinanceTrade[] = [];
    private sub!: Subscription;
    private updateInterval: any;

    constructor(
        private wsService: BitcoinWebSocketService,
        private httpService: BitcoinHttpService
    ) { }

    ngAfterViewInit(): void {
        // this.chart = createChart(this.chartContainer.nativeElement, {
        //     width: this.chartContainer.nativeElement.offsetWidth,
        //     height: 400,
        //     layout: { background: { color: '#fff' }, textColor: '#000' },
        // });



        this.chart = createChart(this.chartContainer.nativeElement, {
            width: this.chartContainer.nativeElement.offsetWidth,
            height: 400,
            layout: {
                background: { color: '#ffffff' },
                textColor: '#000',
            },
            rightPriceScale: { visible: true },
            timeScale: {
                rightOffset: 0,             // ✅ No empty space at right
                fixLeftEdge: true,          // ✅ Fix start position
                rightBarStaysOnScroll: false, // ✅ Allow chart to push rightward
            },
        });




        this.candleSeries = this.chart.addCandlestickSeries();

        // Step 1: Load last 100 candles
        this.httpService.getLastCandles(1000).subscribe((candles: HistoricalCandle[]) => {
            this.candleSeries.setData(candles);
        });
        this.chart.timeScale().scrollToPosition(0, true); // ✅ scroll to start

        // Step 2: Start listening to live trades
        this.sub = this.wsService.connect().subscribe((trade) => {
            this.latestPrice = parseFloat(trade.p).toFixed(2);
            this.tradesBuffer.push(trade);
        });

        // Step 3: Aggregate trades into candles every 5s
        this.updateInterval = setInterval(() => {
            const newCandle = aggregateTradesToCandle(this.tradesBuffer);
            if (newCandle) {
                this.candleSeries.update(newCandle);
            }
            this.tradesBuffer = [];
        }, 5000);
    }

    ngOnDestroy(): void {
        this.sub?.unsubscribe();
        this.wsService.disconnect();
        clearInterval(this.updateInterval);
        this.chart?.remove();
    }
}

