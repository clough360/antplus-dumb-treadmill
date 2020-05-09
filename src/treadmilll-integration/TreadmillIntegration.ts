import { ISpeedInformation } from "../api/Api";
import { lookup } from "dns";

const Gpio = require('pigpio').Gpio;

export type SpeedUnits = 'mps' | 'mph' | 'kph';

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

		this.loop();
	}

	// set the speed in metres per second
	public setSpeed(speed: number, units: SpeedUnits = 'mps') {
		switch (units) {
			case 'mps': this.targetSpeedMps = speed; break;
			case 'mph': this.targetSpeedMps = speed / 2.23694; break;
			case 'kph': this.targetSpeedMps = speed / 3.6000059687997; break;
		}
	}

	public getSpeed(units: SpeedUnits = 'mps'): ISpeedInformation {
		switch (units) {
			case 'mps': return {targetSpeed: this.targetSpeedMps, currentSpeed: this.currentSpeedMps, units: units};
			case 'mph': return {targetSpeed: this.targetSpeedMps * 2.23694, currentSpeed: this.currentSpeedMps * 2.23694, units: units};
			case 'kph': return {targetSpeed: this.targetSpeedMps * 3.6000059687997, currentSpeed: this.currentSpeedMps * 3.6000059687997, units: units};
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

			const dc = Math.trunc(this.currentSpeedMps * this.speedMpsToDutyCycleFactor);
			console.log('setting pwm dc', dc);
			this.speedPwm.pwmWrite(dc);
		}
		setTimeout(this.loop.bind(this),10);
	}
}