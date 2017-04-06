function shadeColor(color, percent) {
  var f = parseInt(color.slice(1), 16),
    t = percent < 0 ? 0 : 255,
    p = percent < 0 ? percent * -1 : percent,
    R = f >> 16,
    G = f >> 8 & 0x00FF,
    B = f & 0x0000FF;
  return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
}

function blendColors(c0, c1, p) {
  var f = parseInt(c0.slice(1), 16),
    t = parseInt(c1.slice(1), 16),
    R1 = f >> 16,
    G1 = f >> 8 & 0x00FF,
    B1 = f & 0x0000FF,
    R2 = t >> 16,
    G2 = t >> 8 & 0x00FF,
    B2 = t & 0x0000FF;
  return "#" + (0x1000000 + (Math.round((R2 - R1) * p) + R1) * 0x10000 + (Math.round((G2 - G1) * p) + G1) * 0x100 + (Math.round((B2 - B1) * p) + B1)).toString(16).slice(1);
}

var effects = {
  init: function() {
    var backgroundImage = $('<img id="backgroundImage">');
    backgroundImage.css({
      filter: 'contrast(30%) brightness(200%)',
      zIndex: 1,
      display: 'none',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      filter: 'blur(60px)',
      '-webkit-filter': 'blur(60px)',
      transition: '0.2s',
      '-moz-transition': 'filter 0.2s',
      '-webkit-transition': 'filter 0.2s'
    });

    $('body').append(backgroundImage);
  },

  bg: function(el) {

  },

  cursorImage: function(el) {
    el.css({cursor: `url(${el.data('params')}), auto`});
  },

  backgroundHighlight(el) {
    el.css({position: 'relative', zIndex: 0})
    $('#backgroundImage').attr('src', el.data('params'));
    el.on('mouseenter', function() {
      $(this).css('z-index', 2);
      $(this).css('text-shadow', '2px 2px 4px rgba(0,0,0,0.4)');
      $('#backgroundImage').fadeIn();
    });
    el.on('mouseleave', function() {
      $(this).css('z-index', 0);
      $(this).css('text-shadow', 'none');
      $('#backgroundImage').fadeOut();
    });
  }
}

effects.init();

$('.annotate').each(function(el) {
  effects[$(this).data('effect')]($(this));
});
