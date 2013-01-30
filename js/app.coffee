---
---

class Frame
  constructor: (options) ->
    w = options.viewWidth     # width to be render in the view
    h = options.viewHeight
    width = options.width     # full width of the viewport (before scaling)
    margin = options.margin
    url = options.url
    leftOffset = options.leftOffset

    scale = 1
    scale = w / width if width > w

    actual = width * scale
    left = parseInt(leftOffset + (w - width) / 2)

    height = parseInt(h / scale - margin)
    top = parseInt((h - height - margin) / 2)

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
<div class="controls"><div class="inner">
  <button class='open'>open</button>
  <button class='zoom'>zoom</button>
  <span class='caption'>#{width} px (#{parseInt(scale * 100)}%)</span>
</div></div>
    """)
    $frame.appendTo options.container

    $controls.css
      left: leftOffset
      width: w

    $('.open', $controls).on 'click', ((w,h) ->
      -> window.open(url, '', "width=#{w},height=#{h}"))(width, height)

    # $('.zoom', $controls).on 'click', ->
    #   $frame.toggleClass 'zoomed'
    #   $controls.toggleClass 'zoomed'
    #   $(body).toggleClass 'zoomed'

    $controls.appendTo options.container

$ ->
  $frames = $('#frames')
  $widths = $('#widths')

  $('#reload').on 'click', ->
    $frames.empty()
    total = 0
    margin = 10
    url = $('#url').val()

    widths = $widths.val().replace(/^[\s]+|[\s]+$/, '').split(/[^\d]+/)
    viewWidth = ($(window).width() - (margin * (widths.length + 1))) / widths.length
    viewHeight = $(window).height() - $frames.offset().top

    spent = margin
    for i in [0...widths.length]
      width = +widths[i]
      continue unless width > 0

      actualWidth = Math.min(viewWidth, width)
      new Frame
        container: $frames
        viewWidth: actualWidth
        viewHeight: viewHeight
        width: width
        leftOffset: spent
        margin: margin
        url: url

      spent += actualWidth + margin



