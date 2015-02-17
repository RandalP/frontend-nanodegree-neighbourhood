/*
 * From: http://firmamento.org/blog/2013/04/21/how-to-build-a-large-single-page-javascript-application-using-knockoutjs
 * ALLOW FOR NESTED VIEW MODELS
 */
ko.bindingHandlers.stopBinding = {
  init: function() {
    return { controlsDescendantBindings: true };
  }
};
ko.virtualElements.allowedBindings.stopBinding = true;

/*
 * Locations DataModel
 */
function LocationsDataModel() {
  'use strict';
  var self = this;

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
      name: "Malabar Pool",
      suburb: "Malabar",
      img: "images/400x300_Malabar-Ocean-Pool.jpg",
      info: "Malabar Ocean Pool is located near Malabar Beach in Long Bay directly below Randwick Golf Club. It has spectacular views over Long Bay and onto the Randwick Rifle Range.",
      lat: -33.968516,
      lng: 151.254552
    }
  ];

 self.selectLocation = function() {
    var oldLocation = self.selectedLocation();
    if (oldLocation) {
      // Clean up the previous selection.
      oldLocation.selected(false);
    }
    self.name(this.name);
    this.selected(true);
    self.selectedLocation(this);
  }

  // Add LocationViewModel and map pin for each location
  for (var i in locations) {
    var location = locations[i];

    location.ordinal = Number(i) + 1;
    location.selected = ko.observable(false);
    location.parent = self;
    location.select = self.selectLocation.bind(location);
  }

  self.locationArray = ko.observableArray(locations);
  self.selectedLocation = ko.observable();
  self.name = ko.observable();
}

/*
 * Tabs ViewModel
 */
function TabsViewModel(childVMs) {
  'use strict';
  var self = this;
  self.mapVisible = ko.observable(true);
  self.listVisible = ko.observable(false);
  self.flickrVisible = ko.observable(false);

  self.showMapView = function() {
    self.flickrVisible(false);
    self.listVisible(false);
    self.mapVisible(true);
    childVMs.map.resize();
  };

  self.showListView = function() {
    self.flickrVisible(false);
    self.listVisible(true);
    self.mapVisible(false);
    childVMs.list.resize();
  };

  self.showFlickrView = function() {
    self.flickrVisible(true);
    self.listVisible(false);
    self.mapVisible(false);
    childVMs.flickr.resize();
  };

  self.resize = function(resizeEvent) {
    if (self.mapVisible()) {
      childVMs.map.resize(resizeEvent);
    }
    if (self.listVisible()) {
      childVMs.list.resize(resizeEvent);
    }
    if (self.flickrVisible()) {
      childVMs.flickr.resize(resizeEvent);
    }
  }
}

function FlickrViewModel(data) {
  'use strict';
  var self = this;

  self.data = data;
  self.imageArray = ko.observableArray([]);

  self.flickr = new Flickr({
    api_key: '562af0fb090c53b310b934fef0c87a7d'
  });

/*
  data.imageArray.subscribe(function(imageArray) {
    var $flickr = $('#flickr');
    if (imageArray.length) {
      $flickr.show();
    }
    else {
      $flickr.hide();
    }
  });
*/

  data.selectedLocation.subscribe(function(location) {

    var width = Number($('.flickr-view').css('width').slice(0, -2));
//    console.log(width);

    self.imageArray.removeAll();

    self.flickr.photos.search({
      text: location.name, // + ' Australia',
      lat: location.lat,
      lon: location.lng,
      radius: 0.5,
      geocontext: 2 // outdoors
    }, function(err, result) {
      if (err) {
        console.log(err);
        $('#flickr-heading').text('Flickr Images for ' + location.name +  'could not be loaded: ' + err);
      }
      else {
        var getSizeCode = function(width) {
          var sizeCode = 's'; // s: 75 x 75
          if (width >= 650) {
            sizeCode = 'z'; // z: 640 on longest side
          } else if (width >= 250) {
            sizeCode = 'm'; // m: 240 on longest side
          } else if (width >= 110) {
            sizeCode = 't'; // t: 100 on longest side
          }
          return sizeCode;
        };

        var imageInfo = [];
        for (var i in result.photos.photo) {
          var photo = result.photos.photo[i];
          var info = {
            url: ko.observable('https://www.flickr.com/photos/' + photo.owner + '/' + photo.id),
            src: ko.observable('https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' +
             photo.id + '_' + photo.secret + '_' + getSizeCode(width) + '.jpg')
          };
          imageInfo.push(info);
          // console.log(info);
        }
        ko.utils.arrayPushAll(self.imageArray, imageInfo);
        self.imageArray.valueHasMutated();
      }
    });
  });

  self.resize = function() {
    var $flickr_view = $('.flickr-view');
    var $flickr_images = $('#flickr-images');
    var padding = $flickr_images.outerHeight() - $flickr_images.height();

    $flickr_view.height($(window).height() - $flickr_view.offset().top);
    $flickr_images.height($(window).height() - $flickr_images.offset().top - padding);
  };
}

