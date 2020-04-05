const CACHE_NAME = "mysite-static-v2020-04-05 22:13:13";

// Files to cache
var appShellFiles = [
    '/','datenschutzerklaerung/','impressum/','lizenz/','mitmachen/','online-covid-19-tests/','welche-live-blogs-gibt-es/','welche-tracking-apps-gibt-es/','wo-gibt-es-aktuelle-statistiken/',
    '/assets/js/main.js',
    '/assets/fonts/specimen/MaterialIcons-Regular.woff2',
    '/assets/fonts/specimen/MaterialIcons-Regular.woff',
    '/assets/fonts/specimen/MaterialIcons-Regular.ttf',
    '/assets/fonts/specimen/FontAwesome.woff2',
    '/assets/fonts/specimen/FontAwesome.woff',
    '/assets/fonts/specimen/FontAwesome.ttf',
    '/assets/images/192.png',
    '/assets/images/512.png',
    "./assets/stylesheets/application.adb8469c.css",
    "./assets/stylesheets/application-palette.a8b3c06d.css",
    "./assets/javascripts/modernizr.86422ebf.js",
    "./assets/fonts/material-icons.css",
    "./assets/javascripts/application.c33a9706.js",
    "./assets/javascripts/lunr/lunr.stemmer.support.js",
    "./assets/javascripts/lunr/lunr.de.js",
    "./assets/images/favicon.png",
];

var contentToCache = appShellFiles.concat([]);

// Installing Service Worker
self.addEventListener('install', function(e) {
    console.log('[Service Worker] Install with cache ' + CACHE_NAME);
    e.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            console.log('[Service Worker] Caching all: app shell and content');
            return cache.addAll(contentToCache).then(function (response) {
                console.log('[Service Worker] Added all to cache', response);

                caches.keys().then((keyList) => {
                    return Promise.all(keyList.map((key) => {
                        if (key !== CACHE_NAME) {
                            console.log('[ServiceWorker] Removing old cache', key);
                            return caches.delete(key);
                        }
                    }));
                })
            });
        })
    );
});

// Fetching content using Service Worker
self.addEventListener('fetch', function(e) {
    console.log('[Service Worker] does it match cache to fetch resource:'+e.request.url);
    e.respondWith(
        caches.match(e.request).then(function(r) {
            console.log('[Service Worker] Fetching resource: '+e.request.url);
            return r || fetch(e.request).then(function(response) {
                return caches.open(CACHE_NAME).then(function(cache) {
                    console.log('[Service Worker] Caching new resource: ' + e.request.url);
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    );
});