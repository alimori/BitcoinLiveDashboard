// // core/services/bitcoin-websocket.service.ts

// import { Injectable } from '@angular/core';
// import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
// import { Observable, Subject } from 'rxjs';
// import { BinanceTrade } from '../../models/trade.model';

// @Injectable({ providedIn: 'root' })
// export class BitcoinWebSocketService {
//   private socket$?: WebSocketSubject<any>;
//   private trade$ = new Subject<BinanceTrade>();

//   connect(): Observable<BinanceTrade> {
//     if (!this.socket$ || this.socket$.closed) {
//       this.socket$ = webSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');

//       this.socket$.subscribe({
//         next: (msg: any) => {
//           this.trade$.next(msg);
//         },
//         error: (err) => console.error('WebSocket error', err),
//         complete: () => console.warn('WebSocket closed'),
//       });
//     }

//     return this.trade$.asObservable();
//   }

//   disconnect() {
//     this.socket$?.complete();
//   }
// }

// core/services/bitcoin-websocket.service.ts

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BinanceTrade } from '../../models/trade.model';
import { WebSocketFactoryService } from './websocket-factory.service';
import { WebSocketSubject } from 'rxjs/webSocket';

@Injectable({ providedIn: 'root' })
export class BitcoinWebSocketService {
  private socket$?: WebSocketSubject<any>;
  private trade$ = new Subject<BinanceTrade>();

  constructor(private wsFactory: WebSocketFactoryService) {}

  connect(): Observable<BinanceTrade> {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.wsFactory.create('wss://stream.binance.com:9443/ws/btcusdt@trade');

      this.socket$.subscribe({
        next: (msg: any) => {
          this.trade$.next(msg);
        },
        error: (err) => console.error('WebSocket error', err),
        complete: () => console.warn('WebSocket closed'),
      });
    }

    return this.trade$.asObservable();
  }

  disconnect() {
    this.socket$?.complete();
  }
}

