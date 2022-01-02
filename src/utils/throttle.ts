/**
 * A simple throttle implementation,
 * Copy and Pasted from: https://stackoverflow.com/questions/27078285/simple-throttle-in-javascript
 * 
 * @param func Function not throttled.
 * @param timeFrame Time in ms.
 * @returns Throttled function.
 */
 export const throttle = <T extends Function>(func: T, timeFrame: number = 500) => {
    let lastTime = 0;

    return function () {
        const now = Date.now();

        if (now - lastTime >= timeFrame) {
            func();
            lastTime = now;
        }
    };
}