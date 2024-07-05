
import { LatLngExpression } from 'leaflet';


//Deze cuntie zet de coordinaten (string) om in een LatLngExpression die gelezen kan worden door de Leaflet map
export function parseLatLngArrayFromString(input: string, inverse: boolean): LatLngExpression[][] {


    
    //console.info('Started parsing string to latlong: ' + input)
    
    const trimmedInput = input.trim().replace(/[\s\n"]/g, ''); // Remove all whitespace, newline characters and "
    //console.info('Trimmed inuts: ' + trimmedInput);
  
    const blocks = trimmedInput.split('],[');


    // Map over blocks and split by ',' to get individual coordinates
    const result = blocks.map(block => {
        //console.info('Block: ' + JSON.stringify(block)); // Properly concatenate the string and JSON
        
        const trimmedBlock = block.trim().replace(/[\[\]\s]/g, '');

        const transformedBlock = transformValuePairs(trimmedBlock, inverse);
        
        //console.info('trimmedBlock: ' + JSON.stringify(trimmedBlock));
      
        return transformedBlock.split(',').map(coord => parseFloat(coord)) as LatLngExpression;
  });
    
  
  //console.info('Outcome of parsing: ' + JSON.stringify(result))
return result;
}




//Deze functie reversed coordinaten
function transformValuePairs(valuePairs: string, inverse: boolean): string {
  if (inverse) {
      // Split the string by comma, reverse the array, and join it back into a string
      return valuePairs.split(',').reverse().join(',');
  } else {
      // Return the original value pairs if inverse is false
      return valuePairs;
  }
}