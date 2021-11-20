import { Response } from "express";
import Signal from "./Signal";

// TODO -> singelton
export default abstract class SmatrtDevice {
    protected signal: Signal;
    protected isOn: boolean = false;

    constructor(defaultSignal: Signal) {
        this.signal = defaultSignal;
    }

    // TODO -> maybe override in sons methods and not use res here
    public updateSignal(newSignal: Signal, res: Response): void {
        this.signal = newSignal;
    }
}