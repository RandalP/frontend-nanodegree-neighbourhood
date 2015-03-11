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

/**
 * Locations DataModel.
 * @constructor
 */
function LocationsDataModel() {
  'use strict';
  var self = this;

  self.locations = [
    {
      name: "Wally Weekes Pool",
      suburb: "North Bondi",
      img: "img/Wally-Weekes.png",
      rockPool: true,
      info: "A very popular pool to take the kids as it’s a tidal pool that was transformed into a rock pool.",
      lat: -33.891492,
      lng: 151.282316
    },
    {
      name: "Bondi Baths",
      suburb: "Bondi",
      img: "img/Bondi-Baths.png",
      rockPool: false,
      info: "The Bondi Baths are the home of the Bondi Icebergs Winter Swimming Club and is located at the southern end of Bondi Beach and have been a land mark for over 100 years.",
      lat: -33.895028,
      lng: 151.274570
    },
    {
      name: "Bronte Baths",
      suburb: "Bronte",
      img: "img/Bronte-Baths.png",
      rockPool: true,
      info: "Probably the most photographed of all of Sydney’s rock pools. Just along the Southern Coastal Walk. Bronte park as working bbqs a wonderful place to go for a evening swim then bbq with friends afterwards.",
      lat: -33.905049,
      lng: 151.269079
    },
    {
      name: "Clovelly Ocean Pool",
      suburb: "Clovelly",
      img: "img/Clovelly-Pool.png",
      rockPool: false,
      info: "A saltwater lap pool located next to Clovelly Beach on the concrete promenade.",
      lat: -33.914189,
      lng: 151.266941
    },
    {
      name: "Giles Baths",
      suburb: "Coogee",
      img: "img/Giles-Baths.png",
      rockPool: true,
      info: "A popular swimming hole with young people and a fun place to explore from Coogee Beach. It’s located at the foot of the northern headland.",
      lat: -33.920017,
      lng: 151.260641
    },
    {
      name: "Ross Jones Memorial Pool",
      suburb: "Coogee",
      img: "img/Ross-Jones.png",
      rockPool: false,
      info: "Located at the southern end of Coogee Beach, this man-made ocean pool is lots of fun for the family and gets crowded on a hot summer’s day.",
      lat: -33.922878,
      lng: 151.257858
    },
    {
      name: "McIver's Baths",
      suburb: "Coogee",
      img: "img/McIvers.png",
      rockPool: false,
      info: "The last remaining women’s-only seawater baths in Australia. There's a large concrete sea pool, brick sunbathing area, amenities block, change rooms and small clubhouse.",
      lat: -33.924103,
      lng: 151.258390
    },
    {
      name: "Wylie's Bath",
      suburb: "Coogee",
      img: "img/Wylies.png",
      rockPool: false,
      info: "An iconic sight on the Coogee ocean landscape, Wylies Baths was built in 1907 and enjoys stunning views across Coogee Bay.",
      lat: -33.925476,
      lng: 151.259100
    },
    {
      name: "Ivor Rowe Rockpool",
      suburb: "South Coogee",
      img: "img/Ivor-Rowe.png",
      rockPool: true,
      info: "One of the smallest ocean pools along the Coastal Walkway. It is a natural, shallow rock pool and perfect for wading or cooling down on a hot day.",
      lat: -33.933177,
      lng: 151.261701
    },
    {
      name: "Mahon Pool",
      suburb: "Maroubra",
      img: "img/Mahon-Pool.png",
      rockPool: true,
      info: "The Mahon rock pool is located to the north of Maroubra Beach at the base of Jack Vanny Reserve. The exposed rock outcrops and cliffs above make it a spectacular venue and it is the home of the Maroubra Seals Winter Swimming Club.",
      lat: -33.942808,
      lng: 151.263836
    },
    {
      name: "Malabar Pool",
      suburb: "Malabar",
      img: "img/Malabar-Ocean-Pool.png",
      rockPool: false,
      info: "Malabar Ocean Pool is located near Malabar Beach in Long Bay directly below Randwick Golf Club. It has spectacular views over Long Bay and onto the Randwick Rifle Range.",
      lat: -33.968516,
      lng: 151.254552
    }
  ];
}

