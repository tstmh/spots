import React, { useState, useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Canvas, Path, Image, useImage, Skia, PaintStyle } from '@shopify/react-native-skia';
import { TextInput, View, TouchableOpacity, StyleSheet, Text, Modal, Image as RNImage, PanResponder, Alert } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import RNFS from 'react-native-fs';
import { drawLineMode, drawDashedLineMode } from '../common/Shapes';
import { legends } from '../common/Legends';
import PenWidthModal from '../common/PenWidthModal';
import ColorModal from '../common/ColorModal';
import ShapePickerModal from '../common/ShapePickerModal';
import PenPickerModal from '../common/PenPickerModal';

const SketchVehicle = forwardRef((props, ref) => {
    const { source, view, id, onCapture, rawMetadata, activeTabIndex, tabIndex } = props;

    const [fileName, setFileName] = useState(null);
    const containerRef = useRef(null);

    const [draggingCorner, setDraggingCorner] = useState(null);
    const draggingCornerRef = useRef(draggingCorner);

    useEffect(() => {
        draggingCornerRef.current = draggingCorner;
        console.log(`draggingCornerRef ${draggingCornerRef} draggingCorner ${draggingCorner}`)
    }, [draggingCorner]);

    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState([]);
    const imagesRef = useRef(images);
    const selectedImageRef = useRef(selectedImage);
    const offsetRef = useRef({});

    useEffect(() => {
        imagesRef.current = images;
    }, [images]);

    useEffect(() => {
        selectedImageRef.current = selectedImage;
    }, [selectedImage]);
    
    const [textInputs, setTextInputs] = useState([]); 
    const [selectedTextInput, setSelectedTextInput] = useState([]); 
    const textInputsRef = useRef(textInputs);
    const selectedTextInputRef = useRef(selectedTextInput);
    const offsetTextRef = useRef({ offsetX: 0, offsetY: 0 });

    useEffect(() => {
        textInputsRef.current = textInputs;
    }, [textInputs]);

    useEffect(() => {
        selectedTextInputRef.current = selectedTextInput;
    }, [selectedTextInput]);

    const [paths, setPaths] = useState([]);
    const pathsRef = useRef(paths);
    const [selectedPathIndex, setSelectedPathIndex] = useState([]);
    const selectedPathIndexRef = useRef(selectedPathIndex);
    const offsetPathRef = useRef({ offsetX: 0, offsetY: 0 });

    useEffect(() => {
        pathsRef.current = paths;
    }, [paths]);

    useEffect(() => {
        selectedPathIndexRef.current = selectedPathIndex;
    }, [selectedPathIndex]);

    const [color, setColor] = useState('black');
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [penWidth, setPenWidth] = useState(4); // Initial pen width
    const [eraserWidth, setEraserWidth] = useState(4); // Initial eraser width
    const [showPenWidthSlider, setShowPenWidthSlider] = useState(false);
    const [showShapePicker, setShowShapePicker] = useState(false); 
    const [shapeMode, setShapeMode] = useState('line');
    const [mode, setMode] = useState('draw'); // 'draw' or 'move'
    const [undoStack, setUndoStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);
    const [showLegendModal, setShowLegendModal] = useState(false);
    
    const [showPenPicker, setShowPenPicker] = useState(false);
    const [penMode, setPenMode] = useState('line');
    
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    const [startPos, setStartPos] = useState(null);
    const [endPos, setEndPos] = useState(null);

    const [selectionStartPos, setSelectionStartPos] = useState(null);
    const [selectionEndPos, setSelectionEndPos] = useState(null);
    const [selectionBox, setSelectionBox] = useState(null);
    const [showResizeHandles, setShowResizeHandles] = useState(false);
    const selectionBoxRef = useRef(selectionBox);
    useEffect(() => {
        selectionBoxRef.current = selectionBox;
    }, [selectionBox]);

    const [initialPositions, setInitialPositions] = useState({});
    const initialPositionsRef = useRef(initialPositions);

    useEffect(() => {
        initialPositionsRef.current = initialPositions;
    }, [initialPositions]);

    let imageWidth = 400;
    let imageHeight = 400;

    switch (view.toUpperCase()) {
        case 'FRONT':
            imageWidth = 400;
            imageHeight = 400;
            break;
        case 'LEFT':
            imageWidth = 550;
            imageHeight = 550;
            break;
        case 'RIGHT':
            imageWidth = 550;
            imageHeight = 550;
            break;
        case 'TOP':
            imageWidth = 400;
            imageHeight = 400;
            break;
        case 'REAR':
            imageWidth = 400;
            imageHeight = 400;
            break;
        case 'BOX':
            imageWidth = 570;
            imageHeight = 570;
            break;
        default:
            imageWidth = 400;
            imageHeight = 400;
            break;
    }

    const onLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;
        setCanvasSize({ width, height });
    };
    const centerX = (canvasSize.width - imageWidth) / 2;
    const centerY = (canvasSize.height - imageHeight) / 2;
    
    const canvasCenterX = canvasSize.width / 2;
    const canvasCenterY = canvasSize.height / 2;

    const image = useImage(source);
    const paint = Skia.Paint();
    paint.setStyle(PaintStyle.Stroke);

    useEffect(() => {
        if (id && view) {
            setFileName(`${id}_${view}`);
        }
    }, [id, view]);
    
    useEffect(() => {
        if (rawMetadata) {
            loadCanvasState(rawMetadata);
        }
    }, [rawMetadata]);

    useImperativeHandle(ref, () => ({
        captureSnapshot() {

            //remove selection boxes
            setSelectedPathIndex([]);
            setSelectedTextInput([]);
            setSelectedImage([]);
            setSelectionBox(null);
            
            return captureSnapshot();
        }
    }));

    const checkFileAndSize = async (filePath) => {
        try {
            const fileExists = await RNFS.exists(filePath);
    
            if (!fileExists) {
                console.log('File does not exist.');
                return { exists: false, size: null };
            }
    
            const stats = await RNFS.stat(filePath);
            return { exists: true, size: stats.size };
        } catch (error) {
            console.log('Error checking file and size:', error);
            return { exists: false, size: null };
        }
    };



    const captureSnapshot = async () => {

        console.log(`captureSnapshot for ${fileName}`)
        const aspectRatio = canvasSize.width / canvasSize.height;
        let snapshotWidth = 350;
        let snapshotHeight = snapshotWidth / aspectRatio; //416

        try {
            if (fileName) {
                const destPath = `${RNFS.CachesDirectoryPath}/${fileName}.png`;

                const currentFileInfo = await checkFileAndSize(destPath);
                console.log(`${destPath}`, currentFileInfo);
                console.log(`before capture ${fileName} File exists: ${currentFileInfo.exists}, File size: ${currentFileInfo.size} bytes`);

                if ( (currentFileInfo.size <= 673) || (activeTabIndex == tabIndex) ) {
                    //if is active tab or current file is empty
                    const uri = await ViewShot.captureRef(containerRef, {
                        format: 'png', quality: 0.5,
                        width: snapshotWidth,
                        height: snapshotHeight
                    });
                    console.log(`captured Snapshot for ${fileName}`, uri);
                    await RNFS.moveFile(uri, destPath);
                }
                
                const fileInfo = await checkFileAndSize(destPath);
                console.log(`${destPath}`, fileInfo);
                console.log(`${fileName} File exists: ${fileInfo.exists}, File size: ${fileInfo.size} bytes`);

                if (fileInfo.size <= 673) { // Adjust this threshold based on your blank image size
                    Alert.alert(
                        "Incomplete Snapshot",
                        `The snapshot for tab ${view.toUpperCase()} seems incomplete. Please manually navigate to this tab to ensure it renders properly.`,
                    );

                    return null;
                }
                
                const serializedState = serializeState(paths, images, textInputs);

                const sketch = {
                    uri: destPath,
                    view: view,
                    RAW_METADATA: serializedState
                };

                if (onCapture) {
                    onCapture(sketch);
                }
                return sketch;
            }

        } catch (error) {
            console.log("captureSnapshot error", error);
        }
    };

    const loadCanvasState = (RAW_METADATA) => {
        const { paths, images, textInputs } = JSON.parse(RAW_METADATA);

        const processedPaths = paths.map(p => {
            const hexColor = colorStringToHex(p.paint.color);
            const path = Skia.Path.MakeFromSVGString(p.path);
            const paint = Skia.Paint();
            
            paint.setColor(Skia.Color(hexColor));
            paint.setStrokeWidth(p.paint.strokeWidth);
            paint.setStyle(PaintStyle.Stroke);

            if (p.hasDashEffect) {
                paint.setPathEffect(Skia.PathEffect.MakeDash([10, 10], 0));
                const hasDashEffect = p.hasDashEffect || false;
                return { path, paint, hasDashEffect };
            }

            return { path, paint };
        });
    
        setPaths(processedPaths);
        setImages(images);
        if (textInputs){
            setTextInputs(textInputs);
        }
    };
    
    const rgbaToHex = (rgba) => {
        const toHex = (value) => {
            const hex = Math.round(value * 255).toString(16).padStart(2, '0');
            return hex.toUpperCase();
        };
        const [r, g, b, a] = rgba;
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    };
    
    const colorStringToHex = (colorString) => {
        const colorArray = colorString.split(',').map(value => parseFloat(value));
        return rgbaToHex(colorArray);
    };

    const serializeState = (paths, images, textInputs) => {
        let data = JSON.stringify({
            paths: paths.map(p => ({
                path: p.path.toSVGString(), 
                paint: {
                    color: p.paint.getColor().toString(),
                    strokeWidth: p.paint.getStrokeWidth(),
                },
                hasDashEffect: p.hasDashEffect || false
            })),
            images,
            textInputs
        });
        return data;
    };

    const handleTouch = (event) => {
        const { locationX, locationY } = event.nativeEvent;
        setSelectedTextInput([]);
        setSelectedImage([]);
    
        if (mode === 'draw') {
            
            let newShape;
            switch (penMode) {
                case 'line':
                    newShape = drawLineMode(locationX, locationY, paint.copy(), color, penWidth); 
                    break;
                case 'dashedLine':
                    newShape = drawDashedLineMode(locationX, locationY, paint.copy(), color, penWidth); 
                    newShape.hasDashEffect = true;
                    break;
            } 

            setPaths([...paths, newShape]);
            pushToUndoStack();
        } else if (mode === 'move'){
            selectPath(locationX, locationY);

            setSelectionStartPos({ x: locationX, y: locationY });
            setSelectionEndPos(null);
            setSelectionBox(null);
        } else if (mode === 'shape') {
            setStartPos({ x: locationX, y: locationY });
        }
    };

    const handleTouchMove = (event) => {
        const { locationX, locationY } = event.nativeEvent;
    
        if (mode === 'draw') {
            const updatedPaths = [...paths];
            const currentPath = updatedPaths[updatedPaths.length - 1];
            currentPath.path.lineTo(locationX, locationY);
            setPaths(updatedPaths);
        }
    
        if (mode === 'move') {
            console.log(`handleTouchMove mode ${mode} selectedPathIndex`, selectedPathIndex);
            if (selectedPathIndex != null && selectedPathIndex.length > 0){
                const dx = locationX - offsetPathRef.current.offsetX;
                const dy = locationY - offsetPathRef.current.offsetY;
                moveSelectedPath(dx, dy);
            } else {
                setSelectionEndPos({ x: locationX, y: locationY });
                const newSelectionBox = {
                    x: Math.min(selectionStartPos.x, locationX),
                    y: Math.min(selectionStartPos.y, locationY),
                    width: Math.abs(locationX - selectionStartPos.x),
                    height: Math.abs(locationY - selectionStartPos.y)
                };
                setSelectionBox(newSelectionBox);
                console.log('selection Box updated: ', newSelectionBox);
            }
        }
    
        if (mode === 'shape' && startPos) {
            setEndPos({ x: locationX, y: locationY });
        }

        setShowResizeHandles(false);
    };    

    const handleTouchEnd = () => {
        if (mode === 'shape' && startPos && endPos) {

            const shapeDrawFunctions = {
                line: drawLine,
                dashedLine: drawDashedLine,
                rectangle: drawSquare,
                triangle: drawTriangle,
                circle: drawCircle,
                curvedLine: (start, end) => drawCurvedLine(start, end, false),
                dashedCurvedLine: (start, end) => drawCurvedLine(start, end, true),
            };
    
            const drawFunction = shapeDrawFunctions[shapeMode] || drawArrow;
            
            // Create a new shape and add it to the paths state
            const newShape = drawFunction(startPos, endPos);
            setPaths([...paths, newShape]);
    
            setStartPos(null);
            setEndPos(null);
        } else if (mode === 'move' && selectionBox) {
            selectElementsInSelectionBox(selectionBox);
            //setSelectionBox(null);
            setSelectionStartPos(null);
            setSelectionEndPos(null);
        }

        setShowResizeHandles(true);
    };

    const renderDynamicShape = () => {
        if (mode === 'shape' && startPos && endPos) {
            const shapeDrawFunctions = {
                line: drawLine,
                dashedLine: drawDashedLine,
                rectangle: drawSquare,
                triangle: drawTriangle,
                circle: drawCircle,
                curvedLine: (start, end) => drawCurvedLine(start, end, false),
                dashedCurvedLine: (start, end) => drawCurvedLine(start, end, true),
            };
    
            const drawFunction = shapeDrawFunctions[shapeMode] || drawArrow;
            const shape = drawFunction(startPos, endPos);
    
            return <Path path={shape.path} paint={shape.paint} />;
        }
        return null;
    };    

    const handleBoundingBoxDragStart = (evt, gestureState) => {
        const { locationX, locationY } = evt.nativeEvent;
        console.log(`handleBoundingBoxDragStart`);

        // Initialize an empty object to hold the initial positions
        const initialPos = {};

        // Store the initial position of the selection box
        if (selectionBoxRef.current) {
            const { x, y } = selectionBoxRef.current;
            initialPos.selectionBox = { x, y };
        }

        // Store initial positions of all selected elements
        selectedImageRef.current.forEach(id => {
            const image = imagesRef.current.find(img => img.id === id);
            console.log('selectedImageRef image', image);
            if (image) {
                initialPos[`img-${id}`] = { x: image.x, y: image.y };
            }
        });
        selectedTextInputRef.current.forEach(id => {
            const textInput = textInputsRef.current.find(txt => txt.id === id);
            console.log('selectedTextInputRef textInput', textInput);
            if (textInput) {
                initialPos[`txt-${id}`] = { x: textInput.x, y: textInput.y };
            }
        });
        
        console.log('handleBoundingBoxDragStart selectedPathIndexRef', selectedPathIndexRef);
        selectedPathIndexRef.current.forEach(index => {
            console.log('selectedPathIndex path index', index);
            console.log('selectedPathIndex pathsRef', pathsRef);
            const path = pathsRef.current[index];
            console.log('selectedPathIndex path', path);
            if (path) {
                const bounds = path.path.getBounds();
                console.log(`bounds.x ${bounds.x} bounds.y ${bounds.y}`);
                initialPos[`path-${index}`] = { x: locationX, y: locationY };
                //initialPos[`path-${index}`] = { x: bounds.x, y: bounds.y };

                console.log(`initialPos path-${index}`, initialPos[`path-${index}`] );
            }
        });

        console.log('handleBoundingBoxDragStart initialPos', initialPos);
        setInitialPositions(initialPos);
    };
    
    const handleBoundingBoxDragMove = (evt, gestureState) => {
        console.log(`handleBoundingBoxDragMove initialPositionsRef`, initialPositionsRef.current);
        const dx = gestureState.dx;
        const dy = gestureState.dy;
        
        const { locationX, locationY } = evt.nativeEvent;

        // Update positions of all selected elements
        const updatedImages = imagesRef.current.map(image => {
            const key = `img-${image.id}`;
            console.log(`image.id ${image.id}, ${key} selectedImageRef.current`, selectedImageRef.current);
            console.log(`initialPositionsRef.current ${image.id}`, initialPositionsRef.current);

            if (selectedImageRef.current.includes(image.id) && initialPositionsRef.current[key]) {
                return {
                    ...image,
                    x: initialPositionsRef.current[key].x + dx,
                    y: initialPositionsRef.current[key].y + dy
                };
            }
            return image;
        });
        console.log(`updatedImages `, updatedImages);
        setImages(updatedImages);
    
        const updatedTextInputs = textInputsRef.current.map(textInput => {
            const key = `txt-${textInput.id}`;
            console.log(`textInput.id ${textInput.id}, ${key} selectedTextInputRef.current`, selectedTextInputRef.current);
            console.log(`initialPositionsRef.current ${textInput.id}`, initialPositionsRef.current);

            if (selectedTextInputRef.current.includes(textInput.id) && initialPositionsRef.current[key]) {
                return {
                    ...textInput,
                    x: initialPositionsRef.current[key].x + dx,
                    y: initialPositionsRef.current[key].y + dy
                };
            }
            return textInput;
        });
        console.log(`updatedTextInputs `, updatedTextInputs);
        setTextInputs(updatedTextInputs);
    
        // const updatedPaths = pathsRef.current.map((path, index) => {
        //     const key = `path-${index}`;
        //     console.log(`path.id ${index}, ${key} selectedPathIndex.current`, selectedPathIndexRef.current);
        //     console.log(`initialPositionsRef.current ${index}`, initialPositionsRef.current);
        
        //     if (selectedPathIndexRef.current.includes(index) && initialPositionsRef.current[key]) {
        //         // Create a new path and apply the transformation
        //         const newPath = Skia.Path.Make();
        //         const matrix = Skia.Matrix();

        //         console.log(`locationX ${locationX}, locationY ${locationY}, dx ${dx}, dy ${dy}, initialPositionsRef.current[key].x ${initialPositionsRef.current[key].x}, initialPositionsRef.current[key].y ${initialPositionsRef.current[key].y}`);
                
        //         // Translate the path by the delta x and y
        //         //matrix.translate(dx + initialPositionsRef.current[key].x, dy + initialPositionsRef.current[key].y);


        //         console.log(`dx ${dx}, dy ${dy}, initialPositionsRef.current[key].x ${initialPositionsRef.current[key].x}, initialPositionsRef.current[key].y ${initialPositionsRef.current[key].y}`)
                
        //         const x = initialPositionsRef.current[key].x + dx;
        //         const y = initialPositionsRef.current[key].y + dy
        //         console.log(`final x ${x}, final y ${y}`)
                
        //         // const dx1 = locationX - initialPositionsRef.current[key].x;
        //         // const dy1 = locationY - initialPositionsRef.current[key].y;
        //         matrix.translate( x, y);

        //         //matrix.translate(dx, dy);
        //         console.log(`matrix finally `, matrix); //XY HERE SEE LOGS
        //         //matrix.translate(locationX + dx, locationY + dy);
                
        //         // Apply the transformation to the existing path
        //         newPath.addPath(path.path, matrix);

        //         console.log(`path finally `, newPath); //XY HERE SEE LOGS
                
        //         return { ...path, path: newPath };
        //     }
        //     return path;
        // });
        
        // console.log(`updatedPaths `, updatedPaths);
        // setPaths(updatedPaths);
        
        console.log(`selectionBoxRef `, selectionBoxRef.current);
        console.log(`selectionBoxRef initialPositionsRef `, initialPositionsRef.current.selectionBox);
        
        // Update the position of the selection box
        if (initialPositionsRef.current.selectionBox) {
            const { x, y } = initialPositionsRef.current.selectionBox;
            setSelectionBox({
                ...selectionBoxRef.current,
                x: x + dx,
                y: y + dy
            });
        }
    };
    
    const handleBoundingBoxDragEnd = () => {
        //setShowResizeHandles(true);
    };    

    const boundingBoxPanResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: handleBoundingBoxDragStart,
            onPanResponderMove: handleBoundingBoxDragMove,
            onPanResponderRelease: handleBoundingBoxDragEnd,
        })
    ).current;    

    const renderSelectionBox = () => {
        if (selectionBox) {
            return (
                <View
                    style={{
                        position: 'absolute',
                        left: selectionBox.x,
                        top: selectionBox.y,
                        width: selectionBox.width,
                        height: selectionBox.height,
                        borderWidth: 1,
                        borderColor: 'blue',
                        backgroundColor: 'rgba(0, 0, 255, 0.01)',
                    }}
                    {...boundingBoxPanResponder.panHandlers}
                >
                    {/* {showResizeHandles && (
                        <>
                            <View style={[styles.resizeHandle, styles.topLeft]} />
                            <View style={[styles.resizeHandle, styles.topRight]} />
                            <View style={[styles.resizeHandle, styles.bottomLeft]} />
                            <View style={[styles.resizeHandle, styles.bottomRight]} />
                        </>
                    )} */}
                </View>
            );
        }
        return null;
    };

    const selectElementsInSelectionBox = (box) => {
        console.log(`selectElementsInSelectionBox `, box);

        console.log(`selectElementsInSelectionBox paths ${paths.length}`, paths);
        const selectedPaths = paths.filter(p => {
            const bounds = p.path.getBounds();
            return (
                bounds.x >= box.x &&
                bounds.x + bounds.width <= box.x + box.width &&
                bounds.y >= box.y &&
                bounds.y + bounds.height <= box.y + box.height
            );
        });
        console.log(`selectElementsInSelectionBox >> selectedPaths ${selectedPaths.length}`, selectedPaths);
    
        const selectedImages = images.filter(img => {
            return (
                img.x >= box.x &&
                img.x + img.width <= box.x + box.width &&
                img.y >= box.y &&
                img.y + img.height <= box.y + box.height
            );
        });
        console.log(`selectElementsInSelectionBox >> selectedImages ${selectedImages.length}`, selectedImages);
    
        const selectedTextInputs = textInputs.filter(txt => {
            return (
                txt.x >= box.x &&
                txt.x + txt.width <= box.x + box.width &&
                txt.y >= box.y &&
                txt.y + txt.height <= box.y + box.height
            );
        });
        console.log(`selectElementsInSelectionBox >> selectedTextInputs ${selectedTextInputs.length}`, selectedTextInputs);

        
        console.log(`setSelectedPathIndex >> `, selectedPaths.map((_, index) => index));
        console.log(`setSelectedImage >> `, selectedImages.map(img => img.id));
        console.log(`setSelectedTextInput >> `, selectedTextInputs.map(txt => txt.id));
    
        setSelectedPathIndex(selectedPaths.map((_, index) => index));
        setSelectedImage(selectedImages.map(img => img.id));
        setSelectedTextInput(selectedTextInputs.map(txt => txt.id));

        console.log(`selectedPathIndex`, selectedPathIndex);
        console.log(`selectedImage`, selectedImage);
        console.log(`selectedTextInput`, selectedTextInput);

        // Calculate the bounding box
        const allElements = [...selectedPaths, ...selectedImages, ...selectedTextInputs];
        if (allElements.length > 0) {
            const boundingBox = calculateBoundingBox(allElements);
            setSelectionBox(boundingBox);
        } else {
            setSelectionBox(null);
        }
    };    

    const calculateBoundingBox = (elements) => {
        console.log('calculateBoundingBox', elements);
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
        elements.forEach(element => {
            let bounds;
            if (element.path) {
                bounds = element.path.getBounds();
            } else {
                bounds = { x: element.x, y: element.y, width: element.width, height: element.height };
            }
            minX = Math.min(minX, bounds.x);
            minY = Math.min(minY, bounds.y);
            maxX = Math.max(maxX, bounds.x + bounds.width);
            maxY = Math.max(maxY, bounds.y + bounds.height);
        });
    
        console.log(`x ${minX} y ${minY} width ${maxX - minX} height ${maxY - minY}`);
        return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
    };

    const createPaint = (isDashed = false) => {
        const newPaint = Skia.Paint();
        newPaint.setColor(Skia.Color(color));
        newPaint.setStyle(PaintStyle.Stroke);
        newPaint.setStrokeWidth(4);
        if (isDashed) {
            newPaint.setPathEffect(Skia.PathEffect.MakeDash([10, 10], 0)); // [dashLength, gapLength]
        }
        return newPaint;
    };

    const drawCircle = (start, end) => {
        const centerX = (start.x + end.x) / 2;
        const centerY = (start.y + end.y) / 2;
        const radius = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2) / 2;
    
        const path = Skia.Path.Make();
        path.addCircle(centerX, centerY, radius);
    
        return { path, paint: createPaint() };
    };
    
    const drawTriangle = (start, end) => {
        const thirdX = start.x + (end.x - start.x) / 2;
        const thirdY = start.y - Math.sqrt(3) * (end.x - start.x) / 2;
    
        const path = Skia.Path.Make();
        path.moveTo(start.x, start.y);
        path.lineTo(end.x, end.y);
        path.lineTo(thirdX, thirdY);
        path.close();
    
        return { path, paint: createPaint() };
    };
    
    const drawSquare = (start, end) => {
        const path = Skia.Path.Make();
        path.moveTo(start.x, start.y);
        path.lineTo(end.x, start.y);
        path.lineTo(end.x, end.y);
        path.lineTo(start.x, end.y);
        path.close();
    
        return { path, paint: createPaint() };
    };
    
    const drawLine = (start, end) => {
        const path = Skia.Path.Make();
        path.moveTo(start.x, start.y);
        path.lineTo(end.x, end.y);

        return { path, paint: createPaint() };
    };
    
    const drawDashedLine = (start, end) => {
        const path = Skia.Path.Make();
        path.moveTo(start.x, start.y);
        path.lineTo(end.x, end.y);
        const paint = createPaint(true);
        const hasDashEffect = true;
        
        return { path, paint, hasDashEffect };
    };

    const drawCurvedLine = (start, end, isDashed = false) => {
        const path = Skia.Path.Make();
    
        const controlPoint = {
            x: (start.x + end.x) / 2,
            y: start.y - 150 // Adjust this value to change the curvature
        };
    
        path.moveTo(start.x, start.y);
        path.quadTo(controlPoint.x, controlPoint.y, end.x, end.y);
        const paint = createPaint(isDashed);
        const hasDashEffect = isDashed;

        return { path, paint, hasDashEffect };
    };     

    const drawArrow = (start, end) => {
        const path = Skia.Path.Make();
        path.moveTo(start.x, start.y);
        path.lineTo(end.x, end.y);
    
        const arrowLength = 20;
        const arrowAngle = Math.PI / 6; // 30 degrees
        const angle = Math.atan2(end.y - start.y, end.x - start.x);

        const drawArrowHead = (x, y, angleOffset) => {
            const arrowX = x - arrowLength * Math.cos(angle + angleOffset);
            const arrowY = y - arrowLength * Math.sin(angle + angleOffset);
            path.moveTo(x, y);
            path.lineTo(arrowX, arrowY);
        };

        if (shapeMode === 'single' || shapeMode === 'double') {
            drawArrowHead(end.x, end.y, -arrowAngle);
            drawArrowHead(end.x, end.y, arrowAngle);
        }
        if (shapeMode === 'double') {
            drawArrowHead(start.x, start.y, Math.PI - arrowAngle);
            drawArrowHead(start.x, start.y, Math.PI + arrowAngle);
        }

        return { path, paint: createPaint() };
    };

    const selectPath = (x, y) => {
        const hitArea = 10; // Enlarge the hit area by 10 pixels in all directions
        const index = paths.findIndex(p => {
            const bounds = p.path.getBounds();
            return (
                x >= bounds.x - hitArea &&
                x <= bounds.x + bounds.width + hitArea &&
                y >= bounds.y - hitArea &&
                y <= bounds.y + bounds.height + hitArea
            );
        });
    
        if (index !== -1) {
            setSelectedPathIndex([index]);
            const path = paths[index];
            const bounds = path.path.getBounds();
            offsetPathRef.current.offsetX = x - bounds.x;
            offsetPathRef.current.offsetY = y - bounds.y;
        } else {
            setSelectedPathIndex([]);
        }
    };    

    const moveSelectedPath = (dx, dy) => {
        setPaths(paths.map((p, index) => {
            if (selectedPathIndex.includes(index)) {
                const movedPath = Skia.Path.Make();
                const matrix = Skia.Matrix();
                matrix.translate(dx - p.path.getBounds().x, dy - p.path.getBounds().y);
                movedPath.addPath(p.path, matrix);
                return { ...p, path: movedPath };
            }
            return p;
        }));
    };    

    const pushToUndoStack = () => {
        setUndoStack([...undoStack, { paths: [...paths], images: [...images], textInputs: [...textInputs] }]);
        setRedoStack([]);
    };

    const undo = () => {
        if (undoStack.length > 0) {
            setUndoStack(prevUndoStack => {
                const newUndoStack = [...prevUndoStack];
                const lastState = newUndoStack.pop(); 
    
                setRedoStack(prevRedoStack => [
                    ...prevRedoStack,
                    { paths: [...paths], images: [...images], textInputs: [...textInputs] }
                ]);
    
                setPaths(lastState.paths);
                setImages(lastState.images);
                setTextInputs(lastState.textInputs);
    
                return newUndoStack; 
            });
        }
    };    

    const redo = () => {
        if (redoStack.length > 0) {
            const nextState = redoStack.pop();
            setUndoStack([...undoStack, { paths: [...paths], images: [...images], textInputs: [...textInputs] }]);
            setPaths(nextState.paths);
            setImages(nextState.images);
            setTextInputs(nextState.textInputs);
            setRedoStack(redoStack);
        }
    };

    const renderLegendModal = () => (
        <Modal transparent={true} visible={showLegendModal}>
            <View style={styles.centeredView}>
                <View style={styles.legendsModalView}>
                    <Text style={styles.label}>Select Legend</Text>
                    {legends.map(legend => (
                        <TouchableOpacity 
                            key={legend.id} style={styles.legendContainer} 
                            onPress={() => addImageToCanvas(legend.image)}>
                            <RNImage
                                source={legend.image}
                                style={styles.legendImage}
                            />
                            <Text style={styles.legendText}>{legend.text}</Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity style={styles.closeButton} onPress={() => setShowLegendModal(false)}>
                        <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    const renderShapePickerModal = () => (
        <ShapePickerModal
            visible={showShapePicker}
            onClose={() => setShowShapePicker(false)}
            shapeMode={shapeMode}
            setShapeMode={setShapeMode}
        />
    );

    const renderPenPickerModal = () => (
        <PenPickerModal
            visible={showPenPicker}
            onClose={() => setShowPenPicker(false)}
            penMode={penMode}
            setPenMode={setPenMode}
        />
    );

    const renderPenWidthModal = () => (
        <PenWidthModal
            visible={showPenWidthSlider}
            onClose={() => setShowPenWidthSlider(false)}
            mode={mode}
            penWidth={penWidth}
            setPenWidth={setPenWidth}
            eraserWidth={eraserWidth}
            setEraserWidth={setEraserWidth}
        />
    );

    const renderColorModal = () => (
        <ColorModal
            visible={showColorPicker}
            onClose={() => setShowColorPicker(false)}
            color={color}
            setColor={setColor}
        />
    );

    const handlePathTouchStart = (index) => (event) => {
        const { locationX, locationY } = event.nativeEvent;
        const hitArea = 10; // Enlarge the hit area by 10 pixels in all directions
        const path = paths[index];
        const bounds = path.path.getBounds();
        if (
            locationX >= bounds.x - hitArea &&
            locationX <= bounds.x + bounds.width + hitArea &&
            locationY >= bounds.y - hitArea &&
            locationY <= bounds.y + bounds.height + hitArea
        ) {
            setSelectedPathIndex([index]);
            offsetPathRef.current.offsetX = locationX - bounds.x;
            offsetPathRef.current.offsetY = locationY - bounds.y;
        }
    };    
    
    const handlePathTouchMove = (event) => {
        if (selectedPathIndex !== null && selectedPathIndex.length > 0) {
            const { locationX, locationY } = event.nativeEvent;
            const dx = locationX - offsetPathRef.current.offsetX;
            const dy = locationY - offsetPathRef.current.offsetY;
            moveSelectedPath(dx, dy);
        }
    };
    
    const handlePathTouchEnd = () => {
        setSelectedPathIndex([]);
    };

    const renderPaths = () => (
        paths.map((p, index) => (
            <React.Fragment key={index}>
                <Path 
                    path={p.path} 
                    paint={p.paint} 
                    onStartShouldSetResponder={() => true}
                    onResponderGrant={handlePathTouchStart(index)}
                    onResponderMove={handlePathTouchMove}
                    onResponderRelease={handlePathTouchEnd}
                />
                {selectedPathIndex.includes(index) && (
                    <Path path={getBoundingBoxPath(p.path)} paint={getDashedPaint()} />
                )}
            </React.Fragment>
        ))
    );    

    const addImageToCanvas = (src) => {
        let id = images.length;
        setImages([...images, { id: id, src, x: 100, y: 100, width: 50, height: 50 }]);
        setSelectedImage([id]);
        setShowLegendModal(false);
        pushToUndoStack();
    };

    const handleImageTouchStart = (id, corner = null) => (event) => {
        if (mode === 'move') {
            setSelectedImage([id]);
            setSelectedTextInput([]);
            setSelectedPathIndex([]);

            if (corner) {
                setDraggingCorner(corner);
                console.log(`handleImageTouchStart corner ${corner} draggingCorner ${draggingCorner}`);
            }
        }
    };

    const handleResize = (id, corner) => (event, gestureState) => {
        const scalingFactor = 0.04; // Adjust this value to control sensitivity
        console.log(`handleResize ${id} ${corner} gestureState.dx: ${gestureState.dx}, gestureState.dy: ${gestureState.dy}`);

        setImages((prevImages) =>
            prevImages.map((image) => {
                console.log(`image.id ${image.id}, id ${id} same?`, image.id === id);
                if (image.id == id) {

                    console.log(`image width:${image.width} height:${image.height}`);

                    let newWidth = image.width;
                    let newHeight = image.height;

                    const deltaX = gestureState.dx * scalingFactor;
                    const deltaY = gestureState.dy * scalingFactor;
                    const aspectRatio = image.width / image.height;

                    switch (corner) {
                        case 'topLeft':
                            newWidth = image.width - deltaX;
                            newHeight = newWidth / aspectRatio;
                            break;
                        case 'topRight':
                            newWidth = image.width + deltaX;
                            newHeight = newWidth / aspectRatio;
                            break;
                        case 'bottomLeft':
                            newWidth = image.width - deltaX;
                            newHeight = newWidth / aspectRatio;
                            break;
                        case 'bottomRight':
                            newWidth = image.width + deltaX;
                            newHeight = newWidth / aspectRatio;
                            break;
                        default:
                            break;
                    }
                    console.log(`handleResize newWidth: ${newWidth}, newHeight: ${newHeight}`);

                    return {
                        ...image,
                        width: newWidth,
                        height: newHeight,
                    };
                }
                return image;
            })
        );
    };     

    const renderImages = () => {
        return images.map((image) => (
            <View
                key={image.id}
                style={[
                    styles.draggableImage,
                    selectedImage.includes(image.id) ? styles.selectedImage : null,
                    { top: image.y, left: image.x, width: image.width, height: image.height },
                ]}
                onTouchStart={handleImageTouchStart(image.id)}
                {...(selectedImage.includes(image.id) ? panResponder.panHandlers : {})}
            >
                <RNImage source={images.find(img => img.id === image.id)?.src} style={[styles.image, { width: image.width, height: image.height }]} />
                {selectedImage.includes(image.id) && selectedImage.length == 1 && (
                <>
                    <View
                        style={[styles.resizeHandle, styles.topLeft]}
                        onTouchStart={(event) => {handleImageTouchStart(image.id, 'topLeft')(event); }}
                    />
                    <View
                        style={[styles.resizeHandle, styles.topRight]}
                        onTouchStart={(event) => {handleImageTouchStart(image.id, 'topRight')(event); }}
                    />
                    <View
                        style={[styles.resizeHandle, styles.bottomLeft]}
                        onTouchStart={(event) => {handleImageTouchStart(image.id, 'bottomLeft')(event); }}
                    />
                    <View
                        style={[styles.resizeHandle, styles.bottomRight]}
                        onTouchStart={(event) => {handleImageTouchStart(image.id, 'bottomRight')(event); }}
                    />
                </>
                )}
            </View>
        ));
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt, gestureState) => {

                const selectedImages = imagesRef.current.filter(img => selectedImageRef.current.includes(img.id));
                console.log(`imagePanResponder onPanResponderGrant selectedImages`, selectedImages);

                // Store initial positions of all selected images
                selectedImages.forEach(image => {
                    offsetRef.current[image.id] = { offsetX: image.x, offsetY: image.y };
                });
            },
            onPanResponderMove: (evt, gestureState) => {
                const id = selectedImageRef.current;
                console.log(`imagePanResponder onPanResponderMove id ${id} draggingCornerRef ${draggingCornerRef.current}`);

                if (id != null && draggingCornerRef.current) {
                    handleResize(id, draggingCornerRef.current)(evt, gestureState);
                } else {

                    const selectedImages = imagesRef.current.filter(img => selectedImageRef.current.includes(img.id));
                    console.log(`imagePanResponder onPanResponderMove selectedImages ${selectedImages.length}`, selectedImages);
        
                    // Update positions of all selected images
                    const updatedPositions = imagesRef.current.map(image => {
                        if (selectedImageRef.current.includes(image.id)) {
                            const newPosition = {
                                ...image,
                                x: offsetRef.current[image.id].offsetX + gestureState.dx,
                                y: offsetRef.current[image.id].offsetY + gestureState.dy,
                            };
                            return newPosition;
                        }
                        return image;
                    });
                    setImages(updatedPositions);
                }                
            },
            onPanResponderRelease: () => {
                setDraggingCorner(null);
            }
        })
    ).current;

    const addTextInput = () => {
        const newTextInput = {
            id: textInputs.length,
            text: 'Input Text',
            x: canvasCenterX,
            y: canvasCenterY,
            width: 100,
            height: 50,
            fontSize: 14, // Default font size
            isEditing: true,
        };
    
        setTextInputs(prevTextInputs => {
            const updatedTextInputs = [...prevTextInputs, newTextInput];
            return updatedTextInputs;
        });
    
        setSelectedTextInput([newTextInput.id]);
        pushToUndoStack();
    };

    const handleTextInputChange = (id, newText) => {
        setTextInputs(prevTextInputs => {
            const updatedTextInputs = prevTextInputs.map(input =>
                input.id === id ? { ...input, text: newText } : input
            );
            return updatedTextInputs;
        });
    };
    
    const handleTextInputTouchStart = (id, corner = null) => (event) => {
        if (mode === 'move') {
            setSelectedTextInput([id]);
            setSelectedImage([]);
            setSelectedPathIndex([]);

            if (corner) {
                setDraggingCorner(corner);
                console.log(`handleTextInputTouchStart corner ${corner} draggingCorner ${draggingCorner}`);
            }
        }
    };

    const handleTextResize = (id, corner) => (event, gestureState) => {
        const scalingFactor = 0.04;
        //const fontSizeScalingFactor = 1.8; // Adjust this value to control sensitivity
        console.log(`handleResize ${id} ${corner} gestureState.dx: ${gestureState.dx}, gestureState.dy: ${gestureState.dy}`);

        setTextInputs((prevTextInputs) =>
            prevTextInputs.map((textInput) => {
                console.log(`textInput.id ${textInput.id}, id ${id} same?`, textInput.id == id);
                if (textInput.id == id) {
                    let newWidth = textInput.width || 100;
                    let newHeight = textInput.height || 50;
                    let newFontSize = textInput.fontSize || 16;

                    const deltaX = gestureState.dx * scalingFactor;
                    const deltaY = gestureState.dy * scalingFactor;
                    //const aspectRatio = image.width / image.height;

                    switch (corner) {
                        case 'topLeft':
                            newWidth = textInput.width - deltaX;
                            newHeight = textInput.height - deltaY;
                            break;
                        case 'topRight':
                            newWidth = textInput.width + deltaX;
                            newHeight = textInput.height - deltaY;
                            break;
                        case 'bottomLeft':
                            newWidth = textInput.width - deltaX;
                            newHeight = textInput.height + deltaY;
                            break;
                        case 'bottomRight':
                            newWidth = textInput.width + deltaX;
                            newHeight = textInput.height + deltaY;
                            break;
                        default:
                            break;
                    }

                    // Adjust font size proportionally
                    const widthRatio = newWidth / (textInput.width || 100);
                    const heightRatio = newHeight / (textInput.height || 50);
                    newFontSize = newFontSize * Math.min(widthRatio, heightRatio) // * fontSizeScalingFactor;                    ;
                    console.log(`handleTextResize newWidth: ${newWidth}, newHeight: ${newHeight}, newFontSize: ${newFontSize}`);

                    return {
                        ...textInput,
                        width: newWidth,
                        height: newHeight,
                        fontSize: newFontSize,
                    };
                }
                return textInput;
            })
        );
    };     

    const textPanResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                console.log('onMoveShouldSetPanResponder', Math.abs(gestureState.dy) > 5);
                return Math.abs(gestureState.dy) > 5;
            },
            onPanResponderGrant: (evt, gestureState) => {
                const selectedTexts = textInputsRef.current.filter(txt => selectedTextInputRef.current.includes(txt.id));
                console.log(`textPanResponder onPanResponderGrant selectedTexts`, selectedTexts);

                // Store initial positions of all selected text inputs
                selectedTexts.forEach(txt => {
                    offsetRef.current[txt.id] = { offsetX: txt.x, offsetY: txt.y };
                });
            },
            onPanResponderMove: (evt, gestureState) => {
                const id = selectedTextInputRef.current;
                console.log(`textPanResponder onPanResponderMove id ${id} draggingCornerRef ${draggingCornerRef.current}`);

                if (id !== null && draggingCornerRef.current) {
                    handleTextResize(id, draggingCornerRef.current)(evt, gestureState);
                } else {
                    const selectedTexts = textInputsRef.current.filter(txt => selectedTextInputRef.current.includes(txt.id));
                    console.log(`textPanResponder onPanResponderGrant selectedTexts`, selectedTexts);

                    // Update positions of all selected text inputs
                    const updatedPositions = textInputsRef.current.map(txt => {
                        if (selectedTextInputRef.current.includes(txt.id)) {
                            const newPosition = {
                                ...txt,
                                x: offsetRef.current[txt.id].offsetX + gestureState.dx,
                                y: offsetRef.current[txt.id].offsetY + gestureState.dy,
                            };
                            return newPosition;
                        }
                        return txt;
                    });
                    setTextInputs(updatedPositions);
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                setDraggingCorner(null);
            },
        })
    ).current;

    const renderTextInputs = () => {    
        return textInputs.map((text) => {
            if (!text) {
                return null; // Skip rendering for null or undefined text objects
            }
    
            // Determine the text value to display in TextInput
            const textValue = textInputs.find(input => input.id === text.id)?.text ?? ''; // Default to empty string if undefined or null

            return (
                <View
                    key={text.id}
                    style={[
                        styles.textInputWrapper,
                        { top: text.y, left: text.x },
                        selectedTextInput.includes(text.id) ? styles.selectedTextInput : null,
                    ]}
                    onTouchStart={handleTextInputTouchStart(text.id)}
                    {...(selectedTextInput.includes(text.id) ? textPanResponder.panHandlers : {})}
                >
                    <TextInput
                        style={[styles.textInput, {width: text.width, height: text.height, fontSize: text.fontSize}]}
                        value={textValue}
                        onChangeText={(newText) => handleTextInputChange(text.id, newText)}
                        onFocus={() => setSelectedTextInput([text.id])}
                        editable={selectedTextInput.includes(text.id)}
                    />
                    {selectedTextInput.includes(text.id) && (
                    <>
                        <View
                            style={[styles.resizeHandle, styles.topLeft]}
                            onTouchStart={(event) => {handleTextInputTouchStart(text.id, 'topLeft')(event); }}
                        />
                        <View
                            style={[styles.resizeHandle, styles.topRight]}
                            onTouchStart={(event) => {handleTextInputTouchStart(text.id, 'topRight')(event); }}
                        />
                        <View
                            style={[styles.resizeHandle, styles.bottomLeft]}
                            onTouchStart={(event) => {handleTextInputTouchStart(text.id, 'bottomLeft')(event); }}
                        />
                        <View
                            style={[styles.resizeHandle, styles.bottomRight]}
                            onTouchStart={(event) => {handleTextInputTouchStart(text.id, 'bottomRight')(event); }}
                        />
                    </>
                    )}
                </View>
            );
        });
    };
    
    const getDashedPaint = () => {
        const paint = Skia.Paint();
        paint.setStyle(PaintStyle.Stroke);
        paint.setColor(Skia.Color('#4868fe')); 
        paint.setStrokeWidth(1);
        return paint;
    };

    const getBoundingBoxPath = (path) => {
        const bounds = path.getBounds();
        const left = bounds.x;
        const top = bounds.y;
        const right = bounds.x + bounds.width;
        const bottom = bounds.y + bounds.height;
    
        const boundingBoxRect = Skia.XYWHRect(left, top, right - left, bottom - top);
        const boundingBoxPath = Skia.Path.Make();
        boundingBoxPath.addRect(boundingBoxRect, true); 
    
        return boundingBoxPath;
    };

    const handleClear = (id) => {
        Alert.alert(
            "Clear Confirmation",
            "Are you sure you want to clear the canvas?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: () => resetCanvas(),
                    style: "destructive"
                }
            ],
            { cancelable: true }
        );
    };

    const resetCanvas = () => {
        pushToUndoStack();
        setPaths([]);
        setImages([]);
        setTextInputs([]);
    };

    return (
        <GestureHandlerRootView style={[styles.container, { backgroundColor: 'white' }]}>
            <View ref={containerRef} style={styles.container} collapsable={false} options={{ fileName: fileName, format: 'png', quality: 0.5 }} onLayout={onLayout}>
                <Canvas style={{ flex: 1 }} onTouchStart={handleTouch} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
                    {image && (
                        <Image image={image} fit="contain" x={centerX} y={centerY} width={imageWidth} height={imageHeight} />
                    )}
                    {renderPaths()}
                    {renderDynamicShape()}
                </Canvas>
                {renderImages()}
                {renderTextInputs()}
                {renderSelectionBox()}
            </View >
            <View style={[styles.bottomBar]}>
                <TouchableOpacity
                    style={[styles.button, mode === 'move' ? styles.activeButton : null]}
                    onPress={() => setMode('move')}
                >
                    <RNImage
                        source={require('../../assets/icon/pointer.png')}
                        style={styles.bottomBarIcon}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setMode('draw')} >
                    <View style={{ flexDirection: "row" }}>
                        <View style={[mode === 'draw' ? styles.activeButton : styles.notActiveButton]}>
                            <RNImage
                                source={require('../../assets/icon/pencil.png')}
                                style={styles.bottomBarIcon}
                            />
                        </View>
                        <TouchableOpacity 
                            onPress={(e) => {
                                e.stopPropagation();
                                setShowPenPicker(true);
                            }}
                            style={{ justifyContent: 'center', alignItems: 'center' }}
                        >
                            <RNImage
                                source={require('../../assets/icon/arrow-down.png')}
                                style={[{ height: 13, width: 13, alignSelf: 'center', marginLeft: 10}]}
                            />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => setShowColorPicker(true)}>
                    <View style={[styles.colorPreview, { backgroundColor: color }]} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => setShowPenWidthSlider(true)}>
                    <RNImage
                        source={require('../../assets/icon/line-width.png')}
                        style={styles.bottomBarIcon}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, mode === 'shape' ? styles.activeButton : null]}
                    onPress={() => { setMode('shape'); setShowShapePicker(true); }}>
                    <RNImage
                        source={require('../../assets/icon/arrows.png')}
                        style={{ width: 17, height: 19 }}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, (undoStack.length === 0) ? styles.disabledButton : null]}
                    onPress={undo} 
                    disabled={undoStack.length === 0}
                >
                    <RNImage
                        source={require('../../assets/icon/undo.png')}
                        style={styles.bottomBarIcon}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, (redoStack.length === 0) ? styles.disabledButton : null]}
                    onPress={redo} 
                    disabled={redoStack.length === 0}
                >
                    <RNImage
                        source={require('../../assets/icon/redo.png')}
                        style={styles.bottomBarIcon}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleClear}>
                    <RNImage
                        source={require('../../assets/icon/delete.png')}
                        style={{ width: 15, height: 17 }}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => addTextInput()}>
                    <RNImage
                        source={require('../../assets/icon/text.png')}
                        style={styles.bottomBarIcon}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => setShowLegendModal(true)}>
                    <Text style={styles.buttonText}>SHOW LEGEND</Text>
                </TouchableOpacity>
            </View>
            {renderColorModal()}
            {renderPenWidthModal()}
            {renderShapePickerModal()}
            {renderLegendModal()}
            {renderPenPickerModal()}
        </GestureHandlerRootView>
    );
});

