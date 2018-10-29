//加载CenBtn
function InitCenBtn() {
	//加载单击事件
	InitCenBtnClick();
}
//加载按钮单击事件
function InitCenBtnClick() {
	$(".btn").click(function() {
		switch($(this).data("action")) {
			case $(this).data("action"):
				var e = $(this).data("action");
				ChangeCenBtnColor("btn" + e, "#7bc6fc", "btn", "#e9f5fe");
				//载入列表
				LoadList(parseInt(e));
				//切换列表后，当前歌曲如果在列表中，就把这条数据的背景变色
				ChangeDisItemColor();
				break;
		}
	});
}

//搜索功能
function MySearch() {
	//每次开始新的搜索就把搜索页数重置为1
	sepage = 1;
	//获取搜索词
	seword = $("#sebox").val();
	//改变颜色
	ChangeCenBtnColor("btn" + 0, "#7bc6fc", "btn", "#e9f5fe");
	//列表滚动到顶部
	ListToTop();
	//搜索音乐
	AjaxSearch();
	return false;
}

//中部按钮单击事件加载相应的列表
function LoadList(t) {
	//如果当前显示的列表是e，就不再重新装入
	if(dislist == t)
		ListToTop();
	else {
		dislist = t;
		AddListDiv();
	}
}
//单击改变整个div容器的背景色，并设置某个div的背景色（选中）
function ChangeCenBtnColor(idname, idcolor, classname, classcolor) {
	ChangColorByClass(classname, classcolor);
	ChangeColorById(idname, idcolor);
}