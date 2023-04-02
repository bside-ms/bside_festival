const formatNumber = (number: number, fractions = 0): string => {

    const numberFormat = new Intl.NumberFormat(
        'de-DE',
        { maximumFractionDigits: fractions, minimumFractionDigits: fractions }
    );

    return numberFormat.format(number);
};

export default formatNumber;
