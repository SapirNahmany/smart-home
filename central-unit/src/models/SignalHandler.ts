import axios, { AxiosResponse } from "axios";
import Signal from "./Signal";

const HOUR = 20 * 1000; // TODO -> use as env var

// TODO -> singelton
export default class SignalHandler {

    initHandler(): void {
        setInterval(this.cycle.bind(this), HOUR);
    }

    async cycle(): Promise<void> {
        try {
            const { data: weather } = await this.fetchWeather();
            const signal = this.convertTemperatureToSignal(weather.main.temp);
            console.log(`Going to send a new signal to the smart devices: ${signal}`);
            await this.sendSignalToConnectedDevices(signal);
        } catch (error) {
            console.log(`Will try again in ${HOUR} ms from now`);
        }
    }

    async sendSignalToConnectedDevices(signal: Signal): Promise<void> {
        const smartDevicesUrls = process.env.DEVICES_URLS.split(",");

        const promises = smartDevicesUrls.map(async (deviceUrl) =>{
            try {
                const response = await axios.post(`${deviceUrl}/signal`, { signal });
                console.log(`Got response from ${deviceUrl}: ${JSON.stringify(response.data)}`);
            } catch (error) {
                console.error(`Failed to update signal for ${deviceUrl}`, error.message);
                throw error;
            }
        });

        await Promise.all(promises);
    }

    async fetchWeather(): Promise<AxiosResponse> {
        try {
            const response = await axios.get(process.env.WEATHER_API_URL, {
                params: {
                    q: process.env.CITY_NAME,
                    appid: process.env.API_KEY,
                    units: "metric" // this will fetch temerature as Celsius
                }
            });
            console.log(`The response body from weather API: ${JSON.stringify(response.data)}`);
            return response;
        } catch (error) {
            console.error("Failed to fetch wether", error.message);
            throw error;
        }
    }

    convertTemperatureToSignal(degrees: number): Signal {
        if (degrees > 30) {
            return Signal.HOT;
        } else if (degrees < 15) {
            return Signal.COLD;
        }
        return Signal.NORMAL;
    }
}