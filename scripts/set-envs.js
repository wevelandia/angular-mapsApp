// Este archivo se usa para la creación de las variables de entorno.
const { writeFileSync, mkdirSync } = require('fs');

require('dotenv').config();

const targetPath = './src/environments/environment.ts';

const envFileContent = `
  export const environments = {
    mapbox_key: "${ process.env['MAPBOX_KEY'] }",
    otra: "PROPIEDAD",
  }
`;
// Crea la carpeta, si existe la reemplaza
mkdirSync('./src/environments', { recursive: true });
// Se crea el archivo con las variables que se requieren.
writeFileSync( targetPath, envFileContent );
