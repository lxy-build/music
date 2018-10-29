//加载ControlBox
function InitControlBox() {
	InitControlBtn();
}
//加载事件
function InitControlBtn() {
	//播放按钮
	$("#play").click(function() {
		PlayFunction();
	});
	//暂停按钮
	$('#pau').click(function() {
		PauseFuction();
	});
	//下一曲按钮
	$('#nxt').click(function() {
		NextMusic();
	});
	//上一曲按钮
	$('#pre').click(function() {
		PreMusic();
	});
}
//加载歌曲专辑封面
function LoadPic(music) {
	if(music.pic == null || music.pic == 'err' || music.pic == '') {
		layer.msg('获取歌曲封面错误');
		return false;
	}
	var e = document.getElementById('pic1');
	e.src = music.pic;
	var t = document.getElementById('lyricpic');
	t.src = music.pic;
	//var t = document.getElementById('mbg');
	//t.src = music.pic;
}
//清空封面
function ClearPic() {
	var e = document.getElementById('pic1');
	e.src = "img/logo/musiclogo.png";
	e = document.getElementById('lyricpic');
	e.src = "img/logo/musiclogo2.png";
}