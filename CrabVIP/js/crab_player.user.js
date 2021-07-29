// ==UserScript==
// @name           peflplayer
// @namespace      pefl
// @description    modification player page and school boys
// @include        http://*pefl.*/plug.php?p=refl&t=p*
// @include        http://*pefl.*/plug.php?p=refl&t=yp*
// @require			crab_funcs_db.js
// @require			crab_funcs_std.js
// @encoding	   windows-1251
// ==/UserScript==
/**/

var ff = (navigator.userAgent.indexOf('Firefox') !== -1)
var db = false
var positions = []
var list = {
    positions: 'id,filter,name,num,koff'
}
var isOldRoster = false;

var players = []
for (i = 0; i < 26; i++) players[i] = []

//var skl = []
//var sklse = []
//var sklsr = []
var sklfr = []
//var poss = []
var compare = false
var mh = false

var ups = {
    "a0e": "-2",
    "a1e": "-1",
    "a2e": "1",
    "a3e": "2",
    "a5e": "3",
    "a6e": "-3",
    "next": "-3",
    "last": "3",
    "undefined": "0"
}
var plskillmax = 15
var skillnames = {
    sostav: {rshort: '��', rlong: '����� � ������?'},
    flag: {rshort: '��', rlong: '�������������� ����'},
    pfre: {rshort: '��', rlong: '����������� ��������'},
    pcor: {rshort: '��', rlong: '����������� �������'},
    ppen: {rshort: '��', rlong: '����������� ��������'},
    pcap: {rshort: '��', rlong: '��������'},
    //��
    school: {rshort: '���', rlong: '��������?'},
    srt: {rshort: '����', rlong: '� % �� ������ (����� ' + plskillmax + ')', type: 'float'},
    stdat: {rshort: '��', rlong: '���� �� ���. �����'},
    stdbk: {rshort: '��', rlong: '���� �� ���. �������'},
    nation: {rshort: '���', rlong: '��� ������'},
    teamnat: {rshort: '�C�', rlong: '��� ������'},
    natfull: {rshort: '���', rlong: '������', align: 'left', nowrap: '1'},
    secondname: {rshort: '���', rlong: '�������', align: 'left', nowrap: '1'},
    firstname: {rshort: '���', rlong: '���', align: 'left', nowrap: '1'},
    age: {rshort: '���', rlong: '�������', str: true, strmax: 40},
    id: {rshort: 'id', rlong: 'id ������'},
    internationalapps: {rshort: '���', rlong: '��� �� �������', str: true, strmax: 500},
    internationalgoals: {rshort: '���', rlong: '����� �� �������', str: true, strmax: 500},
    contract: {rshort: '���', rlong: '��������', strmax: 5},
    wage: {rshort: '���', rlong: '��������', strmax: 100, strinvert: 1000100},
    value: {rshort: '���', rlong: '�������', type: 'value', strmax: 50000000},
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
    morale: {rshort: '���', rlong: '������', str: true, strmax: 100},
    form: {rshort: '���', rlong: '�����', str: true, strmax: 100},
    position: {rshort: '���', rlong: '�������', align: 'left', nowrap: '1'},
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
    inj: {rshort: '���', rlong: '������'},
    sus: {rshort: '���', rlong: '���������������'},
    syg: {rshort: '���', rlong: '�����������'},
    /**
     agames
     agoals
     apasses
     amom
     /**/
}

function printStrench() {
    if (positions.length === 0) return false;
    let poses = [];
    for (let f in positions) {
        for (let j in positions[f].pls) {
            if (positions[f].pls[j].id0) {
                let srt = (positions[f].pls[j].srt !== undefined
                    ? positions[f].pls[j].srt
                    : positions[f].pls[j]['!srt']);
                let plx = {};
                plx.name = positions[f].name;
                plx.filter = positions[f].filter;
                plx.srt = srt + (positions[f].pls[j].posf ? 1000 : 0) + (positions[f].pls[j].posfempty ? -2000 : 0);
                plx.strench = srt;
                if (!isNaN(plx.srt)) poses.push(plx);
            }
        }
    }
    poses = poses.sort(sSrt);
    let hidden = 0;
    let txt = '';
    for (let i in poses) {
        if (poses[i].srt < 1000 && hidden === 0) hidden = 1;
        if (hidden === 1) {
            hidden = 2;
            txt += '<a id="mya" href="javascript:void(OpenAll())">...</a><br><div id="mydiv" style="display: none;">';
        }
        if (poses[i].srt < -500 && hidden === 2) {
            hidden = 3;
            txt += '</div><div>';
        }
        txt += (String(poses[i].name)[0] === '!'
            ? ''
            : '<div title="' + poses[i].filter + '">' + (poses[i].strench).toFixed(2) + ': ' + (poses[i].name).replace(/\s/g, '&nbsp;') + '</div>')
    }
    txt += '</div>';
    $('div#str').html(txt)
}

function sSrt(i, ii) { // �� ��������
    let s = (i.srt !== undefined ? 'srt' : '!srt')
    if (i[s] < ii[s]) return 1
    else if (i[s] > ii[s]) return -1
    return 0
}

function GetData(dataname) {
    var needsave = false
    var data = []
    var head = list[dataname].split(',')
    var text1 = String(localStorage[dataname])
    if (text1 !== 'undefined' && text1 !== 'null') {
        var text = text1.split('#')
        var numpos = 0
        for (i in text) {
            var x = text[i].split('|')
            var curt = {}
            var num = 0
            for (j in head) {
                curt[head[j]] = (x[num] !== undefined ? x[num] : '')
                num++
            }
            data[numpos] = curt
            numpos++
        }
        switch (dataname) {
            case 'positions':
                positions = data;
                break
            default:
                return false
        }
        for (i = 1; i < positions.length; i++) {
            countPosition(i)
        }
    }
}

function filterPosition(plpos, flpos) {
    var pos = flpos.split(' ')
    var pos0 = false
    var pos1 = false
    if (pos[1] === undefined) {
        pos1 = true
        if (plpos.indexOf(pos[0]) !== -1) pos0 = true
    } else {
        for (k = 0; k < 3; k++) if (plpos.indexOf(pos[0][k]) !== -1) pos0 = true
        pos1arr = pos[1].split('/')
        for (k in pos1arr) if ((plpos.indexOf(pos1arr[k]) !== -1)) pos1 = true
    }
    return (pos0 && pos1)
}

function countPosition(posnum) {
    var ps = positions[posnum]
    ps.strmax = countStrength('ideal', ps.koff)
    var pls = []
    for (j in players) {
        var pl = {};
        if (parseInt(j) === 0) {
            pl.id0 = true
        }
        pl.id = players[j].id
        if (pl.id === undefined) break
        var pkoff = ps.koff.split(',')
        for (h in pkoff) {
            var koff = String(pkoff[h].split('=')[0])
            if (skillnames[koff] === undefined) for (l in skillnames) if (skillnames[l].rshort === koff.replace(/\!/g, '')) koff = koff.replace(skillnames[l].rshort, l)
            pl[koff] = (players[j][koff.replace(/\!/g, '')] === undefined ? 0 : players[j][koff.replace(/\!/g, '')])
        }
        pl.posf = filterPosition(players[j].position, ps.filter)
        if (ps.filter === '') pl.posfempty = true
        var s = (pl.srt != undefined ? 'srt' : (pl['!srt'] != undefined ? '!srt' : ''))
        if (s != '' && pl[s] != undefined) pl[s] = (ps.strmax === 0 ? 0 : (countStrength(j, ps.koff) / ps.strmax) * 100)

        pls.push(pl)
    }
    positions[posnum].pls = pls.sort(sSrt)
}

function checkKoff(kf0) {
    var res = kf0.replace(/!/g, '')
    if (skillnames[res] === undefined) {
        var custom = true
        for (h in skillnames) {
            if (skillnames[h].rshort === res) {
                custom = false
                res = h
            }
        }
        if (custom) {
            skillnames[res] = {}
            skillnames[res].rshort = res
            skillnames[res].rlong = 'Custom ��������'
            skillnames[res].type = 'custom'
        }
    }
    return res
}

function changeValue(formula, name, value) {
    if (formula.indexOf(name) !== -1 && name !== '') {
        var reg = new RegExp(name, "g")
        formula = formula.replace(reg, value)
    }
    return formula
}

function countStrength(plid, pkoff) {
    var pl = (plid === 'ideal' ? players[0] : players[plid])
    pkoff = pkoff.split(',')
    var res = 0
    for (n in pkoff) {
        var count = 0
        var koff = pkoff[n].split('=')
        var koffname = checkKoff(koff[0])
        if (koff[1] !== undefined) {
            count = koff[1].replace(/\s/g, '')
            for (p in pl) {
                var plp = (isNaN(parseInt(pl[p])) ? 0 : parseInt(pl[p]))
                var skill = (plid === 'ideal' ? (skillnames[p] != undefined && skillnames[p].strmax != undefined ? skillnames[p].strmax : plskillmax) : plp)
                skill = '(' + (skill - (skillnames[p] != undefined && skillnames[p].strinvert != undefined ? skillnames[p].strinvert : 0)) + ')'
                count = changeValue(count, p, skill)
                count = (skillnames[p] != undefined ? changeValue(count, skillnames[p].rshort, skill) : count)
            }
            for (p in skillnames) {
                count = changeValue(count, p, 0)
                count = changeValue(count, skillnames[p].rshort, 0)
            }
            var countval = 0
            if (count != undefined) {
                try {
                    countval = eval(count)
                } catch (e) {
                    return 0
                }
            }
            if (plid != 'ideal' && skillnames[koffname].type === 'custom') {
                players[plid][koffname] = countval
            }
            res += countval
        }
    }
    return res
}

function RelocateGetNomData(arch) {
    if (arch === undefined) arch = '';
    if (localStorage.getnomdata !== undefined && String(localStorage.getnomdata).indexOf('1.1$') !== -1) {
        GetNomData(0)
        //GetFinish('getnomdata', true)
    } else {
        const top = (localStorage.datatop !== undefined ? localStorage.datatop : 9885110); //9107893
        const url_top = 'm=posts' + arch + '&p=' + top;

        if ($('#debval').length === 0) $('td.back4').prepend('<div style="display: none;" id=debval></div>')
        $('div#debval').load('forums.php?' + url_top + ' td.back3:contains(#CrabNom1.1.' + top + '#) blockquote pre', function () {
            if ($('#debval').html() === '' && arch === '') {
                RelocateGetNomData('&arch=1')
            } else {
                $('div#debval').find('hr').remove()
                var data = $('#debval pre').html().split('#').map(function (val, i) {
                    return val.split('<br>').map(function (val2, i2) {
                        return $.grep(val2.split('	'), function (num, index) {
                            return !isNaN(index)
                        })
                    })
                })
                let text = '';
                let nm = []
                for (let i in data) {
                    var x = []
                    for (let j in data[i]) x[j] = data[i][j].join('!')
                    nm[i] = x.join('|')
                }
                text = nm.join('#')
                localStorage.getnomdata = '1.1$' + text.replace('Code', '')
                GetNomData(0)
                //GetFinish('getnomdata', true)
            }
        })
    }
}

