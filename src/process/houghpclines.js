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
 * Théo Falgarone - Tristan Maunier - Christian Té - Jean-Christophe Taveau
 */

/**
 * Calculate the slope with two points coordinates from hough space of a line
 *
 * @param {point} p1 - coordinates of first point ([x,y])
 * @param {point} p2 - coordinates of second point ([x,y])
 * @return {float} slope - line's slope from p1 and p2
 *
 * @author Tristan Maunier
 */

const slope = (p1,p2) => {
  if (p1[0]==p2[0]){
    return null;
  }
  else if (p1[1]==p2[1]){
    return 0.0;
  }
  else {
    return (p2[1]-p1[1])/(p2[0]-p1[0]);
  }
}

/**
 * Calculate the intercept point with the axe y of a line
 *
 * @param {float} slope - coordinates of first point ([x,y])
 * @param {point} p - coordinates of a point belonging to the line ([x,y])
 * @return {float} intercept - line's intercept point on axe y
 *
 * @author Tristan Maunier
 */

const intercept = (slope, p) => {
  if (slope === null) {
    return p[0];
    }
  else {
    return p[1] - slope * p[0];
  }
}

/**
 * Calculate all the points coordinates in the hough space according to the 
 *
 * @param {integer} x - coordinate x of edge
 * @param {integer} y - coordinate y of edge
 * @param {integer} D - half hough space width, for calculation purpose
 * @param {integer} V - half hough space height, for calculation purpose
 * @return {array} coord - coord points to be added in the hough space ({x,y})
 *
 * @author Tristan Maunier
 */

const linefrompoints = (x,y,D,V) => {
  let p1 = [0,-y+V];
  let p2 = [D,x+V];
  let p3 = [2*D,y+V];
  let slope1 = slope(p1,p2);
  let slope2 = slope(p2,p3);
  let intercept1 = intercept(slope1,p2);
  let intercept2 = intercept(slope2,p2);

  let coord = new Array() ;
  for (let xc = p1[0]; xc < p2[0];xc++) {
    let yc = slope1 * xc + intercept1;
    coord.push({x : xc , y : yc});
  }
  for (let xc = p2[0]; xc <= p3[0];xc++) {
    let yc = slope2 * xc + intercept2;
    coord.push({x : xc , y : yc});
  }
  return coord;
}

/**
 * Calculate and fill the hough space
 *
 * @param {raster} rast - image raster
 * @param {image float32} accu - hough space accumulator
 * @return {image float32} accu - calculate hough space accumulator
 *
 * @author Tristan Maunier
 */

const houghspacepclines = (rast,accu) => {
  for (let i=0 ; i<rast.length; i++) {
    if(rast.get(i) == 255) {
      let linepoint = linefrompoints(rast.x(i),rast.y(i),accu.width/2.0,accu.height/2.0);
      for (let j=0 ; j<linepoint.length; j++) {
        accu.raster.setPixel(linepoint[j].x, linepoint[j].y,accu.raster.getPixel(linepoint[j].x,linepoint[j].y)+1) ;
      }
    }
  }
  return accu;
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
 * @return {array} array - array of lines parameters (x,y)
 *
 * @author Théo Falgarone
 */

const thresholdaccupclines = (accu,threshold) => {
  let array = new Array() ;
  for (var i=0 ; i<accu.length ; i++){
    (accu.raster.get(i) > threshold)  ? array.push({xl : accu.raster.x(i), yl : accu.raster.y(i)}) : 0 ;
  }
  return array ;
}

/**
 * Draw the lines found in the original image
 *
 * @param {raster} rast - image raster
 * @param {array} lines - array of lines parameters (x,y)
 * @param {integer} D - half hough space width, for calculation purpose
 * @param {integer} V - half hough space height, for calculation purpose
 * @return {raster} rast - image raster
 *
 * @author Tristan Maunier
 */

const drawpclines = (rast,lines,D,V) => {
  for (let i=0 ; i<lines.length ; i++){
    if (lines[i].xl < D){
      console.log("T");
      let X1 = lines[i].xl - D/2.0 , Y1 = 0.0 , X2 = 0.0 , Y2 = lines[i].yl - V/2.0 ;
      let a = (X1-X2)/(Y1-Y2);
      let b = Y2 ;
      console.log(a,b);
      for (let x=0 ; x<rast.width ; x++){
        let y = Math.round(a * x + b,0) ;
        if (y>=0 && y<rast.height){
          rast.setPixel(x,y,125);
        }
      }
    }
    else {
      console.log("S");
      let X1 = 0.0 , Y1 = lines[i].yl - V/2.0 , X2 = lines[i].xl - D/2.0 , Y2 = 0.0 ;
      let a = (X1-X2)/(Y1-Y2);
      let b = Y1;
      console.log(a,b);
      for (let x=0 ; x<rast.width ; x++){
        let y = Math.round(a * x + b,0) ;
        if (y>=0 && y<rast.height){
          rast.setPixel(x,y,125);
        }
      }
    }
  }
  return rast;
}

/**
 * Declare the hough space and detect lines with previous functions
 *
 * @param {image uint8} img - original image
 * @param {boolean} copy_mode - true
 * @return {raster} rast - image raster
 *
 * @author Tristan Maunier
 */

const pclinesdetection = (img,copy_mode=true) => {
  let rast = T.Raster.from(img,copy_mode);
  const MAX = Math.max(rast.width,rast.height);
  const D = MAX;
  const V = MAX;

  let accumulateur = new T.Image('float32', D*2, V*2);
  accumulateur = houghspacepclines(rast,accumulateur);
  let lines = thresholdaccupclines(accumulateur,findmaxaccu(accumulateur)*0.5) ;
  rast = drawpclines(rast,lines, D, V);
  return rast ;
}

