import VolunteerForm from 'components/volunteers/volunteerForm/VolunteerForm';
import isLoggedIn from 'lib/next-auth/isLoggedIn';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { ReactElement } from 'react';

export default async (): Promise<ReactElement> => {
    if (!(await isLoggedIn())) {
        redirect('/');
    }

    return (
        <div className="relative min-h-screen w-full">
            <div className="relative z-10">
                <Link href="/" className="flex items-center gap-3">
                    <div className="pt-1 text-2xl md:pt-2 md:text-3xl">B-Side Festival 2025</div>
                </Link>

                <div className="mx-auto w-full max-w-[700px] p-5 drop-shadow-xl md:w-2/3 md:p-8">
                    <VolunteerForm />
                </div>
            </div>

            <Image src="/assets/background.webp" alt="Hintergrund" className="absolute z-0 object-cover object-top" fill={true} />
        </div>
    );
};
