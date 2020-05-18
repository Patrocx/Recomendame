//Referencia de conexiones
var conection = require('../lib/conexionbd');

function obtenerPeliculas(req, resp) {

    var sql = "SELECT * FROM pelicula"
    var where = "";
    var pagina = req.query.pagina;
    var cantidad = req.query.cantidad;
    var titulo = req.query.titulo;
    var genero = req.query.genero;
    var anio = req.query.anio;
    var director = req.query.director;
    var orderBy = req.query.columna_orden + ' ' + req.query.tipo_orden;
    var limit = ((parseInt(pagina)-1)* parseInt(cantidad)).toString() + "," + cantidad;

    if (titulo){
        where = where + "titulo Like '%" + titulo + "%'";
    }
    if (genero) {
        if(titulo){
            where = where + " AND ";
        }
        where = where + "genero_id = " + genero;
    }
    if (anio) {
        if (titulo || genero) {
            where = where + " AND ";
        }
        where = where + "anio = " + anio;
    }
    if (director) {
        if (titulo || genero || anio) {
            where = where + " AND ";
        }
        where = where + "director Like '%" + director + "%'"
    }
    if (where) {
        sql = sql + " WHERE " + where;
    }
    sql = sql + " ORDER BY " + orderBy + " LIMIT " + limit;
    
    conection.query(sql, function(error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return resp.status(404).send("Hubo un error en la consulta");
        }
        var peliculas = resultado;
        sql = "SELECT count(*) As total FROM pelicula";
        if (where) {
            sql = sql + " WHERE " + where;
        }
        conection.query(sql, function(error, resultado, fields) {
            if (error) {
                console.log("Hubo un error en la consulta", error.message);
                return resp.status(404).send("Hubo un error en la consulta");
            }
            var response = {
                'peliculas': peliculas,
                'total': resultado[0].total
            };
            resp.send(JSON.stringify(response));
        });
    });
};

function obtenerGeneros(req, resp){

    var sql = 'SELECT * FROM genero';
    conection.query(sql, function(error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return resp.status(404).send("Hubo un error en la consulta");
        }
        var response = {
            'generos': resultado
        };
        resp.send(JSON.stringify(response));
    });
}

function obtenerInformacionPeli(req, resp) {
    idPelicula = req.params.id;
    idPelicula.toString();
    var sql = "SELECT * FROM pelicula JOIN genero ON pelicula.genero_id = genero.id WHERE pelicula.id = "
    sql = sql + idPelicula;
    var pelicula;
    var actores;

    conection.query(sql, function(error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return resp.status(404).send("Hubo un error en la consulta");
        }
        pelicula = resultado[0];

        sqlActores = 'SELECT nombre FROM actor JOIN actor_pelicula ON actor.id = actor_pelicula.actor_id JOIN pelicula ON pelicula.id = actor_pelicula.pelicula_id WHERE pelicula.id = ';
        sqlActores = sqlActores + idPelicula

        conection.query(sqlActores, function(error, resultado, fields) {
            if (error) {
                console.log("Hubo un error en la consulta", error.message);
                return resp.status(404).send("Hubo un error en la consulta");
            }
            
            var response = {
                'pelicula': pelicula,
                'actores': resultado,
            }
            resp.send(JSON.stringify(response));
        });
    });
};

function obtenerRecomendacion(req, resp) {
    var genero = req.query.genero;
    var anio_inicio = req.query.anio_inicio;
    var anio_fin = req.query.anio_fin;
    var puntuacion = req.query.puntuacion;
    console.log(genero + " " + anio_inicio + " " + anio_fin + " " + puntuacion);
    var sql = "SELECT *  FROM pelicula INNER JOIN genero ON pelicula.genero_id = genero.id";
    var where = "";
    if (genero){
        where = where + "genero.nombre = '" + genero + "'";
    }
    if (anio_inicio) {
        if (genero) {
            where = where + " AND ";
        }
        where = where + "anio >= " + anio_inicio;
    }
    if (anio_fin) {
        if (genero || anio_inicio) {
            where = where + " AND ";
        }
        where = where + "anio <= " + anio_fin;
    }
    if (puntuacion) {
        if (genero || anio_inicio || anio_fin) {
            where = where + " AND ";
        }
        where = where + "puntuacion = " + puntuacion;
    }
    if (where) {
        sql = sql + " WHERE " + where;
    }
    console.log(sql);

    conection.query(sql, function(error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return resp.status(404).send("Hubo un error en la consulta");
        }
        var response = {
            'peliculas': resultado
        };
        resp.send(JSON.stringify(response));
    });
};
//Se exportan las funciones creadas
module.exports = {
    obtenerPeliculas : obtenerPeliculas,
    obtenerGeneros : obtenerGeneros,
    obtenerInformacionPeli : obtenerInformacionPeli,
    obtenerRecomendacion : obtenerRecomendacion
}