/**
 * View model for the list of locations.
 * @constructor
 * @param {Object} data - the LocationsDataModel.
 */
function LocationsViewModel(data) {
  'use strict';
  var self = this;

  self.data = data;

  // Current selected location
  self.selectedLocation = ko.observable();

  // Filtering functionality
  self.filterText = ko.observable('');
  self.rockPool = ko.observable(true);
  self.manMade = ko.observable(true);

  // List of locations currently unfiltered.
  self.locationArray = ko.pureComputed(function() {
    var locations = data.locations;
    var filterText = self.filterText().toLowerCase();
    var noTextSearch = filterText.length === 0;

    // Filter based on name and then type (rockPool/manMade)
    // Include locations if start of name or suburb matches the filter text
    return ko.utils.arrayFilter(locations, function(location) {
      return (noTextSearch ||
                location.name.toLowerCase().indexOf(filterText) >= 0 ||
                location.suburb.toLowerCase().indexOf(filterText) >= 0) &&
              ((self.rockPool() && location.rockPool) ||
               (self.manMade() && !location.rockPool));
    });
  }).extend( { throttle: 100 });

  /**
   * Selects the specified location.
   * @method LocationsViewModel#setSelected
   * @param {Object} location - the location to select.
   */
  self.setSelected = function(location) {
    var oldLocation = self.selectedLocation();
    if (oldLocation) {
      // Clean up the previous selection.
      oldLocation.selected(false);
    }
    location.selected(true);
    self.selectedLocation(location);
  };

  /**
   * Resizes the location list appropriately.
   * @method LocationsViewModel#resize
   */
  self.resize = function() {
    var $list = $('#location-list');
    $list.height($(window).height() - $list.offset().top);
  };

  /**
   * Returns the position of the list's top right corner.
   * @method LocationsViewModel#topRight
   * @returns {number} The top right of the list.
   */
  self.topRight = function() {
    var $list = $('#location-list');
    var offset = $list.offset();

    // Now that list has been sized, make the search match.
    $('#search').width($list.width() - 5);
    if (offset.left < 0) {
      offset.left = 0;
    } else {
      offset.left = $list.width() + 1;
    }
    return offset;
  };

  /*
   * Selects the currently bound location.
   */
  var selectLocation = function() {
    self.setSelected(this);
  };

  // Add extra info for for each location
  for (var i in data.locations) {
    var location = data.locations[i];

    location.ordinal = Number(i) + 1;
    location.selected = ko.observable(false);
    location.parent = self;
    location.select = selectLocation.bind(location);
  }

  // Force initial sizing.
  self.resize();
}

/**
 * Map ViewModel.
 * @constructor
 * @param {Object} viewModel - the LocationsViewModel
 */
