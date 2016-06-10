// Clocks

$(function() {

  setInterval( function() {
    var seconds = new Date().getSeconds();
    var sdegree = seconds * 6;
    var srotate = "rotate(" + sdegree + "deg)";

    $("#sec").css({ "transform": srotate });

  }, 1000 );

  setInterval( function() {
    var hours = new Date().getHours();
    var mins = new Date().getMinutes();
    var hdegree = hours * 30 + (mins / 2);
    var hrotate = "rotate(" + hdegree + "deg)";

    $("#hour").css({ "transform": hrotate});

  }, 1000 );

  setInterval( function() {
    var mins = new Date().getMinutes();
    var mdegree = mins * 6;
    var mrotate = "rotate(" + mdegree + "deg)";

    $("#min").css({ "transform" : mrotate });

  }, 1000 );

});

Pace.on('done', function() {
  $('#clock').addClass('slide');
  setInterval(function(){
    $('#clock').css('opacity',1);
  },1000);
});


// DotDotDot, Zoom, Slider

$(document).ready(function() {
//  $('.news .card-block').equalize();
  $(".card-title, .card-text").dotdotdot({
    watch: 'window',
    height: '50px'
  });
  $('input').iCheck({
    checkboxClass: 'icheckbox_square',
    radioClass: 'iradio_square',
    increaseArea: '20%' // optional
  });
  $('.slider-preview').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: false,
    arrows: false,
    dots: false,
    fade: true,
    asNavFor: '.slider-thumb'
  });
  $('.slider-thumb').slick({
    centerMode: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: '.slider-preview',
    dots: false,
    focusOnSelect: true
  });
  $('.easyzoom').easyZoom();
});

$(window).load(function() {
  var footerHeight = 0;
  var footerTop = 0;
  var $footer = $(".footer");
  positionFooter();
  function positionFooter() {
    footerHeight = $footer.height();
    footerTop = ($(window).scrollTop() + $(window).height() - footerHeight) + "px";

    if (($(document.body).height() + footerHeight) < $(window).height()) {
      $footer.css({
          position: "absolute",
          top: footerTop
      })
    } else {
      $footer.css({
          position: "relative"
      });
    }
  }
  $(window)
    .scroll(positionFooter)
    .resize(positionFooter);
});
