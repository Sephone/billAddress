/*
 * this will copy one address to another, like for billing and physical address
 *
 * it will stop once one of the second address fields is focused one
 * optional you can have a copy button
 * when that button is clicked, the fields are copied
 *
 * $("#ClientExpressForm").billAddress({
 *	fields: {
 * 		'data[Client][address]':	'data[Client][bill_address]',
 * 		'data[Client][city]': 		'data[Client][bill_city]',
 * 		'data[Client][state]': 		'data[Client][bill_state]',
 * 		'data[Client][zip]': 		'data[Client][bill_zip]'
 * 	},
 *	copyButton: 'i.copyBillAddress'
 * });
 *
 * fields is a list of inputs by their name, the first one is always copied to the second one.
 *
 * all fields are optional
 * can be turned off by 
 * $("#ClientExpressForm").billAddress('destroy');
 *
 * can copy manually by 
 * $("#ClientExpressForm").billAddress('copyAddress');
 *
 */
(function($) {

	var coreSlice = Array.prototype.slice;

	var defaultOptions = {
		/* 
		 * the fields that hold the address to populate second
		 */
		fields: { 
			'data[Client][address]':	'data[Client][bill_address]',
			'data[Client][city]': 		'data[Client][bill_city]',
			'data[Client][state]': 		'data[Client][bill_state]',
			'data[Client][zip]': 		'data[Client][bill_zip]'
		},

		/**
		 * this is the copy button
		 * should be a jQuery selector
		 */
		copyButton: 'i.copyBillAddress'
	};

	function BillAddress(options, element) { 
		/*
		 * the actually jquery object we are working
		 */
		this.element = $(element);

		/*
		 * the settings/params passed
		 */
		this.options = $.extend({}, defaultOptions, $(element).data(), options);
			
		this._init();
	}

	$.extend(true, BillAddress.prototype, {

		/*
		 * this is the thing that tells if we should update account
		 */
		_active: true, 

		/*
		 * this is the actually jQuery object
		 */
		element: {},

		/**
		 * the options that were passed
		 */
		options: {},

		/*
		 * bind everything
		 */
		_init: function() { 
			this.element.find(':input').focus(this._inputFocus);
			this.element.find(':input').keyup(this._inputChange);
			this.element.find(this.options.copyButton).click(this._copyAddress);
		},

		/**
		 * this is when we change fields,
		 * need to know if we have entered a field that is suppose to shut off the plugin
		 */
		_inputFocus: function() { 
			var instance = $(this).parents('form').first().data('billAddress');
			var $this = $(this);
			$.each(instance.options.fields, function(index, value) { 
				if ($this.attr('name') == value) { 
					instance._active = false;
				}
			});
		},

		/*
		 * when a value changes, check to see if it needs to go into the other matching field
		 */
		_inputChange: function() { 
			var $this = $(this);
			var instance = $(this).parents('form').first().data('billAddress');
			if (instance._active) { 
				$.each(instance.options.fields, function(index, value) { 
					if (index == $this.attr('name')) { 
						if ($this.val().length) { 
							instance.element.find('*[name="' + value + '"]').val($this.val());
						}
					}
				});
			}
		},

		/**
		 * the bind method for copy
		 */
		_copyAddress: function() { 
			var instance = $(this).parents('form').first().data('billAddress');
			instance.copyAddress();
		},

		/**
		 * this will copy all of our fields to the next one
		 */
		copyAddress: function() { 
			var instance = this;
			$.each(instance.options.fields, function(index, value) { 
				var firstInput = instance.element.find('*[name="' + index + '"]');
				var secondInput = instance.element.find('*[name="' + value + '"]');
				if (firstInput.val().length) { 
					secondInput.val(firstInput.val());
				}
			});
		},

		/*
		 * nuke the data and unbind stuff
		 */
		destroy: function() { 
			$.removeData(this.element, 'billAddress');

			this.element.find(':input').unbind('focus', this._inputFocus);
			this.element.find(':input').unbind('keyup', this._inputChange);
			this.element.find(this.options.copyButton).unbind('click', this._copyAddress);
		}

	});

	$.fn.billAddress = function(options) {
		var isMethodCall = typeof options === "string";
		var args = coreSlice.call(arguments, 1);
		var domElement = this.get(0);
		var instance;
		var methodResult;

		if (!domElement) {
			return this;
		}

		instance = $.data(domElement, 'billAddress');

		if (isMethodCall) {
			if ( options === "instance" ) {
				return instance;
			}

			// If there is no instance, throw an error
			if (!instance) {
				return $.error( "cannot call methods on billAddress" +
					" prior to initialization; " +
					"attempted to call method '" +
					options +
					"'" );
			}

			// If there is no such public method, throw an error
			if (!$.isFunction(instance[options]) || options.charAt(0) === "_" ) {
				return $.error( "no such method '" +options + "' for billAddress instance");
			}

			methodResult = instance[options].apply(instance, args);

			if ((methodResult !== instance) && (methodResult !== undefined)) {
				return methodResult;
			}

			return this;
		}

		if (instance) {
			$.extend(instance.options, options || {});
			if (instance._init) {
				instance._init();
			}
		} else {
			instance = new BillAddress(options, domElement);
			$.data(domElement, 'billAddress', instance);
		}

		return this;
	};

})(jQuery);

