let img = new T.Image('uint8',500,500);
img.setPixels(diagonale_pixels);

let win = new T.Window('Hough Lines');

let workflow = T.pipe(linesdetection, T.view);
let view = workflow(img.getRaster());

win.addView(view);
win.addToDOM('workspace');

