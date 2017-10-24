function initMap() {
    var uluru = {lat: -26.294500, lng: 28.086508};
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 7,
      center: uluru
    });
    var marker = new google.maps.Marker({
      position: uluru,
      map: map
    });
  }