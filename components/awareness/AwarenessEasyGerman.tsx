import Link from 'next/link';
import type { ReactElement } from 'react';
import awarenessPhoneNumber from 'components/awareness/awarenessPhoneNumber';

const AwarenessEasyGerman = (): ReactElement => {

    return (
        <div className="bg-white p-4 flex flex-col gap-5 drop-shadow-2xl">
            <div className="text-black font-display">
                <div className="text-2xl">
                    <Link href="/">B-Side Festival 2023</Link>
                </div>
            </div>

            <div>
                Du bist auf dem Festival und es geht dir nicht gut?<br />
                Du möchtest, dass Menschen dir helfen?<br />
                Du kannst diese Nummer anrufen:<br />
                <span className="text-xl">{awarenessPhoneNumber}</span><br />
                <br />
                Auf unserem Festival sollen sich alle Menschen sicher fühlen.<br />
                Manchmal fühlen sich Menschen nicht sicher.<br />
                Auch wenn sich andere Menschen in der gleichen Situation sicher fühlen.<br />
                Das liegt daran, dass wir unterschiedliche Erfahrungen gemacht haben.<br />
                Manche wurden in der Vergangenheit schon diskriminiert.<br />
                Wir wollen, dass sich alle Menschen auf dem Festival sicher fühlen.<br />
                Deshalb gibt es ein paar Regeln.<br />
                <br />
                <span className="text-xl">1.</span><br />
                Jeder Mensch hat eigene Grenzen.<br />
                Grenzen sind Sachen, bei der eine Person sagt: Nein.<br />
                Oder sich unwohl fühlt.<br />
                Manchmal sagt eine Person auch nicht Nein.<br />
                Aber meint es trotzdem. Und fühlt sich unwohl.<br />
                Vielleicht traut sich eine Person nicht, Nein zu sagen.<br />
                Wenn eine Person etwas nicht machen möchte.<br />
                Dann sagt sie: Nein.<br />
                Wenn jemand anderes trotzdem weitermacht, sagt man:<br />
                Diese Person überschreitet eine Grenze.<br />
                Oder etwas nicht machen möchte.<br />
                Und sich dabei unwohl fühlt.<br />
                Nur wenn eine Person wirklich sagt: Ja.<br />
                Dann bedeutet es, dass die Person eine Sache machen möchte.<br />
                Vielleicht weiß man nicht, ob eine Person sich unwohl fühlt.<br />
                Deshalb muss man nachfragen.<br />
                Wenn man sich nicht sicher ist, ob man nachfragen sollte.<br />
                Sollte man es trotzdem tun.<br />
                <br />
                <span className="text-xl">2.</span><br />
                Manchmal überschreiten Menschen die Grenzen von anderen Menschen.<br />
                Das passiert auch auf Festivals in Münster.<br />
                Auch wenn man denkt:<br />
                Hier auf diesem Festival passiert es nicht.<br />
                Weil so viele achtsame Menschen hier sind.<br />
                Und es ein Awareness-Team gibt.<br />
                <br />
                <strong>Awareness heißt:</strong><br />
                Aufmerksam sein.<br />
                Zu probieren, dass es allen gut geht.<br />
                Und die Bedürfnisse von anderen Personen beachtet werden.<br />
                Manchmal werden Menschen diskriminiert:<br />
                Wegen ihres Geschlechts.<br />
                Oder weil sie eine Behinderung haben.<br />
                Oder weil sie lesbisch oder schwul sind.<br />
                <br />
                <span className="text-xl">3.</span><br />
                Alle Menschen auf dem Festival müssen vorsichtig sein.<br />
                Damit es allen gut geht.<br />
                Und niemand diskriminiert wird.<br />
                Diskriminieren heißt:<br />
                Jemand anderen schlecht behandeln.<br />
                Weil die Person anders ist.<br />
                <br />
                <strong>Wird eine Grenze von dir überschritten?</strong><br />
                <strong>Wird die Grenze von jemand anderem überschritten?</strong><br />
                <strong>Dann kannst du etwas machen:</strong><br />
                <br />
                <span className="text-xl">1.</span><br />
                Bringe dich in Sicherheit.<br />
                Oder bringe die andere Person in Sicherheit.<br />
                Andere Personen sollst du immer Fragen.<br />
                Ob sie Hilfe möchten.<br />
                <br />
                <span className="text-xl">2.</span><br />
                Es gibt das Awareness-Team.<br />
                Das sind Menschen mit pinken Westen oder Armbinden.<br />
                Du kannst diese Menschen um Hilfe bitten.<br />
                Sie hören dir zu.<br />
                Und bringen dich an einen sicheren Ort.<br />
                Sie können andere Menschen um Hilfe fragen.<br />
                Und sie können dafür sorgen, dass die Person, die dich schlecht behandelt, vom Festival weggeht.<br />
                <br />
                <span className="text-xl">3.</span><br />
                Du kannst die Awareness-Telefonnummer anrufen.<br />
                Die Telefonnummer ist:<br />
                {awarenessPhoneNumber}<br />
                Dann kommt Hilfe.<br />
                Oder sagen dir, wo du hingehen kannst, damit du in Sicherheit bist.<br />
                <br />
                <span className="text-xl">4.</span><br />
                Du kannst zum Awareness-Treffpunkt gehen.<br />
                Der Treffpunkt ist vor dem Haus der B-Side.Die Adresse ist Am Hawerkamp 29Dort siehst du ein Schild, auf dem „Awareness„ steht.<br />
                <br />
                Wichtig:<br />
                Das Awareness-Team ist nicht der Notarzt.<br />
                Wenn es jemandem körperlich sehr schlecht geht, musst du den Notarzt anrufen.Die Nummer ist 112.<br />
            </div>
        </div>
    );
};

export default AwarenessEasyGerman;
