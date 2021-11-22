import { Response } from "express";
import Signal from "./Signal";

export default abstract class SmatrtDevice {
    protected signal: Signal;
    protected isOn: boolean = false;

    constructor(defaultSignal: Signal) {
        this.signal = defaultSignal;
    }

    public updateSignal(newSignal: Signal, res: Response): void {
        this.signal = newSignal;
    }
}