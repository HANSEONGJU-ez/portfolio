// 일상케어 데이터 js
function dailyCarCareFn() {
    // 카케어
    var dataNum = parseInt($(".carcare .data span").text()); // 데이터
    var totalNum = 15;
    var minWidth = $(".carcare .gauge").innerWidth(); // 최소 너비
    var barWidth = $(".carcare .gauge-bar").innerWidth(); // 총 너비
    var dataWidth = Math.round(minWidth + ((totalNum - dataNum) / totalNum) * (barWidth - minWidth));

    $(".carcare .gauge").attr("aria-valuenow", dataNum);
    if ($(".carcare .gauge").data("type") == "remain") {
        // gsap.to($(".carcare .gauge"), 1, { width: dataWidth, ease: Power3.easeOut });
        $(".carcare .gauge").attr('data-calvalue', JSON.stringify({ type: "width", value: `${dataWidth}px` }));

        if (dataWidth == barWidth) {
            $(".carcare .gauge-bar").addClass("full");
        }
    } else if ($(".carcare .gauge").data("type") == "pass") {
        // gsap.to($(".carcare .gauge"), 1, { width: $(".carcare .gauge-bar").innerWidth(), ease: Power3.easeOut });
        $(".carcare .gauge").attr('data-calvalue', JSON.stringify({ type: "width", value: `${$(".carcare .gauge-bar").innerWidth()}px` }));
        $(".carcare .gauge-bar").addClass("full");
    }


    if ($(".carcare .reserve-bar").length > 0) {
        for (i = 0; i < $(".reserve").data("order"); i++) {
            $(".reserve-bar .dot-wrap").append("<div class='dot'></div>");
        }

        if ($(".carcare .reserve span").text() == "접수") {
            $(".reserve-bar .dot-wrap").find(".dot").eq(0).css("opacity", "0");
            $(".reserve-bar .reserve .chart-m").css("opacity", 1);
        } else if ($(".carcare .reserve span").text() == "확정") {
            var percent = ($(".reserve-bar").innerWidth() / $(".reserve-bar .dot").length) * 2;
            $(".reserve-bar .dot-wrap").find(".dot").eq(1).prevAll().addClass("on");
            $(".reserve-bar .dot-wrap").find(".dot").eq(1).css("opacity", "0");
            $(".carcare .reserve").attr('data-calvalue', JSON.stringify({ type: "width", value: `${percent}px` }));
        } else if ($(".carcare .reserve span").text() == "결제 필요") {
            var percent = ($(".reserve-bar").innerWidth() / 4) * 3;
            $(".reserve-bar .dot-wrap").find(".dot").eq(2).prevAll().addClass("on");
            $(".reserve-bar .dot-wrap").find(".dot").eq(2).css("opacity", "0");
            $(".carcare .reserve").attr('data-calvalue', JSON.stringify({ type: "width", value: `${percent}px` }));
        } else {
            $(".reserve-bar .dot-wrap").find(".dot").eq(-1).prevAll().addClass("on");
            $(".reserve-bar .dot-wrap").find(".dot").eq(-1).css("opacity", "0");
            $(".carcare .reserve").attr('data-calvalue', JSON.stringify({ type: "width", value: `${$(".reserve-bar").innerWidth()}px` }));
            $(".reserve-bar").addClass("full");
        }
    }
}


// 걷기 데이터 js
function dailyWalkFn() {
    // 걷기
    var dataValues = $(".walk .bar").map(function () {
        return Number($(this).data('value'));
    }).get(); // 걷기 data-value 값 배열
    var sum = dataValues.reduce(function (acc, val) { return acc + val; }, 0); // 값들 합계
    var average = sum / (dataValues.length || 1); // 평균값 (0분모 방지)
    var formattedAverage = Math.round(average).toLocaleString('ko-KR'); // 콤마 표시
    var maxValue = Math.max.apply(null, dataValues);
    var barMaxHeight = $(".bar-vertical-graph").innerHeight(); // 예: 106px
    var HMIN = 36; // 최소 막대/평균선 높이(px)

    // 최대값이 0이면 스케일 0으로 처리
    var scale = (maxValue > 0) ? ((barMaxHeight - HMIN) / maxValue) : 0;

    // ① 평균선 위치 계산
    var avgPx = (maxValue === 0)
        ? HMIN
        : HMIN + Math.round(average * scale);

    // 높이 초과 방지
    avgPx = Math.min(barMaxHeight, avgPx);

    // 모든 값이 같고 0이 아닌 경우 top 클래스
    var allSameAndMax = dataValues.every(function (v) { return v === maxValue; });
    if (allSameAndMax && maxValue !== 0) {
        $(".walk .average").addClass("top");
        avgPx = avgPx - $(".walk .average").innerHeight()
    } else {
        $(".walk .average").removeClass("top");
    }

    // 평균선 위치 적용
    $(".walk .average").attr('data-calvalue', JSON.stringify({
        type: "bottom",
        value: `${avgPx}px`
    }));

    // 평균값 표시
    $(".walk .average span").text(formattedAverage);

    // ② 각 막대 높이 계산
    $(".walk .bar").each(function (i) {
        var value = dataValues[i];
        var barPx;

        if (maxValue === 0) {
            // 전부 0일 때는 최소높이만
            barPx = HMIN;
        } else {
            // 0이 아닐 때: 비율 * (최대높이-최소높이) + 최소높이
            barPx = HMIN + Math.round(value * scale);
        }

        // 상한 제한
        barPx = Math.min(barMaxHeight, barPx);

        $(this).attr('data-calvalue', JSON.stringify({
            type: "height",
            value: `${barPx}px`
        }));
    });
}


