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

// const rMax = Math.round(Math.sqrt(rast.width * rast.width + rast.height * rast.height),0) ; CALCUL DELA DIAGONALE DU RASTER



//diagonale : 355 183
const slope = (p1,p2) => {
  let slope = 0;
  if (p1[0]==p2[0]){
    return slope = null;
  }
  else if (p1[1]==p2[1]){
    return slope = 0;
  }
  else {
    return slope = (p2[1]-p1[1])/(p2[0]-p1[0]);
  }
}
const intercept = (slope, p) => {
  let intercept = 0;
  if (slope === null) {
    return intercept = p[0];
    }
  else {
    return intercept = p[1] - slope * p[0];
  }

}
const linefrompoints = (x, y,V,D) => {
  let p1 = [0,-y+V];
  let p2 = [D,x+V];
  let p3 = [2*D,y];

  let slope1 = slope(p1,p2);
  let slope2 = slope(p2,p3);


  let intercept1 = intercept(slope1,p2);
  let intercept2 = intercept(slope2,p2);


  let coord = new Array() ;
  for (let xc = p1[0]; xc <= p2[0];x++) {
    let yc = slope1 * xc + intercept1;
    coord.push({x : xc , y : yc});
  }
  for (let xc = p2[0]; xc <= p3[0];x++) {
    let yc = slope2 * xc + intercept2;
    coord.push({x : xc , y : yc});
  }
  return coord;
}


const houghspace = (rast,accu,V,D) => {
  for (let i=0 ; i<rast.length ; i++) {
    if(rast.get(i) == 255) {
      let x = rast.x(i);
      let y = rast.y(i);
      let linepoint = linefrompoints(x,y,V,D);
      for (let i=0 ; i<linepoint.length; i++) {
      let xl = linepoint[i].x; //x
      let yl = linepoint [i].y; //y
      accu.raster.setPixel(xl, yl,accu.raster.getPixel(x,y)+1) ;
      }
  }
  }
  return accu;
}



/*
	for i in line {
        let rho = accu.raster.height/2 + Math.round(rast.x(i) * Math.cos(thetaindex) + rast.y(i) * Math.sin(thetaindex),) ;
        accu.raster.setPixel(thetaindex,rho,accu.raster.getPixel(thetaindex,rho)+1) ;
      }
    }
  }
  return accu ;
}
*/



const drawlines = (rast,lines, D, V) => {
  for (let i=0 ; i<lines.length ; i++){
    console.log(lines[i]);
    for (let p=0; p<rast.length; p++){
    if (lines[i].x < D){
    var slope = (((lines[i].y - V) - rast.y(p)  / (lines[i].x - D)) ;
      if (y >= 0 && y < rast.width){
        var leftborder = y + (0 - x) * slope;
      var rightborder = y + (rast.raster.width - x) * slope;
        rast.setPixel(leftborder,rightborder,125);
      }
    }
    else {
      if (y >= 0 && y < rast.width){
      var slope =  (((lines[i].y - V) + rast.y(p)  / (lines[i].x - D));
      var leftborder = y + (0 - x) * slope;
      var rightborder = y + (rast.raster.width - x) * slope;
        rast.setPixel(leftborder,rightborder,125);
      }
  }
    }
  return rast;
}


const findmaxaccu = (accu) => {
  let maxi = 0 ;
  for (var i=0 ; i<accu.raster.length ; i++){
    maxi = (accu.raster.get(i) > maxi) ? accu.raster.get(i) : maxi ;
  }
  return maxi;
}

const thresholdaccu = (accu,threshold) => {
  let array = new Array() ;
  const D = accu.raster.width/2 ;
  for (var i=0 ; i<accu.raster.length ; i++){
    if (accu.raster.x(i)<D
    (accu.raster.get(i) > threshold) ? array.push({rho : accu.raster.y(i) - accu.raster.height/2, theta : accu.raster.x(i)}) : 0 ;
  }
  return array ;
}

const houghpclines = (img,copy_mode=true) => {
  let rast = T.Raster.from(img,copy_mode);
  const W = rast.width;
  const H = rast.height;
  const MAX = Math.Max(W,H);
  const D = MAX; //Random const
  const V = MAX;
  const V2 = 2*V;
  const D2 = 2*D;

  let accumulateur = new T.Image('float32', D2, V2);
  accumulateur = houghspace(V,D,rast,accumulateur);
  let lines = thresholdaccu(accumulateur,findmaxaccu(accumulateur)*0.6) ;
  rast = drawlines(rast,lines, D, V);
  return rast ;
}
