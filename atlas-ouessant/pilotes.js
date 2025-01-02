const map = L.map('map').setView([48.396288,-4.944447], 10)

const layers = [
    {
        name: 'Cartes actuelles',
        collapsed: false,
        layers: [
            { name: "IGN", layer: ign2023, active: true},
            { name: "OSM", layer: osm, active: false}
        ],
    },
    {
        name: 'Images aériennes',
        collapsed: false,
        layers: [
            { name: "1952", layer: ignaerial1950, active: false, opacityControl: true},
            { name: "1965", layer: ignaerial1965, active: false, opacityControl: true},
            {
                name: 'Images aériennes TEST',
                collapsed: true,
                layers: [
                    { name: "1952", layer: ignaerial1950, active: false, opacityControl: true},
                    { name: "1965", layer: ignaerial1965, active: false, opacityControl: true},
                ],
            },
        ],
    },
];

L.control.advancedLayers(layers, {
    collapsible: true}).addTo(map);