// 대중교통 데이터 js
function dailyPublicTransFn() {
    var dataValues = $(".public-trans .bar").map(function () {
        return Number($(this).data('value'));
    }).get();
    var sum = dataValues.reduce(function (acc, val) { return acc + val; }, 0);
    var average = sum / (dataValues.length || 1);
    var formattedAverage = Math.round(average).toLocaleString('ko-KR');
    var maxValue = Math.max.apply(null, dataValues);
    var barMaxHeight = $(".bar-vertical-graph").innerHeight(); // ex) 106px
    var HMIN = 36; // 최소 막대/평균선 높이
    var scale = (maxValue > 0) ? ((barMaxHeight - HMIN) / maxValue) : 0; // 스케일: 최대값이 0이면 0
    var avgPx = (maxValue === 0) ? HMIN : (HMIN + Math.round(average * scale)); // 평균선 픽셀(bottom) 계산
    var allSameAndMax = dataValues.every(function (v) { return v === maxValue; });
    var avgH = $(".public-trans .average").innerHeight() || 0;

    // 모든 값이 동일하고 0이 아닌 경우: 평균선 요소 높이만큼 내려서 상단 이탈 방지
    if (allSameAndMax && maxValue !== 0) {
        avgPx = avgPx - avgH;
    }

    // 안전 클램프 (바닥 HMIN 이상, 상단 요소 높이 고려)
    avgPx = Math.max(HMIN, Math.min(barMaxHeight - avgH, avgPx));

    // 적용
    $(".public-trans .average").attr(
        'data-calvalue',
        JSON.stringify({ type: "bottom", value: `${avgPx}px` })
    );

    // 평균 숫자
    $(".public-trans .average span").text(formattedAverage);

    // top 클래스 토글
    if (allSameAndMax && maxValue !== 0) {
        $(".public-trans .average").addClass("top");
    } else {
        $(".public-trans .average").removeClass("top");
    }

    // 막대 높이 적용
    $(".public-trans .bar").each(function (i) {
        var value = dataValues[i];
        var barPx;

        if (maxValue === 0) {
            barPx = HMIN; // 전부 0이면 36px
        } else {
            barPx = HMIN + Math.round(value * scale); // 0보다 크면 비율 + 최소보장
        }

        // 상한 제한
        barPx = Math.min(barMaxHeight, barPx);
        $(this).attr('data-calvalue', JSON.stringify({ type: "height", value: `${barPx}px` }));
        var thisText = $(this).text();
        $(this).attr('aria-label', thisText + "의 대중교통 이용 요금 그래프");
    });
}


// 펫 & 슈가핏 데이터 js
function dailyPetFn() {
    // 펫
    if ($(".pet .check-bar").length > 0) {
        var percent;

        for (i = 1; i <= $(".pet .check").data("order"); i++) {
            $(".pet .check-bar .dot-wrap").append("<div class='dot'></div>");
        }

        for (k = 1; k <= $(".pet .check").data("value"); k++) {
            if ($(".pet .check").data("value") == k) {
                $(".pet .check-bar .dot-wrap").find(".dot").eq(k - 1).prevAll().addClass("on");
                $(".pet .check-bar .dot-wrap").find(".dot").eq(k - 1).css("opacity", "0");
                percent = ($(".check-bar").innerWidth() / $(".pet .check-bar .dot").length) * k
                $(".pet .check").attr('data-calvalue', JSON.stringify({ type: "width", value: `${percent}px` }));
            }
        }

        if ($(".pet .check").data("order") == $(".pet .check").data("value")) {
            if ($(".pet .check").data("value") == "") {
                $(".pet .check-bar").addClass("no-data");
            } else {
                $(".pet .check-bar").addClass("full");
            }
        }
    }
}

function dailySugarfitFn() {
    /* 슈가핏 사용 일차 */
    var dataNum = parseInt($(".sugarfit .data span").text()); // 데이터

    $(".sugarfit .number-graph .number").attr("aria-valuetext", "슈가핏 미사용 일차");

    if ($(".sugarfit .number-graph").hasClass("done")) {
        var daysPerDiv = 10;
        var divsToOn = Math.ceil(dataNum / daysPerDiv);
        $(".sugarfit .number-graph .number").each(function (q) {
            if (q < divsToOn) {
                $(this).addClass("on");
                $(this).attr("aria-valuetext", "슈가핏 사용 일차")
            }
        });
    } else {
        for (i = 0; i < dataNum; i++) {
            $(".sugarfit .number-graph .number").eq(i).addClass("on");
            $(".sugarfit .number-graph .number").eq(i).attr("aria-valuetext", "슈가핏 사용 일차")
        }
    }




    /* 슈가핏 서비스 이용 절차 */
    for (i = 0; i < $(".sugarfit .check").data("order"); i++) {
        $(".sugarfit .check-bar .dot-wrap").append("<div class='dot'></div>");
    }

    if ($(".sugarfit .check").data("value") == 1) {
        var percent = ($(".sugarfit .check-bar").innerWidth() / $(".sugarfit .check-bar .dot").length);
        $(".sugarfit .check-bar .dot-wrap").find(".dot").eq(0).css("opacity", "0");
        // $(".sugarfit .check").innerWidth(percent);
        $(".sugarfit .check").attr('data-calvalue', JSON.stringify({ type: "width", value: `${percent}px` }));
    } else if ($(".sugarfit .check").data("value") == 2) {
        var percent = ($(".sugarfit .check-bar").innerWidth() / $(".sugarfit .check-bar .dot").length) * 2;
        $(".sugarfit .check-bar .dot-wrap").find(".dot").eq(1).prevAll().addClass("on");
        $(".sugarfit .check-bar .dot-wrap").find(".dot").eq(1).css("opacity", "0");
        // $(".sugarfit .check").innerWidth(percent);
        $(".sugarfit .check").attr('data-calvalue', JSON.stringify({ type: "width", value: `${percent}px` }));
    } else if ($(".sugarfit .check").data("value") == 3) {
        var percent = ($(".sugarfit .check-bar").innerWidth() / $(".sugarfit .check-bar .dot").length) * 3;
        $(".sugarfit .check-bar .dot-wrap").find(".dot").eq(2).prevAll().addClass("on");
        $(".sugarfit .check-bar .dot-wrap").find(".dot").eq(2).css("opacity", "0");
        // $(".sugarfit .check").innerWidth(percent);
        $(".sugarfit .check").attr('data-calvalue', JSON.stringify({ type: "width", value: `${percent}px` }));

        if ($(".sugarfit .check-bar .dot").length == 3) {
            $(".sugarfit .check-bar").addClass("full");
        }
    }
}


