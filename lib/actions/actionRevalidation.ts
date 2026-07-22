import { revalidatePath } from 'next/cache';

export const revalidateProgramPaths = (): void => {
    revalidatePath('/intern');
    revalidatePath('/intern/kuration');
    revalidatePath('/intern/slotplan');
    revalidatePath('/bewerbungen/uebersicht');
    revalidatePath('/programm');
    revalidatePath('/programm/timetable');
    revalidatePath('/aenderungslog');
};
