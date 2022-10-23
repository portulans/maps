var bounds = [[-26.5,-25], [1087,1440]];
var empire_t1 = L.imageOverlay('img/Empire_Carte.jpg', bounds);
var empire_t4 = L.imageOverlay('img/Empire_Carte_T4.jpeg', bounds);

var map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -5,
    zoom: 5,
    layers: [empire_t1]
});

var yx = L.latLng;

var xy = function(x, y) {
    if (L.Util.isArray(x)) {    // When doing xy([x, y]);
        return yx(x[1], x[0]);
    }
    return yx(y, x);  // When doing xy(x, y);
};

//Afficher les coordonnées en cosole au click

map.on('click', function(event) {
    console.log(event.latlng);
});

//Hydrologie

var lake_vitam = L.polygon([
    [340, 200],
    [440, 200],
    [440, 260],
    [340, 260]], {
    color: 'white',
    opacity: 0,
    fillColor: 'white',
    fillOpacity: 0,
}).bindTooltip('Lake Vitam');

var vitam_sea = L.polygon([
    [360, -25],
    [360, 20],
    [455, 60],
    [505, 45],
    [550,40],
    [605,25],
    [640,5],
    [644,-25]], {
    color: 'white',
    opacity: 0,
    fillColor: 'white',
    fillOpacity: 0,
}).bindTooltip('Vitam Sea');

var duskan_sea = L.polygon([
    [505, 930],
    [505, 1155],
    [550, 1230],
    [625, 1200],
    [625, 1032]], {
    color: 'white',
    opacity: 0,
    fillColor: 'white',
    fillOpacity: 0,
}).bindTooltip('Duskan Sea');

var aftab_bay = L.polygon([
    [875, 1120],
    [882, 1110],
    [890,1100],
    [915,1085],
    [915,1185]], {
    color: 'white',
    opacity: 0,
    fillColor: 'white',
    fillOpacity: 0,
}).bindTooltip('Aftab Bay');

var fari_bay = L.polygon([
    [1000, 950],
    [990, 925],
    [954,930],
    [885,1000],
    [883,1058],
    [938,1042],
    [957,1066]], {
    color: 'white',
    opacity: 0,
    fillColor: 'white',
    fillOpacity: 0,
}).bindTooltip('Fari Bay');


var nerual_lake = L.polygon([
    [968, 846],
    [970, 858],
    [962,871],
    [955,893],
    [950,888],
    [953,857],
    [956,850],
    [961,864]], {
    color: 'white',
    opacity: 0,
    fillColor: 'white',
    fillOpacity: 0,
}).bindTooltip('Nerual Lake');

