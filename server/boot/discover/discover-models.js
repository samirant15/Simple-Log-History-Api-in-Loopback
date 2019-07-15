/**
 * Descubre y crea los modelos del proyecto en base a las tablas de la base de dato
 * que esten definidas a ser creadas en este documento.
 */
'use strict';

const loopback = require('loopback');
const promisify = require('util').promisify;
const fs = require('fs');
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const mkdirp = promisify(require('mkdirp'));
const DATASOURCE_NAME = 'logs_api_datasource'; // Este es el nombre del datasource
const dataSourceConfig = require('../datasources.json');
const db = new loopback.DataSource(dataSourceConfig[DATASOURCE_NAME]);

discover().then(
    success => process.exit(),
    error => { console.error('UNHANDLED ERROR:\n', error); process.exit(1); },
);

async function discover() {
    //Esta es la opcion que le permite a dataSource.discoverSchema() buscar las relaciones que hay entre las tablas.
    const options = { relations: true };

    const aplicacionSchemas = await db.discoverSchemas('aplicacion', options);
    const logSchemas = await db.discoverSchemas('log', options);

    await mkdirp('common/models');
    const database = "logs_api_db";

    await writeFile('common/models/aplicacion.json', JSON.stringify(aplicacionSchemas[`${database}.aplicacion`], null, 2));
    await writeFile('common/models/log.json', JSON.stringify(logSchemas[`${database}.log`], null, 2));

    // Exponer los modelos via REST API
    const configJson = await readFile('server/model-config.json', 'utf-8');
    console.log('MODEL CONFIG', configJson);
    const config = JSON.parse(configJson);

    config.aplicacion = { dataSource: DATASOURCE_NAME, public: true };
    config.log = { dataSource: DATASOURCE_NAME, public: true };

    await writeFile(
        'server/model-config.json',
        JSON.stringify(config, null, 2)
    );
}