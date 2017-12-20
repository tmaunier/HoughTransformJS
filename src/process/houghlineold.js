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


const thetaAxisSize = 180 ;

const houghspace = (img,copy_mode=true) => {
  var accu = new Array(thetaAxisSize) ;
  for (let i=0 ; i<img.length ; i++){
    if (img.raster.get(i) == 255){
      for (let thetaindex=0 ; thetaindex<thetaAxisSize ; thetaindex++) {
        let rho = Math.round(img.raster.x(i) * Math.cos(thetaindex) +  img.raster.y(i) * Math.sin(thetaindex),1) ;
        if (accu[thetaindex] == null) accu[thetaindex] = [] ;
        if (accu[thetaindex][rho] == null) {
          accu[thetaindex][rho] = 1 ;
        } else {
          accu[thetaindex][rho]++;
        }
      }
    }
  }
  console.log(accu);
  return accu ;
}

const findmaxaccu = (accu) => {
  let maxi=0 ;
  for (let i=0 ; i<accu.length ; i++){
    for (let j in accu[i]){
      if (accu[i][j] > maxi){
        maxi = accu[i][j] ;
      }
    }
  }
  return maxi ;
}

const thresholdaccu = (accu,threshold) => {
  for (let i=0 ; i<accu.length ; i++){
    for (let j in accu[i]){
      if (accu[i][j] > threshold){
        console.log(j,i);
        drawline(j,i) ;
      }
    }
  }
}

const drawline = (rho,theta) => {
  for (let x=0 ; x<img.width ; x++){
    let y = Math.round((rho - x * Math.cos(theta)) / Math.sin(theta),0);
    if (y >= 0 && y < img.height){
      img.raster.setPixel(x,y,125);
    }
  }
}

