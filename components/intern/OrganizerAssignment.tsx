'use client';

import { setApplicationOrganizers } from '@/lib/actions/applicationActions';
import { getOrganizerAssignmentOptions } from '@/lib/actions/organizerActions';
import type { KeycloakUser } from '@/lib/keycloak/getKeycloakUsers';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import type { ReactElement } from 'react';
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
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
    const [isPending, startTransition] = useTransition();
    const [availableOrganizers, setAvailableOrganizers] = useState<Array<KeycloakUser> | null>(null);
    const [responsibleOrganizerIds, setResponsibleOrganizerIds] = useState<Array<string>>([]);
    const [hasLoadError, setHasLoadError] = useState(false);

    useEffect(() => {
        let isCancelled = false;

        void getOrganizerAssignmentOptions()
            .then(({ availableOrganizers: organizers, responsibleOrganizerIds: assignedIds }) => {
                if (isCancelled) {
                    return;
                }

                setAvailableOrganizers(organizers);
                setResponsibleOrganizerIds(assignedIds);
            })
            .catch(() => {
                if (!isCancelled) {
                    setHasLoadError(true);
                }
            });

        return () => {
            isCancelled = true;
        };
    }, []);

    const responsibleOrganizerIdSet = useMemo(() => new Set(responsibleOrganizerIds), [responsibleOrganizerIds]);
    const organizerOptions = useMemo<Array<OrganizerOptionGroup>>(() => {
        if (availableOrganizers === null) {
            return [];
        }

        const allOptions = availableOrganizers.map(({ id, name }) => ({ label: name, value: id }));
        const responsibleOptions = allOptions.filter(({ value }) => responsibleOrganizerIdSet.has(value));
        const otherOptions = allOptions.filter(({ value }) => !responsibleOrganizerIdSet.has(value));

        return [
            ...(responsibleOptions.length > 0 ? [{ label: '', options: responsibleOptions }] : []),
            ...(otherOptions.length > 0 ? [{ label: responsibleOptions.length > 0 ? 'separator' : '', options: otherOptions }] : []),
        ];
    }, [availableOrganizers, responsibleOrganizerIdSet]);
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
            startTransition(async () => {
                await setApplicationOrganizers(
                    application.id,
                    nextOptions.map(({ label, value }) => ({ organizerName: label, organizerUserId: value })),
                );
            });
        },
        [application.id],
    );

    if (hasLoadError) {
        return (
            <div className="space-y-2">
                <div className="font-display text-xl">Zuständigkeit</div>
                <div className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
                    Personen konnten nicht geladen werden.
                </div>
            </div>
        );
    }

    if (availableOrganizers === null) {
        return (
            <div className="space-y-2">
                <div className="font-display text-xl">Zuständigkeit</div>
                <div className="rounded border border-black/20 bg-white px-3 py-2 text-sm text-black/50">Personen werden geladen…</div>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className="font-display text-xl">Zuständigkeit</div>

            <Select<OrganizerOption, true, OrganizerOptionGroup>
                instanceId="contribution-organizer-assignment"
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
