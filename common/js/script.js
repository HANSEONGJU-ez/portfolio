var _isScrollTop;           // scrollTop 변수
var _device = '';           // 접속 device 체크 위한 변수
var _deviceCondition = '';  // 해상도 따른 device 체크 위한 변수
var _browser = '';          // browser 체크 위한 변수

var commonScript = (function(){
  return {
    deviceChk : function(){
      // 디바이스 체크
      if(/Android/i.test(navigator.userAgent)) {
        _device = 'android';
      } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        return navigator.userAgent.match(/(iPhone|iPod)/g) ? _device='ios' : _device='ipad';
      }else {
        _device = 'pc';
      }

      // 브라우저 체크
      var agent = navigator.userAgent.toLowerCase(),
          name = navigator.appName;

      if(name === 'Microsoft Internet Explorer' || agent.indexOf('trident') > -1 || agent.indexOf('edge/') > -1) {
        _browser = 'ie';
        $("html").addClass("ie");
      } else if(agent.indexOf('safari') > -1) { // Chrome or Safari
        if(agent.indexOf("chrome") > -1){
          _browser = 'chrome';
          $("html").addClass("chrome");
        }else{
          _browser = 'safari';
          $("html").addClass("safari");
        }
      } else if(agent.indexOf('firefox') > -1) { // Firefox
        _browser = 'firefox';
      }
    },
    commonFn: function(){
      // 비주얼 타이포 모션 스크립트
      var arrTit = [];
      
      $(".typo_motion").css("opacity", 1);

      $(".typo_motion").each(function(){
        typoMotion.incision($(this));
        $(this).find("span").each(function(q){
          arrTit.push($(this));
        })
      });
      
      $(".typo_motion").css("opacity", 1);
      TweenMax.staggerTo(arrTit, 1.1, {left:0, opacity:1, ease:Power3.easeInOut}, 0.07);
      $(".visual_txt").addClass("on")

      // 탭
      $(".tab_btn_area .btn").each(function(q){
        $(this).on("click", function(){
          if(!$(this).hasClass("on")){
            lazyLoading();
            $(".tab_btn_area .btn").removeClass("on");
            $(this).addClass("on");
            $(".tab_con_area .tab_con").removeClass("on");
            $(".tab_con_area .tab_con").eq(q).addClass("on");
            $(".tab_con_area .tab_con .list_wrap").removeClass("active");
            setTimeout(function(){
              $(".tab_con_area .tab_con").eq(q).find(".list_wrap").addClass("active");
            },10)
          }
        });
      });

      $(".btn_top").on("click", function(){
        gsap.to($("html, body"), 1, {scrollTop:0, ease:Power3.easeOut})
        repositioningTopBtn();
      })

    },
    scrollFn: function(){
      // not IE
      $(window).on("scroll", function(){
        _isScrollTop =  $(window).scrollTop();
        
        // 탑버튼
        repositioningTopBtn();
      });
      $(window).scroll();

      // for IE
      $("body").on("scroll", function(){
        
      });

      // scrollMotion
      scrollMotionTrigger();
    },
    swiperFn: function(){
      if($(".visual_area .swiper-slide").length > 1){
        var progressBarMotion = gsap.to($(".visual_area .progress_bar .bar"), 5, {height:"100%", ease:"none", onComplete:function(){
          visualSwiper.slideNext();
        }});
        
        var thisSlide;
        
        var currentNum = 0;
        var totalNum = $(".bg_img .swiper-slide").length;
        
        $(".control_area .total_num").text("0" + totalNum);

        var visualSwiper = new Swiper(".visual_area .bg_img.swiper-container", {
          effect:"fade",
          loop:true,
          speed:1500,
          simulateTouch:false,
          on:{
            slideChangeTransitionStart : function(){
              currentNum++;
              if(currentNum > totalNum){
                currentNum = 1;
              }
              
              $(".control_area .current_num").text("0" + currentNum);
  
              $(".visual_area .swiper-slide").removeClass("on");
              $(".visual_area .swiper-slide-active").addClass("on");
              $(".visual_area .swiper-slide-duplicate-active").addClass("on");
  
              gsap.to($(".visual_area .swiper-slide-prev .img"), 0, {transform:"translateX(0)", ease:"none"});
              gsap.to($(".visual_area .swiper-slide-next .img"), 0, {transform:"translateX(0)", ease:"none"});
              gsap.to($(".visual_area .swiper-slide-duplicate-prev .img"), 0, {transform:"translateX(0)", ease:"none"});
              gsap.to($(".visual_area .swiper-slide-duplicate-next .img"), 0, {transform:"translateX(0)", ease:"none"});
              gsap.to($(".visual_area .swiper-slide-active .img"), 0, {transform:"translateX(0)", ease:"none"});
              gsap.to($(".visual_area .swiper-slide-duplicate-active .img"), 0, {transform:"translateX(0)", ease:"none"});
  
              progressBarMotion.restart();
  
              thisSlide = $(".visual_area .swiper-slide.on .img");
              imgMoving = gsap.to(thisSlide, 6.7, {transform:"translateX(-130px)", ease:Linear.easeNone});
            },
          }
        });
      }
    },
    resizeFn: function(){
      $(window).resize(function(){
        
        // 해상도 따른 pc, mobile 구분
        if(window.innerWidth > 1024 ){ // pc
          _deviceCondition = "pc";

          
        }else{ // mobile
          _deviceCondition = "mobile";
        }
        
        // 팝업 리사이즈
        popupResize();
      }).resize();
    },
    popupFn:function(){
      // 팝업
      $("section .tab_con_area .list_wrap .list").each(function(){
        $(this).on("click", function(){
          if(!$(this).hasClass("no_click") && !$(this).hasClass("proposal")){
            $(this).find(".label").each(function(){
              if($(this).hasClass("no_show")){
                if($(this).text() == "진행중"){
                  $(".list_pop .con_txt").append("<p class='txt'>현재 <span class='red_txt'>진행중</span>으로 사이트 확인이 <span class='red_txt'>불가</span>합니다.</p>")
                }else if($(this).text() == "내부망"){
                  $(".list_pop .con_txt").append("<p class='txt'><span class='red_txt'>내부망</span>으로 인하여 사이트 확인이 <span class='red_txt'>불가</span>합니다.</p>")
                }else if($(this).text() == "미오픈"){
                  $(".list_pop .con_txt").append("<p class='txt'><span class='red_txt'>미오픈</span>으로 인하여 사이트 확인이 <span class='red_txt'>불가</span>합니다.</p>")
                }
                $(".list_pop .view_site").hide();
              }
            });
            $("body").addClass("stop_scroll");
            $(".list_pop .pop_wrap .pop_head .title").text($(this).find(".tit span").text());
            $(".list_pop .view_site").attr("href", $(this).data("url"));
            $(".list_pop .img img").attr("src", $(this).data("src"));
            $(".list_pop .view_repo").attr("href", $(this).data("repo"));
            $(".list_pop .pop_wrap .pop_cont .for_padding .scroll_area .con_txt .summary .data").text($(this).data("summary"));
            $(".list_pop .pop_wrap .pop_cont .for_padding .scroll_area .con_txt .performance .data").text($(this).data("performance"));
            $(".list_pop .pop_wrap .pop_cont .for_padding .scroll_area .con_txt .role .data").text($(this).data("role"));
            $(".list_pop .pop_wrap .pop_cont .for_padding .scroll_area .con_txt .skill .data").text($(this).data("skill"));
            $(".list_pop .pop_wrap .pop_cont .for_padding .scroll_area .con_txt .contribution .data").text($(this).data("contribution"));
            $(".list_pop").fadeIn();
            popupResize();
            if($(this).data("role") == ""){
              $(".list_pop .pop_wrap .pop_cont .for_padding .scroll_area .con_txt .role").remove();
              $(".list_pop .pop_wrap .pop_cont .for_padding .scroll_area .con_txt .skill").remove();
              $(".list_pop .pop_wrap .pop_cont .for_padding .scroll_area .con_txt .contribution").remove();
            }else if(!$(this).data("repo")){
              $(".list_pop .view_repo").remove()
            }
          }
        });
      });

      // 팝업 닫기
      $(".list_pop .pop_wrap .btn_close").on("click", function(){
        $(this).parents(".list_pop").fadeOut(300, function(){
          $(".list_pop .view_site").show();
          $(".list_pop .img img").attr("src", "")
        });
        $("body").removeClass("stop_scroll");
      });
      
    },
  }
})();

