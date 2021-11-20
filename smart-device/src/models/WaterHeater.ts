import { Response } from "express";
import SmartDevice from "./SmartDevice";
import Signal from "./Signal";

const HOUR_IN_MS = 60 * 60 * 1000;
const TWENTY_FIVE_MIN = 25 * 60 * 1000;

// TODO -> singelton
export default class WaterHeater extends SmartDevice {
    
    private nextComingHomeTimingsInMs: number;

    // TODO -> should be sorted
    private comingHomeTimings: Array<number> = [
        HOUR_IN_MS * 0.5,
        HOUR_IN_MS * 3,
        HOUR_IN_MS * 4.5,
        HOUR_IN_MS * 15,
        HOUR_IN_MS * 24
    ];

    constructor(defaultSignal: Signal) {
        super(defaultSignal);
        this.isOn = false;
        this.nextComingHomeTimingsInMs = Date.now() + this.comingHomeTimings[0];
        setTimeout(this.onComingHome.bind(this), this.comingHomeTimings[0]);
    }

    onComingHome(): void {
        const lastComingHomeTime = this.comingHomeTimings[0];
        this.comingHomeTimings = this.comingHomeTimings.slice(1);
        if (this.comingHomeTimings.length > 1) {
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
            if (Date.now() + HOUR_IN_MS >= this.nextComingHomeTimingsInMs) {
                responseBody.status = "on";
                responseBody.message = this.isOn ? 
                    "Water Heater is already on" : 
                    "Tunred water-heater on for 25 minutes, since someone coming home in the next hour";
                if (!this.isOn) {
                    this.turnOn();
                    setTimeout(this.turnOff, TWENTY_FIVE_MIN);
                }
            }
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