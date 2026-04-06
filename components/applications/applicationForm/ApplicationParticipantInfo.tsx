import Checkbox from '@/components/form/Checkbox';
import TextArea from '@/components/form/TextArea';
import TextInput from '@/components/form/TextInput';
import { useFormContext } from 'react-hook-form';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { ApplicationFormValues } from './ApplicationForm';

const ApplicationParticipantInfo = () => {
    const { watch } = useFormContext();

    const hasProfessionalParticipants = watch('hasProfessionalParticipants');
    const isProfessionalBooking = watch('isProfessionalBooking');

    return (
        <section className="flex flex-col gap-6 py-2">
            <h3 className="font-display text-xl font-bold">Eure Gruppe</h3>

            <TextInput
                name="participantCount"
                label="Gesamtanzahl"
                info="Wie viel Menschen sind an eurem Beitrag beteiligt?"
                type="number"
                required={true}
            />

            <div>
                Zum Ausgleich bestehender Nachteile freuen wir uns über Bewerbungen von Menschen und Organisationen, die sich für Menschen
                mit Diskriminierungserfahrung stark machen oder selbst davon betroffen sind und bevorzugen diese. Dazu zählen zum Beispiel
                geflüchtete Menschen, Jüdinnen*Juden, Menschen mit familiärer Migrations- oder Fluchtgeschichte, muslimisch(e) (gelesene)
                Menschen, Personen of Color, Sinti/Roma*, schwarze Menschen und/oder Menschen, die aufgrund ihres Alters, sozialen Status
                oder einer Behinderung/chronischen Krankheit benachteiligt werden (marginalisierte Gruppen).
            </div>

            <Checkbox name="hasMarginalizedParticipants" label="Es sind Personen anderer marginalisierter Gruppen beteiligt?" />
            <TextArea<ApplicationFormValues>
                name="diversityNotes"
                label="Platz für Anmerkungen zu Barrierefreiheit oder Support-Wünschen..."
                rows={4}
            />

            <div>
                Wir freuen uns auch besonders über Bewerbungen von Frauen, lesbischen, nicht-binären, intergeschlechtlichen, trans und
                agender Personen (FLINTA*) und bevorzugen diese ebenfalls.
            </div>

            <TextInput
                name="flintaParticipantsCount"
                info="Wie viele FLINTA* Personen sind beteiligt?"
                label="Anzahl"
                type="number"
                required={true}
            />

            <div className="flex items-center gap-2">
                <Checkbox
                    name="isProfessionalBooking"
                    label="Erfolgt diese Bewerbung durch eine Agentur in Vertretung für die Künstler*innen?"
                />
            </div>

            {!isProfessionalBooking && (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center">
                        <Checkbox name="hasProfessionalParticipants" label="Arbeiten einige von euch als professionelle Künstler*innen?" />

                        <div className="group relative cursor-help">
                            <a href="https://www.kulturrat.de/themen/honoraruntergrenzen/professionelle-kuenstler/" target="_blank">
                                <IoInformationCircleOutline className="h-5 w-5 text-gray-400" />
                            </a>
                            <div className="invisible absolute right-full z-50 ml-2 w-128 rounded bg-gray-800 p-3 text-xs text-white shadow-lg group-hover:visible">
                                Als „professionell“ gilt man z.B. wenn:
                                <ul className="list-inside list-disc">
                                    <li>Mitgliedschaft in der Künstlersozialkasse</li>
                                    <li>Dokument des Finanzamtes mit Steuernummer</li>
                                    <li>Nachweislich entsprechende Tätigkeitspraxis</li>
                                    <li>Vermittlung über eine Agentur</li>
                                </ul>
                                <br />
                                Für weitere Infos: https://www.kulturrat.de/themen/honoraruntergrenzen/professionelle-kuenstler/
                            </div>
                        </div>
                    </div>

                    {hasProfessionalParticipants && (
                        <div className="ml-8 animate-in fade-in slide-in-from-left-2">
                            <div>Wie viele von euch sind professionelle Künstler*innen?</div>
                            <TextInput name="professionalParticipantsCount" label="Anzahl der Profis" type="number" />
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default ApplicationParticipantInfo;
