import {Gpio} from 'onoff';

export class TreadmillIntegration {
	public ldrThreshold = 0;
	private ldrLastState = 0;
	private ldr: Gpio;
	private onReady: () => void;
	private lastReadingTime: [number,number] = [0,0];
	
	public beltLengthM = 0;
	public lastSpeedReadingMps = 0;		// last speed reading actually measured
	public currentSpeedMps = 0;			// current speed, possibly calculated
	public revolutionCount = 0;

	public lastLdrDuration = 0;

	constructor(beltLengthM: number, onReady: () => void) {
		console.log("starting treadmill integration")
		this.beltLengthM = beltLengthM;
		this.onReady = onReady;

		this.ldr = new Gpio(4, 'out');
		this.initialise();
	}

	public onPulse: (elapsedTimeS: number, speedMps: number) => void;

	private async sleep(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	private async initialise(): Promise<void> {
		var totalDelay = 0;
		for (var i=0; i<10; i++) {
			totalDelay += await this.measureLdr();
		}
		// set the threshold to be mean delay - 10%
		this.ldrThreshold = (totalDelay / 10) * 0.9;

		console.log('ti', 'LDR threshold: ', this.ldrThreshold);


		this.loop();

		this.onReady()
	}

	private async measureLdr(): Promise<number> {
		let elapsedIterations = 0;
		this.ldr.setDirection('out');
		this.ldr.writeSync(0);
		// allow the output pin to reach zero
		await this.sleep(2);

		while(this.ldr.readSync()){}
			// then measure how long it takes to become high
			this.ldr.setDirection('in');
			while (!this.ldr.readSync()) {
				elapsedIterations++;
			}
		this.lastLdrDuration = elapsedIterations;
		return elapsedIterations;
	}

	private async isLdrActive():Promise<boolean> {
		const tldr = await this.measureLdr();
		return (tldr < this.ldrThreshold);
	}

	public async loop() {
		
		// we calculate the speed every loop, because if it turns out to be slower than the
		// last read speed, we set the current speed to be the lower value (for the case that the treadmill is 
		// spinning down, potentially to a stop)
		// if no reading for a while, speed is zero
		let speedNow = 0;
		if (process.hrtime(this.lastReadingTime)[0] > 10) {
			this.lastSpeedReadingMps = 0;
			this.lastReadingTime = [0,0];
			this.currentSpeedMps = 0;
		} else {
			speedNow = this.calculateSpeedMps();
			if (speedNow < this.currentSpeedMps) {
				this.currentSpeedMps = speedNow;
			}
		}

		if (await this.isLdrActive()) {
			// ldr has tripped, record the current speed as the last recorded speed
			if (this.ldrLastState === 0) {
				this.ldrLastState = 1;
				this.lastReadingTime = process.hrtime();
				this.lastSpeedReadingMps = speedNow;
				this.currentSpeedMps = speedNow;
				this.revolutionCount++;
			}
		} else {
			this.ldrLastState = 0;
		}
		setTimeout(this.loop.bind(this),10);
	}

	// calculate the speed in ms-1 based on the last actual reading
	private calculateSpeedMps(): number {
		const elapsedTimeHr = process.hrtime(this.lastReadingTime);
		const elapsedTimeS = elapsedTimeHr[0] + elapsedTimeHr[1] / 1000000000;
		return this.beltLengthM / elapsedTimeS;
	}
}