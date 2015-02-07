// TODO: Add images for each location
var locations = [
  {
    name: "Wally Weekes Pool",
    suburb: "North Bondi",
    img: "images/Wally-Weekes.jpg",
    info: "A very popular pool to take the kids as it’s a tidal pool that was transformed into a rock pool.",
    lat: -33.891492,
    lng: 151.282316
  },
  {
    name: "Bondi Baths",
    suburb: "Bondi",
    img: "http://getconnected.dnsw.com.au/multimedia/NSWMainThumbnail___9612497_TNSW_dnsw999734396.jpg",
    info: "The Bondi Baths are the home of the Bondi Icebergs Winter Swimming Club and is located at the southern end of Bondi Beach and have been a land mark for over 100 years.",
    lat: -33.895028,
    lng: 151.274570
  },
  {
    name: "Bronte Baths",
    suburb: "Bronte",
    img: "images/Bronte-Baths.jpg",
    info: "Probably the most photographed of all of Sydney’s rock pools. Just along the Southern Coastal Walk. Bronte park as working bbqs a wonderful place to go for a evening swim then bbq with friends afterwards.",
    lat: -33.905049,
    lng: 151.269079
  },
// Images and infor from http://www.randwick.nsw.gov.au/facilities-and-recreation/beaches-and-coast/ocean-pools
  {
    name: "Clovelly Ocean Pool",
    suburb: "Clovelly",
    img: "images/400x300_Clovelly-Pool.jpg",
    info: "A saltwater lap pool located next to Clovelly Beach on the concrete promenade.",
    lat: -33.914189,
    lng: 151.266941
  },
  {
    name: "Giles Baths",
    suburb: "Coogee",
    img: "images/400x300_Giles-Baths.jpg",
    info: "A popular swimming hole with young people and a fun place to explore from Coogee Beach. It’s located at the foot of the northern headland.",
    lat: -33.920017,
    lng: 151.260641
  },
  {
    name: "Ross Jones Memorial Pool",
    suburb: "Coogee",
    img: "images/400x300_Ross-Jones.jpg",
    info: "Located at the southern end of Coogee Beach, this man-made ocean pool is lots of fun for the family and gets crowded on a hot summer’s day.",
    lat: -33.922878,
    lng: 151.257858
  },
  {
    name: "McIver's Baths",
    suburb: "Coogee",
    img: "images/400x300_McIvers.jpg",
    info: "The last remaining women’s-only seawater baths in Australia. There's a large concrete sea pool, brick sunbathing area, amenities block, change rooms and small clubhouse.",
    lat: -33.924103,
    lng: 151.258390
  },
  {
    name: "Wylie's Bath",
    suburb: "Coogee",
    img: "images/400x300_Wylies.jpg",
    info: "An iconic sight on the Coogee ocean landscape, Wylies Baths was built in 1907 and enjoys stunning views across Coogee Bay.",
    lat: -33.925476,
    lng: 151.259100
  },
  {
    name: "Ivor Rowe Rockpool",
    suburb: "South Coogee",
    img: "images/400x300_Ivor-Rowe.jpg",
    info: "One of the smallest ocean pools along the Coastal Walkway. It is a natural, shallow rock pool and perfect for wading or cooling down on a hot day.",
    lat: -33.933177,
    lng: 151.261701
  },
  {
    name: "Mahon Pool",
    suburb: "Maroubra",
    img: "images/400x300_Mahon-Pool.jpg",
    info: "The Mahon rock pool is located to the north of Maroubra Beach at the base of Jack Vanny Reserve. The exposed rock outcrops and cliffs above make it a spectacular venue and it is the home of the Maroubra Seals Winter Swimming Club.",
    lat: -33.942808,
    lng: 151.263836
  },
  {
    name: "Malabar Ocean Pool",
    suburb: "Malabar",
    img: "images/400x300_Malabar-Ocean-Pool.jpg",
    info: "Malabar Ocean Pool is located near Malabar Beach in Long Bay directly below Randwick Golf Club. It has spectacular views over Long Bay and onto the Randwick Rifle Range.",
    lat: -33.968516,
    lng: 151.254552
  }
];


// ALLOW FOR NESTED VIEW MODELS
ko.bindingHandlers.stopBinding = {

  init: function() {
    return { controlsDescendantBindings: true }
  }
};
ko.virtualElements.allowedBindings.stopBinding = true;

