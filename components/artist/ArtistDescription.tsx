import type { ReactElement } from 'react';
import ReactHtmlParser from 'react-html-parser';
import TruncateMarkup from 'react-truncate-markup';
import EditorJsBlocks from 'components/editorJs/EditorJsBlocks';
import getEditorJsParagraphsAsHtml from 'lib/editorJs/getEditorJsDataAsHtml';
import useEditorJsData from 'lib/editorJs/useEditorJsData';
import type { default as ArtistModel } from 'lib/strapi/typings/Artist';

interface Props {
    artist: ArtistModel;
    truncateAfterLines?: number;
}

const ArtistDescription = ({ artist, truncateAfterLines }: Props): ReactElement | null => {

    const descriptionData = useEditorJsData(artist.attributes.Description);

    if (descriptionData === null) {
        return null;
    }

    if (truncateAfterLines === undefined) {
        return (
            <div>
                <EditorJsBlocks blocks={descriptionData.blocks} />
            </div>
        );
    }

    const editorJsDataAsHtml = getEditorJsParagraphsAsHtml(descriptionData);

    return (
        <TruncateMarkup lines={truncateAfterLines}>
            <div>
                {ReactHtmlParser(editorJsDataAsHtml)}
            </div>
        </TruncateMarkup>
    );
};

export default ArtistDescription;
