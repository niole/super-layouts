# super-layouts

- [ ] 1. toolbar layout automater, takes routing schemes and automates a navbar, main view layout
* different sections of an app manage different concerns and have their own self contained general grouped url schemes
* route scheme provider, contains a layout that expresses the sections and their concerns, which ultimately map to grouped url schemes

- [ ] 2. easy access endpoints
* folds into the idea of layout automater
* takes the endpoints that you have created in the react router and makes them available globally


- [ ] 3. easy access params and navigate utilities
* this is a component level concern, perhaps could be made available via a container or via a route wrapper

- [ ] 4. automated layout validated form
* supports the create/edit modal
* must have the ability for actions in certain inputs to affect other inputs

- [x] 5. create/edit modal
* created from mixture of validated form, toggle container, whatever trigger buttons and modal component you desire

- [x] 6. toggle container

- [ ] 7. automated card with drilldown layout, where selecting a card drills down into a details view
* details view is managed by routing library
* details view can also be specified as an inline 'preview' panel


- [x] 8. data fetcher container
