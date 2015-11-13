jQuery(window).load(function() {
    jQuery('.nivo-slider').nivoSlider({
        effect: 'fade', // Specify sets like: 'fold,fade,sliceDown'
        slices: 15, // For slice animations
        boxCols: 8, // For box animations
        boxRows: 4, // For box animations
        animSpeed: 350, // Slide transition speed
        pauseTime: 8000, // How long each slide will show
        startSlide: 0, // Set starting Slide (0 index)
        directionNav: true, // Next & Prev navigation
        controlNav: false, // 1,2,3... navigation
        controlNavThumbs: false, // Use thumbnails for Control Nav
        pauseOnHover: true, // Stop animation while hovering
        manualAdvance: true, // Force manual transitions
        randomStart: false, // Start on a random slide
        prevText: '<i class="icon-left-open-1"></i>', // Prev directionNav text
        nextText: '<i class="icon-right-open-1"></i>', // Next directionNav text
        beforeChange: function(){}, // Triggers before a slide transition
        afterChange: function(){}, // Triggers after a slide transition
        slideshowEnd: function(){}, // Triggers after all slides have been shown
        lastSlide: function(){}, // Triggers when last slide is shown
        afterLoad: function(){} // Triggers when slider has loaded
    });
});

function social_share(data) {
    window.open( data, "fbshare", "height=450,width=760,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0" );
}

jQuery(function($){

    // Facebook comment count fix
    if(blu.fb_comments){
        var posts = $('.comment_count'),
            i = 0,
            bl_posts = [];

        // create array of links to check
        $.each(posts, function(index, val){ 
            bl_posts.push(val.href.replace('#comments', ''));
        });
        // query fb for comment count
        $.getJSON("https://graph.facebook.com/?ids="+bl_posts.join(","), function(data){
             $.each( data, function(index, val) { 

                if(typeof val.comments !== 'undefined'){
                    switch(val.comments){
                        case 0:
                        val.comments = blu.locale.no_comments;
                        break;
                        case 1:
                        val.comments = '1 '+blu.locale.comment;
                        break;
                        default:
                        val.comments = val.comments+' '+blu.locale.comments;
                        break;
                    }
                    $(posts[i]).text(val.comments);
                    i++;    
                }
             });
        });
    }


 $('#searchform input[type="text"]').val(blu.locale.email_input);

    $('#searchform input[type="text"]').focus(function(){
        if($(this).val() == blu.locale.email_input){
            $(this).val('')
        }
    })
    $('#searchform input[type="text"]').blur(function(){
        if($(this).val() == ""){
            $(this).val(blu.locale.email_input)
        }
    });

    $('.navbar .nav > li.dropdown').bind('touchstart', function(e) {

        if(!$(this).hasClass('hover')){
            e.preventDefault();
            $(this).toggleClass('hover');
        }
    });

    $('time.timeago').timeago();
    $('.tips').tooltip();
    $('.bl_popover').popover({html: true});
    $('.lightbox').magnificPopup({type:'image'});

    $("pre.html").snippet("html",{style:"emacs"});
    $("pre.css").snippet("css",{style:"emacs"});
    $("pre.php").snippet("php",{style:"emacs"});
    $("pre.js").snippet("javascript",{style:"emacs"});

    
    // fix video aspect ratio
    var $allVideos = $(".entry-video iframe, .entry-video object, .related-video iframe, .related-video iframe"),

    $fluidEl = $("#content");
    $fluidElRelated = $('#related-posts > div').first();

    $allVideos.each(function() {
        var height = (this.height === '') ? 473 : this.height;
        var width = (this.width === '') ? 840 : this.width;

      $(this).attr('data-aspectRatio', height / width).removeAttr('height').removeAttr('width');
    });

    $(window).resize(function() {

      var newWidth = $fluidEl.width();
      var newRelatedWidth = $fluidElRelated.width();

      $allVideos.each(function() {

        var $el = $(this);
        if($el.parent().hasClass('related-header')){
            $el.width(newRelatedWidth).height(newRelatedWidth * $el.attr('data-aspectRatio'));
        }else{
            $el.width(newWidth).height(newWidth * $el.attr('data-aspectRatio'));
        }

      });

    }).resize();


    // Newsletter widget
    $('.bl_newsletter button').click(function() {
        $that = $(this);
        $that.addClass('disabled');
        var email = $that.prev().val();
        if(email == ''){
            $('body').prepend('<div class="bl_alert"><h4 style="text-align:center"><i class="icon-cancel-circle"></i>&nbsp;'+blu.locale.no_email_provided+'</h4></div>');
            $('.bl_alert').slideDown().delay(3000).slideUp();   
            $that.removeClass('disabled');
            return false;
        }
        $.post(blu.ajaxurl, {email: email,action: 'blu_ajax_mailchimp'}, function(output){
            output = $.trim(output);
            var obj = $.parseJSON(output);
            if(obj.error){
                $('body').prepend('<div class="bl_alert"><h4 style="text-align:center"><i class="icon-cancel-circle"></i>&nbsp;'+obj.error+'</h4></div>');
                $('.bl_alert').slideDown().delay(3000).slideUp();                       
            }else if(obj.status == 'ok'){
                $('body').prepend('<div class="bl_alert"><h4 style="text-align:center"><i class="icon-ok-circle"></i>&nbsp;'+blu.locale.thank_you_for_subscribing+'</h4></div>');
                $('.bl_alert').slideDown().delay(3000).slideUp();
            }
        });     
        $that.removeClass('disabled');
        $that.prev().val('');
        return false;
    });


});