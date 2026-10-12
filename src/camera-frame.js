// Fit in the space between the title and controls, rather than the full canvas.
// Independent of pixel density: all inputs are CSS pixels.
export function stageFrame({width,height,left=0,top=0,bottom=height,padding=24}) {
 const safeTop=Math.max(0,Math.min(height-80,top));
 const safeBottom=Math.max(safeTop+80,Math.min(height,bottom));
 const usableWidth=Math.max(80,width-left-padding*2);
 const usableHeight=Math.max(80,safeBottom-safeTop);
 return {offset:(safeTop+safeBottom-height)/2,diameter:Math.min(usableWidth,usableHeight)/1.12};
}
export function fitRadius(radius,canvasWidth,canvasHeight,diameter) {
 return radius*Math.min(canvasWidth,canvasHeight)/Math.max(1,diameter);
}
