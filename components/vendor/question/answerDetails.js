/**
 * Created by hzp on 2016/12/1.
 */
// var wx_openid = "oC1aRuCuXO6eUPYeSnFDcMe7hj5o";
var wx_openid = localStorage.getItem('wx-openid');
var M = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I"
];
$(function () {
   var id = location.href.split('?')[1].split('=')[1];
  $.ajax({
    url: window.global_config.getQWDetails,
    type: "post",
    data: {id: id},
    dataType: "json",
    headers: {
      'wx-openid': wx_openid,
    },
    success: function success(data) {
      if (data.code == 0) {
        var dataJD = data.jsonData;
        //初始化得分数据页面
        $(".content-block-title").html(dataJD.quesiotns.question);
        var html = "";
        $.each(dataJD.quesiotns.answers, function (i, val) {
              html += "<li>"+
                        "<label class='label-checkbox item-content'>"+
                           "<input type='radio' name='my-radio' id='"+val.id+"' disabled='disabled'>"+
                            "<div class='item-media'>"+
                              "<i class='icon icon-form-checkbox'></i>"+
                            "</div>"+
                            "<div class='item-inner'>"+
                                "<div class='item-text'>"+
                                    "<span id='span_" + val.id + "'>" + M[i] + "</span>."+val.answerDesc+
                                "</div>"+
                            "</div>"+
                          "</label>"+
                      "</li>";
                if (val.isAnswer == '1') {
                  $(".scoresBtn span").html("<span>正确答案:" + M[i] + "</span>")
                }
          });
          $(".media-list .answer").html(html);
          $('input[id=\'' + dataJD.userAnswer + '\']').attr("checked", true);
      } else if (data.code == 20004) {
        $.toast(data.msg);
        window.location.href = "/pages/register.html";
      } else {
        checkAuth(data.code);
        $.toast(data.msg);
      }
    }
  });
});
