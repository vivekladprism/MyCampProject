// const MapboxDirections = require('@mapbox/mapbox-gl-directions');

mapboxgl.accessToken = mapToken;
const cords = coordinates.split(",");

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: cords, // starting position [lng, lat]
    zoom: 13 // starting zoom
});

map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    })

);
map.addControl(
    new MapboxDirections({
        accessToken: mapToken,

    }),
    'top-left'
);


console.log(mapboxgl.showUser)
var marker = new mapboxgl.Marker({
    color: "#0000FF",
    draggable: true
}).setLngLat(cords)
    .setPopup(
        new mapboxgl.Popup({ offset: 25, className: "mapboxPopupStyle" })
            .setHTML(
                `<h4"><strong>${title}</strong></h4><p>${loc}</p>`
            )
    )
    .addTo(map);