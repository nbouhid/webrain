<?php

/**
 * Implementation of template_preprocess_views_view_fields
 * 
 * @param array $vars
 */
function webrain_preprocess_views_view_fields(&$vars) {
  _webrain_perform_view_preprocess(__FUNCTION__, $vars);
}

/**
* Preprocess to call fields specific preprocess.
*/
function webrain_preprocess_views_view_field(&$vars) {
  _webrain_perform_view_preprocess_field(__FUNCTION__, $vars);
}


/**
 * Implementation of template_preprocess_node
 * @param array $vars
 */
function webrain_preprocess_node(&$vars) {
  _webrain_perform_node_preprocess(__FUNCTION__, $vars);
}

/**
 * Gateway function responsible for calling appropriate preprocess function (if it exists),
 * according to the content type of the node being displayed.
 *
 * @param string $preprocess_prefix
 * @param array $vars
 */
function _webrain_perform_node_preprocess($preprocess_prefix, &$vars) {
  $content_type = $vars['type'];

  $function = implode('__', array($preprocess_prefix, $content_type));

  if (function_exists($function)) {
    $function($vars);
  }
}

/**
 * Implements template_preprocess_page()
 */
function webrain_preprocess_page(&$vars) {
  $node = menu_get_object();
  //check if it is a node and if it is a page to set the long_title flag
  if ($node && $node->nid && $node->type == 'page') {
    if(is_array($node->field_titulo_largo) && array_key_exists('und', $node->field_titulo_largo)) {
      $vars['long_title'] = $node->field_titulo_largo['und'][0]['value'] == '1';
    }
  }
}
/**
 * Implementation of hook_html_head_alter.
 * It's needed so we are able to change the page header. For example, we can:
 * - add IE7 compatibility metatag
 * - add mobile friendly tags
 * - etc
 */
function webrain_html_head_alter(&$head_elements) {
  //Add IE 7 Compatible tag
  $head_elements['internet_explorer_compatible'] = array(
    '#type' => 'html_tag',
    '#tag' => 'meta',
    '#attributes' => array (
      'http-equiv' => 'X-UA-Compatible',
      'content' => 'IE=7'
    ),
    '#weight' => '-1000'
  );
}

/**
 * Gateway function responsible for calling appropriate preprocess function (if it exists),
 * according to the view/block being displayed.
 * 
 * @param string $preprocess_prefix
 * @param array $vars
 */
function _webrain_perform_view_preprocess_field($preprocess_prefix, &$vars) {
  $view = $vars['view'];

  $function = implode('__', array($preprocess_prefix, $view->name, $view->current_display, $vars['field']->field));

  if (function_exists($function)) {
    $function($vars);
  }
}

/**
 * Gateway function responsible for calling appropriate preprocess function (if it exists),
 * according to the view/block being displayed.
 * 
 * @param string $preprocess_prefix
 * @param array $vars
 */
function _webrain_perform_view_preprocess($preprocess_prefix, &$vars) {
  $view = $vars['view'];

  $function = implode('__', array($preprocess_prefix, $view->name, $view->current_display));
var_dump($function);
  if (function_exists($function)) {
    $function($vars);
  }
}

function webrain_preprocess_views_view_field__cuadros_home__block__title(&$vars) {
	global $language;

  $titulo_largo_class = '';
  if (count($vars['row']->field_field_titulo_largo) > 0 && $vars['row']->field_field_titulo_largo[0]['raw']['value'] == '1' ) {
  	$titulo_largo_class = 'titulo-largo';
  }

  $vars['link'] = l(t($vars['row']->node_title), 
  										drupal_lookup_path('alias', "node/" . $vars['row']->nid, $language->language), 
											array('attributes' => array('class' => array($titulo_largo_class))));
}

function webrain_js_alter(&$javascript) {
  drupal_add_library('system', 'ui.slider');
}

function webrain_preprocess_form(&$variables) {
  //avoiding html5 form validation
  $variables['element']['#attributes']['novalidate']  = '';
}