var river_dusk = L.polyline([
    [602.6374855041504,1022.8000183105469],
    [610.237491607666,1010.4000244140625],
    [619.8374977111816,1009.2000122070312],
    [631.4375038146973,1002.8000183105469],
    [640.2375068664551,1006.4000244140625],
    [643.0374946594238,1018.8000183105469],
    [641.0374946594238,1027.6000366210938],
    [643.8374977111816,1035.6000366210938],
    [651.8374977111816,1037.6000366210938],
    [657.4375038146973,1034.0000305175781],
    [662.2375068664551,1026.0000305175781],
    [663.4375038146973,1017.6000366210938],
    [662.2375068664551,1005.2000122070312],
    [661.8374977111816,998.8000183105469],
    [660.2375068664551,989.6000213623047],
    [661.8374977111816,981.6000213623047],
    [665.8374977111816,975.2000274658203],
    [670.6374702453613,971.6000213623047],
    [681.0374946594238,967.2000274658203],
    [680.2375068664551,952.4000244140625],
    [684.2375068664551,944.4000244140625],
    [689.4375038146973,940.8000183105469],
    [697.0374946594238,944.4000244140625],
    [701.8374977111816,939.2000274658203],
    [703.0374946594238,932.0000152587891],
    [708.6375007629395,927.2000274658203],
    [711.4375038146973,920.4000244140625],
    [713.8374977111816,911.6000213623047],
    [716.2375068664551,902.0000152587891],
    [721.4375038146973,902.8000183105469],
    [724.6375007629395,909.6000213623047],
    [731.4375038146973,912.0000152587891],
    [738.6375007629395,904.8000183105469],
    [740.6375007629395,909.2000274658203],
    [739.4375038146973,920.0000152587891],
    [741.0374946594238,928.8000183105469],
    [741.0374946594238,936.8000183105469],
    [743.8374977111816,941.6000213623047],
    [747.0374946594238,943.6000213623047],
    [752.6375007629395,944.0000152587891],
    [762.6375007629395,939.6000213623047],
    [770.2374992370605,933.2000274658203],
    [771.8375053405762,922.0000152587891],
    [773.0374870300293,912.0000152587891],
    [777.4375038146973,899.6000213623047],
    [785.8374977111816,892.4000244140625],
    [790.6375007629395,889.6000213623047],
    [794.6375007629395,876.8000183105469],
    [803.4375038146973,875.6000213623047],
    [803.4375038146973,888.8000183105469],
    [808.2374992370605,897.6000213623047],
    [815.4375038146973,895.6000213623047],
    [820.6375045776367,893.6000213623047],
    [823.8375015258789,883.6000213623047],
    [839.4375038146973,868.8000183105469],
    [835.7374954223633,873],
    [841.3375015258789,860.6000061035156],
    [844.9374923706055,844.1999969482422],
    [849.7374954223633,826.6000061035156],
    [857.7374954223633,814.6000061035156],
    [864.9374923706055,806.1999969482422],
    [868.1375045776367,793],
    [872.5374984741211,786.5999984741211],
    [883.3375015258789,782.2000045776367],
    [891.7375030517578,778.2000045776367],
    [893.3375015258789,767.8000030517578],
    [897.7374954223633,759],
    [902.9374847412109,754.5999984741211],
    [912.1374969482422,757],
    [916.5374984741211,755.8000030517578],
    [918.9374847412109,749.8000030517578],
    [922.1374969482422,746.5999984741211],
    [925.7375030517578,752.2000045776367],
    [923.7374954223633,761.4000015258789],
    [923.3375015258789,771.4000015258789],
    [923.3375015258789,780.5999984741211],
    [926.1374969482422,783.4000015258789],
    [931.7375030517578,785],
    [931.3375015258789,794.5999984741211],
    [936.9375,805.8000030517578],
    [942.9375,804.1999969482422],
    [946.9375,793],
    [950.5374984741211,783.4000015258789],
    [950.1374931335449,761.8000030517578],
    [950.9375,748.2000045776367],
    [956.1374931335449,737.4000015258789],
    [973.3375015258789,727],
    [984.9375,714.2000007629395],
    [993.7374992370605,719.7999992370605],
    [996.1374931335449,729.4000015258789],
    [995.7374992370605,739.8000030517578]], {
    color: 'white',
    opacity: 0,
    fillColor: 'white',
    fillOpacity: 0,
}).bindTooltip('River Dusk');

var hydro = L.layerGroup([lake_vitam, vitam_sea, duskan_sea, aftab_bay, fari_bay,nerual_lake,river_dusk]).addTo(map);//Default;;

//Montagnes
var serran_range = L.polygon([
    [220, 380],
    [470, 380],
    [470, 470],
    [220, 490]], {
    color: 'white',
    opacity: 0,
    fillColor: 'white',
    fillOpacity: 0,
}).bindTooltip('Serran Range');

var nevennes_range = L.polygon([
    [1085, 355],
    [900, 445],
    [880, 575],
    [880, 760],
    [1085,700]], {
    color: 'white',
    opacity: 0,
    fillColor: 'white',
    fillOpacity: 0,
}).bindTooltip('Nevennes Range');

var bhuth_badlands = L.polygon([
    [435, 735],
    [440, 965],
    [400, 785]], {
    color: 'white',
    opacity: 0,
    fillColor: 'white',
    fillOpacity: 0,
}).bindTooltip('Bhuth Badlands');

var malikh_escarpment = L.polygon([
    [360, 883],
    [362, 1110],
    [400, 1110],
    [400,898]], {
    color: 'white',
    opacity: 0,
    fillColor: 'white',
    fillOpacity: 0,
}).bindTooltip('Malikh Escarpment');

var montagnes = L.layerGroup([serran_range,nevennes_range,bhuth_badlands,malikh_escarpment]);

// Villes

var antium = L.circle([826, 610], {
    color: 'white',
    opacity: 0,
    fillColor: 'white',
    fillOpacity: 0,
    radius: 50
}).bindTooltip('Antium');

var adisa = L.circle([867, 1092], {
    color: 'white',
    opacity: 0,
    fillColor: 'white',
    fillOpacity: 0,
    radius: 35
}).bindTooltip('Adisa');

