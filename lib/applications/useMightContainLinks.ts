import type ApplicationDataRow from 'lib/application-form/ApplicationDataRow';

const useMightContainLinks = (detail: ApplicationDataRow): boolean => {

    // We just know that this is currently the only field where it's relevant
    return detail.name === 'link';
};

export default useMightContainLinks;
