import { Skia } from '@shopify/react-native-skia';

export const drawLineMode = (startX, startY, paint, color, penWidth) => {
    console.log(`startX: ${startX}, startY: ${startY}`);
    const path = Skia.Path.Make();
    console.log(`path: ` , path);
    path.moveTo(startX, startY);
    path.lineTo(startX, startY);

    paint.setColor(Skia.Color(color));
    paint.setStrokeWidth(penWidth);
    return { path, paint };
};

export const drawDashedLineMode = (startX, startY, paint, color, penWidth) => {
    const path = Skia.Path.Make();
    path.moveTo(startX, startY);
    path.lineTo(startX, startY);

    paint.setColor(Skia.Color(color));
    paint.setStrokeWidth(penWidth);
    paint.setPathEffect(Skia.PathEffect.MakeDash([10, 10], 0));
    return { path, paint };
};

export const drawTriangleStamp = (startX, startY, size, paint, color) => {

    const path = Skia.Path.Make();

    // Define the three points of the triangle
    const halfSize = size / 2;
    const points = [
        { x: startX, y: startY - halfSize }, // Top vertex
        { x: startX - halfSize, y: startY + halfSize }, // Bottom left vertex
        { x: startX + halfSize, y: startY + halfSize } // Bottom right vertex
    ];

    path.moveTo(points[0].x, points[0].y); // Move to the top vertex
    path.lineTo(points[1].x, points[1].y); // Draw line to the bottom left vertex
    path.lineTo(points[2].x, points[2].y); // Draw line to the bottom right vertex
    path.lineTo(points[0].x, points[0].y); // Draw line back to the top vertex
    path.close(); // Close the path to form the triangle

    paint.setColor(Skia.Color(color));
    return { path, paint };
};

export const drawCircleStamp = (centerX, centerY, radius, paint, color) => {
    const path = Skia.Path.Make(); 
    path.addCircle(centerX, centerY, radius); 
    path.close();

    paint.setColor(Skia.Color(color));
    return { path, paint };
};

export const drawRectangleStamp = (centerX, centerY, width, height, paint, color) => {
    const path = Skia.Path.Make(); 
    const rect = {
        x: centerX - width / 2,
        y: centerY - height / 2,
        width: width,
        height: height
    };
    path.addRect(rect);
    path.close();
    
    paint.setColor(Skia.Color(color));
    return { path, paint };
};

export const drawArrowHeadStamp = (startX, startY, endX, endY, arrowHeadSize, paint, color) => {
    const path = Skia.Path.Make();
    
    // Draw the horizontal line
    path.moveTo(startX, startY);
    path.lineTo(startX - 30, startY);

    // Calculate the angle of the arrow
    const angle = Math.atan2(endY - startY, endX - startX);

    // Calculate the points for the arrowhead
    const arrowPoint1X = endX - arrowHeadSize * Math.cos(angle - Math.PI / 6);
    const arrowPoint1Y = endY - arrowHeadSize * Math.sin(angle - Math.PI / 6);
    const arrowPoint2X = endX - arrowHeadSize * Math.cos(angle + Math.PI / 6);
    const arrowPoint2Y = endY - arrowHeadSize * Math.sin(angle + Math.PI / 6);

    // Draw the arrow line from the end of the horizontal line to the end point
    path.lineTo(endX, endY);

    // Draw the arrowhead
    path.moveTo(endX, endY);
    path.lineTo(arrowPoint1X, arrowPoint1Y);
    path.moveTo(endX, endY);
    path.lineTo(arrowPoint2X, arrowPoint2Y);

    path.close();

    paint.setColor(Skia.Color(color));
    return { path, paint };
};

export const drawArrowTailStamp = (startX, startY, endX, endY, arrowHeadSize, paint, color) => {
    const path = Skia.Path.Make();
    
    // Draw the horizontal line
    path.moveTo(startX, startY);
    path.lineTo(startX + 30, startY);

    // Calculate the angle of the arrow
    const angle = Math.atan2(endY - startY, endX - startX);

    // Calculate the points for the arrowhead
    const arrowPoint1X = startX + arrowHeadSize * Math.cos(angle - Math.PI / 6);
    const arrowPoint1Y = startY + arrowHeadSize * Math.sin(angle - Math.PI / 6);
    const arrowPoint2X = startX + arrowHeadSize * Math.cos(angle + Math.PI / 6);
    const arrowPoint2Y = startY + arrowHeadSize * Math.sin(angle + Math.PI / 6);

    // Draw the arrow line from the end of the horizontal line to the end point
    path.lineTo(endX, endY);

    // Draw the arrowhead
    path.moveTo(endX, endY);
    path.lineTo(arrowPoint1X, arrowPoint1Y);
    path.moveTo(endX, endY);
    path.lineTo(arrowPoint2X, arrowPoint2Y);

    path.close();
    
    paint.setColor(Skia.Color(color));
    return { path, paint };
};
