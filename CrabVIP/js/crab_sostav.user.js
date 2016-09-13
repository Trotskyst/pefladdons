// ==UserScript==
// @name           peflsostav
// @namespace      pefl
// @description    Display sostav
// @include        http://*pefl.*/*?sostav
// @include        http://*pefl.*/*?sostav_n
// @encoding	   windows-1251
// ==/UserScript==

var ff 	= (navigator.userAgent.indexOf('Firefox') != -1 ? true : false)
var sostavteam = (location.search.substring(1) == 'sostav' ? true : false)

positions = []
var dataall = []
var plkeys = []
var players = []
var pid = []
var stds = {pfre:[],pcor:[],pcap:[],ppen:[]}
var posmaxorder = 0
var getforumid = 9107892
var plskillmax = 15
var tabslist = ''
var maxtables = 25//25+10
var showscout = true
var refresh = false
var list = {
	positions: 'id,filter,name,num,koff,order'
}

var fl = ['','#EF2929','#A40000','#FCE94F','#E9B96E','green','black']
var selected = ''

var skillnames = {
sor:{rshort:'���',rlong:'����������',hidden:true},
sostav:{rshort:'��',rlong:'����� � ������?'},
flag:{rshort:'��',rlong:'�������������� ����'},
pfre:{rshort:'��',rlong:'����������� ��������'},
pcor:{rshort:'��',rlong:'����������� �������'},
ppen:{rshort:'��',rlong:'����������� ��������'},
pcap:{rshort:'��',rlong:'��������'},
//��
school:{rshort:'���',rlong:'��������?'},
srt:{rshort:'����',rlong:'� % �� ������',type:'float'},
stdat:{rshort:'��',rlong:'���� �� ���. �����'},
stdbk:{rshort:'��',rlong:'���� �� ���. �������'},
nation:{rshort:'���',rlong:'��� ������'},
natfull:{rshort:'���',rlong:'������',align:'left',nowrap:'1'},
secondname:{rshort:'���',rlong:'�������',align:'left',nowrap:'1'},
firstname:{rshort:'���',rlong:'���',align:'left',nowrap:'1'},
age:{rshort:'���',rlong:'�������',str:true,strmax:40},
id:{rshort:'id',rlong:'id ������'},
internationalapps:{rshort:'���',rlong:'��� �� �������',str:true,strmax:500},
internationalgoals:{rshort:'���',rlong:'����� �� �������',str:true,strmax:500},
contract:{rshort:'���',rlong:'��������',str:true,strmax:5},
wage:{rshort:'���',rlong:'��������',str:true,strmax:100,strinvert:100100},
value:{rshort:'���',rlong:'�������',type:'value',str:true,strmax:50000000},
corners:{rshort:'��',rlong:'�������',str:true},
crossing:{rshort:'��',rlong:'������',str:true},
dribbling:{rshort:'��',rlong:'��������',str:true},
finishing:{rshort:'��',rlong:'�����',str:true},
freekicks:{rshort:'��',rlong:'��������',str:true},
handling:{rshort:'��',rlong:'���� ������',str:true},
heading:{rshort:'��',rlong:'���� �������',str:true},
leadership:{rshort:'��',rlong:'���������',str:true},
longshots:{rshort:'��',rlong:'������� �����',str:true},
marking:{rshort:'��',rlong:'����. �����',str:true},
pace:{rshort:'��',rlong:'��������',str:true},
passing:{rshort:'��',rlong:'���� � ���',str:true},
positioning:{rshort:'��',rlong:'����� �������',str:true},
reflexes:{rshort:'��',rlong:'�������',str:true},
stamina:{rshort:'��',rlong:'������������',str:true},
strength:{rshort:'��',rlong:'����',str:true},
tackling:{rshort:'��',rlong:'����� ����',str:true},
vision:{rshort:'��',rlong:'������� ����',str:true},
workrate:{rshort:'��',rlong:'�����������������',str:true},
technique:{rshort:'��',rlong:'�������',str:true},
morale:{rshort:'���',rlong:'������',str:true,strmax:100},
form:{rshort:'���',rlong:'�����',str:true,strmax:100},
position:{rshort:'���',rlong:'�������',align:'left',nowrap:'1'},
/**
games
goals
passes
mom
ratingav
cgames
cgoals
cpasses
cmom
cratingav
egames
egoals
epasses
emom
eratingav

wgames
wgoals
wpasses
wmom
wratingav

fgames
fgoals
fpasses
fmom
fratingav
vratingav
training
/**/
inj:{rshort:'���',rlong:'������',str:true,strmax:0,strinvert:85},
sus:{rshort:'���',rlong:'���������������',str:true,strmax:0,strinvert:40},
syg:{rshort:'���',rlong:'�����������',str:true,strmax:20}
/**
agames
agoals
apasses
amom
/**/
}

