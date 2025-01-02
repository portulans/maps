var map = L.map('mapviz',{
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topleft'
    },
}).setView([48.46, -5.08], 13);

/**
 * CONTROLS
 */

const layers = [
    {
        name: 'Cartes actuelles',
        collapsed: false,
        layers: [
            { name: "Plan IGN", layer: ign2023, active: true},
            { name: "OpenStreetMap", layer: osm, active: false},
            { name: "OpenSeaMap", layer: seamarks, active: false},
        ],
    },
    {
        name: 'Images aériennes',
        collapsed: true,
        layers: [
            { name: "1952", layer: ignaerial1950, active: false},
            { name: "1975", layer: ignaerial1965, active: false},
            { name: "2000", layer: ignaerial2000, active: false},
            { name: "2005", layer: ignaerial2005, active: false},
            { name: "2009", layer: ignaerial2009, active: false},
            { name: "2015", layer: ignaerial2015, active: false},
            { name: "2018", layer: ignaerial2018, active: false},
            { name: "2021", layer: ignaerial2023, active: false},
        ],
    },
    {
        name: 'Cartes anciennes',
        collapsed: true,
        layers: [
            { name: "Dépôt de la Marine (v. 1780)", layer: depotmarine1780, active: false, opacityControl: true},
            { name:"Carte de Cassini (1786)", layer: cassini, active: false, opacityControl: true},
            { name: "Minute hydrographique (1816)", layer:minuteouessantshom, active: false, opacityControl: true},
            { name: "Pilote français (1822)", layer: pilotefrancais, active: false, opacityControl: true},
            { name: "Etat-Major (1866)", layer: etatmajor, active: false, opacityControl: true},
            { name: "Carte touristique (1929)", layer: cartetouristique1929, active: false, opacityControl: true},
            { name: "Scan historique IGN (1950)", layer: ign1950, active: false, opacityControl: true},
        ],
    },
    {
        name: 'Cadastre ancien (1842)',
        collapsed: true,
        layers: [
            { name: "Tableau d'assemblage (Atlas)", layer: assemblage, active: false, opacityControl: true},
            { name: "Tableau d'assemblage (Minute)", layer: assemblageAD29, active: false, opacityControl: true},
            { name: "Plan parcellaire", layer: planparcellaire, active: false, opacityControl: true},
        ],
    }
];

L.control.advancedLayers(layers, {
    collapsible: true}).addTo(map);

L.control.scale().addTo(map);

L.control.locate({
    setViw:true,
    strings: {
    title: "Me situer sur la carte !"
  }}).addTo(map);