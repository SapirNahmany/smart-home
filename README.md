# Smart Home

## General Info

This project is a smart home simulator which simulates a central unit that controls a set of smart devices.

The system consists of a central unit service and three smart devices services - Switch, Air-conditioner and Water-heater.

The central unit fetches every hour weather data from a third-party API,
and sends to the devices one of the following signals: HOT/COLD/NORMAL, according to the current temperature.

Every smart device react to the signals according to required logic.


## Technologies
NodeJs, Express ,TypeScript

## Setup Instructions and Running Local

Clone this repository. You will need `node` and `npm` installed globally on your machine.  

**A ".env" file with the following parameters needs to be added to the central-unit root.**

PORT=3000

CITY_NAME=Tel-Aviv

API_KEY - from your account in <a href = "https://openweathermap.org/">OpenWeather</a>

WEATHER_API_URL=http://api.openweathermap.org/data/2.5/weather

DEVICES_URLS=http://localhost:3001,http://localhost:3002,http://localhost:3003

**Installation:**

In "smart-device" folder run the following command:

`npm install -g cross-env`

In both folders - "smart-device" and "central-unit" run the following command:

`npm install`  

**To Start the services:**

Open four terminals.
It is recommended to run the smart devices before the central unit.

**Run the smart devices:**

Enter the smart-device dir and run the following commands, each in a seperate terminal.

`npm run start-switch`

`npm run start-air-conditioner`

`npm run start-water-heater`

**Run the central unit:**

Enter the central-unit dir and run the following command in a seperate terminal.

`npm run start`

