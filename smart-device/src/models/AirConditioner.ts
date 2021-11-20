import { Response } from "express";
import SmartDevice from "./SmartDevice";
import Signal from "./Signal";

const ROOM_TEMPERATURE = 25;
const MIN_TEMPERATURE = 16;
const MAX_TEMPERATURE = 32;

// TODO -> singelton
export default class AirConditioner extends SmartDevice {
    private degrees: number;

    // air conditioner is on when app is starting
    constructor(defaultSignal: Signal) {
        super(defaultSignal);
        this.isOn = true;
        this.degrees = ROOM_TEMPERATURE;
    }

    updateSignal(newSignal: Signal, res: Response): void {
        super.updateSignal(newSignal, res);
        console.log(`Signal: ${newSignal} arrived`);
        if (this.signal === Signal.NORMAL) {
            if (this.isOn) {
                this.turnOff();
            } else {
                console.log("Air Conditioner is already off");
            }
        } else {
            if (!this.isOn) {
                this.turnOn();
            }
            if (this.signal === Signal.HOT) {
                this.decreaseTemperature();
            } else { // this.signal === Signal.COLD
                this.increaseTemperature();
            }
        }
        const responseBody: AirConditionerResponse = {
            status: this.isOn ? "on" : "off",
        };
        if (this.isOn) {
            responseBody.temperature = this.degrees;
        }
        res.json(responseBody).status(200);
    }

    decreaseTemperature(): void {
        if (this.degrees - 10 < MIN_TEMPERATURE) {
            this.degrees = MIN_TEMPERATURE;
        } else {
            this.degrees -= 10;
        }
        console.log(`Temperature decreased to ${this.degrees} degrees`);
    }

    increaseTemperature(): void {
        if (this.degrees + 13 > MAX_TEMPERATURE) {
            this.degrees = MAX_TEMPERATURE;
        } else {
            this.degrees += 13;
        }
        console.log(`Temperature increased to ${this.degrees} degrees`);
    }

    turnOff(): void {
        this.isOn = false;
        console.log("Tunred air-conditioner off");
    }

    turnOn(): void {
        this.isOn = true;
        console.log("Tunred air-conditioner on");
    }
}

type AirConditionerResponse = {
    status: "on" | "off";
    temperature?: number;
}