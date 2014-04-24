'use strict';

(function($) {

  var topContainer = $('.reel-container');
  var botContainer = $('.secondary-container');
  var reelContainer = $('#reel');

  $(window).resize(windowResize);
  windowResize();
  reelContainer.load(windowResize);

  initFancybox();
  initVids();

  adjustThumbHeight();

  function initVids() {
    $.each($('.pvideo'), function(i, e) {

      $(e).find('.thumbnail').on('load', adjustThumbHeight);

      if ($(e).is('.youtube')) {
        initYoutubeVid(e);
      } else if ($(e).is('.vimeo')) {
        initVimeoVid(e);
      }
    });
  }

  function initYoutubeVid(e) {
    var vidId = $(e).data('id');
    var thumb = $(e).find('.thumbnail');
    var title = $(e).find('.title');
    //var url = '//www.youtube.com/oembed?url=http%3A//www.youtube.com/watch?v%3D' + vidId + '&format=json'
    var url = '//gdata.youtube.com/feeds/api/videos/' + vidId + '?v=2&alt=jsonc';
    $.getJSON(url, function(data) {
      var vInfo = data.data;
      $(e).data('height', vInfo.height);
      $(e).data('width', vInfo.width);
      if (!title.text()) {
        title.text(vInfo.title);
      }
    });
  }
  function initVimeoVid(e) {
    var vidId = $(e).data('id');
    var thumb = $(e).find('.thumbnail');
    var title = $(e).find('.title');
    var url = '//www.vimeo.com/api/v2/video/' + vidId + '.json?callback=?';
    $.getJSON(url, {
      format: "json"
    }, function(data) {
      var vInfo = data[0];
      $(e).data('height', vInfo.height);
      $(e).data('width', vInfo.width);
      thumb.attr('src', vInfo.thumbnail_large);
      if (!title.text()) {
        title.text(vInfo.title);
      }
    });
  }

  function initFancybox() {
    $('.ibox').fancybox({
      padding: 0,
      openEffect: 'elastic',
      openSpeed: 150,
      closeEffect: 'elastic',
      closeSpeed: 150,
      type: 'iframe',
      aspectRatio: true,
      beforeLoad: function() {
        this.height = $(this.element).data('height') || 480;
        this.width = $(this.element).data('width') || 640;
      }
    });

    $('.pbox').fancybox({
      padding: 0
    });
  }

  function windowResize() {
    reelResize();
    adjustContentMargin();
    adjustThumbHeight();
  }

  function reelResize() {
    var reelRes = reelContainer.data('height') / reelContainer.data('width');
    reelContainer.height(reelContainer.width() * reelRes);
  }

  function adjustThumbHeight() {
    var newThumbHeight = Math.max.apply(null, $(".thumbnail").map(function() {
      return $(this).innerHeight();
    }).get());
    $('.thumbnail-wrapper').height(newThumbHeight);
  }

  function adjustContentMargin() {
    var topHeight = topContainer.outerHeight(true);
    botContainer.css({
      "margin-top": topHeight
    });
    var topPos = ($(window).height() < topHeight) ? 'absolute' : 'fixed';
    topContainer.css({
      'position': topPos
    });
  }

})(jQuery);
