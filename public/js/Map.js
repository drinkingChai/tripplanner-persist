function Map(id){
  this.id = id;
  this.init();
  this.markers = [];
}

Map.prototype.setMarkers = function(day){
  this.markers.forEach(function(marker){
    marker.setMap(null);
  });

  this.markers = ['hotels', 'restaurants', 'activities'].reduce(function(memo, key){
    var _markers = day[key].map(function(item){
      var location = item.place.location;
      var latlng = new google.maps.LatLng(location[0], location[1]);
      return new google.maps.Marker({
          position: latlng,
          title: item.name
      });
    });
    memo = memo.concat(_markers);
    return memo;
  }, []);

  var that = this;
  var bounds = new google.maps.LatLngBounds();
  this.markers.forEach(function(marker){
    bounds.extend(marker.position);
    marker.setMap(that.map);
  });

  if(this.markers.length){
    this.map.fitBounds(bounds);
  }
};

Map.prototype.init = function(){
  var myLatlng = new google.maps.LatLng(40.705189,-74.009209);
  // set the map options hash
  var mapOptions = {
      center: myLatlng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  // get the maps div's HTML obj
  var map_canvas_obj = document.getElementById(this.id);
  // initialize a new Google Map with the options
  this.map = new google.maps.Map(map_canvas_obj, mapOptions);
  // Add the marker to the map
  var marker = new google.maps.Marker({
      position: myLatlng,
      title:"Hello World!"
  });
  // Add the marker to the map by calling setMap()
  marker.setMap(this.map);

}
