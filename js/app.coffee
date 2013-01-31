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
      "-moz-transform": "scale(#{scale})"
      left: left
      top: top
      width: width
      height: height

    $controls = $("""
<div class="controls navbar"><div class="inner navbar-inner">
  <button class='open btn' title="Open in a new window"><i class="icon-fullscreen"></i></button>
  <button class='zoom btn'>zoom</button>
  <h4 class='caption muted'>#{width} px <span class="label label-info">#{parseInt(scale * 100)}%</span></h4>
</div></div>
    """)
    $frame.appendTo options.container

    $controls.css
      left: leftOffset
      width: w

    $('.open', $controls).on 'click', ->
      window.open(url, '', "width=#{width},height=#{height}")
      galytics.trackEvent "open", label:url, value:width
      false

    # $('.zoom', $controls).on 'click', ->
    #   $frame.toggleClass 'zoomed'
    #   $controls.toggleClass 'zoomed'
    #   $(body).toggleClass 'zoomed'

    $controls.appendTo options.container

view =
  render: ->
    @$frames = $('#frames')
    @$widths = $('#widths')

    that = this
    $('form').on 'submit', ->
      return false if $('#url').val().length == 0 || $('#widths').val().length == 0
      $('#content').removeClass('intro')
      that.load()
      false

  load: ->
    @$frames.empty()
    total = 0
    margin = 10
    url = $('#url').val()

    widths = @$widths.val().replace(/^[\s]+|[\s]+$/, '').split(/[^\d]+/)
    viewWidth = ($(window).width() - (margin * (widths.length + 1))) / widths.length
    viewHeight = $(window).height() - @$frames.offset().top

    galytics.trackEvent "load", label:url, value:widths.length

    spent = margin
    for i in [0...widths.length]
      width = +widths[i]
      continue unless width > 0

      actualWidth = Math.min(viewWidth, width)
      new Frame
        container: @$frames
        viewWidth: actualWidth
        viewHeight: viewHeight
        width: width
        leftOffset: spent
        margin: margin
        url: url

      spent += actualWidth + margin

$ -> view.render()