const delayExecution = (ms: number): Promise<void> => (
    new Promise(resolve => window.setTimeout(resolve, ms))
);

export default delayExecution;
