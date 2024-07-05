import { LatLngExpression } from 'leaflet';
import { DynamicPolyLinesType } from 'typings/MapsProps';
import { DynamicPolyLine, DynamicPolyGon } from "../../typings/shared";
import { ObjectItem, ValueStatus } from "mendix";
import { parseLatLngArrayFromString } from "../utils/functionsCustom"

//export const polyLineOptions = { color: '#FF0000' };


//Deze functie zet een object dynamicPolyLine(string) om in een object van dynamicPolyline (LatLngExpression) 
function polyLineDataSource(dynamicPolyline: DynamicPolyLinesType, item: ObjectItem): DynamicPolyLine | null {
  const { title, coordinates, onClickAttribute, polytype, color, opacity, thickness, inverseCoordinates } = dynamicPolyline;
  const polyType: string = polytype ? polytype.get(item).value as string : "";

  if (polyType === 'Polyline') {
    const inverse: boolean = inverseCoordinates ? inverseCoordinates.get(item).value as boolean : false;
    const coordinatesString: string = coordinates ? coordinates.get(item).value as string : "";
    // Convert coordinates string to LatLngExpression that can be used as input for the leaflet widget
    const coordinatesLatLngExpression: LatLngExpression[][] = parseLatLngArrayFromString(coordinatesString, inverse);

    return {
      title: title ? title.get(item).value : "",
      coordinates: coordinatesLatLngExpression,
      onClick: onClickAttribute ? onClickAttribute.get(item).execute : undefined,
      color: color ? color.get(item).value : "",
      opacity: opacity ? opacity.get(item).value : 1
      thickness: thickness ? thickness.get(item).value : 1
    };
  } else {
    return null; // Return null if polyType is not 'polyLine'
  }
}


//Deze functie zet een object dynamicPolyLine(string) om in een object van dynamicPolyline (LatLngExpression) 
function polyGonDataSource(dynamicPolyline: DynamicPolyLinesType, item: ObjectItem): DynamicPolyGon | null {
  const { title, coordinates, onClickAttribute, polytype, color, opacity, thickness, inverseCoordinates } = dynamicPolyline;
  const polyType: string = polytype ? polytype.get(item).value as string : "";

  if (polyType === 'Polygon') {
    const inverse: boolean = inverseCoordinates ? inverseCoordinates.get(item).value as boolean : false;
    const coordinatesString: string = coordinates ? coordinates.get(item).value as string : "";
    // Convert coordinates string to LatLngExpression that can be used as input for the leaflet widget
    const coordinatesLatLngExpression: LatLngExpression[][] = parseLatLngArrayFromString(coordinatesString, inverse);

    return {
      title: title ? title.get(item).value : "",
      coordinates: coordinatesLatLngExpression,
      onClick: onClickAttribute ? onClickAttribute.get(item).execute : undefined,
      color: color ? color.get(item).value : "",
      opacity: opacity ? opacity.get(item).value : 1
      thickness: thickness ? thickness.get(item).value : 1
    };
  } else {
    return null; // Return null if polyType is not 'polyGon'
  }
}



function convertdynamicPolyline(dynamicPolyline: DynamicPolyLinesType): DynamicPolyLine[] {
  if (dynamicPolyline.polylineDS && dynamicPolyline.polylineDS.status === ValueStatus.Available) {
    return (
      dynamicPolyline.polylineDS.items
        ?.map(i => polyLineDataSource(dynamicPolyline, i))
        .filter(item => item !== null) ?? [] // Filter out null values
    );
  }
  return [];
}


function convertdynamicPolyGon(dynamicPolyline: DynamicPolyLinesType): DynamicPolyGon[] {
  if (dynamicPolyline.polylineDS && dynamicPolyline.polylineDS.status === ValueStatus.Available) {
    return (
      dynamicPolyline.polylineDS.items
        ?.map(i => polyGonDataSource(dynamicPolyline, i))
        .filter(item => item !== null) ?? [] // Filter out null values
    );
  }
  return [];
}



//Deze functie krijgt een array van dynamicPolyLineType (strings) binnen en zet deze om in een array van dynamicPolyline (LatLngExpression)
  export function dynamicPolyLineResolver (
    dynamicPolylines: DynamicPolyLinesType[]
): [DynamicPolyLine[]] {
      const polyLines: DynamicPolyLine[] = [];
    polyLines.push(
      ...dynamicPolylines.map(i => convertdynamicPolyline(i)).reduce((prev, current) => [...prev, ...current], [])
  );
    return [polyLines];
}


//Deze functie krijgt een array van dynamicPolyLineType (strings) binnen en zet deze om in een array van dynamicPolygons (LatLngExpression)
export function dynamicPolyGonResolver (
  dynamicPolylines: DynamicPolyLinesType[]
): [DynamicPolyGon[]] {
    const polyGons: DynamicPolyGon[] = [];
    polyGons.push(
    ...dynamicPolylines.map(i => convertdynamicPolyGon(i)).reduce((prev, current) => [...prev, ...current], [])
);
  return [polyGons];
}