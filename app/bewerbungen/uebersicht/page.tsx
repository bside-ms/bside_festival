import { redirect } from 'next/navigation';
import type { ReactElement } from 'react';

export default async (): Promise<ReactElement> => {
    redirect('/intern');
};
