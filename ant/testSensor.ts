import * as Ant from '../ant/ant';
import * as AntPlus from 'ant-plus';
import { throws } from 'assert';

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
        if (this.nextPage < 100) {
            if (this.nextPage === 1) {
                this.write(this.dataPage1(this.messageCount), 'dp1');
                this.nextPage = 2;
            }
            else if (this.nextPage === 2) {
                this.write(this.dataPage2(this.messageCount), 'dp2');
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

    public dataPage1(speed: number): Buffer {
        let payload: number[] = [];
        payload = payload.concat(Ant.Messages.intToLEHexArray(0x01));   // data page number
        payload = payload.concat(Ant.Messages.intToLEHexArray(0));
        payload = payload.concat(Ant.Messages.intToLEHexArray(0));
        payload = payload.concat(Ant.Messages.intToLEHexArray(0));
        payload = payload.concat(Ant.Messages.intToLEHexArray(17)); // instantaneous speed (lower 4bits) and distance fractional (upper 4 bits)
        payload = payload.concat(Ant.Messages.intToLEHexArray(12));// instantaneous speed fractional
        payload = payload.concat(Ant.Messages.intToLEHexArray(this.messageCount));
        payload = payload.concat(Ant.Messages.intToLEHexArray(0));
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