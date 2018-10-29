//正在显示的列表
var showlist;
//正在显示的列表的序号
var dislist;
//搜索框中输入的内容
var seword;
//记录搜索加载的页数
var sepage;
//实例化audio,来操作
var myaudio;
//歌词容器
var lyricbox;
//初始化函数
$(function() {
	//初始化变量
	InitDiv();
	//加载中部
	InitCenter();
	//加载底部
	InitBottom();
	//加载音乐配置相关
	InitMusic();

});

//把div分配给var的变量
function InitDiv() {
	lyricbox = $('#lyricbox');
	showlist = $("#showlist");
	myaudio = document.getElementById('myaudio');
}

//以classname改变一组div的背景色
function ChangColorByClass(s, color) {
	//直接变色
	/*var e = document.getElementsByClassName(s);
	for(i = 0; i < e.length; ++i)
		e[i].style.backgroundColor = color;*/
	//16进制颜色转rgb颜色
	var mycolor = ToRgbColor(color);
	//颜色渐变
	$("." + s).each(function() {
		var t = $(this).css('background-color')
		if(t != mycolor) {
			$(this).stop();
			$(this).animate({
				backgroundColor: color
			}, 500);
		}
	});
}

//以id改变一个div的背景色
function ChangeColorById(s, color) {
	//直接变色
	/*var e = document.getElementById(s);
	e.style.backgroundColor = color;*/
	//颜色渐变
	$('#' + s).stop();
	$('#' + s).animate({
		backgroundColor: color
	}, 500);
}

//16进制颜色转rgb
function ToRgbColor(hex) {
	return "rgb(" + parseInt("0x" + hex.slice(1, 3)) + ", " + parseInt("0x" + hex.slice(3, 5)) + ", " + parseInt("0x" + hex.slice(5, 7)) + ")";
}