$(window).on("load", function(){
  commonScript.deviceChk();
  // commonScript.headerFooterFn();
  gsap.delayedCall(0.2, function() {
    commonScript.swiperFn();
    commonScript.commonFn();
    commonScript.resizeFn();
    commonScript.scrollFn();
    commonScript.popupFn();
  });
  
});

function imgResizingFn(){
  var imgNum;
  $(".img_resize_w").each(function(){
    if($(this).find("img").size() >= 2){
      if(window.innerWidth > 768){
        imgNum = 0;
      }else{
        imgNum = 1;
      }
    }else{
      imgNum = 0;
    }

    if($(this).find("img").get(imgNum).naturalWidth / $(this).find("img").get(imgNum).naturalHeight <= $(this).width() / $(this).innerHeight()){
      $(this).addClass("reverse");
    }else{
      $(this).removeClass("reverse");
    }
  });
}

function scrollMotionTrigger(){
  if($(".scroll_motion").size() > 0){
    $(".scroll_motion:visible").each(function(q){
      gsap.to($(this), {
        scrollTrigger: {
          trigger: $(this),
          start: "top 80%",
          end:"bottom top",
          toggleClass: {targets: $(".scroll_motion:visible").eq(q), className: "active"},
          once: true,
          // markers: true,
        },
      });
    });
  }
}