function MapViewModel(viewModel) {
  'use strict';

  var self = this;
  self.viewModel = viewModel;

  // For convenience
  self.selectedLocation = self.viewModel.selectedLocation;

  // Suscribe to changes in selected location to update marker and info window.
  viewModel.selectedLocation.subscribe(function(location) {
    // Close previous infoWindow
    self.infoWindow.close();

    // Ensure map & infoWindow are centred on location
    self.map.setCenter(location.marker.position);
    // Bounce once if selected
    location.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      location.marker.setAnimation(null);
    }, 700);
    self.infoWindow.open(self.map, location.marker);
  });

  /**
   * Launch the flickr dialog.
   * @method LocationsViewModel#displayFlickr
   */
  self.displayFlickr = function() {
    window.location.href = '#flickr';
    flickrViewModel.resize();
  };

  /**
   * Launch the weather dialog.
   * @method LocationsViewModel#displayWeather
   */
  self.displayWeather = function() {
    window.location.href = '#weather';
    weatherViewModel.resize();
  };

  /**
   * Initializes the Google Map with markers and info window.
   * @method MapViewModel#initializeMap
   */
  self.initializeMap = function() {

    var mapOptions = {
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.HYBRID
    };

    self.map = new google.maps.Map($('#map').get(0), mapOptions);

    // Load template into info window.
    self.infoWindow = new google.maps.InfoWindow({
      content: $('#info-template').html()
    });

    google.maps.event.addListener(self.infoWindow, 'domready', function() {
      // Need to apply bindings after DOM is ready, but only once.
      if (!self.initialized) {
        ko.applyBindings(self, document.getElementById("info-window"));
        self.initialized = true;
      }
    });

    var bounds = window.mapBounds = new google.maps.LatLngBounds();

    // Place a pin at the specified location.
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

    // Subscribe to changes in locationArray so we can respond to filtering.
    self.viewModel.locationArray.subscribe(function(filteredLocations) {
      function matchLocation(loc) {
        /* jshint validthis:true */
        return (loc.ordinal === this.ordinal);
      }

      // Remove map from all locations which have been filtered out.
      for (var l = 0, nLocation = self.locations.length; l < nLocation; l++) {
        var location = self.locations[l];
        var map = ko.utils.arrayFirst(filteredLocations, matchLocation.bind(location)) ? self.map : null;
        location.marker.setMap(map);
      }
    });

    // Ensure the map is resized.
    self.resize();
  };

  /**
   * Selects the specified location.
   * @method MapViewModel#setSelected
   * @param {Object} location - the location to select.
   */
  self.setSelected = function(location) {
    self.viewModel.setSelected(location);
    google.maps.event.trigger(self.map, 'resize');
  };

  /**
   * Resizes the map displayed in the browser and sets both the bounds and center.
   * @method MapViewModel#resize
   * @param {Object} [resizeEvent] - an event, if triggered by browser resizing.
   */
  self.resize = function(resizeEvent) {
    var $map_view = $('.map-view');
    var offset = viewModel.topRight();

    $map_view.offset(offset);
    $map_view.height($(window).height() - offset.top);
    $map_view.width($(window).width() - offset.left);

    if (window.mapBounds) {
      // If triggered by a resize event, we don't need to fire the event again.
      // The rest of the time, we're using this to trick the map into redrawing properly.
      if (!resizeEvent) {
        google.maps.event.trigger(self.map, 'resize');
      }
      self.map.fitBounds(window.mapBounds);
      self.map.setCenter(window.mapBounds.getCenter());
    }
  };

  $(window).load(function() {
    // Defer initialization of map until DOM is loaded.
    if (typeof(google) !== 'undefined') {
      self.initializeMap();
    } else {
      self.resize();
    }
  });
}

/**
 * Flickr image ViewModel.
 * @constructor
 * @param {Object} viewModel - the LocationsViewModel
 */
function FlickrViewModel(viewModel) {
  'use strict';
  var self = this;

  self.viewModel = viewModel;
  self.imageArray = ko.observableArray([]);

  self.errorMessage = ko.observable('');
  self.flickr = new Flickr({
    api_key: '562af0fb090c53b310b934fef0c87a7d'
  });

  /**
   * Calculates the current width of the div containing the images.
   * @method FlickrViewModel#currentWidth
   * @returns {number} The current width of #flickr-view.
   */
  self.currentWidth = function() {
    return Number($('#flickr-view').css('width').slice(0, -2));
  };

  // Flag used to force resizing of flickr image source.
  self.triggerResize = ko.observable();

  // Contains the code used to determine flickr image sizes in the source strings.
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

  // Subscribe to currently selected location to trigger ajax request.
  viewModel.selectedLocation.subscribe(function(location) {

    self.imageArray.removeAll();

    self.flickr.photos.search({
      text: location.name,
      lat: location.lat,
      lon: location.lng,
      radius: 0.5,
      geocontext: 2 // outdoors
    }, function(err, result) {

      function getSrc() {
        /* jshint validthis:true */
        return 'https://farm' + this.farm + '.staticflickr.com/' + this.server + '/' +
          this.id + '_' + this.secret + '_' + self.sizeCode() + '.jpg';
      }

      if (err) {
        self.errorMessage('Failed to load Flickr images.');
      } else {
        // Clear error
        self.errorMessage('');

        var imageInfo = [];
        for (var i in result.photos.photo) {
          var photo = result.photos.photo[i];

          var info = {
            url: ko.observable('https://www.flickr.com/photos/' + photo.owner + '/' + photo.id),
            src: ko.computed(getSrc, photo)
          };
          imageInfo.push(info);
        }
        // Update array in one operation for efficiency.
        ko.utils.arrayPushAll(self.imageArray, imageInfo);
        self.imageArray.valueHasMutated();
      }
    });
  });

  /**
   * Resizes the dialog box display.
   * @method FlickrViewModel#resize
   */
  self.resize = function() {
    if (self.errorMessage().length === 0) {
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
    }
  };
}

