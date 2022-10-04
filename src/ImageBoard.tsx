import { ReactElement, createElement } from "react";
import { ImageBoardComponent } from "./components/ImageBoardComponent";

import { ImageBoardContainerProps } from "../typings/ImageBoardProps";

import "./ui/ImageBoard.css";

export function ImageBoard({ images, widgetList }: ImageBoardContainerProps): ReactElement {
    return <ImageBoardComponent images={images} widgetList={widgetList} />;
}
