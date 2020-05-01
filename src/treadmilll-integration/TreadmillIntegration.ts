import GpIo from 'onoff';

export class TreadmillIntegration {
 

const ldrThreshold = 5000;
let ldrLastState = 0;

console.log("hello");

var ldr = new gpio(4, 'out');
async function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
  }

const measureLdr = async () => {
	let timeMs = 0;
	ldr.setDirection('out');
	ldr.writeSync(0);
	await sleep(2);
	while(ldr.readSync()){}
	// then measure how long it takes to become high
	ldr.setDirection('in');
	while (!ldr.readSync()) {
		timeMs++;
		}
	// console.log("time", timeMs);
	return timeMs;
}

const loop = async () =>{
	// measure LED
	// if < threshold, say pulse
	if (await measureLdr() < ldrThreshold) {
		if (ldrLastState === 0) {
			console.log("pulse");
			ldrLastState = 1;
		}
	} else {
		ldrLastState = 0;
	}

	setTimeout(loop,10);
};

loop();




}