// import {Gpio} from 'onoff';
const Gpio = require('pigpio').Gpio;

import {GarminStick2 } from './ant/ant';
import { StrideBasedSpeedAndDistanceMonitor } from './ant/testSensor';
import { TreadmillIntegration } from './treadmilll-integration/TreadmillIntegration';

// var stick = new GarminStick2();
// var sensor = new StrideBasedSpeedAndDistanceMonitor(stick);
// sensor.on('attached', () => {
// 	console.log('sensor attached');
// })

// stick.on('startup', function () {
// 	console.log('startup');
// 	sensor.attach(2,2);
// });

// console.log("Open...");
// if (!stick.open()) {
// 	console.log('Stick not found!');
// }

let treadmillReady = false;

// const handleOnTreadmillReady = () => {
// 	treadmillReady = true;
// };

// const treadmill = new TreadmillIntegration(2.86, handleOnTreadmillReady);

// const handleOnPulse = (count: number) => {
// 	console.log("pulse", count);
// }

// treadmill.onPulse = handleOnPulse;

// const debug = (output: string, ...additional: any[] ) => {
// 	let text = output;
// 	if (additional) {
// 		additional.forEach(a => text += ' ' + a.toString());
// 	}
//     process.stdout.clearLine(-1);
//     process.stdout.cursorTo(0);
//     process.stdout.write(text);
// }

const setTreadmillSpeed = (speed: number): void => {

}

const speedPwm = new Gpio(17, {mode: Gpio.OUTPUT});
 
let dutyCycle = 50;
 
speedPwm.pwmFrequency(20);
speedPwm.pwmWrite(dutyCycle,);
const mainLoop = () => {
	setTimeout(mainLoop, 1000);
	// if (treadmillReady) {
	// 	debug('tiy', treadmill.revolutionCount, treadmill.lastSpeedReadingMps, treadmill.currentSpeedMps, treadmill.lastLdrDuration, treadmill.ldrThreshold);
	// }

	// const pwm = new Gpio(7, 'output', Option
	// )
	setTreadmillSpeed(1);
}



mainLoop();