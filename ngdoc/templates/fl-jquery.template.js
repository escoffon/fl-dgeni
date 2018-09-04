(function(jQuery) {
     jQuery.fl = jQuery.fl || { };

     jQuery.fl._tracking_id = 0;
     jQuery.fl._tracking_elements = { };

     jQuery.fl.register_tracking_element = function(el) {
	 jQuery.fl._tracking_id += 1;
	 var tid = 't:' + jQuery.fl._tracking_id;

	 jQuery.fl._tracking_elements[tid] = jQuery(el);

	 return tid;
     };

     jQuery.fl.unregister_tracking_element = function(tid) {
	 jQuery.fl._tracking_elements[tid] = null;
     };

     jQuery.fl.get_tracking_element = function(tid) {
	 return jQuery.fl._tracking_elements[tid];
     };

     jQuery.fl.track_element_to_window = function(el) {
	 var wh = jQuery(window).height();
	 var el_jq = jQuery(el);
	 var pos = el_jq.offset();
	 var mb = (el.css('marginBottom').length > 0) ? parseInt(el.css('marginBottom')) : 0;
	 var eh = wh - pos.top - mb;
	 el_jq.css('overflow', 'scroll');
	 el_jq.css('height', '' + eh + 'px');
     };

     jQuery.fl.resize_tracking_elements = function() {
	 var key;
	 var el_jq;
	 var wh = jQuery(window).height();
	 var pos;
	 var eh;
	 var mb;

	 for (key in jQuery.fl._tracking_elements)
	 {
	     el_jq = jQuery.fl._tracking_elements[key];
	     if (el_jq)
	     {
		 mb = parseInt(el_jq.css('marginBottom'));
		 pos = el_jq.offset();
		 eh = wh - pos.top - mb;
		 el_jq.css('overflow', 'scroll');
		 el_jq.css('height', '' + eh + 'px');
	     }
	 }
     };
})(jQuery);

jQuery(document).on('ready', function(evt) {
			jQuery.fl.resize_tracking_elements();
		    });
jQuery(window).on('load', function(evt) {
			jQuery.fl.resize_tracking_elements();
		    });
jQuery(window).on('resize', function(evt) {
		      jQuery.fl.resize_tracking_elements();
		  });
