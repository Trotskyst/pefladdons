/**
 * Function and varibles for scripts with players
 * player, sostav and more..
 */

let positions = [],
plskillmax = 15,
skillnames = {
	sor:{rshort:'���',rlong:'����������',hidden:true},
    sostav: {rshort: '��', rlong: '����� � ������?', strmax: 0},
    flag: {rshort: '��', rlong: '�������������� ����'},
    pfre: {rshort: '��', rlong: '����������� ��������',str:true},
    pcor: {rshort: '��', rlong: '����������� �������',str:true},
    ppen: {rshort: '��', rlong: '����������� ��������',str:true},
    pcap: {rshort: '��', rlong: '��������',str:true},
  
    school: {rshort: '���', rlong: '��������?', strmax: 0, strinvert: 1},
    srt: {rshort: '����', rlong: '� % �� ������', type: 'float'},
    stdat: {rshort: '��', rlong: '���� �� ���. �����'},
    stdbk: {rshort: '��', rlong: '���� �� ���. �������'},
    nation: {rshort: '���', rlong: '��� ������'},
	natflag:{rshort:'��',rlong:'���� ������',type:'flag',state:3},
    teamnat: {rshort: '�C�', rlong: '��� ������'},
    natfull: {rshort: '���', rlong: '������', align: 'left', nowrap: '1'},
    sname:{rshort:'���',rlong:'�������',align:'left',nowrap:'1'},
	fname:{rshort:'���',rlong:'���',align:'left',nowrap:'1'},
    age: {rshort: '���', rlong: '�������', str: true, strmax: 40},
    id: {rshort: 'id', rlong: 'id ������'},
	value: {rshort: '���', rlong: '�������', type: 'value',str:true, strmax: 50000000},
	morale: {rshort: '���', rlong: '������', str: true, strmax: 100},
    form: {rshort: '���', rlong: '�����', str: true, strmax: 100},
	inj: {rshort: '���', rlong: '������', str: true, strmax: 0, strinvert: 20},
    sus: {rshort: '���', rlong: '���������������', str: true, strmax: 0, strinvert: 20},
    syg: {rshort: '���', rlong: '�����������', str: true, strmax: 20},
	miss:{rshort:'��',rlong:'��������� ������',str:true,state:3},
	position: {rshort: '���', rlong: '�������', align: 'left', nowrap: '1'},    
	//skills
    corners: {rshort: '��', rlong: '�������', str: true},
    crossing: {rshort: '��', rlong: '������', str: true},
    dribbling: {rshort: '��', rlong: '��������', str: true},
    finishing: {rshort: '��', rlong: '�����', str: true},
    freekicks: {rshort: '��', rlong: '��������', str: true},
    handling: {rshort: '��', rlong: '���� ������', str: true},
    heading: {rshort: '��', rlong: '���� �������', str: true},
    leadership: {rshort: '��', rlong: '���������', str: true},
    longshots: {rshort: '��', rlong: '������� �����', str: true},
    marking: {rshort: '��', rlong: '����. �����', str: true},
    pace: {rshort: '��', rlong: '��������', str: true},
    passing: {rshort: '��', rlong: '���� � ���', str: true},
    positioning: {rshort: '��', rlong: '����� �������', str: true},
    reflexes: {rshort: '��', rlong: '�������', str: true},
    stamina: {rshort: '��', rlong: '������������', str: true},
    strength: {rshort: '��', rlong: '����', str: true},
    tackling: {rshort: '��', rlong: '����� ����', str: true},
    vision: {rshort: '��', rlong: '������� ����', str: true},
    workrate: {rshort: '��', rlong: '�����������������', str: true},
    technique: {rshort: '��', rlong: '�������', str: true},
	//depricated
	natfull:{rshort:'���',rlong:'������',align:'left',nowrap:'1',state:2},
	internationalapps:{rshort:'���',rlong:'��� �� �������',str:true,strmax:500, state:2},
	internationalgoals:{rshort:'���',rlong:'����� �� �������',str:true,strmax:500, state:2},
	contract:{rshort:'���',rlong:'��������',str:true,strmax:5, state:2},
	wage:{rshort:'���',rlong:'��������',str:true,strmax:100,strinvert:100100, state:2}
},
list = {
	positions: 'id,filter,name,num,koff,order'
}

function clcFr(s0,clcNum) {
	let m,
    regexpRemBracket = new RegExp('\\(([\-]?[0-9]+[\\.]?[0-9]*)\\)','g'),
    s = s0.replace(regexpRemBracket,"$1");

    $.each(["*","/","+","-"], function (index, value) {
        rexp = new RegExp('([\\-]?[0-9]+[\\.]?[0-9]*)([\\' + value + '])([\\-]?[0-9]+[\\.]?[0-9]*)');
        m = s.match(rexp);
        if (m !== null) {
            switch (value) {
                case "*": s = s.replace(m[0],(parseFloat(m[1])*parseFloat(m[3]))).replace(regexpRemBracket,"$1");break;
                case "/": s = s.replace(m[0],(parseFloat(m[1])/parseFloat(m[3]))).replace(regexpRemBracket,"$1");break;
                case "+": s = s.replace(m[0],(parseFloat(m[1])+parseFloat(m[3]))).replace(regexpRemBracket,"$1");break;
                case "-": s = s.replace(m[0],(parseFloat(m[1])-parseFloat(m[3]))).replace(regexpRemBracket,"$1");break;
            }
            return false;
        }
    })		
    if (s === s0) return s;
    if (clcNum >= 50) return 0;
    clcNum++;
    return clcFr(s,clcNum);
}