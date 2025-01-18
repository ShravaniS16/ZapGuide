document.addEventListener('DOMContentLoaded', () => {
    const mapOptions = {
        center: { lat: 19.079, lng: 72.860 }, // Center on Vidyavihar
        zoom: 15,
    };

    const map = new google.maps.Map(document.getElementById('map'), mapOptions);

    new google.maps.Marker({
        position: mapOptions.center,
        map: map,
        title: 'Vidyavihar, KJ Somaiya College of Engineering'
    });
});
