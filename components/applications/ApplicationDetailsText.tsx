import { Fragment } from 'react';
import type { ReactElement } from 'react';
import createUrlRegExp from 'url-regex-safe';
import type ApplicationDataRow from 'lib/application-form/ApplicationDataRow';
import useMightContainLinks from 'lib/applications/useMightContainLinks';

interface Props {
    data: ApplicationDataRow;
}

const NormalText = ({ text }: { text: string }): ReactElement => (
    <div>{text}</div>
);

const TextWithLinks = ({ text }: { text: string }): ReactElement => {

    let shownText = text;

    createUrlRegExp().exec(text)?.forEach(matchedUrl => {
        shownText.split(matchedUrl);

        shownText = shownText.replace(matchedUrl, `<a href="${matchedUrl}" target="_blank" class="underline italic">${matchedUrl}</a>`);
    });

    // eslint-disable-next-line react/no-danger
    return <div className="break-all" dangerouslySetInnerHTML={{ __html: shownText }} />;
};

const ApplicationDetailsText = ({ data }: Props): ReactElement => {

    const mightContainLinks = useMightContainLinks(data);

    return (
        <>
            <div className="underline">{data.label}</div>

            {data.value.split(/\n/).map(
                (line, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Fragment key={index}>
                        {mightContainLinks
                            ? <TextWithLinks text={line} />
                            : <NormalText text={line} />
                        }
                    </Fragment>
                )
            )}
        </>
    );
};

export default ApplicationDetailsText;
