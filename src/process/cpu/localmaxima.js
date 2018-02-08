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

// Calc pixel value at position `index`in array `pixels` of size `width`x`height` with `kernel`
const findmaxima = (threshold,kernel,wrap = BORDER_CLAMP_TO_BORDER) => (raster,copy_mode=true) => {
  const findMaxFunc = (index,pixels,width,height,kernel,borderFunc) => {
    let [top,brim] = kernel.reduce( (sum,v) => {
      let pix = borderFunc(
        pixels,
        cpu.getX(index,width) + v.offsetX,
        cpu.getY(index,width) + v.offsetY,
        width,height);
      // Large kernel   
      sum[0] += pix;
      // Inner kernel
      sum[1] += pix * (v.weight & 2);
      return sum;
    },[0.0,0.0]);
    return (top - brim > threshold) ? 255 : 0;
  };

  //let border = (wrap === BORDER_CLAMP_TO_EDGE) ? clampEdge : ( (wrap === cpu.BORDER_REPEAT) ? repeat : ( (wrap === cpu.BORDER_MIRROR) ? mirror : clampBorder));
  let border = clampBorder ;
  //console.log(border.name);
  let output = T.Raster.from(raster,copy_mode);
  output.pixelData = _convolve(output.pixelData,output.width,output.height,kernel,border,findMaxFunc);
  return output;
}








const convolve = (kernel, wrap = cpu.BORDER_CLAMP_TO_BORDER) => (raster,copy=true) => {

  // Calc pixel value at position `index`in array `pixels` of size `width`x`height` with `kernel`
  const linearFunc = (index,pixels,width,height,kernel,borderFunc) => {
    return kernel.reduce( (sum,v) => {
      sum += borderFunc(
        pixels,
        cpu.getX(index,width) + v.offsetX, 
        cpu.getY(index,width) + v.offsetY,
        width,height
      ) * v.weight;
      return sum;
    },0.0);  
  };

  // Main 
  let border = (wrap === cpu.BORDER_CLAMP_TO_EDGE) ? fltr.clampEdge : ( (wrap === cpu.BORDER_REPEAT) ? fltr.repeat : ( (wrap === cpu.BORDER_MIRROR) ? mirror : fltr.clampBorder));
  console.log(border.name);

  let output =  T.Raster.from(raster,false);

  output.pixelData = fltr._convolve(raster.pixelData,raster.width,raster.height,kernel,border,linearFunc);

  return output;
}
