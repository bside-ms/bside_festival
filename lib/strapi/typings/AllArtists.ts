import type ConcertArtist from 'lib/strapi/typings/ConcertArtist';
import type ExhibitionArtist from 'lib/strapi/typings/ExhibitionArtist';
import type FamilyProgramOrganizer from 'lib/strapi/typings/FamilyProgramOrganizer';
import type PerformanceArtist from 'lib/strapi/typings/PerformanceArtist';
import type ReadingArtist from 'lib/strapi/typings/ReadingArtist';
import type WorkshopOrganizer from 'lib/strapi/typings/WorkshopOrganizer';

export default interface AllArtists {
  concertArtists: Array<ConcertArtist> | null;
  workshopsOrganizers: Array<WorkshopOrganizer> | null;
  readingArtists: Array<ReadingArtist> | null;
  performanceArtists: Array<PerformanceArtist> | null;
  familyProgramOrganizers: Array<FamilyProgramOrganizer> | null;
  exhibitionArtists: Array<ExhibitionArtist> | null;
}
