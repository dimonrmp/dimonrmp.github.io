// mapboxgl.accessToken = 'YOUR_MAPBOX_API_KEY'

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-71.104, 42.351],
    zoom: 12
});

var markers = [];
var route = null;
var stops = null;
var selectedRoute = "";
var routeTracking;

async function populateTheDropDownListOfRoutes() {
    let routes = [];

    const url = 'https://api-v3.mbta.com/routes';
    const response = await fetch(url);
    const json = await response.json();

    json.data.forEach(route => {
        routes.push({
            value: route.id,
            text: route.attributes.long_name === route.attributes.direction_destinations.join(" - ") ? route.attributes.long_name : route.attributes.long_name + ': ' + route.attributes.direction_destinations.join(' <=> ')
        })
    })

    const routeListSelect = document.getElementById("routesList");

    routes.forEach(route => {
        var option = document.createElement("option");
        option.value = route.value;
        option.text = route.text;
        routeListSelect.appendChild(option)
    })

}

async function getNewRoute(routeId) {
    if (routeId === "none") return;
    // get bus data    
    selectedRoute = routeId;
    route = await getRouteDetails();

    if (routeTracking) {
        clearInterval(routeTracking);
        routeTracking = null;
    }

    if (!routeTracking) {
        refreshLocations();
        routeTracking = setInterval(refreshLocations, 15000);
    }
}

async function refreshLocations() {
    const locations = await getBusLocations();

    markers.forEach(marker => {
        marker.remove();
    })

    markers.splice(0, markers.length);

    locations.forEach(location => {
        var marker = new mapboxgl.Marker()
            .setLngLat([location.attributes.longitude, location.attributes.latitude])
            .setPopup(
                new mapboxgl.Popup({ offset: 25 }) // add popups
                    .setHTML(
                        `<h3>${route.attributes.long_name}</h3>
								<p>
									<ul>
										<li>
											status: ${location.attributes.current_status}
										</li>
										<li>
											stop station: ${stops.find(s => s.id === location.relationships.stop.data?.id)?.attributes.name || ""}	
										</li>
									</ul>					
								</p>`
                    )
            )
            .addTo(map);
        markers.push(marker);
    });

    // routeTracking();
}

// Request bus data from MBTA
async function getBusLocations() {
    if (!selectedRoute) return [];
    const url = `https://api-v3.mbta.com/vehicles?filter[route]=${selectedRoute}&include=trip`;
    const response = await fetch(url);
    const json = await response.json();
    return json.data;
}

async function getRouteDetails() {
    const url = 'https://api-v3.mbta.com/routes/' + selectedRoute;
    const response = await fetch(url);
    const json = await response.json();
    return json.data;
}

async function getStopDetails() {
    const url = 'https://api-v3.mbta.com/stops';
    const response = await fetch(url);
    const json = await response.json();
    stops = json.data;
}


populateTheDropDownListOfRoutes();
getStopDetails();
