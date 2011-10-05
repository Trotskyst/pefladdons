// ==UserScript==
// @name           peflteam
// @namespace      pefl
// @description    team page modification
// @include        http://*pefl.*/*&t=k&j=*
// @version        2.0
// ==/UserScript==

if(typeof (deb) == 'undefined') deb = false
var debnum = 0

var type 	= 'num'
var players  = []
var players2 = []
var teams = []
var team_cur = {}
var divs = []
var m = []
var remember = 0
var db = false
var list = {
	'players':	'id,tid,num,form,morale,fchange,mchange,value,valuech',
	'teams':	'tid,my,tdate,tname,ttask,ttown,sname,ssize,ncode,nname,did,twage,tvalue,mname,tss,pnum,tplace,scbud,screit,tfin',
	'divs':		'did,my,dname,dnum,dprize'
}
var sumP = 0
var sumH = false
var MyNick = ''

var countSostav = 0
var countSk = [0]
var nom = 0
var zp  = 0
var sk  = 0
var age = 0
var pos1 = {'C' :0}
var pos2 = {'GK':0}
var skills = {
	'N': 'pn', 'Имя':'name', 'Поз':'position', 'Фор':'form', 'Мор':'morale', 'сс':'sumskills', 'Сум':'sorting',
	'угл':'Угловые', 'нав':'Навесы', 'дрб':'Дриблинг', 'удр':'Удары', 'штр':'Штрафные', 'рук':'Игра руками',
	'глв':'Игра головой', 'вых':'Игра на выходах', 'лид':'Лидерство', 'длу':'Дальние удары', 'псо':'Перс. опека',
	'ско':'Скорость', 'пас':'Игра в пас', 'впз':'Выбор позиции', 'реа':'Реакция', 'вын':'Выносливость', 'мощ':'Мощь',
	'отб':'Отбор мяча', 'вид':'Видение поля', 'рбт':'Работоспособность', 'тех':'Техника'}

$().ready(function() {
	ff 	= (navigator.userAgent.indexOf('Firefox') != -1 ? true : false)
	cid = parseInt($('td.back4 table:first table td:first').text())
	teams[cid] = {}
	var srch='Вы вошли как '
	MyNick = $('td.back3 td:contains('+srch+')').html().split(',',1)[0].replace(srch,'')

	today = new Date()
	today = check(today.getDate()) + '.'+check(today.getMonth()+1)

	if(UrlValue('l')=='y'){
		//Page for show skills
		EditSkillsPage()
	}else if(UrlValue('n')!=false){
		//Ростер с фильтром(не вся стата показывается)
	}else{
		//Ростер команды
		// Draw right panel and fill data
		var preparedhtml = ''
		preparedhtml += '<table align=center cellspacing="0" cellpadding="0" id="crabglobal"><tr><td id="crabgloballeft" width=200 valign=top></td><td id="crabglobalcenter" valign=top></td><td id="crabglobalright" width=200 valign=top>'
		preparedhtml += '<table id="crabrighttable" bgcolor="#C9F8B7" width=100%><tr><td height=100% valign=top id="crabright"></td></tr></table>'
		preparedhtml += '</td></tr></table>'
		$('body table.border:last').before(preparedhtml)

		$('td.back4 script').remove()
		$('body table.border:has(td.back4)').appendTo( $('td#crabglobalcenter') );
		$('#crabrighttable').addClass('border') 

		preparedhtml  =	'<table width=100%><tr><th colspan=3>Финансовое положение</th></tr>'
		preparedhtml += '<tr><td id="finance1"></td><td id="finance2" colspan=2></td></tr>'
		preparedhtml += '</table><br>'
		preparedhtml += '<a id="players" href="javascript:void(Print(\'players\'))">Игроки</a><br>'
		preparedhtml += '<a id="teams" href="javascript:void(Print(\'teams\'))">Команды</a><br>'
//		preparedhtml += '<a id="divs" href="javascript:void(Print(\'divs\'))">Дивизионы</a><br>'
		$("#crabright").html(preparedhtml)
		EditFinance();

		GetData('teams')
		GetData('players')
//		GetData('divs')

		countSostavMax  = $('tr[id^=tblRosterTr]').length
		countRentMax 	= $('tr[id^=tblRosterRentTr]').length
		GetInfoPagePl()
		GetInfoPageTm()
	}
}, false);

function DBConnect(){
	db = openDatabase("PEFL", "1.0", "PEFL database", 1024*1024*5);
	if(!db) {debug('Open DB PEFL fail.');return false;} 
	else 	{debug('Open DB PEFL ok.')}
}

function GetFinish(type, res){
	debug(type + ' ' + res + ' ')
	m[type] = res;
	//get_players: true
	//get_teams: true
	//pg_players: true
	//pg_teams: true
	if(m.savedatatm==undefined && m.get_teams!=undefined && m.pg_teams && m.pg_players){
		m.savedatatm = true
		ModifyTeams()
	}
	if(m.savedatapl==undefined && m.get_players==false && m.pg_players){
		m.savedatapl = true
		PrintRightInfo()
		SaveData('players')
	}
	if(m.savedatapl==undefined && m.get_players && m.pg_players){
		m.savedatapl = true
		ModifyPlayers()
		PrintRightInfo()
	}
	if(m.savedatadv==undefined && m.pg_teams && !m.get_divs){
		m.savedatadv = true
	}
	if(m.savedatadv==undefined && m.pg_teams && m.get_divs){
		m.savedatadv = true
		PrintDivs()
	}


/**
	if(m.cleartasks==undefined && m.pg_tm!=undefined && (m.db_tm!=undefined || m.gs_tm!=undefined)) {
		m.cleartasks = true
		ClearTasks(cid, team_cur.ttask)
	}
/**/
}

