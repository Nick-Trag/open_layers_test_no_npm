const map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([23.9, 38.5]),
        zoom: 6
    })
});

const iconFeature = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([22.996395, 40.601068])),
    name: 'Home'
});

const iconStyle = new ol.style.Style({
    image: new ol.style.Icon({
        anchorOrigin: 'bottom-left',
        anchor: [0.5, 0],
        src: 'map-pin.png'
    })
});

// iconFeature.setStyle(iconStyle);

const home = new ol.layer.Vector({
    source: new ol.source.Vector({
        features: [
            iconFeature
        ]
    }),
    style: iconStyle
});
map.addLayer(home);


// POPUP BEGIN


let popupElement = document.getElementById('popup');

let popup = new ol.Overlay({
    element: popupElement,
    positioning: 'bottom-center',
    stopEvent: false,
    offset: [0, -25]
});

map.addOverlay(popup);

map.on('click', (event) => {
    let feature = map.forEachFeatureAtPixel(event.pixel, (feature) => {
        return feature;
    });

    if (feature) {
        let coordinates = feature.getGeometry().getCoordinates();

        popup.setPosition(coordinates);
        $(popupElement).popover({
            placement: 'top',
            html: true,
            content: feature.get('name')
        });
        $(popupElement).popover('show');
    }
    else {
        $(popupElement).popover('destroy');
    }
});

map.on('pointermove', (event) => {
    if (event.dragging) {
        $(popupElement).popover('destroy');
    }
    else {
        let pixel = map.getEventPixel(event.originalEvent);
        let hit = map.hasFeatureAtPixel(pixel);
        document.getElementById('map').style.cursor = hit ? 'pointer' : '';
    }
});