var locations = [
  { name: "North Bondi Ocean Pool", lat: -33.891492, lng: 151.282316 },
  { name: "Bondi Icebergs Pool", lat: -33.895028, lng: 151.274570 },
  { name: "Bronte Baths", lat: -33.905049, lng: 151.269079 },
  { name: "Clovelly Ocean Pool", lat: -33.914189, lng: 151.266941 },
  { name: "Giles Baths, Coogee", lat: -33.920017, lng: 151.260641 },
  { name: "Ross Jones Memorial Pool, Coogee", lat: -33.922878, lng: 151.257858 },
  { name: "McIver's Baths, Coogee", lat: -33.924103, lng: 151.258390 },
  { name: "Wylie's Bath, Coogee", lat: -33.925476, lng: 151.259100 },
  { name: "Mahon Pool, Maroubra", lat: -33.942808, lng: 151.263836 },
  { name: "Malabar Ocean Pool", lat: -33.968516, lng: 151.254552 }
];

var viewModel = {
  self: this,

  initializeMap: function() {

    var mapOptions = {
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.HYBRID
 //       disableDefaultUI: true
    };

    self.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    function pinLocation(id, location) {

      var marker = new google.maps.Marker({
        map: self.map,
        position: new google.maps.LatLng(location.lat, location.lng),
        icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + id + '|00FF00|000000',
        title: location.name
      });

      // TODO: Where to put more info???
      var infoWindow = new google.maps.InfoWindow({
        content: location.name
      });

      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.open(self.map, marker);
      });

      window.mapBounds.extend(marker.position);
    }

    // Sets the boundaries of the map based on pin locations
    var bounds = window.mapBounds = new google.maps.LatLngBounds();

    self.observableArray = ko.observableArray();
    for (var i in locations) {
      var location = locations[i];
      self.observableArray.push(location);
      pinLocation(Number(i) + 1, location);
    }
    // fit the map to the new marker
    map.fitBounds(bounds);
    // center the map
    map.setCenter(bounds.getCenter());
  }
};

google.maps.event.addDomListener(window, 'load', viewModel.initializeMap);
google.maps.event.addDomListener(window, 'resize', function(e) {
  viewModel.map.fitBounds(mapBounds);
});
