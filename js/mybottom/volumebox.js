//加载音量条
function InitVolume() {
	//初始化音量
	ChangeVolumeBar(myplayer.volume * 80);
	//加载音量条相关的事件
	InitVolumeEvent();
}
//音量条相关事件
function InitVolumeEvent() {
	//鼠标单击音量条
	document.getElementById('volumebox').onmousedown = function(event) {
		//单击音量条后的相关事件
		ChangeVolumeBar(VolumePosition(event));
	};
	//音量图标单击事件
	$("#loud").click(function() {
		ShowOrHide("#loud", "#quiet");
		ChangeVolumeBar(0);
	});
	//静音图标事件
	$("#quiet").click(function() {
		ShowOrHide("#quiet", "#loud");
		ChangeVolumeBar(myplayer.volume * 80);
	});
	//加载下载事件
	$('#download').click(function() {
		DownloadEvent();
	});
}
//单击音量条获取位置
function VolumePosition(event) {
	var y = $("#volumebox").offset().left;
	var x = event.screenX;
	var temp = x - y;
	return temp;
}
//改变音量条
function ChangeVolumeBar(length) {

	$("#vbar2").stop();
	$("#vbar2").animate({
		width: length + 'px'
	}, 100);
	var temp = length / 80;
	if(temp != 0)
		myplayer.volume = temp;
	myaudio.volume = temp;
}
//隐藏/显示函数
function ShowOrHide(name1, name2) {
	$(name1 + '').hide();
	$(name2 + '').show();
}
//下载事件
function DownloadEvent() {
	if(nowmusic != undefined)
		OpenDownloadDialog(nowmusic.url, nowmusic.name + ".mp3");
}
//下载
function OpenDownloadDialog(url, saveName) {
	if(typeof url == 'object' && url instanceof Blob) {
		url = URL.createObjectURL(url); // 创建blob地址
	}
	var aLink = document.createElement('a');
	aLink.href = url;
	aLink.target = "_blank";
	aLink.download = saveName; //不生效 // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
	var event;
	if(window.MouseEvent)
		event = new MouseEvent('click');
	else {
		event = document.createEvent('MouseEvents');
		event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	}
	aLink.dispatchEvent(event);
}