function ModifyTeams(){
	debug('teams:Modify')
	//teams and team_cur
	var tmt = []
	for(var i in team_cur){
		tmt[i] = (team_cur[i] != '' ? team_cur[i] : (teams[cid][i]!=undefined ? teams[cid][i] : ''))
	}
	teams[cid] = tmt
//	debug('tname:'+teams[cid]['tname']+'='+team_cur['tname'])
//	if(teams[cid].tplace>0) $('table.layer1 td.l2:eq(5)').append((' ('+teams[cid].tplace+')').fontsize(1))
	SaveData('teams')
}

function GetInfoPageTm(){
	debug('teams:GetInfoPage ok')
	// Get current club data
	team_cur.tid	= cid
	team_cur.tdate	= today
	team_cur.tname	= $('td.back4 table table:first td:last').text().split(' (')[0]
	team_cur.ttown	= $('td.back4 table table:first td:last').text().split('(')[1].split(',')[0]
	team_cur.ttask	= $('table.layer1 td.l4:eq(3)').text().split(': ',2)[1]
	team_cur.twage	= 0
	team_cur.tvalue	= 0
	team_cur.tss	= 0
	team_cur.age	= 0
	team_cur.tplace	= ''
	team_cur.sname	= $('table.layer1 td.l4:eq(0)').text().split(': ',2)[1]
	team_cur.ssize	= $('table.layer1 td.l4:eq(2)').text().split(': ',2)[1]
	team_cur.ncode	= parseInt(UrlValue('j',$('td.back4 table:first table td:eq(1) a').attr('href')))
	team_cur.nname	= $('td.back4 table:first table td:eq(3) font').text().split(', ')[1].split(')')[0]
	team_cur.did	= ''
	team_cur.mname	= $('td.back4 table table:eq(1) table:first td:first span').text()
	team_cur.mid	= parseInt(UrlValue('id',$('td.back4 table table:eq(1) table:first td:first a').attr('href')))
	team_cur.pnum	= countSostavMax
	team_cur.scbud	= $('table.layer1 td.l2:eq(1)').text().split('(',2)[1].split(')')[0]
	team_cur.screit	= $('table.layer1 td.l2:eq(1)').text().split(': ',2)[1].split(' (')[0]
	team_cur.my		= (team_cur.mname == MyNick ? true : false)
	GetFinish('pg_teams', true)
}

function Print(dataname){
	var head = list[dataname].split(',')
	var data = []
	switch (dataname){
		case 'players': data = players;	break
		case 'teams': 	data = teams;	break
		case 'divs'	: 	data = divs;	break
		default: return false
	}
	var text = '<table width=100% border=1>'
	text+= '<tr>'
	for(j in head) text += '<th>'+head[j]+'</th>'
	text+= '</tr>'
	for(i in data){
		text += '<tr>'
		for(j in head) text += '<td>' + (data[i][head[j]]!=undefined ? data[i][head[j]] : '_')  + '</td>'
		text += '</tr>'
	}
	text += '</table>'
	$('td.back4').prepend(text)
}

function SaveData(dataname){
	debug(dataname+':SaveData')
	if(UrlValue('h')==1 || (dataname=='players' && UrlValue('j')!=99999)) return false

	var data = []
	var head = list[dataname].split(',')
	switch (dataname){
		case 'players':	data = players;	break
		case 'teams': 	data = teams;	break
//		case 'divs'	: 	data = divs;	break
		default: return false
	}
	if(ff) {
		var text = ''
		for (var i in data) {
			if(typeof(data[i])!='undefined') {
				var dti = data[i]
				text += dti[head[0]]
				for(var j in head) text += ':' + (dti[head[j]]==undefined ? '' : dti[head[j]])
				text += ','
			}
		}
		globalStorage[location.hostname][dataname] = text
	}else{
		db.transaction(function(tx) {
			tx.executeSql("DROP TABLE IF EXISTS "+dataname,[],
				function(tx, result){},
				function(tx, error) {debug(dataname+':drop error:' + error.message)}
			);                                           
			tx.executeSql("CREATE TABLE IF NOT EXISTS "+dataname+" ("+list[dataname]+")", [],
				function(tx, result){debug(dataname+':create ok')},
				function(tx, error) {debug(error.message)}
			);
			for(var i in data) {
				var dti = data[i]
				var x1 = []
				var x2 = []
				var x3 = []
				for(var j in head){
					x1.push(head[j])
					x2.push('?')
					x3.push(dti[head[j]])
				}
//				debug(dataname+':s'+x3['0']+'_'+x3['1'])
				tx.executeSql("INSERT INTO "+dataname+" ("+x1+") values("+x2+")", x3,
					function(tx, result){},
					function(tx, error) {debug(dataname+':insert('+i+') error:'+error.message)
				});
			}
		});
	}
}

function GetData(dataname){
	debug(dataname+':GetData')
	var data = []
	var head = list[dataname].split(',')
	switch (dataname){
		case 'players': data = players2;break
		case 'teams': 	data = teams;	break
		case 'divs'	: 	data = divs;	break
		default: return false
	}
	if(ff) {
		var text1 = globalStorage[location.hostname][dataname]
		if (text1 != undefined){
			var ttext = String(text1).split(',')
			for (i in ttext) {
				var x = ttext[i].split(':')
				var curt = []
				var num = 0
				for(j in head){
					curt[head[j]] = (x[num]!=undefined ? x[num] : '')
					num++
				}
				data[curt[head[0]]] = []
				if(curt[head[0]]!=undefined) data[curt.id] = curt
			}
			GetFinish('get_'+dataname, true)
		} else {
			GetFinish('get_'+dataname, false)
		}			
	}else{
		if(!db) DBConnect()
		db.transaction(function(tx) {
//			tx.executeSql("DROP TABLE IF EXISTS players")
//			tx.executeSql("DROP TABLE IF EXISTS teams")
//			tx.executeSql("DROP TABLE IF EXISTS divs")
			tx.executeSql("SELECT * FROM "+dataname, [],
				function(tx, result){
					debug(dataname+':Select ok')
					for(var i = 0; i < result.rows.length; i++) {
						var row = result.rows.item(i)
						var id = row[head[0]]
						data[id] = {}
						for(j in row) data[id][j] = row[j]
//						debug(dataname+':g'+id+':'+data[id].my)
					}
					GetFinish('get_'+dataname,true)
				},
				function(tx, error){
					debug(error.message)
					GetFinish('get_'+dataname, false)
				}
			)
		})
	}
}

