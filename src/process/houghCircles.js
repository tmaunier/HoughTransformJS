const houghCircles = (hough_width,hough_height) => (raster,copy=true) => {
  let output =  T.Raster.from(raster,true);
  const ThetaAxisSize = 360;
  let w = raster.width;
  let h = raster.height;

  //update size
  output.width = hough_width;
  output.height = hough_height;
  output.type = 'float32';


  //output.pixelData = raster.pixelData.reduce((hspace,px,index)=> {
  for (var i=0 ; i<w*h ; i++){
  if (raster.get(i) == 255){
    let cx = raster.x(i) ;
    let cy = raster.y(i) ;
    let index = Math.floor(cx + cy * raster.width) ;
    for (var r=1 ; r<w/2 ; r++){
      for (var t=0 ; t<ThetaAxisSize ; t++){
        output.setPixel(r,index,output.getPixel(r,index)+1);
        //}
      }
    }
  }
}/*
return output;
});
*/
return output;

};
