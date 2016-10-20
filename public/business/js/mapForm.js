var mapForm = function(config) {

    var mF = div().cl('mapForm');

    mF.props({
        markers: [],
        geoDrops: {},
        clearMarkers: function() {

            mF.markers.forEach(function(markerSet) {

                markerSet.marker.setMap(null);
                marker = null;

            })

            mF.markers = [];

        },
        resize: function() {

            google.maps.event.trigger(mF.map, 'resize');

            setTimeout(function() {

                google.maps.event.trigger(mF.map, 'resize');

            }, 1500)

            return mF;
        },
        addCustomMarker: function(latlng, args) {

            var nvMark = new CustomFormMarker(latlng, mF.map, args);

            mF.markers.push({
                name: args.name,
                nvMark: nvMark,
                marker: marker
            })

            return mF;
        },
        addMarker: function(latlng, args) {

            mF.markers.push({
                marker: new google.maps.Marker({
                    map: mF.map,
                    position: latlng,
                    icon: {
                        url: 'http://maps.gstatic.com/mapfiles/circle.png',
                        anchor: new google.maps.Point(10, 10),
                        scaledSize: new google.maps.Size(10, 17)
                    }
                })
            })

            return mF;
        },
        getGeo: function(name) {

            getgeo(function(geo) {

                mF.geoDrops[name](geo, mF);

            }); //getgeo

            return mF;

        },
        setMap: function(mapConfig) {
            mF.map = new google.maps.Map(mF, mapConfig);
            return mF;
        },
        geoPeat: function(ray, config) {

            ray.forEach(function(rayLet) {

                var latlng = rayLet[config.tag]

                mF.geoDrops[config.drop](latlng, mF);

            });

        },
        onGeo: function(name, calli) {

            mF.geoDrops[name] = calli;

            return mF;
        }
    })

    return mF;
}

var mapFormTest = function() {

        var jMap = mapForm();

        jMap.onGeo('initGeo', function(geo, mF) {

            mF.setMap({
                center: new google.maps.LatLng(geo.lat, geo.lng),
                zoom: 13,
                mapTypeControl: false,
            }).resize().onGeo('cloudMarker', function(geo, mF) {

                mF.addCustomMarker(mF.map, new google.maps.LatLng(geo.lat, geo.lng), {

                    layout: div()

                })

            }).geoPeat([{ geo: new google.maps.LatLng(geo.lat, geo.lng) }], {
                tag: 'geo',
                drop: 'cloudMarker'
            })

        }).getGeo('initGeo')

    } //mapFormTest


/*function CustomFormMarker(latlng, map, args) {
    this.latlng = latlng;
    this.args = args;
    this.setMap(map);
}

CustomFormMarker.prototype = new google.maps.OverlayView();

CustomFormMarker.prototype.draw = function() {

    var self = this;

    var div = this.div;

    if (!div) {

        div = this.div = self.args.layout;

        div.style.zIndex = "1"

        if (typeof(self.args.marker_id) !== 'undefined') {
            div.dataset.marker_id = self.args.marker_id;
        }

        google.maps.event.addDomListener(div, "click", function(event) {

            //google.maps.event.trigger(self, "click");
        });

        var panes = this.getPanes();
        panes.overlayImage.appendChild(div);
    }

    var point = this.getProjection().fromLatLngToDivPixel(this.latlng);

    if (point) {
        div.style.left = (point.x) + 'px';
        div.style.top = (point.y) + 'px';
    }
};

CustomFormMarker.prototype.remove = function() {
    if (this.div) {
        this.div.parentNode.removeChild(this.div);
        this.div = null;
    }
};

CustomFormMarker.prototype.getPosition = function() {
    return this.latlng;
};*/
