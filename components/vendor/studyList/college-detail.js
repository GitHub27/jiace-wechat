/**
 * Created by hzp on 2016/11/28.
 */
var wx_openid = localStorage.getItem('wx-openid');
var div = function (e, classN) {
  return $(document.createElement(e)).addClass(classN);
};
var schoolId = getUrlParamSp('id');
var url = window.location.href;

var name = decodeURIComponent(url);

function getUrlParamSp(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}
//判断是否为空
function isEmpty(param) {
  if ($.trim(param) != "" && $.trim(param) != null) {
    return false;
  } else {
    return true;
  }
};
//响应等待时间
function timedMsg(s, href) {
  setTimeout(function () {
    window.location.href = href
  }, s);
}
//推荐课程
function recommend() {
  $(".content").html("");
  var params = {
    'institutionInfoId': schoolId,
    'pageIndex': 1,
    'pageSize': 100
  };
  var wx_openid = localStorage.getItem('wx-openid');
  $.ajax({
    url: window.global_config.college_courselist,
    type: "post",
    data: params,
    dataType: "json",
    headers: {
      "wx-openid": wx_openid
    },
    success: function success(data) {
      if (data.code == 0) {
        if (data.jsonData == null || data.jsonData == '') {
          $(".content").html(initNothing());
        } else {
          $(".content").html(initRecommend());
          initRecommendList("recommendC", data.jsonData.rows);
        }
      } else {
        $.toast(data.msg);
      }
    },
    error: function () {
      /**测试数据 
      data = {
        "success": true,
        "code": 0,
        "msg": "成功",
        "toUrl": null,
        "page": null,
        "totalPage": null,
        "jsonData": {
          "page": 1,
          "pageSize": 2,
          "records": 17,
          "total": 9,
          "rows": [{
              "id": 3,
              "packageName": "家政服务（上岗）",
              "remarks": null,
              "price": 0,
              "originalPrice": 1420,
              "isDiscount": null,
              "isUsable": null,
              "addTime": null,
              "addAccount": null,
              "modifyTime": null,
              "modifyAccount": null,
              "status": null,
              "summary": "家政上岗第一步！\n运用家政服务相关技能，在家庭条件下，提供保洁、烹饪、居家护理等家政服务的能力",
              "applyCourses": null,
              "sortNo": null,
              "schoolId": null,
              "statusList": null,
              "workType": "钟点工、保姆、老人陪护",
              "orderNum": 507
            },
            {
              "id": 4,
              "packageName": "母婴护理（专项）",
              "remarks": null,
              "price": 350,
              "originalPrice": 1500,
              "isDiscount": null,
              "isUsable": null,
              "addTime": null,
              "addAccount": null,
              "modifyTime": null,
              "modifyAccount": null,
              "status": null,
              "summary": "从事为孕产妇在分娩前后及新生儿、婴儿提供生活护理服务",
              "applyCourses": null,
              "sortNo": null,
              "schoolId": null,
              "statusList": null,
              "workType": "月嫂、育儿嫂",
              "orderNum": 2919
            }
          ]
        },
        "totalData": null
      }
      if (data.code == 0) {
        if (data.jsonData == null || data.jsonData == '') {
          $(".content").html(initNothing());
        } else {
          $(".content").html(initRecommend());
          initRecommendList("recommendC", data.jsonData.rows);
        }
      } else {
        $.toast(data.msg);
      }
      */
      console.log('error :' + window.global_config.college_courselist);
    }
  });
}


//初始化推荐课程
function initRecommend() {
  return div("div", "content-block").append(
    div("ul", "study_list_box").attr("id", "recommendC"),
    div("div", "").attr("id", "modal")
  );
}

