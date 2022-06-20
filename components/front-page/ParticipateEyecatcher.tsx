import styles from './ParticipateEyecatcher.module.scss';

import { useCallback, useState } from 'react';
import { Button as MuiButton, Dialog, DialogActions, DialogContent } from '@mui/material';
import { range } from 'lodash';
import type { ReactElement } from 'react';
import Button from 'components/common/Button';

const ParticipateEyecatcher = (): ReactElement => {

    const [showDialog, setShowDialog] = useState(false);

    const handleOverlayToggle = useCallback(
        () => setShowDialog(prevState => !prevState),
        [setShowDialog]
    );

    return (
        <div className={styles.gridContainer}>

            <div className={`grid md:hidden bg-red z-0 ${styles.smGrid ?? ''}`}>
                {range(10).map(rowIdx => (
                    range(10).map(colIdx => (
                        <div key={`r${rowIdx}c${colIdx}`} />
                    ))
                ))}
            </div>

            <div className={`hidden md:grid bg-red z-0 ${styles.mdGrid ?? ''}`}>
                {range(30).map(rowIdx => (
                    range(30).map(colIdx => (
                        <div key={`r${rowIdx}c${colIdx}`} />
                    ))
                ))}
            </div>

            <div className="relative w-full h-full">
                <div className="font-bold absolute left-1/2 -translate-x-1/2 top-[80px] text-[20px] z-20">
                    <Button onClick={handleOverlayToggle}>Mitmachen</Button>
                </div>
            </div>

            <Dialog open={showDialog}>
                <DialogContent>
                    <div className="space-y-5">
                        <div>
                            Das B-Side Festival ist nur durch den ehrenamtlichen Einsatz ganz vieler engagierter
                            Menschen möglich. Jede helfende Hand ist sehr willkommen! Du willst nicht auf
                            der Bühne stehen, sondern lieber hinten den Kulissen mitmischen? Dann mach mit!
                        </div>

                        <div>
                            Du kannst dich schon jetzt im Festival-Orga-Team um die Koordination und Planung
                            des Festivals kümmern. Im Festival-Team wird schon Monate im Voraus in wöchentlichen
                            Treffen das Festival aufgebaut. Egal ob Dein Herz für Social-Media oder für Bühnentechnik
                            schlägt, Du ein Organisationstalent oder eine Quasselstrippe bist - komm ins Team und
                            hilf mit das Festival auf die Beine zu stellen!
                        </div>

                        <div>
                            Du willst mitmachen, aber wöchentliche Treffen hören sich nach zu viel Arbeit an?
                            Kein Problem! Als Helfi übernimmst Du kleinere, ganz konkrete Aufgaben vor
                            und während dem Festival. Zum Beispiel bastelst Du in gemütlicher Runde die
                            Deko, packst bei Auf- und Abbau mit an oder sammelst Spenden.
                        </div>

                        <div>
                            Wir freuen uns auf deine Nachricht an festival@b-side.ms oder über Instagram und Facebook.
                            Bis bald!
                        </div>
                    </div>
                </DialogContent>

                <DialogActions>
                    <MuiButton onClick={handleOverlayToggle}>Schießen</MuiButton>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ParticipateEyecatcher;
