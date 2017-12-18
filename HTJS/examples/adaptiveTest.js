const pixels = [
   4,1,2,2,
   0,4,1,3,
   3,1,0,4,
   2,1,3,2
 ];

// 1­ Create image and set pixels
let img = new T.Image('uint8',4,4);
img.setPixels(new Uint8ClampedArray(pixels));

// 2­ Define and run workflow
 let workflow = T.pipe(adaptiveThreshold(4,2),
// Test my function
 T.view
// Create a view of this raster
 );
let view = workflow(img.getRaster());


// 3­ Create a window and add a view to it
let win = new T.Window('Integral');
win.addView(view);

// Add the window to the DOM and display it
win.addToDOM('workspace');
