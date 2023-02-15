//nødvendig initialisering
intervals = defineIntervals();
resetCarPositionNormal();
let animation = setInterval(updateCarPositionNormal, 36);
setGivenTimeout();
streetChange();