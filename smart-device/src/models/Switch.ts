import { Response } from "express";
import SmartDevice from "./SmartDevice";
import Signal from "./Signal";

export default class Switch extends SmartDevice {

    constructor(defaultSignal: Signal) {
        super(defaultSignal);
    }

    updateSignal(newSignal: Signal, res: Response): void {
        super.updateSignal(newSignal, res);
        console.log(`Signal: ${newSignal} arrived`);
        if (this.signal === Signal.COLD) {
            this.turnOn();
        } else if (this.signal === Signal.HOT) {
            this.turnOff();
        } else { // this.signal === Signal.NORMAL
            console.log(`Light is staying ${this.isOn ? "on" : "off"}`);
        }
        const responseBody: SwitchResponse = {
            status: this.isOn ? "on" : "off"
        };
        res.json(responseBody).status(200);
    }

    turnOn(): void {
        if (this.isOn) {
            console.log("Light already on");
        } else {
            this.isOn = true;
            console.log("Light turned on");
        }
    }

    turnOff(): void {
        if (!this.isOn) {
            console.log("Light already off");
        } else {
            this.isOn = false;
            console.log("Light turned off");
        }
    }
}

type SwitchResponse = {
    status: "on" | "off";
}