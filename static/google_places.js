
$.getScript( "https://maps.googleapis.com/maps/api/js?key=" + google_api_key + "&libraries=places") 
.done(function( script, textStatus ) {
    google.maps.event.addDomListener(window, "load", initAutocomplete())
})

var auto_fields =['a', 'wp1', 'wp2', 'wp3', 'b']

function initAutocomplete() {
    for (i= 0; i < auto_fields.length; i++) {
        var field = auto_fields[i]
        window['autocomplete_'+field] = new google.maps.places.Autocomplete(
            document.getElementById('id-google-address-'+field),
   {
       types: ['address'],
       componentRestrictions: {'country': ['usa']},
   })
}
  autocomplete_a.addListener('place_changed', function(){
    onPlaceChanged('a')
  });

  autocomplete_wp1.addListener('place_changed', function(){
    onPlaceChanged('wp1')
  });

  autocomplete_wp2.addListener('place_changed', function(){
    onPlaceChanged('wp2')
  });

  autocomplete_wp3.addListener('place_changed', function(){
    onPlaceChanged('wp3')
  });
  
  autocomplete_b.addListener('place_changed', function(){
    onPlaceChanged('b')
  });
}

function onPlaceChanged (addy){
    var auto = window['autocomplete_'+addy]
    var el_id = 'id-google-address-'+addy
    var lat_id = 'id-lat-'+ addy
    var long_id = 'id-long-'+ addy

    var geocoder = new google.maps.Geocoder()
    var address = document.getElementById(el_id).value

    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();

            $('#' + lat_id).val(latitude) 
            $('#' + long_id).val(longitude) 

            CalcRoute()
        } 
    }); 
}

function validateForm() {
    var valid = true;
    $('.geo').each(function () {
        if ($(this).val() === '') {
            valid = false;
            return false;
        }
    });
    return valid
}

function CalcRoute(){
    if ( validateForm() == true){
      var params = {
          lat_a: $('#id-lat-a').val(),
          long_a: $('#id-long-a').val(),
          lat_wp1: $('#id-lat-wp1').val(),
          long_wp1: $('#id-long-wp1').val(),
          lat_wp2: $('#id-lat-wp2').val(),
          long_wp2: $('#id-long-wp2').val(),
          lat_wp3: $('#id-lat-wp3').val(),
          long_wp3: $('#id-long-wp3').val(),
          lat_b: $('#id-lat-b').val(),
          long_b: $('#id-long-b').val(),
      };

      var esc = encodeURIComponent;
      var query = Object.keys(params)
          .map(k => esc(k) + '=' + esc(params[k]))
          .join('&');

      url = '/map?' + query
      window.location.assign(url)
    }
}
