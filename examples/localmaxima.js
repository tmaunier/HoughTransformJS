let img = new T.Image('uint8',500,500);
img.setPixels(new Uint8Array(blobs_pixels));

const ThetaSize = 360 ;
const Rhomax = Math.round(Math.sqrt(img.width * img.width + img.height * img.height),0) ;

let process_hough = cpu.pipe(houghLines(ThetaSize,Rhomax), cpu.view);
let view_hough = process_hough(img.getRaster());

let win_hough = new T.Window('Hough Lines');
win_hough.addView(view_hough);
win_hough.addToDOM('workspace');


let size = 5;
let radius = size / 2.0
let threshold = 10;

let Kernel = cpu.convolutionKernel(
  cpu.KERNEL_CIRCLE,                        // Circular kernel
  size,                                        // Circle contained in a squared kernel 5 x 5
  radius,                                      // Radius
  Array.from({length: size * size}).fill(1.0)      // Weights 1 for every cells (mean kernel)
);

let process = cpu.pipe(houghLines(ThetaSize,Rhomax),findmaxima(threshold,Kernel,cpu.BORDER_REPEAT), cpu.view);
let view = process(img.getRaster());

let win = new T.Window('Local Maxima');
win.addView(view);
win.addToDOM('workspace');

/*let img3 = new T.Image('uint8',256,254);
img3.setPixels(new Uint8Array(blobs_pixels));

let process3 = cpu.pipe(findmaxima(threshold,Kernel,cpu.BORDER_REPEAT), cpu.view);
let view3 = process3(img3.getRaster());

let win3 = new T.Window('Local Maxima');
win3.addView(view3);
win3.addToDOM('workspace');*/
