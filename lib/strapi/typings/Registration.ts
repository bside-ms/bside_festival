export default interface Registration {
    id: number;
    registrationNecessary: boolean;
    maxParticipants: number | null;
    consentAgreement: string | null;
    registrationEnd: number | null;
}