// 차트 함수
// 뷰포트에 차트영역이 들어오면, 차트 모션 실행 함수
// # 차트 모션 사용법 : 차트 영역에 chart-motion 감싸기 (차트 차는 모션 후, 보여야하는 요소(ex. 툴팁)들은 chart-m클래스 부여)
// # 페이지 로드할 때, 차트값을 data-calvalue에 저장해놓고, 뷰포트에 진입하면 data-calvalue값 사용하여 차트 모션
function scrollChartMotionFn() {
  gsap.utils.toArray($('.chart-motion').filter(':visible')).forEach((item) => {
    gsap.to(item, {
      scrollTrigger: {
        trigger: item,
        // 2차 반영 : 스크립트 수정 start
        start: () => {
          if ($(".dock-bar").length > 0) {
            return 'top bottom-=80px' // 독바 높이
          } else {
            return 'top bottom'
          }
        },
        onEnter: () => {
          // 막대 그래프
          if ($(item).find('[data-calvalue]').length > 0) {
            $(item)
              .find('[data-calvalue]')
              .map((_, chart) => {
                const data = $(chart).data('calvalue');

                if (data) {
                  gsap.to(chart, 1, {
                    [data.type]: data.value,
                    ease: Power3.easeOut,
                    onUpdate: function () {
                      // 차트 차오른 후 실행
                      if ($(item).find('.chart-m').length > 0) {
                        if (!this.isMotion && this.progress() >= 0.4) {

                          gsap.to($(item).find('.chart-m'), 0.4, { opacity: 1 });
                          this.isMotion = true;
                        }
                      }
                    }
                    // onComplete: () => {
                    //     // 차트 차오른 후 실행
                    //     if($(item).find('.chart-m').length > 0) {
                    //         gsap.to($(item).find('.chart-m'), .4, {opacity: 1});
                    //     }
                    // }
                  });
                } else {
                  if ($(item).find('.chart-m').length > 0) {
                    gsap.to($(item).find('.chart-m'), 0.4, { opacity: 1 });
                  }
                }

              });
          }

          // 동글 게이지
          if ($(item).find('.number-graph .number.on').length > 0) {
            item.style.setProperty('--bar-opacity', '1');
          }

          // 오퍼시티
          if ($(item).find('.chart-mo').length > 0) {
            gsap.to($(item).find('.chart-mo'), 0.4, { opacity: 1 });
          }
        },
        // 2차 반영 : 스크립트 수정 end
        once: true,
        // markers: true,
      }
    });
  });
}


// 앵커 js
anchorFn() {
  // Anchor swiper
  const $anchorLink = $('.anchor-menu .menu');
  let anchorSwiper = null;

  if ($anchorLink.closest('.anchor-swiper').length > 0) {
    anchorSwiper = new Swiper('.anchor-swiper', {
      observe: true,
      observeParents: true,
      slidesPerView: 'auto'
      // preventClicks: false,
    });
  }

  // Anchor Scroll & Click event
  const windowHeight = $(window).outerHeight();
  const documentHeight = $(document).outerHeight();
  const headerHeight = $('.header').height();
  const anchorHeight = $('.anchor-menu').innerHeight();
  let scrollTop = $(window).scrollTop();
  let lastY = 0;
  let isScrolling = false;

  // 앵커 상단 고정 처리 함수
  // @ swiper인 경우 sub-inner에 overflow-x: hidden;속성이 있어서 sticky가 안먹히는 이슈로 script로 상단고정 필요
  function anchorMenuFixFn() {
    if (scrollTop + headerHeight >= $('.anchor-wrap').offset().top) {
      $('.anchor-menu').addClass('fixed');
      $('.anchor-wrap').css('padding-top', anchorHeight);
    } else {
      $('.anchor-menu').removeClass('fixed');
      $('.anchor-wrap').css('padding-top', '')
    }
  }

  // 스크롤 이벤트 [메뉴 상단 고정 & 메뉴 활성화]
  $(window).on('scroll', function () {
    scrollTop = $(window).scrollTop();

    // 앵커 상단 고정 처리
    // @ swiper인 경우 sub-inner에 overflow-x: hidden;속성이 있어서 sticky가 안먹히는 이슈로 script로 상단고정 필요
    if ($('.anchor-swiper').length > 0) {
      anchorMenuFixFn();
    }

    if (!isScrolling) {
      if (scrollTop != lastY) { // (@ ios scroll issue로 인해 check)
        // 스크롤 이벤트 최적화
        requestAnimationFrame(function () {
          // 앵커 스크롤 기능 처리
          anchorScrollFn();
        });
      }
    }

    lastY = scrollTop;
  });

  // 앵커 메뉴 클릭 이벤트 [스크롤 이동 & 메뉴 활성화]
  $anchorLink.on('click', function (e) {
    e.preventDefault();
    isScrolling = true;

    const targetId = $(this).attr('href');
    const $target = $(targetId);

    // 앵커 메뉴 활성화 처리
    anchorLinkActiveFn($(this));
    anchorSwiper && anchorSwiper.slideTo(Math.max(0, $(this).index() - 1));

    $('html, body')
      .stop(true, false)
      .animate(
        {
          scrollTop: $target.offset().top - headerHeight - anchorHeight // (header height + anchor nav height)
        },
        400,
        function () {
          isScrolling = false;
          // 스크롤 완료 후 포커스 이동 (접근성)
          // $target.attr("tabindex", 0).focus();
        }
      );
  });

  // 앵커 메뉴 클릭 키보드 지원 이벤트
  $anchorLink.on('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      $(this).click();
    }
  });

  // 앵커 스크롤 기능 함수
  function anchorScrollFn() {

    // ----- 맨마지막 스크롤 특수 처리 -----
    // 페이지 스크롤 하단 도달 체크
    const isPageBottom = scrollTop + windowHeight >= documentHeight;

    // 페이지 하단 도달시 마지막 메뉴 활성화
    if (isPageBottom) {
      // 앵커 메뉴 활성화 처리
      anchorLinkActiveFn($anchorLink.last());
      anchorSwiper && anchorSwiper.slideTo($anchorLink.length);
      return;
    }


    // ----- 일반적인 스크롤 처리 -----
    let anchorConCurrentId = '';

    $('.anchor-cons .anchor-con').each(function () {
      const $anchorCon = $(this);
      const anchorTop = $anchorCon.offset().top - headerHeight - anchorHeight; // header height + anchor nav height)
      const anchorBottom = anchorTop + $anchorCon.outerHeight();

      if (scrollTop >= anchorTop && scrollTop < anchorBottom) {
        anchorConCurrentId = $anchorCon.attr('id');
        return false;
      }
    });

    // 현재 섹션에 해당하는 네비게이션 활성화
    if (anchorConCurrentId) {
      const $anchorLinkActive = $anchorLink.filter(`[href="#${anchorConCurrentId}"]`);
      if ($anchorLinkActive.length && !$anchorLinkActive.hasClass('active')) {
        // 앵커 메뉴 활성화 처리
        anchorLinkActiveFn($anchorLinkActive);
        anchorSwiper && anchorSwiper.slideTo(Math.max(0, $anchorLinkActive.index() - 1));
      }
    }
  }

  // 앵커 초기 셋팅
  anchorScrollFn();
  if ($('.anchor-swiper').length > 0) {
    anchorMenuFixFn();
  }

  // 앵커 메뉴 활성화 함수
  function anchorLinkActiveFn($anchorLinkActive) {
    $anchorLink.removeClass('active').attr('aria-selected', 'false');
    $anchorLinkActive.addClass('active').attr('aria-selected', 'true');
  }
}


