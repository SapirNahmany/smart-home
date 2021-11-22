import { Response } from "express";
import SmartDevice from "./SmartDevice";
import Signal from "./Signal";

const HOUR_IN_MS = 60 * 60 * 1000;
const TWENTY_FIVE_MIN = 25 * 60 * 1000;

export default class WaterHeater extends SmartDevice {
    
    private nextComingHomeTimingsInMs: number;
    //predefined coming back home times
    private comingHomeTimings: Array<number> = [
        HOUR_IN_MS * 0.5,
        HOUR_IN_MS * 2.5,
        HOUR_IN_MS * 3.25,
        HOUR_IN_MS * 3.5
    ];

    constructor(defaultSignal: Signal) {
        super(defaultSignal);
        this.isOn = false;
        this.nextComingHomeTimingsInMs = Date.now() + this.comingHomeTimings[0];
        setTimeout(this.onComingHome.bind(this), this.comingHomeTimings[0]);
    }

    onComingHome(): void {
        const lastComingHomeTime = this.comingHomeTimings[0];
        this.comingHomeTimings = this.comingHomeTimings.slice(1); //pop
        if (this.comingHomeTimings.length >= 1) {
            this.nextComingHomeTimingsInMs = Date.now() + this.comingHomeTimings[0] - lastComingHomeTime;
            setTimeout(this.onComingHome.bind(this), this.comingHomeTimings[0] - lastComingHomeTime);
        }
    }

    updateSignal(newSignal: Signal, res: Response): void {
        super.updateSignal(newSignal, res);
        console.log(`Signal: ${newSignal} arrived`);
        const responseBody: WaterHeaterResponse = {
            status: this.isOn ? "on" : "off"
        };
        if (newSignal === Signal.COLD) {
            //someone coming home in the next hour
            if (Date.now() + HOUR_IN_MS >= this.nextComingHomeTimingsInMs && this.comingHomeTimings.length > 0) {
                responseBody.status = "on";
                responseBody.message = "Tunred water-heater on for 25 minutes, since someone coming home in the next hour";
                this.turnOn();
                setTimeout(this.turnOff.bind(this), TWENTY_FIVE_MIN);   
            } else{
                responseBody.status = this.isOn ? "on": "off";
                responseBody.message = "Water-heater dose not turning on, since no one is coming home in the next hour";
            }
        } else{
            responseBody.message = `Water-heater dose not turning on sicne ${newSignal} signal arrived.`
        }

        res.json(responseBody).status(200);
    }

    turnOff(): void {
        this.isOn = false;
        console.log("Tunred water-heater off");
    }

    turnOn(): void {
        this.isOn = true;
        console.log("Tunred water-heater on");
    }
}

type WaterHeaterResponse = {
    status: "on" | "off";
    message?: string;
}