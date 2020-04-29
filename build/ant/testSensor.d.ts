/// <reference types="node" />
import * as Ant from '../ant/ant';
export declare class testSensor extends Ant.AntPlusSensor {
    static DEVICE_TYPE: number;
    static CHANNEL_TYPE: number;
    static TRANSMISSION_TYPE: number;
    static DEVICE_NUMBER: number;
    private messageCount;
    constructor(stick: any);
    attach(channel: any, deviceID: any): void;
    private nextPage;
    private nextCommonPage;
    send(): void;
    dataPage1(speed: number): Buffer;
    dataPage2(cadence: number): Buffer;
    sendCommonPages(): void;
    commonPage80(): Buffer;
    commonPage81(): Buffer;
}
