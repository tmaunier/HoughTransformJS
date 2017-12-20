let img = new T.Image('uint8',400,400);
img.setPixels(circle_pixels);

let win = new T.Window('Hough Circles');

let workflow = T.pipe(circlesdetection, T.view);
let view = workflow(img.getRaster());

win.addView(view);
win.addToDOM('workspace');

