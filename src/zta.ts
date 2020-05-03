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

const handleOnTreadmillReady = () => {
	treadmillReady = true;
};

const treadmill = new TreadmillIntegration(2.5, handleOnTreadmillReady);

const handleOnPulse = (count: number) => {
	console.log("pulse", count);
}

treadmill.onPulse = handleOnPulse;

const mainLoop = () => {
	setTimeout(mainLoop, 1000);
	if (treadmillReady) {
		console.log('ti', treadmill.revolutionCount, treadmill.lastSpeedReadingMps, treadmill.currentSpeedMps);
	}
}

mainLoop();