var user_icon = '<svg version="1.1" id="irc_users" x="0px" y="0px" width="15" height="15" viewBox="0 0 611.999 612"><g><path fill="darkcyan" d="M416.5,497.25v40.627c0,6.021-4.434,13.02-9.935,15.468c-21.321,9.486-79.477,28.905-198.315,28.905c-118.839,0-176.995-19.419-198.316-28.905C4.433,550.897,0,543.898,0,537.876V497.25c0-60.88,46.353-111.387,105.5-118.15c1.797-0.206,4.462,0.563,5.927,1.624c27.271,19.743,60.658,31.526,96.824,31.526c36.167,0,69.553-11.783,96.824-31.526c1.465-1.061,4.131-1.83,5.928-1.624C370.147,385.863,416.5,436.37,416.5,497.25z M85,246.5c0-68.069,55.181-123.25,123.25-123.25c68.069,0,123.25,55.181,123.25,123.25c0,68.068-55.181,123.25-123.25,123.25C140.181,369.75,85,314.568,85,246.5z M149.935,295.417c5.607,18.538,29.624,32.474,58.409,32.474c28.785,0,52.803-13.936,58.41-32.474H149.935z M586.5,29.75h-204c-14.025,0-25.5,11.475-25.5,25.5v119.255c0,13.885,11.36,25.245,25.245,25.245h0.255v34c0,7.004,7.996,11.003,13.601,6.8l52.133-39.1c1.247-0.935,3.542-1.7,5.1-1.7H586.5c14.025,0,25.499-11.475,25.499-25.5v-119C612,41.225,600.525,29.75,586.5,29.75z"/></g></svg>';
function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}
var uicon = createElementFromHTML(user_icon);
/* Build IRC Elements */
var sif = document.createElement('div');
sif.id = 'ircframe';

var ic = document.createElement('div');
ic.id = 'connect_irc';
ic.classList.add('connect_irc');
ic.innerHTML = 'Nickname:';
var inp = document.createElement('input');
inp.name = 'nickname';
inp.id = 'nickname';
inp.type = 'text';
inp.size = ircConfig.nicklen;
inp.style.color = '#b5b5b5';
ic.appendChild(inp);
var snick = document.createElement('input');
snick.name = 'submit';
snick.id = 'irc_connecting';
snick.type = 'submit';
snick.value = 'Connect!';
snick.onclick = function() { connectWebSocket(); }
ic.appendChild(snick);
sif.appendChild(ic);

var itl = document.createElement('div');
itl.id = 'itools';
itl.classList.add('itools');
var ils = document.createElement('span');
var il = document.createElement('select');
var io = document.createElement('option');
io.value = "";
io.innerHTML = '-- Font Size --';
il.appendChild(io);
il.id = 'ifont';
il.onchange = function() { cf(il.value); }
for(var f = 12;f<=20;f = (f+2)) {
	var io = document.createElement('option');
	io.innerHTML = f + 'px';
	io.value = f + 'px';
	il.appendChild(io);
}
ils.appendChild(il);
itl.appendChild(ils);
var iup = document.createElement('span');
iup.id = 'iup';
iup.innerHTML = '▲';
iup.onclick = function() { iAdjust(iup.id); }
itl.appendChild(iup);
var idown = document.createElement('span');
idown.id = 'idown';
idown.innerHTML = '▼';
idown.onclick = function() { iAdjust(idown.id); }
itl.appendChild(idown);
sif.appendChild(itl);

var itp = document.createElement('div');
itp.id = 'irctopic';
itp.classList.add('irctopic');
var iot = document.createElement('div');
iot.id = 'output';
iot.classList.add('output');
iot.style.height = ircConfig.output_height;
iot.style.color = ircConfig.output_fc;
sif.appendChild(itp);
sif.appendChild(iot);

var ist = document.createElement('div');
ist.id = 'ircstatus';
ist.classList.add('ircstatus');

