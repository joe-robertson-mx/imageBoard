/**
 * This file was generated from ImageBoard.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { ComponentType, CSSProperties } from "react";
import { ListValue, ListWidgetValue } from "mendix";

export interface ImageBoardContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    images: ListValue;
    widgetList: ListWidgetValue;
}

export interface ImageBoardPreviewProps {
    className: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    images: {} | { type: string } | null;
    widgetList: { widgetCount: number; renderer: ComponentType<{ caption?: string }> };
}
