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
 * Jean-Christophe Taveau - Théo Falgarone - Tristan Maunier - Christian Té
 */

const ThetaAxisSize = 360 ;

/**
 * Calculate and fill the hough space
 *
 * @param {raster} rast - image raster
 * @param {image float32} accu - hough space accumulator
 * @return {image float32} accu - calculate hough space accumulator
 *
 * @author Christian Té
 */

const houghspacecircles = (rast,accu) => {
  for (var i=0 ; i<rast.length ; i++){
    if (rast.get(i) == 255){
      let cx = rast.x(i) ;
      let cy = rast.y(i) ;
      for (var r=1 ; r<accu.width ; r++){
        for (var t=0 ; t<ThetaAxisSize ; t+=2){
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
  return accu ;
}

/**
 * Find the highest value in the hough space
 *
 * @param {image float32} accu - hough space accumulator
 * @return {integer} maxi - highest value in the hough space
 *
 * @author Théo Falgarone
 */

const findmaxaccu = (accu) => {
  let maxi = 0 ;
  for (var i=0 ; i<accu.raster.length ; i++){
    maxi = (accu.raster.get(i) > maxi) ? accu.raster.get(i) : maxi ;
  }
  return maxi;
}

/**
 * Find the highest value in the hough space
 *
 * @param {image float32} accu - hough space accumulator
 * @param {integer} threshold - threshold value
 * @return {array} array - array of circles parameters (center,radius)
 *
 * @author Théo Falgarone
 */

const thresholdaccucircles = (accu,threshold) => {
  let circles = new Array() ;
  for (var i=0 ; i<accu.length ; i++){
    (accu.raster.get(i) > threshold) ? circles.push({c : accu.raster.y(i) , r : accu.raster.x(i)}) : 0 ;
  }
  return circles;
}

/**
 * Draw the circles found in the original image
 *
 * @param {raster} rast - image raster
 * @param {array} lines - array of circles parameters (center,radius)
 * @return {raster} rast - image raster
 *
 * @author Christian Té
 */

const drawcircles = (rast,circles) => {
  for (var i=0 ; i<circles.length ; i++){
    let cx = rast.y(circles[i].c);
    let cy = rast.y(circles[i].c);
    for (var t=0 ; t<ThetaAxisSize ; t++){
      let x = Math.round(rast.y(circles[i].c) + circles[i].r * Math.cos(t),0) ;
      let y = Math.round(rast.y(circles[i].c) + circles[i].r * Math.sin(t),0) ;
      if (x>=0 && x<rast.width && y>=0 && y<rast.height){
        rast.setPixel(x,y,125);
      }
    }
  }
  return rast ;
}

/**
 * Declare the hough space and detect circles with previous functions
 *
 * @param {image uint8} img - original image
 * @param {boolean} copy_mode - true
 * @return {raster} rast - image raster
 *
 * @author Christian Té
 */

const circlesdetection = (img,copy_mode=true) => {
  let rast = T.Raster.from(img,copy_mode) ;
  const RMax = Math.round(Math.sqrt(rast.width * rast.width + rast.height * rast.height),0) ;
  const RMin = 20 ;
  const RadiusSize = RMax - RMin ;
  let accumulateur = new T.Image('float32',RadiusSize,rast.length) ;
  accumulateur = houghspacecircles(rast,accumulateur) ;
  let circles = thresholdaccucircles(accumulateur,findmaxaccu(accumulateur)*0.9) ;
  rast = drawcircles(rast,circles);
  return rast ;
}

