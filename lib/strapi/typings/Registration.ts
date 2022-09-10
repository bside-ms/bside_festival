export default interface Registration {
    id: number;
    registrationNecessary: boolean;
    maxParticipants: number | null;
    concentAgreement: string | null;
    registrationEnd: number | null;
}
