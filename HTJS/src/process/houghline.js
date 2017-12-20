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
 * @author Théo Falgarone
 */

const houghspacelines = (rast,accu) => {
  for (let i=0 ; i<rast.length ; i++) {
    if(rast.get(i) == 255) {
      for (let thetaindex=0 ; thetaindex<ThetaAxisSize ; thetaindex++) {
        let rho = accu.raster.height/2 + Math.round(rast.x(i) * Math.cos(thetaindex) + rast.y(i) * Math.sin(thetaindex),) ;
        accu.raster.setPixel(thetaindex,rho,accu.raster.getPixel(thetaindex,rho)+1) ;
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

/*
let j = 0;
const findmaxaccu = (x,j,accu) => {
  if (j==accu.length){
    return x ;
  }
  return findmaxaccu(Math.max(x,accu.raster.get(j)),j++,accu);
}
*/

/**
 * Find the highest value in the hough space
 *
 * @param {image float32} accu - hough space accumulator
 * @param {integer} threshold - threshold value
 * @return {array} array - array of lines parameters (rho,theta)
 *
 * @author Théo Falgarone
 */

const thresholdacculines = (accu,threshold) => {
  let lines = new Array() ;
  for (var i=0 ; i<accu.raster.length ; i++){
    (accu.raster.get(i) > threshold) ? lines.push({rho : accu.raster.y(i) - accu.raster.height/2, theta : accu.raster.x(i)}) : 0 ;
  }
  return lines ;
}

/*
const thresholdaccu = (accu,threshold) => accu.raster.pixelData.map( (X,i) => (X>threshold) ? {rho : accu.raster.y(i) - accu.raster.height/2.0, theta : accu.raster.x(i)} : 0.0 )
*/

/**
 * Draw the lines found in the original image
 *
 * @param {raster} rast - image raster
 * @param {array} lines - array of lines parameters (rho,theta)
 * @return {raster} rast - image raster
 *
 * @author Théo Falgarone
 */

const drawlines = (rast,lines) => {
  for (let x=0 ; x<rast.length ; x++){
    for (let i=0 ; i<lines.length ; i++){
      let y = Math.round((lines[i].rho - x * Math.cos(lines[i].theta)) / Math.sin(lines[i].theta),0);
      (y >= 0 && y < rast.width) ? rast.setPixel(x,y,125) : 0 ;
    }
  }
  return rast;
}

/*
const drawlines = (rast,lines) => {
  for (let x=0 ; x<rast.length ; x++){
    for (let i=0 ; i<lines.length ; i++){
      let y = Math.round((lines[i].rho - x * Math.cos(lines[i].theta)) / Math.sin(lines[i].theta),0);
      (y >= 0 && y < rast.width) ? rast.setPixel(x,y,125) : 0 ;
    }
  }
  return rast;
}
*/

/**
 * Declare the hough space and detect lines with previous functions
 *
 * @param {image uint8} img - original image
 * @param {boolean} copy_mode - true
 * @return {raster} rast - image raster
 *
 * @author Théo Falgarone
 */

const linesdetection = (img,copy_mode=true) => {
  let rast = T.Raster.from(img,copy_mode);
  const Rhomax = Math.round(Math.sqrt(rast.width * rast.width + rast.height * rast.height),0) ;
  let accumulateur = new T.Image('float32',ThetaAxisSize,2*Rhomax) ;
  accumulateur = houghspacelines(rast,accumulateur) ;
  let lines = thresholdacculines(accumulateur,findmaxaccu(accumulateur)*0.6) ;
  rast = drawlines(rast,lines);
  return rast ;
}

