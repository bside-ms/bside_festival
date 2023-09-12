const isValidRequestBody = <T extends object>(body: object, fields: Array<keyof T>): body is T =>
    // @ts-expect-error | Might need to find better way..
    Object.keys(body).every((key) => fields.includes(key));

export default isValidRequestBody;