function repositioningTopBtn(){
  if($(window).scrollTop() > 0){
    $(".btn_top").fadeIn();
  }else{
    $(".btn_top").fadeOut()
  }

  var bottomGap = 40;
  var pathLength = 160;

  if($(window).scrollTop() + window.innerHeight > $("footer").offset().top) {// 푸터에 붙었을 때,
    $(".btn_top").css("bottom", $(window).scrollTop() + window.innerHeight - $("footer").offset().top + bottomGap);
  }else {
    // 스크롤 할 때,
    $(".btn_top").css("bottom", "");
  }

  
  document.getElementById("top_svg_circle").setAttribute("r", 25);
  document.getElementById("top_svg_circle").setAttribute("cx", 26);
  document.getElementById("top_svg_circle").setAttribute("cy", 26);

  $(".svg_circle").css("stroke-dasharray", pathLength + Math.floor(($(window).scrollTop() / ($(document).height() - window.innerHeight)) * pathLength));
}

var typoMotion = (function(){
  return {
    incision : function (cls) {
      var arrTxt = $(cls).text().trim().split("");
      $(cls).text("");
      for(var i=0; i<arrTxt.length; i++) {
        $(cls).append("<span>" + arrTxt[i] + "</span>");
      }
    }
  }
})();

function popupResize(){
  lazyLoading();
  $(".list_pop:visible").find(".pop_wrap, .pop_cont").css("height", "")
  $(".list_pop:visible").find(".pop_cont").height($(".list_pop:visible").find(".pop_wrap").height() - $(".list_pop:visible").find(".pop_head").innerHeight())
  $(".list_pop:visible").find(".pop_wrap").height(Math.ceil($(".list_pop:visible").find(".pop_cont").height() + $(".list_pop:visible").find(".pop_head").innerHeight())); // 소수점 버림
  $(".list_pop:visible").find(".pop_wrap").css({"margin-left": $(".list_pop:visible").find(".pop_wrap").width()*-0.5, "margin-top": $(".list_pop:visible").find(".pop_wrap").height()*-0.5}); // 중앙정렬
}

var lazyLoading = () => {
  var imgs = document.querySelectorAll('.lazy');

  var observerCallback = (entries, observer) => {
    entries.forEach(({ isIntersecting, intersectionRatio, target }) => {
      if (isIntersecting && intersectionRatio > 0) {
        target.src = target.dataset.src;
        target.classList.remove("lazy");
        observer.unobserve(target);
      }
    });
  };

  var io = new IntersectionObserver(observerCallback);
  imgs.forEach((img) => io.observe(img));
};