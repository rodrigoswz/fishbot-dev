// var ipArduino = "http://172.20.5.1:4000"; //ip pra acessar o arduino
var ipArduino = "http://192.168.1.48:4000";

var dadosRecebidos; //variavel q recebe o json

function BuscaDados(){
  var call =$.ajax({
    url: ipArduino,
    dataType: 'jsonp',
    jsonpCallback: 'dataFB'
  })
  .done(function (data){
    console.log(data);
    BindData(data);
    console.log("Busca de dados executada com sucesso!");
  });
}


function openToast(){
  $("#toasttest").open();
  console.log("foi");
}

function BindData(data){

  dadosRecebidos = data;

	$("#ptb_av1").prop("checked", false);
  $("#ptb_av2").prop("checked", false);
  $("#ptb_av3").prop("checked", false);
  $("#ptb_av4").prop("checked", false);
	$("#ptb_mp1").prop("checked", false);
  $("#ptb_mp2").prop("checked", false);
  $("#ptb_mp3").prop("checked", false);
  $("#ptb_mp4").prop("checked", false);
	$("#ptb_luzav").prop("checked", false);
  $("#temp_mp").html(data.temp + "°C");
  $("#temp_av").html(data.temp + "°C");
  $("#horaC").html(data.skd_disp3_hri + "h até " + data.skd_disp3_hrf + "h");
  $("#horaD").html(data.skd_disp4_hri + "h até " + data.skd_disp4_hrf + "h");
  $("#horaL").html(data.skd_luz_hri + "h até " + data.skd_luz_hrf + "h");
  $("#horaF").html(data.skd_feed1 + "h e " + data.skd_feed2 + "h");

  if(data.nivela > 480){
    $("#nivel_mpa").html("Bom");
    $("#nivel_ava").html("Bom");
  }else{
    $("#nivel_mpa").html("Baixo");
    $("#nivel_ava").html("Baixo");
  }

  if(data.nivelr > 480){
    $("#nivel_mpr").html("Bom");
    $("#nivel_avr").html("Bom");
  }else{
    $("#nivel_mpr").html("Baixo");
    $("#nivel_avr").html("Baixo");
  }


  if(data.auto == 1){
		$("#automode").prop("checked", true);
    $("#automode_av").prop("checked", true);
  }else{
		$("#automode").prop("checked", false);
    $("#automode_av").prop("checked", false);
  }

  if(data.disp3 < 1){
		$("#D3").html('On');
		$("#ptb_av3").prop("checked", true);
    $("#ptb_mp3").prop("checked", true);
  }else{
		$("#D3").html('Off');
		$("#ptb_av3").prop("checked", false);
    $("#ptb_mp3").prop("checked", false);
  }

  if(data.disp4 < 1){
		$("#D4").html('On');
    $("#ptb_av4").prop("checked", true);
    $("#ptb_mp4").prop("checked", true);
  }else{
		$("#D4").html('Off');
    $("#ptb_av4").prop("checked", false);
    $("#ptb_mp4").prop("checked", false);
  }

	if(data.disp3 < 1 && data.disp4 < 1){
		$("#ptb_all").prop("checked", true);
    $("#btAll").prop("active", true)
		$("#all").html('On');
	}else{
		$("#ptb_all").prop("checked", false);
    $("#btAll").prop("active", false)
		$("#all").html('Off');
	}

  if(data.luz < 1){
    $("#LUZ").html('Off');
    $("#ptb_luzav").prop("checked", false);
  }else{
    $("#LUZ").html('On');
    $("#ptb_luzav").prop("checked", true);
  }

  $("#horaAr").html(data.hora + ':' + data.minutos + ':' + data.segundos);

  HabilitaModo(data.auto);
}

function EnviarSaida(saida){
  var statusAtual = $("#" + saida).html();
  var cmd = "?" + saida;
  if (statusAtual == "On") {
    cmd += "D";
  }else{
    cmd += "L";
  }
  console.log(cmd);
  Enviar(cmd);
}

function EnviarComandoRGB(saida) {
    var statusAtual = $("#LUZ").html();
    var cmd = "?"
      if (statusAtual == "On") {
          cmd += "LUZOFF";
      }
      else {
          cmd += saida;
      }
    Enviar(cmd);
}

function EnviarComando(saida) {
    Enviar("?" + saida);
}

