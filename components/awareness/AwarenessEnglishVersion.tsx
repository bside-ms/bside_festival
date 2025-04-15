import Link from 'next/link';
import type { ReactElement } from 'react';

const AwarenessEnglishVersion = (): ReactElement => {
    return (
        <div className="flex flex-col gap-5 bg-white/50 p-4">
            <div className="font-display text-black">
                <div className="text-2xl">
                    <Link href="/">B-Side Festival 2025</Link>
                </div>
                <div className="text-4xl font-bold">Awareness</div>
            </div>
            <div>
                <div className="mb-1 underline">Contact persons during the festival:</div>

                <div>
                    There will be an <strong>awareness team</strong> at the B-Side Festival. The team will help you if people harass you,
                    insult you, if you feel discriminated or uncomfortable for other reasons.
                </div>
            </div>
            You can always reach out to people if you're uncomfortable or have questions. You will find contact persons at the awareness
            point in front of the B-Side building at Hawerkamp 29. The awareness team can accompany you to a safer space at any time
            <div>
                <ul className="list-outside list-disc space-y-2 pl-7">
                    <li className="pl-2">You can recognize the awareness team by their neon pink vests or armbands.</li>
                    <li className="pl-2">You can always reach out to people if you're uncomfortable or have questions.</li>
                    <li className="pl-2">
                        You will find contact persons at the awareness point in front of the B-Side building at Hawerkamp 29.
                    </li>
                    <li className="pl-2">The awareness team can accompany you to a safer space at any time.</li>
                    <li className="pl-2">You can always call or messenger the awareness team.</li>
                </ul>
            </div>
            <div>
                <div>Against Discrimination, Harassment & Violence</div>
                The B-Side Festival is intended to be a place where everyone feels safe and secure. Each person has their own factors that
                contribute to feelings of security or insecurity. We all have profoundly different experiences when it comes to assaults and
                discrimination.
            </div>
            <div>
                <div className="mb-2">This is why we would ask you to keep the following things in mind:</div>
                Personal boundaries are individual and subjective. It should go without saying that they must be respected! Only a clear
                "Yes" means "Yes." If in doubt, it's better to ask one time too often than one time too few. Lines are frequently crossed in
                everyday life (and yes, they occur at alternative festivals in Münster as well). They often concern individuals who are
                already being discriminated against due to existing power dynamics in society. Sexism and sexualized violence, hostility
                towards LGBTQ*, racism, ableism, and anti-Semitism are a few examples of forms of discrimination that people have to endure.
                We do not tolerate any of these behaviors! Everyone at the festival (visitors, organizers, artists, etc.) is responsible for
                ensuring a safe event that is free from discrimination. Anyone who engages in discriminatory behavior or crosses someone's
                boundaries will face consequences.
                <div>
                    <ol className="list-outside list-decimal space-y-2 pl-7">
                        <li className="pl-2">
                            Personal boundaries are individual and subjective. It should go without saying that they must be respected! Only
                            a clear "Yes" means "Yes." If in doubt, it's better to ask one time too often than one time too few.
                        </li>
                        <li className="pl-2">
                            Lines are frequently crossed in everyday life (and yes, they occur at alternative festivals in Münster as well).
                            They often concern individuals who are already being discriminated against due to existing power dynamics in
                            society. Sexism and sexualized violence, hostility towards LGBTQ*, racism, ableism, and anti-Semitism are a few
                            examples of forms of discrimination that people have to endure. We do not tolerate any of these behaviors!
                        </li>
                        <li className="pl-2">
                            Everyone at the festival (visitors, organizers, artists, etc.) is responsible for ensuring a safe event that is
                            free from discrimination. Anyone who engages in discriminatory behavior or crosses someone's boundaries will
                            face consequences.
                        </li>
                    </ol>
                </div>
            </div>
            Go to a safe place or assist the person in question in reaching a safe place. Please do not help individuals you do not know
            without asking. Ask the individual if you should intervene or not. It is about the needs of the affected person, not the needs
            of the wrongdoer. Speak to the Awareness Team. Team members are present at the festival and parties. You can recognize them by
            their neon-pink high-visibility vests. They help you navigate uncomfortable situations, lend a listening ear, guide you to a
            safe place, organize additional support, and if possible, ensure that intrusive and/or discriminatory individuals leave the
            premises or face other consequences. Call the Awareness hotline. If you do not see anyone from the Awareness Team, you can call
            the hotline at any time. Help will be on its way or they will instruct you where to find assistance at a safe location.
            <div>
                <div className="mb-2 font-bold underline">
                    Actions you can take if you observe or experience discriminatory behavior or boundary crossings:
                </div>
                Go to a safe place or assist the person in question in reaching a safe place. Please do not help individuals you do not know
                without asking. Ask the individual if you should intervene or not. It is about the needs of the affected person, not the
                needs of the wrongdoer. Speak to the Awareness Team. Team members are present at the festival and parties. You can recognize
                them by their neon-pink high-visibility vests. They help you navigate uncomfortable situations, lend a listening ear, guide
                you to a safe place, organize additional support, and if possible, ensure that intrusive and/or discriminatory individuals
                leave the premises or face other consequences. Call the Awareness hotline. If you do not see anyone from the Awareness Team,
                you can call the hotline at any time. Help will be on its way or they will instruct you where to find assistance at a safe
                location.
                <div>
                    <ol className="list-outside list-decimal space-y-2 pl-7">
                        <li className="pl-2">
                            Go to a safe place or assist the person in question in reaching a safe place. Please do not help individuals you
                            do not know without asking. Ask the individual if you should intervene or not. It is about the needs of the
                            affected person, not the needs of the wrongdoer.
                        </li>
                        <li className="pl-2">
                            Speak to the Awareness Team. Team members are present at the festival and parties. You can recognize them by
                            their neon-pink high-visibility vests. They help you navigate uncomfortable situations, lend a listening ear,
                            guide you to a safe place, organize additional support, and if possible, ensure that intrusive and/or
                            discriminatory individuals leave the premises or face other consequences.
                        </li>
                    </ol>
                </div>
            </div>
            <div className="italic">
                Please note: The Awareness Team does not replace emergency medical services. In emergencies involving physical well-being,
                please call 112.
            </div>
        </div>
    );
};

export default AwarenessEnglishVersion;
