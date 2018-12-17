import ENV from '../env-config'
import axios from 'axios'
import { Buffer } from 'safe-buffer'

const BACKEND_URL = ENV.BACKEND_URL
const auth = ENV.auth

const API = {
  getRestaurant: (restaurantId) => {
    return new Promise((resolve, reject) => {
      axios.get(BACKEND_URL + '/speisekarte/' + restaurantId + auth)
        .then((response) => {
          resolve(response.data.restaurant[0])
        }).catch((error) => {
          reject(error)
        })
    })
  },
  getMealPicture: (speisenId) => {
    return new Promise((resolve, reject) => {
      axios.get(BACKEND_URL + '/restaurant/speisekarte/speise/bild/' + speisenId + auth, {
        responseType: 'arraybuffer'
      })
        .then((response) => {
          resolve(Buffer.from(response.data, 'binary').toString('base64'))
        }).catch((error) => {
          reject(error)
        })
    })
  },
  getRestaurantOverview: (restaurantId) => {
    return new Promise((resolve, reject) => {
      axios.get(BACKEND_URL + '/restaurant/overview/' + restaurantId + auth)
        .then((response) => {
          resolve(response.data)
        }).catch((error) => {
          reject(error)
        })
    })
  },
  addRestaurant: (name, plz, type, times = null, adresse, vorname, nachname, username, email, password) => {
    return new Promise((resolve, reject) => {
      axios.post(BACKEND_URL + '/restaurant' + auth, {
        name: name,
        plz: plz,
        type: type,
        times: times,
        adresse: adresse,
        vorname: vorname,
        nachname: nachname,
        username: username,
        email: email,
        password: password
      }).then((response) => {
        resolve(response.data)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  getLastRestaurant: () => {
    return new Promise((resolve, reject) => {
      axios.get(BACKEND_URL + '/restaurants/lastid' + auth)
        .then((response) => {
          resolve(response.data.r_id)
        }).catch((error) => {
          reject(error)
        })
    })
  },
  getMenusWithMenuTypes: (restaurantId) => {
    return new Promise((resolve, reject) => {
      axios.get(BACKEND_URL + '/restaurant/speisekarte/types/' + restaurantId + auth)
        .then((response) => {
          resolve(response.data)
        }).catch((error) => {
          reject(error)
        })
    })
  },
  getMenus: (restaurantId) => {
    return new Promise((resolve, reject) => {
      axios.get(BACKEND_URL + '/restaurant/speisekarte/' + restaurantId + auth)
        .then((response) => {
          console.log(response)
          resolve({
            restaurantData: response.data.restaurant[0],
            menuData: response.data.menu
          })
        }).catch((error) => {
          reject(error)
        })
    })
  },
  getMeals: (speisekartenId) => {
    return new Promise((resolve, reject) => {
      axios.get(BACKEND_URL + '/restaurant/speisekarte/speise/' + speisekartenId + auth)
        .then((response) => {
          resolve(response.data)
        }).catch((error) => {
          reject(error)
        })
    })
  },
  getTitlePicture: (restaurantId) => {
    return new Promise((resolve, reject) => {
      axios.get(BACKEND_URL + '/restaurant/logo/' + restaurantId + auth, {
        responseType: 'arraybuffer'
      })
        .then(function (response) {
          resolve(Buffer.from(response.data, 'binary').toString('base64'))
        }).catch((error) => {
          reject(error)
        })
    })
  },
  uploadTitlePicture: (restaurantId, formData, progressCb) => {
    return new Promise((resolve, reject) => {
      axios.post(BACKEND_URL + '/restaurant/logo/' + restaurantId + auth, formData, progressCb)
        .then((response) => {
          resolve(response)
        }).catch((error) => {
          reject(error)
        })
    })
  },
  deleteTitlePicture: (restaurantId) => {
    return new Promise((resolve, reject) => {
      axios.delete(BACKEND_URL + '/restaurant/logo/' + restaurantId + auth)
        .then((response) => {
          resolve(response)
        }).catch((error) => {
          reject(error)
        })
    })
  },
  addMenu: (restaurantId, type) => {
    return new Promise((resolve, reject) => {
      axios.post(BACKEND_URL + '/restaurant/speisekarte' + auth, {
        restaurantid: restaurantId,
        speisekartentypid: type
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  deleteMenu: (speisekartenId) => {
    return new Promise((resolve, reject) => {
      axios.delete(BACKEND_URL + '/restaurant/speisekarte' + auth, { params: {
        skid: speisekartenId
      }}).then((response) => {
        resolve(response)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  addMealsToMenu: (mealArray) => {
    return new Promise(async (resolve, reject) => {
      axios.post(ENV.BACKEND_URL + '/restaurant/speisekarte/speise' + auth, {
        mealarray: mealArray
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  editMeal: (name, description, price, mealId, mealType) => {
    return new Promise((resolve, reject) => {
      axios.put(ENV.BACKEND_URL + '/restaurant/speisekarte/speise' + auth, {
        name: name,
        beschreibung: description,
        preis: price,
        sid: mealId,
        stypid: mealType
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  deleteMeal: (speisenId) => {
    return new Promise((resolve, reject) => {
      axios.delete(BACKEND_URL + '/restaurant/speisekarte/speise' + auth, { params: {
        sid: speisenId
      }}).then((response) => {
        resolve(response)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  uploadPicture: (speisenId, formData, progressCb) => {
    return new Promise((resolve, reject) => {
      axios.post(BACKEND_URL + '/restaurant/speisekarte/speise/bild/' + speisenId + auth, formData, progressCb)
        .then((response) => {
          resolve(response)
        }).catch((error) => {
          reject(error)
        })
    })
  },
  uploadGalleryPicture: (restaurantId, formData, progressCb) => {
    return new Promise((resolve, reject) => {
      axios.post(BACKEND_URL + '/restaurant/bilder/' + restaurantId + auth, formData, progressCb)
        .then((response) => {
          resolve(response)
        }).catch((error) => {
          reject(error)
        })
    })
  },
  getGalleryPictures: (restaurantId) => {
    return new Promise((resolve, reject) => {
      axios.get(BACKEND_URL + '/restaurant/bilder/' + restaurantId + auth)
        .then((response) => {
          resolve(response.data)
        }).catch((error) => {
          reject(error)
        })
    })
  },
  deleteGalleryPicture: (restaurantId, fileName) => {
    console.log(restaurantId, fileName)
    return new Promise((resolve, reject) => {
      axios.delete(BACKEND_URL + '/restaurant/bilder/' + restaurantId + auth, {
        data: {filename: fileName}
      })
        .then(function (response) {
          resolve(response)
        }).catch((error) => {
          reject(error)
        })
    })
  },
  login: (credentials) => {
    credentials = credentials.email ? {
      email: credentials.email,
      password: credentials.password
    } : {
      username: credentials.username,
      password: credentials.password
    }
    return new Promise((resolve, reject) => {
      axios.post(BACKEND_URL + '/login' + auth, credentials)
        .then((response) => {
          resolve(response)
        }).catch((error) => {
          reject(error)
        })
    })
  },
  getRestaurantId: (cypher) => {
    return new Promise((resolve, reject) => {
      axios.post(BACKEND_URL + '/id' + auth, {
        cypher: cypher
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  check: () => {
    return new Promise((resolve, reject) => {
      axios.get(BACKEND_URL + '/check' + auth)
        .then((response) => {
          resolve(response)
        }).catch((error) => {
          reject(error)
        })
    })
  }
}

export default API
