import { useState, useEffect, useCallback } from "react";

export const useResize = (myRef: React.MutableRefObject<null | HTMLDivElement>) => {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const handleResize = useCallback(() => {
        if (!myRef.current) {
            return;
        }
        setWidth(myRef.current.offsetWidth);
        setHeight(myRef.current.offsetHeight);
    }, [myRef]);

    useEffect(() => {
        if (myRef.current) {
            window.addEventListener("load", handleResize);
            window.addEventListener("resize", handleResize);

            return () => {
                window.removeEventListener("load", handleResize);
                window.removeEventListener("resize", handleResize);
            };
        }
    }, [myRef, handleResize]);

    return { width, height };
};
