const Gpio = require('pigpio').Gpio;

export type speedUnits = 'mps' | 'mph' | 'kph';

export class TreadmillIntegration {

	private targetSpeedMps = 0;
	private currentSpeedMps = 0;
	// rate that speed will be ramped up or down
	private speedChangeRate = 0.1;

	// speed pwm settings
	// duty cycle between 0 and 255
	private speedPwm: any;
	private pwmFrequency = 20;
	private speedMpsToDutyCycleFactor = 10;

	constructor() {
		this.speedPwm = new Gpio(17, {mode: Gpio.OUTPUT});
		this.speedPwm.pwmFrequency(this.pwmFrequency);
		this.speedPwm.pwmWrite(0);

	}

	// set the speed in metres per second
	public setSpeed(speed: number, units: speedUnits = 'mps') {
		switch (units) {
			case 'mps': this.targetSpeedMps = speed; break;
			case 'mph': this.targetSpeedMps = speed / 2.23694; break;
			case 'kph': this.targetSpeedMps = speed / 3.6000059687997; break;
		}
	}

	public async loop() {
		const speedDelta = this.targetSpeedMps - this.currentSpeedMps;

		// gradually move towards the target speed, unless within tolerance
		if (speedDelta !== 0) {
			if (Math.abs(speedDelta) < this.speedChangeRate) {
				this.currentSpeedMps = this.targetSpeedMps
			} else if (speedDelta > 0) {
				this.currentSpeedMps += this.speedChangeRate;
			} else {
				this.currentSpeedMps -= this.speedChangeRate;
			}

			this.speedPwm.setDutyCycle(this.currentSpeedMps * this.speedMpsToDutyCycleFactor);
		}
		setTimeout(this.loop.bind(this),10);
	}
}