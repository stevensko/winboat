export async function waitForVariable(checkFn: Function, timeout = 5000, interval = 100) {
    const startTime = Date.now();

    // Check immediately first
    if (checkFn()) return;

    while (Date.now() - startTime < timeout) {
        if (checkFn()) return;
        await new Promise(resolve => setTimeout(resolve, interval));
    }

    throw new Error('Timeout waiting for variable');
}