function GetInfoPagePl(){
	$('tr[id^=tblRosterTr]').each(function(i,val){
		var purl= $(val).find('a[trp="1"]').attr('href')
		var pid = UrlValue('id',purl)
		var pn	= parseInt($(val).find('td:first').text())
		players[pid] = {}
		players[pid].pn 	= pn
		players[pid].id 	= pid
		players[pid].tid 	= cid
		players[pid].num 	= i
		players[pid].hash	= UrlValue('z',$(val).find('td:eq(1) a:first').attr('href'))
		players[pid].name	= $(val).find('td:eq(1) a').html()
								.split('<img')[0]
								.replace('(*)','')
								.replace('<i>','')
								.replace('</i>','')
		players[pid].nid	= $(val).find('td:eq(2) img').attr('src')
								.split('/')[4]
								.split('.')[0]
		players[pid].age	= parseInt($(val).find('td:eq(3)').html())
		players[pid].morale	= parseInt($(val).find('td:eq(4)').html())
		players[pid].mchange= 0
		players[pid].form	= parseInt($(val).find('td:eq(5)').html())
		debug(players[pid].id+':'+players[pid].form)
		players[pid].fchange= 0
		players[pid].position= $(val).find('td:eq(11)').html()

		$('td.back4').append('<table id=pl'+pid+' style="display: none;"><tr><td id=pl'+pid+'></td></tr></table>')
		$('td#pl'+pid).load(purl+' center:first', function(){
			GetPl(pid);
		})
	})
	debug('players:GetPage ok')
}

function ModifyPlayers(){
	debug('players:Modify go')
	// Check for update
	for(i in players) {
		var pl = players[i]
//		debug(pl.id)//+':'+players2[pl.id].id)
		if(typeof(players2[pl.id])!='undefined'){
			var pl2 = players2[pl.id]
			if (remember != 1 && (pl.morale != pl2.morale || pl.form != pl2.form)){
				remember = 1
				debug('players:NeedSave '+pl.id+':'+pl.morale +'/'+pl2.morale+':'+pl.form+'/'+pl2.form)
				break;
			}
		}
	}
	// Calculate
	for(i in players) {
		var pl = players[i]
		if(typeof(players2[pl.id])!='undefined'){
			var pl2 = players2[pl.id]
			if (remember == 1){
				players[i]['mchange'] = pl.morale - pl2.morale
				players[i]['fchange'] = pl.form   - pl2.form
			} else {
				players[i]['mchange'] = pl2.mchange
				players[i]['fchange'] = pl2.fchange
			}
			//debug('plCalc '+pl.id+':'+pl.form+'/'+pl.fchange)
		}
	}
	// Update page
	debug('players:UpdatePage ')
	for(i in players) {
		var pl = players[i]
		$('table#tblRoster tr#tblRosterTr'		+ pl.pn + ' td:eq(4)').append(ShowChange(pl['mchange']))
		$('table#tblRoster tr#tblRosterTr'		+ pl.pn + ' td:eq(5)').append(ShowChange(pl['fchange']))
		$('table#tblRoster tr#tblRosterRentTr'	+ pl.pn + ' td:eq(4)').append(ShowChange(pl['mchange']))
		$('table#tblRoster tr#tblRosterRentTr'	+ pl.pn + ' td:eq(5)').append(ShowChange(pl['fchange']))
	}
	// Save if not team21
	if (remember==1) SaveData('players')
}

function ClearTasks(club_id, club_zad){
    // Delete all task if we have new task - it's new season!
	debug('ClearTasks ok')
	if (teams[club_id] != undefined && teams[club_id].ttask != undefined && teams[club_id].ttask != club_zad){
		for (i in teams) teams[i].ttask = null
		debug('Задачи очищены.')
	}
}

