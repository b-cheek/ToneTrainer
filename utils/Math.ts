export const getRndNum = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
}

export const getRndInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(getRndNum(min, max + 1));
}

export const getRndSign = () => {
    return Math.random() < 0.5 ? -1 : 1;
}

// because js uses remainder not modulo :(
export const modulo = (a: number, b: number) => {
    return ((a % b) + b) % b;
}