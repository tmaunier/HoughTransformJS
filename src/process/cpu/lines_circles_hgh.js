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
 * @author Théo Falgarone
 */

const linesdetection = (img,copy_mode=true) => {
  let rast = T.Raster.from(img,copy_mode);
  const Rhomax = Math.round(Math.sqrt(rast.width * rast.width + rast.height * rast.height),0) ;
  let acculines = new T.Image('float32',ThetaAxisSize,2*Rhomax) ;
  acculines = houghspacelines(rast,acculines) ;
  let lines = thresholdacculines(acculines,findmaxaccu(acculines)*0.6) ;
  rast = drawlines(rast,lines);
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

