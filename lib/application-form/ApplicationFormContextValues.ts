export default interface ApplicationFormContextValues {
    formValues: Map<string, string>;
    setFormValue: (name: string, value: string) => void;
}
