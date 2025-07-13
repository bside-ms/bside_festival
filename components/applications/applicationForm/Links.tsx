'use client';

import type { ApplicationFormValues } from '@/components/applications/applicationForm/ApplicationForm';
import TextInput from '@/components/form/TextInput';
import isEmptyString from '@/lib/common/helper/isEmptyString';
import isUrl from 'is-url';
import type { ReactElement } from 'react';
import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

const Links = (): ReactElement => {
    const {
        formState: { dirtyFields },
    } = useFormContext<ApplicationFormValues>();

    const validateUrl = useCallback((url: string): string | undefined => {
        if (isEmptyString(url)) {
            return undefined;
        }

        if (!isUrl(/^https?:\/\//.test(url) ? url : `http://${url}`)) {
            return 'Bitte gib eine gültige URL an';
        }
    }, []);

    return (
        <div className="flex flex-col gap-1">
            <TextInput<ApplicationFormValues> name="url1" label="Link" info="Website, Social Media, etc." validate={validateUrl} />
            {dirtyFields.url1 === true && <TextInput<ApplicationFormValues> name="url2" label="Link" validate={validateUrl} />}
            {dirtyFields.url2 === true && <TextInput<ApplicationFormValues> name="url3" label="Link" validate={validateUrl} />}
            {dirtyFields.url3 === true && <TextInput<ApplicationFormValues> name="url4" label="Link" validate={validateUrl} />}
            {dirtyFields.url4 === true && <TextInput<ApplicationFormValues> name="url5" label="Link" validate={validateUrl} />}
        </div>
    );
};

export default Links;
