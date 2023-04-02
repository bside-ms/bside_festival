const isNotEmptyNumber = (value: number | null | undefined): value is number => typeof value === 'number' && value > 0;

export default isNotEmptyNumber;
