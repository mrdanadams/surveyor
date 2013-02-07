(function() {
  var Frame, galytics, hasher, view;

  hasher = this.hasher;

  galytics = this.galytics;

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
        "-moz-transform": "scale(" + scale + ")",
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
      $('.open', $controls).on('click', function() {
        window.open(url, '', "width=" + width + ",height=" + height);
        galytics.trackEvent("open", {
          label: url,
          value: width
        });
        return false;
      });
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
      $('form').on('submit', function() {
        if ($('#url').val().length === 0 || $('#widths').val().length === 0) {
          return false;
        }
        $('#content').removeClass('intro');
        that.load();
        return false;
      });
      hasher.changed.add(function(hash) {
        return that.loadHash(hash);
      });
      hasher.initialized.add(function(hash) {
        return that.loadHash(hash);
      });
      return hasher.init();
    },
    load: function() {
      var url, widths;
      url = $('#url').val();
      if (!url.match(/^http/)) {
        url = "http://" + url;
      }
      widths = this.$widths.val().replace(/^[\s]+|[\s]+$/, '').split(/[^\d]+/);
      return this.loadFrame(url, widths, false);
    },
    loadHash: function(hash) {
      var n, url, widths;
      if (hash.length === 0) {
        $("#content").addClass('intro');
        this.$frames.empty();
        return;
      }
      n = hash.indexOf('/');
      widths = hash.slice(0, n).split(/[^\d]+/);
      url = hash.slice(n + 1);
      $('#url').val(url);
      $('#widths').val(widths.join(' '));
      return this.loadFrame(url, widths, true);
    },
    loadFrame: function(url, widths, silent) {
      var actualWidth, domain, hash, i, margin, spent, total, viewHeight, viewWidth, width, _i, _ref;
      $('#content').removeClass('intro');
      this.$frames.empty();
      total = 0;
      margin = 10;
      viewWidth = ($(window).width() - (margin * (widths.length + 1))) / widths.length;
      viewHeight = $(window).height() - this.$frames.offset().top;
      spent = margin;
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
        spent += actualWidth + margin;
      }
      domain = url.replace(/^https?:\/\//, '').replace(/\/.*/, '');
      $('title').html("Surveyor - " + domain + " @ " + (widths.join(' ')));
      if (!silent) {
        hash = '' + widths.join(' ') + '/' + url;
        hasher.setHash(hash);
        galytics.trackEvent("load", {
          label: domain,
          value: widths.length
        });
        return galytics.trackEvent("load-url", {
          label: url
        });
      }
    }
  };

  $(function() {
    return view.render();
  });

}).call(this);
