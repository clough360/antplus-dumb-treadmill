import * as express from 'express';
import { SpeedUnits } from '../treadmilll-integration/TreadmillIntegration';

export interface ISpeedInformation {
    targetSpeed: number;
    currentSpeed: number;
    units: SpeedUnits;
}

export type OnGetSpeed = () => ISpeedInformation;

export class Api {
    private app: express.Express;

    constructor(port: number = 5000, onGetSpeed: OnGetSpeed ) {
        console.log("api");
        this.app = express();  

        this.app.get('/', (request, response) => {
            response.send('Hello world!');
        });
       
        this.app.get('/speed', (request, response) => {
            console.log("/speed", JSON.stringify(onGetSpeed()));
            response.send(JSON.stringify(onGetSpeed()));
        });

        this.app.put('/speed?speed=:speed&units=:units', function(request, response) => {
            console.log("set speed");
        });

        console.log("Starting api on port ", port);
        this.app.listen(port);
    }
}