// import {Gpio} from 'onoff';
const Gpio = require('pigpio').Gpio;

// import {GarminStick2 } from './ant/ant';
// import { StrideBasedSpeedAndDistanceMonitor } from './ant/testSensor';
import { TreadmillIntegration } from './treadmilll-integration/TreadmillIntegration';
import { Api, ISpeedInformation } from './api/Api';

const treadmill = new TreadmillIntegration();

treadmill.setSpeed(1, 'mps');

const handleOnGetSpeed = (): ISpeedInformation => {return treadmill.getSpeed()};

const api = new Api(5000, handleOnGetSpeed);
const mainLoop = () => {
	setTimeout(mainLoop, 1000);

}



mainLoop();