$().ready(function() {

	selected = getDataSelected().split(',')

	var geturl = (sostavteam ? 'fieldnew3.php' : 'fieldnew3_n.php');
	var geturl2 = (sostavteam ? 'jsonsostav.php?'+localStorage['sostavurl'+localStorage.myteamid] : localStorage['sostavurl'+(60000+parseInt(localStorage.myintid))]);

	PrintTables(geturl)
	$.get(geturl, {}, function(datatext){
		var dataarray = datatext.split('&');
		var i = 0;
		var pid_num = 0
		var check = false
		while(dataarray[i] != null) {
			tmparr = dataarray[i].split('=');
			i++;
			var tmpkey = tmparr[0];
			var tmpvalue = tmparr[1];
			dataall[tmpkey] = tmpvalue;

			// ������ � ������
			if (tmpkey.indexOf('pid') != -1) {
				var tmpnum = parseInt(tmpkey.replace('pid',''))
				if(pid[tmpnum]==undefined) pid[tmpnum] = {}
				pid[tmpnum].pid = tmpvalue;
			}
			// ����������� �������
			if (tmpkey.indexOf('p0_') != -1) {
				var tmpnum = parseInt(tmpkey.replace('p0_',''))
				pid[tmpnum].p0 = tmpvalue;
			}
			// �������� ����������� ������� 
			if (tmpkey.indexOf('pm0_') != -1) {
				var tmpnum = parseInt(tmpkey.replace('pm0_',''))
				pid[tmpnum].pm0 = tmpvalue;
			}
			// ������������ ��������
			if (tmpkey.indexOf('fre') != -1) {
				stds.pfre[tmpvalue] = parseInt(tmpkey.replace('fre',''))
			}
			// ������������ �������
			if (tmpkey.indexOf('cor') != -1) {
				stds.pcor[tmpvalue] = parseInt(tmpkey.replace('cor',''))
			}
			// ������������ penalty
			if (tmpkey.indexOf('pen') != -1) {
				stds.ppen[tmpvalue] = parseInt(tmpkey.replace('pen',''))
			}
			// ��������
			if (tmpkey.indexOf('cap') != -1) {
				stds.pcap[tmpvalue] = parseInt(tmpkey.replace('cap',''))
			}

			// �������� z0 (���� ������� 1� �������)
			if (tmpkey.indexOf('z0') != -1) {
				var tmpnum = parseInt(tmpkey.replace('z0_',''))
				pid[tmpnum].z0bk = (tmpvalue>=513 ? true : false)
				pid[tmpnum].z0at = ((tmpvalue>=213 && tmpvalue<500) || tmpvalue>=700 ? true : false)
			}

			// ����� ������ �������
			if(tmpkey == 'nation0') check = true
			if(tmpkey == 'nation1') check = false
			if(check) plkeys.push(tmpkey.replace('0',''))
		}
		getPlayers()
		$.get(geturl2, {}, function(datatext2){
			var obj = JSON.parse(datatext2);
			GetData('positions',obj)
		})
	})
})

function getDataSelected(){
	var dataname = (sostavteam ? 'selected' : 'selectedn')
	var datavalue = String(localStorage[dataname])

	if(datavalue == 'undefined'){
		datavalue = ''
			+',1,2'			// ����� Gk & SW
			+',3,7,7,7,4'	// ����� DF
			+',5,8,8,8,6'	// ����� DM
			+',10,9,9,9,11'	// ����� MF
			+',13,12,12,12,14'	// ����� AM
			+',15,15,15'		// ����� FW
			+',16,17,18,19,0'	// ��� ������� 1
			+',20,21,22,23,0'	// ��� ������� 2
	}
	return datavalue
}

function saveDataSelected(){
	var dataname = (sostavteam ? 'selected' : 'selectedn')
	var datavalue = selected.join(',')	

	localStorage[dataname] = datavalue
}


function sSrt(i, ii) { // �� ��������
	var s = 'sor'
    if 		(i[s] < ii[s])	return  1
    else if	(i[s] > ii[s])	return -1
    return  0
}