function GetNomData(id) {
    var sdata = []
    var pl = players[id]
    var tkp = 0
    var fp = {}
    var svalue = 0
    var kpkof = 1.1
    var plnom = []
    nm = String(localStorage.getnomdata).split('$')[1].split('#')
    for (i in nm) {
        sdata[i] = []
        x = nm[i].split('|')
        for (j in x) {
            sdata[i][j] = x[j].split('!')
        }
    }
    kpkof = parseFloat(sdata[0][0][0])

    var saleAge = 0
    var ages = (sdata[0][0][1] + ',100').split(',')
    for (i in ages) if (pl.age < ages[i]) {
        saleAge = i;
        break;
    }

    var saleValue = 0
    var vals = ('0,' + sdata[0][0][2] + ',100000').split(',')
    for (i in vals) if (pl.value < vals[i] * 1000) {
        saleValue = i - 1;
        break;
    }

    fp.av = parseFloat(sdata[0][saleValue + 1][0])
    fp.mn = parseFloat(sdata[0][saleValue + 1][1])
    fp.mx = parseFloat(sdata[0][saleValue + 1][2])
    var saleNom = ''
    var t = 0
    for (i = 1; i < sdata.length; i++) {
        for (n in sdata[i]) {
            if (isNaN(parseInt(sdata[i][n][0])) && TrimString(sdata[i][n][0]) != '') {
                t++
                plnom[t] = {psum: 0, tkp: sdata[i][saleValue][saleAge]}

                var pos1 = (sdata[i][n][0].split(' ')[1] != undefined ? sdata[i][n][0].split(' ')[0] : '')
                if (pos1 === '') plnom[t].pos1 = true
                else for (h in pos1) if (pl.position.indexOf(pos1[h]) != -1) plnom[t].pos1 = true

                var pos2 = (sdata[i][n][0].split(' ')[1] === undefined ? TrimString(sdata[i][n][0].split(' ')[0]) : sdata[i][n][0].split(' ')[1]).split('/')
                for (h in pos2) if (pl.position.indexOf(pos2[h]) != -1) plnom[t].pos2 = true

                if (plnom[t].pos1 && plnom[t].pos2) {
                    plnom[t].psum = 1
                    plnom[t].id = t
                    plnom[t].pos = sdata[i][n][0]
                    var count = 0
                    for (j = 1; j < sdata[i][n].length; j++) {
                        var kof = parseFloat(sdata[i][n][j].split('-')[0])
                        var skil = parseInt(pl[sdata[i][n][j].split('-')[1]])
                        //var skil = parseInt(pl[skl[sdata[i][n][j].split('-')[1]]])
                        if (!isNaN(skil)) {
                            plnom[t].psum = plnom[t].psum * Math.pow((skil < 1 ? 1 : skil), kof)
                            count += kof
                        }
                    }
                    plnom[t].psum = Math.pow(plnom[t].psum, 1 / count)
                }
            }
        }
    }
    plnom = plnom.sort(sNomPsum)
    fp.res = plnom[0].psum / fp.av
    fp.res = (fp.res < fp.mn ? fp.mn : (fp.res > fp.mx ? fp.mx : fp.res))
    tkp = plnom[0].tkp / 100
    if (plnom[1].psum != 0 && ((plnom[0].psum / plnom[1].psum) < kpkof)) {
        tkp = Math.max(plnom[0].tkp, plnom[1].tkp) / 100
    }
    svalue = parseInt(pl.value * tkp * fp.res / 1000)
    svalue = (svalue === 0 ? 1 : svalue)
    $('div#SValue').html('~<font size=2>' + ShowValueFormat(svalue) + '</font>')
}

function sNomPsum(i, ii) { // ����������
    if (i.psum < ii.psum) return 1
    else if (i.psum > ii.psum) return -1
    else return 0
}

function ShowValueFormat(value) {
    if (value > 1000) return (value / 1000).toFixed(3).replace(/\./g, ',') + ',000$'
    else return (value) + ',000$'
}

function ShowAdaptation(plnat, tnat) {
    if (String(localStorage.mycountry) != 'undefined' && plnat != undefined && plnat != ' ') {
        $.getScript("js/adaptation5.en.js", function () {
            var peflnation = {
                '�������': 1,
                '�����': 2,
                '��������� �����': 3,
                '�������': 4,
                '������': 5,
                '��������': 6,
                '�������': 7,
                '���������': 8,
                '�������': 9,
                '�����': 10,
                '���������': 11,
                '�������': 12,
                '�����������': 13,
                '������': 14,
                '�������': 15,
                '���������': 16,
                '��������': 17,
                '��������': 18,
                '�������': 19,
                '�����': 20,
                '�����': 21,
                '�������': 22,
                '�����': 23,
                '�������': 24,
                '������': 25,
                '��������': 26,
                '��������': 27,
                '���������� �-��': 28,
                '������': 29,
                '��������': 30,
                '������� ����': 31,
                '�������': 32,
                '��������': 34,
                '�������': 35,
                '������': 36,
                '����-�����': 37,
                '��������� �-��': 38,
                '���': 39,
                '���': 40,
                '����': 41,
                '�����': 42,
                '�������': 43,
                '��������': 44,
                '�����': 45,
                '�-�� ����': 46,
                '����� ����': 47,
                '��������': 48,
                '����': 49,
                '����': 50,
                '�����': 51,
                '�����': 53,
                '�������': 54,
                '��������': 55,
                '������������� �-��': 56,
                '�������': 58,
                '������': 59,
                '���������': 60,
                '������': 61,
                '���. ������': 62,
                '�������': 63,
                '�������': 64,
                '�������': 65,
                '���������': 66,
                '��������� �-��': 67,
                '�����': 68,
                '���������': 69,
                '�������': 70,
                '�����': 71,
                '������': 72,
                '������': 73,
                '��������': 74,
                '����': 75,
                '������': 76,
                '�������': 77,
                '����': 78,
                '���������': 79,
                '������': 80,
                '������-�����': 81,
                '������': 82,
                '�����': 83,
                '���������': 84,
                '��������': 85,
                '���-����': 86,
                '�������': 87,
                '��������': 88,
                '�����': 89,
                '���������': 90,
                '����': 91,
                '����': 92,
                '��������': 93,
                '�������': 94,
                '������': 95,
                '���`�`�����': 96,
                '������': 97,
                '������': 98,
                '��������': 99,
                '���������': 100,
                '�����': 101,
                '������': 102,
                '��������': 103,
                '����': 104,
                '������': 105,
                '�����': 106,
                '������': 107,
                '�������': 108,
                '�����': 109,
                '�����������': 110,
                '�����': 111,
                '����������': 112,
                '�����': 113,
                '����������': 114,
                '������': 115,
                '��������': 116,
                '��������': 117,
                '����': 118,
                '������': 119,
                '����������': 120,
                '��������': 121,
                '�������': 122,
                '�������': 123,
                '��������': 124,
                '���������': 125,
                '�������': 126,
                '��������': 127,
                '�������': 128,
                '�������� ��������': 129,
                '�������': 130,
                '�����': 131,
                '�������': 132,
                '����� ���������': 133,
                '����� ��������': 134,
                '���������': 135,
                '�����': 136,
                '�������': 137,
                '�������� �����': 138,
                '��������': 139,
                '����': 140,
                '��������': 141,
                '���������': 142,
                '������': 143,
                '����� ����� ������': 144,
                '��������': 145,
                '����': 147,
                '���������': 148,
                '������': 149,
                '����������': 150,
                '������-����': 151,
                '�����': 152,
                '�� �����': 153,
                '�������': 154,
                '������': 155,
                '������': 156,
                '���. �����': 157,
                '���-������': 158,
                '����': 159,
                '���������� ������': 160,
                '���������': 161,
                '�������': 162,
                '����������� �-��': 163,
                '������-�����': 164,
                '��������': 165,
                '��������': 166,
                '��������': 167,
                '���������� �-��': 168,
                '������': 169,
                '���': 170,
                '����� �����': 171,
                '�������': 172,
                '���-�����': 173,
                '����-�����': 174,
                '�����': 175,
                '����-�������': 176,
                '�����': 177,
                '�������': 178,
                '���������': 179,
                '������': 180,
                '���������': 181,
                '�����': 182,
                /**'�����':183,    //����������� 216��/**/'�����������': 184,
                '��������': 185,
                '�������': 186,
                '����': 188,
                '�����': 189,
                '�������� � ������': 190,
                '�����': 191,
                '������': 192,
                '������������': 193,
                '������': 194,
                '���': 195,
                '���': 196,
                '������': 199,
                '�������': 200,
                '�������': 201,
                '����������': 202,
                '�������': 203,
                '���������': 204,
                '�������': 205,
                '�����': 207,
                '�����': 208,
                '������': 209,
                '����': 153,
                /** 210, �� ��� �� ����� - ������� �������� �� ��� id/**/'������': 211,
                '��������': 212,
                '���������': 213,
                '����������': 214,
                '��������� �������': 215,
                '�����': 216,
                '����������': 217
            }
            var peflcountry = {
                1: 0,
                2: 1,
                8: 2,
                9: 3,
                11: 4,
                12: 5,
                13: 6,
                18: 7,
                19: 8,
                24: 9,
                25: 10,
                27: 11,
                30: 12,
                41: 13,
                42: 14,
                44: 15,
                47: 16,
                48: 17,
                50: 18,
                51: 19,
                53: 20,
                58: 21,
                59: 22,
                61: 23,
                64: 24,
                66: 25,
                69: 26,
                70: 27,
                73: 28,
                74: 29,
                76: 30,
                84: 31,
                87: 32,
                88: 33,
                91: 34,
                93: 35,
                94: 36,
                95: 37,
                98: 38,
                100: 39,
                105: 40,
                111: 41,
                122: 42,
                123: 43,
                126: 44,
                129: 45,
                137: 46,
                139: 47,
                145: 48,
                147: 49,
                149: 50,
                150: 51,
                152: 52,
                154: 53,
                155: 54,
                160: 55,
                161: 56,
                166: 57,
                167: 58,
                170: 59,
                171: 60,
                172: 61,
                180: 62,
                181: 63,
                191: 64,
                192: 65,
                195: 66,
                196: 67,
                200: 68,
                201: 69,
                202: 70,
                204: 71,
                96: 72,
                207: 73,
                209: 74,
                214: 75
            }
            var ad = s_adaptationMap[peflnation[plnat]][peflcountry[parseInt(localStorage.mycountry)]]
            var adperc1 = '%';
            var adperc2 = '%';
            var txt = '<table width=100%><tr align=left><td>���������</td><th>' + plnat + '</th></tr>';
            txt += '<tr align=left><th>' + localStorage.mycountry.split('.')[1] + '</th><td>' + (ad === 100 ? '99,9' : (ad * 6 + 20) / 10 + '%-' + (ad * 6 + 400) / 10) + '% (' + ad + ')</td></tr>'
            if (tnat != undefined && tnat != parseInt(localStorage.mycountry)) {
                var tad = s_adaptationMap[peflnation[plnat]][peflcountry[tnat]]
                for (i in peflnation) if (parseInt(peflnation[i]) === parseInt(tnat)) var natname = i;
                txt += '<tr align=left><th>' + natname + '</th><td>' + (tad === 100 ? '99,9' : (tad * 6 + 20) / 10 + '%-' + (tad * 6 + 400) / 10) + '% (' + tad + ')</td></tr>'
            }
            txt += '</table>';
            $("#crabright").append('<br><br>' + txt)
        });
    }
}

