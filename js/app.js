(function() {
  var Frame, view;

  Frame = (function() {

    function Frame(options) {
      var $controls, $frame, actual, h, height, left, leftOffset, margin, scale, top, url, w, width;
      w = options.viewWidth;
      h = options.viewHeight;
      width = options.width;
      margin = options.margin;
      url = options.url;
      leftOffset = options.leftOffset;
      scale = 1;
      if (width > w) {
        scale = w / width;
      }
      actual = width * scale;
      left = parseInt(leftOffset + (w - width) / 2);
      height = parseInt(h / scale - margin);
      top = parseInt((h - height - margin) / 2);
      $frame = $("<iframe class='frame' src='" + url + "'>" + width + "</iframe>");
      $frame.css({
        "-webkit-transform": "scale(" + scale + ")",
        left: left,
        top: top,
        width: width,
        height: height
      });
      $controls = $("<div class=\"controls navbar\"><div class=\"inner navbar-inner\">\n  <button class='open btn' title=\"Open in a new window\"><i class=\"icon-fullscreen\"></i></button>\n  <button class='zoom btn'>zoom</button>\n  <h4 class='caption muted'>" + width + " px <span class=\"label label-info\">" + (parseInt(scale * 100)) + "%</span></h4>\n</div></div>");
      $frame.appendTo(options.container);
      $controls.css({
        left: leftOffset,
        width: w
      });
      $('.open', $controls).on('click', (function(w, h) {
        return function() {
          return window.open(url, '', "width=" + w + ",height=" + h);
        };
      })(width, height));
      $controls.appendTo(options.container);
    }

    return Frame;

  })();

  view = {
    render: function() {
      var that;
      this.$frames = $('#frames');
      this.$widths = $('#widths');
      that = this;
      return $('form').on('submit', function() {
        if ($('#url').val().length === 0 || $('#widths').val().length === 0) {
          return false;
        }
        $('#content').removeClass('intro');
        that.load();
        return false;
      });
    },
    load: function() {
      var actualWidth, i, margin, spent, total, url, viewHeight, viewWidth, width, widths, _i, _ref, _results;
      this.$frames.empty();
      total = 0;
      margin = 10;
      url = $('#url').val();
      widths = this.$widths.val().replace(/^[\s]+|[\s]+$/, '').split(/[^\d]+/);
      viewWidth = ($(window).width() - (margin * (widths.length + 1))) / widths.length;
      viewHeight = $(window).height() - this.$frames.offset().top;
      spent = margin;
      _results = [];
      for (i = _i = 0, _ref = widths.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        width = +widths[i];
        if (!(width > 0)) {
          continue;
        }
        actualWidth = Math.min(viewWidth, width);
        new Frame({
          container: this.$frames,
          viewWidth: actualWidth,
          viewHeight: viewHeight,
          width: width,
          leftOffset: spent,
          margin: margin,
          url: url
        });
        _results.push(spent += actualWidth + margin);
      }
      return _results;
    }
  };

  $(function() {
    return view.render();
  });

}).call(this);
