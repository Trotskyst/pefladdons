/**
 * Function and varibles for scripts with players
 * player, sostav and more..
 */

class Player {
    value = 1000;
    wage = 0;
    
    /** 
     * @param {boolean} full
     * @returns {string}
     */
    valueToString(full) { return Player.currencyToString(this.value, full ?? false); }
    /** 
     * @param {boolean} full
     * @returns {string}
     */
     wageToString(full) { return Player.currencyToString(this.wage, full ?? true); }
    /**
     * @param {number} value
     * @param {boolean} full
     * @returns {string}
     */
    static currencyToString(value, full) {
        full = full ?? false;
        value = parseInt(value) || 0;
        let nums = 0, postfix = '$';
        if (!full) {
            if (value >= 1000) {
                postfix = '�$';
                value = value/1000; // ������
            }
            if (value >= 1000) {
                postfix = '�$';
                nums = 1;
                value = value/1000; // ��������
            }
        }
        return value.toLocaleString("en-US",{maximumFractionDigits: nums}) + postfix;
    }
}

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

function checkKoff(kf0){
	let res = kf0.replace(/!/g,'')
	if(skillnames[res]==undefined){
        debug("checkKoff(kf0=%s)",kf0,)
		let custom = true
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

function clcFr(s0,clcNum) {
    if (clcNum >= 50) {
        console.warn('Count limit(50) is exceeded, current formula: %s, return 0',s0);
        return 0;
    }

	let regexpRemBracket = new RegExp('\\(([\-]?[0-9]+[\\.]?[0-9]*)\\)','g'),
    s = s0.replace(regexpRemBracket,"$1");

    $.each(["*","/","+","-"], function (index, value) {
        rexp = new RegExp('([\\-]?[0-9]+[\\.]?[0-9]*)([\\' + value + '])([\\-]?[0-9]+[\\.]?[0-9]*)');
        let m_res, m = s.match(rexp);
        if (m !== null) {
            switch (value) {
                case "*": m_res = parseFloat(m[1])*parseFloat(m[3]); break;
                case "/": m_res = parseFloat(m[1])/parseFloat(m[3]); break;
                case "+": m_res = parseFloat(m[1])+parseFloat(m[3]); break;
                case "-": m_res = parseFloat(m[1])-parseFloat(m[3]); break;
            }
            s = s.replace(m[0],m_res).replace(regexpRemBracket,"$1");
            return false;
        }
    })		
    if (s === s0) return s;
    return clcFr(s,clcNum++);
}

function countStrength(pkoff,pl) {
    const regxpFrm = new RegExp('\\=([0-9�-��-�a-zA-Z\\(\\)\\+\\*\\-\\/\\.\\!]+)','g');
    let res = [],    
    formula_sort = '(' + pkoff.match(regxpFrm).join(')+(').replace(/\=/g,'').replace(/\s/g,'') + ')',
    formula_strn = formula_sort,
    formula_keys = [...new Set(formula_sort.match(/[�-��-�a-zA-Z]+/g))]
    //names = pkoff.match(/([a-zA-Z�-��-�]+)=/g);
    //names = $.map(names, function(i) { return i.replace('=','');});

    $.each(formula_keys, function (index, value) {
        const reg = new RegExp(value, "g");
        let found = false,
        skval_sort = 0,
        skval_strn = 0;        
        for (let p in skillnames) { 
            let skill = skillnames[p];
            if ((skill.rshort ?? p) === value) {
                let skval = (
                    pl === undefined
                        ? skill.strmax ?? plskillmax
                        : parseFloat(pl[p] ?? 0)
                );
                skval = skval - (skill.strinvert ?? 0);                
                skval_sort = isNaN(skval) ? 0 : skval;
                skval_strn = !skill.str || isNaN(skval) ? 0 : skval;
                found = true;
                break;
            }
        }
        if (!found) {
            debug("Key %s not found in skillnames",value);
            checkKoff(value);
            if (pl!=undefined && pl[value] !== undefined) {
                let skval =  parseFloat(pl[value] ?? 0);
                skval = skval - (skill.strinvert ?? 0);                
                skval_sort = isNaN(skval) ? 0 : skval;
                skval_strn = !skill.str || isNaN(skval) ? 0 : skval;
            } else {
                console.warn("Key %s not found in skillnames, replaced by 0",value);                
            }
        }
        formula_sort = formula_sort.replace(reg, "(" + skval_sort  + ")");
        formula_strn = formula_strn.replace(reg, "(" + skval_strn + ")");
    });
    res.push(clcFr(formula_strn,0));
    if (formula_strn != formula_sort) res.push(clcFr(formula_sort,0));
    return res;
}