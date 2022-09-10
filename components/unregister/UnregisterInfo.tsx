import type { ReactElement } from 'react';
import useSWR from 'swr';
import SwrResponseWrapper from 'components/strapi/SwrResponseWrapper';
import fetcher from 'lib/common/fetcher';
import type StrapiResponse from 'lib/strapi/typings/StrapiResponse';

interface Props {
    hash: string;
}

const UnregisterInfo = ({ hash }: Props): ReactElement => {

    const swrUnregisterResponse = useSWR<StrapiResponse<{ success: boolean }>, Error>(`/api/registrations/unregister/${hash}`, fetcher);

    return (
        <div className="pb-14">
            <SwrResponseWrapper<{ success: boolean }> response={swrUnregisterResponse}>
                {({ success: wasSuccessfullyUnregistered }): ReactElement => (
                    <div className="flex justify-center">
                        <div className="text-pink-600 border-pink-300 border rounded py-7 px-4 grow max-w-3xl text-center">
                            {wasSuccessfullyUnregistered ? (
                                <div>
                                    Du hast dich erfolgreich vom Programmpunkt abgemeldet!
                                </div>
                            ) : (
                                <div>
                                    Bei der Abmeldung gab es leider ein Problem.<br />
                                    Bitte versuche es erneut oder wende dich an <a href="mailto:festival@b-side.ms">festival@b-side.ms</a>.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </SwrResponseWrapper>
        </div>
    );
};

export default UnregisterInfo;
