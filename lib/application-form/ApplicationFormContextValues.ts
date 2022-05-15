export default interface ApplicationFormContextValues {
    formValues: Map<string, string>;
    setFormValue: (name: string, value: string) => void;
    isSubmitting: boolean;
    toggleSubmitState: () => void;
    wasSuccessfullySubmitted: boolean;
    markFormAsSuccessfullySubmitted: () => void;
    formError: string | null;
    setFormError: (error: string) => void;
    unsetFormError: () => void;
}
