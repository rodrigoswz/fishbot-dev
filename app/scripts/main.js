var ipArduino = "http://192.168.1.100:1000";
var dadosRecebidos;

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

  if(data.Auto == 1){
		$("#automode").prop("checked", true);
  }else{
		$("#automode").prop("checked", false);
  }

  if(data.D1 == 1){
		$("#D1").html('On');
		$("#ptb_av1").prop("checked", true);
    $("#ptb_mp1").prop("checked", true);
  }else{
		$("#D1").html('Off');
		$("#ptb_av1").prop("checked", false);
    $("#ptb_mp1").prop("checked", false);
  }

  if(data.D2 == 1){
		$("#D2").html('On');
    $("#ptb_av2").prop("checked", true);
    $("#ptb_mp2").prop("checked", true);
  }else{
		$("#D2").html('Off');
    $("#ptb_av2").prop("checked", false);
    $("#ptb_mp2").prop("checked", false);
  }

	if(data.D3 == 1){
		$("#D3").html('On');
    $("#ptb_av3").prop("checked", true);
    $("#ptb_mp3").prop("checked", true);
  }else{
		$("#D3").html('Off');
    $("#ptb_av3").prop("checked", false);
    $("#ptb_mp3").prop("checked", false);
  }

  if(data.D4 == 1){
		$("#D4").html('On');
    $("#ptb_av4").prop("checked", true);
    $("#ptb_mp4").prop("checked", true);
  }else{
		$("#D4").html('Off');
    $("#ptb_av4").prop("checked", false);
    $("#ptb_mp4").prop("checked", false);
  }

	if(data.Light > 0){
		$("#LUZ").html('On');
		$("#ptb_luzav").prop("checked", true);
	}else{
		$("#LUZ").html('Off');
		$("#ptb_luzav").prop("checked", false);
	}

	if(data.D1 == 1 && data.D2 == 1 && data.D3 == 1 && data.D4 == 1){
		$("#ptb_all").prop("checked", true);
    $("#btAll").prop("active", true)
		$("#all").html('On');
	}else{
		$("#ptb_all").prop("checked", false);
    $("#btAll").prop("active", false)
		$("#all").html('Off');
	}

  HabilitaModo(data.Auto);
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
  	var statusAtual = $("#l1").html();
    var cmd = "?";
    if (statusAtual == "On") {
        cmd += "LIGHTOFF";
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
  if (dadosRecebidos.Auto == 1){
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

function HabilitaModo(modo){
  if (modo == 1){
    $('#ptb_av1').prop('disabled', true);
    $('#ptb_av2').prop('disabled', true);
    $('#ptb_av3').prop('disabled', true);
    $('#ptb_av4').prop('disabled', true);
    $('#ptb_mp1').prop('disabled', true);
    $('#ptb_mp2').prop('disabled', true);
    $('#ptb_mp3').prop('disabled', true);
    $('#ptb_mp4').prop('disabled', true);
    $('#btAll').prop('disabled', true);
    $('#ptb_all').prop('disabled', true);
  }else{
    $('#ptb_av1').prop('disabled', false);
    $('#ptb_av2').prop('disabled', false);
    $('#ptb_av3').prop('disabled', false);
    $('#ptb_av4').prop('disabled', false);
    $('#ptb_mp1').prop('disabled', false);
    $('#ptb_mp2').prop('disabled', false);
    $('#ptb_mp3').prop('disabled', false);
    $('#ptb_mp4').prop('disabled', false);
    $('#btAll').prop('disabled', false);
    $('#ptb_all').prop('disabled', false);
  }
}
