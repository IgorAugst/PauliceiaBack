const client = require('../database');

function getPlaces(){
    //Results Variable
    const results = [];

    //Build the SQL Query
    const SQL_Query_Select_List = "select a.id as places_id, a.id_street, b.name as name_s, a.number::float, a.first_year::integer as firstyear, a.last_year::integer as lastyear, ST_AsText(a.geom) as geom from streets_pilot_area as b join places_pilot_area2 as a on a.id_street::integer = b.id::integer union select a.id as places_id, a.id_street, b.name as name_s, a.number::float, a.first_year::integer as firstyear, a.last_year::integer as lastyear, ST_AsText(a.geom) as geom from streets_pilot_area as b join places_pilot_area as a on a.id_street::integer = b.id::integer where a.number::float = 0.0 order by number;";

    //Execute SQL Query
    client.query(SQL_Query_Select_List)
        .then(res => {
            const results = res.rows.map(row => {
                if (!row.lastyear) {
                    return {
                        places_id: row.places_id,
                        id_street: row.id_street,
                        street_name: row.name_s,
                        place_name: '',
                        place_number: row.number,
                        place_firstyear: row.firstyear,
                        place_lastyear: 2000,
                        place_geom: row.geom
                    };
                } else {
                    return {
                        places_id: row.places_id,
                        id_street: row.id_street,
                        street_name: row.name_s,
                        place_name: '',
                        place_number: row.number,
                        place_firstyear: row.firstyear,
                        place_lastyear: row.lastyear,
                        place_geom: row.geom
                    };
                }
            });
            return results
        })
        .catch(err => {
            console.error('Error executing query', err.stack);
            return err
        });
    return results;
}

module.exports = getPlaces;