function GetPl(pid){
	// get player skills with number pid
	var skillsum = 0
	var skillchange = []
	$('td#pl'+pid+' table:first td:even').each(function(){
		var skillarrow = ''
		var skillname = $(this).html();
		var skillvalue = parseInt($(this).next().html().replace('<b>',''));
		if ($(this).next().find('img').attr('src') != undefined){
			skillarrow = '.' + $(this).next().find('img').attr('src').split('/')[3].split('.')[0] 		// "system/img/g/a0n.gif"
		}
		skillsum += skillvalue;
		players[pid][skillname] = skillvalue + skillarrow

		if($(this).next().html().indexOf('*') != -1) skillchange.push(skillname)
	})
	players[pid].sumskills	= skillsum
	players[pid].sorting	= skillsum
	players[pid].skchange	= (skillchange[0] != undefined ? skillchange.join(',') : '')

	// get player header info
	$('td#pl'+pid+' table').remove()
	var head = $('td#pl'+pid+' b:first').html()
	players[pid].rent		= (head.indexOf('в аренде из клуба') != -1 ? true : false)
	players[pid].natfull 	= head.split(' (матчей')[0].split(', ')[1]
	players[pid].value		= parseInt(head.split('Номинал: ')[1].split(',000$')[0].replace(/,/g,''))*1000
	players[pid].valuech	= 0
	players[pid].contract 	= parseInt(head.split('Контракт: ')[1])
	players[pid].wage 		= parseInt(head.split('г., ')[1].split('$')[0].replace(/,/g,''))

	team_cur.twage	+= players[pid].wage
//	debug('twage:'+team_cur.twage)

	team_cur.tvalue	+= players[pid].value/1000
	team_cur.tss	+= players[pid].sumskills
	team_cur.age	+= players[pid].age
	$('table#pl'+pid).remove()
	//debug('GetPl ok: '+pid+' '+players[pid].id)
	Ready()
}
function PrintRightInfo(){
	debug('PrintRightInfo go')
	if(UrlValue('h')==1) return false

	// print link to skills page
	if($('td.back4 table table:eq(1) tr:last td:last').html().indexOf('Скиллы')==-1){
		$('td.back4 table table:eq(1) tr:last td:last').append('| <a id="tskills" href="javascript:void(ShowSkills(1))"><span id="tskills">Скиллы игроков</span></a>&nbsp;')
	}else{
		$('#crabright').append('<br><a href="javascript:void(ShowSkills(1))"><b>Скиллы игроков</b></a><br><br>')
	}

	// print to right menu
	var thtml = ''
	thtml += '<tr><td id="os" colspan=3 align=center><br><b>Основной состав</b>'
//	if(sumvaluechange != 0) 
	thtml += '&nbsp;<a id="os" href="javascript:void(ForgotPlValueCh())">'+('[x]').fontsize(1)+'<a>'
	thtml += '</td></tr>'
	thtml += '<tr id="osnom"><th align=left width=50%><a href="javascript:void(ShowPlayersValue())">номиналы</a>:</th><th align=right>'
	thtml += ShowValueFormat(team_cur.tvalue)+'т'
	thtml += '</th><td width=10%>'
//	if(sumvaluechange != 0) thtml += '&nbsp;'+ShowChange(sumvaluechange)
	thtml += '</td></tr>'
	thtml += '<tr id="oszp"><th align=left><a href="javascript:void(ShowPlayersZp())">зарплаты</a>:</th><th align=right>'
	thtml += ShowValueFormat(team_cur.twage)+'&nbsp;'
	thtml += '</th></tr>'
	thtml += '<tr id="osskills"><td><b><a href="javascript:void(ShowPlayersSkillChange())">скилы</a></b>'+('&nbsp;(срд)').fontsize(1)+'<b>:</b></td><th align=right>'
	thtml += (team_cur.tss/countSostavMax).toFixed(2) + '&nbsp;'
	thtml += '</th><td></td></tr>'
	thtml += '<tr id="osage"><td><b><a href="javascript:void(ShowPlayersAge())">возраст</a></b>'+('&nbsp;(срд)').fontsize(1)+'<b>:</b></td><th align=right>'
	thtml += (team_cur.age/countSostavMax).toFixed(2) + '&nbsp;'
	thtml += '</th><td></td></tr>'

	$('#crabright table:first').append(thtml)
}

function Ready(){
	countSostav++
	if(countSostav==countSostavMax){
		GetFinish('pg_players', true)
/**
		if(team.wage > 0){ // if VIP

			var sumvaluechange = 0

			if(UrlValue('j')==99999){
				// Players value
				var text2 = '' //GetStorageData('playersvalue')
				if(ff)	text2 = String(globalStorage[location.hostname]['playersvalue'])
				else	text2 = sessionStorage['playersvalue']

				if (text2 != undefined){
					var t1 = text2.split(',')
					var sumvalueold = 0
					for(j in t1){
						var t2 = t1[j].split(':')
						pls[t2[0]] = {}
						pls[t2[0]].value = parseInt(t2[1])*1000
						pls[t2[0]].valuech = parseInt(t2[2])*1000
						sumvalueold += (isNaN(parseInt(t2[1])) ? 0 : parseInt(t2[1]))
					}
					// Update current
					var sumvaluenew = 0
					for (i in players) {
						var pid = players[i].id
						if(pls[pid] != undefined){
							if(players[i].value != pls[pid].value){
								players[i].valuech = players[i].value - pls[pid].value
							}else{
								players[i].valuech = pls[pid].valuech
							}
						} else {
							players[i].valuech = 0
						}
						sumvaluechange += players[i].valuech/1000
						sumvaluenew += players[i].value/1000
					}
					if(sumvaluenew != sumvalueold){
						sumvaluechange = sumvaluenew - sumvalueold
					}
				}
			}

		/**/
	}
}

function EditFinance(){
	debug('EditFinance go')
	var txt = $('table.layer1 td.l4:eq(1)').text().split(': ')[1]
	var txt2 = ''
	switch (txt){
		case 'банкрот': 				 txt2 += 'меньше 0'		;break;
		case 'жалкое': 					 txt2 += '1$т-200$т'	;break;
		case 'бедное': 					 txt2 += '200$т-500$т';break;
		case 'среднее': 				 txt2 += '500$т-1$м'	;break;
		case 'нормальное': 				 txt2 += '1$м-3$м'	;break;
		case 'благополучное': 			 txt2 += '3$м-6$м'	;break;
		case 'отличное': 				 txt2 += '6$м-15$м'	;break;
		case 'богатое': 				 txt2 += '15$м-40$м'	;break;
		case 'некуда деньги девать :-)': txt2 += 'больше 40$м'	;break;
		default:
			var fin = parseInt(txt.replace(/,/g,'').replace('$',''))
			if 		(fin >  40000000)	{txt = 'некуда деньги девать';	txt2 = 'больше 40$м'}
			else if (fin >= 15000000)	{txt = 'богатое';				txt2 = '15$м-40$м'}
			else if (fin >=  6000000) 	{txt = 'отличное';				txt2 = '6$м-15$м'}
			else if (fin >=  3000000) 	{txt = 'благополучное';			txt2 = '3$м-6$м'}
			else if (fin >=  1000000) 	{txt = 'нормальное';			txt2 = '1$м-3$м'}
			else if (fin >=   500000) 	{txt = 'среднее';				txt2 = '500$т-1$м'}
			else if (fin >=   200000) 	{txt = 'бедное';				txt2 = '200$т-500$т'}
			else if (fin >=		   0)	{txt = 'жалкое';				txt2 = '1$т-200$т'}
			else if (fin < 		   0)	{txt = 'банкрот';				txt2 = 'меньше 0'}
	}
	$('#finance1').html(txt)
	$('#finance2').html(txt2)
	team_cur.tfin = txt2
}

