import VolunteerForm from '@/components/volunteers/volunteerForm/VolunteerForm';
import { isVolunteerSignupOpen } from '@/lib/volunteers/volunteerSchedule';
import type { ReactElement } from 'react';

export const dynamic = 'force-dynamic';

export default async (): Promise<ReactElement> => {
    const showVolunteerSignup = isVolunteerSignupOpen();

    return (
        <div className="relative mx-auto min-h-screen w-full max-w-2xl px-5 pt-5 pb-12 md:px-8">
            <div className="mb-8 text-center font-display text-5xl uppercase sm:text-6xl">Mithelfen</div>

            {showVolunteerSignup ? (
                <VolunteerForm />
            ) : (
                <div className="flex flex-col gap-5 text-sm leading-relaxed md:text-base">
                    <p>
                        Das diesjährige B-Side Festival steht schon kurz bevor. Am 18. September geht es ab 17 Uhr los, am 19. September ab
                        13 Uhr feiern wir in der B-Side und im Hansaviertel.
                    </p>
                    <p>
                        Die Helfi-Anmeldung für 2026 ist deshalb geschlossen. Kommt einfach vorbei, habt eine gute Zeit und helft gern
                        nächstes Jahr mit!
                    </p>
                </div>
            )}
        </div>
    );
};
