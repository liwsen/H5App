// 简单配置
seajs.config({
  base: WEB_ROOT + "js/",
  paths: {
    'm': 'sea-modules'
  },
  alias: {
    "jquery": "static/jq/jquery-1.11.3.min",
    "swiper": "static/js/swiper.min",
    "swiper-css": "static/css/swiper.min.css"
  }
});
// 加载入口模块
seajs.use(['jquery', 'main', 'm/myswiper'], function($, main, myswiper) {
  window.TW4MAIN = main.init();

  myswiper.done(function() {
    //banner
    new Swiper('#banner', {
      pagination: '.bannerPaginatio',
      autoHeight: 'auto',
      autoplay: 5000,
    });
    //default_images_slide
    new Swiper('#default_images_slide', {
      pagination: '.defaultImagesSlidePagination',
      slidesPerView: 3,
      paginationClickable: true,
      spaceBetween: 10,
    });
  });

});
