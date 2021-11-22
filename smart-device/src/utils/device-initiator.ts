import Signal from "../models/Signal";
import Switch from "../models/Switch";
import AirConditioner from "../models/AirConditioner";
import WaterHeater from "../models/WaterHeater";
import SmartDevice from "../models/SmartDevice";

let device: SmartDevice;

export const initDevice = (defaultSignal: Signal): SmartDevice => {
    if (process.env.DEVICE_TYPE === "switch") {
        device = new Switch(defaultSignal);
    } else if (process.env.DEVICE_TYPE === "air-conditioner") {
        device = new AirConditioner(defaultSignal);
    } else if (process.env.DEVICE_TYPE === "water-heater") {
        device = new WaterHeater(defaultSignal);
    } else {
        console.error("DEVICE_TYPE is mandatory and should be one of: switch / air-conditioner / water-heater");
        process.exit(1);
    }

    console.log(`The device is: ${process.env.DEVICE_TYPE}`);
    return device;
};