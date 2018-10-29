//记录到哪一行歌词
var line;
//计时器，用于不停刷新实现歌词同步
var lyrictimer = undefined;
//延迟计时器
var outtime = undefined;
//用来存储歌词对应的时间的容器
var times;
//存储歌词的容器
var result;
//加载歌词相关
var ww = 0;

function InitLyric() {
	//加载歌词滚动条
	InitLyricScroll();
}
//加载歌词滚动条
function InitLyricScroll() {
	$("#lyricbox").niceScroll({
		cursorcolor: "#95d2fd", //滚动条的颜色   
		cursoropacitymax: 1, //滚动条的透明度，从0-1   
		touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备   
		cursorwidth: "0px", //滚动条的宽度   
		cursorborder: "0", // 游标边框css定义    
		cursorborderradius: "1px", //以像素为光标边界半径  圆角   
		autohidemode: true, //是否隐藏滚动条  true的时候默认不显示滚动条，当鼠标经过的时候显示滚动条   
		zindex: "auto", //给滚动条设置z-index值    
		railpadding: {
			top: 0,
			right: 0,
			left: 0,
			bottom: 0
		}, //滚动条的位置
	});
}
//解析歌词
function ParseLyric(lrc) {
	//开始是从第0行歌词开始
	line = 0;
	lyricbox.html('');
	if(lrc == '') {
		var html = '<div id = "line' + i + '" class = "linelyric">' +
			'<br>' + '</br>' +
			'<br>' + '</br>' +
			'<li>' + '没有歌词' + '</li>' +
			'</div>';
		lyricbox.append(html);
	} else {
		var lyricss = lrc.split("\n");
		result = [];
		times = [];
		for(var i = 0; i < lyricss.length; i++) {
			var lyric = decodeURIComponent(lyricss[i]);
			var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
			var timeRegExpArr = lyric.match(timeReg);
			if(!timeRegExpArr)
				continue;
			var clause = lyric.replace(timeReg, '');
			var tt = lyric.substring(lyric.indexOf("[") + 1, lyric.indexOf("]"));
			tt = (tt.split(":")[0] * 60 + parseFloat(tt.split(":")[1])).toFixed(3);
			result.push(clause);
			for(var k = 0, h = timeRegExpArr.length; k < h; k++) {
				var t = timeRegExpArr[k];
				var min = Number(String(t.match(/\[\d*/i)).slice(1)),
					sec = Number(String(t.match(/\:\d*/i)).slice(1));
				var time = min * 60 + sec;
			}
			lengthL = result.length;
			times.push(tt);
		}
		for(var i = 0; i < result.length; ++i) {
			var html = '<div id = "line' + i + '" class = "linelyric">' +
				'<li>' + result[i] + '</li>' +
				'</div>';
			lyricbox.append(html);
		}
		ShowLyric();
	}
}
//显示歌词
function ShowLyric() {
	//清除歌词计时器
	DealTimerError();
	var t;
	if(lyrictimer == undefined)
		lyrictimer = window.setInterval(function() {
			t = myaudio.currentTime;
			if(line < result.length - 1 && t >= times[line] && t <= times[line + 1]) {
				var temp = times[line + 1] - myaudio.currentTime;
				temp = temp.toFixed(3);
				ChangeLyricColor(line, "rgba(64,175,254,1)");
				ChangeLyricPosition(line);
				//在播放展示下一行歌词之前清除歌词计时器，避免未知错误
				if(lyrictimer != undefined) {
					window.clearInterval(lyrictimer);
					lyrictimer = undefined;
				}
				//等待两个歌词之间的时间间隔再开始展示下一个歌词
				outtime = setTimeout(function() {
						ChangeLyricColor(line, "rgba(255,555,255,1)");
						line = line + 1;
						ShowLyric();
					},
					//这里最好保证是整数
					1000 * temp);
			}
			//歌词读到最后一行
			if(line == result.length - 1) {
				ChangeLyricColor(line, "rgba(64,175,254,1)");
				//最后一行直接清除计时器
				DealTimerError();
			}
		}, 10);
}
//歌词容器滚动到0
function LyricBoxTop() {
	$('#lyricbox').stop();
	$("#lyricbox").animate({
		scrollTop: 0
	}, 200);
}

//清除两种计时器，避免未知错误
function DealTimerError() {
	//在播放音乐之前清除歌词计时器，避免未知错误
	if(lyrictimer != undefined) {
		window.clearInterval(lyrictimer);
		lyrictimer = undefined;
	}
	//这个延时计时器也要清除，之前出现了未知错误
	if(outtime != undefined) {
		clearTimeout(outtime);
		outtime = undefined;
	}
}
//改变某行歌词的颜色
function ChangeLyricColor(num, colorr) {
	$("#line" + num).stop();
	$("#line" + num).animate({
		color: colorr
	});
}
//滚动改变歌词的位置
function ChangeLyricPosition(num) {
	$("#lyricbox").animate({
		scrollTop: num * 35 - 120
	});
}
//单击进度条后更新歌词位置
function UpdateLyricPosition(time) {
	//清除两个歌词同步相关的计时器
	DealTimerError();
	//将当前的歌词变为黑色
	ChangeLyricColor(line, "rgba(255,555,255,1)");
	//查询时间改变后，对应的歌词在哪一行
	if(time >= times[times.length - 1]) {
		line = times.length - 1;
	} else {
		for(var i = 0; i < times.length; ++i) {
			if(times[i] > time) {
				line = i;
				break;
			}
		}
	}
	ChangeLyricColor(line, "rgba(64,175,254,1)");
	ChangeLyricPosition(line);
	ShowLyric();
}
//清空歌词
function ClearLyric() {
	LyricBoxTop();
	lyricbox.html('');
}