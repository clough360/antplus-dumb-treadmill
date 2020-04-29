"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ant_1 = require("./ant/ant");
var testSensor_1 = require("./ant/testSensor");
var stick = new ant_1.GarminStick2();
var sensor = new testSensor_1.testSensor(stick);
sensor.on('attached', function () {
    console.log('sensor attached');
    wait();
});
stick.on('startup', function () {
    console.log('startup');
    sensor.attach(2, 2);
});
var wait = function () {
    setTimeout(wait, 250);
    sensor.send();
};
console.log("Open...");
if (!stick.open()) {
    console.log('Stick not found!');
}
//# sourceMappingURL=anty.js.map