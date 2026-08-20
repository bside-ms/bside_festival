import AwarenessSectionHeading from '@/components/awareness/AwarenessSectionHeading';
import { awarenessPhone } from '@/lib/public/awareness';
import type { ReactElement } from 'react';

const AwarenessEnglishVersion = (): ReactElement => {
    return (
        <>
            <section>
                <AwarenessSectionHeading>Contact persons during the festival:</AwarenessSectionHeading>
                <p>
                    There will be an Awareness Team at the B-Side Festival. The team will help you if people harass you, cross your
                    boundaries, insult you, or if you feel discriminated against or uncomfortable for other reasons.
                </p>
                <ul className="mt-3 list-outside list-disc space-y-2 pl-7">
                    <li>You can recognize the Awareness Team by their neon-pink vests</li>
                    <li>You can approach the Awareness Team at any time if you feel uncomfortable or have questions</li>
                    <li>The Awareness Team can accompany you to a quieter retreat at any time</li>
                    <li>
                        Awareness phone: <strong>{awarenessPhone}</strong>
                    </li>
                </ul>
            </section>

            <section>
                <AwarenessSectionHeading>
                    Our awareness concept against discrimination, violence and boundary violations
                </AwarenessSectionHeading>
                <div className="space-y-3">
                    <p>
                        We want to establish and maintain a considerate, responsible and solidarity-based way of interacting with each
                        other. We represent an attitude and practice that counters discrimination and violence and is based on consent. For
                        this, we have developed our own guidelines that apply to everyone during the festival. All people involved in the
                        festival can take responsibility for themselves and the shared space. Any form of discrimination, boundary violation
                        or behavior to the detriment of other people will not be tolerated at the B-Side.
                    </p>
                    <p>
                        Above all, partiality with those affected is the principle of our awareness work. That means we do not keep an
                        artificial neutrality. We stand in solidarity with people affected by violence or discrimination, center their
                        perspective, needs and rights, and do not question them.
                    </p>
                    <p>Therefore, we ask you to pay attention to the following:</p>
                </div>
                <ol className="mt-3 list-outside list-decimal space-y-3 pl-7">
                    <li>
                        Personal boundaries are individual and subjective. Respecting them is important. Only a clear “Yes” means “Yes.”
                        When in doubt, ask one time too often rather than too seldom. We also ask you to keep your top on so that nobody is
                        put in an uncomfortable situation.
                    </li>
                    <li>
                        We do not tolerate boundary-crossing or discriminatory behavior and will, where possible, take action against it.
                        Boundary violations and discrimination unfortunately happen everywhere and every day. There is no (public) space
                        free from them. Discrimination means (structural) disadvantage, devaluation and unequal treatment based on origin,
                        class, gender, age, health, sexuality, skin color or wealth. A boundary violation can be an unpleasant remark, an
                        unwanted touch, an overly personal question or exclusion.
                    </li>
                    <li>
                        Show understanding, recognition and respect for things, practices or traditions of cultures. We do not want the
                        appropriation or instrumentalization of cultural, religious or political symbols. And this also applies:{' '}
                        <span className="font-bold text-[#e23b3b]">Nazis must stay out.</span>
                    </li>
                    <li>
                        Do not infer gender identities from appearances. Ask for the pronouns (“they, dey, name, she, he, name”) the person
                        would like to be addressed with.
                    </li>
                    <li>
                        Self-care is an important principle in awareness work. If you feel unsure, communicate that with your friends.
                        Protect your drink against knockout drops by reusing the bottle cap or by always holding your drink and keeping an
                        eye on it.
                    </li>
                </ol>
            </section>

            <section>
                <AwarenessSectionHeading>
                    What you can do if you observe or experience boundary violations or discriminatory behavior:
                </AwarenessSectionHeading>
                <ul className="list-outside list-disc space-y-2 pl-7">
                    <li>
                        Show solidarity with those affected. Offer your help, listen and acknowledge the perspective described without
                        questioning it. The needs of the affected person(s) always come first.
                    </li>
                    <li>
                        Speak to the Awareness Team. They can be recognized by their pink vests. You can also ask at the awareness info
                        point, at the bar or the stewards about awareness, or call the team. Phone number: <strong>{awarenessPhone}</strong>
                    </li>
                </ul>
                <p className="mt-4 font-bold">
                    <span className="text-[#e23b3b]">Important:</span> The Awareness Team does not replace emergency medical services.{' '}
                    <span className="text-[#e23b3b]">In health-related emergencies, please call 112.</span>
                </p>
            </section>

            <section>
                <AwarenessSectionHeading>Children &amp; young people</AwarenessSectionHeading>
                <div className="space-y-3">
                    <p>
                        There is no explicit child and youth protection concept. The B-Side is not per se a safe space for children and
                        young people. We ask parents to look after, accompany and keep an eye on their children throughout their visit to
                        the B-Side. Some performances may include explicit content. Legal guardians are responsible for judging whether that
                        is appropriate for children and young people and acting accordingly. Otherwise, the following legal rules apply:
                    </p>
                    <p>
                        <span className="font-bold">Stay times:</span> People under 16 may not attend our parties and concerts unless
                        accompanied and supervised by their parents or a person with parental authority. Young people aged 16 and over may
                        attend our parties and concerts alone until 24:00. If they wish to stay longer, they may do so only when accompanied
                        by their parents or a person with parental authority who takes responsibility. The person with parental authority is
                        designated by the parents with a “Mutti-Zettel” (parental consent form).
                    </p>
                    <p>
                        <span className="font-bold">Smoking:</span> Young people under 18 may not smoke in public and may not purchase
                        tobacco products.
                    </p>
                    <p>
                        <span className="font-bold">Alcohol:</span> Alcohol must not generally be supplied to under-18s in public. The
                        consumption of alcohol in public is also prohibited for children and young people under 18. Beer, sparkling wine,
                        wine and their mixed drinks may be supplied to and consumed by young people over 16.
                    </p>
                </div>
            </section>
        </>
    );
};

export default AwarenessEnglishVersion;