function initRecommendList(em, data) {

  var html = '';
  $.each(data, function (index, item) {
    var originalPrice = item.originalPrice ? "￥" + item.originalPrice : '',
      yh = item.isDiscount == '1' ? '<span class="privilege">优惠</span>' : '';

    html = `
      <li class="study_list">
        <div class="study_list_pannel">
          <div class="title-warp">
            <h2>${item.packageName}</h2>
            <span>
              <img src="../img/online.png">${item.orderNum}
            </span>
          </div>
          <h3>适合工种：${item.workType}</h3>
          <p>${item.summary}</p>
        </div>
        <div class="price_box" id="footer${index}">
          <div class="price">
            <h4>￥${item.price}
              ${yh}
            </h4>
            <span class="original">${originalPrice}</span>
          </div>
          <span class="status"></span>
        </div>
      </li>
`
    $('#' + em).append(html);
    var statusBtn = $("#footer" + index).find(".status");
    switch (item.status) {
      case '01':
        statusBtn.addClass("daibao").attr("onclick", "javascript:applyConfirm(" + item.productId + ")").html("立即登记")
        break;
      case '02':
        statusBtn.addClass("daishen").html("待审核")
        break;
      case '03':
        statusBtn.addClass("bubao").html("停售")
        break;
      case '04':
        statusBtn.addClass("yibao").html("已报名")
        break;
      case '05':
        statusBtn.addClass("bubao").attr("onclick", "javascript:$.toast(\"该产品下有课程已报名\")").html("不可报名")
        break;
      default:
        break;
    }
  });

}
//初始化已报课程

