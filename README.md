# Restaurant Reviews Stage 2


### Instroduction
This is the second project in the MWSND, in this project I had to use Service Worker and IndexedDB to cache data and optimize the project to satisfy the requirement when running lighthouse in chrome


    - Progressive Web App score should be at 90 or better.
    - Performance score should be at 70 or better.
    - Accessibility score should be at 90 or better.

This time the application will fetch data from server api, I also attached the server into this Repo.

### Installation 
In this project I used indexeddb so before you run the app please install indexeddb using npm
Go to the `frontend` folder and type the command `npm install`

### Deployment
In this project, we can use Python's SimpleHTTPServer to run the frontend locally. Go to the `frontend` folder and type the command:
`python3 -m http.server 8000`

Run server side by going to `api-server` folder and start server by:
`node server.js`

Visit the website: `http://localhost:8000` and look what we got :)

### Lighthouse Result
This is result for the HomePage
![homepace](https://github.com/vinhphucit/Udacity-MWSND-02-Restaurant-Reviews-Stage-2/blob/master/homescreen_lighthouse.png)

This is result for the Restaurant Detail
![detail](https://github.com/vinhphucit/Udacity-MWSND-02-Restaurant-Reviews-Stage-2/blob/master/restaurantdetail_lighthouse.png)
