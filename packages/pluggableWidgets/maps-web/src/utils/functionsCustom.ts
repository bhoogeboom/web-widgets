
import { LatLngExpression } from 'leaflet';


//Deze cuntie zet de coordinaten (string) om in een LatLngExpression die gelezen kan worden door de Leaflet map
export function parseLatLngArrayFromString(input: string): LatLngExpression[][] {
    
    //console.info('Started parsing string to latlong: ' + input)
    
    const trimmedInput = input.trim().replace(/[\s\n]/g, ''); // Remove all whitespace and newline characters
    //console.info('Trrimmed inuts: ' + trimmedInput);
  
    const blocks = trimmedInput.split('],[');


    // Map over blocks and split by ',' to get individual coordinates
    const result = blocks.map(block => {
        //console.info('Block: ' + JSON.stringify(block)); // Properly concatenate the string and JSON
        
        const trimmedBlock = block.trim().replace(/[\[\]\s]/g, '');
        
        //console.info('trimmedBlock: ' + JSON.stringify(trimmedBlock));
      
        return trimmedBlock.split(',').map(coord => parseFloat(coord)) as LatLngExpression;
  });
    
  
  //console.info('Outcome of parsing: ' + JSON.stringify(result))
return result;
}