var ayo = L.circle([705, 1124], {
    color: 'white',
    opacity: 0,
    fillColor: 'white',
    fillOpacity: 0,
    radius: 35
}).bindTooltip('Ayo');

var blackcliff = L.circle([465, 605], {
    color: 'white',
    opacity: 0,
    fillColor: 'white',
    fillOpacity: 0,
    radius: 20
}).bindTooltip('Blackcliff');

var delphinium = L.circle([880,765], {
    color: 'white',
    opacity: 0,
    fillColor: 'white',
    fillOpacity: 0,
    radius: 25
}).bindTooltip('Delphinium');

var cabane = L.circle([800,820], {
    color: 'white',
    opacity: 0,
    fillColor: 'white',
    fillOpacity: 0,
    radius: 15
}).bindTooltip("Cabane de l'Attrapeur d'Âme");

var sher_jinnaat = L.circle([740,925], {
    color: 'white',
    opacity: 0,
    fillColor: 'white',
    fillOpacity: 0,
    radius: 15
}).bindTooltip('Sher Jinnaat');

var kauf = L.circle([949, 790], {
    color: 'white',
    opacity: 0,
    fillColor: 'white',
    fillOpacity: 0,
    radius: 10
}).bindTooltip('Kauf');

var lacertium = L.circle([80, 1290], {
    color: 'white',
    opacity: 0,
    fillColor: 'white',
    fillOpacity: 0,
    radius: 40
}).bindTooltip('Lacertium');

var tiborum = L.circle([615, 30], {
    color: 'white',
    opacity: 0,
    fillColor: 'white',
    fillOpacity: 0,
    radius: 30
}).bindTooltip('Tiborum');

var serra = L.circle([470, 520], {
    color: 'white',
    opacity: 0,
    fillColor: 'white',
    fillOpacity: 0,
    radius: 30
}).bindTooltip('Serra');

var silas = L.circle([630, 490], {
    color: 'white',
    opacity: 0,
    fillColor: 'white',
    fillOpacity: 0,
    radius: 30
}).bindTooltip('Silas');

var estium = L.circle([665, 675], {
    color: 'white',
    opacity: 0,
    fillColor: 'white',
    fillOpacity: 0,
    radius: 20
}).bindTooltip('Estium');

var estium_garrison = L.circle([615, 665], {
    color: 'white',
    opacity: 0,
    fillColor: 'white',
    fillOpacity: 0,
    radius: 20
}).bindTooltip('Estium Garrison');

var navium = L.circle([230, 545], {
    color: 'white',
    opacity: 0,
    fillColor: 'white',
    fillOpacity: 0,
    radius: 25
}).bindTooltip('Navium');

var karkaus = L.circle([20, 110], {
    color: 'white',
    opacity: 0,
    fillColor: 'white',
    fillOpacity: 0,
    radius: 20
}).bindTooltip('Karkaus');

var raider = L.circle([430, 565], {
    color: 'white',
    opacity: 0,
    fillColor: 'white',
    fillOpacity: 0,
    radius: 20
}).bindTooltip("Raider's Roost");

var nur = L.circle([380, 675], {
    color: 'white',
    opacity: 0,
    fillColor: 'white',
    fillOpacity: 0,
    radius: 30
}).bindTooltip('Nur');

var taib = L.circle([355, 765], {
    color: 'white',
    opacity: 0,
    fillColor: 'white',
    fillOpacity: 0,
    radius: 25
}).bindTooltip('Taib');

var aish = L.circle([320, 945], {
    color: 'white',
    opacity: 0,
    fillColor: 'white',
    fillOpacity: 0,
    radius: 25
}).bindTooltip('Aish');

var sadh = L.circle([145, 970], {
    color: 'white',
    opacity: 0,
    fillColor: 'white',
    fillOpacity: 0,
    radius: 25
}).bindTooltip('Sadh');

var cites = L.layerGroup([antium,adisa,aish,ayo,blackcliff,delphinium,cabane,sher_jinnaat,kauf,karkaus,lacertium,raider,nur,taib,tiborum,sadh,serra,silas,estium,estium_garrison,navium]);

//Gestion des couches

var baseMaps = {
    "Tome 1": empire_t1,
    "Tome 4": empire_t4,
};

var overlayMaps = {
    "Hydrologie":hydro,
    "Montagnes":montagnes,
    "Villes et lieux":cites
};

map.fitBounds(bounds);

L.control.layers(baseMaps, overlayMaps, {
	collapsed:false,
	//sortLayers:false
	}).addTo(map);