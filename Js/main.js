(function(){
/*
// main.js
// This code is free to use or distribute.
// Copyright (C) 2018-2019 by Christian Schoepp
*/

// Polyfill the window objects
// 'requestAnimationFrame' and
// 'cancelAnimationFrame'

var animationFrameTimeout;
var requestAnimationFrame =
window.requestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.msRequestAnimationFrame ||
function( callback ){
    animationFrameTimeout =
    window.setTimeout(callback, 1000 / 60);
};
window.requestAnimationFrame = requestAnimationFrame;
var cancelAnimationFrame =
window.cancelAnimationFrame ||
window.mozCancelAnimationFrame ||
clearTimeout(animationFrameTimeout);
window.cancelAnimationFrame = cancelAnimationFrame;

var MAIN = (function() {
    // Main project module
    // provides helper methods
    // and project globals

    // Project globals
    var
    $body = $('body'),
    is_desktop,
    scrollPosition,
    windowHeight,
    windowWidth,
    init = function() {
        scrollPosition = $(document).scrollTop();
        windowHeight = $(window).height();
        windowWidth = $(window).width();
	is_desktop = ($(window).outerWidth()>768) ? true : false;
        $(window).scroll(scroller);
        $(window).resize(resizer);
    },
    // Helper methods
    info = function(a){
        console.log(a)
    },
    rand = function(a,b,c){
        a = ( ( Math.random() * (b-a) ) + a );
        a = c ? Math.floor(a) : a;
        return a
    },
    loop = function(num,callback){
        var n = num;
        for( var i = 0; i < n; i++ ){
            callback(i)
        }
    },
    scroller = function(){
        scrollPosition = $(document).scrollTop();
    },
    resizer = function(){
        windowHeight = $(window).height();
        is_desktop = ($(window).outerWidth()<=768) ? false : true;
    }

    init()

    // Export all
    return {
        info: info,
        rand: rand,
        loop: loop,
        $body: $body,
        scrollPosition: function(){return scrollPosition},
        windowHeight: function(){return windowHeight},
        windowWidth: function(){return windowWidth},
        is_desktop: function(){return is_desktop}
    }

})();//MAIN

var FEATURE01 = (function (m) {
    // Quick import all from MAIN
    for( g in m ){ this[g] = m[g] }

    var
    myY = 60,
    goY = 150,
    $text = $('.vdhtext'),
    $project = $('.project'),
    animId,
    offsets = [],
    heights = [],
    init = function(){
        setup();
       //  $(window).mousemove(moveText)
       $(window).scroll(scrollText)
    },
    setup = function(){
        offsets.length = 0;

        $text.each(function(){
            offsets.push(
                $(this).offset().top
            )
            heights.push(
                $(this).parent().height()
            )

        })
    },
    moveText = function(event){

       var
        fac = 1,
        y = event.clientY*fac,
        x = event.clientX*fac - 300;

        $text.attr('y',y);

    },
    scrollText = function(){

        $text.each(function(i){

        var
        quo = offsets[i],
        h = heights[i],
        fac = .19,
        y = h-(( quo  - scrollPosition() )* fac + h / 2.3);

       /*  info(
            'quo'+quo+
            'h'+h+
            'fac'+fac+
            'y'+y
        ) */
        $(this).attr('y',y)


        })


    }

    return{
        init: init
    }

})(MAIN)//FEATURE01

//FEATURE01.init();

var FEATURE02 = (function (m) {
    // Quick import all from MAIN
    for( g in m ){ this[g] = m[g] }

    var
    $svgs = $('.crop-shapes'),
    init = function(){
        setup();
       //  $(window).mousemove(moveText)
       $(window).resize(setup)
    },
    setup = function(){

        $svgs.each(function(){
            var
            h = $(this).height(),
            w = $(this).width();
            set($(this).find('pattern'));
            set($(this).find('rect'));
            set($(this).find('text'));
            function set(el){
                el.attr('width',w).attr('height',h);
            }

        })
    }

    return{
        init: init
    }

})(MAIN)//FEATURE02




//FEATURE02.init();



var SMOOTHSCROLL = (function (m) {
    // Quick import all from MAIN
    for( g in m ){ this[g] = m[g] }

    var
    $wrapper = $('#wrapper'),
    scrolling = false,
    goPos = 0,
    myPos = 10,
    animId,
    init = function(){
        setup();

        $(window).scroll(scroller)
        $(window).resize(resizer)
        $(window).on('load',function(){
            setup();
        })



    },
    setup = function(){

        $body.height(
            $wrapper.height()/2
        )

    },
    resizer = function(){

        setup()

    },
    scroller = function(){

        !scrolling && scrollSmooth()

    },
    scrollSmooth = function(){

        scrolling = true;

        var
        fac = 1/10;

        if( (Math.abs( myPos - scrollPosition() )) < 1 ){
            cancelAnimationFrame(animId);
            scrolling = false;
            return
        }


        myPos = myPos + ( ( scrollPosition() - myPos  ) * fac );

        $wrapper.css({
            'transform':'translate3d(0,'+(-myPos)+'px,0)'
        })

        animId = window.requestAnimationFrame(scrollSmooth);

    }

    m.scrollMotor = function(){
        return myPos
    }

    return{
        init: init
    }

})(MAIN)//SMOOTHSCROLL
//SMOOTHSCROLL.init()


var NAVIGATION = (function (m) {
    for( g in m ){ this[g] = m[g] }

    var
    $navTrigger = $('#navTrigger'),
    $mobileNav = $('#mobileNav'),
    mobile_open = false,
    init = function(){

        $navTrigger.click(navTriggerClick);
		$(window).on('scroll resize', closeMobileNav);

    },
    navTriggerClick = function(){

        if(mobile_open){
            closeMobileNav();
        }else{
            openMobileNav();
        }
    },
    openMobileNav = function(event){
		mobile_open = true;

        $navTrigger.addClass('opened');
		$mobileNav.slideDown(300)
		$mobileNav.find('nav, address').slideDown(300)

    },
    closeMobileNav = function(event){
		mobile_open = false;

        $navTrigger.removeClass('opened');
		$mobileNav.slideUp(300)
		$mobileNav.find('nav, address').slideUp(300)

    }



    return{
        init: init
    }

})(MAIN)//NAVIGATION


//INITIATION
NAVIGATION.init();

})()//End of File
