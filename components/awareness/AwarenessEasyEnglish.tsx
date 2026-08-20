import AwarenessSectionHeading from '@/components/awareness/AwarenessSectionHeading';
import { awarenessPhone } from '@/lib/public/awareness';
import type { ReactElement } from 'react';

const AwarenessEasyEnglish = (): ReactElement => {
    return (
        <>
            <section>
                <AwarenessSectionHeading>People who can help you:</AwarenessSectionHeading>
                <p>
                    At the B-Side Festival, we want to make sure that everyone feels safe and comfortable. We want to help you if someone is
                    making you feel bad or uncomfortable.
                </p>
                <ul className="mt-3 list-outside list-disc space-y-2 pl-7">
                    <li>You can contact the Awareness Team at any time.</li>
                    <li>You can tell them everything. They will keep it confidential.</li>
                    <li>You can find the team at the entrance or in the awareness room, where you can rest and be safe.</li>
                    <li>If you need a break, the team will take care of you.</li>
                    <li>We will help you if you are in trouble.</li>
                    <li>You can also call: {awarenessPhone}</li>
                </ul>
                <p className="mt-4">
                    We want everyone at the festival to be kind, respectful, and helpful towards each other. We want everyone to have a good
                    time. We want to play our part to help everyone feel safe. That is why we have some basic rules that apply to everyone
                    who goes to the festival. Everyone is responsible for themselves and for others.
                </p>
            </section>

            <section>
                <AwarenessSectionHeading>Here are the most important rules:</AwarenessSectionHeading>
                <ol className="list-outside list-decimal space-y-4 pl-7">
                    <li>
                        <span className="font-bold">Personal boundaries:</span> Every person has their own boundaries. What is okay for one
                        person might not be okay for another. Please respect other people’s boundaries.
                        <ul className="mt-2 list-outside list-disc space-y-1 pl-7">
                            <li>Only a “yes” means “yes”.</li>
                            <li>No means no. This applies to dancing, touching, and more.</li>
                            <li>Please keep your clothes on so no one feels uncomfortable.</li>
                        </ul>
                    </li>
                    <li>
                        <span className="font-bold">Discrimination and boundaries:</span> People are sometimes treated badly because they
                        are different. That is not allowed. This can be due to their origin, gender, age, skin color, sexuality, health or
                        wealth. We do not tolerate behavior that is homophobic, transphobic, racist, or sexist. No hateful talk or overly
                        personal questions. No excluding others. We do not tolerate such behavior and will take action against it
                        immediately.
                    </li>
                    <li>
                        <span className="font-bold">Respect for cultures:</span> Show understanding and respect for the customs and
                        traditions of other cultures. Do not take items or symbols from other cultures and use them as decorations,
                        costumes, or for partying. This is called “appropriation” and is not allowed.
                    </li>
                    <li>
                        <span className="font-bold">Gender and pronouns:</span> Do not assume a person’s gender based on their appearance.
                        If you are not sure, you should ask how to be addressed (for example “she”, “he”, “they”, or a name). Respect the
                        person’s wishes.
                    </li>
                    <li>
                        <span className="font-bold">Self-care:</span> Take care of yourself. If you feel unwell, talk to your friends about
                        it. Festival life can be tiring. Make sure you drink enough water and get enough sleep. Drink alcohol in moderation
                        and be aware of your own limits.
                    </li>
                </ol>
            </section>

            <section>
                <AwarenessSectionHeading>What to do if you see or experience something unpleasant?</AwarenessSectionHeading>
                <ol className="list-outside list-decimal space-y-4 pl-7">
                    <li>
                        <span className="font-bold">Help those affected:</span>
                        <ul className="mt-2 list-outside list-disc space-y-1 pl-7">
                            <li>Ask what the person needs from you. Look after them.</li>
                            <li>Listen and believe them.</li>
                            <li>Be aware of what is going on around you.</li>
                        </ul>
                    </li>
                    <li>
                        <span className="font-bold">Contact the Awareness Team: We are here to help you!</span>
                        <ul className="mt-2 list-outside list-disc space-y-1 pl-7">
                            <li>The team wears pink vests. You can approach them if you need help.</li>
                            <li>You can also call: {awarenessPhone}</li>
                        </ul>
                    </li>
                </ol>
                <p className="mt-4 font-bold text-[#e23b3b]">In cases of emergency, please call the emergency number 112!</p>
            </section>
        </>
    );
};

export default AwarenessEasyEnglish;