function SetValue(vl, vlch) {
    if (UrlValue('t') === 'p') {
        if (ff) {
            var text1 = String(localStorage['players']).split('#');
            for (i in text1) {
                if (parseInt(text1[i].split('|')[0]) === players[0].id) {
                    var text2 = text1[i].split('|');
                    text2[7] = vl;
                    text2[8] = vlch;
                    text1[i] = text2.join('|');
                }
            }
            localStorage['players'] = text1.join('#');
        } else {
            if (!db) DBConnect()
            db.transaction(function (tx) {
                tx.executeSql("UPDATE players SET value='" + vl + "', valuech='" + vlch + "' WHERE id='" + players[0].id + "'", []);
            })
        }
    }
}

function GetValue() {
    if (localStorage.myteamid === players[0].teamid) {
        var list = {'players': 'id,tid,num,form,morale,fchange,mchange,value,valuech,name'}
        var head = list['players'].split(',')
        if (ff) {
            var text1 = String(localStorage['players'])
            if (text1 !== 'undefined') {
                var text = text1.split('#')
                for (i in text) {
                    var x = text[i].split('|')
                    var curt = {}
                    var num = 0
                    for (j in head) {
                        curt[head[j]] = (x[num] !== undefined ? x[num] : '')
                        num++
                    }
                    if (curt['id'] === players[0].id) UpdateValue(parseInt(curt['value']), parseInt(curt['valuech']))
                }
            }
        } else {
            if (!db) DBConnect()
            db.transaction(function (tx) {
                tx.executeSql("SELECT * FROM players", [],
                    function (tx, result) {
                        for (var i = 0; i < result.rows.length; i++) {
                            var row = result.rows.item(i)
                            if (row['id'] === players[0].id) UpdateValue(row['value'], row['valuech'])
                        }
                    }
                );
            })
        }
    }
}

function UpdateValue(vl, vlch) {
    if (vl === 0) {
        SetValue(players[0].value, 0)
    } else {
        if (vl !== players[0].value) {
            players[0].valuech = players[0].value - vl
            SetValue(players[0].value, players[0].valuech)
        } else {
            players[0].valuech = vlch
        }
        if (players[0].valuech !== 0 && !isNaN(players[0].valuech)) PrintValue(players[0].valuech)
    }
}

function PrintValue(vlch) {
    /**
     var ttext = $('td.back4 table center:first').html().split('<br>')
     for(i in ttext){
		if(ttext[i].indexOf('�������')!=-1) ttext[i]=ttext[i]+(vlch==0?'':' <sup>'+(vlch>0 ? '<font color=green>+'+vlch/1000 : '<font color=red>'+vlch/1000)+'</font></sup>')
	}
     $('td.back4 table center:first').html(ttext.join('<br>'))
     /**/
}

function ShowCar(n) {
    if ($('a#th2').html() === '+') {
        $('tr#carpl' + n).show()
        $('a#th2').html('&ndash;')
    } else {
        $('tr#carpl' + n).hide()
        $('a#th2').html('+')
    }
}

function ShowTable(n) {
    var style = $('td.back4 table table:not(#plheader):eq(' + n + ')').attr('style')
    if (style === "display: none" || style == "display: none;" || style === "display: none; ") {
        $('td.back4 table table:not(#plheader):eq(' + n + ')').show()
        $('a#th' + n).html('&ndash;')
    } else {
        $('td.back4 table table:not(#plheader):eq(' + n + ')').hide()
        $('a#th' + n).html('+')
    }
}

function hist(rcode, rtype) {
    window.open('hist.php?id=' + rcode + '&t=' + rtype, '�������', 'toolbar=0,location=0,directories=0,menuBar=0,resizable=0,scrollbars=yes,width=480,height=512,left=16,top=16');
}


function sSkills(i, ii) { // ����������
    if (i[0] < ii[0]) return 1
    else if (i[0] > ii[0]) return -1
    else return 0
}

function ShowAll() {
    $('td.back4 table:first table:not(#plheader):first td').each(function () {
        $(this).removeAttr('class').find('img').removeAttr('style')
    })
}

function ShowSkills(skl) {
    ShowAll()
    if (compare === true) {
        $('td.back4 table:first table:not(#plheader):first td').each(function (i, val) {
            if (i % 3 === 0 && skl.indexOf($(val).find('script').remove().end().html().replace(/<!-- [�-�] -->/g, '')) === -1) {
                $(val).attr('class', 'back1')
                    .next().attr('class', 'back1').find('img').hide().end()
                    .next().attr('class', 'back1').find('img').hide();
            }
        })
    } else {
        $('td.back4 table:first table:not(#plheader):first td:even').each(function () {
            if (skl.indexOf($(this).find('script').remove().end().html().replace(/<!-- [�-�] -->/g, '')) === -1) {
                $(this).attr('class', 'back1')
                    .next().attr('class', 'back1').find('img').hide();
            }
        })
    }
}

function OpenAll() {
    if ($("#mydiv").attr('style')) $("#mydiv").removeAttr('style')
    else $("#mydiv").hide()
}

function RemovePlx(rem) {
    if (rem !== 0) players.splice(rem, 1);
    RememberPl(1); // !=1: save w\o player0
    PrintPlayers();
}

function PrintPlayers(cur) {
    $('div#compare').empty()
    let htmltext = '<table border=0 width=100% rules=none>';
    for (i = 0; i < players.length; i++) {
        if ((i > 0 || cur === 0) && players[i].secondname !== undefined) {
            var secname = String(players[i].secondname).split(' ')
            var fname = String(players[i].firstname)
            var plhref = (players[i].t === undefined || players[i].t === 'yp' ? '' : ' href="plug.php?p=refl&t=' + players[i].t + '&j=' + players[i].id + '&z=' + players[i].hash + '"')
            htmltext += '<tr><td nowrap><font size=1>'
            htmltext += '<a id="compare' + i + '" href="javascript:void(CheckPlayer' + (isOldRoster ? 'Old' : '') + '(' + i + '))"><</a>|'
            htmltext += '<a href="javascript:void(RemovePlx(' + i + '))">x</a>|'
            htmltext += '<a' + (players[i].t === 'yp' ? '' : ' href="javascript:hist(\'' + players[i].id + '\',\'n\')"') + '>�</a>|'
            htmltext += players[i].id + '|'
            htmltext += '<a' + plhref + '>' + secname[secname.length - 1] + (players[i].t === undefined || players[i].t === 'yp' ? '(' + players[i].position + ')' : '') + '</a>'
            htmltext += '</font></td></tr>'
        }
    }
    htmltext += '</table>'
    $('div#compare').append(htmltext)
}

function RememberPl(x) {
    // Save data
    let mark = 1;
    let text = '';
    for (let k in players) {
        if (players[k].id !== undefined && ((k > 0 && mark <= 25) || (k === 0 && x === 0))) {
            for (let i in players[k]) text += i + '_' + mark + '=' + players[k][i] + ','
            mark++
        }
    }
    localStorage.peflplayer = text
    if (x === 0) PrintPlayers(0)
    else PrintPlayers()
}