function EditSkillsPage(){
	debug('EditSkillsPage')
	$('table#tblRostSkillsFilter td:first').prepend('<a href="javascript:void(ShowSkillsY())">Стрелки</a> | ')
	$('table#tblRostSkills')
		.attr('width','886')
		.find('td:contains("*")').attr('bgcolor','white').end()
		.find('img').attr('height','10').end()
		.find('tr').each(function(){
			$(this).attr('height','20').find('td:eq(1)').html(
				$(this).find('td:eq(1)').html().replace('<br>','&nbsp;')
			)
		})
} 

function ShowSkillsY() {
	switch (type){
		case 'num': 
			$('table#tblRostSkills img').attr('height','10').show();
			type = 'img'; break
		case 'img':
			$('table#tblRostSkills img').hide();
			type = 'num';break
		default:
			debug('Error ShowSkillsY: unknown type:<'+type+'>')
	}
	$('table#tblRostSkills tr').each(function(){
		$(this).find('td:eq(1)').html(
			$(this).find('td:eq(1)').html().replace('<br>','&nbsp;')
		)
	})
}

function ShowPlayersValue(){
	if(nom==0) {
		nom = 1
		var nomtext = ''
		var pls = players.sort(sValue)
		for(i in pls) {
			var bgcolor = ''
			if(i<16) bgcolor = ' bgcolor=#A3DE8F'
			if(i<5)  bgcolor = ' bgcolor=white'
			nomtext += '<tr id="nom"'+bgcolor+'>'
			nomtext += '<td'+(pls[i].rent ? ' bgcolor=#a3de0f' : '')+'>' + ShowShortName(pls[i].name).fontsize(1) + '</td>'
			nomtext += '<td align=right>' + (ShowValueFormat(pls[i].value/1000) + 'т').fontsize(1) + '</td>'
			nomtext += (pls[i].valuech==0 ? '' : '<td>&nbsp;'+ShowChange(pls[i].valuech/1000)+'</td>')
			nomtext += '</tr>'
		}
		$('#osnom').after(nomtext + '<tr id="nom"><td>&nbsp;</td></tr>')
	} else {
		nom = 0
		$('tr#nom').remove()
	}
}

function ShowPlayersZp(){
	if(zp==0) {
		zp = 1
		var text = ''
		var pls = players.sort(sZp)
		for(i in pls) {
			var bgcolor = ''
			if(pls[i].contract==1) bgcolor = ' bgcolor=#FF9966' //red
			if(pls[i].contract==2) bgcolor = ' bgcolor=#FCE93B' //yellow
			if(pls[i].contract==5) bgcolor = ' bgcolor=#A3DE8F' //green
			text += '<tr id="zp">'
			text += '<td'+(pls[i].rent ? ' bgcolor=#a3de0f' : '')+'>' + ShowShortName(pls[i].name).fontsize(1) + '</td>'
			text += '<td align=right>' + (ShowValueFormat(pls[i].wage) + '&nbsp;').fontsize(1) + '</td>'
			text += '<td'+bgcolor+'>' + (pls[i].contract + (pls[i].contract == 5 ? 'л.' : 'г.')).fontsize(1) + '</td>'
			text += '</tr>'
		}
		$('#oszp').after(text + '<tr id="zp"><td>&nbsp;</td></tr>')
	} else {
		zp = 0
		$('tr#zp').remove()
	}
}

function ShowPlayersAge(){
	if(age==0) {
		age = 1
		var text = ''
		var pls = players.sort(sAge)
		for(i in pls) {
			text += '<tr id="age"'+(pls[i].age<30 && pls[i].age>21 ? '' : ' bgcolor=#A3DE8F')+'>'
			text += '<td'+(pls[i].rent ? ' bgcolor=#a3de0f' : '')+'>' + ShowShortName(pls[i].name).fontsize(1) + '</td>'
			text += '<td align=right>' + (pls[i].age+'&nbsp;').fontsize(1) + '</td>'
			text += '</tr>'
		}
		$('#osage').after(text + '<tr id="age"><td>&nbsp;</td></tr>')
	} else {
		age = 0
		$('tr#age').remove()
	}
}

function ShowPlayersSkillChange(){
	if(sk==0) {
		sk = 1
		var text = ''
		var pls = players.sort(sSkills)
		for(i in pls) {
			text += '<tr id="skills">'
			text += '<td'+(pls[i].rent ? ' bgcolor=#a3de0f' : '')+'>' + ShowShortName(pls[i].name).fontsize(1) + '</td>'
			text += '<td align=right>' + (pls[i].sumskills + '&nbsp;').fontsize(1) + '</td>'
//			text += '<td>' + (pls[i].contract + (pls[i].contract == 5 ? 'л.' : 'г.')).fontsize(1) + '</td>'
			if(pls[i].skchange != '') {
				var skillchange = pls[i].skchange.split(',')
				for(j in skillchange) {
					text += '<tr id="skills"><td align=right colspan=2><i>'+(skillchange[j] + '&nbsp;').fontsize(1)
					text += (pls[i][skillchange[j]].split('.')[0] + '&nbsp;').fontsize(1) +'</i></td>'
					if(pls[i][skillchange[j]].split('.')[1] != undefined) {
						text += '<td><img height="10" src="system/img/g/'+pls[i][skillchange[j]].split('.')[1]+'.gif"></img></td>'
					}
					text += '</tr>'
				}
			}
			text += '</tr>'
		}
		$('#osskills').after(text + '<tr id="skills"><td>&nbsp;</td></tr>')
	} else {
		sk = 0
		$('tr#skills').remove()
	}
}

