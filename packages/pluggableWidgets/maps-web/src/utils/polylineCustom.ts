import { LatLngExpression } from 'leaflet';
import { DynamicPolyLinesType } from 'typings/MapsProps';
import { DynamicPolyLine } from "../../typings/shared";
import { ObjectItem, ValueStatus } from "mendix";
import { parseLatLngArrayFromString } from "../utils/functionsCustom"

export const polyLineOptions = { color: 'blue' };

//Deze functie zet een object dynamicPolyLine(string) om in een object van dynamicPolyline (LatLngExpression) 
  function fromDatasource(dynamicPolyline: DynamicPolyLinesType, item: ObjectItem): DynamicPolyLine {
    const { title, coordinates, onClickAttribute } = dynamicPolyline;

    const coordinatesString:string = coordinates ? coordinates.get(item).value as string : "";
    //Het omzetten van coordinates string naar LatLngExpression die gebruikt kan worden als input van de leaflet widget
    const coordinatesLatLngExpression: LatLngExpression[][] = parseLatLngArrayFromString(coordinatesString);

    return {
        title: title ? title.get(item).value : "",
        coordinates: coordinatesLatLngExpression,
        onClick: onClickAttribute ? onClickAttribute.get(item).execute : undefined
    };
}

//Deze functie checkt of de attributen al gevuld zijn vanuit Mendix en loopt dan door de array 
function convertdynamicPolyline(dynamicPolyline: DynamicPolyLinesType): DynamicPolyLine[] {
  if (dynamicPolyline.polylineDS && dynamicPolyline.polylineDS.status === ValueStatus.Available) {
    //console.info('dynamicPolyline available: ' + JSON.stringify(dynamicPolyline));
    return dynamicPolyline.polylineDS.items?.map(i => fromDatasource(dynamicPolyline, i)) ?? [];
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