function EnviarComandoAUTO(){
  if (dadosRecebidos.auto == 1){
    EnviarComando("AUTOD");
  }else{
    EnviarComando("AUTOL");
  }
}

function LigarTodos(saida){
	var statusAtual = $("#all").html();
  var cmd = "?" + saida;
  if (statusAtual == "On") {
    cmd += "OFF";
  }else{
    cmd += "ON";
  }
  console.log(cmd);
  Enviar(cmd);
}

function AlterarHorarioArduino() {

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

	var mescerto = datatotal.getMonth() + 1;
	var cmdhora = "?horaduino" + "y" + fbhora + "yz" + fbmin + "zx" + fbsec + "xc" + datatotal.getDate() + "cw" + mescerto + "wt" + datatotal.getFullYear() + "t";
    Enviar(cmdhora);

}

function Enviar(comando){
  var urlComando = ipArduino + comando;
  console.log(urlComando);

  var call = $.ajax({
    url: urlComando,
    dataType: 'jsonp',
    jsonpCallback: 'dataFB'
  })

  .done(function (data){
    console.log(data);
    BindData(data);
    console.log("Comando enviado com sucesso!");

    if (comando == "?AUTOL" || comando == "?AUTOL"){
      console.log("Buscando dados do modo automático novamente");
      BuscaDados();
    }
  });
}

function AlterarPeriodo(dispositivo) {
    if (dispositivo == "C") {
      tipoAgendamento = "?skdS3_hri";
      var horaInicio = $("#horac").val();
      var horaFim = $("#horafc").val();
      var cmdIni = tipoAgendamento + "I" + "y" + horaInicio + "y" + tipoAgendamento + "F" + "z" + horaFim + "z";
      Enviar(cmdIni);

      BuscaDados();
    }else if(dispositivo == "D"){
      tipoAgendamento = "?skdS4_hri";
      var horaInicio = $("#horad").val();
      var horaFim = $("#horafd").val();
      var cmdIni = tipoAgendamento + "I" + "y" + horaInicio + "y" + tipoAgendamento + "F" + "z" + horaFim + "z";
      Enviar(cmdIni);

      BuscaDados();
    }else if(dispositivo == "L"){
      tipoAgendamento = "?skdLUZ_hri";
      var horaInicio = $("#horal").val();
      var horaFim = $("#horafl").val();
      var cmdIni = tipoAgendamento + "I" + "y" + horaInicio + "y" + tipoAgendamento + "F" + "z" + horaFim + "z";
      Enviar(cmdIni);

      BuscaDados();
    }else if(dispositivo == "F"){
      tipoAgendamento = "?skdFeed1";
      tipoAgendamento2 = "?skdFeed2";
      var hora = $("#horafe").val();
      if(hora == 1) {
        var hora2 = 13;
      }else if(hora == 2) {
        var hora2 = 14;
      }else if(hora == 3) {
        var hora2 = 15;
      }else if(hora == 4) {
        var hora2 = 16;
      }else if(hora == 5) {
        var hora2 = 17;
      }else if(hora == 6) {
        var hora2 = 18;
      }else if(hora == 7) {
        var hora2 = 19;
      }else if(hora == 8) {
        var hora2 = 20;
      }else if(hora == 9) {
        var hora2 = 21;
      }else if(hora == 10) {
        var hora2 = 22;
      }else if(hora == 11) {
        var hora2 = 23;
      }else if(hora == 12) {
        var hora2 = 24;
      }
      var cmdHr = tipoAgendamento + "y" + hora + "y";
      var cmdHr2 = tipoAgendamento2 + "y" + hora2 + "y";
      Enviar(cmdHr);
      Enviar(cmdHr2);

      BuscaDados();
    }
}

function HabilitaModo(modo){
  if (modo == 1){
    $('#ptb_av3').prop('disabled', true);
    $('#ptb_av4').prop('disabled', true);
    $('#ptb_mp3').prop('disabled', true);
    $('#ptb_mp4').prop('disabled', true);
    $('#btAll').prop('disabled', true);
    $('#ptb_all').prop('disabled', true);
  }else{
    $('#ptb_av3').prop('disabled', false);
    $('#ptb_av4').prop('disabled', false);
    $('#ptb_mp3').prop('disabled', false);
    $('#ptb_mp4').prop('disabled', false);
    $('#btAll').prop('disabled', false);
    $('#ptb_all').prop('disabled', false);
  }
}
