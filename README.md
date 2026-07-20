Datacom Software Development Simulation - Cinema Finder
An interactive React web application developed as part of the Datacom Software Development simulation on Forage. The project involves resolving core map functionality, styling components, and tracking localized cinema data.
Features & Fixes
Map Snapping Bug Resolution:Implemented a custom React-Leaflet `MapController` component using the `useMap` hook to ensure smooth user panning and prevent the map view from forcefully resetting/snapping back to default coordinates on state updates.
Dynamic Filtering:Enabled real-time client-side sorting and filtering of cinema data based on ticket prices, city locations, and candy bar availability.
Geographic Bounding:Restricted viewport bounds to prevent endless scrolling beyond designated New Zealand boundaries.
Tech Stack
- React.js
- Leaflet & React-Leaflet
- CSS3
