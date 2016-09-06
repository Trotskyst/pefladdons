// ==UserScript==
// @name           pefladaptation
// @namespace      pefl
// @description    adaptaton map
// @include        http://*pefl.*/?adaptation
// @encoding	   windows-1251
// ==/UserScript==

var nationplayers = {
155:2800,
61:2658,
27:2260,
95:2121,
74:1723,
70:1693,
192:1666,
172:1631,
8:1599,
19:1530,
98:1376,
209:1279,
44:1207,
161:1164,
84:1132,
200:1128,
53:1002,
149:1001,
150:947,
139:941,
180:919,
48:900,
18:894,
122:859,
30:799,
171:780,
58:778,
167:769,
93:767,
42:755,
76:733,
12:726,
69:725,
87:689,
201:665,
170:660,
137:645,
64:628,
59:618,
94:614,
181:609,
88:594,
126:589,
51:588,
24:580,
25:576,
11:571,
13:551,
204:544,
129:530,
196:518,
111:504,
166:493,
207:492,
41:466,
73:465,
105:458,
96:456,
2:455,
214:435,
100:425,
154:408,
202:391,
1:379,
91:368,
47:347,
145:337,
160:334,
66:333,
191:288,
195:282,
147:280,
9:271,
123:266,
152:253,
50:221,
35:217,
162:207,
75:200,
153:122,
36:112,
118:107,
80:79,
45:78,
134:62,
67:58,
31:55,
72:55,
81:55,
5:54,
188:53,
21:52,
71:50,
92:50,
164:49,
112:46,
37:44,
97:44,
212:44,
83:40,
211:40,
143:39,
132:38,
110:37,
178:37,
119:36,
199:36,
101:34,
106:33,
182:33,
108:32,
85:31,
130:31,
115:30,
138:28,
217:28,
127:27,
158:27,
193:27,
32:26,
103:26,
184:25,
151:24,
190:24,
4:23,
60:23,
156:22,
114:19,
39:17,
136:16,
215:16,
90:15,
148:14,
65:13,
120:11,
49:10,
109:10,
26:9,
40:9,
169:8,
7:7,
17:7,
56:7,
62:7,
79:7,
15:6,
133:5,
140:5,
142:5,
168:5,
185:5,
205:5,
89:4,
107:4,
141:4,
186:4,
218:4,
43:3,
63:3,
82:3,
86:3,
104:3,
116:3,
174:3,
179:3,
213:3,
10:2,
20:2,
77:2,
121:2,
159:2,
173:2,
183:2,
187:2,
14:1,
16:1,
22:1,
38:1,
68:1,
99:1,
135:1,
177:1,
194:1,
3:0,
6:0,
23:0,
28:0,
29:0,
34:0,
46:0,
54:0,
55:0,
78:0,
102:0,
113:0,
117:0,
124:0,
125:0,
128:0,
131:0,
144:0,
157:0,
163:0,
165:0,
175:0,
176:0,
189:0,
203:0,
208:0
}
var nationteamnum = {
214:12,
209:36,
207:18,
204:22,
202:16,
201:20,
200:36,
196:28,
195:12,
192:38,
191:12,
181:28,
180:32,
172:66,
171:28,
170:26,
167:24,
166:24,
161:42,
160:12,
155:110,
154:18,
152:12,
150:36,
149:36,
147:12,
145:12,
139:32,
137:12,
129:16,
126:16,
123:10,
122:34,
111:20,
105:20,
100:20,
98:52,
96:14,
95:78,
94:24,
93:22,
91:16,
88:24,
87:32,
84:38,
76:34,
74:76,
73:20,
70:60,
69:24,
66:12,
64:20,
61:114,
59:26,
58:28,
53:44,
51:32,
50:14,
48:32,
47:12,
44:36,
42:28,
41:16,
30:32,
27:62,
25:16,
24:28,
19:68,
18:36,
13:24,
12:38,
11:20,
9:10,
8:44,
2:18,
1:12
}
var peflnation ={
//0:'����������',
1:'�������',
2:'�����',
3:'��������� �����',
4:'�������',
5:'������',
6:'��������',
7:'�������',
8:'���������',
9:'�������',
10:'�����',
11:'���������',
12:'�������',
13:'�����������',
14:'������',
15:'�������',
16:'���������',
17:'��������',
18:'��������',
19:'�������',
20:'�����',
21:'�����',
22:'�������',
23:'�����',
24:'�������',
25:'������',
26:'��������',
27:'��������',
28:'���������� �-��',
29:'������',
30:'��������',
31:'������� ����',
32:'�������',
34:'��������',
35:'�������',
36:'������',
37:'����-�����',
38:'��������� �-��',
39:'���',
40:'���',
41:'����',
42:'�����',
43:'�������',
44:'��������',
45:'�����',
46:'�-�� ����',
47:'����� ����',
48:'��������',
49:'����',
50:'����',
51:'�����',
53:'�����',
54:'�������',
55:'��������',
56:'������������� �-��',
58:'�������',
59:'������',
60:'���������',
61:'������',
62:'���. ������',
63:'�������',
64:'�������',
65:'�������',
66:'���������',
67:'��������� �-��',
68:'�����',
69:'���������',
70:'�������',
71:'�����',
72:'������',
73:'������',
74:'��������',
75:'����',
76:'������',
77:'�������',
78:'����',
79:'���������',
80:'������',
81:'������-�����',
82:'������',
83:'�����',
84:'���������',
85:'��������',
86:'���-����',
87:'�������',
88:'��������',
89:'�����',
90:'���������',
91:'����',
92:'����',
93:'��������',
94:'�������',
95:'������',
96:'���`�`�����',
97:'������',
98:'������',
99:'��������',
100:'���������',
101:'�����',
102:'������',
103:'��������',
104:'����',
105:'������',
106:'�����',
107:'������',
108:'�������',
109:'�����',
110:'�����������',
111:'�����',
112:'����������',
113:'�����',
114:'����������',
115:'������',
116:'��������',
117:'��������',
118:'����',
119:'������',
120:'����������',
121:'��������',
122:'�������',
123:'�������',
124:'��������',
125:'���������',
126:'�������',
127:'��������',
128:'�������',
129:'�������� ��������',
130:'�������',
131:'�����',
132:'�������',
133:'����� ���������',
134:'����� ��������',
135:'���������',
136:'�����',
137:'�������',
138:'�������� �����',
139:'��������',
140:'����',
141:'��������',
142:'���������',
143:'������',
144:'����� ����� ������',
145:'��������',
147:'����',
148:'���������',
149:'������',
150:'����������',
151:'������-����',
152:'�����',
153:'�� �����',
154:'�������',
155:'������',
156:'������',
157:'���. �����',
158:'���-������',
159:'����',
160:'���������� ������',
161:'���������',
162:'�������',
163:'����������� �-��',
164:'������-�����',
165:'��������',
166:'��������',
167:'��������',
168:'���������� �-��',
169:'������',
170:'���',
171:'����� �����',
172:'�������',
173:'���-�����',
174:'����-�����',
175:'�����',
176:'����-�������',
177:'�����',
178:'�������',
179:'���������',
180:'������',
181:'���������',
182:'�����',
184:'�����������',
185:'��������',
186:'�������',
188:'����',
189:'�����',
190:'�������� � ������',
191:'�����',
192:'������',
193:'������������',
194:'������',
195:'���',
196:'���',
199:'������',
200:'�������',
201:'�������',
202:'����������',
203:'�������',
204:'���������',
205:'�������',
207:'�����',
208:'�����',
209:'������',
153:'����',
211:'������',
212:'��������',
213:'���������',
214:'����������',
215:'��������� �������',
216:'�����',
217:'����������'
}

