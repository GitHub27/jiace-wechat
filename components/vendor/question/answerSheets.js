var wx_openid = localStorage.getItem('wx-openid');
// var wx_openid = "oC1aRuCuXO6eUPYeSnFDcMe7hj5o";
$(function () {
  // alert(loadStorage("batchId"));
   $.ajax({
    url: window.global_config.getAnswerSheet,
    type: "post",
    data: {batchId: loadStorage("batchId")},
    dataType: "json",
    headers: {
      'wx-openid': wx_openid,
    },
    success: function success(data) {
      if (data.code == 0) {
        var dataJD = data.jsonData;
        //  alert(JSON.stringify(dataJD));
        //  alert(dataJD.length);
         var html = "";
        $.each(dataJD, function (i, val) {
            var n = i+1;
            if (val.isCorrect == '0') {
              html +="<a class='circle_error' href='/pages/answerDetails.html?answerId=" + val.id + "'>"+n+"</a>";
            }
            if (val.isCorrect == '1') {
                html +="<a class='circle_right' href='/pages/answerDetails.html?answerId=" + val.id + "'>"+n+"</a>";
            }
          })
        $(".icons-demo").html(html);
      } else if (data.code == 20004) {
        $.toast(data.msg);
        window.location.href = "/pages/login.html";
      }  else {
        checkAuth(data.code);
        $.toast(data.msg);
      }
    }
  });
});

function loadStorage(key) {
  var value = sessionStorage.getItem(key);
  return value;
}

