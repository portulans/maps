/**
 * BASELAYERS
 */
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var cassini = L.tileLayer(
    "https://data.geopf.fr/wmts?" +
    "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
    "&STYLE=normal" +
    "&TILEMATRIXSET=PM_6_14" +
    "&FORMAT=image/jpeg"+
    "&LAYER=BNF-IGNF_GEOGRAPHICALGRIDSYSTEMS.CASSINI"+
    "&TILEMATRIX={z}" +
    "&TILEROW={y}" +
    "&TILECOL={x}",
{
    minZoom : 6,
    maxZoom : 14,
    attribution : "IGN/BNF",
    tileSize : 256 // les tuiles du Géooportail font 256x256px
});

var depotmarine1780 = L.tileLayer('https://warper.wmflabs.org/maps/tile/6787/{z}/{x}/{y}.png', {"attribution": "Dépôt des cartes et plans de la Marine"});

var pilotefrancais = L.tileLayer('https://allmaps.xyz/maps/6acb1e0c67682a55/{z}/{x}/{y}.png', {"attribution": "Bibliothèque Nationale de France"});

var etatmajor = L.tileLayer(
    "https://data.geopf.fr/wmts?" +
    "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
    "&STYLE=normal" +
    "&TILEMATRIXSET=PM" +
    "&FORMAT=image/jpeg"+
    "&LAYER=GEOGRAPHICALGRIDSYSTEMS.ETATMAJOR40"+
"&TILEMATRIX={z}" +
    "&TILEROW={y}" +
    "&TILECOL={x}",
{
    minZoom : 0,
    maxZoom : 18,
            attribution : "IGN-F/Geoportail",
    tileSize : 256 // les tuiles du Géooportail font 256x256px
});

var  cartetouristique1929 = L.tileLayer('https://warper.wmflabs.org/maps/tile/7143/{z}/{x}/{y}.png', {
    "attribution": "Carte touristique de l'île d'Ouessant (1929) - Région Bretagne",
})

var ign1950 = L.tileLayer(
        "https://data.geopf.fr/wmts?" +
        "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
        "&STYLE=normal" +
        "&TILEMATRIXSET=PM" +
        "&FORMAT=image/jpeg"+
        "&LAYER=GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN50.1950"+
        "&TILEMATRIX={z}" +
        "&TILEROW={y}" +
        "&TILECOL={x}",
        {
            minZoom : 0,
            maxZoom : 18,
            attribution : "IGN-F/Geoportail",
            transparent: 'true',
            tileSize : 256 // les tuiles du Géooportail font 256x256px
        });

var ign2023 = L.tileLayer(
    "https://data.geopf.fr/wmts?" +
    "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
    "&STYLE=normal" +
    "&TILEMATRIXSET=PM_0_19" +
    "&FORMAT=image/png"+
    "&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2"+
    "&TILEMATRIX={z}" +
    "&TILEROW={y}" +
    "&TILECOL={x}",
    {
        minZoom : 0,
        maxZoom : 19,
        attribution : "IGN",
        tileSize : 256 // les tuiles du Géooportail font 256x256px
    });

///////// Images aériennes //////////

var ignaerial1950 = L.tileLayer(
    "https://data.geopf.fr/wmts?" +
    "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
    "&STYLE=normal" +
    "&TILEMATRIXSET=PM_0_18" +
    "&FORMAT=image/png"+
    "&LAYER=ORTHOIMAGERY.ORTHOPHOTOS.1950-1965"+
    "&TILEMATRIX={z}" +
    "&TILEROW={y}" +
    "&TILECOL={x}",
    {
        minZoom : 0,
        maxZoom : 18,
        attribution : "IGN",
        tileSize : 256 // les tuiles du Géooportail font 256x256px
    });

var ignaerial1965 = L.tileLayer(
    "https://data.geopf.fr/wmts?" +
    "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
    "&STYLE=BDORTHOHISTORIQUE" +
    "&TILEMATRIXSET=PM_3_18" +
    "&FORMAT=image/png"+
    "&LAYER=ORTHOIMAGERY.ORTHOPHOTOS.1965-1980"+
    "&TILEMATRIX={z}" +
    "&TILEROW={y}" +
    "&TILECOL={x}",
    {
        minZoom : 3,
        maxZoom : 18,
        attribution : "IGN",
        tileSize : 256 // les tuiles du Géooportail font 256x256px
    });

