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

  self.locations = [
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
}

function LocationsViewModel(data) {
  'use strict';
  var self = this;

  self.selectedLocation = ko.observable();

  self.filterText = ko.observable('');

  self.locationArray = ko.pureComputed(function() {
    var locations = data.locations;
    var filterText = self.filterText().toLowerCase();
    var includeAll = filterText.length === 0;
    /* Include locations if start of name or suburb matches the filter text */
    return ko.utils.arrayFilter(locations, function(location) {
      return (includeAll ||
        ko.utils.stringStartsWith(location.name.toLowerCase(), filterText) ||
        ko.utils.stringStartsWith(location.suburb.toLowerCase(), filterText));
    });
  }).extend( { throttle: 100 });

  self.displayFlickr = function() {
    window.location.href = '#flickr';
    flickrViewModel.resize();
  };

  self.selectLocation = function() {
    var oldLocation = self.selectedLocation();
    if (oldLocation) {
      // Clean up the previous selection.
      oldLocation.selected(false);
    }
    this.selected(true);
    self.selectedLocation(this);
  }

  self.setSelected = function(location) {
    self.selectedLocation(location);
  };

  self.resize = function() {
    var $list = $('#location-list');
    $list.height($(window).height() - $list.offset().top);
    /*
    // Return right coordinate.
    return $list.offset().left + $list.width(); */
  };

  self.topRight = function() {
    var $list = $('#location-list');
    var offset = $list.offset();

    // TODO: Avoid referencing $list
    if (offset.left < 0) {
      offset.left = 0;
    }
    else
    {
      offset.left = $list.width() + 1;
    }
    return offset;
  }

  // Add extra info for for each location
  for (var i in data.locations) {
    var location = data.locations[i];

    location.ordinal = Number(i) + 1;
    location.selected = ko.observable(false);
    location.parent = self;
    location.select = self.selectLocation.bind(location);
  }

  // Force initial sizing.
  self.resize();
}

/*
 * Map ViewModel
 */
function MapViewModel(viewModel) {
  'use strict';

  var self = this;
  self.viewModel = viewModel;

  google.maps.event.addDomListener(window, 'load', function() {
    self.initializeMap();
  });

  viewModel.selectedLocation.subscribe(function(location) {
    // Close previous infoWindow
    self.infoWindow.close();

    // Ensure map & infoWindow are centred on location
    self.map.setCenter(location.marker.position);
    self.infoWindow.open(self.map, location.marker);
  });

  /*
   * Initialize the Google Map.
   */
  self.initializeMap = function() {

    var mapOptions = {
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.HYBRID
    };

    self.map = new google.maps.Map($('#map').get(0), mapOptions);

    self.infoWindow = new google.maps.InfoWindow({
      content: $('#info-template').html()
    });

    google.maps.event.addListener(self.infoWindow, 'domready', function() {
      // Need to apply bindings after DOM is ready, but only once.
      if (!self.initialized) {
        ko.applyBindings(self.viewModel, document.getElementById("info-window"));
        self.initialized = true;
      }
    });

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

    // Add map pin for each location
    // NB: Cache locations to make it easy to handle filtering.
    self.locations = self.viewModel.locationArray();
    var i = 1;
    ko.utils.arrayForEach(self.locations, function(location) {
      bounds.extend(pinLocation(i, location));
      ++i;
    });

    self.viewModel.locationArray.subscribe(function(filteredLocations) {
      // Remove map from all locations which have been filtered out.
      for (var l = 0, nLocation = self.locations.length; l < nLocation; l++) {
        var location = self.locations[l];
        var map = ko.utils.arrayFirst(filteredLocations, function(loc) { return loc.ordinal === location.ordinal; }) ? self.map : null;
        location.marker.setMap(map);
      }
    });

    // Ensure the map is resized.
    self.resize();
  };

  /*
   * Selects a given location
   */
  self.setSelected = function(location) {
    self.viewModel.selectedLocation(location);
    google.maps.event.trigger(self.map, 'resize');
  };

  self.resize = function(resizeEvent) {
    var $map_view = $('.map-view');
    var offset = viewModel.topRight();

    $map_view.offset(offset);
    $map_view.height($(window).height() - offset.top);
    $map_view.width($(window).width() - offset.left);

    if (window.mapBounds) {
      // If triggered by a resize event, we don't need to fire the event again.
      if (!resizeEvent) {
        google.maps.event.trigger(self.map, 'resize');
      }
      self.map.fitBounds(window.mapBounds);
      self.map.setCenter(window.mapBounds.getCenter());
    }
  };
}