function ShowSkills(param){
	debug('ShowSkills param: '+param)
	if(param == 1){
		$('table[background]:eq(1)').hide()
		$('td#crabglobalright').html('')
		$('table#tblRoster')
			.attr('id','tblRostSkills')
			.attr('width','886')
			.attr('bgcolor','BFDEB3')

		var filter = ''
		filter += '<tr align=center><th width=10%></th><th id="L" width=15%><a href="javascript:void(Filter(1,\'L\'))">L</a></th><th width=15%></th><th id="C" width=15%><a href="javascript:void(Filter(1,\'C\'))">C</a></th><th width=15%></th><th id="R" width=15%><a href="javascript:void(Filter(1,\'R\'))">R</a></th></tr>'
		filter += '<tr align=center><th id="GK"><a href="javascript:void(Filter(2,\'GK\'))">GK</a></th><th></th><th></th>	<td bgcolor=a3de8f id="GK">&nbsp;</td>		<th></th>	<th></th></tr>'
		filter += '<tr align=center><th id="SW"><a href="javascript:void(Filter(2,\'SW\'))">SW</a></th><th></th><th></th>	<td bgcolor=a3de8f id="C SW">&nbsp;</td>	<th></th>	<th></th></tr>'
		filter += '<tr align=center><th id="DF"><a href="javascript:void(Filter(2,\'DF\'))">DF</a></th><td bgcolor=a3de8f id="L DF">&nbsp;</td>	<td bgcolor=a3de8f id="C DF">&nbsp;</td>	<td bgcolor=a3de8f id="C DF">&nbsp;</td>	<td bgcolor=a3de8f id="C DF">&nbsp;</td>	<td bgcolor=a3de8f id="R DF">&nbsp;</td></tr>'
		filter += '<tr align=center><th id="DM"><a href="javascript:void(Filter(2,\'DM\'))">DM</a></th><td bgcolor=a3de8f id="L DM">&nbsp;</td>	<td bgcolor=a3de8f id="C DM">&nbsp;</td>	<td bgcolor=a3de8f id="C DM">&nbsp;</td>	<td bgcolor=a3de8f id="C DM">&nbsp;</td>	<td bgcolor=a3de8f id="R DM">&nbsp;</td></tr>'
		filter += '<tr align=center><th id="MF"><a href="javascript:void(Filter(2,\'MF\'))">MF</a></th><td bgcolor=a3de8f id="L MF">&nbsp;</td>	<td bgcolor=a3de8f id="C MF">&nbsp;</td>	<td bgcolor=a3de8f id="C MF">&nbsp;</td>	<td bgcolor=a3de8f id="C MF">&nbsp;</td>	<td bgcolor=a3de8f id="R MF">&nbsp;</td></tr>'
		filter += '<tr align=center><th id="AM"><a href="javascript:void(Filter(2,\'AM\'))">AM</a></th><td bgcolor=a3de8f id="L AM">&nbsp;</td>	<td bgcolor=a3de8f id="C AM">&nbsp;</td>	<td bgcolor=a3de8f id="C AM">&nbsp;</td>	<td bgcolor=a3de8f id="C AM">&nbsp;</td>	<td bgcolor=a3de8f id="R AM">&nbsp;</td></tr>'
		filter += '<tr align=center><th id="FW"><a href="javascript:void(Filter(2,\'FW\'))">FW</a></th><th></td><td bgcolor=a3de8f id="C FW">&nbsp;</td>	<td bgcolor=a3de8f id="C FW">&nbsp;</td>	<td bgcolor=a3de8f id="C FW">&nbsp;</td>	<th></th></tr>'
		$('table#tblRosterFilter')
			.attr('id','tblRostSkillsFilter')
			.attr('width','50%')
			.attr('align','left')
			.attr('cellspacing','1')
			.attr('cellpadding','1')
			.after('<div id="filter">&nbsp;</div>')
			.before('<a href="javascript:void(ShowSkills(2))">Стрелки</a> | <a href="javascript:void(ShowFilter())">Фильтр >></a><br>')
			.html(filter)
		$('span#tskills').html('Ростер команды')
		$('a#tskills').attr('href','')
		ShowFilter()
//		ShowSkills(2)
		
		var sumpl = '<table id="SumPl" width=50% align=right>'
		sumpl += '<tr id="sumhead"><th colspan=4 align=center id="sumhead">Сумарный игрок</th></tr>'
		sumpl += '<tr id="sumlast1"><td colspan=4 align=right id="sumlast1"><a href="javascript:void(ShowSumPlayer(0))">целые</a>, <a href="javascript:void(ShowSumPlayer(1))">десятые</a>, <a href="javascript:void(ShowSumPlayer(2))">сотые</a></td></tr>'
		sumpl += '<tr id="sumlast2"><td colspan=4 align=right id="sumlast2"><a href="javascript:void(ShowHols())">провалы</a></td></tr>'
		sumpl += '</table>'
		$('table#tblRostSkillsFilter').after(sumpl)
		$('table#SumPl').hide()
	}


	$('table#tblRostSkills tr').remove()
	if(param == 2) type = (type=='img' ? 'num' : 'img')

	var hd = 'N Имя Сум лид дрб удр пас вид глв<br>вых нав длу псо<br>реа ско штр впз угл<br>рук тех мощ отб рбт вын Мор Фор Поз'
	var hd2= hd.split(' ')

	var header = '<tr align="left" style="font-weight:bold;" id="tblRostSkillsTHTr0">'
	header += '<td><a class="sort">'+hd2.join('</a></td><td><a class="sort">')+'</a></td>'
	header += '</tr>'
	$('table#tblRostSkills').append(header)
	$('table#tblRostSkills tr:first a').each(function(i,val){
		$(val).attr('href','javascript:void(CountSkills('+i+'))')
	})

	var pf = players.sort(sSkills)
	for(i=0;i<pf.length;i++) {
		if(pf[i]!=undefined){
			var tr ='<tr height=20 id="'+pf[i].position+'">'
			for(j in hd2) {
				var tdcolor = (countSk[j] == 1 ? ' id=colw bgcolor=white' : '')
				var skn = hd2[j]
				var key1 = pf[i][skills[skn.split('<br>')[0]]]
				var key2 = pf[i][skills[skn.split('<br>')[1]]]
					var sk = (key1!=undefined ? key1 : key2)
//				if(skn=='x')					tr += '<td><a id="x" href="javascript:void(HidePl('+(i+1)+',true))">x</a></td>'
				if(skn=='Имя')					tr += '<td'+tdcolor+'><a href="plug.php?p=refl&t=p&j='+pf[i].id+'&z='+pf[i].hash+'">'+sk+'</a></td>'
				else if(skn=='Поз') 			tr += '<td'+tdcolor+'>'+sk+'</td>'
				else if(skn=='Сум') 			tr += '<td'+tdcolor+'><b><a id="x" href="javascript:void(HidePl('+(i+1)+',true))">'+parseInt(sk)+'</a></b></td>'
				else if(!isNaN(parseInt(sk)) && type=='num')	tr += '<td'+tdcolor+'>'+parseInt(sk)+'</td>'
				else if(!isNaN(parseInt(sk)) && type=='img')	tr += '<td'+tdcolor+'>'+String(sk).split('.')[0]+(String(sk).split('.')[1]!=undefined ? '&nbsp;<img height="10" src="system/img/g/'+String(sk).split('.')[1]+'.gif"></img>' : '')+'</td>'
				else 							tr += '<td'+tdcolor+'> </td>'
			}
			tr += '</tr>'
			$('table#tblRostSkills').append(tr)
		}
	}

	// Run filter
	Filter(3,'')
}

