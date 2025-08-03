import { UTCTimestamp } from "lightweight-charts";

export interface BinanceTrade {
    "e": string;
    "E": number;
    "s": string;
    "t": number;
    "p": string; // price
    "q": string;   // quantity
    "b": number;
    "a": number;
    "T": number;
    "m": boolean,
    "M": boolean
}

export interface HistoricalCandle {
    time: UTCTimestamp;
    open: number;
    high: number;
    low: number;
    close: number;
}

export interface Candle {
    time: UTCTimestamp;
    open: number;
    high: number;
    low: number;
    close: number;
}