/**
 * Common database helper functions.
 */
class DBHelper {

  /**
   * API URL.
   * Server Address to make API request.
   */
  static get API_URL() {
    const port = 1337 // Change this to your server port
    return `http://localhost:${port}/restaurants`;
  }

  static openDatabase() {
    // If the browser doesn't support service worker,
    // we don't care about having a database
    if (!navigator.serviceWorker) {
      return Promise.resolve();
    }

    return idb.open('restaurants', 1, function (upgradeDb) {
      var store = upgradeDb.createObjectStore('restaurants', {
        keyPath: 'id'
      });
    });
  }

  /**
   * Fetch all restaurants from indexDB.
   */
  static getRestaurantsFromIDB() {
    var dbPromise = this.openDatabase();
    return dbPromise.then((db) => {
      var tx = db.transaction('restaurants');
      var restaurantStore = tx.objectStore('restaurants');
      var gal = restaurantStore.getAll();
      return gal;
    })
  }

  /**
   * Fetch restaurant from indexDB by id.
   */
  static getRestaurantsByIdFromIDB(restaurantId) {
    var dbPromise = this.openDatabase();
    return dbPromise.then((db) => {
      var tx = db.transaction('restaurants');
      var restaurantStore = tx.objectStore('restaurants');
      var gal = restaurantStore.get(restaurantId);
      return gal;
      
    })
  }

  /**
   * Insert all restaurants to indexDB.
   */
  static saveRestaurantsToIDB(restaurants) {
    var dbPromise = this.openDatabase();
    return dbPromise.then((db) => {
      var tx = db.transaction('restaurants', 'readwrite');
      var restaurantStore = tx.objectStore('restaurants');
      restaurants.forEach(restaurant => {
        restaurantStore.put(restaurant);
      })
    })
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    this.getRestaurantsFromIDB().then((restaurants) => {
      if (restaurants.length === 0) {
        fetch(this.API_URL, { credentials: 'same-origin' }).then((response) => {
          return response.json()
        }).then((restaurants) => {
          this.saveRestaurantsToIDB(restaurants);
          callback(null, restaurants);
        }).catch(error => {
          callback(error);
        })
      } else {
        callback(null, restaurants);
      }
    })



  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {

    //getting by id cause not satisfy the progressive web


    // this.getRestaurantsByIdFromIDB(id).then((restaurant) => {
    //   if (!restaurant) {
    //     fetch(`${this.API_URL}/${id}`).then((response) => {
    //       return response.json()
    //     }).then((restaurant) => {
    //       callback(null, restaurant);
    //     }).catch(error => {
    //       callback(error);
    //     })
    //   } else {
    //     callback(null, restaurant);
    //   }
    // });


    //move to get all restaurants from api
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        var restaurant = restaurants.find(x => x.id === id);

        //in case restaurant id is not correct
        if (!restaurant) { 
					callback("Restaurant id is not valid", null);
				} else {
					callback(null, restaurant);
				}
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    if (restaurant.photograph)
      return (`/img/${restaurant.photograph}.jpg`);
    return (`/img/default.jpg`);
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP
    }
    );
    return marker;
  }

}