// 바 그래프 비교 js
function compareGraphFn() {
  $(".compare-graph").each(function (i) {
    var $graph = $(this);
    var values = [];

    $graph.find(".compare").each(function () {
      var val = parseFloat($(this).data("value"));
      if (!isNaN(val)) {
        values.push(val);
      }
    });

    if (values.length === 0) return;

    var maxVal = Math.max.apply(null, values);
    var sumVal = values.reduce((a, b) => a + b, 0);
    var avgVal = sumVal / values.length;
    var totalWidth = Math.abs($graph.find(".compare-wrap").width() - $graph.find(".month").width());

    // -- 2025-10-15 차트모션으로 인한 스크립트 수정 start --
    var avgPercent = parseInt((avgVal / maxVal) * 100);
    var avgPosition = (totalWidth * (avgPercent / 100)) + $(".compare-graph .compare-wrap .month").innerWidth() + 4 // 4 = 해당 섹션 좌측 여백값

    $($('.compare-graph').find(".average-line")).attr('data-calvalue', JSON.stringify({ type: 'left', value: `${avgPosition}px` }));
    // -- 2025-10-15 차트모션으로 인한 스크립트 수정 end --

    $graph.find(".compare").each(function (k) {
      var val = parseFloat($(this).data("value"));
      var thisText = $(this).siblings().text();
      $(this).find('span').text(val.toLocaleString('ko-KR'));

      if (!isNaN(val)) {
        var percent = parseInt((val / maxVal) * 100);
        var barWidth = totalWidth * (percent / 100);

        // -- 2025-10-13 차트모션으로 인한 스크립트 수정 start --
        // gsap.to($(this).siblings(".data-graph"), 0.5, { width: barWidth, ease: Power3.easeOut });
        // gsap.to($(this).parents(".compare-graph").find(".average-line"), 0.5, { left: avgPosition, ease: Power3.easeOut });
        $($(this).siblings(".data-graph")).attr('data-calvalue', JSON.stringify({ type: 'width', value: `${barWidth}px` }));
        // -- 2025-10-13 차트모션으로 인한 스크립트 수정 end --

        if ($(this).parents(".compare-graph").hasClass("transport")) {
          $(this)
            .siblings()
            .attr('aria-label', thisText + '의 대중교통 이용 요금 그래프');
        } else if ($(this).parents(".compare-graph").hasClass("walk")) {
          $(this)
            .siblings()
            .attr('aria-label', thisText + '의 누적 걸음 수 그래프');
        } else if ($(this).parents(".compare-graph").hasClass("drive")) {
          $(this)
            .siblings()
            .attr('aria-label', thisText + '의 운전점수 그래프');
        } else if ($(this).parents(".compare-graph").hasClass("oil-fare")) {
          $(this)
            .siblings()
            .attr('aria-label', thisText + '의 주유비 절약 요금 그래프');
        }
      }
    });
  });
}


// 숫자 롤링 js
function RollingNumInit(selector, type = 'slide') {
  const speed = 100;
  const delay = 250;

  selector.forEach((el, index) => {
    // span 안의 텍스트를 그대로 읽어옴
    let number = el.textContent.trim();
    el.dataset.counter = number;
    el.setAttribute('aria-label', number);
    // 숫자 포맷 (콤마)
    const numArr = number.replace(/B(?<!.d*)(?=(d{3})+(?!d))/g, ",").split('');
    el.innerHTML = ''; // 기존 텍스트 삭제

    numArr.forEach((item, i) => {
      const classId = item === ',' ? `num-idx-${index}-${i}-point` : `num-idx-${index}-${i}-${item}`;
      const text = item;
      const slideStyle = type === 'slide' ? 'transition: width .3s, margin .3s' : '';
      el.innerHTML += `<span class="num-motion ${classId}" data-text="${text}" aria-hidden="true">
                <span class="num-list" style="${slideStyle}">0 1 2 3 4 5 6 7 8 9 ,</span>
            </span>`;
      setTimeout(() => {
        numAnimate(`.${classId}`);
      }, delay * i);
    });

    function numAnimate(unit) {
      const el = document.querySelector(unit)
      const numList = el.querySelector('.num-list')
      const dataText = el.getAttribute('data-text')
      const pos = dataText == ',' ? 10 : dataText
      let n = 0;
      let position = 0;
      let commaWidth = 0;
      let numWidth = 0;

      if (el.closest(".insurance-info-wrap")) { // 보험 내 숫자
        position = 24;
        commaWidth = '5px';
        numWidth = '10px'
      } else if (el.closest(".care-card") || el.closest(".point-wrap")) { // 일상케어 카드 내 숫자, 포인트
        position = 36;
        commaWidth = '8px'
        numWidth = '18px'
      }

      const numInterval = setInterval(() => {
        numList.style.marginTop = `-${n * position}px`
        if (n >= 10) {
          clearInterval(numInterval)
          numList.style.marginTop = `-${pos * position}px`

          if (dataText == 1) {
            el.style.width = numWidth
            numList.style.width = numWidth
          } else if (dataText == ",") {
            el.style.width = commaWidth
            numList.style.width = commaWidth
          }
        }
        n++
      }, speed)
    }
  });
}

// 이런식으로 사용
let rollNums = item.querySelectorAll(".roll-num");
rollNums.forEach(el => {
  el.style.opacity = "1";
})
RollingNumInit(rollNums, 'slide')

