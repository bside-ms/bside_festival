import { revalidatePath } from 'next/cache';

export const revalidateProgramPaths = (): void => {
    revalidatePath('/intern', 'layout');
    revalidatePath('/intern/kuration');
    revalidatePath('/intern/slotplan');
    revalidatePath('/bewerbungen/uebersicht');
    revalidatePath('/programm');
    revalidatePath('/programm/[id]', 'page');
    revalidatePath('/programm/timetable');
    revalidatePath('/intern/[id]', 'page');
    revalidatePath('/intern/[id]/teilnehmende/[scheduleEntryId]', 'page');
    revalidatePath('/aenderungslog');
};
