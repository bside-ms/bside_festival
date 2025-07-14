'use client';

import Application from '@/components/applications/applicationsOverview/Application';
import { useApplicationsOverviewContext } from '@/components/applications/applicationsOverview/ApplicationsOverviewContext';
import ApplicationsOverviewSearchTextFilter from '@/components/applications/applicationsOverview/ApplicationsOverviewSearchTextFilter';
import ApplicationsOverviewTypesFilter from '@/components/applications/applicationsOverview/ApplicationsOverviewTypesFilter';
import type { ReactElement } from 'react';

const ApplicationsOverview = (): ReactElement => {
    const { allApplications, filteredApplications } = useApplicationsOverviewContext();

    const applicationAmount =
        filteredApplications.length === allApplications.length
            ? allApplications.length.toString()
            : `${filteredApplications.length} von ${allApplications.length}`;

    return (
        <>
            <div className="mb-2 text-center font-display text-4xl uppercase">B-werbungen ({applicationAmount})</div>

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
        </>
    );
};

export default ApplicationsOverview;