function HidePl(num,fl){
	if(fl){
		$('table#tblRostSkills tr:eq('+num+') a#x').attr('href','javascript:void(HidePl('+(num)+',false))')
		$('table#tblRostSkills tr:eq('+num+') td:gt(2)').each(function(){
			$(this).hide()
		})
	}else{
		$('table#tblRostSkills tr:eq('+num+') a#x').attr('href','javascript:void(HidePl('+(num)+',true))')
		$('table#tblRostSkills tr:eq('+num+') td:gt(2)').each(function(){
			$(this).removeAttr('style')
		})
	}
	ShowSumPlayer()
}

function ShowHols(p){
	sumH = (sumH ? false : true)
	ShowSumPlayer()
}

function ShowSumPlayer(p){
	if(p!=undefined) sumP = p
	debug('ShowSumPlayer go')
	var ld = {'sum':0,'mx':0,'mn':0,'num':0}
	var head = []
	sumplarr = {}
	$('table#tblRostSkills tr:first td:lt(21):gt(2)').each(function(i, val){
		head[i] = $(val).find('a').html().split('<br>')[0]
		sumplarr[head[i]] = {'sum':0,'mx':0,'mn':0,'num':0}
	})

	$('table#tblRostSkills tr:gt(0):visible').each(function(){
		$(this).find('td:lt(21):gt(2):visible').each(function(i,val){
			var tdval = parseInt($(val).text())
			var param = sumplarr[head[i]]
			param.sum  += tdval
			param.mx	= (param.mx < tdval ? tdval : param.mx)
			param.mn	= (param.mn==0 || param.mn > tdval ? tdval : param.mn)
			param.num  += 1
		})
	})

	$('table#SumPl tr#sumsk').remove()
	var tr = true
	var sumpl = ''
	for(i in sumplarr){
		var param = sumplarr[i]
		var text = (param.num==0 ? ' ' : (param.sum/param.num).toFixed(sumP) + (param.num>1 ? ' ('+param.mn+':'+param.mx+')' : ''))
		sumpl += (tr ? '<tr id="sumsk" bgcolor=#a3de8f>' : '')
		sumpl += '<td width=30%>'+skills[i]+'</td><td width=20%>'+text+'</td>'
		sumpl += (tr ? '' : '</tr>')
		tr = (tr ? false : true)
	}   
	$('table#SumPl tr#sumhead').after(sumpl)
	if(sumH){
		$('table#tblRostSkills tr:gt(0):visible').each(function(){

			$(this).find('td#colw').each(function(i, val){
				$(val).attr('id','colwy').attr('bgcolor', '#E9B96E')
			})
			$(this).find('td:[id!=colwy]').each(function(i, val){
				$(val).attr('id','coly').attr('bgcolor', '#FCE94F')
			})
		})
	}else {
		$('table#tblRostSkills tr:visible').each(function(){
			$(this).find('td#colwy').attr('bgcolor','white').attr('id','colw')
			$(this).find('td#coly').removeAttr('bgcolor').removeAttr('id')
		})
	}
}

function ShowFilter(){
	var style = $('table#tblRostSkillsFilter').attr('style')
	if(style == "display: none" || style == "display: none;" || style == "display: none; "){
		$('table#tblRostSkillsFilter').show()
		$('table#SumPl').show()
		$('div#filter').show()
	}else{
		$('table#tblRostSkillsFilter').hide()
		$('table#SumPl').hide()
		$('div#filter').hide()
//		Filter(3,'')
	}
}

