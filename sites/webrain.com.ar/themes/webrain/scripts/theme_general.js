(function($){
  $(document).ready(function() {
		restructureContactForm();
		prepareForms();
		prepareEmarketingHover();
    initSlider();
  });
	
	function prepareEmarketingHover() {
		var container = $('div.view-display-id-emarketing_cuadros');
		var lista_container = $('div.view-display-id-lista_cuadros_emarketing');
		
		if (container.length) {
			$('li', container).hover(function() {
				$('div.views-field-body', this).show();
				$(this).addClass('hover');
				$('li:eq(' + $(this).index() + ')', lista_container).addClass('hover');
			}, function () {
				$('div.views-field-body', this).hide();
				$(this).removeClass('hover');
				$('li:eq(' + $(this).index() + ')', lista_container).removeClass('hover');
			});
			
			if(lista_container.length) {
				$('li', lista_container).hover(function() {
					$('li:eq(' + $(this).index() + ')', container).addClass('hover').find('div.views-field-body').show();
					$(this).addClass('hover');
				}, function () {
					$('li:eq(' + $(this).index() + ')', container).removeClass('hover').find('div.views-field-body').hide();
					$(this).removeClass('hover');
				});
			}
		}
	}
	
	/** FORMS **/
	function restructureContactForm() {
		var form = $('form#webform-client-form-4');
		var right = 'div#webform-component-comentarios, div#edit-actions, input[type="hidden"][name="submitted[captcha]"]';	
		
		$('> div' ,form).addClass('left-side');
		form.append('<div class="right-side" />');
		
		$(right, form).remove().appendTo($('div.right-side', form));
    
    //disable the dropdown
    $('.jqTransformSelectWrapper').unbind();
    
    $('.jqTransformSelectWrapper ul li').unbind();
	}
	
	function replaceCaptchas(form) {
		var captcha = $('div.captcha', form);
		var captcha_html = captcha.clone();
		captcha.remove();
		$('input[type="hidden"][name="submitted[captcha]"]', form).before(captcha_html);
	}
	
	function initjqTransform(form) {
		$(form).jqTransform({imgPath:'/sites/webrain.com.ar/themes/webrain/libs/jqtransformplugin/img/'});
	}
	
	function placeDefaultTextInput(form) {
		$('span.form-required', form).remove();
		$('input:text, input[type="email"], textarea', form).each(function(index, value) {
			var default_text_field_address_to_search = $.trim($('label[for="' + $(this).attr('id') + '"]', form).text().toUpperCase());
			defaultValueFieldAddressToSearch($(this), default_text_field_address_to_search);
			$(this).focus(function() {
				clearValueFieldAddressToSearch($(this), default_text_field_address_to_search);
			}).focusout(function() {
				defaultValueFieldAddressToSearch($(this), default_text_field_address_to_search);
			});
		});
	}

	function placeDefaultTextSelect(form) {
		$('div.jqTransformSelectWrapper select', form).each(function(index, value) {
			var parent = $(this).parent().parent('div.webform-component-select');
			var default_text_field_address_to_search = $.trim($('label[for="' + $(this).attr('id') + '"]', form).text().toUpperCase());
			$('div.jqTransformSelectWrapper > div > span', parent).text(default_text_field_address_to_search);
			$('ul li:first', parent).hide();
			$('ul', parent).css('max-height', (($('ul li', parent).length - 1) * 24) + "px");
		});
	}
	
	function defaultValueFieldAddressToSearch(element, default_text_field_address_to_search) {
	    if (element.val() == '' || element.val() == default_text_field_address_to_search){
	        element.val(default_text_field_address_to_search);
	    }
  	}

	function clearValueFieldAddressToSearch(element, default_text_field_address_to_search) {
		if (element.val() == default_text_field_address_to_search) {
			element.val(null);
		}
	}
	
	function prepareValidationForm(form) {
		
	}
	
	function prepareForms() {
		$('form.webform-client-form').each(function(index, value) {
			initjqTransform(this);
			replaceCaptchas(this);
			placeDefaultTextInput(this);
			placeDefaultTextSelect(this);
			prepareValidationForm(this);
		});
	}
	/** [end of] FORMS **/

  function initSlider() {
    var carousel_container = $('div.view-slider div.view-content div.item-list');
    var text_container = $('div.view-slider div.view-text');
    if(carousel_container.length) {
      Drupal.carousel = {};
      Drupal.carousel.sliding = false;
      Drupal.carousel.curr_slide = 1;
      Drupal.carousel.prev_btn = $('.carousel-previous');
      Drupal.carousel.next_btn = $('.carousel-next');
      
      var carousel_elements = $('ul li', carousel_container).length;
      var slider_obj = $('div.view-slider div.slider');
      var carousel_items_list = $('div.view-id-slider_list_sidebar ul li');
      carousel_container.carousel('.carousel-previous', '.carousel-next', {
        change: function(element_id) {
          Drupal.carousel.curr_slide = element_id;
          
          //Update the position of the slider
          if(Drupal.carousel.sliding === false) {
            slider_obj.slider('value', element_id);

            if(carousel_items_list.length > 0) {
              carousel_items_list.removeClass('active')
                .eq(element_id-1)
                .addClass('active');
            }
          }
          
          //changing text
          text_container.children().fadeOut(250, function() {
            $(text_container).html($('ul li', carousel_container).eq(element_id-1).find('div.info').html());
            $(this).fadeIn(250);
           });
        },
        rotation: 3000
      });  
      
      //updating text container
      text_container.html($('ul li:first div.info', carousel_container).html());
      //update sidebar list if exists
      if(carousel_items_list.length > 0) {
        $(carousel_items_list).eq(0).addClass('active');

        carousel_items_list.click(function() {
          if(Drupal.carousel.sliding === false) {
            //carousel_items_list.removeClass('active');
            //$(this).addClass('active');
            slider_obj.slider('value', $(this).index()+1);
            setTimeout('Drupal.carousel.goBySlider();', 100);
          }
        });
      }
      
      //scroll object
      slider_obj.slider({
        animate: '450',
        min: 1,
        max: carousel_elements,
        slide: function (event, ui)  {
          if(Drupal.carousel.sliding == false) {
            setTimeout('Drupal.carousel.goBySlider();', 100);
          }
        },
        stop: function(event, ui) {
          if(Drupal.carousel.sliding == false) {
            setTimeout('Drupal.carousel.goBySlider();', 100);
          }
        }
      });
      
      Drupal.carousel.goBySlider = function() {
        var slider_value = slider_obj.slider('value');

        if(Drupal.carousel.curr_slide != slider_value) {
          Drupal.carousel.sliding = true;
          
          if(Drupal.carousel.curr_slide < slider_value)
            Drupal.carousel.next_btn.click();
          else if(Drupal.carousel.curr_slide > slider_value)
            Drupal.carousel.prev_btn.click();

          if(carousel_items_list.length > 0) {
            carousel_items_list.removeClass('active')
              .eq(Drupal.carousel.curr_slide-1)
              .addClass('active');
          }
          setTimeout('Drupal.carousel.goBySlider();', 500);
        } else {
          Drupal.carousel.sliding = false;
        }
      }
    }
  }
})(jQuery);