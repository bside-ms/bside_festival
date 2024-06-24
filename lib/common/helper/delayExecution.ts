const delayExecution = (ms: number): Promise<void> => new Promise((resolve) => window.setTimeout(resolve, ms));

// ts-unused-exports:disable-next-line
export default delayExecution;