function Filter(num,p){
	if(num==1){
		pos1[p] = (pos1[p]==undefined || pos1[p]==0 ? 1 : 0)
	} else if(num==2){
		pos2[p] = (pos2[p]==undefined || pos2[p]==0 ? 1 : 0)
	} else {
//		for(i in pos1) pos1[i] = 0
//		for(i in pos2) pos2[i] = 0
	}
	var sumpos1 = 0
	var sumpos2 = 0
	for (i in pos1) sumpos1 += parseInt(pos1[i])
	for (i in pos2) sumpos2 += parseInt(pos2[i])
	var sumpos = sumpos1 + sumpos2
	var selectTDcolor = 'green'//'D3D7CF'
	var selectFLcolor = 'white'

    $('table#tblRostSkillsFilter th').removeAttr('bgcolor')
	$('table#tblRostSkillsFilter td').each(function(){
		$(this).attr('bgcolor','a3de8f')
		var position = $(this).attr('id')
		var kmark = 0
		var lmark = 0
		for (k in pos1) {
			if(sumpos1==0 || (position.indexOf(k)>-1 && pos1[k]==1)) kmark=1
			if(pos1[k] == 1) $('th#'+k).attr('bgcolor',selectFLcolor)
		}
		for (l in pos2) {
			if(sumpos2==0 || (position.indexOf(l)>-1 && pos2[l]==1)) lmark=1
			if(pos2[l] == 1) $('th#'+l).attr('bgcolor',selectFLcolor)
		}
		if(kmark==1 && lmark==1 && sumpos != 0) $(this).attr('bgcolor',selectTDcolor)
	})
	$('table#tblRostSkills tr:gt(0)').each(function(j,val){
		$(val).hide()
		var position = $(val).find('td:last').text()
		var kmark = 0
		var lmark = 0
		for (k in pos1) if(sumpos1==0 || (position.indexOf(k)>-1 && pos1[k]==1)) kmark=1
		for (l in pos2) if(sumpos2==0 || (position.indexOf(l)>-1 && pos2[l]==1)) lmark=1
		if((kmark==1 && lmark==1) || sumpos == 0) $(val).show()
	})
	$('table#tblRostSkills tr:visible:even').attr('bgcolor','a3de8f')
	$('table#tblRostSkills tr:visible:odd').attr('bgcolor','C9F8B7')
	ShowSumPlayer()
}

function CountSkills(tdid){
    if(countSk[tdid]!=undefined && countSk[tdid]==1) countSk[tdid] = 0
	else countSk[tdid] = 1
	$('table#tblRostSkills tr:gt(0)').each(function(j, valj){
		var sumsel = 0
		$(valj).find('td').each(function(i, val){
			$(val).removeAttr('bgcolor')
			if(countSk[i] == 1) {
				sumsel += (isNaN(parseInt($(val).html())) ? 0 : parseInt($(val).html()))
				$(val).attr('bgcolor','white')
			}
		})
//		$(valj).find('td:eq(2)').html('<b>'+(sumsel==0 ? players[j].sumskills : sumsel)+'</b>')
		if(players[j].sumskills == players[j].sorting) players[j].sorting = sumsel
		else if(sumsel == 0) players[j].sorting = players[j].sumskills
		else players[j].sorting = sumsel
//		players[j].sorting = (players[j].sumskills == players[j].sorting ? sumsel)
	})
	ShowSkills(3)
}

function ShowShortName(fullname){
	var namearr = fullname.replace(/^\s+/, "").replace(/\s+$/, "").split(' ')
	var shortname = ''
	for(n in namearr) {
		if(n==0){
			if(namearr[1] == undefined) shortname += namearr[n]
			else shortname += namearr[n][0] + '.'
		} else {
			shortname += namearr[n] + '&nbsp;'
		}
	}
	return shortname
}


function ShowValueFormat(value){
	if (value > 1000)	return (value/1000).toFixed(3).replace(/\./g,',') + '$'
	else				return (value) + '$'
}

function sSkills(i, ii) { // По SumSkills (убыванию)
    if 		(i.sorting < ii.sorting)	return  1
    else if	(i.sorting > ii.sorting)	return -1
    else								return  0
}
function sValue(i, ii) { // По value (убыванию)
    if 		(i.value < ii.value)	return  1
    else if	(i.value > ii.value)	return -1
    else							return  0
}
function sZp(i, ii) { // По zp (убыванию)
    if 		(i.wage < ii.wage)	return  1
    else if	(i.wage > ii.wage)	return -1
    else						return  0
}
function sAge(i, ii) { // По zp (убыванию)
    if 		(i.age < ii.age)	return  1
    else if	(i.age > ii.age)	return -1
    else						return  0
}

function ShowChange(value){
	if(value > 0) 		return '<sup><font color="green">+' + value + '</font></sup>'
	else if(value < 0)	return '<sup><font color="red">' 	+ value + '</font></sup>'
	else 		  		return ''
}

function UrlValue(key,url){
	var pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&')
	for (n in pf) if (pf[n].split('=')[0] == key) return pf[n].split('=')[1];
	return false
}

function check(d) {return (d<10 ? "0"+d : d)}

function debug(text) {if(deb) {debnum++;$('td#crabgloballeft').append(debnum+'&nbsp;\''+text+'\'<br>');}}

/**

function CountryInfoGet(){
	var srch="Вы вошли как "
	var ManagerNickCur  = $('td.back3 td:contains('+srch+')').html().split(',',1)[0].replace(srch,'')
	var ManagerNickTeam = $('td.back4 table:first table:eq(1) table td:first span').text()
	if(ManagerNickCur == ManagerNickTeam){
		var tdivarr = []
		var tdiv = getCookie('teamdiv');
		if(tdiv != false) tdivarr = tdiv.split('!')
		// format: club_id, country_name, div, <list of div prizes>
		tdivarr[0] = cid
		tdivarr[1] = $('td.back4 table:first table td:eq(3)').text().split(', ')[1].replace(')','')
		setCookie('teamdiv',tdivarr.join('!'));
	} 
}

function ForgotPlValueCh(){
	var text = ''
	for(j in players) {
		players[j].valuech = 0
		text += players[j].id + ':'
		text += players[j].value/1000 + ':'
		text += 0
		text += ','
	}
	//SaveStorageData('playersvalue',text)
	if(ff)	globalStorage[location.hostname]['playersvalue'] = text
	else	sessionStorage['playersvalue'] = text

	nom = 0
	$('a#os').remove()
	$('tr#nom').remove()
	$('tr#osnom td:last').html('')
}

function setCookie(name, value) {
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + 356); // +1 year
	if (!name || !value) return false;
	document.cookie = name + '=' + encodeURIComponent(value) + '; expires='+ exdate.toUTCString() + '; path=/'
	return true
}
function getCookie(name) {
    var pattern = "(?:; )?" + name + "=([^;]*);?"
    var regexp  = new RegExp(pattern)
    if (regexp.test(document.cookie)) return decodeURIComponent(RegExp["$1"])
    return false
}

/**/