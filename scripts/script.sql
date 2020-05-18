CREATE DATABASE queveohoy;

USE queveohoy;

CREATE TABLE pelicula (
    id INT NOT NULL AUTO_INCREMENT,
    titulo varchar(100) NOT NULL,
    duracion SMALLINT,
    director varchar(400),
    anio SMALLINT,
    fecha_lanzamiento DATE,
    puntuacion TINYINT,
    poster varchar(300),
    trama varchar(700),
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET= latin1

USE queveohoy;

CREATE TABLE genero (
    id INT NOT NULL AUTO_INCREMENT,
    nombre varchar(30),
    PRIMARY KEY (id)
)

CREATE TABLE actor (
    id INT NOT NULL AUTO_INCREMENT,
    nombre varchar(70),
    PRIMARY KEY (id)
)

CREATE TABLE actor_pelicula (
    id INT NOT NULL AUTO_INCREMENT,
    actor_id INT,
    pelicula_id INT,
    PRIMARY KEY (id)
)