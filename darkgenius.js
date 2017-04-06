const popover = $('<div class="popover"></div>');
const offset = {x:10, y:10};
const imgExts = ['.jpg', '.jpeg', '.png', '.gif'];
const vidExts = ['.mp4'];

popover.css({
  display: 'none',
  position: 'fixed',
  'pointer-events': 'none'
});
$('body').append(popover);

var effects = {
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
        imgEl = $(`<img src="${src}" data-image="${src}" class="${cls ? cls : ''}">`);
    imgEl.css({
      height: el.data('height') || '1.2em',
      margin: el.data('margin') || '0 0.2em -0.2em',
      cursor: 'zoom-in'
    });
    el.append(imgEl);
    effects.hover(imgEl);

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

  bg: function(el){

  }
}

$('.annotate').each(function(el){
  effects[$(this).data('effect')]($(this));
});


document.addEventListener('mousemove', e => {
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  popover.css({
    left: (e.pageX + offset.x) + 'px',
    top: (e.pageY + offset.y - scrollTop) + 'px'
  });
});