/**
 * Weather info ViewModel.
 * @constructor
 * @param {Object} viewModel - the LocationsViewModel
 */
function WeatherViewModel(viewModel) {
  'use strict';
  var self = this;

  self.viewModel = viewModel;

  self.errorMessage = ko.observable('');

  self.temperature = ko.observable();
  self.apparentTemperature = ko.observable();
  self.dewPoint = ko.observable();
  self.humidity = ko.observable();
  self.pressure = ko.observable();
  self.summary = ko.observable();
  self.time = ko.observable();
  self.precipProbability = ko.observable();
  self.imgSrc = ko.observable();
  self.nextDay = ko.observable();
  self.nextWeek = ko.observable();

  // Subscribe to change in selected location to trigger ajax request.
  viewModel.selectedLocation.subscribe(function(location) {

    var requestTimeout = setTimeout(function() {
        self.errorMessage('Failed to retrieve weather information');
    }, 500);

    $.ajax({
      url: 'https:///api.forecast.io/forecast/2e2344aac39eeec30969f17aff17d447/' + location.lat + ',' + location.lng +
        '?units=auto&exclude=minutely,alerts',
      dataType: 'jsonp',
      success: function(data) {

        // Clear error
        self.errorMessage('');

        var imperial = (data.flags.units === 'us');
        var temperatureUnits = '°C';
        var pressureUnits = 'hPa';

        if (imperial) {
          temperatureUnits = '°F';
          pressureUnits = 'mb';
        }
        var currently = data.currently;

        // Convert the provided number string to a temperature string.
        function toTemperature(number) {
          return number.toFixed(1) + temperatureUnits;
        }

        // Convert the provided number string to a percentage string.
        function toPercentage(number) {
          return number.toFixed(2) * 100.0 + '%';
        }

        self.imgSrc('img/' + currently.icon + '.png');
        self.temperature(toTemperature(currently.temperature));
        self.summary(currently.summary);
        self.apparentTemperature(toTemperature(currently.apparentTemperature));
        self.humidity(toPercentage(currently.humidity));
        self.dewPoint(toTemperature(currently.dewPoint));
        self.precipProbability(toPercentage(currently.precipProbability));
        self.pressure(currently.pressure.toFixed(0) + pressureUnits);

        var dt = new Date();
        dt.setTime(Number(currently.time) * 1000);
        self.time(dt.toDateString() + ' ' + dt.toLocaleTimeString());

        self.nextDay(data.hourly.summary);
        self.nextWeek(data.daily.summary);
      }
    });
  });

  /**
   *  Resizes the weather dialog.
   * @method WeatherViewModel#resize
   */
  self.resize = function() {
  };
}

/**
 * Locations Data Model.
 * @global
 */
var locationsDataModel = new LocationsDataModel();

/**
 * Locations View Model
 * @global
 */

var locationsViewModel = new LocationsViewModel(locationsDataModel);
/**
 * Map View Model
 * @global
 */

var mapViewModel = new MapViewModel(locationsViewModel);
/**
 * Flickr View Model
 * @global
 */
var flickrViewModel = new FlickrViewModel(locationsViewModel);

/**
 * Weather View Model
 * @global
 */
var weatherViewModel = new WeatherViewModel(locationsViewModel);

/*
 * Subscribe to window resize events and propagate to view models.
 */
$(window).resize(true, function(e) {
  locationsViewModel.resize();
  mapViewModel.resize(e);
  flickrViewModel.resize();
  weatherViewModel.resize();
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

$('#close-flickr').click(function() {
  window.history.back();
});

$('#close-weather').click(function() {
  window.history.back();
});

/*
 * Apply Knockout bindings.
 */
ko.applyBindings(locationsViewModel, document.getElementById("header"));
ko.applyBindings(locationsViewModel, document.getElementById("location-list"));
ko.applyBindings(flickrViewModel, document.getElementById("flickr"));
ko.applyBindings(weatherViewModel, document.getElementById("weather"));