function GetData(dataname, obj){
	refresh = false
	var needsave = false
	var data = []
	var head = list[dataname].split(',')
	var text1 = String(localStorage[dataname])
	if (text1 != 'undefined' && text1 != 'null'){
		var text = text1.split('#')
		var numpos = 0
		for (i in text) {
			var x = text[i].split('|')
			var curt = {}
			var num = 0
			for(j in head){
				curt[head[j]] = (x[num]!=undefined ? x[num] : '')
				num++
			}
			data[numpos] = curt
			numpos++
		}
	}else{
		needsave = true
	// TODO: ��������� ���������� positions(from forum) ������ �������� ���.
		data = [
			{filter:'',		name:'&nbsp;',	num:0,	koff:'data=9107892,idealsk=15,idealage=40,idealval=50000000,idealnat=500,maxt=10'},
/**  1 **/	{filter:'GK', 	name:'GK', 		num:5,	koff:'��=��*3,��=��*2,��=��*2,��=��*1.5,!��=��*0.7,!��=��*0.4,��,���,����,��'},
/**  2 **/	{filter:'C SW',	name:'C SW',	num:5,	koff:'��=��*2,��=��*1.5,��=��,��=��,!��,��,���,����,��'},
/**  3 **/	{filter:'L DF',	name:'L DF',	num:5,	koff:'��=��*2,��=��*1.5,��=��*1.5,��=��,��,���,����,��'},
/**  4 **/	{filter:'R DF',	name:'R DF',	num:5,	koff:'��=��*2,��=��*1.5,��=��*1.5,��=��,��,���,����,��'},
/**  5 **/	{filter:'L DM',	name:'L DM',	num:5,	koff:'��=��*1.5,��=��*1.5,��=��,��=��,��,���,����,��'},
/**  6 **/	{filter:'R DM',	name:'R DM',	num:5,	koff:'��=��*1.5,��=��*1.5,��=��,��=��,��,���,����,��'},
/**  7 **/	{filter:'C DF',	name:'C DF',	num:5,	koff:'��=��*3,��=��*3,��=��*1.5,��=��*1.5,��=��*1.5,��,���,����,��'},
/**  8 **/	{filter:'C DM',	name:'C DM',	num:5,	koff:'��=��*3,��=��*3,��=��*2,��=��*2,!��=��*1.5,!��=��*1.5,��,���,����,��'},
/**  9 **/	{filter:'C M',	name:'C M',		num:5,	koff:'��=��*2,��=��*2,��=��*2,��=��*1.5,!��=��,!��=��*0.5,��,���,����,��'},
/** 10 **/	{filter:'L M',	name:'L M',		num:5,	koff:'��=��*2,��=��*2,��=��*2,��=��*2,!��=��*1.5,!��=��*1.5,!��=��,��,���,����,��'},
/** 11 **/	{filter:'R M',	name:'R M',		num:5,	koff:'��=��*2,��=��*2,��=��*2,��=��*2,!��=��*1.5,!��=��*1.5,!��=��,��,���,����,��'},
/** 12 **/	{filter:'C AM',	name:'C AM',	num:5,	koff:'��=��*2,��=��*2,��=��*2,��=��*2,!��=��,!��=��,��,���,����,��'},
/** 13 **/	{filter:'L AM',	name:'L AM',	num:5,	koff:'��=��*3,��=��*2.5,��=��*2,��=��*1.5,!��=��*1.5,!��=��,��,���,����,��'},
/** 14 **/	{filter:'R AM',	name:'R AM',	num:5,	koff:'��=��*3,��=��*2.5,��=��*2,��=��*1.5,!��=��*1.5,!��=��,��,���,����,��'},
/** 15 **/	{filter:'C FW',	name:'C FW',	num:5,	koff:'��=��*3,��=��*2,��=��*2,��=��*1.5,!��=��*1.5,!��=��*1.5,��,���,����,��'},
/** 16 **/	{filter:'',		name:'���. �����',	num:18,	koff:'��=��*200,��=��*5,��=��,��=��*0.5,��,����,��,���,��,��'},
/** 17 **/	{filter:'',		name:'���. �������',num:18,	koff:'��=��*200,��=��*5,��=��,��=��*0.5,��,����,��,���,��,��'},
/** 18 **/	{filter:'',		name:'���. �������',num:18,	koff:'��=��*200,��=��*10,��=��*2,��,��,���,��,����'},
/** 19 **/	{filter:'',		name:'���. ��������',num:18,koff:'��=��*200,��=��*10,��=��,��=��,��,��,���,��,����'},
/** 20 **/	{filter:'',		name:'���. ��������',num:18,koff:'��=��*200,���=���,��=��*0.3,��=��*0.3,��,���,��,����'},
/** 21 **/	{filter:'',		name:'!�����������',	num:0,	koff:'��,���=���,��,���,���,!����'},
/** 22 **/	{filter:'',		name:'!��������',	num:0,	koff:'���=���,���=-���*100,��,���,!����'},
/** 23 **/	{filter:'',		name:'!��������',	num:0,	koff:'���=���,���,��,���,!����'}
		]
	}
	//translate all to rshort and fix order
	var fixorder = ':'
	for(i in data) {
		for(j in skillnames) changeValue(data[i].koff,j,skillnames[j].rshort)
		if(data[i].order == ''|| data[i].order ==undefined) data[i].order = i
		if(fixorder.indexOf(':'+data[i].order+':') !=-1) {
			data[i].order = posmaxorder + 1
		}
		fixorder += data[i].order+':'
		if(posmaxorder<parseInt(data[i].order)) {
			posmaxorder = parseInt(data[i].order)
		}

	}
	switch (dataname){
		case 'positions':  positions = data;break
		default: return false
	}
	getParams()
	fillPosEdit(0)
	PrintAdditionalTables()
	//for(i=1;i<positions.length;i++) countPosition(i)
	FillHeaders(obj)
	if(needsave) SaveData('positions')
}
function getParams(){
	var params = positions[0].koff.split(',')
	for(k in params){
		var pname = params[k].split('=')[0]
		var pvalue = parseInt(params[k].split('=')[1])
		switch (pname){
			case 'data': break;
			case 'idealsk': plskillmax=pvalue; break;
			case 'idealage':skillnames.age.strmax = pvalue;break;
			case 'idealval':skillnames.value.strmax = pvalue;break;
			case 'maxt':	maxtables += pvalue
							for(l=1;l<=maxtables;l++){
								if(selected[l]==undefined) selected[l] = 0
							}
							for(l=selected.length-1;l>0;l--) if(l>maxtables) selected.pop()
							saveDataSelected()
							break;
			case 'idealnat':skillnames.internationalapps.strmax = pvalue;
							skillnames.internationalgoals.strmax = pvalue;break;
			default:
		}
	}
}

function SaveData(dataname){
	var data = []
	var head = list[dataname].split(',')
	switch (dataname){
		case 'positions':	data = positions;		break
		default: return false
	}
	var text = ''
	for (var i in data) {
		text += (text!='' ? '#' : '')
		if(typeof(data[i])!='undefined') {
			var dti = data[i]
			var dtid = []
			for(var j in head){
				dtid.push(dti[head[j]]==undefined ? '' : dti[head[j]])
			}
			text += dtid.join('|')
		}
	}
	localStorage[dataname] = text
}

function filterPosition(plpos,flpos){
		var pos = flpos.split(' ')
		var	pos0 = false
		var pos1 = false
		if(pos[1]==undefined) {
			pos1 = true
			if(plpos.indexOf(pos[0]) != -1) pos0 = true
		}else{
			for(k=0;k<3;k++) if(plpos.indexOf(pos[0][k]) != -1) pos0 = true
			pos1arr = pos[1].split('/')
			for(k in pos1arr) if((plpos.indexOf(pos1arr[k]) != -1)) pos1 = true
		}
		return (pos0 && pos1 ? true : false)
}

