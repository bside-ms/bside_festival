import Checkbox from '@/components/form/Checkbox';
import TextArea from '@/components/form/TextArea';
import TextInput from '@/components/form/TextInput';
import { useFormContext } from 'react-hook-form';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { ApplicationFormValues } from './ApplicationForm';

const ApplicationParticipantInfo = () => {
    const { watch } = useFormContext();

    const hasProfessionalParticipants = watch('hasProfessionalParticipants');

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
                mit Diskriminierungserfahrung stark machen oder selbst davon betroffen sind. Dazu zählen zum Beispiel geflüchtete Menschen,
                Jüdinnen*Juden, Menschen mit familiärer Migrations- oder Fluchtgeschichte, muslimisch(e) (gelesene) Menschen, Personen of
                Color, Sinti/Roma*, schwarze Menschen und/oder Menschen, die aufgrund ihres Alters, sozialen Status oder einer
                Behinderung/chronischen Krankheit benachteiligt werden (marginalisierte Gruppen). Wir freuen uns ebenso über Bewerbungen von
                Frauen, lesbischen, nicht-binären, intergeschlechtlichen, trans und agender Personen (FLINTA*).
            </div>

            <Checkbox name="hasMarginalizedParticipants" label="Es sind Personen anderer marginalisierter Gruppen beteiligt?" />
            <TextArea<ApplicationFormValues> name="diversityNotes" label="Anmerkungen zur Diversität" rows={2} />

            <TextInput
                name="flintaParticipantsCount"
                info="Wie viele FLINTA* Personen sind beteiligt?"
                label="Anzahl"
                type="number"
                required={true}
            />
    
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <Checkbox name="hasProfessionalParticipants" label="Arbeiten einige von euch als professionelle Künstler*innen?" />

                    <div className="group relative cursor-help">
                        <IoInformationCircleOutline className="h-5 w-5 text-gray-400" />
                        <div className="invisible absolute left-full z-50 ml-2 w-64 rounded bg-gray-800 p-3 text-xs text-white shadow-lg group-hover:visible">
                            Als „professionell“ gilt, wer den Hauptlebensunterhalt durch Kunst bestreitet oder in der KSK versichert ist.
                            <br />
                            <br />
                            <a href="https://www.kuenstlersozialkasse.de/" target="_blank" className="text-blue-300 underline">
                                Mehr Infos zur KSK
                            </a>
                        </div>
                    </div>
                </div>

                {hasProfessionalParticipants && (
                    <div className="ml-8 animate-in fade-in slide-in-from-left-2">
                        <TextInput name="professionalParticipantsCount" label="Anzahl der Profis" type="number" />
                    </div>
                )}
            </div>
        </section>
    );
};

export default ApplicationParticipantInfo;
