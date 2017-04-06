var effects = {
  bg: function(el){

  }
}

$('.annotate').each(function(el){
  effects[$(this).data('effect')]($(this));
});