/*
 * Map ViewModel
 */
function MapViewModel(data) {
  'use strict';
  var self = this;
  self.data = data;

  data.selectedLocation.subscribe(function(location) {
    // Close previous infoWindow
    self.infoWindow.close();

    // Update infoWindow content and position.
    var content = self.infoTemplate.replace('%img%', location.img).replace('%name%', location.name).
      replace('%suburb%', location.suburb).replace('%info%', location.info);

    // Ensure map & infoWindow are centred on location
    self.map.setCenter(location.marker.position);
    self.infoWindow.setContent(content);
    self.infoWindow.open(self.map, location.marker);
  });

  /*
   * Selects a given location
   */
  self.setSelected = function(location) {
    self.data.selectedLocation(location);
    google.maps.event.trigger(self.map, 'resize');
  };

  self.resize = function(resizeEvent) {
    var $map_view = $('.map-view');

    $map_view.height($(window).height() - $map_view.offset().top);

    if (window.mapBounds) {
      // If triggered by a resize event, we don't need to fire the event again.
      if (!resizeEvent) {
        google.maps.event.trigger(self.map, 'resize');
      }
      self.map.fitBounds(window.mapBounds);
      self.map.setCenter(window.mapBounds.getCenter());
      self.searchBox.setBounds(window.mapBounds);
    }
  };

  /*
   * Initialize the Google Map.
   */
  self.initializeMap = function() {

    var mapOptions = {
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.HYBRID
    };

    self.map = new google.maps.Map($('#map').get(0), mapOptions);
    self.infoWindow = new google.maps.InfoWindow();
    self.infoTemplate = $('#info-template').html();
    self.resize();

    var bounds = window.mapBounds = new google.maps.LatLngBounds();

    function pinLocation(ordinal, location) {

      location.marker = new google.maps.Marker({
        map: self.map,
        position: new google.maps.LatLng(location.lat, location.lng),
        icon: 'http://chart.apis.google.com/chart?chst=d_bubble_icon_text_small_withshadow&chld=swim|edge_bl|' + ordinal + '|74AAF7|fff',
        title: location.name
      });

      google.maps.event.addListener(location.marker, 'click', function() {
        location.select();
      });

      return location.marker.position;
    }

    var markers = [];
    var input = $('#search-box').get(0);
    self.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    self.searchBox = new google.maps.places.SearchBox(input);

    // Listen for the event fired when the user selects an item from the
    // search result list. Retrieve the matching places for that item.
    google.maps.event.addListener(self.searchBox, 'places_changed', function() {
      var places = self.searchBox.getPlaces();

      if (places.length === 0) {
        return;
      }
      for (var m = 0, marker; (marker = markers[m]) !== null; m++) {
        marker.setMap(null);
      }

      // For each place, get the icon, place name, and location.
      markers = [];
      var bounds = new google.maps.LatLngBounds();
      for (var p = 0, place; (place = places[p]) !== null; p++) {
        var image = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        marker = new google.maps.Marker({
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

    // Add map pin for each location
    var i = 1;
    ko.utils.arrayForEach(self.data.locationArray(), function(location) {
      bounds.extend(pinLocation(i, location));
      ++i;
    });

    // Ensure the map is resized.
    //google.maps.event.trigger(window, 'resize');
    self.resize();
    //google.maps.event.trigger(self.map, 'resize');

    // fit the map to the new marker and centre it.
    /*
    self.map.fitBounds(bounds);
    self.map.setCenter(bounds.getCenter());
    self.searchBox.setBounds(bounds); */
  };
}

function ListViewModel(data) {
  'use strict';
  var self = this;
  self.data = data;

  self.setSelected = function(location) {
    self.data.selectedLocation(location);
  };

  self.resize = function() {
    var $list_view = $('.list-view');
    $list_view.height($(window).height() - $list_view.offset().top);
 };
}

var locationsDataModel = new LocationsDataModel();
/*
 * View Models
 */
var flickrViewModel = new FlickrViewModel(locationsDataModel);
var mapViewModel = new MapViewModel(locationsDataModel);
var listViewModel = new ListViewModel(locationsDataModel);

var tabsViewModel = new TabsViewModel({
  flickr: flickrViewModel,
  list: listViewModel,
  map: mapViewModel
});

var viewModel = {
  data: locationsDataModel,
  tabs: tabsViewModel,
  flickr: flickrViewModel,
  map: mapViewModel,
  list: listViewModel
};

google.maps.event.addDomListener(window, 'load', function() {
  mapViewModel.initializeMap();
});

google.maps.event.addDomListener(window, 'resize', function(e) {
  tabsViewModel.resize(e);
});

