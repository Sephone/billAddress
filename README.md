billAddress
===========

This will copy one address to another, like for billing and physical address.
 
It will stop once one of the second address fields is focused on. Optional you can have a copy button when that button is clicked, the fields are copied.
 
    $("#ClientExpressForm").billAddress({
      fields: {
        'data[Client][address]':	'data[Client][bill_address]',
        'data[Client][city]': 		'data[Client][bill_city]',
        'data[Client][state]': 		'data[Client][bill_state]',
        'data[Client][zip]': 		'data[Client][bill_zip]'
      },
      copyButton: 'i.copyBillAddress'
    });
 
Fields is a list of inputs by their name, the first one is always copied to the second one.
 
All fields are optional.
Can be turned off by 

    $("#ClientExpressForm").billAddress('destroy');
 
or copy manually by 

    $("#ClientExpressForm").billAddress('copyAddress');