var ignaerial2000 = L.tileLayer(
    "https://data.geopf.fr/wmts?" +
    "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
    "&STYLE=normal" +
    "&TILEMATRIXSET=PM_6_18" +
    "&FORMAT=image/png"+
    "&LAYER=ORTHOIMAGERY.ORTHOPHOTOS.COAST2000"+
    "&TILEMATRIX={z}" +
    "&TILEROW={y}" +
    "&TILECOL={x}",
    {
        minZoom : 6,
        maxZoom : 18,
        attribution : "IGN",
    });

var ignaerial2005 = L.tileLayer(
    "https://data.geopf.fr/wmts?" +
    "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
    "&STYLE=normal" +
    "&TILEMATRIXSET=PM_6_18" +
    "&FORMAT=image/jpeg"+
    "&LAYER=ORTHOIMAGERY.ORTHOPHOTOS2000-2005"+
    "&TILEMATRIX={z}" +
    "&TILEROW={y}" +
    "&TILECOL={x}",
    {
        minZoom : 6,
        maxZoom : 18,
        attribution : "IGN",
    });

var ignaerial2009 = L.tileLayer(
    "https://data.geopf.fr/wmts?" +
    "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
    "&STYLE=normal" +
    "&TILEMATRIXSET=PM_6_18" +
    "&FORMAT=image/jpeg"+
    "&LAYER=ORTHOIMAGERY.ORTHOPHOTOS2006-2010"+
    "&TILEMATRIX={z}" +
    "&TILEROW={y}" +
    "&TILECOL={x}",
    {
        minZoom : 6,
        maxZoom : 18,
        attribution : "IGN",
    });

var ignaerial2015 = L.tileLayer(
    "https://data.geopf.fr/wmts?" +
    "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
    "&STYLE=normal" +
    "&TILEMATRIXSET=PM_6_18" +
    "&FORMAT=image/jpeg"+
    "&LAYER=ORTHOIMAGERY.ORTHOPHOTOS2011-2015"+
    "&TILEMATRIX={z}" +
    "&TILEROW={y}" +
    "&TILECOL={x}",
    {
        minZoom : 6,
        maxZoom : 18,
        attribution : "IGN",
    });

var ignaerial2018 = L.tileLayer(
    "https://data.geopf.fr/wmts?" +
    "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
    "&STYLE=normal" +
    "&TILEMATRIXSET=PM_0_18" +
    "&FORMAT=image/jpeg"+
    "&LAYER=ORTHOIMAGERY.ORTHOPHOTOS2018"+
    "&TILEMATRIX={z}" +
    "&TILEROW={y}" +
    "&TILECOL={x}",
    {
        minZoom : 0,
        maxZoom : 18,
        attribution : "IGN",
    });

var ignaerial2023 = L.tileLayer(
    "https://data.geopf.fr/wmts?" +
    "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
    "&STYLE=normal" +
    "&TILEMATRIXSET=PM" +
    "&FORMAT=image/jpeg"+
    "&LAYER=ORTHOIMAGERY.ORTHOPHOTOS.BDORTHO"+
    "&TILEMATRIX={z}" +
    "&TILEROW={y}" +
    "&TILECOL={x}",
    {
        minZoom : 0,
        attribution : "IGN",
        tileSize : 256 // les tuiles du Géooportail font 256x256px
    });

/****** Cadastre ******/
var assemblage = L.tileLayer('https://www.laurentgontier.com/OuessantLayers/PlanAssemblageCadastre/{z}/{x}/{y}.png', {
    minZoom: 9,
    maxZoom: 20,
    tms: false,
    attribution: '&copy; L. Gontier - @AD29'
  });

var assemblageAD29 = L.tileLayer('https://warper.wmflabs.org/maps/tile/7077/{z}/{x}/{y}.png', {
    attribution: '&copy; AD29'
  });

var planparcellaire = L.tileLayer('https://www.laurentgontier.com/CadasOuessant/{z}/{x}/{y}.png', {
  minZoom: 9,
  maxZoom: 20,
  tms: false,
  attribution: '&copy; L. Gontier - @AD29'
});