import { useFormContext } from 'react-hook-form';
import TextInput from '@/components/form/TextInput';
import Checkbox from '@/components/form/Checkbox';
import { IoInformationCircleOutline } from 'react-icons/io5';

const ApplicationParticipantInfo = () => {
    const { watch } = useFormContext();
    
    // Watch the "hasProfessionalParticipants" checkbox to show/hide the number input
    const hasProfessionalParticipants = watch('hasProfessionalParticipants');

    return (
        <section className="flex flex-col gap-6 py-2">
            <h3 className="text-xl font-bold font-display">Eure Gruppe</h3>

            {/* 1. Total Count */}
            <TextInput
                name="participantCount"
                label="Gesamtanzahl"
                info="Wie viel Menschen sind an eurem Beitrag beteiligt?"
                type="number"
                required={true}
            />

            <div>
                Zum Ausgleich bestehender Nachteile freuen wir uns über Bewerbungen von Menschen und Organisationen, die sich für
                Menschen mit Diskriminierungserfahrung stark machen oder selbst davon betroffen sind. Dazu zählen zum Beispiel
                geflüchtete Menschen, Jüdinnen*Juden, Menschen mit familiärer Migrations- oder Fluchtgeschichte, muslimisch(e)
                (gelesene) Menschen, Personen of Color, Sinti/Roma*, schwarze Menschen und/oder Menschen, die aufgrund ihres Alters,
                sozialen Status oder einer Behinderung/chronischen Krankheit benachteiligt werden (marginalisierte Gruppen). Wir
                freuen uns ebenso über Bewerbungen von Frauen, lesbischen, nicht-binären, intergeschlechtlichen, trans und agender
                Personen (FLINTA*).
            </div>

            {/* 2. Marginalized Groups */}
            <Checkbox 
                name="hasMarginalizedParticipants" 
                label="Es sind Personen anderer marginalisierter Gruppen beteiligt?" 
            />

            {/* 3. FLINTA Count */}
            <TextInput
                name="flintaParticipantsCount"
                info="Wie viele FLINTA* Personen sind beteiligt?"
                label="Anzahl"
                type="number"
                required={true}
            />

            {/* 4. Professional Artist Checkbox */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <Checkbox 
                        name="hasProfessionalParticipants" 
                        label="Arbeiten einige von euch als professionelle Künstler*innen?" 
                    />
                    
                    {/* Tooltip implementation */}
                    <div className="group relative cursor-help">
                        <IoInformationCircleOutline className="text-gray-400 h-5 w-5" />
                        <div className="invisible group-hover:visible absolute left-full ml-2 w-64 p-3 bg-gray-800 text-white text-xs rounded shadow-lg z-50">
                            Als "professionell" gilt, wer den Hauptlebensunterhalt durch Kunst bestreitet oder in der KSK versichert ist. 
                            <br/><br/>
                            <a href="https://www.kuenstlersozialkasse.de/" target="_blank" className="underline text-blue-300">Mehr Infos zur KSK</a>
                        </div>
                    </div>
                </div>

                {/* 5. Conditional Professional Count */}
                {hasProfessionalParticipants && (
                    <div className="ml-8 animate-in fade-in slide-in-from-left-2">
                        <TextInput
                            name="professionalParticipantsCount"
                            label="Anzahl der Profis"
                            type="number"
                        />
                    </div>
                )}
            </div>
        </section>
    );
};

export default ApplicationParticipantInfo;