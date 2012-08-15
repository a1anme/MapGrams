(function () {
    var authToken, authorizeApp, circle, searchRadius, getToken, mappingTasks, redirectUrl, request, token, tokenCheck;

    circle = '';

    token = '';

    authToken = 0;

    searchRadius = 1300;

    redirectUrl = 'http://localhost/development/happenings/index.html';

    authorizeApp = function (user) {
        var clientId;
        clientId = '5d1ba596dc034a7a8895e309f5f2452f';
        return window.location.href = 'https://instagram.com/oauth/authorize/?client_id=' + clientId + '&redirect_uri=' + redirectUrl + '&response_type=token';
    };

    getToken = function () {
        return window.location.href.split('#access_token=')[1];
    };

    tokenCheck = function () {
        if (window.location.href.indexOf('access_token') > 0) {
            return token = getToken();
        }
        else {
            return authorizeApp();
        }
    };



    request = function (long, lat, clientId, photoLayer) {
        var uri;
        if (token) {
            uri = 'https://api.instagram.com/v1/media/search?lat=' + lat + '&lng=' + long + '&distance=' + searchRadius + '&access_token=' + token;
        }
        else {
            uri = 'https://api.instagram.com/v1/media/search?lat=' + lat + '&lng=' + long + '&distance=' + searchRadius + '&client_id=' + clientId;
        }
        return $.ajax({
            type: "GET",
            dataType: "jsonp",
            cache: true,
            url: uri,
            success: function (photos) {
   
                return _.each(photos.data, function (photo) {
                    var marker, photoTemplate;
                    if (photo.location) {

                        var MyIconType = L.Icon.extend({
                            options: {
                                iconUrl: photo.images.thumbnail.url,
                                shadowUrl: null,
                                iconSize: new L.Point(45, 45),
                                shadowSize: null,
                                iconAnchor: new L.Point(),
                                popupAnchor: new L.Point(20, 10),
                                className: 'photoIcon',
                                zIndexOffset: null,

                            }
                        });

                        var myIcon = new MyIconType();

                        marker = new L.Marker(new L.LatLng(photo.location.latitude, photo.location.longitude), {
                            icon: myIcon,

                        });

                        photoTemplate = _.template($("#popupTemplate").html(), {
                            photo: photo,


                        });

                        marker.bindPopup(photoTemplate);
                        photoLayer.addLayer(marker);

                    }
                });
            }
        });
    };
    



    mappingTasks = function () {
        var clientid, onMapClick, photoLayer, PhotoLayer, storyId;

        onMapClick = function (e) {

            if (!circle) {
                circle = new L.Circle(e.latlng, 2000, {
                    color: '#919191',
                    fill: false,
                    fillOpacity: 0,
                    weight: 1.5,
                    clickable: false
                });
                map.addLayer(circle);
            }
            else {
                circle.setLatLng(e.latlng);
            }
            return request(+e.latlng.lng.toFixed(2), e.latlng.lat.toFixed(2), clientId, photoLayer);
        };
      
        photoLayer = new L.LayerGroup();
        clientId = 'f62cd3b9e9a54a8fb18f7e122abc52df';
        var hash = new L.Hash();
        var bingGeocoder = new L.Control.BingGeocoder('AmFJ03ozVugKu0Y_uijzwvFEKfKY5VCesm1eiBqGhchxQ3uKFUQMYsKJLNdfHsIR');
        map.addControl(bingGeocoder);
        map.addLayer(photoLayer);
        hash.init(map);
        map.on('click', onMapClick);
        map.on("popupopen", function () {


            //Time since function

            date = new Date(parseInt($("#timeago").html()) * 1000);
            $('#timeago').text($.timeago(date));

            //Random background generator

            var colors = ["#E8D5DB", "#F0E8DD", "#F0FFEB", "#EBFDFF"];
            var rand = Math.floor(Math.random() * colors.length);
            $('.leaflet-popup-content-wrapper, .leaflet-popup-tip, .leaflet-popup-close-button').css("background-color", colors[rand]);

            //Slow animation function

            $('.leaflet-popup-pane').css('opacity', '0').css('margin-top', '0');
            return $('.leaflet-popup-pane').animate({
                opacity: 1,
                marginTop: '0'
            }, 500, function () {});
        });
    };

    $(document).ready(function () {
        mappingTasks();
        if (authToken === 1) {
            return tokenCheck();
        }
    });


}).call(this);