var inick = document.createElement('div');
inick.id = 's_nick';
var idot = document.createElement('div');
idot.innerHTML = '&middot;';
var ichannel = document.createElement('div');
ichannel.id = 's_channel';
var isvg = document.createElement('div');
isvg.innerHTML = uicon.outerHTML;
var iusers = document.createElement('div');
iusers.id = 's_users';
ist.appendChild(inick);
ist.appendChild(idot);
ist.appendChild(ichannel);
ist.appendChild(isvg);
ist.appendChild(iusers);
sif.appendChild(ist);

var ics = document.createElement('div');
ics.id = 'ircsend';
ics.classList.add('ircsend');
ics.style.display = 'none';
var icsi = document.createElement('input');
icsi.id = 'input';
icsi.name = 'input';
icsi.classList.add('send_text_irc');
icsi.autocomplete = 'off';
icsi.value = "Type your message here";
icsi.style.color = '#b5b5b5';
icsi.style.background = ircConfig.input_bg;
icsi.maxwidth = '500';
ics.appendChild(icsi);
sif.appendChild(ics);
document.getElementById(ircConfig.target).appendChild(sif);
/* End IRC Elements */
var ircConnected = 0;
var currentHistory = 0;
var ihistory = [];
var circ = document.getElementById("irc_connecting");
var su = document.getElementById('s_users');
var sn = document.getElementById('s_nick');
var sc = document.getElementById('s_channel');
var ircSettings = {};
var nickname = '';
var lbrk = '<span class="y">&lt;</span>';
var rbrk = '<span class="y">&gt;</span>';
var lbrku = '<span class="g">&lt;</span>';
var rbrku = '<span class="g">&gt;</span>';
var ii = 0;
var extra_bit = '<span style="color:red; font-weight:bold; letter-spacing:-1px;">.</span><span style="color:white; font-weight:bold; letter-spacing:-2px; margin-right:5px;">-- </span>';
var help_string = '<section style="display:grid;grid-template-columns:auto 1fr"><div>/me</div>' +'<div>Send action command</div><div>/nick</div><div>Change nickname</div><div>/names</div><div>Show online users</div><div>/theme #</div><div>Set a theme to 0 through 7</div><div>/sbar #</div><div>Set a status bar colour to 0 through 7</div><div>/sbox #</div><div>Set an outline colour to 0 through 7</div><div>/scroll #</div><div>Set scrollbar colour to 0 through 7</div><div>/save</div><div>Save theme settings</div><div>Up key</div><div>Scrollback typed history</div><div>Supported Media URLs:</div><div>jpg,png,gif,webp and mp4,ogg,ogv</div></section>';
var ehelp = createElementFromHTML(help_string);
function sbar(n) {
	if((!isNaN(n))&&(n<ircConfig.max_themes)) {
		ist.classList.value = ist.classList.value.replace(/sbar[0-9]/g,'');
		ist.classList.add('sbar'+n);
		ircSettings['sbar'] = n;
	}
}
function sbox(n) {
	if((!isNaN(n))&&(n<ircConfig.max_themes)) {
		var i = document.getElementById(ircConfig.target);
		i.classList.value = i.classList.value.replace(/sbox[0-9]/g,'');
		i.classList.add('sbox'+n);
		ircSettings['sbox'] = n;
	}
}
function oscroll(n) {
	if((!isNaN(n))&&(n<ircConfig.max_themes)) {
		iot.classList.value = iot.classList.value.replace(/oscroll[0-9]/g,'');
		iot.classList.add('oscroll'+n);
		ircSettings['oscroll'] = n;
	}
}
function setTheme(n) {
	if((!isNaN(n))&&(n<ircConfig.max_themes)) {
		writeToScreen('<span>' + extra_bit + ' Setting theme to ' + n + '</span>');
		sbar(n);
		sbox(n);
		oscroll(n);
	}
}
function saveTheme() {
	writeToScreen('<span>' + extra_bit + ' Saving theme settings' + '</span>');
	localStorage.ircSettings = JSON.stringify(ircSettings);
}
function cf(font) {
	iot.style.fontSize = font;
	iot.scrollTop = iot.scrollHeight;
}
icsi.addEventListener('mousedown', function () {
	if(icsi.style.color!='white') {
		icsi.value = "";
		icsi.style.color = "white";
	}
});
ic.addEventListener('click', function () {
	ic.value = "Connecting, please wait";
	ic.style.color = "white";
	ic.disabled = 'disabled';
});
inp.addEventListener('click', function () {
	inp.select();
});
inp.addEventListener('input', function () {
	if(inp.value!='') {
		inp.style.color = '#000';
	} else {
		inp.value = ircConfig.guest_prefix+"Guest_" + Math.floor((Math.random() * 100000) + 1).toString();
		inp.style.color = '#b5b5b5';
		inp.select();
	}
});
window.addEventListener("resize", function(event) {
	console.log(document.body.clientWidth + ' wide by ' + document.body.clientHeight+' high');
	//resizeChat();
	outputHandle();
    iot.scrollTop = iot.scrollHeight;	
});
icsi.addEventListener("keydown", function(event) {
    if (event.keyCode === 13) {
        //document.getElementById("submit_irc").click();
        send();
        currentHistory = ihistory.length-1;
        event.preventDefault();
    }
    if (event.keyCode === 38) {
		if(currentHistory < 0) { 
			currentHistory = ihistory.length; 
			icsi.value = '';
		} else {
			icsi.value = ihistory[currentHistory];
			icsi.setSelectionRange(icsi.value.length,icsi.value.length)
			icsi.focus();
		}
		currentHistory = (currentHistory - 1);
		event.preventDefault();
	}
});
if(!localStorage.nickname) {
	inp.value = ircConfig.guest_prefix+"Guest_" + Math.floor((Math.random() * 100000) + 1).toString();
} else {
	inp.value = localStorage.nickname;
	inp.style.color = '#000';
}
function iAdjust(dir) {
	console.log("iAdjust",dir);
	var iHeight = iot.clientHeight;
	var cHeight = (iHeight + 10);
	switch(dir) {
		case "iup": {
			iot.style.height = (iHeight - 20) + 'px';
			break;
		}
		case "idown": {
			iot.style.height = (iHeight + 10) + 'px';
			break;
		}
	}
	iot.scrollTop = iot.scrollHeight;
}
function resizeChat() {
	var vHeight = window.innerHeight - (itp.clientHeight + ist.clientHeight +  ics.clientHeight);
	console.log("output height", vHeight);
	iot.style.height = vHeight + 'px';
	var wHeight = window.innerHeight;
	var iHeight = wHeight - vHeight;
	iot.style.height = vHeight + 'px';
	console.log("height:",vHeight, wHeight, iHeight);
	iot.scrollTop = iot.scrollHeight;
}
function outputHandle() {
	if(ircConnected != 1) { return; }
	if(ist.clientWidth>256) {
		document.querySelector("#ircstatus > div:nth-child(2)").style.display = 'initial';
		document.querySelector("#ircstatus > div:nth-child(3)").style.display = 'initial';
	} else {
		document.querySelector("#ircstatus > div:nth-child(2)").style.display = 'none';
		document.querySelector("#ircstatus > div:nth-child(3)").style.display = 'none';
	}
}
function escapeHtml(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function connectWebSocket() {
    //var input = document.getElementById("uri");
    //var wsUri = document.getElementById("uri").value;
    websocket = new WebSocket("wss://"+ircConfig.server+":"+ircConfig.port);
    websocket.onopen = function(evt) { onOpen(evt) };
    websocket.onclose = function(evt) { onClose(evt) };
    websocket.onmessage = function(evt) { onMessage(evt) };
    websocket.onerror = function(evt) { onError(evt) };
    nickname = inp.value;
    //document.getElementById('switch_chat').style.display = 'block';
}
function onOpen(evt) {
    ic.style.display = 'none';
    ics.style.display = 'flex';
    iot.style.display = 'block';
    ist.style.display = 'flex';
    itp.style.display = 'block';
    itl.style.display = 'flex';
    if(localStorage.ircSettings) {
		ircSettings = JSON.parse(localStorage.ircSettings);
		sbar(ircSettings['sbar']);
		sbox(ircSettings['sbox']);
		oscroll(ircSettings['oscroll']);
	} else {
		if(ircConfig.default_theme!='') {
			console.log("Loading default theme");
			sbar(ircConfig.default_theme);
			sbox(ircConfig.default_theme);
			oscroll(ircConfig.default_theme);
		}
	}
    iot.scrollTop = iot.scrollHeight;
    writeToScreen("Welcome to " + ircConfig.network + " (IRC Network)");
    if(ircConfig.ircv3 == true) {
		doSend("cap ls 302");
		doSend("cap list");
		doSend("cap req :batch message-tags account-tag server-time draft/chathistory");
	}
    doSend("user "+ircConfig.ident+" * 0 :"+ircConfig.network);
    doSend("nick "+inp.value);
    if(ircConfig.ircv3 == true) {
		doSend("cap end");
	}
    s_nick.innerHTML = inp.value;
	if(inp.value.indexOf(ircConfig.guest_prefix+"Guest_")==-1) {
		localStorage.setItem('nickname',inp.value);
		inp.style.color = '#000';
	}
    ircConnected = 1;
}

function onClose(evt) {
	ircConnected = 0;
    ic.style.display = 'flex';
    ics.style.display = 'none';
    iot.style.display = 'none';
    ist.style.display = 'none';
    itp.style.display = 'none';
    itl.style.display = 'none';
	snick.value = "Connect";
	snick.style.color = "black";
	snick.disabled = '';    
    writeToScreen("DISCONNECTED");
}

function onMessage(evt) {
    rawData = evt.data;
    if (rawData instanceof Blob) {
       var fileReader = new FileReader();
       fileReader.addEventListener("loadend",handleBinaryInput);
       fileReader.readAsText(rawData);
    } else {
       process(rawData);
    }   
}

function handleBinaryInput(event) {
    var fileReader = event.target;
    var raw = fileReader.result;
    process(raw);
}
function process(rawData) {
	var ircv3s, ircv3info;
	if(rawData.substring(0,1) == "@") {
		ircv3s = rawData.split(" ");
		ircv3info = ircv3s[0];
		ircv3s.shift()
		// Now that we have this information you could implement a timestamp on output
		console.log("IRCv3 info", ircv3info);
		rawData = ircv3s.join(" ");
	}
    if (rawData.indexOf("PING") == 0) {
       pongResponse = rawData.replace("PING","PONG");
       websocket.send(pongResponse);
    } else if (rawData.indexOf("001") > -1) {
       doSend("join "+ircConfig.channel);
       if(ircConfig.ircv3 == true) {
		   doSend("CHATHISTORY LATEST "+ircConfig.channel+" * " + ircConfig.playback);
	   }
    } else if (rawData.substring(0,5) == "ERROR") {
        writeToScreen('<span style="color:red;font-weight:bold;">'+rawData.substring(6).replace(/[:]/g,'')+'</span>');
        return;
    }
    console.log("Raw IRC", escapeHtml(rawData));
    var direct = rawData.substring(1,rawData.indexOf(':',1)-1).split(' ');
    var spaced = rawData.substring(1).split(" ");
    var rcvd_nick = direct[0].split('!')[0]
    var msg = rawData.substring(rawData.slice(1).indexOf(':')+2);
    switch(spaced[1]) {
        case "PRIVMSG": {
			console.log("Msg", msg);
			msg = escapeHtml(msg);
			if(msg.indexOf('\x01') == 0) {
				console.log("Raw IRC", escapeHtml(rawData));
				msg = msg.replace(/[\u0001]/g,'').substring(msg.indexOf(' '));
				cparams = escapeHtml(rawData).replace(/[\u0001]/g,'').replace(/[:]/g,'').split(" ");
				console.log("cparams",cparams);
				if(direct[2] != ircConfig.channel) {
					var whoback = direct[0].substring(0,direct[0].indexOf('!'));
					switch(cparams[3]) {
						case "VERSION": {
							doSend('NOTICE ' + whoback + ' :' + String.fromCharCode(1) + 'VERSION ' + 'https://krysti.engineer Websocket IRC v0.2' + String.fromCharCode(1));
							break;
						}
						case "PING": {
							doSend('NOTICE ' + whoback + ' :' + String.fromCharCode(1) + "PING " + cparams[4] + " " + cparams[5] + String.fromCharCode(1));
							break;
						}
						case "TIME": {
							var tret = new Date().toLocaleDateString('en-us', { weekday:"short", year:"numeric", month:"short", day:"numeric", hour:"numeric", minute:"numeric", second:"numeric",timezone:"America/New_York"});
							doSend('NOTICE ' + whoback + ' :' + String.fromCharCode(1) + "TIME " + tret + " EST" + String.fromCharCode(1));
							break;							
						}
					}
				} else {
					writeToScreen('<span style="color:#da00f4;">* '+rcvd_nick+' ' + msg + "</span><br/>");
				}
				break;
			} else {
				writeToScreen('<div>'+lbrk+'<span>'+rcvd_nick+'</span>'+rbrk+'</div><div>' +imageify(msg)+'</div>');
			}
            break;
        }
        case "372": {
            writeToScreen('<span>'+extra_bit+msg.substring(2)+'</span>');
            break;
        }
        case "BATCH": {
			//console.log("This is a batch: " + msg);
			//doSend("BATCH " + spaced[2] + " chathistory " + ircConfig.channel);
			break;
		}
        case "353": {
			var who = "<div class=\"who\" id=\"who\"><div>Users Online: </div>";
			var person = msg.split(" ");
			var p = Number();
			for(p = 0;p<person.length;p++) {
				var staff = '';
				switch(person[p].substring(0,1)) {
					case "~": {
						staff = "color:#ff00f7";
						break;
					}
					case "&": {
						staff = "color:red";
						break;
					}
					case "@": {
						staff = "color:yellow";
						break;
					}
					case "%": {
						staff = "color:cyan";
						break;
					}
					default: {
						staff = "color:white";
					}
				}
				who = who + "<div style='"+staff+"'>"+person[p]+"</div>";
			}
			who = who + "</div>";
			iusers.innerHTML = p;
            writeToScreen(who);
            break;
        }
        case "366": {
			outputHandle();
			break;
		}
        case "332": {
			itp.innerHTML = msg;
			writeToScreen("<span>Topic: "+msg+"</span>");
			break;
		}
		case "333": {
			writeToScreen("<span>"+extra_bit+"Topic set by "+spaced[4] + " at " + Date(spaced[5]).split(" ",6).join(" ") +"</span>");
			break;
		}
        case "NICK": {
			console.log("Raw Nick", escapeHtml(rawData), rcvd_nick, inick.innerHTML, msg, inp.value);
            if((rcvd_nick==sn.innerHTML)&&(msg==inp.value)) {
				writeToScreen('*** YOU changed your name to ' + msg);
				inick.innerHTML = msg;
				nickname = msg;
				if(nickname.indexOf(ircConfig.guest_prefix+"Guest_")==-1) {
					localStorage.setItem('nickname',nickname);
				}
			} else {
				writeToScreen('*** ' + rcvd_nick + ' is now ' + msg);
			}
            break;
        }
        case "KICK": {
			if(direct[3] == inp.value) {
				websocket.close();
			}
			iusers.innerHTML = parseInt(iusers.innerHTML) - 1;
            writeToScreen('*** ' + rcvd_nick + ' kicked ' + direct[3]);
            break;
        }
        case "QUIT": {
			iusers.innerHTML = parseInt(iusers.innerHTML) - 1;
			break;
		}
        case "JOIN": {
			if(rcvd_nick==inp.value) {
				ichannel.innerHTML = spaced[2].substring(1);
			}
			iusers.innerHTML = parseInt(iusers.innerHTML) + 1;
			break;
		}
		case "TOPIC": {
			itp.innerHTML = msg;
			break;
		}
    }
}

function onError(evt) {
    writeToScreen('<span style="color: red;">ERROR:<\/span> ' + evt.data);
}
function doSend(message) {
    var cmd = message.split(' ',1);
    var msg = message.substring(message.indexOf(':')+1);
    msg = escapeHtml(msg);
    if(msg.length==0) { writeToScreen('Error: Write something'); return 0; }
    
    switch(cmd[0]) {
        case "privmsg": {
            writeToScreen('<div>'+lbrku+'<span>'+inp.value+'</span>'+rbrku+'</div><div>' + imageify(msg) + "</div>");
            break;
        }
        case "me": {
            msg = msg.replace(/[\u0001]/g,'').substring(msg.indexOf(' '));
            writeToScreen('<span style="color:#da00f4;">* '+inp.value+' ' + msg + "</span>");
            message = "privmsg" + message.substring(2);
            break;
        }
    }
    websocket.send(message +"\n");
}
function writeToScreen(message) {
    var pre = document.createElement("div");
    //pre.style.wordWrap = "break-word";
    pre.innerHTML = message;
    iot.appendChild(pre);
    iot.scrollTop = iot.scrollHeight;
}
function doSlash(input) {
    var cmd = input.split(' ')[0].toLowerCase();
    var params = input.substring(input.indexOf(' ')+1);
    var parama = input.split(' '); 
    parama = parama.filter( function(el) {
        return el != "";
    });
    console.log("Parama",parama);
    var paramct = parama.length;
    switch(cmd) {
        case "me": {
            if(paramct>1) {
                doSend('me ' + ircConfig.channel + ' :' + String.fromCharCode(1) + 'ACTION ' + params + String.fromCharCode(1));
            } else {
                writeToScreen('<span style="color:red;">ERROR: Please enter an action to convey.</span><br />');
            }
            break;
        }
        case "nick": {
            if(paramct>1) {
                inp.value = params.split(' ')[0];
                doSend('nick ' + params);
            } else {
                writeToScreen('<span style="color:red;">ERROR: Please enter a nickname.</span><br />');
            }
            break;
        }
        case "users":
        case "names": {
			doSend('names ' + ircConfig.channel);
			break;
		}
		case "help": {
			iot.appendChild(ehelp);
			iot.scrollTop = iot.scrollHeight;
			break;
		}
		case "theme": {
			setTheme(parama[1]);
			break;
		}
		case "sbar": {
			sbar(parama[1]);
			writeToScreen('<span>' + extra_bit + ' Setting statusbar to theme ' + parama[1] + '</span>');
			break;
		}
		case "sbox": {
			sbox(parama[1]);
			writeToScreen('<span>'+ extra_bit + ' Setting client outline to theme ' + parama[1] + '</span>');
			break;
		}
		case "scroll": {			
			oscroll(parama[1]);
			writeToScreen('<span>' + extra_bit + ' Setting scrollbar to theme ' + parama[1] + '</span>');
			break;
		}
		case "save": {
			saveTheme();
			break;
		}
    }
    icsi.value = "";
    
}
function send() {
    ihistory.push(input.value);
    if(ihistory.length>20) { ihistory.shift(); }
    if(icsi.value.substring(0,1)=="/") { doSlash(icsi.value.substring(1)); }
    else {
        doSend("privmsg "+ircConfig.channel+" :" + icsi.value);
        icsi.value = "";
    }
}
function hasClass(el, className) {
    return el.classList ? el.classList.contains(className) : new RegExp('\\b' + className + '\\b').test(el.className);
}
function addClass(el, className) {
    if (el.classList) el.classList.add(className);
    else if (!hasClass(el, className)) el.className += ' ' + className;
}
function removeClass(el, className) {
    if (el.classList) el.classList.remove(className);
    else el.className = el.className.replace(new RegExp('\\b' + className + '\\b', 'g'), '');
}
function imageify(text) {
	var stext = text.split(' ');
	for(var l = 0;l<stext.length;l++) {
		if(stext[l].indexOf('http')==-1) { continue; }
		if(stext[l].indexOf('?')!=-1) {
			var ext = stext[l].substring(stext[l].lastIndexOf('.')+1, stext[l].indexOf('?')).toLowerCase();
		} else {
			var ext = stext[l].substring(stext[l].lastIndexOf('.')+1).toLowerCase();
		}
		switch(ext) {
			case "jpg": 
			case "png": 
			case "gif": 
			case "webp": {
				var ice = document.createElement('img');
				ice.id = 'shared_' + ii;
				ice.src = stext[l];
				ice.style.maxWidth = ircConfig.max_image_width;
				stext[l] = ice.outerHTML;
				break;
			}
			case "ogg":
			case "ogv":
			case "mp4": {
				var vww = document.createElement('div');
				vww.style.maxWidth = ircConfig.max_video_width;
				var vw = document.createElement('div');
				vw.classList.add("videoWrapper");
				var vce = document.createElement('video');
				var vse = document.createElement('source');
				vce.width = "200";
				vce.height = "140";
				vce.controls = true;
				vce.volume = 0.5;
				vse.src = stext[l];
				vse.type = "video/mp4";
				vce.appendChild(vse);
				vw.appendChild(vce);
				vww.appendChild(vw);
				stext[l] = vww.outerHTML;
				break;
			}
		}
		var schema = stext[l].substring(0,stext[l].indexOf(':'));
		switch(schema) {
			case "https":
			case "http": {
				var ytcheck = stext[l].substring(stext[l].indexOf('/')+2,stext[l].lastIndexOf('/'));
				if((ytcheck=="youtube.com")||(ytcheck=="www.youtube.com")) {
					var ytparam = stext[l].substring(stext[l].lastIndexOf('?')+1).split('&');
					for(p=0;p<ytparam.length;p++) {
						var pe = ytparam[p].split('=');
						if(!pe[1]) { continue; }
						if(pe[0] == "v") {
							console.log("YT ID", pe[1]);
							var vww = document.createElement('div');
							vww.style.maxWidth = '240px';
							var vw = document.createElement('div');
							vw.classList.add('videoWrapper');
							var iyt = document.createElement('iframe');
							iyt.frameBorder = 0;
							iyt.width = 200;
							iyt.height = 140;
							iyt.src = 'https://www.youtube.com/embed/' + pe[1];
							vw.appendChild(iyt);
							vww.appendChild(vw);
							stext[l] = vww.outerHTML;
						}
					}
					break;
				}
				stext[l] = '<a href = "'+stext[l]+'" target="_new">'+stext[l]+'</a>';
				break;
			}
		}
		if(ice) {
			ice.addEventListener('load', function() {
				console.log("Loaded image ", ii, this.id);
				iot.scrollTop = iot.scrollHeight;
				document.getElementById(this.id).onclick = function() { enlarge_image(this); }
			});
		}
		ii++;
	}
	console.log(stext.join(' '));
	return stext.join(' ');
}
function enlarge_image(img) {
	console.log("Clicked image", img.id);
	if(img.style.maxWidth=='') {
		img.style.maxWidth = ircConfig.max_image_width;
	} else {
		img.style.maxWidth = '';
	}
	iot.scrollTop = iot.scrollHeight;
}