// 마크업
<p class="num fs-18 f-bold">
  <span class="value roll-num">15</span><span>일 남음</span>
</p>


// 휠 피커 html
<div class="wheels-container">
  <div class="selection-line" aria-hidden="true"></div>
  <!-- 
    디폴트 값이 오늘 날짜 기준 연도, 월이면 : data-default값 X (오늘 날짜 기준 연도, 월 넣어도 가능)
    ex. data-default 작성 X && data-default="2025" data-default="10"
    디폴트 값이 선택된 값이면 : data-default="선택연도" data-default="선택월"
    ex. data-default="2023" data-default="4"
    휠할 때마다 .wheel[data-type="year"], '.wheel[data-type="month"]의 data값에 저장되는 중
    (document.querySelector('.wheel[data-type="year"]').getSelectedValue()로 확인 가능)
  -->
    <!-- 연도 -->
    <div class="wheel" data-default="2025" data-type="year" role="listbox"
        aria-label="연도 선택" tabindex="0">
        <div class="wheel-list" role="option">
            <!-- 스크립트로 계산해서 넣어주는 중 -->
            <!-- <div class="wheel-item" data-value="2018">2018년</div>
            <div class="wheel-item" data-value="2019">2019년</div>
            <div class="wheel-item" data-value="2020">2020년</div>
            <div class="wheel-item" data-value="2021">2021년</div>
            <div class="wheel-item" data-value="2022">2022년</div>
            <div class="wheel-item" data-value="2023">2023년</div>
            <div class="wheel-item" data-value="2024">2024년</div>
            <div class="wheel-item" data-value="2025">2025년</div> -->
        </div>
    </div>

    <!-- 월 -->
    <div class="wheel" data-default="10" data-type="month" role="listbox"
        aria-label="월 선택" tabindex="0">
        <div class="wheel-list" role="option">
            <!-- 스크립트로 계산해서 넣어주는 중 -->
            <!-- <div class="wheel-item" data-value="1">1월</div>
            <div class="wheel-item" data-value="2">2월</div>
            <div class="wheel-item" data-value="3">3월</div>
            <div class="wheel-item" data-value="4">4월</div>
            <div class="wheel-item" data-value="5">5월</div>
            <div class="wheel-item" data-value="6">6월</div>
            <div class="wheel-item" data-value="7">7월</div>
            <div class="wheel-item" data-value="8">8월</div>
            <div class="wheel-item" data-value="9">9월</div>
            <div class="wheel-item" data-value="10">10월</div>
            <div class="wheel-item" data-value="11">11월</div>
            <div class="wheel-item" data-value="12">12월</div> -->
        </div>
    </div>
</div>

// 휠 피커 scss
.wheels-container {
  overflow: hidden;
  @include flex(flex, row, center, center);
  gap: 16px;
  position: relative;
  margin: 20px 0;

  .selection-line {
    @include position(left, 50%, 50%);
    width: 100%;
    height: 34px;
    background: $grayColor8;
    border-radius: 8px;
    pointer-events: none; // 추가
  }

  .wheel {
    min-width: 90px;
    height: 200px;
    position: relative;
    perspective: 1000px;
    border-radius: 8px;
    overflow: hidden; // 추가

    .wheel-list {
      @include position(left, 0, 0);
      right: 0;
      transition: transform 0.3s ease;
      transform-style: preserve-3d;
      cursor: grab;
      width: 100%; // 추가

      &:active {
        cursor: grabbing;
      }

      .wheel-item {
        @include flex(flex, row, center, center);
        height: 34px;
        font-size: 22px;
        color: #A7A7A7;
        user-select: none;
        transform-origin: center;
        transition: opacity 0.2s; // 추가

        &.active {
          color: $black;
          font-size: 24px;
        }

        // 패딩 아이템 스타일 추가
        &.wheel-padding {
          opacity: 0;
          pointer-events: none;
        }
      }
    }
  }
}

