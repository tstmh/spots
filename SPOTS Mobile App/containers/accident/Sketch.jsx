import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput, Modal, Image, Alert, PanResponder, ToastAndroid } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Canvas, PaintStyle, Path, Skia } from '@shopify/react-native-skia';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import viewShot from 'react-native-view-shot';
import Presets from './Presets';
import Images from '../../models/Images';
import DatabaseService from '../../utils/DatabaseService';
import BlueButtonShort from '../../components/common/BlueButtonShort';
import SketchButton from '../../components/common/SketchButton';
import {drawLineMode, drawDashedLineMode} from '../common/Shapes';
import PenWidthModal from '../common/PenWidthModal';
import ColorModal from '../common/ColorModal';
import ShapePickerModal from '../common/ShapePickerModal';
import PenPickerModal from '../common/PenPickerModal';
import ZIndexModal from '../common/ZIndexModal';

const Sketch = ({ navigation }) => {
    const containerRef = useRef(null);
    const route = useRoute();
    const sketchImage = route.params?.sketchImage;

    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showShapePicker, setShowShapePicker] = useState(false);
    const [showPenPicker, setShowPenPicker] = useState(false);
    const [showPresets, setShowPresets] = useState(false);
    const [showPenWidthSlider, setShowPenWidthSlider] = useState(false);
    const [color, setColor] = useState('black');
    const [shapeMode, setShapeMode] = useState('line');
    const [penMode, setPenMode] = useState('line');
    const [mode, setMode] = useState('draw');
    const [penWidth, setPenWidth] = useState(4); // Initial pen width
    const [eraserWidth, setEraserWidth] = useState(8); // Initial eraser width
    
    const [undoStack, setUndoStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);
    
    const canvasCenterX = canvasSize.width / 2;
    const canvasCenterY = canvasSize.height / 2;
    
    const onLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;
        setCanvasSize({ width, height });
    };

    useEffect(() => {
        console.log('sketch RAW_METADATA: ', sketchImage?.RAW_METADATA);
        if (sketchImage?.RAW_METADATA) {
            loadCanvasState(sketchImage.RAW_METADATA);
        }
    }, [sketchImage]);
    
    const [selectionBox, setSelectionBox] = useState(null);
    const [selectionStartPos, setSelectionStartPos] = useState(null);
    const [selectionEndPos, setSelectionEndPos] = useState(null);
    const selectionBoxRef = useRef(selectionBox);
    useEffect(() => {
        selectionBoxRef.current = selectionBox;
    }, [selectionBox]);
    const [initialPositions, setInitialPositions] = useState({});
    const initialPositionsRef = useRef(initialPositions);
    useEffect(() => {
        initialPositionsRef.current = initialPositions;
    }, [initialPositions]);
    
    const [showZIndex, setShowZIndex] = useState(false);
    const [elements, setElements] = useState([]);
    const [selectedElementIndex, setSelectedElementIndex] = useState([]);
    const elementsRef = useRef(elements);
    const selectedElementIndexRef = useRef(selectedElementIndex);

    useEffect(() => {
        elementsRef.current = elements;
        console.log(`elementsRef.current`, elementsRef.current);
        console.log(`elements`, elements);
    }, [elements]);

    useEffect(() => {
        selectedElementIndexRef.current = selectedElementIndex;
    }, [selectedElementIndex]);

    const [selectedPathIndex, setSelectedPathIndex] = useState(null);
    const offsetPathRef = useRef({ offsetX: 0, offsetY: 0 });
    const [startPos, setStartPos] = useState(null);
    const [endPos, setEndPos] = useState(null);
    
    const [draggingCorner, setDraggingCorner] = useState(null);
    const draggingCornerRef = useRef(draggingCorner);

    useEffect(() => {
        draggingCornerRef.current = draggingCorner;
        //console.log(`draggingCornerRef ${draggingCornerRef} draggingCorner ${draggingCorner}`)
    }, [draggingCorner]);

    const [selectedImage, setSelectedImage] = useState(null);
    const selectedImageRef = useRef(selectedImage);
    const offsetImageRef = useRef({ offsetX: 0, offsetY: 0 });

    useEffect(() => {
        selectedImageRef.current = selectedImage;
        //console.log(`selectedImageRef ${selectedImageRef} selectedImage ${selectedImage}`)
    }, [selectedImage]);

    const [selectedTextInput, setSelectedTextInput] = useState(null); 
    const selectedTextInputRef = useRef(selectedTextInput);
    const offsetTextRef = useRef({ offsetX: 0, offsetY: 0 });

    useEffect(() => {
        selectedTextInputRef.current = selectedTextInput;
    }, [selectedTextInput]);

    const loadCanvasState = (RAW_METADATA) => {
        console.log(`loadCanvasState `, RAW_METADATA );
        const { paths, images, textInputs } = JSON.parse(RAW_METADATA);
        console.log(`paths ` , paths );
        console.log(`images ` , images);
        console.log(`textInputs ` , textInputs);
    
        // Process paths
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
    
        // Construct elements array
        const newElements = [
            ...processedPaths.map(p => ({ type: 'path', data: p })),
            ...images.map(i => ({ type: 'image', data: i })),
            ...textInputs.map(t => ({ type: 'text', data: t })),
        ];
        
        // Set the new state
        setElements(newElements);
    };    

    const serializeState = (elements) => {
        console.log(`serializeState ${elements.length}`, elements);
    
        // Categorize elements based on their type
        const paths = elements
            .filter(el => el.type === 'path')
            .map(el => ({
                path: el.data.path.toSVGString(),
                paint: {
                    color: el.data.paint.getColor().toString(),
                    strokeWidth: el.data.paint.getStrokeWidth(),
                },
                hasDashEffect: el.data.hasDashEffect || false
            }));
    
        const images = elements
            .filter(el => el.type === 'image')
            .map(el => el.data);
    
        const textInputs = elements
            .filter(el => el.type === 'text')
            .map(el => el.data);
    
        // Construct the JSON object
        let data = JSON.stringify({
            paths,
            images,
            textInputs
        });
    
        return data;
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

    const paint = useRef(Skia.Paint()).current;
    paint.setStyle(PaintStyle.Stroke);
    
    const handleTouch = (event) => {
        const { locationX, locationY } = event.nativeEvent;
        console.log(`mode: ${mode} locationX: ${locationX}, locationY: ${locationY}`);
        // setSelectedTextInput(null);
        // setSelectedImage(null);
        selectElement(null);

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

            console.log(`Adding new shape ${penMode}: `, newShape);
            setElements([...elements, { type: 'path', data: newShape }]);
            pushToUndoStack();
            
        } else if (mode === 'erase'){
            const newPath = Skia.Path.Make();
            newPath.moveTo(locationX, locationY);
            newPath.lineTo(locationX, locationY);

            const newPaint = paint.copy();
            newPaint.setColor(Skia.Color('white'));
            newPaint.setStrokeWidth(eraserWidth); // Set a larger stroke width for eraser

            pushToUndoStack();
            setElements([...elements, { type: 'path', data: { path: newPath, paint: newPaint } }]);
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

        if (mode === 'draw' || mode === 'erase') {
            const updatedElements = [...elements];
            const currentElement = updatedElements[updatedElements.length - 1];

            if (currentElement && currentElement.type === 'path') {
            currentElement.data.path.lineTo(locationX, locationY);
            setElements(updatedElements);
        }
        } 

        if (mode === 'move'){
            if (selectedPathIndex !== null){
                moveSelectedPath(locationX, locationY);
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
            setElements([...elements, { type: 'path', data: newShape }]);
    
            setStartPos(null);
            setEndPos(null);
        } else if (mode === 'move' && selectionBox) {
            selectElementsInSelectionBox(selectionBox);
            //setSelectionBox(null);
            setSelectionStartPos(null);
            setSelectionEndPos(null);
        }
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

    const selectElementsInSelectionBox = (box) => {
        console.log(`selectElementsInSelectionBox `, box);
    
        const selectedElementIndexes = [];
    
        elementsRef.current.forEach((element, index) => {
            let isSelected = false;
            switch (element.type) {
                case 'path':
                    const pathBounds = element.data.path.getBounds();
                    isSelected = (
                        pathBounds.x >= box.x &&
                        pathBounds.x + pathBounds.width <= box.x + box.width &&
                        pathBounds.y >= box.y &&
                        pathBounds.y + pathBounds.height <= box.y + box.height
                    );
                    break;
                case 'image':
                case 'text':
                    const { x, y, width, height } = element.data;
                    isSelected = (
                        x >= box.x &&
                        x + width <= box.x + box.width &&
                        y >= box.y &&
                        y + height <= box.y + box.height
                    );
                    break;
                default:
                    break;
            }
    
            if (isSelected) {
                selectedElementIndexes.push(index);
            }
        });
    
        console.log(`selectElementsInSelectionBox >> selectedElementIndexes ${selectedElementIndexes}`, selectedElementIndexes);
    
        // Update the selected elements based on the indexes
        setSelectedElementIndex(selectedElementIndexes);
    
        // Calculate the bounding box for the selected elements
        const selectedElements = selectedElementIndexes.map(index => elementsRef.current[index]);
        if (selectedElements.length > 0) {
            const boundingBox = calculateBoundingBox(selectedElements);
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
            if (element.type === 'path') {
                bounds = element.data.path.getBounds();
            } else {
                bounds = { x: element.data.x, y: element.data.y, width: element.data.width, height: element.data.height };
            }
            minX = Math.min(minX, bounds.x);
            minY = Math.min(minY, bounds.y);
            maxX = Math.max(maxX, bounds.x + bounds.width);
            maxY = Math.max(maxY, bounds.y + bounds.height);
        });
    
        console.log(`x ${minX} y ${minY} width ${maxX - minX} height ${maxY - minY}`);
        return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
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
    
        // Iterate over the elements array to store initial positions of selected elements
        elementsRef.current.forEach((element, index) => {
            const key = `el-${index}`;
            if (selectedElementIndexRef.current.includes(index)) {
                switch (element.type) {
                    case 'image':
                    case 'text':
                        initialPos[key] = { x: element.data.x, y: element.data.y };
                        break;
                    case 'path':
                        const bounds = element.data.path.getBounds();
                        initialPos[key] = { x: bounds.x, y: bounds.y };
                        break;
                    default:
                        break;
                }
            }
        });
    
        // Set the initial positions in the ref
        initialPositionsRef.current = initialPos;
        console.log('handleBoundingBoxDragStart initialPos', initialPositionsRef.current);
    };
    

    const handleBoundingBoxDragMove = (evt, gestureState) => {
        const dx = gestureState.dx;
        const dy = gestureState.dy;
    
        const updatedElements = elementsRef.current.map((element, index) => {
            const key = `el-${index}`;
            if (selectedElementIndexRef.current.includes(index) && initialPositionsRef.current[key]) {
                switch (element.type) {
                    case 'image':
                    case 'text':
                        return {
                            ...element,
                            data: {
                                ...element.data,
                                x: initialPositionsRef.current[key].x + dx,
                                y: initialPositionsRef.current[key].y + dy,
                            }
                        };
                    case 'path':
                        // const newPath = Skia.Path.Make();
                        // const matrix = Skia.Matrix();
                        // matrix.translate(dx, dy);
                        // newPath.addPath(element.data.path, matrix);
                        // return {
                        //     ...element,
                        //     data: {
                        //         ...element.data,
                        //         path: newPath,
                        //     }
                        // };
                    default:
                        return element;
                }
            }
            return element;
        });
    
        setElements(updatedElements);
    
        // Update the selection box position
        if (initialPositionsRef.current.selectionBox) {
            const { x, y } = initialPositionsRef.current.selectionBox;
            setSelectionBox({
                ...selectionBoxRef.current,
                x: x + dx,
                y: y + dy
            });
        }
    };

    const handleBoundingBoxDragEnd = () => {};    

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

    const resetCanvas = () => {
        setElements([]);
        pushToUndoStack();
    };

    const pushToUndoStack = () => {
        setUndoStack([...undoStack, { elements: [...elements] }]);
        setRedoStack([]);
    };

    const undo = () => {
        if (undoStack.length > 0) {
            setUndoStack(prevUndoStack => {
                const newUndoStack = [...prevUndoStack]; 
                const lastState = newUndoStack.pop(); 
                setRedoStack(prevRedoStack => [...prevRedoStack, { elements: [...elements] }]);
                setElements(lastState.elements);
                return newUndoStack; 
            });
        }
    }

    const redo = () => {
        if (redoStack.length > 0) {
            setRedoStack(prevRedoStack => {
                const newRedoStack = [...prevRedoStack];
                const nextState = newRedoStack.pop(); 
                setUndoStack(prevUndoStack => [
                    ...prevUndoStack,
                    { elements: [...elements] }
                ]);
    
                setElements(nextState.elements);
    
                return newRedoStack; 
            });
        }
    };

    const selectPath = (x, y) => {
        const hitArea = 10; // Enlarge the hit area by 10 pixels in all directions
        const index = elements.findIndex(el => {
            if (el.type !== 'path') return false;
            const bounds = el.data.path.getBounds();
            return (
                x >= bounds.x - hitArea &&
                x <= bounds.x + bounds.width + hitArea &&
                y >= bounds.y - hitArea &&
                y <= bounds.y + bounds.height + hitArea
            );
        });
    
        if (index !== -1) {
            setSelectedPathIndex(index);
            selectElement(index);
            const pathElement = elements[index];
            const bounds = pathElement.data.path.getBounds();
            offsetPathRef.current.offsetX = x - bounds.x;
            offsetPathRef.current.offsetY = y - bounds.y;
        } else {
            setSelectedPathIndex(null);
            selectElement(null);
        }
    };    

    const moveSelectedPath = (dx, dy) => {
        if (selectedPathIndex === null) return;
    
        // Ensure the selected element is of type 'path'
        const selectedElement = elements[selectedPathIndex];
        if (selectedElement.type === 'path') {
            const movedPath = Skia.Path.Make();
            const matrix = Skia.Matrix();
            matrix.translate(dx - selectedElement.data.path.getBounds().x, dy - selectedElement.data.path.getBounds().y);
            movedPath.addPath(selectedElement.data.path, matrix);
    
            // Update the elements array
            const updatedElements = [...elements];
            updatedElements[selectedPathIndex] = {
                type: 'path',
                data: {
                    ...selectedElement.data,
                    path: movedPath
                }
            };
    
            // Set the new state
            setElements(updatedElements);
        }
    };  

    const handlePathTouchStart = (index) => (event) => {
        console.log(`handlePathTouchStart ${index} `);
        const { locationX, locationY } = event.nativeEvent;
        const hitArea = 10; // Enlarge the hit area by 10 pixels in all directions
        const element = elements[index];
        if (element.type === 'path') {
            const bounds = element.data.path.getBounds();
            if (
                locationX >= bounds.x - hitArea &&
                locationX <= bounds.x + bounds.width + hitArea &&
                locationY >= bounds.y - hitArea &&
                locationY <= bounds.y + bounds.height + hitArea
            ) {
                selectElement(index);
                offsetPathRef.current.offsetX = locationX - bounds.x;
                offsetPathRef.current.offsetY = locationY - bounds.y;
            }
        }
    };     
    
    const handlePathTouchMove = (event) => {
        console.log(`handlePathTouchMove ${selectedPathIndex} `);
        if (selectedPathIndex !== null) {
            const { locationX, locationY } = event.nativeEvent;
            const dx = locationX - offsetPathRef.current.offsetX;
            const dy = locationY - offsetPathRef.current.offsetY;
            moveSelectedPath(dx, dy);
        }
    };
    
    const handlePathTouchEnd = () => {
        setSelectedPathIndex(null);
        selectElement(null);
    };

    const copySelectedElements = () => {
        console.log(`copySelectedElements selectedElementIndexes`, selectedElementIndex);
    
        if (selectedElementIndex.length > 0) {
            // Create a new array to hold the duplicated elements
            const duplicatedElements = selectedElementIndex.map((index) => {
                const elementToCopy = elements[index];
                const offset = 10; // Slightly move the copy to differentiate it from the original
    
                let newElement;
                switch (elementToCopy.type) {
                    case 'path':
                        // Copy the path element
                        newElement = {
                            type: 'path',
                            data: {
                                ...elementToCopy.data,
                                // You might want to offset the path coordinates slightly, depending on your needs
                            },
                        };
                        break;
                    case 'image':
                        // Copy the image element and move it slightly
                        newElement = {
                            type: 'image',
                            data: {
                                ...elementToCopy.data,
                                x: elementToCopy.data.x + offset,
                                y: elementToCopy.data.y + offset,
                            },
                        };
                        break;
                    case 'text':
                        // Copy the text element and move it slightly
                        newElement = {
                            type: 'text',
                            data: {
                                ...elementToCopy.data,
                                x: elementToCopy.data.x + offset,
                                y: elementToCopy.data.y + offset,
                            },
                        };
                        break;
                    default:
                        newElement = elementToCopy; // Handle other cases or do nothing
                }
    
                return newElement;
            });
    
            // Combine the old elements with the new duplicated elements
            const newElements = [...elements, ...duplicatedElements];
    
            // Update the state with the new elements
            setElements(newElements);
    
            // setSelectedPathIndex(newElements.length - 1); // Set the new path as selected
            // selectElement(newElements.length - 1);

            pushToUndoStack();
        }
    }; 

    const textPanResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                console.log('onMoveShouldSetPanResponder', Math.abs(gestureState.dy) > 5);
                return Math.abs(gestureState.dy) > 5;
            },
            onPanResponderGrant: (evt, gestureState) => {
                const text = elementsRef.current[selectedElementIndexRef.current];

                console.log(`textPanResponder onPanResponderGrant text`, text);
                if (text && text.type === 'text') {
                    offsetTextRef.current.offsetX = text.data.x;
                    offsetTextRef.current.offsetY = text.data.y;
                }
            },
            onPanResponderMove: (evt, gestureState) => {
                console.log(`textPanResponder selectedElementIndexRef`, textPanResponder.current);
                const currentElement = elementsRef.current[selectedElementIndexRef.current];

                if (currentElement && currentElement.type === 'text'){

                    if (draggingCornerRef.current) {
                        handleTextResize(selectedElementIndexRef.current, draggingCornerRef.current)(evt, gestureState);
                    } else {
                        console.log(`textPanResponder offsetTextRef.current.offsetX`, offsetTextRef.current.offsetX);
                        console.log(`textPanResponder offsetTextRef.current.offsetY`, offsetTextRef.current.offsetY);
                        console.log(`gestureState ${gestureState.dx}, ${gestureState.dy}`, gestureState);
    
                        const newPosition = {
                            ...currentElement.data,
                            x: offsetTextRef.current.offsetX + gestureState.dx,
                            y: offsetTextRef.current.offsetY + gestureState.dy,
                        };
                        console.log(`textPanResponder newPosition `, newPosition);
    
                        const updatedElements = [...elementsRef.current];
                        updatedElements[selectedElementIndexRef.current] = { type: 'text', data: newPosition };
                        console.log(`textPanResponder updatedElements `, updatedElements);
                        
                        setElements(updatedElements);
                    }
                };
            },
            onPanResponderRelease: (evt, gestureState) => {
                setDraggingCorner(null);
            },
        })
    ).current;

    const addTextInput = () => {
        console.log(`addTextInput`, elements);
    
        const newTextInput = {
            id: Date.now(),  // Adding a unique ID to the text input for easy referencing
            text: 'Input Text',
            x: canvasCenterX,
            y: canvasCenterY,
            width: 100,
            height: 50,
            fontSize: 14,
        };
    
        setElements((prevElements) => {
            const newIndex = prevElements.length; // Calculate the index of the new element
            const newElements = [...prevElements, { type: 'text', data: newTextInput }];
    
            // Correctly set the selected index for the newly added text input
            setSelectedElementIndex([newIndex]);
            setSelectedTextInput(newTextInput.id); // Update the selected text input with its unique ID
            selectElement(newIndex); // Call selectElement with the new index to manage selection logic
    
            return newElements;
        });
    
        pushToUndoStack();
    }; 

    const handleTextInputChange = (id, newText) => {
        // Make a shallow copy of elements
        const updatedElements = [...elements];
    
        // Find the element by id and update its text
        updatedElements[id] = {
            ...updatedElements[id],
            data: {
                ...updatedElements[id].data,
                text: newText
            }
        };
    
        // Update the state
        setElements(updatedElements);
    };
    
    const handleTextInputTouchStart = (id, corner = null) => (event) => {
        console.log(`handleTextInputTouchStart ${id}`);

        if (mode === 'move') {
            selectElement(id);
            if (corner) {
                setDraggingCorner(corner);
            }
        }
    };

    const handleTextResize = (id, corner) => (event, gestureState) => {
        const scalingFactor = 0.04;
        //const fontSizeScalingFactor = 1.2; // Adjust this value to control sensitivity
        console.log(`handleResize ${id} ${corner} gestureState.dx: ${gestureState.dx}, gestureState.dy: ${gestureState.dy}`);

        setElements((prevElements) =>
            prevElements.map((el, index) => {
                if (index == id && el.type === 'text') {
                    let newWidth = el.data.width || 100;
                    let newHeight = el.data.height || 50;
                    let newFontSize = el.data.fontSize || 16;

                    const deltaX = gestureState.dx * scalingFactor;
                    const deltaY = gestureState.dy * scalingFactor;
                    //const aspectRatio = image.width / image.height;

                    switch (corner) {
                        case 'topLeft':
                            newWidth = el.data.width - deltaX;
                            newHeight = el.data.height - deltaY;
                            break;
                        case 'topRight':
                            newWidth = el.data.width + deltaX;
                            newHeight = el.data.height - deltaY;
                            break;
                        case 'bottomLeft':
                            newWidth = el.data.width - deltaX;
                            newHeight = el.data.height + deltaY;
                            break;
                        case 'bottomRight':
                            newWidth = el.data.width + deltaX;
                            newHeight = el.data.height + deltaY;
                            break;
                        default:
                            break;
                    }

                    // Adjust font size proportionally
                    const widthRatio = newWidth / (el.data.width || 100);
                    const heightRatio = newHeight / (el.data.height || 50);
                    newFontSize = newFontSize * Math.min(widthRatio, heightRatio) //* fontSizeScalingFactor;                    ;
                    console.log(`handleTextResize newWidth: ${newWidth}, newHeight: ${newHeight}, newFontSize: ${newFontSize}`);

                    return {
                        ...el,
                        data: {
                            ...el.data,
                            width: newWidth,
                            height: newHeight,
                            fontSize: newFontSize,
                        },
                    };
                }
                return el;
            })
        );
    };    

    const addImageToCanvas = async (src) => {
        //console.log('addImageToCanvas ', src);

        const assetSource = Image.resolveAssetSource(src);
        const { width, height } = assetSource;
        console.log(`addImageToCanvas width ${width} height ${height}`);

        const aspectRatio = width / height;

        const desiredWidth = width > 300? 300 : width;
        const desiredHeight = desiredWidth / aspectRatio;

        const newImage = { src, x: 100, y: 100, width: desiredWidth, height: desiredHeight };
        const newElement = { type: 'image', data: newImage };

        const updatedElements = [...elements, newElement];

        setElements(updatedElements);
        elementsRef.current = updatedElements;

        setShowPresets(false);
        pushToUndoStack();
    };

    const handleImageTouchStart = (id, corner = null) => (event) => {
        console.log(`handleImageTouchStart ${id}, ${corner}`);
        if (mode === 'move') {
            selectElement(id);
            if (corner) {
                setDraggingCorner(corner);
            }
        }
    };

    const imagePanResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt, gestureState) => {
                console.log(`imagePanResponder onPanResponderGrant ${selectedElementIndexRef.current}`, elementsRef);
                const image = elementsRef.current[selectedElementIndexRef.current];
                console.log(`imagePanResponder onPanResponderGrant image`, image);
                if (image && image.type === 'image') {
                    offsetImageRef.current.offsetX = image.data.x;
                    offsetImageRef.current.offsetY = image.data.y;
                }

                console.log(`imagePanResponder onPanResponderGrant offsetImageRef`, offsetImageRef);
            },
            onPanResponderMove: (evt, gestureState) => {

                const currentElement = elementsRef.current[selectedElementIndexRef.current];
                
                if (draggingCornerRef.current) {
                    handleResize(selectedElementIndexRef.current, draggingCornerRef.current)(evt, gestureState);
                } else if (currentElement && currentElement.type === 'image'){
                    console.log(`imagePanResponder onPanResponderMove currentElement`, currentElement);

                    // console.log(`imagePanResponder offsetImageRef.current.offsetX`, offsetImageRef.current.offsetX);
                    // console.log(`imagePanResponder offsetImageRef.current.offsetY`, offsetImageRef.current.offsetY);
                    // console.log(`gestureState ${gestureState.dx}, ${gestureState.dy}`, gestureState);

                    const newPosition = {
                        ...currentElement.data,
                        x: offsetImageRef.current.offsetX + gestureState.dx,
                        y: offsetImageRef.current.offsetY + gestureState.dy,
                    };
                    console.log(`imagePanResponder newPosition `, newPosition);

                    const updatedElements = [...elementsRef.current];
                    updatedElements[selectedElementIndexRef.current] = { type: 'image', data: newPosition };
                    console.log(`imagePanResponder updatedElements `, updatedElements);
                    
                    setElements(updatedElements);
                }             
            },
            onPanResponderRelease: () => {
                setDraggingCorner(null);
            }
        })
    ).current;    

    const handleResize = (id, corner) => (event, gestureState) => {
        const scalingFactor = 0.04; // Adjust this value to control sensitivity
        console.log(`handleResize ${id} ${corner} gestureState.dx: ${gestureState.dx}, gestureState.dy: ${gestureState.dy}`);
    
        setElements((prevElements) =>
            prevElements.map((element, index) => {
                console.log(`element.type ${element.type} element.data.id ${element.data.id} id ${id}` );
                if (element.type === 'image' && index == id) {
                    let newWidth = element.data.width;
                    let newHeight = element.data.height;
    
                    const deltaX = gestureState.dx * scalingFactor;
                    const deltaY = gestureState.dy * scalingFactor;
                    const aspectRatio = element.data.width / element.data.height;
    
                    switch (corner) {
                        case 'topLeft':
                            newWidth = element.data.width - deltaX;
                            newHeight = newWidth / aspectRatio;
                            break;
                        case 'topRight':
                            newWidth = element.data.width + deltaX;
                            newHeight = newWidth / aspectRatio;
                            break;
                        case 'bottomLeft':
                            newWidth = element.data.width - deltaX;
                            newHeight = newWidth / aspectRatio;
                            break;
                        case 'bottomRight':
                            newWidth = element.data.width + deltaX;
                            newHeight = newWidth / aspectRatio;
                            break;
                        default:
                            break;
                    }
                    console.log(`handleResize newWidth: ${newWidth}, newHeight: ${newHeight}`);
    
                    return {
                        ...element,
                        data: {
                            ...element.data,
                            width: newWidth,
                            height: newHeight,
                        },
                    };
                }
                return element;
            })
        );
    };     

    const handleBringToFront = () => {
        console.log(`handleBringToFront ${selectedElementIndex}`, elements);
        if (elements.length > 0) {
            setElements(bringToFront(elements, selectedElementIndex));
        }
    };
    
    const handleSendToBack = () => {
        console.log(`handleSendToBack ${selectedElementIndex}`, elements);
        if (elements.length > 0) {
            setElements(sendToBack(elements, selectedElementIndex));
        }
    };
    
    const handleBringForward = () => {
        console.log(`handleBringForward ${selectedElementIndex}`, elements);
        if (elements.length > 0) {
            setElements(bringForward(elements, selectedElementIndex));
        }
    };
    
    const handleSendBackward = () => {
        console.log(`handleSendBackward ${selectedElementIndex}`, elements);
        if (elements.length > 0) {
            setElements(sendBackward(elements, selectedElementIndex));
        }
    };

    const bringToFront = (array, index) => {
        console.log(`bringToFront ${index}, ${array.length}`, array);
        const newArray = [...array];
        const [item] = newArray.splice(index, 1);
        newArray.push(item);
        return newArray;
    };
    
    const sendToBack = (array, index) => {
        console.log(`sendToBack ${index}, ${array.length}`, array);
        const newArray = [...array];
        const [item] = newArray.splice(index, 1);
        newArray.unshift(item);
        return newArray;
    };
    
    const bringForward = (array, index) => {
        console.log(`bringForward ${index}, ${array.length}`, array);
        if (index < array.length - 1) {
            const newArray = [...array];
            const [item] = newArray.splice(index, 1);
            newArray.splice(index + 1, 0, item);
            return newArray;
        }
        return array;
    };
    
    const sendBackward = (array, index) => {
        console.log(`sendBackward ${index}, ${array.length}`, array);
        if (index > 0) {
            const newArray = [...array];
            const [item] = newArray.splice(index, 1);
            newArray.splice(index - 1, 0, item);
            return newArray;
        }
        return array;
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

    const handleSave = async () => {
        selectElement(null);
        setSelectionBox(null);
        try {
            const base64 = await viewShot.captureRef(containerRef, {
                format: 'png', quality: 0.5, result: 'base64'
            });

            if (base64) {
                const serializedState = serializeState(elements);
                const updatedImage = { ...sketchImage, IMAGE64: base64, RAW_METADATA: serializedState };

                //console.log('saving sketch ', updatedImage);
                console.log('saving sketch ', updatedImage.RAW_METADATA);
                await Images.insertSketch(DatabaseService.db, updatedImage);
                ToastAndroid.show("Saved successfully", ToastAndroid.SHORT);
            }
        } catch (error) {
            console.error('Error capturing snapshot:', error);
        }
    };

    const handleBack = async () => {
        selectElement(null);
        setSelectionBox(null);
        try {
            const base64 = await viewShot.captureRef(containerRef, {
                format: 'png', quality: 0.5, result: 'base64'
            });
    
            if (base64) {
                const serializedState = serializeState(elements);
                const updatedImage = { ...sketchImage, IMAGE64: base64, RAW_METADATA: serializedState };
                await Images.insertSketch(DatabaseService.db, updatedImage);
    
                const uri = `data:image/png;base64,${base64}`;
                const updatedImageWithUri = { ...updatedImage, uri: uri };
    
                navigation.navigate('AccidentMainScreen', {
                    screen: 'Sketch Plan',
                    params: { updatedSketchImage: updatedImageWithUri },
                    initial: false
                });
            }

        } catch (error) {
            console.error('Error capturing snapshot:', error);
        }
    };

    const renderColorModal = () => (
        <ColorModal
            visible={showColorPicker}
            onClose={() => setShowColorPicker(false)}
            color={color}
            setColor={setColor}
            modalHeight="50%" 
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
    const renderPresetModal = () => (
        <Modal visible={showPresets} animationType="slide">
            <Presets onSelectImage={addImageToCanvas} />
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowPresets(false)}>
                <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
        </Modal>
    );
    const renderPenPickerModal = () => (
        <PenPickerModal
            visible={showPenPicker}
            onClose={() => setShowPenPicker(false)}
            penMode={penMode}
            setPenMode={setPenMode}
        />
    );
    const renderShapePickerModal = () => (
        <ShapePickerModal
            visible={showShapePicker}
            onClose={() => setShowShapePicker(false)}
            shapeMode={shapeMode}
            setShapeMode={setShapeMode}
        />
    );
    const renderZIndexModal = () => (
        <ZIndexModal
            visible={showZIndex}
            onClose={() => setShowZIndex(false)}
            onBringToFront={() => handleBringToFront()}
            onSendToBack={() => handleSendToBack()}
            onBringForward={() => handleBringForward()}
            onSendBackward={() => handleSendBackward()}
        />
    );
    
    const selectElement = (index) => {
        setSelectedElementIndex([index]);
        console.log(`selectElement ${index} selectedElementIndex ${selectedElementIndex}`, elementsRef.current);

        if (index == null){
            return;
        }
    
        const element = elementsRef.current[index];
        console.log(`selectElement element`, element);

        if(!element){
            return;
        }

        if (element.type === 'text') {
            setSelectedTextInput(element.data.id);
            setSelectedImage(null);
            setSelectedPathIndex(null);
        } else if (element.type === 'image') {
            setSelectedImage(element.data.id);
            setSelectedTextInput(null);
            setSelectedPathIndex(null);
        } else if (element.type === 'path') {
            setSelectedPathIndex(index);
            setSelectedImage(null);
            setSelectedTextInput(null);
        }
    };

    const getDashedPaint = () => {
        const paint = Skia.Paint();
        paint.setStyle(PaintStyle.Stroke);
        //paint.setPathEffect(Skia.PathEffect.MakeDash([10, 10], 0));
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
    
        //console.log('left', left, 'top', top, 'right', right, 'bottom', bottom);
    
        if (left === undefined || top === undefined || right === undefined || bottom === undefined) {
            throw new Error('Bounding box values are undefined');
        }
    
        const boundingBoxRect = Skia.XYWHRect(left, top, right - left, bottom - top);

        const boundingBoxPath = Skia.Path.Make();
        boundingBoxPath.addRect(boundingBoxRect, true); 
    
        return boundingBoxPath;
    };
    
    const renderImages = () => {
        return elements.map((el, originalIndex) => {
            if (el.type !== 'image') return null; // Skip non-image elements
    
            return (
                <View
                    key={originalIndex}
                    style={[
                        styles.draggableImage,
                        selectedElementIndex.includes(originalIndex) ? styles.selectedImage : null,
                        { top: el.data.y, left: el.data.x, width: el.data.width, height: el.data.height },
                    ]}
                    onTouchStart={handleImageTouchStart(originalIndex)}
                    {...(selectedElementIndex.includes(originalIndex) ? imagePanResponder.panHandlers : {})}
                >
                    <Image source={el.data.src} style={[styles.image, { width: el.data.width, height: el.data.height }]} />
                    {selectedElementIndex.includes(originalIndex) && (
                        <>
                            <View
                                style={[styles.resizeHandle, styles.topLeft]}
                                onTouchStart={(event) => { handleImageTouchStart(originalIndex, 'topLeft')(event); }}
                            />
                            <View
                                style={[styles.resizeHandle, styles.topRight]}
                                onTouchStart={(event) => { handleImageTouchStart(originalIndex, 'topRight')(event); }}
                            />
                            <View
                                style={[styles.resizeHandle, styles.bottomLeft]}
                                onTouchStart={(event) => { handleImageTouchStart(originalIndex, 'bottomLeft')(event); }}
                            />
                            <View
                                style={[styles.resizeHandle, styles.bottomRight]}
                                onTouchStart={(event) => { handleImageTouchStart(originalIndex, 'bottomRight')(event); }}
                            />
                        </>
                    )}
                </View>
            );
        });
    };
    
    const renderTextInputs = () => {
        return elements.map((el, originalIndex) => {
            if (el.type !== 'text') return null; // Skip non-text elements
    
            // Determine the text value to display in TextInput
            const textValue = el.data.text ?? ''; // Default to empty string if undefined or null

            return (
                <View
                    key={originalIndex}
                    style={[
                        styles.textInputWrapper,
                        { top: el.data.y, left: el.data.x },
                        selectedElementIndex.includes(originalIndex) ? styles.selectedTextInput : null,
                    ]}
                    onTouchStart={handleTextInputTouchStart(originalIndex)}
                    {...(selectedElementIndex.includes(originalIndex) ? textPanResponder.panHandlers : {})}
                >
                    <TextInput
                        style={[styles.textInput, {height: el.data.height, width: el.data.width, fontSize: el.data.fontSize }]}
                        value={textValue}
                        onChangeText={(newText) => handleTextInputChange(originalIndex, newText)}
                        onFocus={() => setSelectedTextInput(originalIndex)}
                        editable={selectedElementIndex.includes(originalIndex)}
                    />
                    {selectedElementIndex.includes(originalIndex) && (
                        <>
                            <View
                                style={[styles.resizeHandle, styles.topLeft]}
                                onTouchStart={(event) => { handleTextInputTouchStart(originalIndex, 'topLeft')(event); }}
                            />
                            <View
                                style={[styles.resizeHandle, styles.topRight]}
                                onTouchStart={(event) => { handleTextInputTouchStart(originalIndex, 'topRight')(event); }}
                            />
                            <View
                                style={[styles.resizeHandle, styles.bottomLeft]}
                                onTouchStart={(event) => { handleTextInputTouchStart(originalIndex, 'bottomLeft')(event); }}
                            />
                            <View
                                style={[styles.resizeHandle, styles.bottomRight]}
                                onTouchStart={(event) => { handleTextInputTouchStart(originalIndex, 'bottomRight')(event); }}
                            />
                        </>
                    )}
                </View>
            );
        });
    }
    
    const renderPaths = () => {
        return elements.map((el, originalIndex) => {
            if (el.type !== 'path') return null; // Skip non-path elements
    
            return (
                <React.Fragment key={originalIndex}>
                    <Path
                        path={el.data.path}
                        paint={el.data.paint}
                        onStartShouldSetResponder={() => true}
                        onResponderGrant={handlePathTouchStart(originalIndex)}
                        onResponderMove={handlePathTouchMove}
                        onResponderRelease={handlePathTouchEnd}
                    />
                    {selectedElementIndex.includes(originalIndex) && (
                        <Path path={getBoundingBoxPath(el.data.path)} paint={getDashedPaint()} />
                    )}
                </React.Fragment>
            );
        });
    };

    return (
        <GestureHandlerRootView style={[styles.container, {backgroundColor: "white"}]}>
            <View ref={containerRef} style={styles.container} collapsable={false} onLayout={onLayout}>
                <Canvas style={styles.canvas} onTouchStart={handleTouch} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
                    {renderPaths()}
                    {renderDynamicShape()}
                </Canvas>
                {renderImages()}
                {renderTextInputs()}
                {renderSelectionBox()}
            </View>
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={[
                        styles.button,
                        mode === 'move' ? styles.activeButton : null,
                    ]}
                    onPress={() => setMode('move')}
                >
                    <Image
                        source={require('../../assets/icon/pointer.png')}
                        style={styles.bottomBarIcon}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setMode('draw')} >
                    <View style={{ flexDirection: "row" }}>
                        <View style={[mode === 'draw' ? styles.activeButton : styles.notActiveButton]}>
                            <Image
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
                            <Image
                                source={require('../../assets/icon/arrow-down.png')}
                                style={[{ height: 15, width: 15, alignSelf: 'center', marginLeft: 10}]}
                            />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
                {/* <TouchableOpacity
                    style={[
                        styles.button,
                        mode === 'erase' ? styles.activeButton : null,
                    ]}
                    onPress={() => setMode('erase')}
                >
                    <Image
                        source={require('../../assets/icon/eraser.png')}
                        style={styles.bottomBarIcon}
                    />
                </TouchableOpacity> */}
                <TouchableOpacity style={styles.button} onPress={() => setShowColorPicker(true)}>
                    <View style={[styles.colorPreview, { backgroundColor: color }]} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => setShowPenWidthSlider(true)}>
                    <Image
                        source={require('../../assets/icon/line-width.png')}
                        style={styles.bottomBarIcon}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[ styles.button, mode === 'shape' ? styles.activeButton : null ]}
                    onPress={() => {setMode('shape'); setShowShapePicker(true)}}>
                    <Image
                        source={require('../../assets/icon/arrows.png')}
                        style={{width: 19, height: 21}}
                    />
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.button} onPress={() => setShowZIndex(true)}>
                    <Image
                        source={require('../../assets/icon/align.png')}
                        style={styles.bottomBarIcon}
                    />
                </TouchableOpacity> */}
                {/* <TouchableOpacity style={styles.button}>
                    <Image
                        source={require('../../assets/icon/group.png')}
                        style={styles.bottomBarIcon}
                    />
                </TouchableOpacity> */}
                <TouchableOpacity style={styles.button} onPress={() => copySelectedElements()}>
                    <Image
                        source={require('../../assets/icon/copy.png')}
                        style={styles.bottomBarIcon}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => addTextInput()}>
                    <Image
                        source={require('../../assets/icon/text.png')}
                        style={styles.bottomBarIcon}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleClear}>
                    <Image
                        source={require('../../assets/icon/delete.png')}
                        style={styles.bottomBarIcon}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, (undoStack.length === 0) ? styles.disabledButton : null]}
                    onPress={undo} 
                    disabled={undoStack.length === 0}
                >
                    <Image
                        source={require('../../assets/icon/undo.png')}
                        style={styles.bottomBarIcon}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, (redoStack.length === 0) ? styles.disabledButton : null]}
                    onPress={redo} 
                    disabled={redoStack.length === 0}
                >
                    <Image
                        source={require('../../assets/icon/redo.png')}
                        style={styles.bottomBarIcon}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => setShowPresets(true)}>
                    <Text style={styles.buttonText}>Presets</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonFrame}>
                <View style={{ width: "23%", marginRight: "2%" }}>
                    <BlueButtonShort title="BACK TO LIST" customClick={handleBack}/>
                </View>
                <View style={{ width: "23%" }}>
                    <SketchButton title="SAVE AS DRAFT" customClick={handleSave} />
                </View>
            </View>
            {renderColorModal()}
            {renderPenWidthModal()}
            {renderPresetModal()}
            {renderShapePickerModal()}
            {renderPenPickerModal()}
            {renderZIndexModal()}
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    canvas: { flex: 1 },
    colorPreview: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        // backgroundColor: '#ddd',
        paddingVertical: 7,
    },
    bottomBarIcon: { 
        width: 18, 
        height: 20 
    },
    button: {
        padding: 10,
        borderRadius: 5,
    },
    buttonNew: {
        paddingLeft: 10
    },
    shapeButton: {
        padding: 10,
        borderRadius: 5,
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
    buttonText: {
        fontSize: 15,
        color: "rgba(0,22,62,1)",
        fontFamily: "ZenKakuGothicAntique-Regular",
    },
    draggableImage: {
        position: 'absolute',
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    closeButton: {
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        alignItems: 'center',
        margin: 20,
    },
    selectedImage: {
        borderWidth: 1,
        borderColor: '#4868fe',
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
    buttonFrame: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-start",
        width: "100%",
        boxSizing: "border-box",
        marginBottom: 5, 
    },
    textInputWrapper: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        color: 'black',
        borderRadius: 5,
        textAlign: 'center', 
    },
    selectedTextInput: {
        borderWidth: 1,
        borderColor: '#4868fe',
    },
});

export default Sketch;
