import { Dimensions } from "@mendix/widget-plugin-platform/utils/get-dimensions";
import { CSSProperties } from "react";
export interface ModeledMarker {
    address?: string;
    latitude?: number;
    longitude?: number;
    title?: string;
    customMarker?: string;
    action?: () => void;
}

export interface Marker {
    latitude: number;
    longitude: number;
    url: string;
    onClick?: () => void;
    title?: string;
}

export interface DynamicPolyLine {
    coordinates?: LatLngExpression[][];
    onClick?: () => void;
    title?: string;
    color?: string;
    opacity?: number;
    thickness?: number;
}

export interface DynamicPolyGon {
    coordinates?: LatLngExpression[][];
    onClick?: () => void;
    title?: string;
    color?: string;
    opacity?: number;
    thickness?: number;
}



export interface SharedProps extends Dimensions {
    autoZoom: boolean;
    optionZoomControl: boolean;
    zoomLevel: number;
    optionDrag: boolean;
    optionScroll: boolean;
    showCurrentLocation: boolean;
    currentLocation?: Marker;
    locations: Marker[];
    dynamicPolyLines: DynamicPolyLine[];
    dynamicPolyGons: DynamicPolyGon[];
    mapsToken?: string;
    className?: string;
    style?: CSSProperties;
}
