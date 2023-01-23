// for now manually go to rejseplanen and get the desired stations loaded on the map 
// run the following in the console

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