function CheckPlayerOld(nn) {
    // Get data and compare players
    ShowAll()
    $('a#codeforforum').show()

//	$('a[id="th2"]').html('+')
    $('div#kar, div#plst, #th2, table#ph0, table#plst, table#debug').remove()

    $('td.back4').prepend('<div align="right">(<a href="' + window.location.href + '">x</a>)&nbsp;</div>')
    $('a#remember, a[id^="compare"]').removeAttr('href')
    compare = true

    var header = '<table width=100% id="plheader">'
    // ���, �������
    header += '<tr align=center><td width=50% valign=top>'
    header += '<b>' + players[0].firstname + ' ' + players[0].secondname + '</b>'
    header += (players[0].teamid !== undefined ? ' (<a href="plug.php?p=refl&t=k&j=' + players[0].teamid + '&z=' + players[0].teamhash + '">' : ' (')
    header += players[0].team
    header += (players[0].teamid !== undefined ? '</a>)' : ')')
    header += '</td>'
    header += '<td width=50% valign=top>'
    header += '<b>' + players[nn].firstname + ' ' + players[nn].secondname + '</b>'
    header += (players[nn].teamid !== undefined ? ' (<a href="plug.php?p=refl&t=k&j=' + players[nn].teamid + '&z=' + players[nn].teamhash + '">' : ' (')
    header += players[nn].team
    header += (players[nn].teamid !== undefined ? '</a>)' : ')')
    header += '</td></tr>'
    // �������, �����������, ���� �� �������
    header += '<tr align=center><td valign=top>'
    header += players[0].age + ' ���' + (players[0].natfull !== ' ' ? ', ' + players[0].natfull : '')
    if (parseInt(players[0].internationalapps) !== 0
        || parseInt(players[nn].internationalapps) !== 0
        || parseInt(players[0].u21apps) !== 0
        || parseInt(players[nn].u21apps) !== 0) {
        header += ', ' + players[0].internationalapps + '(' + players[0].u21apps + ') ������, ' + players[0].internationalgoals + '(' + players[0].u21goals + ') �����'
    }
    header += '</td>'
    header += '<td valign=top>'
    header += players[nn].age + ' ���' + (players[nn].natfull !== ' ' ? ', ' + players[nn].natfull : '')
    if (parseInt(players[0].internationalapps) !== 0
        || parseInt(players[nn].internationalapps) !== 0
        || parseInt(players[0].u21apps) !== 0
        || parseInt(players[nn].u21apps) !== 0) {
        header += ', ' + players[nn].internationalapps + '(' + players[nn].u21apps + ') ������, ' + players[nn].internationalgoals + '(' + players[nn].u21goals + ') �����'
    }
    header += '</td></tr>'
    //���������
    header += '<tr align=center><td>'
    if (players[0].wage !== 0) {
        header += players[0].contract + ' �. �� '
        header += (players[0].wage > 999 ? String((players[0].wage / 1000).toFixed(3)).replace(/\./g, ',') : players[0].wage)
        header += '$ � ��'
    }
    header += ' </td>'
    header += '<td>'
    if (players[nn].wage !== 0) {
        header += players[nn].contract + ' �. �� '
        header += (players[nn].wage > 999 ? String((players[nn].wage / 1000).toFixed(3)).replace(/\./g, ',') : players[nn].wage)
        header += '$ � ��'
    }
    header += ' </td></tr>'
    // ��������
    if (players[0].value !== 0 || players[nn].value !== 0) {
        header += '<tr align=center><td>'
        if (players[0].value !== 0) header += '�������: ' + String(players[0].value < 1000000 ? (players[0].value / 1000).toFixed(3) : (players[0].value / 1000000).toFixed(3) + ',000').replace(/\./g, ',') + '$'
        header += ' </td>'
        header += '<td>'
        if (players[nn].value !== 0) header += '�������: ' + String(players[nn].value < 1000000 ? (players[nn].value / 1000).toFixed(3) : (players[nn].value / 1000000).toFixed(3) + ',000').replace(/\./g, ',') + '$'
        header += ' </td></tr>'
    }
    // �������
    header += '<tr align=center><td>'
    header += '<b>' + players[0].position + '</b>'
    if (players[0].newpos !== '' && players[0].newpos !== undefined) header += ' (' + players[0].newpos + ')'
    header += '</td>'
    header += '<td>'
    header += '<b>' + players[nn].position + '</b>'
    if (players[nn].newpos !== '' && players[nn].newpos !== undefined) header += ' (' + players[nn].newpos + ')'
    header += '</td></tr>'
    // ������
    header += '<tr align=center><td>'
    header += '��=' + players[0].sumskills
    header += '</td>'
    header += '<td>'
    header += '��=' + players[nn].sumskills
    header += '</td></tr>'

    header += '</table>'

    $('td.back4 table:first center:first').remove()
    $('div#th0').before(header)

    var skillupsumm = 0
    var skillupsumm2 = 0
    // Skills:
    $('td.back4 table:first table:not(#plheader):first td:even').each(function (i, val) {
        var skillname = sklfr[$(val).text()].elong
        var skillvalue0 = players[0][skillname]
        var skillvalue1 = (players[nn][skillname] === undefined ? '??' : players[nn][skillname])
        var skillup0 = parseInt(skillvalue0) * 7 + parseInt(ups[String(skillvalue0).split('.')[1]])
        var skillup1 = parseInt(skillvalue1) * 7 + parseInt(ups[String(skillvalue1).split('.')[1]])
        var skillup2 = parseInt(skillvalue1) * 7 + parseInt(ups[(String(skillvalue1).split('.')[1] === 'next' ? 'a1e' : String(skillvalue1).split('.')[1])])
        var raz = parseInt(skillvalue0) - parseInt(skillvalue1)
        skillupsumm += skillup0 - skillup1
        skillupsumm2 += skillup0 - skillup2
        var razcolor = 'red'
        if (raz === 0 || isNaN(raz)) raz = '&nbsp;&nbsp;&nbsp;&nbsp;'
        else if (raz > 0) {
            raz = '+' + raz
            razcolor = 'green'
        }
        var skilltext0 = String(skillvalue0).split('.')[0]
        skilltext0 += '<sup><font color="' + razcolor + '">' + raz + '</font></sup>'
        if (String(skillvalue0).split('.')[1]) {
            skilltext0 += ' <img height="12" src="system/img/g/' + String(skillvalue0).split('.')[1] + '.gif">'
        }
        var skilltext = '<td width=10%>'
        skilltext += String(skillvalue1).split('.')[0]
        if (String(skillvalue1).split('.')[1]) {
            skilltext += ' <img height="12" src="system/img/g/' + String(skillvalue1).split('.')[1] + '.gif">'
        }
        skilltext += '</td>'
        $(val)
            .next().attr('width', '10%')
            .html(skilltext0)
            .after(skilltext)
    })
    if (players[0].id === players[nn].id && (players[0].t === 'yp' || players[0].t === 'yp2')) {
        var skilltext = '<tr><td colspan=6>&nbsp;</td></tr>'
        skilltext += '<tr><td colspan=6 align=center><b>���������</b> (���): '
        skilltext += '<font color=' + (skillupsumm < 0 ? 'red' : 'green') + '>' + (skillupsumm > 0 ? '+' : '') + skillupsumm + '</font>'
        skilltext += '</td></tr>'
        skilltext += '<tr><td colspan=6 align=center><b>��� = ���</b> (���): '
        skilltext += '<font color="' + (skillupsumm2 < 0 ? 'red' : 'green') + '">' + (skillupsumm2 > 0 ? '+' : '') + skillupsumm2 + '</font>'
        skilltext += '</td></tr>'
        skilltext += '<tr><td colspan=6>&nbsp;</td></tr>'
        $('td.back4 table:first table:not(#plheader):eq(0)').append(skilltext)
    }

    $('td.back4 table:first table:not(#plheader):eq(1) tr:first td:gt(0)').attr('colspan', '3').attr('align', 'center')
    $('td.back4 table:first table:not(#plheader):eq(1) tr:gt(0)').each(function (i, val) {
        if (i !== 1) $(val).find('td:eq(7)').after('<td' + (i == 0 ? ' rowspan=2' : '') + '>' + (players[nn]['kk' + i] != undefined ? players[nn]['kk' + i] : '?') + '</td><td' + (i == 0 ? ' rowspan=2' : '') + ' class=back1 width=1%> </td>')
        if (i !== 1) $(val).find('td:eq(6)').after('<td' + (i == 0 ? ' rowspan=2' : '') + '>' + (players[nn]['zk' + i] != undefined ? players[nn]['zk' + i] : '?') + '</td><td' + (i == 0 ? ' rowspan=2' : '') + ' class=back1 width=1%> </td>')

        $(val).find('td:eq(5)').after('<td>' + (parseFloat(players[nn]['sr' + i]) == 0 || players[nn]['sr' + i] == undefined ? '0,00' : String((parseFloat(players[nn]['sr' + i])).toFixed(2)).replace('.', ',')) + '</td><td class=back1 width=1%> </td>')
        $(val).find('td:eq(4)').after('<td>' + (players[nn]['im' + i] != undefined ? players[nn]['im' + i] : '?') + '</td><td class=back1 width=1%> </td>')
        $(val).find('td:eq(3)').after('<td>' + (players[nn]['ps' + i] != undefined ? players[nn]['ps' + i] : '?') + '</td><td class=back1 width=1%> </td>')
        $(val).find('td:eq(2)').after('<td>' + (players[nn]['gl' + i] != undefined ? players[nn]['gl' + i] : '?') + '</td><td class=back1 width=1%> </td>')
        $(val).find('td:eq(1)').after('<td>' + (players[nn]['ig' + i] != undefined ? players[nn]['ig' + i] : '?') + '</td><td class=back1 width=1%> </td>').before('<td class=back1 width=1%> </td>')
    })

    return false
}


function CheckPlayer(nn) {
    // Get data and compare players

    var season = 0;
    var data = {};
    for (i in players[nn]) {
        switch (i) {
            case 'sumskills':
            case 's':
            case 'ss0':
            case 't':
            case 'flag':
            case 'team':
            case 'teamid':
            case 'teamhash':
            case 'teamnat':
            case 'id':
            case 'hash':
            case 'contract':
            case 'valuech':
            case 'newpos':
            case 'ig0':
            case 'gl0':
            case 'ps0':
            case 'im0':
            case 'sr0':
            case 'zk0':
            case 'kk0':
            case 'zk1':
            case 'kk1':
            case 'ig1':
            case 'gl1':
            case 'ps1':
            case 'im1':
            case 'sr1':
            case 'ig2':
            case 'gl2':
            case 'ps2':
            case 'im2':
            case 'sr2':
            case 'zk2':
            case 'kk2':
            case 'ig3':
            case 'gl3':
            case 'ps3':
            case 'im3':
            case 'sr3':
            case 'zk3':
            case 'kk3':
            case 'ig4':
            case 'gl4':
            case 'ps4':
            case 'im4':
            case 'sr4':
            case 'zk4':
            case 'kk4':
            case 'sale':
            case 'morale':
            case 'form':
            case 'natfull':
            case 'nation':
            case 'internationalgoals':
            case 'u21goals':
            case 'firstname':
                break;
            case 'secondname':
                data['pname'] = (players[nn].nation !== undefined ? players[nn].nation : 217) + '|' + players[nn]['firstname'] + ' ' + players[nn][i] + '|p=refl&t=' + players[nn]['t'] + '&j=' + players[nn]['id'] + '&z=' + players[nn]['hash'];
                break;
            case 'internationalapps':
                data['int'] = players[nn][i] + '.' + players[nn]['internationalgoals'];
                break;
            case 'u21apps':
                data['u21'] = players[nn][i] + '.' + players[nn]['u21goals'];
                break;
            case 'value':
                data[i] = (players[nn][i] === 0 ? '' : ShowValueFormat(players[nn][i] / 1000));
                break;
            default:
                data[i] = String(players[nn][i]);
        }
    }
    var cur = {
        'pname': '<img height="12" src="system/img/flags/mod/' + players[0].nation + '.gif"> ' + '<b>' + players[0]['firstname'] + ' ' + players[0]['secondname'] + '</b>',
        'age': players[0]['age'],
        'value': (players[0]['value'] === 0 ? '' : ShowValueFormat(players[0]['value'] / 1000)),
        'int': '������ ' + players[0]['internationalapps'] + ', ����� ' + players[0]['internationalgoals'],
        'u21': '������ ' + players[0]['u21apps'] + ', ����� ' + players[0]['u21goals'],
        'position': players[0]['position'],
        'wage': players[0]['wage'],
        'curseason': 13
    }

    $('table#stat,span#err,#dcode1').hide();
    $('#dcode1').html('');
    $('table#res,table#skills').show();

    if (sknum > 2) {
        sknum = 0;
        $('table[id^="res"], td[id^="res"]').remove();
    }
    if (sknum === undefined || sknum === 0) {
        $('table#stat').before('<table id=res class=back1 align=center width=70% cellpadding=2 cellspacing=1><tr><td nowrap id=thx align=center class=back2>[<a href="javascript:void(SkReset())"><font color=red>�</font> ��������</a>]</td></tr></table>');
    }
    sknum++;
    $('td#thx').after('<td nowrap width=30%>' + (season != 0 ? '<b>' + season + ' �����</b>' : ' ') + '</td>');
    var ssn = 0;
    if (data['pname'] === undefined) data['pname'] = '';

    for (i in data) {
        var nm = (lc[i] === undefined ? i : lc[i].rn);
        if (i !== '' && $('td#' + i).length === 0) {
            $('table#res').prepend('<tr class=back2><td nowrap id=' + i + '>' + nm + '</td><td nowrap>' + (cur[i] !== undefined ? cur[i] : '') + '</td></tr>');
        }
        switch (i) {
            case 'dribbling':
            case 'finishing':
            case 'passing':
            case 'crossing':
            case 'longshots':
            case 'technique':
            case 'tackling':
            case 'heading':
            case 'handling':
            case 'corners':
            case 'freekicks':
            case 'positioning':
            case 'vision':
            case 'workrate':
            case 'reflexes':
            case 'marking':
            case 'leadership':
            case 'pace':
            case 'strength':
            case 'stamina':
                if ($('td#' + i).length > 0) {
                    var x = data[i].split('.');
                    x[0] = parseInt(x[0], 10);
                    if (isNaN(x[0])) {
                        x[0] = '??';
                        ch = '';
                    } else {
                        ssn = ssn + x[0];
                        var ch = parseInt($('td#' + i).next().text(), 10) - x[0];
                        if (ch > 0) ch = '<font color=green size=1>+' + ch + '</font>';
                        else if (ch < 0) ch = '<font color=red size=1>' + ch + '</font>';
                        else ch = '';
                    }
                    var m = $('td#' + i).next().clone()
                        .attr('id', 'res_' + i + nn)
                        .each(function () {
                            if ($(this).find('span').length > 0) $(this).find('span').html('<font color=gray>' + x[0] + '</font>' + (x[1] !== undefined ? ' <img height=10 src=system/img/g/' + x[1] + '.gif>' : '') + '<sup>' + ch + '</sup>');
                            else $(this).html('<font color=gray>' + x[0] + '</font>' + (x[1] != undefined ? ' <img height=10 src=system/img/g/' + x[1] + '.gif>' : '') + '<sup>' + ch + '</sup>');
                        });
                    $('td#' + i).after(m);
                }
                break;
            case 'int':
            case 'u21':
                var x = data[i].split('.');
                $('td#' + i).after('<td nowrap><font color=gray>' + (x[0] > 0 ? '������ ' + x[0] + ', ����� ' + x[1] : '') + '</font></td>');
                break;
            case 'pname':
                var x = data[i].split('|');
                $('td#' + i).after('<td nowrap>' + (x[0] === '' ? '' : '<img height="12" src="system/img/flags/mod/' + x[0] + '.gif"> <a href="plug.php?' + x[2] + '"><b>' + x[1] + '</b></a>') + '</td>');
                break;
            default:
                if (i === '') console.error('Error: i is empty with data=' + data[i]);
                else $('td#' + i).after('<td nowrap><font color=gray>' + data[i] + '</font></td>');
        }
    }
    $('td[id^="ss"]').attr('colSpan', 2 + sknum);
    $('#s').after('<td class=back1 id=res_s' + nn + '>' + ssn + '</td>');

    return false
}