function countPosition(posnum){
	var ps = positions[posnum]
	var sf = countStrength('ideal',ps.koff).split(':')
	ps.strmax = sf[0]
	ps.sormax = sf[1]
	var pls = []
	for(j in players){
		var pl = {}
		if(j==0) pl.id0 = true
		pl.id = players[j].id
		if(pl.id==undefined) break
		var pkoff = ps.koff.split(',')
		for(h in pkoff){
			var koff = String(pkoff[h].split('=')[0])
			if(skillnames[koff]==undefined) for(l in skillnames) if(skillnames[l].rshort==koff.replace(/\!/g,'')) koff=koff.replace(skillnames[l].rshort,l)
			pl[koff] = (players[j][koff.replace(/\!/g,'')]==undefined ? 0 : players[j][koff.replace(/\!/g,'')])
		}
		pl.posf = filterPosition(String(players[j].position), ps.filter)
		if(ps.filter=='') pl.posfempty = true
		var s = (pl.srt!=undefined ? 'srt' : (pl['!srt']!=undefined ? '!srt' : ''))
		if(s!='' && pl[s]!=undefined) {
			var sfp = countStrength(j,ps.koff).split(':')
			pl[s] = (ps.strmax==0 ? 0 : (sfp[0]/ps.strmax)*100)
			pl.sor = (ps.sormax==0 ? 0 : (sfp[1]/ps.sormax)*100)
		}
		pls.push(pl)
	}
	positions[posnum].pls = pls.sort(sSrt)
}
function checkKoff(kf0){
	var res = kf0.replace(/!/g,'')
	if(skillnames[res]==undefined){
		var custom = true
		for(h in skillnames){
			if(skillnames[h].rshort==res) {
				custom = false
				res = h
			}
		}
		if(custom){
			skillnames[res] = {}
			skillnames[res].rshort = res
			skillnames[res].rlong = 'Custom ��������'
			skillnames[res].type = 'custom'
		}
	}
	return res
}

function changeValue(formula,name,value){
	if(formula.indexOf(name)!=-1 && name!=''){
		var reg  = new RegExp(name, "g")
		formula = formula.replace(reg,value)
	}
	return formula
}
function tryEval(formula){
	try{
		return eval(formula)
	}catch(e){
		return 'x'
	}
}

function countStrength(plid,pkoff){
	var pl = (plid=='ideal' ? players[players.length-1] : players[plid])
	pkoff = pkoff.split(',')
	var res  = 0
	var res2 = 0
	for(n in pkoff){
		var count = 0		// filter
		var count2 = 0		// strench
		var koff = pkoff[n].split('=')
		var koffname = checkKoff(koff[0])
		if(koff[1]!=undefined){
			count  = koff[1].replace(/\s/g,'')
			count2 = koff[1].replace(/\s/g,'')
			for(p in pl){
				var plp = (isNaN(parseInt(pl[p])) ? 0 : parseInt(pl[p]))
				var skill = (plid=='ideal' ? (skillnames[p]!=undefined && skillnames[p].strmax!=undefined ? skillnames[p].strmax : plskillmax) : plp)
				skill = '('+(skill-(skillnames[p]!=undefined && skillnames[p].strinvert!=undefined ? skillnames[p].strinvert : 0))+')'
				count = changeValue(count,p,skill)
				count = (skillnames[p]!=undefined ? changeValue(count,skillnames[p].rshort,skill) : count)
				if(skillnames[p]!=undefined && !skillnames[p].str) skill = 0
				count2 = changeValue(count2,p,skill)
				count2 = (skillnames[p]!=undefined ? changeValue(count2,skillnames[p].rshort,skill) : count2)
			}
			for(p in skillnames){
				count = changeValue(count,p,0)
				count = changeValue(count,skillnames[p].rshort,0)
				count2 = changeValue(count2,p,0)
				count2 = changeValue(count2,skillnames[p].rshort,0)
			}
			var countval  = tryEval(count)
			var countval2 = tryEval(count2)
			if(countval=='x') {
				if(plid=='ideal') alert('!!������ �������� � "'+pkoff[n]+'":('+koff[1]+')')
				return '0:0'
			}
			if(plid!='ideal' && skillnames[koffname].type=='custom') {
				players[plid][koffname] = countval
			}
			res  += countval
			res2 += countval2
		}
	}
	return res2+':'+res
}

function krPrint(val,sn){
	switch(skillnames[sn].type){
		case 'float':
			return (val).toFixed(1)
		case 'value':
			if(val>=1000000) return parseFloat(val/1000000).toFixed(3)+'�'
			else if(val==0) return '??'
			else return parseInt(val/1000)+'�'
		default:
			return (skillnames[sn].str ? parseInt(val) : val)
	}
}

function FillData(nt){
	$('#table'+nt).remove()
	var ns = ($('#select'+nt+' option:selected').length>0 ? $('#select'+nt+' option:selected').val() : 0)
	var np = 0
	for(g in positions)	if(parseInt(positions[g].order) == parseInt(ns)) {
		np = g
		break
	}

	if(np!=0){
		if(positions[np].pls==undefined) {
//			refresh = true
//			return false
			countPosition(np)
		}
		var selpl = 0
		for(h in pid) if(pid[h].p0 == nt) selpl = pid[h].pid
		var html = '<table id=table'+nt+' width=100% border=0 rules=none>'
		var head = true
		var nummax = (positions[np].num==0 ? positions[np].pls.length : positions[np].num)
		var numshow = 0
    	for(t=0;t<positions[np].pls.length;t++){
			var pl = positions[np].pls[t]
			var trbgcolor = (selpl==pl.id || (positions[np].filter == '' && pl.sostav==2) ? ' bgcolor=white' : (pl.sostav > 0 ? ' bgcolor=#BABDB6' : ''))
			var plhtml = '<tr align=right'
			if((!pl.posf || numshow>=nummax) && selpl!=pl.id) 	plhtml += ' hidden abbr=wrong'
			else numshow++

			plhtml += trbgcolor+'>'
			var font1 = (!pl.posf ? '<font color=red>' : (pl.flag==6 ? '<font color=888A85>' : ''))
			var font2 = (!pl.posf || pl.flag==6 ? '</font>' : '')
			if(head) var headhtml = '<tr align=center>'
			for(pp in pl) {
				if(pp=='flag'){
					plhtml += '<td'+(pl[pp]>0 ? ' bgcolor='+fl[pl[pp]] : trbgcolor)+'></td>'
					if(head) headhtml += '<td width=1%></td>'
				}else if(pp!='posf' && pp!='posfempty' && pp!='sostav' && pp!='id' && pp!='sor'){
					var hidden = ''
					var p = pp
					if(pp.indexOf('!')!=-1){
						p = pp.replace(/\!/g,'')
						hidden = ' hidden abbr=hidden'
					}
					var skp = skillnames[p]
					var align = (skp!=undefined && skp.align!=undefined ? ' align='+skp.align : '')
					var nowrap = (skp!=undefined && skp.nowrap!=undefined ? ' nowrap' : '')

					plhtml += '<td'+align+hidden+nowrap+'>'+font1
					plhtml += krPrint(pl[pp],p)
					plhtml += font2+'</td>'
					if(head) {
						headhtml += '<td'+hidden+(skp.rlong!=undefined ? ' title="'+skp.rlong+'"' : '')+'>'
						headhtml += (skp.rshort!=undefined ? skp.rshort : p)
						headhtml += '</td>'
					}
				}
			}
			plhtml += '</tr>'
			if(head) headhtml += '</tr>'
			html += (head ? headhtml : '') + plhtml
			head = false
		}
		html += '</table>'
		$('#htable'+nt).after(html)
	}
	if(selected[nt]!=positions[np].order) {
		if(np==0 && nt<=25){

		}else{
			selected[nt] = positions[np].order
			saveDataSelected()
		}
	}
	MouseOff(nt)
/**/
}

