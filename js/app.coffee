---
---

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

      height = h / scale - margin
      top = parseInt((h - height - margin) / 2)

      # frame = new Frame(url: url, width: width, height: height: )

      # the controls provide a place to put stuff that can be positioned
      # with the frame but won't be subject to scaling.
      $frame = $("""<iframe class='frame' src='#{url}'>#{width}</iframe>""")

      $frame.css
        "-webkit-transform": "scale(#{scale})"
        left: left
        top: top
        width: width
        height: height

      $controls = $("""
<div class="controls">
  <span class='caption'>#{width} px</span>
</div>
      """)
      $frame.appendTo $frames

      $controls.css
        left: spent
        width: actual

      $controls.appendTo $frames

      spent += actual + margin