function TabsViewModel() {
  var self = this;
  self.mapVisible = ko.observable(true);
  self.listVisible = ko.observable(false);

  self.showMapView = function() {
    self.mapVisible(true);
    self.listVisible(false);
  };

  self.showListView = function() {
    self.mapVisible(false);
    self.listVisible(true);
  };
};

function LocationViewModel(parent, ordinal, location) {
  var self = this;
  self.parent = parent;
  self.ordinal = ko.observable(ordinal);
  self.name = ko.observable(location.name);
  self.info = ko.observable(location.info);
  self.img = ko.observable(location.img);
  self.suburb = ko.observable(location.suburb);
  self.lat = ko.observable(location.lat);
  self.lng = ko.observable(location.lng);
  self.selected = ko.observable(false);

  self.select = function() {
    var oldLocation = self.parent.selectedLocation();
    if (oldLocation != null) {
      // Clean up the previous selection.
      oldLocation.infoWindow.close();
      oldLocation.selected(false);
    }
    self.parent.selectedLocation(self);
    self.selected(true);
    // Re-centre the map and open the info window
    self.marker.map.setCenter(self.marker.position);
    self.infoWindow.open(self.marker.map, self.marker);
  };

  self.title = ko.computed(function() {
    return self.ordinal() + ". " + self.name();
  }, self);
};

function LocationListViewModel() {
  var self = this;
  self.locationArray = ko.observableArray([]);
  self.selectedLocation = ko.observable();

  self.setSelected = function(location) {
    self.selectedLocation(location);
  }

  self.initializeMap = function() {

    var mapOptions = {
      zoom: 9,
      mapTypeId: google.maps.MapTypeId.HYBRID
    };

    var bounds = window.mapBounds = new google.maps.LatLngBounds();

    self.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    function pinLocation(ordinal, location) {

      location.marker = new google.maps.Marker({
        map: self.map,
        position: new google.maps.LatLng(location.lat(), location.lng()),
        icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + ordinal + '|00FF00|000000',
        title: location.name()
      });

      // TODO: Where to put more info???
      location.infoWindow = new google.maps.InfoWindow({
        content: location.name() + " " + location.info()
      });

      google.maps.event.addListener(location.marker, 'click', function() {
        location.select();
      });

      bounds.extend(location.marker.position);
    }

    var markers = [];
    var input = document.getElementById('search-box');
    self.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    self.searchBox = new google.maps.places.SearchBox(input);

    // Listen for the event fired when the user selects an item from the
    // pick list. Retrieve the matching places for that item.
    google.maps.event.addListener(self.searchBox, 'places_changed', function() {
      var places = self.searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }
      for (var i = 0, marker; marker = markers[i]; i++) {
        marker.setMap(null);
      }

      // For each place, get the icon, place name, and location.
      markers = [];
      var bounds = new google.maps.LatLngBounds();
      for (var i = 0, place; place = places[i]; i++) {
        var image = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        var marker = new google.maps.Marker({
          map: self.map,
          icon: image,
          title: place.name,
          position: place.geometry.location
        });

        markers.push(marker);

        bounds.extend(place.geometry.location);
      }

      self.map.fitBounds(bounds);
    });

    // Bias the SearchBox results towards places that are within the bounds of the
    // current map's viewport.
    google.maps.event.addListener(map, 'bounds_changed', function() {
      var bounds = map.getBounds();
      self.searchBox.setBounds(bounds);
    });

    // Add LocationViewModel and map pin for each location
    for (var i in locations) {
      var location = locations[i];
      var ordinal = Number(i) + 1;
      var locationView = new LocationViewModel(self, ordinal, location);
      self.locationArray.push(locationView);
      pinLocation(ordinal, locationView);
    }

    // fit the map to the new marker and centre it.
    self.map.fitBounds(bounds);
    self.map.setCenter(bounds.getCenter());
    self.searchBox.setBounds(bounds);
  };
};

var tabsViewModel = new TabsViewModel();
// TODO: Move map initialization to MapViewModel
var listViewModel = new LocationListViewModel();
var viewModel = {
  tabs: tabsViewModel,
  list: listViewModel
};

google.maps.event.addDomListener(window, 'load', listViewModel.initializeMap);
google.maps.event.addDomListener(window, 'resize', function(e) {
  viewModel.list.map.fitBounds(mapBounds);
});

