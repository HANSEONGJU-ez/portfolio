gsap.registerPlugin(ScrollTrigger);

var _device = '';
var _deviceCondition = '';

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

    },
    commonFn: function(){
      // 비주얼 타이포 모션 스크립트
      var arrTit = [];
      
      $(".typo-motion").css("opacity", 1);
      $(".typo-motion").each(function(){
        typoMotion.incision($(this));
        $(this).find("span").each(function(q){
          arrTit.push($(this));
        })
      });
      gsap.to(arrTit, {duration: 1.1, left: 0, opacity: 1, ease: "power3.inOut", stagger: 0.07});
      $(".visual-txt").addClass("on")

      // 탭
      $(".tab-btn-area .btn").each(function(q){
        $(this).on("click", function(){
          if(!$(this).hasClass("on")){
            lazyLoading();
            $(".tab-btn-area .btn").removeClass("on");
            $(this).addClass("on");
            $(".tab-con-area .tab-con").removeClass("on");
            $(".tab-con-area .tab-con").eq(q).addClass("on");
            $(".tab-con-area .tab-con .list-wrap").removeClass("active");
            setTimeout(function(){
              $(".tab-con-area .tab-con").eq(q).find(".list-wrap").addClass("active");
            },10)
          }
        });
      });

      $(".btn-top").on("click", function(){
        gsap.to($("html, body"), {duration: 1, scrollTop: 0, ease: "power3.out"})
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

      // scrollMotion
      scrollMotionTrigger();
    },
    swiperFn: function(){
      if($(".visual-area .swiper-slide").length > 1){
        var progressBarMotion = gsap.to($(".visual-area .progress-bar .bar"), {duration: 5, height: "100%", ease: "none", onComplete: function(){
          visualSwiper.slideNext();
        }});
        
        var thisSlide;
        
        var currentNum = 0;
        var totalNum = $(".bg-img .swiper-slide").length;
        
        $(".control-area .total-num").text("0" + totalNum);

        var visualSwiper = new Swiper(".visual-area .bg-img.swiper-container", {
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
              
              $(".control-area .current-num").text("0" + currentNum);
  
              $(".visual-area .swiper-slide").removeClass("on");
              $(".visual-area .swiper-slide-active").addClass("on");
              $(".visual-area .swiper-slide-duplicate-active").addClass("on");
  
              gsap.set($(".visual-area .swiper-slide-prev .img"), {transform:"translateX(0)"});
              gsap.set($(".visual-area .swiper-slide-next .img"), {transform:"translateX(0)"});
              gsap.set($(".visual-area .swiper-slide-duplicate-prev .img"), {transform:"translateX(0)"});
              gsap.set($(".visual-area .swiper-slide-duplicate-next .img"), {transform:"translateX(0)"});
              gsap.set($(".visual-area .swiper-slide-active .img"), {transform:"translateX(0)"});
              gsap.set($(".visual-area .swiper-slide-duplicate-active .img"), {transform:"translateX(0)"});
  
              progressBarMotion.restart();
  
              thisSlide = $(".visual-area .swiper-slide.on .img");
              gsap.to(thisSlide, {duration: 6.7, transform:"translateX(-130px)", ease: "none"});
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
      $("section .tab-con-area .list-wrap .list").each(function(){
        $(this).on("click", function(){
          if(!$(this).hasClass("no-click") && !$(this).hasClass("proposal")){
            $(this).find(".label").each(function(){
              if($(this).hasClass("no-show")){
                if($(this).text() == "진행중"){
                  $(".list-pop .con-txt").append("<p class='txt'>현재 <span class='red-txt'>진행중</span>으로 사이트 확인이 <span class='red-txt'>불가</span>합니다.</p>")
                }else if($(this).text() == "내부망"){
                  $(".list-pop .con-txt").append("<p class='txt'><span class='red-txt'>내부망</span>으로 인하여 사이트 확인이 <span class='red-txt'>불가</span>합니다.</p>")
                }else if($(this).text() == "미오픈"){
                  $(".list-pop .con-txt").append("<p class='txt'><span class='red-txt'>미오픈</span>으로 인하여 사이트 확인이 <span class='red-txt'>불가</span>합니다.</p>")
                }
                $(".list-pop .view-site").hide();
              }
            });
            $("body").addClass("stop-scroll");
            $(".list-pop .pop-wrap .pop-head .title").text($(this).find(".tit span").text());
            if(!$(this).data("url")){
              $(".list-pop .view-site").hide();
            } else {
              $(".list-pop .view-site").attr("href", $(this).data("url"));
            }
            $(".list-pop .img img").attr("src", $(this).data("src"));
            $(".list-pop .view-repo").attr("href", $(this).data("repo"));
            $(".list-pop .pop-wrap .pop-cont .for-padding .scroll-area .con-txt .summary .data").text($(this).data("summary"));
            $(".list-pop .pop-wrap .pop-cont .for-padding .scroll-area .con-txt .performance .data").text($(this).data("performance"));
            $(".list-pop .pop-wrap .pop-cont .for-padding .scroll-area .con-txt .role .data").text($(this).data("role"));
            $(".list-pop .pop-wrap .pop-cont .for-padding .scroll-area .con-txt .skill .data").text($(this).data("skill"));
            $(".list-pop .pop-wrap .pop-cont .for-padding .scroll-area .con-txt .contribution .data").text($(this).data("contribution"));
            $(".list-pop").fadeIn();
            popupResize();
            if(!$(this).data("role")){
              $(".list-pop .pop-wrap .pop-cont .for-padding .scroll-area .con-txt .role").remove();
              $(".list-pop .pop-wrap .pop-cont .for-padding .scroll-area .con-txt .skill").remove();
              $(".list-pop .pop-wrap .pop-cont .for-padding .scroll-area .con-txt .contribution").remove();
            }else if(!$(this).data("repo")){
              $(".list-pop .view-repo").remove()
            }
          }
        });
      });

      // 팝업 닫기
      $(".list-pop .pop-wrap .btn-close").on("click", function(){
        $(this).parents(".list-pop").fadeOut(300, function(){
          $(".list-pop .view-site").show();
          $(".list-pop .img img").attr("src", "")
        });
        $("body").removeClass("stop-scroll");
      });
      
    },
  }
})();

$(window).on("load", function(){
  commonScript.deviceChk();
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
    if($(this).find("img").length >= 2){
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
  if($(".scroll-motion").length > 0){
    $(".scroll-motion:visible").each(function(q){
      gsap.to($(this), {
        scrollTrigger: {
          trigger: $(this),
          start: "top 80%",
          end:"bottom top",
          toggleClass: {targets: $(".scroll-motion:visible").eq(q), className: "active"},
          once: true,
          // markers: true,
        },
      });
    });
  }
}

function repositioningTopBtn(){
  if($(window).scrollTop() > 0){
    $(".btn-top").fadeIn();
  }else{
    $(".btn-top").fadeOut();
  }

  var bottomGap = 40;
  var pathLength = 160;

  if($(window).scrollTop() + window.innerHeight > $("footer").offset().top) {// 푸터에 붙었을 때,
    $(".btn-top").css("bottom", $(window).scrollTop() + window.innerHeight - $("footer").offset().top + bottomGap);
  }else {
    // 스크롤 할 때,
    $(".btn-top").css("bottom", "");
  }

  
  document.getElementById("top_svg-circle").setAttribute("r", 25);
  document.getElementById("top_svg-circle").setAttribute("cx", 26);
  document.getElementById("top_svg-circle").setAttribute("cy", 26);

  $(".svg-circle").css("stroke-dasharray", pathLength + Math.floor(($(window).scrollTop() / ($(document).height() - window.innerHeight)) * pathLength));
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
  $(".list-pop:visible").find(".pop-wrap, .pop-cont").css("height", "")
  $(".list-pop:visible").find(".pop-cont").height($(".list-pop:visible").find(".pop-wrap").height() - $(".list-pop:visible").find(".pop-head").innerHeight())
  $(".list-pop:visible").find(".pop-wrap").height(Math.ceil($(".list-pop:visible").find(".pop-cont").height() + $(".list-pop:visible").find(".pop-head").innerHeight())); // 소수점 버림
  $(".list-pop:visible").find(".pop-wrap").css({"margin-left": $(".list-pop:visible").find(".pop-wrap").width()*-0.5, "margin-top": $(".list-pop:visible").find(".pop-wrap").height()*-0.5}); // 중앙정렬
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