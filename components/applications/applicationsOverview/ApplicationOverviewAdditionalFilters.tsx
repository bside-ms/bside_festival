import { useCallback, useEffect, useState } from 'react';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactElement } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { curationScoreOptions } from 'components/applications/applicationCuration/ApplicationCurationForm';
import { useApplicationsOverviewContext } from 'components/applications/applicationsOverview/ApplicationsOverviewContext';
import SelectInput from 'components/form/SelectInput';
import isEmptyString from 'lib/common/helper/isEmptyString';

interface AdditionFiltersFormValues {
    minimumScore: string;
}

const ApplicationOverviewAdditionalFilters = (): ReactElement => {

    const {
        filteredMinimumScore,
        setFilteredMinimumScore,
        participantLabels,
        allLabels,
        toggleFilteredLabelId,
        filteredLabelIds,
    } = useApplicationsOverviewContext();

    const [showAdditionalFilters, setShowAdditionalFilters] = useState(false);
    const toggleShowAdditionalFilters = useCallback(() => setShowAdditionalFilters(prevState => !prevState), []);

    const methods = useForm<AdditionFiltersFormValues>();

    const { watch, setValue } = methods;

    const currentMinimusScore = watch('minimumScore');

    useEffect(
        () => {
            setFilteredMinimumScore(isEmptyString(currentMinimusScore) ? null : Number(currentMinimusScore));
        },
        [currentMinimusScore, setFilteredMinimumScore]
    );

    const handleReset = useCallback(() => setValue('minimumScore', ''), [setValue]);

    const usedLabelIds = participantLabels.map(({ labelId }) => labelId);
    const usedLabels = allLabels.filter(({ id }) => usedLabelIds.includes(id));

    const handleLabelClick = useCallback((event: MouseEvent) => {

        // @ts-expect-error | Will fix this later..
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const clickedLabelId = event.target.dataset.labelId as string;

        toggleFilteredLabelId(Number(clickedLabelId));
    }, [toggleFilteredLabelId]);

    return (
        <FormProvider {...methods}>
            <div className="mb-3">
                {showAdditionalFilters ? (
                    <div>
                        <div className="flex">
                            <a
                                onClick={toggleShowAdditionalFilters}
                                className="cursor-pointer bg-gray-200 py-2 px-3 text-sm rounded-t-xl flex items-center gap-1 select-none"
                            >
                                Weitere Filter <FontAwesomeIcon className="w-2" icon={faChevronUp} />
                            </a>
                        </div>

                        <div className="rounded-t-xl bg-gray-200 py-2 px-3 rounded-xl rounded-tl-none max-w-[500px]">

                            <div className="max-w-[350px]">
                                <div>Min. Score</div>
                                <SelectInput<AdditionFiltersFormValues>
                                    options={curationScoreOptions}
                                    label="Auswählen…"
                                    name="minimumScore"
                                    defaultValue={filteredMinimumScore?.toString()}
                                />
                                <a className="text-xs text-sky-700 cursor-pointer" onClick={handleReset}>zurücksetzen</a>

                            </div>

                            <div className="mt-2">
                                <div>Labels</div>
                                <div className="flex gap-1 flex-wrap">
                                    {usedLabels.map(({ id, label }) => (
                                        <div
                                            key={id}
                                            className="uppercase select-none rounded-2xl text-xs px-3 py-1 bg-gray-200 text-gray-700 border border-gray-700 cursor-pointer"
                                            data-label-id={id}
                                            style={{ borderStyle: filteredLabelIds.includes(id) ? 'dashed' : undefined }}
                                            // @ts-expect-error | Will fix this later
                                            onClick={handleLabelClick}
                                        >
                                            {label}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex">
                        <a
                            onClick={toggleShowAdditionalFilters}
                            className="cursor-pointer bg-gray-200 py-2 px-3 text-sm rounded-xl flex items-center gap-1 select-none"
                        >
                            Weitere Filter <FontAwesomeIcon className="w-2" icon={faChevronDown} />
                        </a>
                    </div>
                )}
            </div>
        </FormProvider>
    );
};

export default ApplicationOverviewAdditionalFilters;
