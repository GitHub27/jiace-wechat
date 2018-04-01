/*获取本地临时数据*/
function loadStorage(key) {
  var value = sessionStorage.getItem(key);
  return value;
}

var coursename = loadStorage('courseName');
console.log(coursename);
var wx_openid = localStorage.getItem('wx-openid');
// var wx_openid = "oC1aRuCuXO6eUPYeSnFDcMe7hj5o";

function pageInit() {
  $('.title').text(coursename);
  $.ajax({
    url: window.global_config.getScore,
    type: "post",
    data: {batchId: loadStorage("batchId")},
    dataType: "json",
    headers: {
      'wx-openid': wx_openid,
    },
    success: function success(data) {
      if (data.code == 0) {
        //初始化得分数据页面
        var dataJD = data.jsonData;
        $(".n_coursename").text(coursename);
        $(".n_useTime").text(dataJD.useTime);
        $(".n_score").text(dataJD.score+"分");
      } else {
        checkAuth(data.code);
        $.toast(data.msg);
      }
    }
  });
}
$(function () {
  pageInit()
});
// $.init();