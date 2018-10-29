//歌曲数组
var musicList = [
	// 预留列表：搜索结果
	{
		item: []
	},
	// 预留列表：历史列表
	{
		item: []
	},
	// 古典音乐榜
	{
		id: 71384707,
		item: []
	},
	// 电竞音乐榜
	{
		id: 2006508653,
		item: []
	},
	// 原创歌曲榜
	{
		id: 2884035,
		item: []
	},
	// 云音乐飙升榜
	{
		id: 19723756,
		item: []
	},
	// 云音乐新歌榜
	{
		id: 3779629,
		item: []
	},
	// 云音乐热歌榜
	{
		id: 3778678,
		item: []
	}
];
//记录当前音乐
var nowmusic;
//加载CenList
function InitCenList() {
	//美化滚动条
	InitScrollBar();

	//加载列表单击事件
	InitListClick();

	//打开界面时直接从网络读取各个列表内容
	GetListFromNet();
}
//美化滚动条
function InitScrollBar() {
	$("#showlist").niceScroll({
		cursorcolor: "#95d2fd", //滚动条的颜色   
		cursoropacitymax: 1, //滚动条的透明度，从0-1   
		touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备   
		cursorwidth: "4px", //滚动条的宽度   
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
//事件
function InitListClick() {
	//歌单中的歌曲双击事件  动态添加
	$("#showlist").on('dblclick', '.list-item', function() {
		var e = $(this).data("no") + "";
		var music = musicList[dislist].item[parseInt(e)];
		//传过去整数值用来更新歌曲信息
		GetMusicUrl(parseInt(e), music, PlayMusic);
	});
	//加载更多事件
	$("#showlist").on('click', '#more', function() {
		AddMore();
	});
	//清空列表
	$("#showlist").on('click', '#clear', function() {
		Clear();
	});
}
//清空
function Clear() {
	//暂停
	PauseFuction();
	//设置歌曲进度为0
	SetTime(0);
	ClearNowMusic();
	ClearHistory();
	ClearPic();
	ClearProcessBox();
	ClearLyric();
}
//清空历史列表
function ClearHistory() {
	showlist.html('');
	musicList[1].item = [];
}
//每次初始化时就获取各个列表的内容
function GetListFromNet() {
	for(i = 2; i < 8; ++i) {
		AjaxGetList(i, musicList[i].id);
	}
}

//将列表显示到界面
function AddListDiv() {
	ListToTop();
	showlist.html('');
	for(i = 0; i < musicList[dislist].item.length; ++i) {
		ShowList(i, musicList[dislist].item[i].name, musicList[dislist].item[i].artist);
	}
	//如果从别的列表跳转到搜索列表添加‘加载更多’按钮
	if(dislist == 0) {
		AddListBar('more');
		//获取搜索词
		seword = $("#sebox").val();
		//此操作是为了解决当刷新页面后，搜索框内有关键字，单击搜索列表中的“加载更多”无效的问题
		if(sepage == undefined)
			sepage = 1;
	}
	//如果当前列表是历史列表
	if(dislist == 1) {
		if(musicList[1].item.length != 0)
			AddListBar("clear");
		else
			AddListBar("none");
	}
}
//将列表显示到界面上
function ShowList(no, name, artist) {
	var html = '<div id="item' + no + '"' + 'class="list-item" data-no="' + no + '">' +
		'    <span class="music-name">' + name + '</span>' +
		'    <span class="auth-name">' + artist + '</span>' +
		'</div>';
	showlist.append(html);
}

//加载“加载更多”“加载完了提示条”
function AddListBar(s) {
	var html;
	switch(s) {
		case "nomore":
			html = '<div id="nomore" class="bar">加载完了</div>';
			break;
		case "more":
			html = '<div id="more" class="bar">加载更多</div>';
			break;
		case "none":
			html = '<div id="none" class="bar">这里是空的~</div>';
			break;
		case "clear":
			html = '<div id="clear" class="bar">清空列表</div>';
			break;
	}
	showlist.append(html);
}
//列表滚动到顶部
function ListToTop() {
	$('#showlist').stop();
	$("#showlist").animate({
		scrollTop: 0
	}, 200);
}

//单击“加载更多”事件
function AddMore() {
	//删除id为more的div
	var my = document.getElementById("more");
	if(my != null)
		my.parentNode.removeChild(my);
	//异步搜索音乐
	AjaxSearch();
}

//检查歌曲是否在列表中
function CheckInList(music, listid) {
	var temp = -1;
	if(music != undefined)
		for(var i = 0; i < musicList[listid].item.length; ++i)
			if(music.id == musicList[listid].item[i].id) {
				temp = i;
				break;
			}
	return temp;
}

//把播放的歌曲添加到播放历史中
function AddHistory(music) {
	if(CheckInList(music, 1) == -1)
		musicList[1].item.push(music);
}

//切换列表时检查当前歌曲是否在切换后的列表中，如果在，就把这条数据的背景变色
function ChangeDisItemColor() {
	var e = CheckInList(nowmusic, dislist);
	ChangColorByClass('list-item', '#e9f5fe');
	if(e != -1)
		ChangeColorById('item' + e, '#7bc6fc');
}