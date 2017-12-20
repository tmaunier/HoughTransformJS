//lines detection
let img = new T.Image('uint8',500,500);
img.setPixels(diagonale_pixels);

let win = new T.Window('Hough Lines');

let workflow = T.pipe(linesdetection, T.view);
let view = workflow(img.getRaster());

win.addView(view);
win.addToDOM('workspace');

//circles detection

let img2 = new T.Image('uint8',400,400);
img2.setPixels(circle_pixels);

let win2 = new T.Window('Hough Circles');

let workflow2 = T.pipe(circlesdetection, T.view);
let view2 = workflow2(img2.getRaster());

win2.addView(view2);
win2.addToDOM('workspace');

//paralel lines detection

let img3 = new T.Image('uint8',500,500);
img3.setPixels(diagonale_pixels);

let win3 = new T.Window('Hough Paralel line');

let workflow3 = T.pipe(pclinesdetection, T.view);
let view3 = workflow3(img3.getRaster());

win3.addView(view3);
win3.addToDOM('workspace');

