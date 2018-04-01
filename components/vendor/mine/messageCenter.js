$(function(){
  //   var params = {
  //   // wx_openid: localStorage.getItem('wx-openid'),
  //   wx_openid: "oC1aRuCuXO6eUPYeSnFDcMe7hj5o",
  //   invite_code: localStorage.getItem('invite-code'),
  //   isLogin: sessionStorage.getItem('isLogin')
  // }
  $("#sort").click(function () {
      if ($(".Filter").css("display") == "none") {
        $(this).addClass("active");
        $(".Filter").slideDown();
        $("#ol-layer").show();
      } else {
        $(this).removeClass("active");
        $(".Filter").slideUp();
        $("#ol-layer").hide();
      }
    });
    $("#ol-layer").click(function(){
      $(".Filter").slideUp();
      $("#sort").removeClass("active");
      $(this).hide();
    });
     $(".Filter ul li").click(function(){
      $(".Filter").slideUp();
      $("#sort").removeClass("active");
      $("#ol-layer").hide();
      $(this).addClass("active").siblings().removeClass("active");
    });
})