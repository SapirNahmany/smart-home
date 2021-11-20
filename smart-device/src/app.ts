import express from "express";
import bodyParser from "body-parser";
import Signal from "./models/Signal";
import SignalController from "./controllers/signal-controller";

// Create Express server
const app = express();

const signalController = new SignalController(Signal.NORMAL);

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/signal", 
    signalController.validateRequestBody.bind(signalController),
    signalController.updateSignal.bind(signalController)
);

app.listen(app.get("port"), () => {
    console.log(
        "  App is running at http://localhost:%d in %s mode",
        app.get("port"),
        app.get("env")
    );
    console.log("  Press CTRL-C to stop\n");
});

export default app;
