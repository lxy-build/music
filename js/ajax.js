//搜索音乐
function AjaxSearch() {
	if(seword == "") {
		layer.msg('搜索内容不能为空');
		return false;
	}
	var tempload = layer.msg("搜索中", {
		time: 500
	});
	$.ajax({
		type: myplayer.method,
		url: myplayer.api,
		data: "types=search&count=" + myplayer.loadcount + "&source=netease&pages=" + sepage + "&name=" + seword,
		dataType: "jsonp",
		complete: function(XMLHttpRequest, textStatus) {
			if(tempload)
				layer.close(tempload); // 关闭加载中动画*/
		},
		success: function(jsonData) {
			// 调试信息输出
			if(myplayer.debug) {
				console.debug("搜索结果数：" + jsonData.length);
			}
			if(sepage == 1) // 加载第一页，清空列表
			{
				if(jsonData.length === 0) // 返回结果为零
				{
					layer.msg('没有找到相关歌曲', {
						anim: 6
					});
					return false;
				}
				//搜索列表list
				musicList[0].item = [];
				//div清空
				showlist.html('');
			}

			if(jsonData.length === 0) {
				AddListBar("nomore"); // 加载完了
				return false;
			}
			var tempItem = [];
			var no = musicList[0].item.length;
			for(var i = 0; i < jsonData.length; i++) {
				tempItem = {
					id: jsonData[i].id, // 音乐ID
					name: jsonData[i].name, // 音乐名字
					artist: jsonData[i].artist[0], // 艺术家名字
					source: jsonData[i].source, // 音乐来源
					url_id: jsonData[i].url_id, // 链接ID
					pic_id: jsonData[i].pic_id, // 封面ID
					lyric_id: jsonData[i].lyric_id, // 歌词ID
					pic: null, // 专辑图片
					url: null // mp3链接
				};
				musicList[0].item.push(tempItem); // 保存到搜索结果临时列表中
				ShowList(no, tempItem.name, tempItem.artist); // 在前端显示
				no++;
			}
			dislist = 0; // 当前显示的是搜索列表
			sepage++; // 已加载的列数++
			if(no < myplayer.loadcount) {
				AddListBar("nomore"); // 没加载满，说明已经加载完了
			} else {
				AddListBar("more"); // 还可以点击加载更多
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			layer.msg('歌单读取失败 - ' + XMLHttpRequest.status);
			console.error(XMLHttpRequest + textStatus + errorThrown);
		}
	});
}

//通过歌单id获取内容(num代表存入musicList[num].item)
function AjaxGetList(num, lid) {
	if(musicList[num].item.length > 0) {
		AddListDiv();
		return true;
	}
	$.ajax({
		type: myplayer.method,
		url: myplayer.api,
		data: "types=playlist&id=" + lid,
		dataType: "jsonp",
		complete: function(XMLHttpRequest, textStatus) {;
		}, // complete
		success: function(jsonData) {
			// 存储歌单信息
			var tempList = {
				id: lid, // 列表的网易云 id
				item: []
			};

			if(typeof jsonData.playlist.tracks !== undefined || jsonData.playlist.tracks.length !== 0) {
				// 存储歌单中的音乐信息
				for(var i = 0; i < 50; i++) {
					tempList.item[i] = {
						id: jsonData.playlist.tracks[i].id, // 音乐ID
						name: jsonData.playlist.tracks[i].name, // 音乐名字
						artist: jsonData.playlist.tracks[i].ar[0].name, // 艺术家名字
						source: "netease", // 音乐来源
						url_id: jsonData.playlist.tracks[i].id, // 链接ID
						pic_id: null, // 封面ID
						lyric_id: jsonData.playlist.tracks[i].id, // 歌词ID
						pic: jsonData.playlist.tracks[i].al.picUrl + "?param=360y360", // 专辑图片
						//pic: jsonData.playlist.tracks[i].al.picUrl + "?param=300y300", // 专辑图片
						url: null // mp3链接
					};
				}
			}
			// 存储列表信息
			musicList[num] = tempList;
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			layer.msg('歌单读取失败 - ' + XMLHttpRequest.status);
			console.error(XMLHttpRequest + textStatus + errorThrown);
		}
	});
}

//获取歌曲的链接
function GetMusicUrl(t, music, callback) {
	// 已经有数据，直接回调
	if(music.url !== null && music.url !== "err" && music.url !== "") {
		callback(t, music);
		return true;
	}
	// id为空，赋值链接错误。直接回调
	if(music.id === null) {
		music.url = "err";
		callback(t, music);
		return true;
	}
	$.ajax({
		type: myplayer.method,
		url: myplayer.api,
		data: "types=url&id=" + music.id + "&source=" + music.source,
		dataType: "jsonp",
		success: function(jsonData) {
			// 调试信息输出
			if(myplayer.debug) {
				console.debug("歌曲链接：" + jsonData.url);
			}

			// 解决网易云音乐部分歌曲无法播放问题
			if(music.source == "netease") {
				if(jsonData.url === "") {
					jsonData.url = "https://music.163.com/song/media/outer/url?id=" + music.id + ".mp3";
				} else {
					jsonData.url = jsonData.url.replace(/m7c.music./g, "m7.music.");
					jsonData.url = jsonData.url.replace(/m8c.music./g, "m8.music.");
				}
			}
			if(jsonData.url === "") {
				music.url = "err";
			} else {
				music.url = jsonData.url; // 记录结果
			}
			//更新数组中的音乐信息
			UpdateMusic(t, music);
			callback(t, music); // 回调函数
			return true;
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			layer.msg('歌曲链接获取失败 - ' + XMLHttpRequest.status);
			console.error(XMLHttpRequest + textStatus + errorThrown);
		}
	});
}

//获取专辑封面
function GetPic(t, music, callback) {
	if(music.pic !== null && music.pic !== "err" && music.pic !== "") {
		callback(music);
		return true;
	}

	if(music.pic_id === null) {
		music.pic = "err";
		callback(music);
		return true;
	}

	$.ajax({
		type: myplayer.method,
		url: myplayer.api,
		data: "types=pic&id=" + music.pic_id + "&source=" + music.source,
		dataType: "jsonp",
		success: function(jsonData) {

			if(myplayer.debug) {
				console.log("歌曲封面：" + jsonData.url);
			}

			if(jsonData.url !== "") {
				music.pic = jsonData.url;
			} else {
				music.pic = "err";
			}
			//更新数组中的音乐信息
			UpdateMusic(t, music);
			callback(music);
			return true;
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			layer.msg('歌曲封面获取失败 - ' + XMLHttpRequest.status);
			console.error(XMLHttpRequest + textStatus + errorThrown);
		}
	});
}

//获取歌词
function AjaxLyric(t, music, callback) {
	if(!music.lyric_id)
		return false;
	$.ajax({
		type: myplayer.method,
		url: myplayer.api,
		data: "types=lyric&id=" + music.lyric_id + "&source=" + music.source,
		dataType: "jsonp",
		success: function(jsonData) {
			if(jsonData.lyric) {
				callback(jsonData.lyric);
			} else {
				callback('');
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			layer.msg('歌词读取失败 - ' + XMLHttpRequest.status);
			console.error(XMLHttpRequest + textStatus + errorThrown);
		}
	});
}