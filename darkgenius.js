const popover = $('<div class="popover"></div>');
const offset = {x:10, y:10};
const imgExts = ['.jpg', '.jpeg', '.png', '.gif'];
const vidExts = ['.mp4'];

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

    popover.css({
      display: 'none',
      position: 'fixed',
      'pointer-events': 'none'
    });
    $('body').append(popover);
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
  },

  textBackground: function(el) {
    el.css({
      color: el.data('color') || el.css('color'),
      backgroundImage: `url(${el.data('image')})`,
      backgroundSize: el.data('size') || 'contain',
      padding: '0 1em'
    });
  },

  orbit: function(el) {
    var height = el.height(),
        width = el.width(),
        imgHeight = el.data('imageHeight') || 20,
        imgWidth = el.data('imageWidth') || 20,
        bounds = 4,
        img = $(`<img src="${el.data('image')}">`),
        vel = {
          x: Math.random() - 0.5,
          y: Math.random() - 0.5
        },
        center = {
          x: width/2,
          y: height/2
        };
    el.css({
      position: 'relative'
    });
    img.css({
      position: 'absolute',
      top: 0,
      left: 0,
      width: imgWidth,
      height: imgHeight,
      zIndex: 1
    });
    el.append(img);
    setInterval(function() {
      var pos = img.position();
      var force = {
        x: -(pos.left - center.x)/1000,
        y: -(pos.top - center.y)/1000,
      }

      var xpos = vel.x >= 0;
      vel.x += force.x;
      vel.y += force.y;
      var xpos_ = vel.x >= 0;

      // bring to front/back
      if (xpos !== xpos_) {
        var z = img.css('zIndex');
        img.css('zIndex', z * -1);
      }

      if (pos.top < -bounds - imgHeight/2 || pos.top > height + bounds) {
        vel.y *= -1;
      }
      if (pos.left < -bounds || pos.left > width + bounds) {
        vel.x *= -1;
      }
      img.css({
        top: pos.top + vel.y,
        left: pos.left + vel.x
      });
    }, 20);
  },

  popover: function(el){
    el.on('mouseenter', function() {
      var src = el.data('media'),
          caption = el.data('caption'),
          maxWidth = el.data('max-width') || 400,
          maxHeight = el.data('max-height') || 400,
          mediaEl;
      if (imgExts.some(ext => src.endsWith(ext))) {
        mediaEl = $(`<img src="${src}" class="${cls ? cls : ''}">`);
      } else if (vidExts.some(ext => src.endsWith(ext))) {
        mediaEl = $(`
          <video class="${cls ? cls : ''}" autoplay loop>
            <source src="${src}">
          </video>`);
      }

      mediaEl.css({
        'max-width': maxWidth,
        'max-height': maxHeight,
        'display': 'block'
      });

      popover.html(mediaEl).show();
      if (caption) {
        var captionEl = $(`<p class="caption">${caption}</p>`);
        captionEl.css({
          background: '#000',
          color: '#fff',
          padding: '0.2em 0.4em',
          margin: 0
        });
        popover.append(captionEl);
      }

      var cls = el.data('class');
      offset.x = -popover.width()/2;
      clearTimeout(el.timer);
    }).on('mouseleave', function() {
      el.timer = setTimeout(function() {
        popover.hide();
      }, 10);
    });
  },

  inline: function(el) {
    var src = el.data('image'),
        cls = el.data('class'),
        color = el.css('color'),
        imgEl = $(`<img src="${src}" data-media="${src}" class="${cls ? cls : ''}">`);
    imgEl.css({
      height: el.data('height') || '1.2em',
      margin: el.data('margin') || '0 0.2em -0.2em',
      cursor: 'zoom-in'
    });
    el.append(imgEl);
    effects.popover(imgEl);

    imgEl.on('mouseenter', function() {
      el.css({
        color: el.data('color') || 'red'
      });
    }).on('mouseleave', function() {
      el.css({
        color: color
      });
    });
  },
}

effects.init();

$('.annotate').each(function(el) {
  effects[$(this).data('effect')]($(this));
});


document.addEventListener('mousemove', e => {
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  popover.css({
    left: (e.pageX + offset.x) + 'px',
    top: (e.pageY + offset.y - scrollTop) + 'px'
  });
});
