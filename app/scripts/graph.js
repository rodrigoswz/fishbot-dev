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

function GraphAjax(){
  var call =$.ajax({
    url: ipArduino,
    dataType: 'jsonp',
    jsonpCallback: 'dataFB'
  })
  .done(function (data_fb){

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

    firebase.database().ref('graph/').push({temp: table_fb.Temp, hora: horaatual});
    console.log("Enviado para o firebase com sucesso!");
  });
};

firebase.database().ref('graph/').on('child_added', function(snapshot) {
  var fbdata = snapshot.val();
  setGrafico(fbdata.hora, fbdata.temp);
});


//GRAFICO

google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawChart);
	var data;
	var chart;
	var options = {
		title: 'Temperatura',
		curveType: 'function'
	};

function drawChart() {
  data = new google.visualization.DataTable();
  data.addColumn('number', 'Temperatura'); // Implicit data column.
  data.addRow();
}

function setGrafico(horaatual, temperatura){
  data.addRow([hora,temperatura]);
  chart = new google.visualization.LineChart(document.getElementById('chart_div'));
  chart.draw(data, options);
  return false;
}
