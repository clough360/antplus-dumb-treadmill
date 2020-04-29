import {GarminStick2 } from './ant/ant';
import { testSensor } from './ant/testSensor';


var stick = new GarminStick2();
var sensor = new testSensor(stick);
sensor.on('attached', () => {
	console.log('sensor attached');
wait();

})

stick.on('startup', function () {
	console.log('startup');
	sensor.attach(2,2);
});


const wait = () => {
	setTimeout(wait, 250)
	sensor.send();
};

console.log("Open...");
if (!stick.open()) {
	console.log('Stick not found!');
}





