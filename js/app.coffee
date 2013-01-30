---
---

# A = {}

$ ->
  $frames = $('#frames')
  $widths = $('#widths')

  $('#reload').on 'click', ->
    $frames.empty()
    total = 0
    margin = 10
    url = $('#url').val()
    h = $(window).height() - $frames.offset().top

    widths = $widths.val().replace(/^\s+|\s+^/, '').split(/[^\d]+/)

    w = ($(window).width() - (margin * (widths.length + 1))) / widths.length


    spent = margin
    for i in [0...widths.length]
      width = +widths[i]
      scale = 1
      scale = w / width if width > w

      actual = width * scale
      left = parseInt(spent + (actual - width) / 2)

      height = h / scale
      top = parseInt((h - height - margin) / 2)

      # TODO measure the height and re-adjust the top
      $el = $("<iframe class='frame' src='#{url}'>#{width}</iframe>")
      $el.css
        width: width
        height: height
        "-webkit-transform": "scale(#{scale})"
        left: left
        top: top

      $el.appendTo $frames
      spent += actual + margin

