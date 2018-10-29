//歌曲总时间
var altime;
//解决单击进度条设置歌曲时间后再次触发oncangettime函数
//如果不设置这个标志，那么重新设置进度条不能成功
var cangettime;
//播放器配置项
var myplayer = {
	api: "api.php", // api地址
	loadcount: 18, // 搜索结果一次加载多少条
	method: "POST", // 数据传输方式(POST/GET)
	listid: "8",
	volume: 0.3, // 默认音量值(0~1之间)
	debug: true
};
//加载音乐配置相关
function InitMusic() {
	//自动下一曲
	AutoNext();
	//获取歌曲时间
	GetMusicTime();
	//显示歌曲播放时间
	UpdateTime();
}
////////////////////////////////////////////////////事件
//歌曲结束自动下一曲
function AutoNext() {
	myaudio.onended = function() {
		NextMusic();
	};
}
////////////////////////////////////////////////////时间
//获取歌曲时长
function GetMusicTime() {
	//解决获取时间是NaN
	myaudio.oncanplay = function() {
		//开始进度条，保证每首歌只执行一次
		if(cangettime == 1) {
			altime = myaudio.duration;
			//在进度条上方显示总时间
			ShowTime();
			StartProcessBar(320, myaudio.duration);
			cangettime = 0;
		}
	};
}
//显示播放到几秒
function UpdateTime() {
	myaudio.ontimeupdate = function() {
		ShowUpdateTime();
	};
}
//设置歌曲时间
function SetTime(time) {
	myaudio.currentTime = time;
}
////////////////////////////////////////////////////基础功能
//播放音乐把t放在这是为了方便更新音乐UpdateMusic
function PlayMusic(t, mymusic) {
	if(mymusic.url == null || mymusic.url == 'err') {
		layer.msg('歌曲链接出错');
		return false;
	}
	//歌词容器滚动到顶部
	LyricBoxTop();
	//cangettime函数中SetProcessbar可执行标志
	cangettime = 1;
	//进度条归零
	SetBar(0);
	//获取歌曲的专辑封面
	GetPic(t, mymusic, LoadPic);
	//保存当前歌曲
	nowmusic = mymusic;
	myaudio.pause();
	myaudio.src = mymusic.url;
	//进行播放
	PlayFunction();
	//加载歌词
	AjaxLyric(t, mymusic, ParseLyric);
	//显示歌曲名
	ShowMusicName(mymusic.name + ' - ' + mymusic.artist);
	//加入播放历史列表
	AddHistory(mymusic);
	//改变当前曲目的背景颜色
	ChangeDisItemColor();
	/*//显示歌词
	ShowLyric();*/
}

//播放功能
function PlayFunction() {
	if(myaudio.paused) {
		ResumeBar();
		//显示歌词
		ShowLyric();
	}
	if(nowmusic != undefined) {
		$("#play").hide();
		$("#pau").show();
		myaudio.play();
	} else {
		layer.msg('历史列表无歌曲');
	}
}
//暂停功能
function PauseFuction() {
	if(nowmusic != undefined) {
		$("#pau").hide();
		$("#play").show();
		myaudio.pause();
		PauseBar();
		//清除歌词计时器
		DealTimerError();
	}
}
//上一曲
function PreMusic() {
	if(nowmusic != undefined) {
		var e;
		var t = CheckInList(nowmusic, 1);
		if(t == 0)
			t = musicList[1].item.length - 1;
		else
			t = t - 1;
		GetMusicUrl(t, musicList[1].item[t], PlayMusic);
	}
}
//下一曲
function NextMusic() {
	if(nowmusic != undefined) {
		var e;
		var t = CheckInList(nowmusic, 1);
		if(t == musicList[1].item.length - 1)
			t = 0;
		else
			t = t + 1;
		GetMusicUrl(t, musicList[1].item[t], PlayMusic);
	}
}
//更新歌曲信息
function UpdateMusic(t, music) {
	if(musicList[dislist].item[t] != undefined)
		musicList[dislist].item[t] = music;
}
//歌曲变量重置
function ClearNowMusic() {
	nowmusic = undefined;
}