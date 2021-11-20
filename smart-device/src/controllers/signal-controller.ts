import { Request, Response, NextFunction } from "express";
import { initDevice } from "../utils/device-initiator";
import SmatrtDevice from "../models/SmartDevice";
import Signal, { verifySignal } from "../models/Signal";

export default class SignalController {

    private device: SmatrtDevice;

    constructor(defaultSignal: Signal) {
        this.device = initDevice(defaultSignal);
    }

    updateSignal(req: Request, res: Response): void {
        console.debug("Going to handle the request");
        const { signal } = req.body;
        this.device.updateSignal(signal as Signal, res);
    }

    validateRequestBody(req: Request, res: Response, next: NextFunction): void {
        console.debug("Going to verify the request body");
        const { signal } = req.body;
        if (!signal || !verifySignal(signal)) {
            res.json({ message: "property 'signal' is mandatory and should be one of: COLD, HOT, NORMAL"}).status(400);
        } else {
            next();
        }    
    }
}