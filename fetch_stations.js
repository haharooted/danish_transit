// for now manually go to rejseplanen and get the desired stations loaded on the map 
// https://www.rejseplanen.dk/bin/help.exe/mn?L=vs_livemap&tpl=fullscreenmap
// run the following in the console

const fs = require('fs');


function parseObject(obj) {
    let newObj = {};

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            let _obj = obj[key];
            for (let _key in _obj) {
                if (_obj.hasOwnProperty(_key)) {
                    let { coord: { lat, lon }, text, type, infotitle, infocontent, imageurl } = _obj[_key];
                    let newLat = (lat.toString().charAt(0) === '4' || lat.toString().charAt(0) === '9') ? lat.substring(0,1) + '.' + lat.substring(1) : lat.substring(0,2) + '.' + lat.substring(2);
                    let newLon = (lon.toString().charAt(0) === '5' || lon.toString().charAt(0) === '6' || lon.toString().charAt(0) === '7' || lon.toString().charAt(0) === '8' || lon.toString().charAt(0) === '9') ? lon.substring(0,1) + '.' + lon.substring(1) : lon.substring(0,2) + '.' + lon.substring(2);
                    newObj[_key] = { lat: newLat, lon: newLon, text, type, infotitle, infocontent, imageurl };
                }
            }
        }
    }
    return newObj;
}

raw = parseObject(Livemap_map.aktiv.obj.map.overlays._object.dsb_tiles.map)
  
copy(raw)

// now you should have the raw object in your clipboard... lets convert it to geojson
function toGeoJSON(obj) {
    var features = [];
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            let _obj = obj[key];
            var feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [parseFloat(_obj.lon), parseFloat(_obj.lat)]
                },
                "properties": {
                    "name": _obj.text,
                    "type_transit": _obj.type,
                    "infotitle": _obj.infotitle,
                    "infocontent": _obj.infocontent,
                    "imageurl": _obj.imageurl
                }
            }
            features.push(feature);
        }
    }
    console.log(features)
    //return geojson.parse(features, {'Point': ['lon', 'lat']});
    return features
}



var parsed = toGeoJSON(raw)
feature_collection = {"type": "FeatureCollection", "features": parsed}


fs.writeFile('transit_stations.geojson', JSON.stringify(feature_collection), err => {
    if (err) {
      console.error(err);
    }
    // file written successfully
  });
