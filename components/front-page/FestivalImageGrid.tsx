import { Fragment } from 'react';
import type { ReactElement } from 'react';

const FestivalImageGrid = (): ReactElement => {
    const images = [
        ['/assets/images/festival/favs/bside_festival19_109.jpg'],
        ['/assets/images/festival/favs/bside_festival19_142.jpg', '/assets/images/festival/favs/bside_festival19_356.jpg'],
        ['/assets/images/festival/favs/bside_festival19_465.jpg', '/assets/images/festival/favs/bside_festival19_489.jpg'],
        ['/assets/images/festival/favs/bside_festival19_572.jpg'],
        ['/assets/images/festival/favs/bside_festival19_635.jpg', '/assets/images/festival/favs/bside_festival19_706.jpg'],
        ['/assets/images/festival/favs/b_side_festival_2019_buSS0.jpg', '/assets/images/festival/favs/b_side_festival_2019_CTi5u.jpg'],
        ['/assets/images/festival/favs/b_side_festival_2019_CVtvS.jpg', '/assets/images/festival/favs/b_side_festival_2019_mbYxg.jpg'],
        ['/assets/images/festival/favs/b_side_festival_2019_NFVKa.jpg'],
        ['/assets/images/festival/favs/b_side_festival_2019_RdqBu.jpg', '/assets/images/festival/favs/dsc03899.jpg'],
        ['/assets/images/festival/favs/dsc03899.jpg', '/assets/images/festival/favs/img_1740.jpg'],
        ['/assets/images/festival/favs/img_1809.jpg', '/assets/images/festival/favs/img_1881.jpg'],
        ['/assets/images/festival/favs/img_1890.jpg'],
        ['/assets/images/festival/favs/img_2005.jpg', '/assets/images/festival/favs/img_2027.jpg'],
    ];

    return (
        <div className="grid grid-cols-2 gap-4">
            {images.map((imageRow) => {
                if (imageRow.length === 1) {
                    return (
                        <div
                            key={imageRow[0]}
                            className="col-span-2 bg-[#234324] h-48 md:h-80 bg-center bg-cover"
                            style={{ backgroundImage: imageRow[0] !== undefined ? `url(${imageRow[0]})` : undefined }}
                        />
                    );
                }

                return (
                    <Fragment key={imageRow[0]}>
                        <div
                            className="bg-[#234324] h-48 md:h-80 bg-center bg-cover"
                            style={{ backgroundImage: imageRow[0] !== undefined ? `url(${imageRow[0]})` : undefined }}
                        />
                        <div
                            className="bg-[#234324] h-48 md:h-80 bg-center bg-cover"
                            style={{ backgroundImage: imageRow[1] !== undefined ? `url(${imageRow[1]})` : undefined }}
                        />
                    </Fragment>
                );
            })}
        </div>
    );
};

export default FestivalImageGrid;
