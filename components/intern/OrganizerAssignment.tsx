'use client';

import { useInternWorkspaceContext } from '@/components/intern/InternWorkspaceContext';
import { assignOrganizer, removeOrganizer } from '@/lib/actions/applicationActions';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import type { ReactElement } from 'react';
import { useCallback, useMemo, useTransition } from 'react';
import Select, { components, type GroupBase, type GroupHeadingProps, type MultiValue } from 'react-select';

interface Props {
    application: SerializableParticipant;
}

interface OrganizerOption {
    label: string;
    value: string;
}

type OrganizerOptionGroup = GroupBase<OrganizerOption>;

const noOrganizerOptionsMessage = (): string => 'Keine Personen gefunden';

const organizerSelectClassNames = {
    control: (): string => '!rounded !border-black !shadow-none',
    groupHeading: (): string => '!m-0 !px-3 !py-1',
    multiValue: (): string => '!rounded-full !bg-black !text-white',
    multiValueLabel: (): string => '!text-white',
    multiValueRemove: (): string => '!text-white hover:!bg-white/20',
};

const GroupHeading = (props: GroupHeadingProps<OrganizerOption, true, OrganizerOptionGroup>): ReactElement | null => {
    if (props.children === 'separator') {
        return (
            <components.GroupHeading {...props}>
                <div className="border-t border-gray-200" />
            </components.GroupHeading>
        );
    }

    return null;
};

const organizerSelectComponents = {
    GroupHeading,
};

const OrganizerAssignment = ({ application }: Props): ReactElement => {
    const { allApplications, availableOrganizers } = useInternWorkspaceContext();
    const [isPending, startTransition] = useTransition();
    const assignedOrganizerIds = useMemo(
        () => application.organizers.map(({ organizerUserId }) => organizerUserId),
        [application.organizers],
    );
    const responsibleOrganizerIds = useMemo(
        () => new Set(allApplications.flatMap(({ organizers }) => organizers.map(({ organizerUserId }) => organizerUserId))),
        [allApplications],
    );
    const organizerOptions = useMemo<Array<OrganizerOptionGroup>>(() => {
        const allOptions = availableOrganizers.map(({ id, name }) => ({ label: name, value: id }));
        const responsibleOptions = allOptions.filter(({ value }) => responsibleOrganizerIds.has(value));
        const otherOptions = allOptions.filter(({ value }) => !responsibleOrganizerIds.has(value));

        return [
            ...(responsibleOptions.length > 0 ? [{ label: '', options: responsibleOptions }] : []),
            ...(otherOptions.length > 0 ? [{ label: responsibleOptions.length > 0 ? 'separator' : '', options: otherOptions }] : []),
        ];
    }, [availableOrganizers, responsibleOrganizerIds]);
    const selectedOptions = useMemo<Array<OrganizerOption>>(
        () =>
            application.organizers.map(({ organizerName, organizerUserId }) => ({
                label: organizerName,
                value: organizerUserId,
            })),
        [application.organizers],
    );

    const handleAssignmentChange = useCallback(
        (nextOptions: MultiValue<OrganizerOption>) => {
            const nextOrganizerIds = nextOptions.map(({ value }) => value);
            const organizerIdsToAdd = nextOrganizerIds.filter((organizerId) => !assignedOrganizerIds.includes(organizerId));
            const organizerIdsToRemove = assignedOrganizerIds.filter((organizerId) => !nextOrganizerIds.includes(organizerId));

            startTransition(async () => {
                await Promise.all([
                    ...organizerIdsToAdd.map(async (organizerId) => {
                        const organizer = availableOrganizers.find(({ id }) => id === organizerId);

                        if (organizer !== undefined) {
                            await assignOrganizer(application.id, organizer.id, organizer.name);
                        }
                    }),
                    ...organizerIdsToRemove.map(async (organizerId) => removeOrganizer(application.id, organizerId)),
                ]);
            });
        },
        [application.id, assignedOrganizerIds, availableOrganizers],
    );

    return (
        <div className="space-y-2">
            <div className="font-display text-xl">Zuständigkeit</div>

            <Select<OrganizerOption, true, OrganizerOptionGroup>
                value={selectedOptions}
                isDisabled={isPending || organizerOptions.length === 0}
                isMulti={true}
                options={organizerOptions}
                placeholder="Personen suchen und zuweisen"
                noOptionsMessage={noOrganizerOptionsMessage}
                className="text-sm"
                classNames={organizerSelectClassNames}
                components={organizerSelectComponents}
                onChange={handleAssignmentChange}
            />
        </div>
    );
};

export default OrganizerAssignment;
