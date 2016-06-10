// var ipArduino = "http://172.20.5.1:4000"; //ip pra acessar o arduino
var ipArduino = "http://192.168.1.48:4000";

//configuracao do firebase
var config = {
    apiKey: "AIzaSyA0cj2UyfSaSzbllqLmuvcvKpZSgP25uXo",
    authDomain: "fishbot.firebaseapp.com",
    databaseURL: "https://fishbot.firebaseio.com",
    storageBucket: "",
  };

firebase.initializeApp(config); //inicia firebase
var fb_database = firebase.database();

function FirebaseAjax(){
  var call =$.ajax({
    url: ipArduino,
    dataType: 'jsonp',
    jsonpCallback: 'dataFB'
  })
  .done(function (data_fb){
    var table_fb = data_fb;
    //pegar hora atual
    var datatotal = new Date;
    if (datatotal.getHours() < 10){
      fbhora = "0" + datatotal.getHours();
    }else{
      fbhora = datatotal.getHours();
    }

    if (datatotal.getMinutes() < 10){
      fbmin = "0" + datatotal.getMinutes();
    }else{
      fbmin = datatotal.getMinutes();
    }

    if (datatotal.getSeconds()< 10){
      fbsec = "0" + datatotal.getSeconds();
    }else{
      fbsec = datatotal.getSeconds();
    }

    var horaatual = fbhora + ':' + fbmin + ':' + fbsec;

    firebase.database().ref('data/').push({dia: table_fb.dia, mes: table_fb.mes, ano: table_fb.ano, Auto: table_fb.auto, hora: horaatual, Temp: table_fb.temp, D1: table_fb.disp1, D2: table_fb.disp2, D3: table_fb.disp3,
    D4: table_fb.disp4, Luz: table_fb.luz, Nivel: table_fb.nivela, AgeD3HrI: table_fb.skd_disp3_hri, AgeD3HrF: table_fb.skd_disp3_hrf, AgeD4HrI: table_fb.skd_disp4_hri, AgeD4HrF: table_fb.skd_disp4_hrf,
    AgeFeed1: table_fb.skd_feed1, AgeFeed2: table_fb.skd_feed2, AgeLUZHrI: table_fb.skd_luz_hri, AgeLUZHrF: table_fb.skd_luz_hrf});
    console.log("Enviado para o firebase com sucesso!");
  });
};

firebase.database().ref('data/').on('child_added', function(snapshot) {
  var fbdata = snapshot.val();

    if(fbdata.Auto > 0){
      var autom = 'Ligado';
    }else{
      var autom = 'Desligado';
    }

    var temp = fbdata.Temp;

    if(fbdata.D1 > 0){
      var d1 = 'Ligado';
    }else{
      var d1 = 'Desligado';
    }

    if(fbdata.D2 > 0){
      var d2 = 'Ligado';
    }else{
      var d2 = 'Desligado';
    }

    if(fbdata.D3 > 0){
      var d3 = 'Ligado';
    }else{
      var d3 = 'Desligado';
    }

    if(fbdata.D4 > 0){
      var d4 = 'Ligado';
    }else{
      var d4 = 'Desligado';
    }

    if(fbdata.Luz > 0){
      var luz = 'Ligada';
    }else{
      var luz = 'Desligada';
    }

    if(fbdata.nivelr > 0){
      var lvlr = 'Ajustado';
    }else{
      var lvlr = 'Não ajustado';
    }

    if(fbdata.nivela > 0){
      var lvla = 'Ajustado';
    }else{
      var lvla = 'Não ajustado';
    }

    var datacerta = fbdata.dia + '-' + fbdata.mes + '-' + fbdata.ano;
    var agd3 = fbdata.AgeD3HrI + 'h - ' + fbdata.AgeD3HrF+'h';
    var agd4 = fbdata.AgeD4HrI + 'h - ' + fbdata.AgeD4HrF+'h';
    var agluz = fbdata.AgeLUZHrI + 'h - ' + fbdata.AgeLUZHrF+'h';
    var agfeed = fbdata.AgeFeed1+'h - ' +fbdata.AgeFeed2+'h';
    console.log(datacerta);
    //pegar hora atual

    var metade1 = '<tr><td>'+datacerta+'</td>\n<td>'+fbdata.hora+'</td>\n<td>'+autom+'</td>\n<td>'+temp+'</td>\n<td>'+d1+'</td>\n<td>'+d2+'</td>\n<td>'+d3+'</td>\n<td>'+d4+'</td>\n<td>'+luz+'</td>\n<td>'+lvla+'</td>\n<td>'+lvlr+'</td>';
    var metade2 = '\n<td>'+agd3+'</td>\n<td>'+agluz+'</td>\n<td>'+agfeed+'</td></tr>';
    $('#table_fishbot > tbody:last').append(metade1+metade2);
});
