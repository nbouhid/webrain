/**
 * @author Stéphane Roucheray 
 * @extends jquery
 */


jQuery.fn.carousel = function(previous, next, options){
	var sliderList = jQuery(this).children()[0];
	
	if (sliderList) {
    var autoSlide;
		var increment = jQuery(sliderList).children().outerWidth("true"),
		elmnts = jQuery(sliderList).children(),
		numElmts = elmnts.length,
		sizeFirstElmnt = increment,
		shownInViewport = Math.round(jQuery(this).width() / sizeFirstElmnt),
		firstElementOnViewPort = 1,
		isAnimating = false;
    clickEmulated = false;
    
		for (i = 0; i < shownInViewport; i++) {
			jQuery(sliderList).css('width',(numElmts+shownInViewport)*increment + increment + "px");
			jQuery(sliderList).append(jQuery(elmnts[i]).clone());
		}
		
		jQuery(previous).click(function(event){
			if (!isAnimating) {
				if (firstElementOnViewPort == 1) {
					jQuery(sliderList).css('left', "-" + numElmts * sizeFirstElmnt + "px");
					firstElementOnViewPort = numElmts;
				}
				else {
					firstElementOnViewPort--;
				}
        
        if(typeof options != 'undefined' && typeof options.change == "function") {
          options.change(firstElementOnViewPort);
        }
				jQuery(sliderList).animate({
					left: "+=" + increment,
					y: 0,
					queue: true
				}, "swing", function(){isAnimating = false;});
				isAnimating = true;
			}
			clearInterval(autoSlide);
		});
		
		jQuery(next).click(function(event){
			if (!isAnimating) {
				if (firstElementOnViewPort > numElmts) {
					firstElementOnViewPort = 2;
					jQuery(sliderList).css('left', "0px");
				}
				else {
					firstElementOnViewPort++;
				}
        if(typeof options != 'undefined' && typeof options.change == "function") {
          var elementId = firstElementOnViewPort==numElmts+1?1:firstElementOnViewPort;
          options.change(elementId);
        }
				jQuery(sliderList).animate({
					left: "-=" + increment,
					y: 0,
					queue: true
				}, "swing", function(){isAnimating = false;});
				isAnimating = true;
			}
      
      if(clickEmulated === true) {
          clickEmulated = false;
      } else {
        clearInterval(autoSlide);
      }
		});
    
    if(options.rotation > 0) {
      autoSlide = setInterval(function() {
        clickEmulated = true;
        jQuery(next).click();
      }, options.rotation);
    }
	}
};
