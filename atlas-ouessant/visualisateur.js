var map = L.map('mapviz',{
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topleft'
    },
}).setView([48.46, -5.08], 13);

/**
 * CONTROLS
 */


var baseLayers = [
	{
        group: "Cartes actuelles",
        layers: [
        {
            active: true,
            name: "Plan IGN",
            layer: ign2023
        },
        {
            active: false,
            name: "Open Street Map",
            layer: osm
        }
    ]},
    {
        group: "Images aériennes",
        collapsed: true,
        layers: [
        {
            //active:false,
            name: "1952",
            layer:ignaerial1950
        },
        {
            //active:false,
            name: "v. 1975",
            layer:ignaerial1965
        },
        {
            //active:false,
            name: "2000",
            layer:ignaerial2000
        },
        {
            //active:false,
            name: "2005",
            layer:ignaerial2005
        },
        {
            //active:false,
            name: "2009",
            layer:ignaerial2009
        },
        {
            //active:false,
            name: "2015",
            layer:ignaerial2015
        },
        {
            //active:false,
            name: "2018",
            layer:ignaerial2018
        },
        {
            //active:false,
            name: "2021",
            layer:ignaerial2023
        },
    ]
    }
];

var overLayers = [
    {
        group:"Cartes anciennes",
        layers:[
        {
            active:false,
            name: "Dépôt de la Marine (v. 1780)",
            layer: depotmarine1780
        },
        {
            active:false,
            name: "Pilote français (1822)",
            layer: pilotefrancais
        },
        {
            active: false,
            name: "Etat-Major (1866)",
            layer: etatmajor
        },
        {
            active: false,
            name: "Carte touristique (1929)",
            layer:cartetouristique1929
        },
        {
            active: false,
            name: "Scan historique IGN (1950)",
            layer: ign1950
        }]
    },
    {
        group:"Cadastre ancien (1842)",
        collapsed:true,
        layers:[
            {
                active: false,
                name: "Tableau d'assemblage (Atlas)",
                layer: assemblage
            },
            {
                active:false,
                name: "Tableau d'assemblage (Minute)",
                layer: assemblageAD29
            },
            {
                active: false,
                name: "Plan parcellaire",
                layer: planparcellaire
            }
        ]
    }
]

/**
 * ADD TO MAP
 */
map.addControl(
    new L.Control.PanelLayers(baseLayers,overLayers, {
        collapsibleGroups: true,
        collapsed: false
        })
);

L.control.scale().addTo(map);

L.control.locate({
    setViw:true,
    strings: {
    title: "Me situer sur la carte !"
  }}).addTo(map);