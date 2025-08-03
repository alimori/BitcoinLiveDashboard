// core/services/websocket-factory.service.ts
import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({ providedIn: 'root' })
export class WebSocketFactoryService {
  create<T>(url: string): WebSocketSubject<T> {
    return webSocket<T>(url);
  }
}
