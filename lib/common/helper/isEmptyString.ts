import isNotEmptyString from 'lib/common/helper/isNotEmptyString';

const isEmptyString = (value: string | null | undefined): value is '' | null | undefined => !isNotEmptyString(value);

export default isEmptyString;
