/*
 *  TIMES: Tiny Image ECMAScript Application
 *  Copyright (C) 2017  Jean-Christophe Taveau.
 *
 *  This file is part of TIMES
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,Image
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with TIMES.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */


/**
 * <Description>
 *
 * @param {type} <name> - <Description>
 * @return {type} - <Description>
 *
 * @author
 */

const houghspace = (thetaAxisSize,rast,accu) => {
  for (var i=0 ; i<rast.length ; i++){
    if (rast.get(i) == 255){
      let cx = rast.x(i) ;
      let cy = rast.y(i) ;
      for (var r=1 ; r<accu.width ; r++){
        for (var t=0 ; t<thetaAxisSize ; t++){
          let x = Math.round(cx + r * Math.cos(t),0) ;
          let y = Math.round(cy + r * Math.sin(t),0) ;
          if (x>=0 && x<rast.width && y>=0 && y<rast.height){
            let index = Math.round(x + y * rast.width,0) ;
            accu.raster.setPixel(r,index,accu.raster.getPixel(r,index)+1);
          }
        }
      }
    }
  }
  console.log(accu.raster.pixelData) ;
  return accu ;
}

const findmaxaccu = (accu) => {
  let maxi = 0 ;
  for (var i=0 ; i<accu.length ; i++){
    if (accu.raster.get(i) > maxi){
      maxi = accu.raster.get(i);
    }
  }
  return maxi;
}

const thresholdaccu = (accu,threshold) => {
  let circles = new Array() ;
  for (var i=0 ; i<accu.length ; i++){
    if (accu.raster.get(i) > threshold){
      circles.push({c:accu.raster.y(i),r:accu.raster.x(i)});
    }
  }
  return circles;
}

const drawcircles = (rast,circles) => {
  for (var i=0 ; i<circles.length ; i++){
    let cx = rast.y(circles[i].c);
    let cy = rast.y(circles[i].c);
    console.log(circles[i]) ;
    for (var t=0 ; t<360 ; t++){
      let x = Math.round(rast.y(circles[i].c) + circles[i].r * Math.cos(t),0) ;
      let y = Math.round(rast.y(circles[i].c) + circles[i].r * Math.sin(t),0) ;
      if (x>=0 && x<rast.width && y>=0 && y<rast.height){
        rast.setPixel(x,y,125);
      }
    }
  }
  return rast ;
}

const circledetection = (img,copy_mode=true) => {
  let rast = T.Raster.from(img,copy_mode) ;
  const thetaAxisSize = 360 ;
  const rMax = Math.round(Math.sqrt(rast.width * rast.width + rast.height * rast.height),0) ;
  const rMin = 20 ;
  const radiusSize = rMax - rMin ;
  let accumulateur = new T.Image('float32',radiusSize,rast.length) ;
  accumulateur = houghspace(thetaAxisSize,rast,accumulateur) ;
  let circles = thresholdaccu(accumulateur,findmaxaccu(accumulateur)*0.9) ;
  rast = drawcircles(rast,circles);
  return rast ;
}
