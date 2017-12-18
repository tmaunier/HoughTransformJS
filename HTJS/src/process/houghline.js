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

//diagonale : 355 183

const houghspace = (thetaAxisSize,rast,accu) => {
  for (let i=0 ; i<rast.length ; i++) {
    if(rast.get(i) == 255) {
      for (let thetaindex=0 ; thetaindex<thetaAxisSize ; thetaindex++) {
        let rho = accu.raster.height/2 + Math.round(rast.x(i) * Math.cos(thetaindex) + rast.y(i) * Math.sin(thetaindex),) ;
        accu.raster.setPixel(thetaindex,rho,accu.raster.getPixel(thetaindex,rho)+1) ;
      }
    }
  }
  return accu ;
}

const findmaxaccu = (accu) => {
  let maxi = 0 ;
  for (var i=0 ; i<accu.raster.length ; i++){
    if (accu.raster.get(i) > maxi){
      maxi = accu.raster.get(i);
    }
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

const thresholdaccu = (accu,threshold) => {
  let array = new Array() ;
  for (var i=0 ; i<accu.raster.length ; i++){
    if (accu.raster.get(i) > threshold){
      array.push({rho : accu.raster.y(i) - accu.raster.height/2, theta : accu.raster.x(i)});
    }
  }
  return array ;
}


const drawlines = (rast,lines) => {
  for (var i=0 ; i<lines.length ; i++){
    console.log(lines[i]);
    for (var x=0 ; x<rast.length ; x++){
      var y = Math.round((lines[i].rho - x * Math.cos(lines[i].theta)) / Math.sin(lines[i].theta),0);
      if (y >= 0 && y < rast.width){
        rast.setPixel(x,y,125);
      }
    }
  }
  return rast;
}

const linedetection = (img,copy_mode=true) => {
  let rast = T.Raster.from(img,copy_mode);
  const thetaAxisSize = 360 ;
  const rhomax = Math.round(Math.sqrt(rast.width * rast.width + rast.height * rast.height),0) ;
  let accumulateur = new T.Image('float32',thetaAxisSize,2*rhomax) ;
  accumulateur = houghspace(thetaAxisSize,rast,accumulateur) ;
  let lines = thresholdaccu(accumulateur,findmaxaccu(accumulateur)*0.6) ;
  rast = drawlines(rast,lines);
  return rast ;
}