const styles = StyleSheet.create({
    container: { flex: 1 },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    legendsModalView: {
        margin: 20,
        width: '50%',
        height: '45%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 5,
    },
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 7,
        width: "100%"
    },
    bottomBarIcon: {
        width: 16,
        height: 18
    },
    button: {
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 16,
        color: 'black',
    },
    activeButton: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#bbb',
    },
    notActiveButton: {
        padding: 10,
        borderRadius: 5
    },
    disabledButton: {
        opacity: 0.5,
    },
    colorPreview: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    label: {
        alignItems: "flex-start",
        color: "rgba(0,22,62,1)",
        fontSize: 20,
        fontFamily: "ZenKakuGothicAntique-Black",
        padding: 2,
        marginBottom: 15
    },
    closeButton: {
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        alignItems: 'center',
        margin: 20,
    },
    legendContainer: { flexDirection: 'row', alignItems: 'center' },
    legendImage: { width: 35, height: 35 },
    legendText: { marginLeft: 10, fontSize: 13, color: 'black' },
    draggingImage: { position: 'absolute', width: 35, height: 35 },
    draggableImage: {
        position: 'absolute',
    },
    selectedImage: {
        borderWidth: 1,
        borderColor: '#4868fe',
    },
    image: {
        width: 100,
        height: 100,
    },
    resizeHandle: {
        // position: 'absolute',
        // width: 20,
        // height: 20,
        // borderWidth: 0,
        // borderColor: '#C7C7C7',
        // justifyContent: 'center',
        // alignItems: 'center',
        position: 'absolute',
        width: 25,
        height: 25,
        //backgroundColor: 'red',
        borderWidth: 0.7,
        borderColor: '#4868fe',
    },
    topLeft: {
        top: -10,
        left: -10,
    },
    topRight: {
        top: -10,
        right: -10,
    },
    bottomLeft: {
        bottom: -10,
        left: -10,
    },
    bottomRight: {
        bottom: -10,
        right: -10,
    },
    textInputWrapper: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0
    },
    textInput: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        color: 'black',
        borderRadius: 5,
        textAlign: 'center', 
        padding: 0
    },
    selectedTextInput: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#4868fe',
        padding: 0
    },
});

export default SketchVehicle;
