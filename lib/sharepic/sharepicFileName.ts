import { deburr, kebabCase } from 'lodash';

const sharepicFileName = (name: string): string => {
    const slug = kebabCase(deburr(name)).slice(0, 60);

    return `${slug.length > 0 ? slug : 'sharepic'}-b-side-festival-2026.png`;
};

export default sharepicFileName;