// 휠 피커 js
function wheelPickerFn() {
  // 현재 날짜 기준 데이터 생성
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  // 연도 데이터 생성 (현재년도 기준 -3년 ~ 현재년도)
  function generateYearData() {
    const setPeriod = 3; // @ 조회기간 설정하는 곳입니다.
    const years = [];
    for (let i = setPeriod; i >= 0; i--) {
      const year = currentYear - i;
      years.push(`<div class="wheel-item" data-value="${year}">${year}년</div>`);
    }
    return years.join('');
  }

  // 월 데이터 생성 (선택된 연도에 따라)
  function generateMonthData(selectedYear) {
    const months = [];
    const threeYearsAgo = currentYear - 3;

    let startMonth = 1;
    let endMonth = 12;

    // 3년 전 년도: 현재 월부터 12월까지
    if (selectedYear == threeYearsAgo) {
      startMonth = currentMonth;
      endMonth = 12;
    }
    // 현재 년도: 1월부터 현재 월까지
    else if (selectedYear == currentYear) {
      startMonth = 1;
      endMonth = currentMonth;
    }
    // 중간 년도들: 1월~12월 전부
    else {
      startMonth = 1;
      endMonth = 12;
    }

    for (let i = startMonth; i <= endMonth; i++) {
      months.push(`<div class="wheel-item" data-value="${i}">${i}월</div>`);
    }
    return months.join('');
  }

  // 년도 휠의 data-default 값 확인 (없으면 현재 년도)
  const yearWheel = document.querySelector('.wheel[data-type="year"]');
  let defaultYear = yearWheel.getAttribute('data-default');

  // data-default가 없으면 오늘 날짜로 설정
  if (!defaultYear) {
    defaultYear = currentYear;
    yearWheel.setAttribute('data-default', currentYear);
  }
  const initialYear = parseInt(defaultYear);

  // 월 휠의 data-default 값 확인 (없으면 현재 월)
  const monthWheel = document.querySelector('.wheel[data-type="month"]');
  let defaultMonth = monthWheel.getAttribute('data-default');

  // data-default가 없으면 오늘 날짜로 설정
  if (!defaultMonth) {
    defaultMonth = currentMonth;
    monthWheel.setAttribute('data-default', currentMonth);
  }
  const initialMonth = parseInt(defaultMonth);

  // HTML에 데이터 삽입
  document.querySelector('.wheel[data-type="year"] .wheel-list').innerHTML = generateYearData();
  document.querySelector('.wheel[data-type="month"] .wheel-list').innerHTML = generateMonthData(initialYear);

  let selectedYear = initialYear; // 현재 선택된 년도 추적

  // 휠 피커 초기화
  document.querySelectorAll('.wheel').forEach(wheelElement => {
    const wheelList = wheelElement.querySelector('.wheel-list');
    const wheelType = wheelElement.getAttribute('data-type');

    // 패딩용 빈 아이템들 추가
    const paddingCount = 4;
    const dataItems = Array.from(wheelList.querySelectorAll('.wheel-item'));

    // 앞쪽에 빈 아이템 추가
    for (let i = 0; i < paddingCount; i++) {
      const padding = document.createElement('div');
      padding.className = 'wheel-item wheel-padding';
      wheelList.insertBefore(padding, wheelList.firstChild);
    }

    // 뒤쪽에 빈 아이템 추가
    for (let i = 0; i < paddingCount; i++) {
      const padding = document.createElement('div');
      padding.className = 'wheel-item wheel-padding';
      wheelList.appendChild(padding);
    }

    let items = wheelList.querySelectorAll('.wheel-item');
    let selectedIndex = paddingCount;
    let isDragging = false;
    let startY = 0;
    let startPos = 0;
    let currentPos = 0;

    const itemHeight = 34;
    const centerY = 100;

    // data-default 값으로 초기 위치 설정
    const defaultValue = wheelType === 'year' ? String(initialYear) : String(initialMonth);

    if (defaultValue) {
      dataItems.forEach((item, index) => {
        if (item.getAttribute('data-value') === defaultValue) {
          selectedIndex = index + paddingCount;
          item.classList.add('active');
        }
      });
    } else {
      dataItems[0].classList.add('active');
    }

    // 3D transform 적용
    function apply3DTransforms() {
      items.forEach((item, index) => {
        const itemY = index * itemHeight + currentPos;
        const itemCenter = itemY + itemHeight / 2;
        const centerOffset = itemCenter - centerY;

        const maxAngle = 65;
        const angle = (centerOffset / itemHeight) * 20;
        const clampedAngle = Math.max(-maxAngle, Math.min(maxAngle, angle));

        const radian = (clampedAngle * Math.PI) / 180;
        const translateZ = -Math.abs(Math.sin(radian)) * 25;

        const distanceFromCenter = Math.abs(centerOffset);
        let opacity = Math.max(0.7, 1 - distanceFromCenter / (itemHeight * 2.5));

        const isCenter = distanceFromCenter < itemHeight * 0.45;

        const compressionFactor = Math.cos(radian);
        const adjustedY = centerOffset * compressionFactor * 0.85;

        item.classList.remove('active');

        if (isCenter) {
          item.classList.add('active');
          opacity = 1;

          // 이전 선택값과 다르면 data-default 업데이트 및 알림
          const previousIndex = selectedIndex;
          selectedIndex = index;

          const newValue = item.getAttribute('data-value');

          if (newValue && previousIndex !== index) {
            // data-default 업데이트
            wheelElement.setAttribute('data-default', newValue);

            // 접근성 알림
            // announceToScreenReader(`${item.textContent} 선택됨`);
          }

          // 년도 휠이 변경되면 월 데이터 업데이트
          if (wheelType === 'year') {
            const newYear = item.getAttribute('data-value');
            if (newYear && newYear != selectedYear) {
              selectedYear = parseInt(newYear);
              updateMonthWheel(selectedYear);
            }
          }

          // -- 퍼블 선택된 값 콘솔 테스트용 -- //
          // updateSelectedDate();
          // -- 퍼블 선택된 값 콘솔 테스트용 -- //
        }

        const scale = isCenter ? 1.05 : Math.max(0.9, 1 - Math.abs(clampedAngle) / 150);

        item.style.transform = `rotateX(${clampedAngle}deg) translateY(${adjustedY - centerOffset}px) translateZ(${translateZ}px) scale(${scale})`;
        item.style.opacity = opacity;
      });
    }

    // 휠 위치 업데이트
    function updateWheelPosition(animate = true) {
      const targetPosition = centerY - selectedIndex * itemHeight - itemHeight / 2;
      currentPos = targetPosition;

      if (animate) {
        wheelList.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      } else {
        wheelList.style.transition = 'none';
      }

      wheelList.style.transform = `translateY(${currentPos}px)`;
      apply3DTransforms();
    }

    // 드래그 이벤트
    wheelList.addEventListener('mousedown', (e) => {
      isDragging = true;
      wheelList.style.transition = 'none';
      startY = e.clientY;
      startPos = currentPos;
      e.preventDefault();
    });

    wheelList.addEventListener('touchstart', (e) => {
      isDragging = true;
      wheelList.style.transition = 'none';
      startY = e.touches[0].clientY;
      startPos = currentPos;
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaY = e.clientY - startY;
      currentPos = startPos + deltaY;
      wheelList.style.transform = `translateY(${currentPos}px)`;
      apply3DTransforms();
    });

    document.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const deltaY = e.touches[0].clientY - startY;
      currentPos = startPos + deltaY;
      wheelList.style.transform = `translateY(${currentPos}px)`;
      apply3DTransforms();
    });

    document.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      const relativePos = currentPos + itemHeight / 2;
      const newSelected = Math.round((centerY - relativePos) / itemHeight);
      const maxIndex = items.length - paddingCount - 1;
      selectedIndex = Math.max(paddingCount, Math.min(maxIndex, newSelected));
      updateWheelPosition();
    });

    document.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      const relativePos = currentPos + itemHeight / 2;
      const newSelected = Math.round((centerY - relativePos) / itemHeight);
      const maxIndex = items.length - paddingCount - 1;
      selectedIndex = Math.max(paddingCount, Math.min(maxIndex, newSelected));
      updateWheelPosition();
    });

    // 휠 스크롤 이벤트
    wheelElement.addEventListener('wheel', (e) => {
      e.preventDefault();
      const direction = e.deltaY > 0 ? 1 : -1;
      const newSelected = selectedIndex + direction;
      const maxIndex = items.length - paddingCount - 1;

      if (newSelected >= paddingCount && newSelected <= maxIndex) {
        selectedIndex = newSelected;
        updateWheelPosition();
      }
    });

    // 선택된 값 저장
    wheelElement.getSelectedValue = function () {
      const selectedItem = items[selectedIndex];
      if (selectedItem && !selectedItem.classList.contains('wheel-padding')) {
        return selectedItem.getAttribute('data-value') || selectedItem.textContent.trim();
      }
      return '';
    };

    // items 업데이트 함수 (월 휠 재생성용)
    wheelElement.updateItems = function () {
      items = wheelList.querySelectorAll('.wheel-item');
    };

    wheelElement.resetPosition = function (defaultVal) {
      const dataItems = Array.from(wheelList.querySelectorAll('.wheel-item:not(.wheel-padding)'));
      dataItems.forEach((item, index) => {
        if (item.getAttribute('data-value') === String(defaultVal)) {
          selectedIndex = index + paddingCount;
        }
      });
      updateWheelPosition(false);
    };

    // 초기 위치 설정
    updateWheelPosition(false);
  });

  // 월 휠 업데이트 함수
  function updateMonthWheel(year) {
    const monthWheel = document.querySelector('.wheel[data-type="month"]');
    const monthWheelList = monthWheel.querySelector('.wheel-list');

    // 현재 선택된 월 값 저장
    const currentSelectedMonth = parseInt(monthWheel.getSelectedValue()) || currentMonth;

    // 기존 데이터 아이템만 제거 (패딩 제외)
    monthWheelList.querySelectorAll('.wheel-item:not(.wheel-padding)').forEach(item => item.remove());

    // 새 월 데이터 생성
    const threeYearsAgo = currentYear - 3;

    let startMonth = 1;
    let endMonth = 12;

    // 3년 전 년도: 현재 월부터 12월까지
    if (year == threeYearsAgo) {
      startMonth = currentMonth;
      endMonth = 12;
    }
    // 현재 년도: 1월부터 현재 월까지
    else if (year == currentYear) {
      startMonth = 1;
      endMonth = currentMonth;
    }
    // 중간 년도들: 1월~12월 전부
    else {
      startMonth = 1;
      endMonth = 12;
    }

    const monthHTML = [];
    for (let i = startMonth; i <= endMonth; i++) {
      monthHTML.push(`<div class="wheel-item" data-value="${i}">${i}월</div>`);
    }

    // 패딩 아이템 뒤에 삽입
    const firstPadding = monthWheelList.querySelectorAll('.wheel-padding')[3]; // 4번째 패딩 뒤
    firstPadding.insertAdjacentHTML('afterend', monthHTML.join(''));

    // items 업데이트
    monthWheel.updateItems();

    // 선택된 월 유지 또는 범위 내로 조정
    let targetMonth = currentSelectedMonth;

    // 선택된 월이 새 범위를 벗어나면 조정
    if (targetMonth < startMonth) {
      targetMonth = startMonth; // 범위보다 작으면 첫 월
    } else if (targetMonth > endMonth) {
      targetMonth = endMonth; // 범위보다 크면 마지막 월
    }

    // data-default 업데이트
    monthWheel.setAttribute('data-default', targetMonth);

    monthWheel.resetPosition(targetMonth);
  }

  // -- 퍼블 선택된 값 콘솔 테스트용 -- //
  // (휠해서 선택된 값들은 data에 저장되어있습니다.)
  // 선택된 날짜 업데이트
  // function updateSelectedDate() {
  //     const yearWheel = document.querySelector('.wheel[data-type="year"]');
  //     const monthWheel = document.querySelector('.wheel[data-type="month"]');

  //     if (yearWheel.getSelectedValue && monthWheel.getSelectedValue) {
  //         const year = yearWheel.getSelectedValue();
  //         const month = monthWheel.getSelectedValue();
  //         console.log('선택된 날짜:', year + '년 ' + month + '월');
  //     }
  // }

  // updateSelectedDate();
  // -- 퍼블 선택된 값 콘솔 테스트용 -- //
}


