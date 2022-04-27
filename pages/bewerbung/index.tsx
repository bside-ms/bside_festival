import Link from 'next/link';
import type { ReactElement } from 'react';
import { applicationTypes } from 'lib/ApplicationFormService';

export default (): ReactElement => {

    return (
        <div className="min-h-full w-full md:w-2/3 mx-auto text-cyan-200">

            {applicationTypes.map(({ pathPart, title }) => (
                <div key={pathPart} className="mb-3">
                    <Link href={`bewerbung/${pathPart}`} passHref={true}>
                        <a>{title}</a>
                    </Link>
                </div>
            ))}
        </div>
    );
};
