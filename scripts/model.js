/*
function point(name, lat, long) {
    this.name = name;
    this.lat = ko.observable(lat);
    this.long = ko.observable(long);

    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, long),
        title: name,
        map: map,
        draggable: true
    });

    //if you need the poition while dragging
    google.maps.event.addListener(marker, 'drag', function() {
        var pos = marker.getPosition();
        this.lat(pos.lat());
        this.long(pos.lng());
    }.bind(this));

    //if you just need to update it when the user is done dragging
    google.maps.event.addListener(marker, 'dragend', function() {
        var pos = marker.getPosition();
        this.lat(pos.lat());
        this.long(pos.lng());
    }.bind(this));
}
*/

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

function ViewModel() {
    var self = this;

    self.initializeMap = function() {

      var mapOptions = {
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.HYBRID
   //       disableDefaultUI: true
      };

      self.map = new google.maps.Map(document.getElementById('map'), mapOptions);

      function pinLocation(id, location) {

        var bounds = window.mapBounds;

        var marker = new google.maps.Marker({
          map: self.map,
          position: new google.maps.LatLng(location.lat, location.lng),
          icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + id + '|00FF00|000000',
          title: location.name
        });

        // infoWindows are the little helper windows that open when you click
        // or hover over a pin on a map. They usually contain more information
        // about a location.
        var infoWindow = new google.maps.InfoWindow({
          labelContent: id,
          content: location.name
        });

        google.maps.event.addListener(marker, 'click', function() {
          infoWindow.open(self.map, marker);
        });

        bounds.extend(marker.position);

        // fit the map to the new marker
        //self.map.fitBounds(bounds);
        // center the map
        //self.map.setCenter(bounds.getCenter());
      }

      // Sets the boundaries of the map based on pin locations
      window.mapBounds = new google.maps.LatLngBounds();
      for (var i in locations) {
        pinLocation(Number(i) + 1, locations[i]);
      }
      // fit the map to the new marker
      self.map.fitBounds(window.mapBounds);
      // center the map
      self.map.setCenter(window.mapBounds.getCenter());

      //pinPoster(locations);
    }
/*
    points: ko.observableArray([
        new point('Test1', 55, 11),
        new point('Test2', 56, 12),
        new point('Test3', 57, 13)]); */
};

var viewModel = new ViewModel();
//ko.applyBindings(viewModel);
window.addEventListener('load', viewModel.initializeMap);
window.addEventListener('resize', function(e) {
  viewModel.map.fitBounds(mapBounds);
});
