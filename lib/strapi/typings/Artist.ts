import type ConcertArtist from 'lib/strapi/typings/ConcertArtist';
import type PerformanceArtist from 'lib/strapi/typings/PerformanceArtist';
import type ReadingArtist from 'lib/strapi/typings/ReadingArtist';
import type WorkshopOrganizer from 'lib/strapi/typings/WorkshopOrganizer';

type Artist = ConcertArtist | WorkshopOrganizer | ReadingArtist | PerformanceArtist;

export default Artist;
