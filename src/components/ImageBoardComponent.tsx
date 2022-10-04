import { ReactElement, createElement, useRef, useEffect, useState, MutableRefObject } from "react";
import { ImagePinComponent } from "./ImagePinComponent";
import { ListValue, ListWidgetValue } from "mendix";

export interface ImageBoardComponentProps {
    images: ListValue;
    widgetList: ListWidgetValue;
}

type RenderedPinDimensions = {
    width: number;
    height: number;
    index: number;
};

type Column = {
    no: number;
    height: number;
};

export function ImageBoardComponent({ images, widgetList }: ImageBoardComponentProps): ReactElement {
    const rootRef: MutableRefObject<null | HTMLDivElement> = useRef(null);
    const [initialPositionArray, setInitialPositionArray] = useState<RenderedPinDimensions[]>([]);
    const [translations, setTranslations] = useState<RenderedPinDimensions[]>([]);
    const [columnHeights, setColumnHeights] = useState<Column[]>();
    const [rootWidth, setRootWidth] = useState(0);
    const [isUpdating, setIsUpdating] = useState(false);
    const [gutterWidth, setGutterWidth] = useState(20);
    // const [recalculate, setRecalculate] = useState(true);

    const gutterHeight = 0;

    const calculateColumns = (rootWidth: number, cWidth: number): void => {
        const noOfCols = Math.floor(rootWidth / cWidth);
        const gutterW = (rootWidth - noOfCols * cWidth) / 2;
        setGutterWidth(gutterW);
        const colArr = [];
        for (let i = 0; i < noOfCols; i++) {
            colArr.push({ no: i, height: gutterHeight });
        }
        setColumnHeights(colArr);
    };

    const getDimensions = (width: number, height: number, index: number): void => {
        const newDimensions: RenderedPinDimensions = { width, height, index };
        setInitialPositionArray(prevState => [...prevState, newDimensions]);
    };

    const updateColumnHeights = (colNo: number, height: number): void => {
        const newColumnHeights = columnHeights!.map(col => {
            if (col.no === colNo) {
                return { ...col, height: col.height + height };
            }
            return col;
        });
        console.dir(columnHeights);
        setColumnHeights(newColumnHeights);
    };

    const handleResize = () => {
        if (!rootRef.current) {
            return;
        }
        if (!isUpdating) {
            setRootWidth(rootRef.current.offsetWidth);

            setTranslations([]);
        }
    };

    useEffect(() => {
        if (rootRef.current) {
            setRootWidth(rootRef.current.offsetWidth);
            window.addEventListener("resize", handleResize);
            return () => {
                window.removeEventListener("resize", handleResize);
            };
        }
    }, [rootRef, handleResize]);

    useEffect(() => {
        if (initialPositionArray.length === images.items?.length && !isUpdating) {
            // Assume all items have the same width
            setIsUpdating(true);
            calculateColumns(rootWidth, initialPositionArray[0].width);
        }
    }, [rootWidth, initialPositionArray]);

    useEffect(() => {
        if (columnHeights && columnHeights.length > 0) {
            const index = translations.length;
            if (translations.length === initialPositionArray.length) {
                // Once the translations array is the same length as the initialRenderedArray, we can allow recalculation based on width
                setIsUpdating(false);
                return;
            }
            // Need the pin based on the initial position in the array
            const pin = initialPositionArray.find(pin => pin.index === index);
            const col = columnHeights.reduce((prev, curr) => (prev.height < curr.height ? prev : curr));
            const right = col.no * pin!.width + gutterWidth;
            const top = col.height;
            setTranslations(prevState => [...prevState, { width: right, height: top, index }]);
            updateColumnHeights(col!.no, pin!.height);
        }
    }, [columnHeights]);

    return (
        <div ref={rootRef} className="image-board">
            {images.items &&
                images.status === "available" &&
                images.items.map((image, index) => {
                    return (
                        <ImagePinComponent
                            key={index}
                            getDimensions={getDimensions}
                            index={index}
                            x={translations[index] ? translations[index].width : 0}
                            y={translations[index] ? translations[index].height : 0}
                        >
                            {widgetList.get(image)}
                        </ImagePinComponent>
                    );
                })}
        </div>
    );
}