function CodeForForum() {
    var x = '<div align="right">(<a href="' + window.location.href + '">x</a>)&nbsp;</div>'
    var pl = players[0]
    var ptype = UrlValue('t')
    var skillsshow = ($('a#th0').html() !== '+')
    var seasonstatshow = ($('a#th1').html() !== '+')
    var fullstatshow = ($('a#th2').html() !== '+')
    var lastplstatshow = (!($('a#plst').length > 0 && $('a#plst').html() === '+'))

    $('td.back4 table:first table:not(#plheader):first img').removeAttr('style')
    x += '<br><hr><b>������ �������</b>:<br>'
    x += '<textarea rows="20" cols="80" readonly="readonly" id="CodeForForum">'
    x += '[spoiler]'
    x += '[table width=100% bgcolor=#C9F8B7][tr][td]\n[center]'
    if (compare === true) {
        x += $('table#plheader')
            .find('a:contains("������������")').removeAttr('href').end()
            .find('a[id="th0"]').remove().end()
            .find('center, b, td').removeAttr('id').end()
            .find('img').removeAttr('width').end()
            .html()
            .replace('\/flags\/', '/flags/mod/')
            .replace(/img src="/g, 'img]')
            .replace(/.gif/g, '.gif[/img')
            .replace(/\<a\>������������\<\/a\>/g, '������������')
            .replace(/<!-- [�-�] -->/g, '')
            .replace(/<tbody>/g, '<table width=100%>')
            .replace(/tbody/g, 'table')
            .replace(/\</g, '[')
            .replace(/\>/g, ']')
            .replace(/a href=\"/g, 'url=')
            .replace(/\/a/g, '/url')
            .replace(/\&amp\;/g, '&')
            .replace(/"/g, '')
            .replace(/\[br\]/g, '\n')
//		x += '\n'

    } else {
//		x += '[url=plug.php?' + location.search.substring(1) + ']#[/url] [b]'
        x += '[url=plug.php?p=refl&t=' + pl.t + '&j=' + pl.id + '&z=' + pl.hash + ']#[/url] [b]'
        x += $('td.back4 table center:first b:first')
            .find('a[id="th0"]').remove().end()
            .find('img').removeAttr('width').end()
            .html()
            .replace('\/flags\/', '/flags/mod/')
            .replace(/img src="/g, 'img height=12]')
            .replace(/.gif/g, '.gif[/img')
            .replace(/\<a\>������������\<\/a\>/g, '������������')
            .replace(/<!-- [�-�] -->/g, '')
            .replace(/\</g, '[')
            .replace(/\>/g, ']')
            .replace(/a href=\"/g, 'url=')
            .replace(/\/a/g, '/url')
            .replace(/\&amp\;/g, '&')
            .replace(/"/g, '')
            .replace(/\[br\]/g, '\n')
            //			.replace(/\[sup\]/g,'(')
            //			.replace(/\[\/sup\]/g,')')
            .replace(/font /g, '')
            .replace(/font/g, 'color')
        if (ptype === 'yp' || ptype === 'yp2') x += '[/b]\n' + pl.position + '[b]'
        if (pl.newpos !== '' && pl.newpos !== undefined) x += '[/b] (' + pl.newpos + ')[b]'
        x += '\n\n������[/b](��=' + pl.sumskills
        x += (pl.flag === 5 ? ', ��������' : '')
        x += (pl.flag === 7 ? ', �������' : '')
        x += (pl.t === 'p2' ? ', ���������' : '')
        x += ')[/center]'

    }

    // skills
    if (skillsshow) {
        x += '\n'
        x += $('td.back4 table table:not(#plheader):first')
            .find('tr.back2').removeAttr('class').end()
            .find('tr.back3').removeAttr('class').attr('bgcolor', '#A3DE8F').end()
            .find('td.back1').removeAttr('class').attr('bgcolor', '#C9F8B7').end()
            .find('img').removeAttr('ilo-full-src').end()        // fix: http://forum.mozilla-russia.org/viewtopic.php?id=8933
            //			.find('sup').remove().end()
            .html()
            .replace(/<!-- [�-�] -->/g, '')
            .replace(/<tbody>/g, '<table width=100%>')
            .replace(/tbody/g, 'table')
            .replace(/<font /g, '[')
            .replace(/\/font/g, '/color')
            .replace(/\</g, '[')
            .replace(/\>/g, ']')
            .replace(/ height=\"12\"/g, '')
            .replace(/img src="/g, 'img height=10]')
            .replace(/.gif/g, '.gif[/img')
            .replace(/"/g, '')
            .replace(/\n/g, '')
    }
    var y = x

    // stat of season
    if (seasonstatshow && (ptype === 'p' || ptype === 'pp')) {
        x += '\n[center][b]���������� ������[/b][/center]\n'
        x += $('table#stat')
            .find('tr.back2').removeAttr('class').end()
            .find('tr.back3').removeAttr('class').attr('bgcolor', '#A3DE8F').end()
            .find('td.back1').removeAttr('class').attr('bgcolor', '#C9F8B7').end()
            .find('img').removeAttr('ilo-full-src').end()        // fix: http://forum.mozilla-russia.org/viewtopic.php?id=8933
            .html()
            .replace(/<!-- [�-�] -->/g, '')
            .replace(/<tbody>/g, '<table width=100%>')
            .replace(/tbody/g, 'table')
            .replace(/\</g, '[')
            .replace(/\>/g, ']')
            .replace(/img src="/g, 'img height=10]')
            .replace(/.gif/g, '.gif[/img')
            .replace(/"/g, '')
            .replace(/\[td\]\[\/td\]/g, '[td] [/td]')
    }
    // fullstat
    if ($('table#ph0').html() != null && fullstatshow && (ptype === 'p' || ptype === 'pp')) {
        x += '\n[center][b][url=hist.php?id=' + pl.id + '&t=p]�������[/url][/b][/center]\n'
        x += $('table#ph0')
            .find('tr.back2').removeAttr('class').end()
            .find('tr.back3').removeAttr('class').attr('bgcolor', '#A3DE8F').end()
            .find('img')
            .removeAttr('ilo-full-src')        // fix: http://forum.mozilla-russia.org/viewtopic.php?id=8933
            .removeAttr('width')
            .end()
            .find('a#th2').remove().end()
            .find('tr').removeAttr('style').removeAttr('id').end()
            .html()
            .replace(/<!-- [�-�] -->/g, '')
            .replace(/<tbody>/g, '<table width=100%>')
            .replace(/tbody/g, 'table')
            .replace(/\</g, '[')
            .replace(/\>/g, ']')
            .replace(/img src="/g, 'img]')
            .replace(/.gif/g, '.gif[/img')
            .replace(/"/g, '')
            .replace(/\[td\]\[\/td\]/g, '[td] [/td]')
    }
    if ($('table#plst').html() != null && lastplstatshow) {
        x += '\n[center][b]��������� �����[/b][/center]\n'
        x += $('table#plst')
            .find('tr.back2').removeAttr('class').end()
            .find('tr.back3').removeAttr('class').attr('bgcolor', '#A3DE8F').end()
            .find('td.back1').removeAttr('class').attr('bgcolor', '#C9F8B7').end()
            .find('img')
            .removeAttr('ilo-full-src')        // fix: http://forum.mozilla-russia.org/viewtopic.php?id=8933
            .removeAttr('width')
            .end()
            .find('tr').removeAttr('style').removeAttr('id').end()
            .html()
            .replace(/<tbody>/g, '<table width=100%>')
            .replace(/tbody/g, 'table')
            .replace(/<font /g, '[')
            .replace(/\/font/g, '/color')
            .replace(/a href=\"/g, 'url=')
            .replace(/\/a/g, '/url')
            .replace(/\</g, '[')
            .replace(/\>/g, ']')
            .replace(/img src="/g, 'img]')
            .replace(/.gif/g, '.gif[/img')
            .replace(/.png/g, '.png[/img')
            .replace(/"/g, '')
            .replace('[img]system/img/refl/krest.gif[/img]', '[color=red][b]�[/b][/color]')
        //.replace(/\[td\]\[\/td\]/g,'[td] [/td]')
    }

    x += '[/td][/tr][/table]'
    x += '\n\n'
    x += '[center]--------------- [url=forums.php?m=posts&q=173605]�������� VIP[/url] ---------------[/center]\n';
    x += '[/spoiler]'
    x += '</textarea><hr>'
    /**
     x += '<b>��������� �������:</b><br><br>'
     x += pl.firstname + ' ' +pl.secondname+' (' + pl.team +')<br>'
     x += pl.age +' ���, '+ pl.natfull+'<br>'
     x += '��������: '+pl.contract +' �., '+ pl.wage+' � ������� ����<br>'
     x += '�������: '+pl.value +'<br>'
     x += pl.position + ' (' + pl.newpos+ ')'+'<br>'
     x += '<br>'
     x += '������ ('+pl.sumskills+')<br>'
     x += lp('���������')        +parseInt(pl.leadership)+' '+lp('��������')        +parseInt(pl.dribbling)+'<br>'
     x += lp('�����')            +parseInt(pl.finishing)+' '    +lp('���� � ���')    +parseInt(pl.passing)+'<br>'
     x += lp('������� ����')        +parseInt(pl.vision)+' '    +lp('���� �������')    +parseInt(pl.heading)+'<br>'
     x += lp('������','.')        +parseInt(pl.crossing)+' '    +lp('������� �����')+parseInt(pl.longshots)+'<br>'
     x += lp('����. �����')        +parseInt(pl.marking)+' '    +lp('��������')        +parseInt(pl.pace)+'<br>'
     x += lp('��������')            +parseInt(pl.freekicks)+' '    +lp('����� �������')+parseInt(pl.positioning)+'<br>'
     x += lp('�������')            +parseInt(pl.corners)+' '    +lp('�������')        +parseInt(pl.technique)+'<br>'
     x += lp('����')                +parseInt(pl.strenght)+' '    +lp('����� ����')    +parseInt(pl.tackling)+'<br>'
     x += lp('�����������������')+parseInt(pl.workrate)+' '    +lp('������������')    +parseInt(pl.stamina)+'<br>'
     x += '<br>'
     x += '�����: '+pl.form+'% | ������: '+pl.morale+'%<br>'
     /**/
    $('td.back4').html(x)
    $('td#crabglobalright').empty()

    return true
}

function lp(txt) {
    let num = 19 - txt.length;
    for (let i = 0; i < num; i++) txt += '_';

    return txt
}

function getJSONlocalStorage(dataname) {
    if (String(localStorage[dataname]) !== 'undefined') {
        let data = []
        let data2 = JSON.parse(localStorage[dataname]);
        switch (dataname) {
            case 'matchespl2':
                for (let k in data2) {
                    data[k] = []
                    for (let l in data2[k]) {
                        if (data2[k][l].id !== undefined) data[k][data2[k][l].id] = data2[k][l]
                        else data[k][l] = data2[k][l]
                    }
                }
                return data
            default:
                return data2
        }
    } else {
        return false
    }
}

function ShowLastStats() {
    debug('LastStats()')
    $('a#codeforforum').show()
    if ($('table#plst tr').length === 0) {
        var matches = getJSONlocalStorage('matches2')
        matches.sort(function (a, b) {
            if (a != null && b != null) return (((a.dt == undefined ? (a.hnm != undefined && a.anm != undefined ? 0 : 100000000) : a.dt) + a.id * 0.0000001) - ((b.dt == undefined ? (b.hnm != undefined && b.anm != undefined ? 0 : 100000000) : b.dt) + b.id * 0.0000001))
        })
        var matchespl = getJSONlocalStorage('matchespl2')
        var html = '<tr><td>��� ������</td></tr>'
        if (matches && matchespl) {
            html = ''
            var num = 1
            for (i in matchespl) {
                var mpl = matchespl[i]
//				debug(String(players[0].firstname)[0]+'.'+players[0].secondname + ':'+i)
                if (i == String(players[0].firstname)[0] + '.' + players[0].secondname) {
                    var matchpos = [, 'GK', ,
                        , , 'SW', , ,
                        'R DF', 'C DF', 'C DF', 'C DF', 'L DF',
                        'R DM', 'C DM', 'C DM', 'C DM', 'L DM',
                        'R M', 'C M', 'C M', 'C M', 'L M',
                        'R AM', 'C AM', 'C AM', 'C AM', 'L AM',
                        , 'FW', 'FW', 'FW', ,
                        , 'FW', 'FW', 'FW', ,
                        'L AM', 'C AM', 'C AM', 'C AM', 'R AM',
                        'L M', 'C M', 'C M', 'C M', 'R M',
                        'L DM', 'C DM', 'C DM', 'C DM', 'R DM',
                        'L DF', 'C DF', 'C DF', 'C DF', 'R DF',
                        , , 'SW', , ,
                        , 'GK']

                    for (j in matches) {
                        var mch = matches[j]
                        if (mpl[mch.id] != undefined) {
                            var mchpl = mpl[mch.id]
                            var date = '&nbsp;'
                            if (mch.dt != undefined) {
                                var dt = new Date(mch.dt * 100000)
                                mdate = parseInt(dt.getDate())
                                mmonth = parseInt(dt.getMonth()) + 1
                                date = (mdate < 10 ? '0' : '') + mdate + '.' + (mmonth < 10 ? 0 : '') + mmonth//+ '.'+dt.getFullYear()
                            }
                            var type = '&nbsp;'
                            if (mch.tp != undefined) {
                                switch (mch.tp) {
                                    case 't':
                                        type = '������������';
                                        break;
                                    //case 'c': type='�����'
                                    default:
                                        type = mch.tp
                                }
                            }
                            var t1 = (mch.hnm == undefined ? '<b>' + players[0].team + '</b>' : mch.hnm)
                            var t2 = (mch.anm == undefined ? '<b>' + players[0].team + '</b>' : mch.anm)
                            var t1u = ''
                            var t2u = ''
                            if (mch.ust != undefined) {
                                var ust = mch.ust.split('.')
                                t1u = (ust[1] == undefined || ust[1] == 'h' ? (ust[0] == 'p' ? '(���)' : '(���)').fontcolor('red') : '') //p.h a.h p
                                t2u = (ust[1] == undefined || ust[1] == 'a' ? (ust[0] == 'p' ? '(���)' : '(���)').fontcolor('red') : '') //p.a a.a p
                            }
                            var minute = (mchpl.m == undefined ? (mch.m == undefined ? '&nbsp;' : mch.m) : mchpl.m)
                            var im = (mchpl.im != undefined ? true : false)
                            var mark = (mchpl.mr != undefined ? (im ? '<b>' : '') + mchpl.mr + (im ? '</b>' : '') : '&nbsp;')
                            var cp = (mchpl.cp != undefined ? '���' : '') + '&nbsp;'
                            //var goals	= (mchpl.g!=undefined ? '<img src="system/img/refl/ball.gif" width=10></img>'+(mchpl.g==2 ? '<img src="system/img/refl/ball.gif" width=10></img>' : (mchpl.g>2 ? '('+mchpl.g+')' : '')) : '&nbsp;')
                            var goals = (mchpl.g != undefined ? mchpl.g : '&nbsp;')
                            var cards = (mchpl.cr != undefined ? '<img src="system/img/gm/' + mchpl.cr + '.gif"></img>' : '&nbsp;')
//							cards		= cards + (mchpl.t==1 ? '&nbsp;<font color=red><b>T</b></font>':'')
                            cards = cards + (mchpl.t == 1 ? '&nbsp;<img src="system/img/refl/krest.gif" width=10></img>' : '')
                            var inz = (mchpl['in'] != undefined ? '<img src="system/img/gm/in.gif"></img>' : (minute < mch.m ? '<img src="system/img/gm/out.gif"></img>' : '&nbsp;'))
                            var pos = '&nbsp;'
                            if (mchpl.ps != undefined) {
                                pos = ''
                                var posarr = String(mchpl.ps).split(':')
                                for (n in posarr) {
                                    var posname = matchpos[parseInt(posarr[n])]
                                    var red1 = ''
                                    var red2 = ''
                                    if (players[0].position && !filterPosition(players[0].position, posname)) {
                                        red1 = '<font color=red>'
                                        red2 = '</font>'
                                    }
                                    pos += (n == 0 ? '' : ',') + red1 + posname + red2
                                }
                            }
                            minute = minute + '\''

                            var tr = '<tr class=back3>'
                            tr += '<td align=right>' + date + '</td>'
                            tr += '<td align=right>' + inz + minute + '</td>'
                            tr += '<td>' + pos + '</td>'
                            tr += '<td align=right>' + mark + '</td>'
                            tr += '<td align=center>' + goals + '</td>'
                            tr += '<td>' + cards + cp + '</td>'
                            //tr += '<td><img src="system/img/w'+(mch.w==undefined?0:mch.w)+'.png"></img> '+(mch.n!=undefined?'N':'')+'</td>'
                            tr += '<td align=right>' + t1 + t1u + '</td>'
                            tr += '<td align=center>' + (mch.h != undefined ? '<a href="plug.php?p=refl&t=if&j=' + mch.id + '&z=' + mch.h + '">' : '') + mch.res + (mch.h != undefined ? '</a>' : '') + '</td>'
                            tr += '<td>' + t2 + t2u + '</td>'
                            //tr += '<td>'+type+'</td>'
                            tr += '</tr>'
                            html = tr + html
                            num++
                        }
                    }
                    html = '<tr class=back2 height=20><td>N</td><td>���</td><td>���</td><td>����</td><td>����</td><td>&nbsp;</td>'
                        //		+'<td>&nbsp;</td>'
                        + '<td colspan=3 align=center>����</td>'
                        //		+'<td>������</td>'
                        + '</tr>'
                        + html
                    break
                }
            }
        }
        $('table#plst').append(html)
    }
    if ($('a#plst').html() == '+') {
        $('table#plst tr').show()
        $('a#plst').html('&ndash;')
    } else {
        $('table#plst tr').hide()
        $('a#plst').html('+')
    }
}

function doOldRoster() {
    debug('������0:' + $('table:eq(0)').attr('width'))
    var bbig = false
    if ($('table:eq(0)').attr('width') >= 1000) {
        bbig = true
        $('table.border:eq(2)').attr('width', $('table:eq(0)').attr('width') - 200)
    }

    $('td.back4 table table tr[bgcolor=#a3de8f]').removeAttr('bgcolor').addClass('back3')

    if (UrlValue('t') === 'plast' || UrlValue('t') === 'plast2') return false
    today = new Date()
    todayTmst = today.valueOf()

    // Draw left and right panels
    var preparedhtml = ''
    preparedhtml += '<table align=center cellspacing="0" cellpadding="0" id="crabglobal"><tr>'
    preparedhtml += '<td id="crabgloballeft" width=' + (bbig ? 0 : 200) + ' valign=top></td>'
    preparedhtml += '<td id="crabglobalcenter" valign=top></td>'
    preparedhtml += '<td id="crabglobalright" width=200 valign=top>'
    preparedhtml += '<table id="crabrighttable" class=back3 width=100%><tr><td height=100% valign=top id="crabright"></td></tr></table>'
    preparedhtml += '</td></tr></table>'
    $('body table.border:last').before(preparedhtml)

    var ssp = 0

    for (i in skillnames) {
        sklfr[skillnames[i].rlong] = skillnames[i]
        sklfr[skillnames[i].rlong].elong = i
    }
    sklfr['���� �� �������'] = sklfr['���� �������']

    // get player skills
    var skillsum = 0
    $('td.back4 table:first table:first td:even').each(function () {
        var skillarrow = ''
        var skillname = $(this).find('script').remove().end().html().replace(/<!-- [�-�] -->/g, '');
        var skillvalue = parseInt($(this).next().find('script').remove().end().html().replace('<b>', ''));
        if ($(this).next().find('img').attr('src') != undefined) {
            skillarrow = '.' + $(this).next().find('img').attr('src').split('/')[3].split('.')[0] 		// "system/img/g/a0n.gif"
        }
        skillsum += (isNaN(skillvalue) ? 0 : skillvalue);
        if (sklfr[skillname] != undefined) players[0][sklfr[skillname].elong] = skillvalue + skillarrow;
    })
    if (players[0].heading == undefined) players[0].heading = '??'
    if (players[0].handling == undefined) players[0].handling = '??'
    if (players[0].reflexes == undefined) players[0].reflexes = '??'

    players[0].sumskills = skillsum

    //add sum of skills to page
    $('td.back4 table center:first').append('<span class="forumcodetrigger">(��=' + String(skillsum) + ')</span>')

    //get player header info
    var ms = $('td.back4 table center:first').html().replace('<b>', '').replace('</b>', '').replace(/<!-- [�-�] -->/g, '').split('<br>', 6)
    var j = 0

    var name = ms[j].split(' (', 1)[0].split(' <', 1)[0]
    if (name.indexOf(' ') != -1) {
        players[0].firstname = name.split(' ', 1)[0]
        players[0].secondname = name.replace(players[0].firstname + ' ', '')
    } else {
        players[0].firstname = ''
        players[0].secondname = name
    }

    players[0].team = ''
    players[0].sale = 0

    players[0].t = UrlValue('t')

    if (players[0].t == 'p' || players[0].t == 'pp') {
        players[0].team = $('td.back4 a:first').text()
        players[0].teamid = UrlValue('j', $('td.back4 a:first').attr('href'))
        players[0].teamhash = UrlValue('z', $('td.back4 a:first').attr('href'))
    } else if (players[0].t == 'p2') {
        players[0].team = '���������'
    }
    // ������!
    if (players[0].t == 'yp' || players[0].t == 'yp2') {
        players[0].flag = 5
    }
    players[0].id = UrlValue('j')
    players[0].hash = UrlValue('z')
    if ($('a:[href^="plug.php?p=tr&t=ncyf&n=yf"]').length > 0) {
        //������ ��������
        players[0].flag = 7
    }

    j++
    if (ms[j].indexOf('� ������') != -1) j++
    players[0].age = +ms[j].split(' ', 1)[0]
    if (ms[j].indexOf('(������') > -1) {
        players[0].natfull = ms[j].split(', ', 2)[1].split(' (', 1)[0]
        players[0].internationalapps = +ms[j].split(', ', 2)[1].split('������ ', 2)[1]
        players[0].internationalgoals = +ms[j].split(', ', 3)[2].split(' ', 2)[1].replace(')', '')
        if (ms[j].indexOf('U21') > -1) {
            players[0].u21apps = +ms[j].split('/ U21 ������ ', 2)[1].split(',', 1)[0]
            players[0].u21goals = +ms[j].split('/ U21 ������ ', 2)[1].split(', ����� ', 2)[1].replace(')', '')
        } else {
            players[0].u21apps = 0
            players[0].u21goals = 0
        }
    } else {
        players[0].natfull = ' '
        players[0].internationalapps = 0
        players[0].internationalgoals = 0
        players[0].u21apps = 0
        players[0].u21goals = 0
    }
//	$('td.back4').prepend('get '+players[0].internationalapps+players[0].u21apps +'<br>')
    j++
    if (ms[j].indexOf('��������:') != -1) {
        players[0].contract = +ms[j].split(' ', 4)[1]
        players[0].wage = +ms[j].split(' ', 4)[3].replace(/,/g, '').replace('$', '')
        j++
    } else {
        if (UrlValue('t') == 'yp' || UrlValue('t') == 'yp2') {
            players[0].contract = 21 - players[0].age
            players[0].wage = 100
        } else {
            players[0].contract = 0
            players[0].wage = 0
        }
    }
    if (ms[j].indexOf('�������:') != -1) {
        players[0].value = +ms[j].split(' ', 2)[1].replace(/,/g, '').replace('$', '')
        j++
    } else {
        players[0].value = 0
    }
    players[0].valuech = 0

    if (ms[j].indexOf('���� �������:') != -1) {
        j++
        players[0].sale = 1
    }
    players[0].position = ms[j]

    $('td.back4 table:first table:eq(1) tr:gt(0)').each(function (i, val) {
        players[0]['ig' + i] = parseInt($(val).find('td:eq(1)').text())
        players[0]['gl' + i] = parseInt($(val).find('td:eq(2)').text())
        players[0]['ps' + i] = parseInt($(val).find('td:eq(3)').text())
        players[0]['im' + i] = parseInt($(val).find('td:eq(4)').text())
        players[0]['sr' + i] = parseFloat(($(val).find('td:eq(5)').text() == '' ? 0 : $(val).find('td:eq(5)').text()))
    })

    players[0].newpos = ''
    // get post-info
    var ms2 = $('td.back4 > center:first').html()
    if (ms2 != null) {
        if (ms2.indexOf('New pos:') != -1) {
            var x = ms2.split('New pos: ');
            players[0].newpos = x[1].split('<')[0]
            if (x[2] != undefined) players[0].newpos = players[0].newpos + ' ' + x[2].split('<')[0]
            if (x[3] != undefined) players[0].newpos = players[0].newpos + ' ' + x[3].split('<')[0]
            $('td.back4 table center:first b:first').after(' (' + players[0].newpos + ')')
        }

        var j2 = 0
        ms2 = ms2.replace(/<!-- [�-�] -->/g, '').split('<br>')
        players[0].form = +ms2[j2].split(': ', 2)[1].split('%', 1)[0]
        players[0].morale = +ms2[j2].split(': ', 3)[2].replace('%</i>', '')
        j2++;
        j2++;
        j2++;
        j2++
        // ������������ �������:
        if (ms2[j2].split(': ', 2)[0] === '�����������������') j2++
        players[0].zk0 = +ms2[j2].split(': ', 2)[1]
        j2++
        players[0].kk0 = +ms2[j2].split(': ', 2)[1]
        j2++;
        j2++;
        j2++
        // ������������� �������:
        if (ms2[j2].split(': ', 2)[0] === '�����������������') j2++
        players[0].zk2 = +ms2[j2].split(': ', 2)[1]
        j2++
        players[0].kk2 = +ms2[j2].split(': ', 2)[1]
        j2++;
        j2++;
        j2++
        // �������:
        if (ms2[j2].split(': ', 2)[0] === '�����������������') j2++
        players[0].zk3 = +ms2[j2].split(': ', 2)[1]
        j2++
        players[0].kk3 = +ms2[j2].split(': ', 2)[1]

        players[0].zk4 = ' ';
        players[0].kk4 = ' ';

        $('td.back4 table:first table:eq(1) tr:first')
            .find('td:eq(0)').attr('width', '27%').end()
            .find('td:eq(1)').attr('width', '10%').end()
            .find('td:gt(1)').attr('width', '13%').end()
            .find('td:last').attr('width', '8%').end()
            .append('<td width=8%>�� <img src="system/img/gm/y.gif"></img></td><td width=8%>�� <img src="system/img/gm/r.gif"></img></td>')
        $('td.back4 table:first table:eq(1) tr:gt(0)').each(function (i, val) {
            if (i === 0) $(val).append('<td rowspan=2>' + players[0].zk0 + '</td><td rowspan=2>' + players[0].kk0 + '</td>')
            else if (i === 2) $(val).append('<td>' + players[0].zk2 + '</td><td>' + players[0].kk2 + '</td>')
            else if (i === 3) $(val).append('<td>' + players[0].zk3 + '</td><td>' + players[0].kk3 + '</td>')
            else if (i === 4) $(val).append('<td></td><td></td>')
        })
    } else {
        players[0].form = 0
        players[0].morale = 0
        for (i = 0; i <= 4; i++) {
            players[0]['ig' + i] = 0
            players[0]['gl' + i] = 0
            players[0]['ps' + i] = 0
            players[0]['im' + i] = 0
            players[0]['sr' + i] = 0
            players[0]['zk' + i] = 0
            players[0]['kk' + i] = 0
        }

    }

    var mm = ''
    // fill poss masive

    var text3 = ''
    text3 += '<br><b>�������+</b>: <b><sup><a href="#" onClick="alert(\'������������� �������� �������� � ������� ������ ������ ����������� �� �� ������� ������ ��������� (�������, �������, �������, ��������� �����)\')">?</a></sup></b><br>'
    text3 += '<div id="SValue"><a href="javascript:void(RelocateGetNomData())">��������</a></div>'
    text3 += '<br><a id="remember" href="javascript:void(RememberPl(0))">' + ('��������� ������').fontsize(1) + '</a><br>'
    text3 += '<div id="compare"></div>'
    text3 += '<br><br><a id="codeforforum" href="javascript:void(CodeForForum())" style="display:none">' + ('��� ��� ������').fontsize(1) + '</a><br><br>'
    text3 += '<b>����&nbsp;������</b><div id=str>'
    text3 += '<i><font size=1>������� � ������+</font></i>'
    text3 += '</div>'

    var hidden = 0
    var pfs3pre = ''
    var pflinkpre = ''

    // Modify page and fill data
    $('td.back4 script').remove()
    $('body table.border:has(td.back4)').appendTo($('td#crabglobalcenter'));
    $('#crabrighttable').addClass('border')
    $("#crabright").html(text3)
    $("#mydiv").hide()
    $('center:eq(1) ~ br:first').before('<div id="th0"><a id="th0" href="javascript:void(ShowTable(0))">&ndash;</a></div>').remove()
    $('center:eq(2) ~ br').before('<div id="th1"><a id="th1" href="javascript:void(ShowTable(1))">&ndash;</a></div>').remove()

    $('td.back4 table table:eq(1)').attr('id', 'stat')

    // 1 ������
    if (players[0].teamid == parseInt(localStorage.myteamid)) {
        delete localStorage.oneid
        var statsplayer = '<br><div id="plst" align=center>��������� �����</div>'
        statsplayer += '<div id="plst"><a id="plst" href="javascript:void(ShowLastStats())">+</a></div>'
        statsplayer += '<table width=100% id="plst"></table>'
        $('td.back4 table table:eq(1)').after(statsplayer)
    }

    // ������� ������ �� �������
    if (UrlValue('t') != 'yp') $('td.back4' + (UrlValue('t') != 'yp2' ? ' center:last' : '')).append("<br><a href=\"javascript:hist('" + players[0].id + "','n')\">�������</a>")

    getPlayers();
    if (players.length > 1) PrintPlayers();
    GetValue()
    ShowAdaptation(players[0].natfull)
    RelocateGetNomData()
    GetData('positions')
    printStrench()

    $('.forumcodetrigger').click(function () {
        $('a#codeforforum').show();
    });
    /**/
}

function doNewRoster() {
    if (UrlValue('t') == 'plast' || UrlValue('t') == 'plast2') {
        return false;
    }

    // ����� ����� ����� �����
    if ($('a[href*=SavePl]').length > 0) {
        var ses = parseInt($('a[href*=SavePl]').prev().prev().prev().text(), 10);
        if (!isNaN(ses)) localStorage.season = ses;
    }

    var bbig = false
    if ($('table:eq(0)').attr('width') >= 1000) {
        bbig = true
        if ($('table.border:eq(4)').length == 0) {
            $('table.border:eq(2)').attr('width', $('table:eq(0)').attr('width') - 200);
        } else {
            $('table.border:eq(3)').attr('width', $('table:eq(0)').attr('width') - 200);
        }
    }

    today = new Date()
    todayTmst = today.valueOf()

    // Draw left and right panels
    var preparedhtml = ''
    preparedhtml += '<table align=center cellspacing="0" cellpadding="0" id="crabglobal"><tr>'
    preparedhtml += '<td id="crabgloballeft" width=' + (bbig ? 0 : 200) + ' valign=top></td>'
    preparedhtml += '<td id="crabglobalcenter" valign=top></td>'
    preparedhtml += '<td id="crabglobalright" width=200 valign=top>'
    preparedhtml += '<table id="crabrighttable" class=back3 width=100%><tr><td height=100% valign=top id="crabright"></td></tr></table>'
    preparedhtml += '</td></tr></table>'
    $('body table.border:last').before(preparedhtml)

    var ssp = 0

    // get player skills
    var skillsum = 0
    $('table#skills td[id]').each(function () {
        var skilleng = $(this).attr('id');
        var skillname = $(this).html();
        if ($(this).next().find('span').length > 0) var skillvalue = parseInt(String($(this).next().find('span').html()).replace('<b>', ''))
        else var skillvalue = parseInt(String($(this).next().html()).replace('<b>', ''))
        var skillarrow = ''
        if (skilleng == 's') players[0].sumskills = skillvalue;
        else {
            if ($(this).next().find('img').attr('src') != undefined) {
                skillarrow = '.' + $(this).next().find('img').attr('src').split('/')[3].split('.')[0] 		// "system/img/g/a0n.gif"
            }
        }
        if (skilleng != '' && skilleng != 'ss0') players[0][skilleng] = (isNaN(skillvalue) ? '??' : skillvalue + skillarrow);
    })
    if (players[0].marking == undefined) players[0].marking = '??'
    if (players[0].corners == undefined) players[0].corners = '??'
    if (players[0].heading == undefined) players[0].heading = '??'
    if (players[0].handling == undefined) players[0].handling = '??'
    if (players[0].reflexes == undefined) players[0].reflexes = '??'

    //get player header info

    var name = $('table#hd1 td:first font').html();
    if (name.indexOf(' ') != -1) {
        players[0].firstname = name.split(' ', 1)[0]
        players[0].secondname = name.replace(players[0].firstname + ' ', '')
    } else {
        players[0].firstname = ''
        players[0].secondname = name
    }
    players[0].nation = parseInt($('table#hd1 td:eq(1) img').attr('src').split('mod/')[1]);
    players[0].natfull = $('table#hd1 td:eq(2) font').html().split('<br>')[0];

    var mnat = $('table#hd1 td:eq(3) font').html().split('<br>');
    if (mnat[0] != '') {
        players[0].internationalapps = parseInt(mnat[0].split(' ')[1]);
        players[0].internationalgoals = parseInt(mnat[0].split(' ')[3]);
    } else {
        players[0].internationalapps = 0;
        players[0].internationalgoals = 0;
    }
    if (mnat[1] != undefined) {
        players[0].u21apps = parseInt(mnat[1].split(' ')[1])
        players[0].u21goals = parseInt(mnat[1].split(' ')[3])
    } else {
        players[0].u21apps = 0;
        players[0].u21goals = 0;
    }

    players[0].form = ($('table#hd1').next().find('tr:first td:first b').text() == '' ? 0 : parseInt($('table#hd1').next().find('tr:first td:first b').text()));
    players[0].morale = ($('table#hd1').next().find('tr:first th:first').text() === '' ? 0 : parseInt($('table#hd1').next().find('tr:first th:first').text()));

    players[0].team = ''
    players[0].t = UrlValue('t')

    if (players[0].t === 'p2') {
        players[0].team = '���������'
    } else {
        if ($('table#hd1').next().find('tr:first font').length > 0) {
            players[0].team = $('table#hd1').next().find('tr:first font:first').text()
            players[0].teamid = UrlValue('j', $('table#hd1').next().find('tr:first a:first').attr('href'))
            players[0].teamhash = UrlValue('z', $('table#hd1').next().find('tr:first a:first').attr('href'))
            players[0].teamnat = parseInt($('table#hd1').next().find('tr:first img:first').attr('src').split('mod/')[1])
        }
    }

    // ������!
    if (players[0].t === 'yp' || players[0].t === 'yp2') {
        players[0].flag = 5;
    }
    players[0].id = UrlValue('j');
    players[0].hash = UrlValue('z');
    if ($('a:[href^="plug.php?p=tr&t=ncyf&n=yf"]').length > 0) {
        //������ ��������
        players[0].flag = 7;
    }

    players[0].contract = 0;
    players[0].wage = 0;
    players[0].value = 0;
    players[0].valuech = 0;

    players[0].newpos = '';

    $('table#hd2 table tr').each(function () {
        let xname = $(this).find('td:first').text().replace(/\d+/g, '');
        let xvalue = $(this).find('td:last b').html();
        switch (xname) {
            case '�������:':
                players[0].age = parseInt(xvalue);
                break;
            case '�������:':
                // ������� ��������� �������� �� ����������� ��������.
                // �������� ����� ����� ������ C MF � C AM, �� � ������� � ���� ����������� ������ C AM
                if (xvalue.trim() === 'GK') {
                    players[0].position = xvalue;
                    break;
                }

                let [side, pos] = xvalue.split(' ');
                // ���� ��������� ������� � ������������ �������, � ��������.
                let posArr = pos.replace(/\(.*/g,'').split('/');
                let correctPositionsArray = [];

                posArr.forEach(item => {
                    switch (item) {
                        case 'DM':
                            correctPositionsArray.push('MF');
                            correctPositionsArray.push(item);
                            break;
                        case 'AM':
                            correctPositionsArray.push('MF');
                            correctPositionsArray.push(item);
                            break;
                        default:
                            correctPositionsArray.push(item);
                            break;
                    }
                });
                // ��������� �������
                let correctPositionsJoined =  correctPositionsArray.join('/');

                const correctSidesAndPos = side + ' ' + correctPositionsJoined;

                players[0].position = correctSidesAndPos;
                break;
            case '�������:':
                if (xvalue !== '') players[0].value = xvalue.replace(/,/g, '').replace('$', '');
                break;
            case '��������:':
                if (xvalue !== '') {
                    players[0].contract = parseInt(xvalue);
                    players[0].wage = xvalue.split('�. ')[1].replace(/,/g, '').replace('$', '');
                }
                break;
            case '���. ����:':
                players[0].foot = xvalue;
                break;
        }
    });
    if ($('table#stat').length > 0) {
        $('table#stat tr:gt(0)').each(function (i, val) {
            players[0]['ig' + i] = parseInt($(val).find('td:eq(1)').text())
            players[0]['gl' + i] = parseInt($(val).find('td:eq(2)').text())
            players[0]['ps' + i] = parseInt($(val).find('td:eq(3)').text())
            players[0]['im' + i] = parseInt($(val).find('td:eq(4)').text())
            players[0]['sr' + i] = parseFloat(($(val).find('td:eq(5)').text() === '' ? 0 : $(val).find('td:eq(5)').text()))
            if (i !== 1) {
                players[0]['zk' + i] = ($(val).find('td:eq(6)').text() === '' ? ' ' : parseInt($(val).find('td:eq(6)').text()))
                players[0]['kk' + i] = ($(val).find('td:eq(7)').text() === '' ? ' ' : parseInt($(val).find('td:eq(7)').text()))
            }
        })
    } else {
        for (i = 0; i <= 4; i++) {
            players[0]['ig' + i] = 0
            players[0]['gl' + i] = 0
            players[0]['ps' + i] = 0
            players[0]['im' + i] = 0
            players[0]['sr' + i] = 0
            players[0]['zk' + i] = 0
            players[0]['kk' + i] = 0
        }
    }

    players[0].sale = 0;
    if ($('table#hd2').parent().find('div:last').text() !== '') {
        var xinfo = $('table#hd2').parent().find('div:last i').html().split('<br>');
        for (i in xinfo) {
            if (xinfo[i].indexOf('��������� �� ��������') !== -1) {
                players[0].sale = 1 //parseInt(xinfo[i].split('<b>')[1])
            }
        }
    }

    var mm = ''
    // fill poss masive

    var text3 = ''
    text3 += '<br><b>�������+</b>: <b><sup><a href="#" onClick="alert(\'������������� �������� �������� � ������� ������ ������ ����������� �� �� ������� ������ ��������� (�������, �������, �������, ��������� �����)\')">?</a></sup></b><br>'
    text3 += '<div id="SValue"><a href="javascript:void(RelocateGetNomData())">��������</a></div>'
    text3 += '<br><a id="remember" href="javascript:void(RememberPl(0))">' + ('��������� ������').fontsize(1) + '</a><br>'
    text3 += '<div id="compare"></div><br><br>'
    text3 += '<b>����&nbsp;������</b><div id=str>'
    text3 += '<i><font size=1>������� � ������+</font></i>'
    text3 += '</div>'

    // Modify page and fill data
    $('td.back4 script').remove()
    $('body table.border:has(td.back4)').appendTo($('td#crabglobalcenter'));
    $('#crabrighttable').addClass('border')
    $("#crabright").html(text3)
    $("#mydiv").hide()
    $('center:eq(1) ~ br:first').before('<div id="th0"><a id="th0" href="javascript:void(ShowTable(0))">&ndash;</a></div>').remove()
    $('center:eq(2) ~ br').before('<div id="th1"><a id="th1" href="javascript:void(ShowTable(1))">&ndash;</a></div>').remove()

//	$('td.back4 table table:eq(1)').attr('id','stat')

    // ������� ������ �� �������
    if (UrlValue('t') !== 'yp') $("#crabright").append("<br><a href=\"javascript:hist('" + players[0].id + "','n')\">�������</a>")

    getPlayers();
    if (players.length > 1) PrintPlayers();
    GetValue();
    ShowAdaptation(players[0].natfull, players[0].teamnat);
    RelocateGetNomData();
    GetData('positions');
    printStrench();

}

function getPlayers() {
    // Get info fom Global or Session Storage
    let text1 = String(localStorage.peflplayer);
    if (text1 !== 'undefined') {
        let pl = text1.split(',');
        for (let i in pl) {
            let key = pl[i].split('=');
            let pn = (key[0].split('_')[1] === undefined ? 2 : key[0].split('_')[1]);
            if (key[0].split('_')[0] !== '' && !isNaN(pn)) {
                players[pn][key[0].split('_')[0]] = [key[1]];
            }
        }
    }
}

$().ready(function () {
    if ($('table#hd1').length === 0) {
        isOldRoster = true;
        doOldRoster();
    } else {
        doNewRoster();
    }
}, false)
