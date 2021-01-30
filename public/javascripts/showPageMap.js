
mapboxgl.accessToken = mapToken;
const cords = coordinates.split(",");

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: cords, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    })
);

console.log(mapboxgl.showUser)
var marker = new mapboxgl.Marker({
    color: "#0000FF",
    draggable: true
}).setLngLat(cords)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${title}</h3><p>${loc}</p>`
            )
    )
    .addTo(map);