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
    let [top,brim] = kernel.reduce( (hat,v) => {
      let pix = borderFunc(
        pixels,
        cpu.getX(index,width) + v.offsetX,
        cpu.getY(index,width) + v.offsetY,
        width,height);
      // Large kernel   
      hat[0] = Math.max(hat[0],pix);
      // Inner kernel
      hat[1] = Math.max(hat[1],pix * (v.weight & 2));
      return hat;
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

