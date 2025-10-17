// Plantilla básica para un service worker;


// Nombre del sw y los archivos a cachear;
const CACHE_NAME = "aromantial"
const BASE_PATH = "pwa-practice/";
const urlsToCache = [ 
    `${BASE_PATH}index.html`,
    `${BASE_PATH}style.css`,
    `${BASE_PATH}app.js`,
    `${BASE_PATH}offline.html`,
    `${BASE_PATH}login.html`,
    `${BASE_PATH}icons/apple-touch-icon.png`,
    `${BASE_PATH}icons/icon-96x96.png`,
    `${BASE_PATH}icons/icon-192x192.png`,
    `${BASE_PATH}icons/icon-512x512.png`,
];

// 2. INSTALL -> Se ejecuta al intstalar el service worker;
// se cachean los recursos base de la PWA;

self.addEventListener("install", event => {
    console.log("Service worker instalandose")
        event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

// 3. Activate => Se ejecuta al activar el service worker;
// borrar caché viejo para solo mantener la más reciente;

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => 
            Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                .map(key => caches.delete(key))
            )
        )
    );
});

// 4. Fetch intercepta las peticiones de la app web
// y responde con los recursos cacheados si están disponibles;
// Si no, intenta hacer la petición a la red;
// en caso de falla muestra la página offline;
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).catch(() => caches.match('offline.html'))
        })
    )
})

// 5. Push => Notificaciones en segundo plano
// manejo de notificaciones push opcional
self.addEventListener("push", event => {
    const data = event.data ? event.data.text() : "Notificación sin texto";
    event.waitUntil(
        self.ServiceWorkerRegistration.showNotification("Mi PWA", {body: data})
    )
})