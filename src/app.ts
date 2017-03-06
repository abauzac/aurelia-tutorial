import {Router, RouterConfiguration} from 'aurelia-router';

export class App {
  
  private router:Router;

/**
 * The framework will call this method, passing it a RouterConfiguration and a Router
 * @param config 
 * @param router 
 */
  configureRouter(config:RouterConfiguration, router:Router){
    // base "title" to be used in the document's title 
    config.title = "Contacts";
    
    config.map([
      //Minimally, each route needs at least a route pattern and a moduleId
      { route: '',              moduleId: 'no-selection',   title: 'Select'},
      { route: 'contacts/:id',  moduleId: 'contact-detail', name:'contacts' }
    ]);

    this.router = router;
  }
}
