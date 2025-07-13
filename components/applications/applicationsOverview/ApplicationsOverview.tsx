'use client';

import Application from '@/components/applications/applicationsOverview/Application';
import { useApplicationsOverviewContext } from '@/components/applications/applicationsOverview/ApplicationsOverviewContext';
import ApplicationsOverviewSearchTextFilter from '@/components/applications/applicationsOverview/ApplicationsOverviewSearchTextFilter';
import ApplicationsOverviewTypesFilter from '@/components/applications/applicationsOverview/ApplicationsOverviewTypesFilter';
import Link from 'next/link';
import type { ReactElement } from 'react';

const ApplicationsOverview = (): ReactElement => {
    const { allApplications, filteredApplications } = useApplicationsOverviewContext();

    const applicationAmount =
        filteredApplications.length === allApplications.length
            ? allApplications.length.toString()
            : `${filteredApplications.length} von ${allApplications.length}`;

    return (
        <div>
            <Link href="/" className="flex items-center gap-3 text-red-600">
                <div className="pt-1 text-2xl md:pt-2 md:text-3xl">B-Side Festival 2025</div>
            </Link>

            <div className="mb-5 font-display text-white">
                <div className="text-4xl font-bold">B-werbungen ({applicationAmount})</div>
            </div>

            <ApplicationsOverviewSearchTextFilter />

            <ApplicationsOverviewTypesFilter />

            {filteredApplications.length === 0 ? (
                <div className="mt-5 rounded-md p-3 font-bold text-gray-200 shadow-lg backdrop-blur-2xl md:p-5">
                    {allApplications.length > 0
                        ? 'Zur aktuellen Filterung keine Bewerbungen gefunden!'
                        : 'Bisher sind noch keine Bewerbungen eingegangen!'}
                </div>
            ) : (
                <div className="space-y-5">
                    {filteredApplications.map((application) => (
                        <Application key={application.id} application={application} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ApplicationsOverview;
