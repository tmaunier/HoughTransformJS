let img = new T.Image('uint8',500,500);
img.setPixels(diagonale_pixels);

let process = cpu.pipe(linesdetection, cpu.view);
let view = process(img.getRaster());

let win = new T.Window('Hough Lines');
win.addView(view);
win.addToDOM('workspace');

