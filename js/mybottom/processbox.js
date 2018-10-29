//加载进度条
function InitProcessBox() {
	InitProcessEvent();
}
////////////////////////////////////////////////////事件
//加载进度条的各种事件
function InitProcessEvent() {
	//鼠标移入事件
	document.getElementById('muname').onmouseover = function() {
		ShowName();
	};
	//鼠标移出事件
	document.getElementById('muname').onmouseout = function() {
		HideName();
	};
	//鼠标单击进度条
	document.getElementById('barbox').onmousedown = function(event) {
		//单击进度条后的相关事件
		BarEvent(GetPosition(event))
	};
}

////////////////////////////////////////////////////歌曲名称文本
//显示歌曲的名称
function ShowMusicName(mymusic) {
	var a = document.getElementById('muname');
	a.innerHTML = mymusic;
	//实现歌曲名称循环滚动的一种方式
	/*if(a.scrollWidth > a.offsetWidth) { // 设置定时间 300ms滚动
		var nametimer = setInterval(function() {	
			s = s.substring(1, s.length) + s.substring(0, 1);
			a.innerHTML = s;
		}, 300);
	}
	*/
}
//鼠标移入的时候滚动名字
function ShowName() {
	var a = parseInt(document.getElementById('muname').scrollWidth);
	//layer.msg(a+"");
	$("#muname").stop();
	$("#muname").animate({
		scrollLeft: a
	}, 4000);
}
//当鼠标移出的时候滚动回0
function HideName() {
	$("#muname").stop();
	$("#muname").animate({
		scrollLeft: 0
	}, 1000);
}
////////////////////////////////////////////////////时间
//设置总时间
function ShowTime() {
	var e = "/ ";
	e = e + FormatTime(altime);
	document.getElementById('altime').innerHTML = e;
}

//歌曲播放时间计时
function ShowUpdateTime() {
	var e = FormatTime(myaudio.currentTime);
	document.getElementById('ctime').innerHTML = e;
}
//格式化时间
function FormatTime(time) {
	var e = "";
	var t = parseInt(time / 60);
	if(t < 10)
		e = e + "0" + t;
	else
		e = e + t;
	e = e + ":";
	t = parseInt(time % 60);
	if(t < 10)
		e = e + "0" + t;
	else
		e = e + t;
	return e;
}
////////////////////////////////////////////////////进度条
//获取单击进度条的位置
function GetPosition(event) {
	y = $("#barbox").offset().left;
	x = event.screenX;
	clickx = x - y;
	return clickx;
}
//设置进度条长度
function SetBar(length) {
	$('#midbar').stop();
	$("#midbar").animate({
		width: length + "px"
	}, 100);
}
//暂停进度条
function PauseBar() {
	$("#midbar").pause();
}
//恢复进度条
function ResumeBar() {
	$("#midbar").resume();
}

//设置进度条
function StartProcessBar(length, time) {
	$('#midbar').stop();
	$('#midbar').animate({
		width: '320px'
	}, parseInt(time) * 1000);
}
//进度条事件
function BarEvent(length) {
	if(nowmusic != undefined) {
		//设置进度条的长度
		SetBar(length);
		var t = length / 320 * myaudio.duration;
		//更新单击后歌词的位置
		UpdateLyricPosition(t);
		//等div长度动画结束后再设置进度条
		window.setTimeout(function() {
			StartProcessBar(320, myaudio.duration - t);
			SetTime(t);
			PlayFunction();
		}, 100);
	}
}

//将进度条上的元素还原
function ClearProcessBox(){
	//进度条归0
	SetBar(0);
	ShowMusicName("无歌曲");
	//时间复位
	document.getElementById('ctime').innerHTML = "00:00";
	document.getElementById('altime').innerHTML = "/ 00:00";
}
