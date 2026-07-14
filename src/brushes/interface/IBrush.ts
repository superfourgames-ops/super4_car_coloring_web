import { Stroke } from "../../models/Stroke.js";

export interface IBrush {
    drawOnPointerDown(stroke: Stroke): void;
    drawOnPointerMove(stroke: Stroke): void;
    drawOnPointerUp(stroke: Stroke): void;
}