/**
 * FlickrViewModel
 */
function FlickrViewModel(viewModel) {
  'use strict';
  var self = this;

  self.imageArray = ko.observableArray([]);
  self.viewModel = viewModel;

  self.flickr = new Flickr({
    api_key: '562af0fb090c53b310b934fef0c87a7d'
  });

  self.currentWidth = function() {
    return Number($('#flickr-view').css('width').slice(0, -2));
  }

  self.triggerResize = ko.observable();

  // Create observable so we can adjust as screen resizes.
  self.sizeCode = ko.computed(function() {
    // Image size should be based on size of #flickr-view
    self.triggerResize();

    var width = self.currentWidth();
    var sizeCode = 's'; // s: 75 x 75
    if (width >= 650) {
      sizeCode = 'z'; // z: 640 on longest side
    } else if (width >= 250) {
      sizeCode = 'm'; // m: 240 on longest side
    } else if (width >= 110) {
      sizeCode = 't'; // t: 100 on longest side
    }
    return sizeCode;
  });

  viewModel.selectedLocation.subscribe(function(location) {

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
         var imageInfo = [];
        for (var i in result.photos.photo) {
          var photo = result.photos.photo[i];
          var info = {
            url: ko.observable('https://www.flickr.com/photos/' + photo.owner + '/' + photo.id),
            src: ko.computed(function() {
              return 'https://farm' + this.farm + '.staticflickr.com/' + this.server + '/' +
                this.id + '_' + this.secret + '_' + self.sizeCode() + '.jpg';
            }, photo)
          };
          imageInfo.push(info);
        }
        ko.utils.arrayPushAll(self.imageArray, imageInfo);
        self.imageArray.valueHasMutated();
      }
    });
  });

  self.resize = function() {
    var $flickr_view = $('#flickr-view');
    var $flickr_images = $('#flickr-images');

    var padding = $flickr_images.outerHeight() - $flickr_images.height();
    var viewOffset = $flickr_view.offset().top;
    var imageOffset = $flickr_images.offset().top;
    var height = $(window).height() - 2 * viewOffset;

    $flickr_view.height(height);
    $flickr_images.height(height - imageOffset + viewOffset);
    // Trigger image resizing.
    self.triggerResize.notifySubscribers();
  };
}


/*
 * Data Model
 */
var locationsDataModel = new LocationsDataModel();

/*
 * View Models
 */
var locationsViewModel = new LocationsViewModel(locationsDataModel);
var mapViewModel = new MapViewModel(locationsViewModel);
var flickrViewModel = new FlickrViewModel(locationsViewModel);

google.maps.event.addDomListener(window, 'resize', function(e) {
  locationsViewModel.resize();
  mapViewModel.resize(e);
  flickrViewModel.resize();
});


/*
 * Open the drawer when the menu icon is clicked.
 */
var menu = document.querySelector('#menu');
var main = document.querySelector('main');
var drawer = document.querySelector('.nav');

menu.addEventListener('click', function(e) {
  drawer.classList.toggle('open');
  e.stopPropagation();
});
main.addEventListener('click', function() {
  drawer.classList.remove('open');
});

$('#close').click(function() {
  window.history.back();
});

