import { createElement, ReactElement } from "react";
import { MapContainer, Marker as MarkerComponent, Popup, TileLayer, useMap, Polyline, Polygon } from "react-leaflet";
import classNames from "classnames";
import { getDimensions } from "@mendix/widget-plugin-platform/utils/get-dimensions";
import { SharedProps } from "../../typings/shared";
import { MapProviderEnum } from "../../typings/MapsProps";
import { translateZoom } from "../utils/zoom";
import { latLngBounds, Icon as LeafletIcon, DivIcon, marker } from "leaflet";
import { baseMapLayer } from "../utils/leaflet";
import { polyLineOptions } from "../utils/polylineCustom";


export interface LeafletProps extends SharedProps {
    mapProvider: MapProviderEnum;
    attributionControl: boolean;
}

/**
 * There is an ongoing issue in `react-leaflet` that fails to properly set the icon urls in the
 * default marker implementation. Issue https://github.com/PaulLeCam/react-leaflet/issues/453
 * describes the problem and also proposes a few solutions. But all of them require a hackish method
 * to override `leaflet`'s implementation of the default Icon. Instead, we always set the
 * `Marker.icon` prop instead of relying on the default. So if a custom icon is set, we use that.
 * If not, we reuse a leaflet icon that's the same as the default implementation should be.
 */
const defaultMarkerIcon = new LeafletIcon({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

function SetBoundsComponent(props: Pick<LeafletProps, "autoZoom" | "currentLocation" | "locations">): null {
    const map = useMap();
    const { autoZoom, currentLocation, locations } = props;

    const bounds = latLngBounds(
        locations
            .concat(currentLocation ? [currentLocation] : [])
            .filter(m => !!m)
            .map(m => [m.latitude, m.longitude])
    );

    if (bounds.isValid()) {
        if (autoZoom) {
            map.flyToBounds(bounds, { padding: [0.5, 0.5], animate: false }).invalidateSize();
        } else {
            map.panTo(bounds.getCenter(), { animate: false });
        }
    }

    return null;
}

export function LeafletMap(props: LeafletProps): ReactElement {
    const center = { lat: 51.906688, lng: 4.48837 };
    const {
        autoZoom,
        attributionControl,
        className,
        currentLocation,
        locations,
        dynamicPolyLines,
        dynamicPolyGons,
        mapProvider,
        mapsToken,
        optionScroll: scrollWheelZoom,
        optionZoomControl: zoomControl,
        style,
        zoomLevel: zoom,
        optionDrag: dragging
    } = props;


    return (
        <div className={classNames("widget-maps", className)} style={{ ...style, ...getDimensions(props) }}>
            <div className="widget-leaflet-maps-wrapper">
                <MapContainer
                    attributionControl={attributionControl}
                    center={center}
                    className="widget-leaflet-maps widget-leaflet-maps-custom"
                    dragging={dragging}
                    maxZoom={18}
                    minZoom={1}
                    scrollWheelZoom={scrollWheelZoom}
                    zoom={autoZoom ? translateZoom("city") : zoom}
                    zoomControl={zoomControl}
                >
                    <TileLayer {...baseMapLayer(mapProvider, mapsToken)} />
       
                    {dynamicPolyLines && dynamicPolyLines.map((dynamicPolyLine, index) => {
                        if (dynamicPolyLine.coordinates && dynamicPolyLine.coordinates.length > 0) {
                        return (
                            <Polyline
                                key={`polyline_${index}`}
                                className="polyline"
                                eventHandlers={{
                                    click: dynamicPolyLine.onClick ? undefined : dynamicPolyLine.onClick
                                }}
                                pathOptions={polyLineOptions}
                                positions={dynamicPolyLine.coordinates}
                            >
                                 {dynamicPolyLine.title && (
                                    <Popup>
                                        <span
                                            style={{ cursor: dynamicPolyLine.onClick ? "pointer" : "none" }}
                                            onClick={dynamicPolyLine.onClick}
                                        >
                                            {dynamicPolyLine.title}
                                        </span>
                                    </Popup>
                                )}
                            </Polyline>
                        );
                        } else {
                            console.warn(`Coordinates are null, undefined, or invalid for dynamicPolyLine at index ${index}:`, dynamicPolyLine.coordinates);
                        return null;
                        }
                    })}

                    {dynamicPolyGons && dynamicPolyGons.map((dynamicPolygon, index) => {
                        if (dynamicPolygon.coordinates && dynamicPolygon.coordinates.length > 0) {
                        return (
                            <Polygon
                                key={`polygon_${index}`}
                                className="polygon"
                                eventHandlers={{
                                    click: dynamicPolygon.onClick ? undefined : dynamicPolygon.onClick
                                }}
                                pathOptions={polyLineOptions}
                                positions={dynamicPolygon.coordinates}
                            >
                                 {dynamicPolygon.title && (
                                    <Popup>
                                        <span
                                            style={{ cursor: dynamicPolygon.onClick ? "pointer" : "none" }}
                                            onClick={dynamicPolygon.onClick}
                                        >
                                            {dynamicPolygon.title}
                                        </span>
                                    </Popup>
                                )}
                            </Polygon>
                        );
                        } else {
                            console.warn(`Coordinates are null, undefined, or invalid for dynamicPolyLine at index ${index}:`, dynamicPolyLine.coordinates);
                        return null;
                        }
                    })}


                    {locations
                        .concat(currentLocation ? [currentLocation] : [])
                        .filter(m => !!m)
                        .map((marker, index) => (
                            <MarkerComponent
                                icon={
                                    marker.url
                                        ? new DivIcon({
                                              html: `<img src="${marker.url}" class="custom-leaflet-map-icon-marker-icon" alt="map marker" />`,
                                              className: "custom-leaflet-map-icon-marker"
                                          })
                                        : defaultMarkerIcon
                                }
                                interactive={!!marker.title || !!marker.onClick}
                                key={`marker_${index}`}
                                eventHandlers={{
                                    click: marker.title ? undefined : marker.onClick
                                }}
                                position={{ lat: marker.latitude, lng: marker.longitude }}
                                title={marker.title}
                            >
                                {marker.title && (
                                    <Popup>
                                        <span
                                            style={{ cursor: marker.onClick ? "pointer" : "none" }}
                                            onClick={marker.onClick}
                                        >
                                            {marker.title}
                                        </span>
                                    </Popup>
                                )}
                            </MarkerComponent>
                        ))}

                        
                    <SetBoundsComponent autoZoom={autoZoom} currentLocation={currentLocation} locations={locations} />
                </MapContainer>
            </div>
        </div>
    );
}