//加载无数据
function initNothing() {
  return div("div", "content native-scroll").html('<div class="no_info">暂无课程，如需报名请联系学校</div>');
}
//课程订单申请操作--加载上课时间
function applyConfirm(productId) {
  $.ajax({
    url: window.global_config.userInfo,
    type: "get",
    dataType: "json",
    headers: {
      'wx-openid': wx_openid,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    success: function success(data) {
      if (data.code == 0) {
        completeInfo(data.jsonData, productId);
      } else if (data.code == 20004) {
        if (wx_openid == 'null' || isEmpty(wx_openid)) {
          $.toast('预览版不支持报名，请用微信进行报名')
          return;
        } else {
          $.toast("您未绑定账号，请先登录");
          timedMsg(2000, '/pages/register.html');
        }
      } else {
        checkAuth(data.code);
      }
    },
    error: function (err) {
      console.log(err);
    }
  });
}
//完善信息
function completeInfo(data, productId) {
  if (isEmpty(data.username) || isEmpty(data.inviteCode)) {
    $.toast('报名前请先完善个人信息');
    timedMsg(2000, '/pages/infoComplete.html');
  } else {
    $("#modal").hide();
    var params = {
      productId: productId
    };
    $.ajax({
      url: window.global_config.courseTimes,
      type: "post",
      data: params,
      headers: {
        'wx-openid': wx_openid,
      },
      async: false,
      dataType: "json",
      success: function success(data) {
        if (data.code == 0) {
          if (data.jsonData == null || data.jsonData == '') {
            $.toast("数据异常");
          } else {
            $("#modal").html("").append(
              div("form", "").attr("id", "form-1").append(
                div("ul", "select_list")
              )
            );
            $.each(data.jsonData, function (index, item) {
              $(".select_list").append(
                div("li", "select").append(
                  div("p", "").append(item.courseName)
                ).attr("id", "selectLi" + index).attr("courseId", item.courseId)
              )
              $.each(item.classTimes, function (i, item0) {
                $("#selectLi" + index).append(
                  div("div", "select_l").append(
                    div("input", "").attr("type", "radio").attr("name", "my-radio" + index).attr("id", "times" + index + i).attr("code", item0.templateId),
                    div("label", "").attr("for", "times" + index + i).append(item0.templateName)
                  )
                )
              })
            })

            $('body').popup({
              title: '选择上课时间',
              id: 'pop-1',
              formId: 'form-1',
              closeOnOk: false,
              ok: '提交',
              onOk: function () {
                applyComplete(productId);
              }
            });
          }
        } else {
          checkAuth(data.code);
          $.toast(data.msg);
        }
      }
    });
  }
}
//课程订单申请完成
function applyComplete(productId) {
  var params = new Object();
  $(".select_list li").each(function (index) {
    params["applys[" + index + "].productId"] = productId;
    params["applys[" + index + "].courseId"] = $(this).attr("courseId");
    params["applys[" + index + "].classTimes"] = $(this).find("input[name='my-radio" + index + "']:checked").attr("code");

  });
  console.log(params);
  if (!validate(params)) {
    return;
  }

  $.showPreloader();

  $.ajax({
    url: window.global_config.applyOrders,
    type: "post",
    data: params,
    dataType: "json",
    headers: {
      'wx-openid': wx_openid,
    },
    success: function success(data) {
      if (data.code == 0) {
        location.reload();
        // window.location.href = "/pages/studyList.html";
      } else {
        checkAuth(data.code);
        $.toast(data.msg);
        recommend();
      }
      $.hidePreloader();
    },
    error: function () {
      $.hidePreloader();
    }
  });
}


function validate(params) {
  var result = true;
  $.each(params, function (index, item) {
    if (typeof (params[index]) == "undefined" || isEmpty(params[index])) {
      $.toast("请选择上课时间", 2000, "");
      result = false;
      return result;
    }
  });
  return result;
}

function getSchoolName() {
  $.ajax({
    url: window.global_config.course_detail + "/" + schoolId,
    type: "get",
    headers: {
      'wx-openid': wx_openid
    },
    async: false,
    dataType: "json",
    success: function success(data) {
      if (data.success) {
        $('.colloge-info').show();
        $("header h1 i").html(data.jsonData.schoolName);
        $("header h1 i").css({
          background: "url(" + data.jsonData.logoUrl + ") no-repeat left center",
          backgroundSize: "1.8rem"
        });
        $('.colloge-banner').attr('src', data.jsonData.schoolBanner);
        $('.descript').html(data.jsonData.schoolBrief);
        console.log(data)
      }
    },
    error: function () {
      /**
       测试
       
      data = {
        "success": true,
        "code": 0,
        "msg": "成功",
        "toUrl": null,
        "page": null,
        "totalPage": null,
        "jsonData": {
          "id": 1,
          "schoolName": "家策健康学院",
          "schoolPhone": "021-64183797",
          "province": "310000",
          "city": "310100",
          "area": "310104",
          "schoolAddress": "南丹东路300号9幢亚都商务楼1201室",
          "contacts": "王老师、杨老师",
          "contactPhone": "13003131206",
          "remarks": null,
          "applyCourses": null,
          "isUsable": "1",
          "addTime": "2017-08-03 21:24:22",
          "addAccount": "admin",
          "modifyTime": "2017-11-08 19:54:42",
          "modifyAccount": "admin",
          "logoUrl": "http://image-jiacer.jiacer.com/2017110914223453124.png",
          "schoolBanner": "http://test-jiacer.jiacer.com/2018032613400296627.jpg",
          "schoolBrief": "家庭健康服务领域的职业技能培训中心。联合各大家政公司、月子会所、养老机构等进行合作招生，集聚行业雄厚师资力量，应用互联网在线学习手段，对家政服务从业人员进行针对性、分级式、系统化培训。打造了一批又一批超越同行业水平的家政服务员。",
          "learnTypes": null,
          "orderNum": null,
          "areaValue": "徐汇区",
          "schoolAddressWholeText": "上海市市辖区徐汇区南丹东路300号9幢亚都商务楼1201室",
          "cityValue": "市辖区",
          "provinceValue": "上海市"
        },
        "totalData": null
      }
      if (data.success) {
        $('.colloge-info').show();
        $("header h1 i").html(data.jsonData.schoolName);
        $("header h1 i").css({
          background: "url(" + data.jsonData.logoUrl + ") no-repeat left center",
          backgroundSize: "1.8rem"
        });
        $('.colloge-banner').attr('src', data.jsonData.schoolBanner);
        $('.descript').html(data.jsonData.schoolBrief);
        console.log(data)
      }
      */
      console.log('error :' + window.global_config.course_detail);
    }
  });
}
$(function () {
  $('.desc-more').click(function () {
    $(this).hide();
    $('.descript').removeClass('descript');
  });
  getSchoolName()
  recommend();
});
$.init();