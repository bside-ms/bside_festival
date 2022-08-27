
import type { ReactElement } from 'react';
import type { default as ArtistModel } from 'lib/strapi/typings/Artist';

interface Props {
    artist: ArtistModel;
}

const ArtistName = ({ artist: { attributes: { Name } } }: Props): ReactElement => <div className="font-display">{Name}</div>;

export default ArtistName;
