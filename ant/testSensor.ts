import * as Ant from '../ant/ant';
import { Z_BEST_SPEED } from 'zlib';
import { kStringMaxLength } from 'buffer';
// import * as AntPlus from 'ant-plus';

export class testSensor extends Ant.AntPlusSensor {
    static DEVICE_TYPE = 124;
    static CHANNEL_TYPE = 0x10; // master
    static TRANSMISSION_TYPE = 5; // transmit and receive
    static DEVICE_NUMBER = 1;

    private messageCount: number = 0;

    constructor(stick) {
		super(stick);
		// this.decodeDataCbk = this.decodeData.bind(this);
    }
    
    
	public attach(channel, deviceID) {
		super.attach(channel, 'transmit', deviceID, testSensor.DEVICE_TYPE, testSensor.TRANSMISSION_TYPE, 255, 8134);
        // this.state = new StrideSpeedDistanceSensorState(deviceID);
    
    }
    
    private nextPage: number = 1;
    private nextCommonPage: number = 80;

    public send() {
        // specification is to send data pages for 64 messages followed by a common page
        // followed by 64 data messages and another common page
        // message frequency should be approx 4hz
        if (this.nextPage < 100) {
            if (this.nextPage === 1) {
                this.write(this.dataPage1(1.0), 'dp1');
                this.nextPage = 2;
            }
            else if (this.nextPage === 2) {
                // this.write(this.dataPage2(this.messageCount), 'dp2');
                this.nextPage = 1;
            }
            this.messageCount++;

            if (this.messageCount >= 64) {
                this.nextPage = 100;
            }
        }
        else if (this.nextPage >= 100) {
            if (this.nextCommonPage === 80) {
                this.write(this.commonPage80(), 'cp80');
            }
            if (this.nextCommonPage === 81) {
                this.write(this.commonPage81(), 'cp81');
            }
            this.nextPage++;
            if (this.nextPage >=102) {
                this.nextPage = 1;
                this.messageCount = 0;
                if (this.nextCommonPage === 80) {
                    this.nextCommonPage = 81;
                } else {
                    this.nextCommonPage = 80;
                }
            }
        }
    }

    private applyMinMax(value: number, max: number, min: number = 0): number {
        if (value > max) {
            value = max;
        } else if (value < min ) {
            value = min;
        }
        return value;
    }

    // gets the fractional part of a number, and scales it 
    private getFractional(value: number, scale: number = 256): number {
        return Math.floor((value - Math.floor(value)) * scale);
    }
    public dataPage1(speed: number): Buffer {
        // speed is in metres per second, max 4 bits (15)
  
        speed = this.applyMinMax(speed, 15);
        console.log("speed", speed, "f", this.getFractional(speed,256));
        let payload: number[] = [];
        payload = payload.concat(Ant.Messages.intToLEHexArray(0x01));   // data page number
        payload = payload.concat(Ant.Messages.intToLEHexArray(0));      // time fractional (1/200s)
        payload = payload.concat(Ant.Messages.intToLEHexArray(0));      // time integer (s)
        payload = payload.concat(Ant.Messages.intToLEHexArray(0));      // distance accumulated (m)
        payload = payload.concat(Ant.Messages.intToLEHexArray(Math.floor(speed)));  // instantaneous speed (lower 4bits) and distance fractional (upper 4 bits)
        payload = payload.concat(Ant.Messages.intToLEHexArray(this.getFractional(speed, 256)));     // instantaneous speed fractional (1/256m/s)
        payload = payload.concat(Ant.Messages.intToLEHexArray(0));      // stride count
        payload = payload.concat(Ant.Messages.intToLEHexArray(0));      // update latency (1/32s)
        // return Buffer.from(payload);//
        return Ant.Messages.broadcastData(this.channel, payload);
        // return Ant.Messages.buildMessage(payload, Ant.Constants.MESSAGE_CHANNEL_BROADCAST_DATA);
    }

    public dataPage2(cadence: number): Buffer {
        let payload: number[] = [];
        payload = payload.concat(Ant.Messages.intToLEHexArray(0x01));   // data page number
        payload = payload.concat(Ant.Messages.intToLEHexArray(0xFF));   // reserved
        payload = payload.concat(Ant.Messages.intToLEHexArray(0xFF));   // reserved
        payload = payload.concat(Ant.Messages.intToLEHexArray(5 << 4 + 1)); // strides
        payload = payload.concat(Ant.Messages.intToLEHexArray(12));// instantaneous speed fractional
        payload = payload.concat(Ant.Messages.intToLEHexArray(0xFF));
        payload = payload.concat(Ant.Messages.intToLEHexArray(0x1));
        // return Buffer.from(payload);//Ant.Messages.broadcastData(payload);
        return Ant.Messages.broadcastData(this.channel,payload);
        // return Ant.Messages.buildMessage(payload, Ant.Constants.MESSAGE_CHANNEL_BROADCAST_DATA);
    }

    public sendCommonPages() {
        console.log('sendCommon');
        // only common page 80 and 81 are required
        this.write(this.commonPage80(), 'cp80');
        this.write(this.commonPage81(), 'cp81');
        this.addListener
    }

    public commonPage80(): Buffer {
        let payload: number[] = [];
        payload = payload.concat(Ant.Messages.intToLEHexArray(0x50));   // data page number (80)
        payload = payload.concat(Ant.Messages.intToLEHexArray(0xFF));   // reserved
        payload = payload.concat(Ant.Messages.intToLEHexArray(0xFF));   // reserved
        payload = payload.concat(Ant.Messages.intToLEHexArray(0x01));   // hw revision
        payload = payload.concat(Ant.Messages.intToLEHexArray(0x01));   // mfr id LSB - does this need to be garmin?
        payload = payload.concat(Ant.Messages.intToLEHexArray(0x02));   // mfr id MSB
        payload = payload.concat(Ant.Messages.intToLEHexArray(0x01));   // model LSB
        payload = payload.concat(Ant.Messages.intToLEHexArray(0x00));   // model MSB
        // return Buffer.from(payload);//Ant.Messages.broadcastData(payload);
        return Ant.Messages.buildMessage(payload, Ant.Constants.MESSAGE_CHANNEL_BROADCAST_DATA);
    }

    public commonPage81(): Buffer {
        let payload: number[] = [];
        payload = payload.concat(Ant.Messages.intToLEHexArray(0x51));   // data page number (81)
        payload = payload.concat(Ant.Messages.intToLEHexArray(0xFF));   // reserved
        payload = payload.concat(Ant.Messages.intToLEHexArray(0xFF));   // reserved
        payload = payload.concat(Ant.Messages.intToLEHexArray(0x01));   // sw revision
        payload = payload.concat(Ant.Messages.intToLEHexArray(0xFF));   // serial number
        payload = payload.concat(Ant.Messages.intToLEHexArray(0x00));   // serial number
        payload = payload.concat(Ant.Messages.intToLEHexArray(0x00));   // serial number
        payload = payload.concat(Ant.Messages.intToLEHexArray(0x00));   // serial number
        return Buffer.from(payload);//Ant.Messages.broadcastData(payload);
        // return Ant.Messages.buildMessage(payload, Ant.Constants.MESSAGE_CHANNEL_BROADCAST_DATA);
    }

    protected updateState(deviceId: number, data: Buffer) {
		// this.state.DeviceID = deviceId;
		// updateState(this, this.state, this.page, data);
	}

}