------------------------------------------ scss ------------------------------------------

// scss 폴더 구조
scss
ㄴ abstracts
  ㄴ _function, _mixins, _variables
ㄴ base
  ㄴ _reset, _typography
ㄴ components
  ㄴ _accordian, _button, _form, _list 등,,
ㄴ layout (틀)
ㄴ pages (one depth 느낌)
ㄴ 폴더들 형제로 common.scss


// function.scss
$px: 0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 30, 32, 36, 40, 48, 56, 60, 70, 80;

@each $i in $px {
  .mgt-#{$i} {
    margin-top: #{$i}+"px" !important;
  }

  .mgb-#{$i} {
    margin-bottom: #{$i}+"px" !important;
  }

  .mgl-#{$i} {
    margin-left: #{$i}+"px" !important;
  }

  .pdt-#{$i} {
    padding-top: #{$i}+"px" !important;
  }

  .pdb-#{$i} {
    padding-bottom: #{$i}+"px" !important;
  }
}

.mg-0 {
  margin: 0 !important;
}

.pd-0 {
  padding: 0 !important;
}


// mixin.scss
@mixin transition($properties, $duration: 0.15s, $easing: ease) {
  $transitions: (
); // 빈 리스트 초기화

@each $property in $properties {
  $transitions: append($transitions, #{$property} #{$duration} #{$easing}, comma);
}

transition: $transitions; // 누적된 값을 출력

@mixin scrollbar($width: 4px, $height: 4px, $trackBg: $grayColor9, $thumbBg: $grayColor7, $radius: 2px) {
  &::-webkit-scrollbar {
    width: $width;
    height: $height;
  }

  &::-webkit-scrollbar-track {
    background-color: $trackBg;
  }

  &::-webkit-scrollbar-thumb {
    background-color: $thumbBg;
    border-radius: $radius;
  }
}

@mixin font($size: 16px, $name, $spacing: 0, $height: 160%) {
  font-family: #{$name};

  font: {
    size: $size;
  }

  line-height: $height;
  letter-spacing: $spacing;
}

@mixin txtAccessibility($display: block) {
  display: $display;
  white-space: nowrap;
  overflow: hidden;
  text-indent: -999px;
}

@mixin grid($col: 3, $colgap: 20px, $rowgap: 20px) {
  display: grid;
  grid-template-columns: repeat($col, minmax(auto, 1fr));
  column-gap: $colgap;
  row-gap: $rowgap;
}

@mixin flex($display: flex, $direction: row, $justify: center, $align: center) {
  display: $display;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}

@mixin position($side: left, $x: 0, $y: 0) {
  position: absolute;
  top: $y;
  #{$side}: $x; // 이렇게 하면 더 간결!

  @if $x ==50% and $y ==50% {
    transform: translate(-50%, -50%);
  }

  @else if $x ==50% {
    transform: translateX(-50%);
  }

  @else if $y ==50% {
    transform: translateY(-50%);
  }
}

@mixin ellipsis() {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@mixin ellipsisMulti($line: 2) {
  display: -webkit-box;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: $line;
}

@mixin before($width, $height) {
  content: "";
  display: block;
  width: $width;
  height: $height;
}

@mixin border($color, $top: null, $right: null, $bottom: null, $left: null) {

  // 모든 방향이 null이면 전체 테두리 적용
  @if $top ==null and$right ==null and $bottom ==null and $left ==null {
    border: 1px solid $color;
  }

  @else {

    // 개별 방향 설정
    @if $top !=null {
      border-top: $top solid $color;
    }

    @if $right !=null {
      border-right: $right solid $color;
    }

    @if $bottom !=null {
      border-bottom: $bottom solid $color;
    }

    @if $left !=null {
      border-left: $left solid $color;
    }
  }
}

@mixin divideTxt($width: 1px, $height: 12px, $gap: 12px, $color: gray) {
  display: inline-flex;
  flex-wrap: wrap;
  column-gap: $gap;

  >* {
    position: relative;

    &::before {
      content: "";
      position: absolute;
      top: 50%;
      right: calc(-1 * (#{$gap} / 2));
      transform: translate(50%, -50%);
      width: $width;
      height: $height;
      background-color: $color;

      @if $width ==$height {
          border-radius: 50%;
      }
    }

    &:last-child {
      &::before {
          display: none;
      }
    }
  }

  &:not(:has(> :nth-child(2))) {
    *::before {
      display: none;
    }
  }
}

// 고정영역 흰색 그라데이션 css
@mixin popFooterBg($el: 'before', $pos: top, $width: 100%) {
  &::#{$el} {
    content: "";
    // z-index: 1;
    width: $width;
    height: 16px;
    background: linear-gradient(if($pos ==top, 180deg, 0deg), rgba(255, 255, 255, 0.00) 0%, #FFF 100%);
    position: absolute;
    left: 0;
    #{$pos}: -16px;
  }
}


// 스켈레톤 scss
.skeletons {
  position: relative;
  width: 100%;

  .skeleton {
    position: relative;
    width: 100%;
    background-color: $grayColor8;
    overflow: hidden;

    &::after {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      transform: translateX(-100%);
      background: -webkit-gradient(linear, left top, right top, from(transparent), color-stop(rgba(255, 255, 255, .3)), to(transparent));
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, .3), transparent);
      /* Adding animation */
      animation: shimmer 2s infinite;
    }

    @keyframes shimmer {
      0% {
        transform: translateX(-100%);
      }

      60% {
        transform: translateX(-100%);
      }

      100% {
        transform: translateX(100%);
      }
    }
  }

  // 타이틀 형태 스켈레톤
  &.tit-wrap {
    padding: 0 4px;
    margin-bottom: 20px;

    .skeleton {
      &.tit {
        max-width: 180px;
        height: 28px;
      }

      &.txt {
        height: 28px;
      }
    }
  }

  // 탭 형태 스켈레톤
  &.tab-wrap {
    display: flex;
    flex-wrap: nowrap;
    gap: 4px;
    padding: 0;
    margin-bottom: 16px;

    .skeleton {
      width: 100px;
      height: 32px;
      border-radius: 20px;
    }
  }

  // 메뉴 형태 스켈레톤
  &.menu {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .skeleton {
      max-width: 80px;
      height: 28px;
    }
  }

  // 박스 형태 스켈레톤
  &.item-box {
    &~.item-box {
      margin-top: 24px;
    }

    .skeleton {
      border-radius: $radiusMedium;
    }

    &.type01 {
      .skeleton {
        height: 60px;
      }
    }

    &.type02 {
      .skeleton {
        height: 100px;
      }
    }

    &.type03 {
      .skeleton {
        height: 140px;
      }
    }

    &.type04 {
      .skeleton {
        height: 200px;
      }
    }

    &.type05 {
      .skeleton {
        height: 350px;
      }
    }
  }

  // 텍스트 형태 스켈레톤
  &.item-txt {
    position: relative;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 4px;

    &:first-child {
      padding-top: 0;
    }

    &:last-child {
      padding-bottom: 0;
    }

    &~.item-txt::before {
      content: "";
      width: calc(100% - 80px);
      height: 1px;
      background-color: $grayColor8;
      @include position(right, 0, 0);
    }

    .skeleton {
      &.icon {
        width: 64px;
        height: 64px;
        border-radius: 24px;
      }
    }

    .txts {
      flex: 1;

      .skeleton {
        &.tit {
          max-width: 180px;
          height: 20px;
        }

        &.txt {
          max-width: 110px;
          height: 16px;
          margin-top: 6px;
        }
      }
    }
  }

  // 푸터 형태 스켈로톤
  &.foot {
    margin-top: 60px;

    .skeleton {
      position: relative;
      width: 100vw;
      left: -20px;
      height: 450px;
    }
  }
}







// setting.json
{
    "editor.wordWrap": "on",
    "editor.tabSize": 2,
    "terminal.integrated.defaultProfile.windows": "Git Bash",
    "liveSassCompile.settings.generateMap": true,
    "liveSassCompile.settings.formats": [
        {
            "format": "compressed", // expanded, compact, compressed, nested
            "extensionName": ".css",
            "savePath": "~/../css",
            // "savePath": "~/../css_2025",
            "savePathReplacementPairs": null
        },
        {
            "format": "compressed", // expanded, compact, compressed, nested
            "extensionName": ".min.css",
            "savePath": "~/../css",
            // "savePath": "~/../css_2025",
            "savePathReplacementPairs": null
        }
    ],
    "liveSassCompile.settings.includeItems": [
        "/mobile/service/common/scss/*.scss",
        "/server/public/resources/scss/*.scss",
        "/server/public/m/resources/scss/*.scss",
        // "/mobile/product/v2mydirect/scss_2025/*.scss"
    ],
    "workbench.iconTheme": "material-icon-theme",
    "workbench.settings.applyToAllProfiles": [],
    "explorer.compactFolders": false
}
