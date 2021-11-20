enum Signal {
    COLD = "COLD",
    HOT = "HOT",
    NORMAL = "NORMAL"
}

export const verifySignal = (signal: string): boolean => {
    return signal === Signal.COLD || signal === Signal.HOT || signal === Signal.NORMAL;
};

export default Signal;