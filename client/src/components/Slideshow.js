import React from 'react';
import '../css/Slideshow.css'
import { TweenMax, Power3 } from 'gsap';
import $ from 'jquery'
import { windowHeight } from 'react-window-size'

class Slideshow extends React.Component {
  componentDidMount(){
    var slideshowDuration = 4000;
    var slideshow=$('.main-content .slideshow');
    
    function slideshowSwitch(slideshow,index,auto){
      if(slideshow.data('wait')) return;

      var slides = slideshow.find('.slide');
      var activeSlide = slides.filter('.is-active');
      var activeSlideImage = activeSlide.find('.image-container');
      var newSlide = slides.eq(index);
      var newSlideImage = newSlide.find('.image-container');
      var newSlideContent = newSlide.find('.slide-content');
      var newSlideElements=newSlide.find('.caption > *');
      if(newSlide.is(activeSlide))return;
    
      newSlide.addClass('is-new');
      var timeout=slideshow.data('timeout');
      clearTimeout(timeout);
      slideshow.data('wait',true);
      var transition=slideshow.attr('data-transition');
      if(transition==='fade'){
        newSlide.css({
          display:'block',
          zIndex:2
        });
        newSlideImage.css({
          opacity:0
        });
    
        TweenMax.to(newSlideImage,1,{
          alpha:1,
          onComplete:function(){
            newSlide.addClass('is-active').removeClass('is-new');
            activeSlide.removeClass('is-active');
            newSlide.css({display:'',zIndex:''});
            newSlideImage.css({opacity:''});
            slideshow.find('.pagination').trigger('check');
            slideshow.data('wait',false);
            if(auto){
              timeout=setTimeout(function(){
                slideshowNext(slideshow,false,true);
              },slideshowDuration);
              slideshow.data('timeout',timeout);}}});
      } else {
        if(newSlide.index()>activeSlide.index()){
          var newSlideRight=0;
          var newSlideLeft='auto';
          var newSlideImageRight=-slideshow.width()/8;
          var newSlideImageLeft='auto';
          var newSlideImageToRight=0;
          var newSlideImageToLeft='auto';
          var newSlideContentLeft='auto';
          var newSlideContentRight=0;
          var activeSlideImageLeft=-slideshow.width()/4;
        } else {
          newSlideRight='';
          newSlideLeft=0;
          newSlideImageRight='auto';
          newSlideImageLeft=-slideshow.width()/8;
          newSlideImageToRight='';
          newSlideImageToLeft=0;
          newSlideContentLeft=0;
          newSlideContentRight='auto';
          activeSlideImageLeft=slideshow.width()/4;
        }
    
        newSlide.css({
          display:'block',
          width:0,
          right:newSlideRight,
          left:newSlideLeft
          ,zIndex:2
        });
    
        newSlideImage.css({
          width:slideshow.width(),
          right:newSlideImageRight,
          left:newSlideImageLeft
        });
    
        newSlideContent.css({
          width:slideshow.width(),
          left:newSlideContentLeft,
          right:newSlideContentRight
        });
    
        activeSlideImage.css({
          left:0
        });
    
        TweenMax.set(newSlideElements,{y:20,force3D:true});
        TweenMax.to(activeSlideImage,1,{
          left:activeSlideImageLeft,
          ease:Power3.easeInOut
        });
    
        TweenMax.to(newSlide,1,{
          width:slideshow.width(),
          ease:Power3.easeInOut
        });
    
        TweenMax.to(newSlideImage,1,{
          right:newSlideImageToRight,
          left:newSlideImageToLeft,
          ease:Power3.easeInOut
        });
    
        TweenMax.staggerFromTo(newSlideElements,0.8,{alpha:0,y:60},{alpha:1,y:0,ease:Power3.easeOut,force3D:true,delay:0.6},0.1,function(){
          newSlide.addClass('is-active').removeClass('is-new');
          activeSlide.removeClass('is-active');
          newSlide.css({
            display:'',
            width:'',
            left:'',
            zIndex:''
          });
    
          newSlideImage.css({
            width:'',
            right:'',
            left:''
          });
    
          newSlideContent.css({
            width:'',
            left:''
          });
    
          newSlideElements.css({
            opacity:'',
            transform:''
          });
    
          activeSlideImage.css({
            left:''
          });
    
          slideshow.find('.pagination').trigger('check');
          slideshow.data('wait',false);
          if(auto){
            timeout=setTimeout(function(){
              slideshowNext(slideshow,false,true);
            },slideshowDuration);
            slideshow.data('timeout',timeout);
          }
        });
      }
    }
    
    function slideshowNext(slideshow,previous,auto){
      var slides=slideshow.find('.slide');
      var activeSlide=slides.filter('.is-active');
      var newSlide=null;
      if(previous){
        newSlide=activeSlide.prev('.slide');
        if(newSlide.length === 0) {
          newSlide=slides.last();
        }
      } else {
        newSlide=activeSlide.next('.slide');
        if(newSlide.length===0)
          newSlide=slides.filter('.slide').first();
      }
    
      slideshowSwitch(slideshow,newSlide.index(),auto);
    }
    
    function homeSlideshowParallax(){
      var scrollTop=$(window).scrollTop();
      if(scrollTop>windowHeight) return;
      var inner=slideshow.find('.slideshow-inner');
      var newHeight=windowHeight-(scrollTop/2);
      var newTop=scrollTop*0.8;
    
      inner.css({
        transform:'translateY('+newTop+'px)',height:newHeight
      });
    }
    
    $(document).ready(function() {
     $('.slide').addClass('is-loaded');
    
     $('.slideshow .arrows .arrow').on('click',function(){
      slideshowNext($(this).closest('.slideshow'),$(this).hasClass('prev'));
    });
    
     $('.slideshow .pagination .item').on('click',function(){
      slideshowSwitch($(this).closest('.slideshow'),$(this).index());
    });
    
     $('.slideshow .pagination').on('check',function(){
      var slideshow=$(this).closest('.slideshow');
      var pages=$(this).find('.item');
      var index=slideshow.find('.slides .is-active').index();
      pages.removeClass('is-active');
      pages.eq(index).addClass('is-active');
    });
    
    var timeout=setTimeout(function(){
      slideshowNext(slideshow,false,true);
    },slideshowDuration);
    
    slideshow.data('timeout',timeout);
    });
    
    if($('.main-content .slideshow').length > 1) {
      $(window).on('scroll',homeSlideshowParallax);
    }
  }
  render(){ 
    
    return (
      <main className="main-content">
      <section className="slideshow">
        <div className="slideshow-inner">
          <div className="slides">
            <div className="slide is-active ">
              <div className="slide-content">
                <div className="caption">
                  <div className="title"></div>
                  <div className="text">
                    <p></p>
                  </div> 
                </div>
              </div>
              <div className="image-container"> 
                <img src='/slika2.jpg' alt="" className="image" />
              </div>
            </div>
            <div className="slide">
              <div className="slide-content">
                <div className="caption">
                  <div className="title"></div>
                  <div className="text">
                    <p></p>
                  </div> 
                </div>
              </div>
              <div className="image-container">
                <img src='/slika4.jpg' alt="" className="image" />
              </div>
            </div>
            <div className="slide">
              <div className="slide-content">
                <div className="caption">
                  <div className="title"></div>
                  <div className="text">
                    <p></p>
                  </div> 
                </div>
              </div>
              <div className="image-container">
                <img src='/slika3.jpg' alt="" className="image" />
              </div>
            </div>
            <div className="slide">
              <div className="slide-content">
                <div className="caption">
                  <div className="title"></div>
                  <div className="text">
                    <p></p>
                  </div> 
                </div>
              </div>
              <div className="image-container"> 
                <img src='/slika3.jpg' alt="" className="image" />
              </div>
            </div>
          </div>
          <div className="pagination">
            <div className="item is-active"> 
              <span className="icon">1</span>
            </div>
            <div className="item">
              <span className="icon">2</span>
            </div>
            <div className="item">
              <span className="icon">3</span>
            </div>
            <div className="item">
              <span className="icon">4</span>
            </div>
          </div>
          <div className="arrows">
            <div className="arrow prev">
              <span className="svg svg-arrow-left">
                <svg version="1.1" id="svg4-Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="14px" height="26px" viewBox="0 0 14 26" enableBackground="new 0 0 14 26" xmlSpace="preserve"> <path d="M13,26c-0.256,0-0.512-0.098-0.707-0.293l-12-12c-0.391-0.391-0.391-1.023,0-1.414l12-12c0.391-0.391,1.023-0.391,1.414,0s0.391,1.023,0,1.414L2.414,13l11.293,11.293c0.391,0.391,0.391,1.023,0,1.414C13.512,25.902,13.256,26,13,26z"/> </svg>
                <span className="alt sr-only"></span>
              </span>
            </div>
            <div className="arrow next">
              <span className="svg svg-arrow-right">
                <svg version="1.1" id="svg5-Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="14px" height="26px" viewBox="0 0 14 26" enableBackground="new 0 0 14 26" xmlSpace="preserve"> <path d="M1,0c0.256,0,0.512,0.098,0.707,0.293l12,12c0.391,0.391,0.391,1.023,0,1.414l-12,12c-0.391,0.391-1.023,0.391-1.414,0s-0.391-1.023,0-1.414L11.586,13L0.293,1.707c-0.391-0.391-0.391-1.023,0-1.414C0.488,0.098,0.744,0,1,0z"/> </svg>
                <span className="alt sr-only"></span>
              </span>
            </div>
          </div>
        </div> 
      </section>
    </main>
    );
  }
}

export default Slideshow;