function getPlayers(){
	var numPlayers = parseInt(dataall['n'])
	for(i=0;i<numPlayers;i++){
		var pl = {}
		for(j in plkeys) {
			var name = plkeys[j]
			var val = dataall[name+i]
			switch (name){
				case 'contract':
					val = (parseInt(val)==0 ? 21-parseInt(dataall['age'+i]): parseInt(val)); break;
				case 'wage':
					val = (parseInt(val)==0 ? 100 : parseInt((val).replace(/\,/g,''))); break;
				case 'value':
					if(parseInt(val)==0) pl.school = true // ������ ��� ��������!
					val = parseInt((val).replace(/\,/g,''));break;
//				default:
			}
			pl[name] = val
		}
		pl.sostav = 0
		for(k in pid) {
			if(pid[k].pid==pl.id){
				pl.sostav = (k<12 ? 2 : 1)
				pl.stdat = (pid[k].z0at ? '*' : '')
				pl.stdbk = (pid[k].z0bk ? '*' : '')
			}

		}
		for(k in stds) pl[k] = (stds[k][pl.id]!=undefined ? stds[k][pl.id] : '')

		pl.flag = 0
		if(dataall['inj'+i]>0) pl.flag = 1
		else if(dataall['sus'+i]>0) pl.flag = 2
		else if(dataall['form'+i]<90) pl.flag = 3
		else if(dataall['morale'+i]<80) pl.flag = 4
		else if(dataall['value'+i]==0) pl.flag = 5

		players[pl.id] = pl
	}
	// ���������� ������� �� ������ ����������� ���� �� ��� ���� ��� � ������ "�����".
	if(showscout){
		var text1 = String(localStorage.peflplayer)
		var pl2 = []
		if (text1 != 'undefined'){
			var pl = text1.split(',');
			for (i in pl) {
				var key = pl[i].split('=')
				var pn = (key[0].split('_')[1] == undefined ? 2 : key[0].split('_')[1])
				if(pl2[pn]==undefined) pl2[pn] = {}
				pl2[pn][key[0].split('_')[0]] = [key[1]]
			}
		}
		for(k in pl2){
			var pl2id = pl2[k].id
			if(players[pl2id]==undefined){
				players[pl2id] = pl2[k]
				players[pl2id].flag = 6
				players[pl2id].syg = 0
			}
		}
	}
}

function FillHeaders(obj){
	for(i=1;i<=maxtables;i++){
        var sel = false
		var selnum = selected[i]
        for (j in obj.sostav1) {
        	if (obj.sostav1[j].pos == i) sel = true
        }
		//for(j in pid) if(pid[j].p0 == i) sel = true

		$('#select'+i).empty()
		for(j in positions) {
			var psj = positions[j]
			$('#select'+i).append('<option value='+psj.order+'>'+psj.name+'</option>')
		}
		var name = '&nbsp;'
		$('#span'+i).html(name)
		if(positions[selnum] !=undefined && positions[selnum].name != undefined) {
			name = positions[selnum].name
		}
		if ((sel || i>25) && selnum!=undefined) $('#select'+i+' option:eq('+selnum+')').attr('selected', 'yes')
		if(sel) $('td#td'+i).attr('class','back2')
		FillData(i)
		if(refresh) break
	}
	if(refresh) {
		maxtables = 25
		GetData('positions')
	}
}

