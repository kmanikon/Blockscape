/**
 * Creates a new City object
 * @param {number} size The size of the city (# of tiles wide) 
 * @returns a City object
 */

export function createCity(size) {
  const data = [];

  initialize();
  
  /**
   * Initialize the data array
   */
  function initialize() {
    for (let x = 0; x < size; x++) {
      const column = [];
      for (let y = 0; y < size; y++) {

        const row = [];
        for (let z = 0; z < size; z++) {
          const tile = createTile(x, y, z);
          row.push(tile);
        }
        column.push(row);
      }
      data.push(column);
    }
  }

  

  return {
    size,
    data
  }
}

/**
 * Creates a new tile object
 * @param {number} x The x-coordinate of the tile
 * @param {number} y The y-coordinate of hte tile
 * @returns 
 */
function createTile(x, y, z) {
  return { 
    x, 
    y,
    z,
    terrainId: 'grass',
    //building: undefined
  };
}