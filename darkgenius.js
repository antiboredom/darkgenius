const popover = $('<div class="popover"></div>');
const offset = {x:10, y:30};
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
      // filter: 'blur(60px)',
      // '-webkit-filter': 'blur(60px)',
      // transition: '0.2s',
      // '-moz-transition': 'filter 0.2s',
      // '-webkit-transition': 'filter 0.2s'
    });

    $('body').append(backgroundImage);

    popover.css({
      display: 'none',
      position: 'fixed',
      'pointer-events': 'none',
      zIndex: 100
    });
    $('body').append(popover);
  },

  bg: function(el) {

  },

  cursorImage: function(el) {
    el.css({
      cursor: `url(${el.data('params')}), auto`
    });
  },

  backgroundHighlight(el) {
    el.css({
      position: 'relative',
      zIndex: 0
    })
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
    var pos = {left: 0, top: 0};
    el.append(img);
    setInterval(function() {
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

      pos = img.position();
    }, 20);
  },

  wordVomit(el) {
    el.css({position: 'relative', textDecoration: 'underline'});

    var dist = el.data('dist') || 40,
        speed = el.data('speed') || 1,
        gray = el.data('gray'),
        c1 = el.data('c1') || '#ff0000',
        c2 = el.data('c2') || '#0000ff';

    var vom = [];
    var loop = setInterval(function() {
      vom
        .filter(l => {
          var pos = l.position();
          var keep = pos.top / dist < 1;
          if (!keep) {
            l.remove();
          }
          return keep;
        })
        .map(l => {
          var pos = l.position();
          l.css('top', `${pos.top + speed}px`);
          if (gray) {
            l.css('color',
              shadeColor('#000000', pos.top / dist));
          } else {
            l.css('color',
              blendColors(c1, c2, pos.top / dist));
          }
          return l;
        });
    }, 20);

    var word = el.text();

    var spawn_loop;
    el.on('mouseenter', function() {
      // var vom_el = makeVom(word);
      // vom.push(vom_el);
      // $(this).append(vom_el);
      spawn_loop = setInterval(() => {
        var vom_el = makeVom(word);
        vom.push(vom_el);
        $(this).append(vom_el);
      }, 20);
    });

    el.on('mouseleave', function() {
      clearInterval(spawn_loop);
    });

    function makeVom(word){
      var vom_el = $(`<span class="vom">${word}</span>`);
      vom_el.css({
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: -1
      });
      return vom_el;
    }
  },

  bgColor: function(el) {
    el.hover(function(e){
      $('body').css({backgroundColor: el.data('bg') || '#000', color: el.data('fg') || '#fff'});
    }, function(e){
      $('body').css({backgroundColor: '', color: ''});
    });
  },

  popover: function(el){
    el.on('mouseenter', function() {
      var src = el.data('media'),
          caption = el.data('caption'),
          maxWidth = el.data('max-width') || 400,
          maxHeight = el.data('max-height') || '40vh',
          boxShadow = el.data('box-shadow') != '0',
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
        'display': 'block',
      });

      if (boxShadow) {
        mediaEl.css('box-shadow', 'rgba(0, 0, 0, 0.2) 0 0 8px');
      }

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
      clearTimeout(popover.timer);
    }).on('mouseleave', function() {
      popover.timer = setTimeout(function() {
        popover.hide();
      }, 10);
    });
  },

  inline: function(el) {
    var src = el.data('image'),
        cls = el.data('class'),
        color = el.css('color'),
        imgEl = $(`<img src="${src}" class="${cls ? cls : ''}">`);
    imgEl.css({
      height: el.data('height') || '1.4em',
      margin: el.data('margin') || '0 0.2em',
      verticalAlign: 'middle',
      cursor: 'zoom-in',
      display: 'inline'
    });
    el.css({
      cursor: 'zoom-in',
      textDecoration: 'underline'
    });
    el.data('media', src);
    el.append(imgEl);
    effects.popover(el);

    el.on('mouseenter', function() {
      el.css({
        color: el.data('color') || 'red'
      });
    }).on('mouseleave', function() {
      el.css({
        color: color
      });
    });
  },

  text: function(el) {
    var name = el.data('name');
    el.addClass(`dg-${name}`);
  }
}

effects.init();

$('.annotate').each(function(el) {
  effects[$(this).data('effect')]($(this));
});


document.addEventListener('mousemove', e => {
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

  var top = e.clientY <= window.innerHeight/2,
      xOffset = -popover.width()/2,
      yOffset;
  if (top) {
    yOffset = e.pageY + offset.y - scrollTop;
  } else {
    yOffset = e.pageY - offset.y - scrollTop - popover.height();
  }

  if (e.clientX + popover.width()/2 > window.innerWidth) {
    xOffset -= e.clientX + popover.width()/2 - window.innerWidth;
  } else if (e.clientX - popover.width()/2 < 0) {
    xOffset += -e.clientX + popover.width()/2;
  }

  popover.css({
    left: (e.pageX + xOffset) + 'px',
    top: yOffset + 'px'
  });

});
