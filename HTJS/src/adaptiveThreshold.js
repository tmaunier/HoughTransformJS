const adaptiveThreshold = (threshold, kernelSize = 5) => (raster, copy_mode = true) => {

// Copy input raster
let output = T.Raster.from(raster,copy_mode);

// DO SOMETHING
. . .
return output ;
};
From times/src/process/math.js
