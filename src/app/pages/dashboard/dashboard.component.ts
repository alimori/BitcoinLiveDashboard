// chart/candlestick-chart.component.ts

import {
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { CandlestickChartComponent } from '../../core/charts/candlestick-chart.component';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    imports: [CandlestickChartComponent]
})
export class DashboardComponent implements OnInit, OnDestroy {

    ngOnInit() {
    }

    ngOnDestroy() {
    }
}
