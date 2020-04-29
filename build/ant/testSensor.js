"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Ant = require("../ant/ant");
var testSensor = /** @class */ (function (_super) {
    __extends(testSensor, _super);
    function testSensor(stick) {
        var _this = _super.call(this, stick) || this;
        _this.messageCount = 0;
        _this.nextPage = 1;
        _this.nextCommonPage = 80;
        return _this;
        // this.decodeDataCbk = this.decodeData.bind(this);
    }
    testSensor.prototype.attach = function (channel, deviceID) {
        _super.prototype.attach.call(this, channel, 'transmit', deviceID, testSensor.DEVICE_TYPE, testSensor.TRANSMISSION_TYPE, 255, 8134);
        // this.state = new StrideSpeedDistanceSensorState(deviceID);
    };
    testSensor.prototype.send = function () {
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
            if (this.nextPage >= 102) {
                this.nextPage = 1;
                this.messageCount = 0;
                if (this.nextCommonPage === 80) {
                    this.nextCommonPage = 81;
                }
                else {
                    this.nextCommonPage = 80;
                }
            }
        }
    };
    testSensor.prototype.dataPage1 = function (speed) {
        var payload = [];
        payload = payload.concat(Ant.Messages.intToLEHexArray(0x01)); // data page number
        payload = payload.concat(Ant.Messages.intToLEHexArray(0));
        payload = payload.concat(Ant.Messages.intToLEHexArray(0));
        payload = payload.concat(Ant.Messages.intToLEHexArray(0));
        payload = payload.concat(Ant.Messages.intToLEHexArray(17)); // instantaneous speed (lower 4bits) and distance fractional (upper 4 bits)
        payload = payload.concat(Ant.Messages.intToLEHexArray(12)); // instantaneous speed fractional
        payload = payload.concat(Ant.Messages.intToLEHexArray(this.messageCount));
        payload = payload.concat(Ant.Messages.intToLEHexArray(0));
        // return Buffer.from(payload);//
        return Ant.Messages.acknowledgedData(payload);
        // return Ant.Messages.buildMessage(payload, Ant.Constants.MESSAGE_CHANNEL_BROADCAST_DATA);
    };
    testSensor.prototype.dataPage2 = function (cadence) {
        var payload = [];
        payload = payload.concat(Ant.Messages.intToLEHexArray(0x01)); // data page number
        payload = payload.concat(Ant.Messages.intToLEHexArray(0xFF)); // reserved
        payload = payload.concat(Ant.Messages.intToLEHexArray(0xFF)); // reserved
        payload = payload.concat(Ant.Messages.intToLEHexArray(5 << 4 + 1)); // strides
        payload = payload.concat(Ant.Messages.intToLEHexArray(12)); // instantaneous speed fractional
        payload = payload.concat(Ant.Messages.intToLEHexArray(0xFF));
        payload = payload.concat(Ant.Messages.intToLEHexArray(0x1));
        return Buffer.from(payload); //Ant.Messages.broadcastData(payload);
        // return Ant.Messages.broadcastData(payload);
        // return Ant.Messages.buildMessage(payload, Ant.Constants.MESSAGE_CHANNEL_BROADCAST_DATA);
    };
    testSensor.prototype.sendCommonPages = function () {
        console.log('sendCommon');
        // only common page 80 and 81 are required
        this.write(this.commonPage80(), 'cp80');
        this.write(this.commonPage81(), 'cp81');
        this.addListener;
    };
    testSensor.prototype.commonPage80 = function () {
        var payload = [];
        payload = payload.concat(Ant.Messages.intToLEHexArray(0x50)); // data page number (80)
        payload = payload.concat(Ant.Messages.intToLEHexArray(0xFF)); // reserved
        payload = payload.concat(Ant.Messages.intToLEHexArray(0xFF)); // reserved
        payload = payload.concat(Ant.Messages.intToLEHexArray(0x01)); // hw revision
        payload = payload.concat(Ant.Messages.intToLEHexArray(0x01)); // mfr id LSB - does this need to be garmin?
        payload = payload.concat(Ant.Messages.intToLEHexArray(0x02)); // mfr id MSB
        payload = payload.concat(Ant.Messages.intToLEHexArray(0x01)); // model LSB
        payload = payload.concat(Ant.Messages.intToLEHexArray(0x00)); // model MSB
        return Buffer.from(payload); //Ant.Messages.broadcastData(payload);
        // return Ant.Messages.buildMessage(payload, Ant.Constants.MESSAGE_CHANNEL_BROADCAST_DATA);
    };
    testSensor.prototype.commonPage81 = function () {
        var payload = [];
        payload = payload.concat(Ant.Messages.intToLEHexArray(0x51)); // data page number (81)
        payload = payload.concat(Ant.Messages.intToLEHexArray(0xFF)); // reserved
        payload = payload.concat(Ant.Messages.intToLEHexArray(0xFF)); // reserved
        payload = payload.concat(Ant.Messages.intToLEHexArray(0x01)); // sw revision
        payload = payload.concat(Ant.Messages.intToLEHexArray(0xFF)); // serial number
        payload = payload.concat(Ant.Messages.intToLEHexArray(0x00)); // serial number
        payload = payload.concat(Ant.Messages.intToLEHexArray(0x00)); // serial number
        payload = payload.concat(Ant.Messages.intToLEHexArray(0x00)); // serial number
        return Buffer.from(payload); //Ant.Messages.broadcastData(payload);
        // return Ant.Messages.buildMessage(payload, Ant.Constants.MESSAGE_CHANNEL_BROADCAST_DATA);
    };
    testSensor.DEVICE_TYPE = 124;
    testSensor.CHANNEL_TYPE = 0x10; // master
    testSensor.TRANSMISSION_TYPE = 5; // transmit and receive
    testSensor.DEVICE_NUMBER = 1;
    return testSensor;
}(Ant.AntPlusSensor));
exports.testSensor = testSensor;
//# sourceMappingURL=testSensor.js.map