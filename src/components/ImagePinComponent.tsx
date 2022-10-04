import { ReactElement, createElement, useEffect, useRef, useState, ReactNode, CSSProperties } from "react";
// import { ActionValue } from "mendix";

export interface ImagePinComponentProps {
    // imgValue: string;
    // titleValue: string;
    // pinActionValue: ActionValue;
    index: number;
    getDimensions: (width: number, height: number, index: number) => void;
    children?: ReactNode;
    x?: number;
    y?: number;
    // rootWidth: number;
}

export function ImagePinComponent({ index, getDimensions, children, x, y }: ImagePinComponentProps): ReactElement {
    const compRef = useRef<HTMLDivElement>(null);
    const style = { position: "absolute", top: y, right: x } as CSSProperties;

    const [isLoaded, setIsLoaded] = useState(false);
    // const [width, setWidth] = useState(0);
    // const [height, setHeight] = useState(0);

    useEffect(() => {
        if (compRef.current && !isLoaded) {
            const imageTest = compRef.current.querySelector("img");
            if (imageTest) {
                // This is required as otherwise Mendix loads a placeholder and the parent gets the placeholder size
                imageTest.onload = () => {
                    const { width, height } = compRef.current!.getBoundingClientRect();
                    getDimensions(width, height, index);
                    setIsLoaded(true);
                };
            } else {
                setIsLoaded(true);
            }
        }
    }, [compRef]);

    // useEffect(() => {
    //     if (isLoaded) {
    //         if (compRef.current) {
    //             const { width, height } = compRef.current.getBoundingClientRect();
    //             console.dir("Child Width " + width + "Height " + height + "Index " + index);
    //             getDimensions(width, height, index);
    //         }
    //     }
    // }, [isLoaded]);

    return (
        <div ref={compRef} style={style}>
            {children}
        </div>
    );
}
