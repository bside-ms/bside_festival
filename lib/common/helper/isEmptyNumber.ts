import isNotEmptyNumber from 'lib/common/helper/isNotEmptyNumber';

const isEmptyNumber = (value: number | null | undefined): value is 0 | null | undefined => !isNotEmptyNumber(value);

export default isEmptyNumber;
