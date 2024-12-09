# TagIT Shuttle Bus Web App

## Overview

This project is a bus route web application designed for CCNY shuttle buses, employing Airtag data, Google Maps API, and Leaflet Maps for precise visualization of routes and arrival times. Key features include secure authentication, Firebase database integration, and an accessible user interface, ensuring data is presented in an interactive and visually compelling manner.

This project is currently live and running at [ccnyshuttle.com](https://ccnyshuttle.com).

**Note:** The corresponding backend for this project can be found [here](https://github.com/mengwaichan/ShuttleBus_Route).

## Table of Contents

- [Screenshots](#screenshots)
- [Requirements](#requirements)
- [Installation](#installation)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Contributions](#contributions)

## Screenshots

## Requirements

- Node.js (latest version)

## Installation

1. Clone the repository

```bash
git clone https://github.com/MarkusCDev/TagIT.git
cd ccny-shuttle
```

2. Add .env file with Api Keys in the root (outside src folder)

```bash
VITE_APP_FIREBASE_API_KEY =
VITE_APP_FIREBASE_AUTH_DOMAIN =
VITE_APP_FIREBASE_PROJECT_ID =
VITE_APP_FIREBASE_STORAGE_BUCKET =
VITE_APP_FIREBASE_MSG_SENDER_ID =
VITE_APP_FIREBASE_APP_ID =
VITE_APP_FIREBASE_MEASUREMENT_ID =
VITE_APP_GOOGLE_API_KEY =
```

3. Dependancies

```bash
npm install
```

3. Run

```bash
npm run dev
```

## Deployment

1. New updates occur when github repo (main branch) is updated, if you require a hard deployment use:

```bash
npm run build:deploy
```

## Documentation

For detailed documentation on components, refer to the code for each individual component. Here is a breif overview:

### Components

- `UserAuth.jsx`: Handles firebase authentication including: creating user, validating user, logging in user, email verification request, and signing out.
- `ProtectedRoute.jsx`: Ensures user is validated before allowing the render of a protected route component. By default if user is not valid they will be automatically routed back to the landing page.
- `Signup.jsx`: Guests are able to only signup with a @citymail.cuny.edu or @ccny.cuny.edu email address.
- `Login.jsx`: Users are allowed to login if and only if they had verified their email.
- `MapPublic.jsx`: Utlizes Leaflet mapping to show markers, handle polyline data from firebase, and animations of the shuttle bus markers. Animations required a custom solution to interpolate the data of polyline in order to demonstrate a smooth animation of the shuttle marker moving to its destination.
- `Map.jsx`: Utilizes Google Dynamic mapping to show markers, handle polyline data from firebase, and animation of the shuttle bus markers. Animations are built in Google Dyanmic Maps and only required a percents to adjust it location on the polyline.
- `Routing.jsx`: Recieved data from firebase and updates the routing data depending on the shuttle route using different color to represent how close the routing is.
- `Navbar.jsx`: Renders our navbar of the page and dynamically changes if a user is logged in or not to showcase the page that they have permission to visit.
- `CopyrightNotice.jsx`: Renders our footer of the page.
- `ResetPassword.jsx`: Handles sending emails for a password reset when a user inputs their valid email that has been added to the firebase authentication system.

### Pages

- `AboutUs.jsx`: Visual page to showcase the scope of the project and features we have.
- `Contact.jsx`: Includes the information for facility department and the team member for the project.
- `LandingMap.jsx`: This page combines both the Map and Routing components. A firebase query pulls the shuttle data from the database and serves it to both the map and routing table. The map utilizes the polyline (line that represents the source and destination route) information to create an animation. This animation for the leaflet computes the inerpolation of the polyline lat and long data.
- `NotFound.jsx`: This 404 page renders when you use a subdomain that does not exist.

## Limitations

- Google Map Component (Map.jsx) - Reloads of google dynamic map incurs a cost of 0.007 per request which is not feasible with our limited budget. This lead to the implementation of Leaflet for mapping which had the caveat of animation issues. Google uses percentage base, whereas for Leaflet it required the calculations to interpolate every lat/long between source and destination to "animate" the marker every second. While Leaflet solved our API cost for mapping, we believe it should be utlized on CCNY campus screens for both advertisement and current tracking.

## Contributions

If you would like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix: `git checkout -b feature-name`.
3. Make your changes and commit them: `git commit -m "Add feature"`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.
