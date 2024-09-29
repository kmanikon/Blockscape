import * as THREE from 'three';

const geometry = new THREE.BoxGeometry(1, 1, 1);

/*

  revised assets:
    1. player_block
    2. foundation

    createAssetInstance()
*/


// Asset library
const assets = { 

  'player_block': (x, y, z, data) => {
    const material = new THREE.MeshLambertMaterial({ color: data.color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = { id: 'player_block', x, y, z };
    mesh.position.set(x, y, z);
    return mesh;
  },
  'foundation': (x, y, z) => {
    const material = new THREE.MeshLambertMaterial({ color: 0x2C2C2C });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = { id: 'foundation', x, y, z };
    mesh.position.set(x, y, z);
    return mesh;
  },

  
  /*
  'grass': (x, y, z) => {
    const material = new THREE.MeshLambertMaterial({ color: 0x339933 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = { id: 'grass', x, y, z };
    mesh.position.set(x, y, z);
    return mesh;
  },
  'residential': (x, y, z, data) => {
    const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = { id: 'residential', x, y, z };
    mesh.scale.set(1, 1, 1);
    mesh.position.set(x, y, z);
    return mesh;
  },
  'commercial': (x, y, z, data) => {
    const material = new THREE.MeshLambertMaterial({ color: 0x0000ff });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = { id: 'commercial', x, y, z };
    mesh.scale.set(1, 1, 1);
    mesh.position.set(x, y, z);
    return mesh;
  },
  'industrial': (x, y, z, data) => {
    const material = new THREE.MeshLambertMaterial({ color: 0xffff00 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = { id: 'industrial', x, y, z };
    mesh.scale.set(1, 1, 1);
    mesh.position.set(x, y, z);
    return mesh;
  },
  'road': (x, y, z) => {
    const material = new THREE.MeshLambertMaterial({ color: 0x4444440 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = { id: 'road', x, y, z };
    mesh.scale.set(1, 0.1, 1);
    mesh.position.set(x, y, z);
    return mesh;
  },
  'sky': (x, y, z) => {
    const material = new THREE.MeshLambertMaterial({ color: 0x4444440, transparent: false, opacity: 0.5 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = { id: 'sky', x, y, z };
    mesh.scale.set(1, 1, 1);
    mesh.position.set(x, y, z);
    return mesh;
  }
  */
}

/**
 * Creates a new 3D asset
 * @param {string} assetId The id of the asset to create
 * @param {number} x The x-coordinate of the asset
 * @param {number} y The y-coordinate of the asset
 * @param {object} data Additional metadata needed for creating the asset
 * @returns 
 */
export function createAssetInstance(assetId, x, y, z, data) {

  if (assetId === 'player_block' && !data?.color) {
    return undefined
  }
  // If asset exists, configure it and return it
  if (assetId in assets) {
    return assets[assetId](x, y, z, data);
  } else {
    console.warn(`Asset Id ${assetId} is not found.`);
    return undefined;
  }
}