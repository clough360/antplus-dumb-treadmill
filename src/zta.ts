import {GarminStick2 } from './ant/ant';
import { StrideBasedSpeedAndDistanceMonitor } from './ant/testSensor';


var stick = new GarminStick2();
var sensor = new StrideBasedSpeedAndDistanceMonitor(stick);
sensor.on('attached', () => {
	console.log('sensor attached');
wait();

})

stick.on('startup', function () {
	console.log('startup');
	sensor.attach(2,2);
});

console.log("Open...");
if (!stick.open()) {
	console.log('Stick not found!');
}