var peflcountry=[1,2,8,9,11,12,13,18,19,24,25,27,30,41,42,44,47,48,50,51,53,58,59,61,64,66,69,70,73,74,76,84,87,88,91,93,94,95,98,100,105,111,122,123,126,129,137,139,145,147,149,150,152,154,155,160,161,166,167,170,171,172,180,181,191,192,195,196,200,201,202,204,96,207,209,214]
var pfc = []
$().ready(function(){
	$('td.back4').html('<b>����� ���������</b><br>')
	$.getScript("js/adaptation2.en.js", function() {
		for (f=0;f<76;f++) {
			pfc[f] = []
			for(i in peflnation){
				pfc[f][i] = {'name':peflnation[i]}
			}
		}
		for (i in s_adaptationMap) for(j in s_adaptationMap[i]) {
			if(pfc[j][i]==undefined) pfc[j][i] = {'name':'��.'+j+'.'+i};
			pfc[j][i]['num'] = parseInt(s_adaptationMap[i][j])
			pfc[j][i]['id'] = i
		}
		PrintAd()
	});
});

function sNum(i, ii) { // �� SumSkills (��������)
    if 		(i.num < ii.num)	return  1
    else if	(i.num > ii.num)	return -1
    else						return  0
}

function PrintAd(){
	var mtext = ''
	for( i in pfc){
		var pforn_sum = 0
		var text2 = '' 
		var pfcs = pfc[i].sort(sNum)
		for(j in pfcs){
			var pforn = pfcs[j]['num']*nationplayers[pfcs[j]['id']]/10
			pforn_sum += pforn
			text2 += '<tr align=right id="c'+i+'"'+(parseInt(localStorage.mycountry) == peflcountry[i] ? '' : ' style="display: none;"')+'>'
			text2 += '<td width=10%>'+pfcs[j]['num'] +'0%</td>'
			text2 += '<td align=left>'+ pfcs[j]['name']+'</td>'
			text2 += '<td>'+nationplayers[pfcs[j]['id']]+'</td>'
			text2 += '<td>'+pforn.toFixed(2).replace('.',',')+'</td>'
			text2 += '<td>'+(pforn/nationteamnum[peflcountry[i]]).toFixed(2).replace('.',',')+'</td>'
			text2 += '<td>'+'</td>'
			text2 += '</tr>'
		}
		var text1 = '<tr align=right id="cname" class=back3>'
		text1 += '<td align=left colspan=3 width=40%><a href="javascript:void(ShowC(\''+i+'\'))">'+s_adaptationResultList[i]+' ('+peflnation[peflcountry[i]]+')</a></td>'
		text1 += '<td>'+pforn_sum.toFixed(2).replace('.',',')+'</td>'
		text1 += '<td>'+(pforn_sum/nationteamnum[peflcountry[i]]).toFixed(2).replace('.',',')+'</td>'
		text1 += '<td align=left width=30%>'+nationteamnum[peflcountry[i]]+'</td>'
		text1 += '</tr>'
		if(parseInt(localStorage.mycountry) == peflcountry[i]) mtext = text1+text2+mtext
		else mtext += text1+text2
	}
	mtext = '<table width=100%><tr><td colspan=2>������</td><td width=10%>�������</td><td>���&nbsp;������</td><td>���&nbsp;�������</td><td>������</td></tr>'+mtext+'</table>'
	$('td.back4').append('<table width=100%>'+mtext+'</table>')
}
function ShowC(n){
	if(String($('tr#c'+n+':first').attr('style')).indexOf('display: none') == -1) $('tr#c'+n).hide()
	else $('tr#c'+n).show()
}
