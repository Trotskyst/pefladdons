$().ready(function() {
	var szp=0
	$('td.back4 td').each(function(i,val){
		if ($(val).text().indexOf('$') != -1){
			if (szp!=0) szp += +$(val).html().replace('$','')
			else szp++
		}
	});
	var txt='<br>����� �������:';
	var newtxt = '<hr><table width=100%><tr><td width=5%></td><td width=30%></td><td width=10% ALIGN=right  bgcolor=#a3de8f><b>'+String(szp/1000).replace('.',',')+'$</b></td><td colspan=2><i>(�� ������� ��������� ��� �� +100$)</i></td></tr></table>'+txt;
	
	$('td.back4').each(function(){
		if ($(this).html().indexOf(txt) != -1){
			var newbody = $(this).html().replace(txt,newtxt);
			$(this).html(newbody);
		}
	});
});