function printToBackUp(){
	var text = JSON.stringify(positions)
		.replace(/\{/g,'\n{')
		.replace(']','[/code][/spoiler]')
		.replace('[','[spoiler][code]')
	return text
}

function fillPosEdit(num){
	var html = ''
	html += '<table width=100% class=back1><tr valign=top><td width=150>'
	html += '<select id=selpos size=30 class=back2 style="border:1px solid;min-width:100;max-width=150;padding-left:5px" onChange="javascript:void(PosChange())">'
	html += '<option value=0'+(num==0 ? ' selected' :'')+'>--- ������� ---</option>'
	for(i=1;i<positions.length;i++)	html += '<option value='+i+(num==i ? ' selected' :'')+'>'+(i==0 ? '--- ������� ---' : positions[i].name)+'</option>'
	html += '</select></td>'
	html += '<td><table width=100%>'
	html += '<tr><th colspan=2 class=back2>�����������</th></tr>'
	html += '<tr><th width=10% align=right>��������:</th><td><input class=back1 style="border:1px solid;" id=iname name="name" type="text" size="40" value="'+(num!=undefined && num!=0 ? positions[num].name :'')+'"></td></tr>'
	html += '<tr><th align=right>���-��:</th><td><input class=back1 style="border:1px solid;" id=inum name="num" type="text" size="3" value="'+(num!=undefined && num!=0 && positions[num].num!=undefined ? positions[num].num :'')+'"> ������� max ����������(0=���)</td></tr>'
	html += '<tr><th align=right>������:</th><td><input class=back1 style="border:1px solid;" id=ifilter name="filter" type="text" size="10" value="'+(num!=undefined && num!=0  ? positions[num].filter :'')+'"> "LC DF/DM"(�����=���)</td></tr>'
	html += '<tr><td colspan=2><textarea class=back1 style="border:1px solid;" id=ikoff name="koff" cols="50" rows="5">'+(num!=undefined && num!=0  ? positions[num].koff :'')+'</textarea></td></tr>'
	html += '<tr><th colspan=2>&nbsp;</th></tr>'
	html += '</table><br><table>'
	html += '<tr><th height=20 width=100 class=back2 onmousedown="javascript:void(PosSave())" onMouseOver="this.style.cursor=\'pointer\'" style="border:1px solid;border-top-left-radius:5px;border-top-right-radius:5px;border-bottom-left-radius:5px;border-bottom-right-radius:5px;">���������</th><td></td></tr>'
//	html += '<tr><th height=20 class=back2 onmousedown="javascript:void(PosDel())" onMouseOver="this.style.cursor=\'pointer\'" style="border:1px solid;border-top-left-radius:5px;border-top-right-radius:5px;border-bottom-left-radius:5px;border-bottom-right-radius:5px;">�������</th><td></td></tr>'
	html += '</table></td>'
	html += '<td><table width=100% align=top>'
	html += '<tr><td>!</td><td colspan=2>������ �� �������� ���� �� ����������</td></tr>'
	html += '<tr><td>=</td><td colspan=2>��� ����� ���������� � �������� ����</td></tr>'
	for(m in skillnames) if(!skillnames[m].hidden) html += '<tr><td>'+skillnames[m].rshort+'</td><td>'+m+'</td><td>'+skillnames[m].rlong+'</td></tr>'
	html += '</table></td></tr>'
	html += '</table>'
	$('div#divkoff').html(html)

	html = '<table width=100% class=back1><tr valign=top>'
	html += '<td width=50%><table width=100%>'
	html += '<tr><th colspan=2 class=back2>��������</th></tr>'
	html += '<tr><th width=15% align=right nowrap>� ������:</th><td><input class=back1 style="border:1px solid;" id=iforum name="iforum" type="text" size="10" value="'+getforumid+'"></td></tr>'
	html += '<tr><th width=15% align=right>������:</th><td><input class=back1 style="border:1px solid;" id=itables name="itables" type="text" size="10" value="'+(maxtables-25)+'"> (���-�� ���. ������)</td></tr>'
	html += '<tr><th colspan=2>&nbsp;</th></tr>'
	html += '</table></td>'
	html += '<td width=50%><table width=100%>'
	html += '<tr><th colspan=2 class=back2>��������� �����</th></tr>'
	html += '<tr><th width=15% align=right>������:</th><td><input class=back1 style="border:1px solid;" id=iskills name="iskills" type="text" size="10" value="'+plskillmax+'"></td></tr>'
	html += '<tr><th width=15% align=right>�������:</th><td><input class=back1 style="border:1px solid;" id=inominal name="inominal" type="text" size="10" value="'+skillnames.value.strmax+'"></td></tr>'
	html += '<tr><th width=15% align=right>�������:</th><td><input class=back1 style="border:1px solid;" id=iage name="iage" type="text" size="10" value="'+skillnames.age.strmax+'"></td></tr>'
	html += '<tr><th width=15% align=right>�������:</th><td><input class=back1 style="border:1px solid;" id=inational name="inational" type="text" size="10" value="'+skillnames.internationalapps.strmax+'"> (��� � �����)</td></tr>'
	html += '<tr><th colspan=2>&nbsp;</th></tr>'
	html += '</table></td><tr>'
	html += '<tr><td clospan=2><table>'
	html += '<tr><th height=20 width=100 class=back2 onmousedown="javascript:void(PosSaveAll())" onMouseOver="this.style.cursor=\'pointer\'" style="border:1px solid;border-top-left-radius:5px;border-top-right-radius:5px;border-bottom-left-radius:5px;border-bottom-right-radius:5px;">���������</th><td></td></tr>'
	html += '</table></td><tr>'
//	if(deb){
		html += '<tr><th colspan=2>&nbsp;</th></tr>'
		html += '<tr><td colspan=2><b>�����</b>(��������, ����������� �� �����):<br><textarea class=back1 style="border:1px solid;" id=bk name="bk" cols="100" rows="20">'+printToBackUp()+'</textarea></td></tr>'
//	}
	html += '</table>'
	$('div#divedit').html(html)

}

function PosChange(){
	var selnum = $('#selpos option:selected').val()
	fillPosEdit(selnum)
}
function PosDel(){
	var selnum = $('#selpos option:selected').val()
	if(selnum==0) {return false;}
	positions.splice(selnum,1)
	SaveData('positions')
	chMenu('tdsost')
	maxtables = 25
	posmaxorder = 0
	GetData('positions')
}

function PosDrop(){
	delete localStorage.positions
	maxtables = 25
	posmaxorder = 0
	chMenu('tdsost')
	GetData('positions')
}
function PosSaveAll(){
	var pr = {
		iforum: ($('#iforum').val() == '' ? getforumid : $('#iforum').val()),
		itables: ($('#itables').val() == '' ? 0 : $('#itables').val()),
		iskills: ($('#iskills').val() == '' ? 15 : $('#iskills').val()),
		inominal: ($('#inominal').val() == '' ? 50000000 : $('#inominal').val()),
		iage: ($('#iage').val() == '' ? 40 : $('#iage').val()),
		inational: ($('#inational').val() == '' ? 500 : $('#inational').val()),
	}
	if(pr.itables>30) pr.itables = 30

	if(pr.iforum!=parseInt(pr.iforum) ||
		pr.itables!=parseInt(pr.itables) ||
		pr.iskills!=parseInt(pr.iskills) ||
		pr.inominal!=parseInt(pr.inominal) ||
		pr.iage!=parseInt(pr.iage) ||
		pr.inational!=parseInt(pr.inational)){
			alert('����������� ������� ���������!')
			return false
	}
	positions[0].koff = 'data='+pr.iforum+',idealsk='+pr.iskills+',idealage='+pr.iage+',idealval='+pr.inominal+',idealnat='+pr.inational+',maxt='+pr.itables
	SaveData('positions')
	maxtables = 25
	posmaxorder = 0
	chMenu('tdsost')
	GetData('positions')
}

function PosSave(){
	var num1 = $('#selpos option:selected').val()
	var num = num1
	var order = 0
	if(num1==0) {
		num = positions.length
		order = posmaxorder = parseInt(posmaxorder)+1
	}else{
		order = positions[num].order
	}
	var ps = {
		name: 	$('#iname').val(),
		num: 	($('#inum').val() == '' ? 0 : $('#inum').val()),
		filter: $('#ifilter').val(),
		koff: 	$('#ikoff').val(),
		order:	order
	}
	// ��������������� ���� � ��������
	if(ps.num!=parseInt(ps.num) ||
		ps.name == '' ||
		ps.koff == ''){
			alert('����������� ������� ���������!')
			return false
	}
	positions[num] = ps
	fillPosEdit(num)
	countPosition(num)
	chMenu('tdsost')
	SaveData('positions')
	FillHeaders()
}

function chMenu(mid){

	switch (mid){
		case 'tdedit':
			$('th#tdsost,th#tddopt,th#tdkoff').addClass('back2').css('border-bottom','1px solid').attr('onMouseOut','this.className=\'back2\'')
			$('th#tdedit').addClass('back1').css('border-bottom','0px').attr('onMouseOut','this.className=\'back1\'')
			$('table#tablesost, table#tabledopt, div#divkoff').hide()
			$('div#divedit').show()
			break;
		case 'tdkoff':
			$('th#tdsost,th#tddopt,th#tdedit').addClass('back2').css('border-bottom','1px solid').attr('onMouseOut','this.className=\'back2\'')
			$('th#tdkoff').addClass('back1').css('border-bottom','0px').attr('onMouseOut','this.className=\'back1\'')
			$('table#tablesost, table#tabledopt, div#divedit').hide()
			$('div#divkoff').show()
			break;
		case 'tddopt':
			$('th#tdsost,th#tdedit,th#tdkoff').addClass('back2').css('border-bottom','1px solid').attr('onMouseOut','this.className=\'back2\'')
			$('th#tddopt').addClass('back1').css('border-bottom','0px').attr('onMouseOut','this.className=\'back1\'')
			$('table#tablesost, div#divedit, div#divkoff').hide()
			$('table#tabledopt').show()
			break;
		default:
			$('th#tdedit,th#tddopt,th#tdkoff').addClass('back2').css('border-bottom','1px solid').attr('onMouseOut','this.className=\'back2\'')
			$('th#tdsost').addClass('back1').css('border-bottom','0px').attr('onMouseOut','this.className=\'back1\'')
			$('table#tabledopt, div#divedit, div#divkoff').hide()
			$('table#tablesost').show()
	}
}
function close(){
	$('td#sostavplus').hide()
	$('td.back3:first').show()
	$('td.back4:first').show()
}

function krOpen(){
	$('td#sostavplus').show()
	$('td.back3:first').hide()
	$('td.back4:first').hide()
	if(sostavteam) $('a#sostav').attr('href','javascript:void(krOpen())')
	else $('a#sostav_n').attr('href','javascript:void(krOpen())')
}

function PrintTables(geturl) {
	krOpen()

	var html = '<div align=right><a href="javascript:void(close())">�������</a>&nbsp;</div>'
	html += '<div align=right><a href="javascript:void(PosDrop())" >�������� ����</a>&nbsp;</div>'
	html += '<table align=center id=tmenu width=98% class=back1 style="border-spacing:1px 0px" cellpadding=5><tr height=25>'
	html += '<td width=5 style="border-bottom:1px solid">&nbsp;</td>'
	html += '<th id=tdsost width=130 onmousedown="javascript:void(chMenu(\'tdsost\'))" style="border-top-left-radius:7px;border-top-right-radius:7px;border-top:1px solid;border-left:1px solid;border-right:1px solid" onMouseOver="this.className=\'back1\';this.style.cursor=\'pointer\'" onMouseOut="this.className=\'back1\'">������+</th>'
	html += '<th id=tddopt width=130 onmousedown="javascript:void(chMenu(\'tddopt\'))" style="border-top-left-radius:7px;border-top-right-radius:7px;border:1px solid;" class=back2 onMouseOver="this.className=\'back1\';this.style.cursor=\'pointer\'" onMouseOut="this.className=\'back2\'">���. �������</th>'
	html += '<th id=tdkoff width=130 onmousedown="javascript:void(chMenu(\'tdkoff\'))" style="border-top-left-radius:7px;border-top-right-radius:7px;border:1px solid;" class=back2 onMouseOver="this.className=\'back1\';this.style.cursor=\'pointer\'" onMouseOut="this.className=\'back2\'">�����������</th>'
	html += '<th id=tdedit width=130 onmousedown="javascript:void(chMenu(\'tdedit\'))" style="border-top-left-radius:7px;border-top-right-radius:7px;border:1px solid;" class=back2 onMouseOver="this.className=\'back1\';this.style.cursor=\'pointer\'" onMouseOut="this.className=\'back2\'">���������</th>'
	html += '<td style="border-bottom:1px solid;">&nbsp;</td><tr>'
	html += '<tr><td style="border-left:1px solid;border-right:1px solid;border-bottom:1px solid;" colspan=6>'
	html += '<br><table id=tablesost width=100% class=back1>' //#C9F8B7	#A3DE8F
	var nm = 25
	for(i=1;i<8;i++){
		html += '<tr id=tr'+i+' bgcolor=#BFDEB3>'
		var newtr = ''
		for(j=1;j<6;j++){
			var htmltd = ''
			if(i==1 && j==5) {
				htmltd += '<td valign=center height=90 class=back1 align=center>'
				htmltd += '<img height=90 src=/system/img/'
				if(sostavteam)	htmltd += (isNaN(parseInt(localStorage.myteamid)) ? 'g/team.gif' : 'club/'+localStorage.myteamid+'.gif')+'>'
				else 			htmltd += (isNaN(parseInt(localStorage.myintid)) ? 'g/int.gif' : 'flags/full'+(parseInt(localStorage.myintid)>1000 ? parseInt(localStorage.myintid)-1000 : localStorage.myintid)+'.gif')+'>'
				htmltd += '</td>'				
			} else if (i==1 && j==1){
				htmltd += '<td valign=top height=90 class=back1 align=center>'+ShowHelp()+'</td>'
			} else if (i>5 && j!=3){
				htmltd += '<td valign=top height=90 class=back1></td>'
			} else {
				htmltd += PrintTd(nm)
				nm--
			}
			newtr = htmltd + newtr
		}
		html += newtr + '</tr>'
	}
	html += '</table>'
	html += '<table id=tabledopt width=100% class=back1 style="display:none;"></table>'
	html += '<div id=divkoff style="display:none;"></div>'
	html += '<div id=divedit style="display:none;"></div>'
	html += '<br></td></tr></table><br><br>'
	$('td.back4').after('<td class=back4 id=sostavplus>'+html+'</td>')
}
function PrintAdditionalTables(){
	var html = '<tr><td>'
	html += '<table witdh=100% bgcolor=black><tr class=back2 align=center>'
	for(i=26;i<=maxtables;i++){
		html += PrintTd(i)
		if(i%5==0 && i!=25 && i!=(maxtables)) html += '</tr></table><br><table witdh=100% bgcolor=black><tr class=back2 align=center>'
	}
	html += '</tr></table>'
	html += '</td></tr>'
	$('table#tabledopt').html(html)
}

function PrintTd(num){
	var newhtml = '<td valign=top width=20% height=90 id=td'+num+'>'
	newhtml += '<table id=htable'+num+' width=100%><tr><td onmousedown="MouseOn(\''+num+'\')">'
	newhtml +=  '<div id=div'+num+'>'
	newhtml += 	 '<span id=span'+num+'>&nbsp;</span>'
	newhtml += 	 '<select hidden id=select'+num+' onchange="FillData(\''+num+'\')" class=back1 style="border:1px solid">'
	newhtml += 	 '</select>'
	newhtml +=  '</div>'
	newhtml += '</td><td id=links'+num+' align=right hidden>'
	newhtml +=  '<a href="javascript:void(showAll(\''+num+'\'))">*</a>'
	newhtml += '</td></tr></table>'
	newhtml += '</td>'
	return newhtml
}

function showAll(nt){
	if($('table#table'+nt+' tr[abbr*=wrong]:first').is(':visible')
		||$('table#table'+nt+' td[abbr*=hidden]:first').is(':visible')) {
			$('table#table'+nt+' tr[abbr*=wrong]').hide()
			$('table#table'+nt+' td[abbr*=hidden]').hide()
	} else{
			$('table#table'+nt+' tr[abbr*=wrong]').show()
			$('table#table'+nt+' td[abbr*=hidden]').show()
	}
}

function MouseOn(num){
//	if($('#select'+num).is(':visible'))
		$('#span'+num).hide()
		$('#links'+num).hide()
		$('#select'+num).show().select()
}
function MouseOff(num){
	if($('#select'+num).val()!=0) {
		$('#span'+num).html('<b>'+$('#select'+num+' option:selected').text()+'</b>')
		$('#links'+num).show()
	} else {
		$('#span'+num).html(positions[0].name)
	}
	$('#select'+num).hide()
	$('#span'+num).show()

}

function ShowHelp(){
	var html = ''
	html += '<table class=back2>'
	html += '<tr><th colspan=4>'+'HELP'.fontsize(1)+'</th></tr>'
	html += '<tr><td bgcolor=#FFFFFF colspan=2>'+'������'.fontsize(1)+'</td>'
	html += '<td bgcolor=#BABDB6 colspan=2>'+'� ������'.fontsize(1)+'</td></tr>'
	html += '<tr><td colspan=4><font color=red size=1>�� ���� �������</font></td></tr>'
	html += '<tr><td bgcolor='+fl[1]+'></td><td>'+'���'.fontsize(1)+'</td>'
	html += '<td bgcolor='+fl[2]+'></td><td>'+'���'.fontsize(1)+'</td></tr>'
	html += '<tr><td bgcolor='+fl[3]+'></td><td>'+'���<90'.fontsize(1)+'</td>'
	html += '<td bgcolor='+fl[4]+'></td><td>'+'���<80'.fontsize(1)+'</td></tr>'
	html += '<tr><td bgcolor='+fl[5]+'></td><td>'+'���'.fontsize(1)+'</td>'
	html += '<td bgcolor='+fl[6]+'></td><td><font color=888A85>'+'�����'.fontsize(1)+'</font></td>'
	html += '</tr>'
	html += '</table>'
	return html
}
