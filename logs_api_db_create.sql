CREATE DATABASE logs_api_db;

USE logs_api_db;

-- tables
-- Table: aplicacion
CREATE TABLE aplicacion (
    aplicacion_id int NOT NULL AUTO_INCREMENT,
    nombre varchar(64) NOT NULL,
    host varchar(64) NOT NULL,
    fecha date NOT NULL,
    CONSTRAINT aplicacion_pk PRIMARY KEY (aplicacion_id)
);

-- Table: log
CREATE TABLE log (
    log_id int NOT NULL AUTO_INCREMENT,
    user varchar(64) NOT NULL,
    title varchar(64) NOT NULL,
    text longtext NOT NULL,
    comentario varchar(1024) NOT NULL,
    tipo varchar(12) NOT NULL,
    fecha date NOT NULL,
    aplicacion_id int NOT NULL,
    CONSTRAINT log_pk PRIMARY KEY (log_id)
);

-- foreign keys
-- Reference: log_aplicacion (table: log)
ALTER TABLE log ADD CONSTRAINT log_aplicacion FOREIGN KEY log_aplicacion (aplicacion_id)
    REFERENCES aplicacion (aplicacion_id);

-- End of file.

