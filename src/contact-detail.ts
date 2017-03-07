import {inject} from "aurelia-framework";
import {WebAPI} from "./web-api";
import {areEqual} from "./utility";
import {EventAggregator} from 'aurelia-event-aggregator';
import {ContactUpdated,ContactViewed} from './messages';
import { RouteConfig, 
    RoutableComponentActivate, 
    RoutableComponentCanDeactivate } from 'aurelia-router';

interface Contact{
    firstName:string;
    lastName:string;
    email:string;
}

@inject(WebAPI, EventAggregator)
export class ContactDetail implements RoutableComponentActivate, RoutableComponentCanDeactivate{

    routeConfig:RouteConfig;
    contact:Contact;
    originalContact: Contact;

    constructor(private api:WebAPI, private ea: EventAggregator) {
        
    }

    /**
     * HOOK
     * life cycle method for routed component
     * gets invoked right before the router is about to activate the component
     * the router passes the component its route parameters
     * @param params will have one property for every route param that was parsed 
     * @param routeConfig same configuration object that you created to configure the router itself
     */
    activate(params, routeConfig:RouteConfig){
        this.routeConfig = routeConfig;

        return this.api.getContactDetails(params.id).then(contact => {
            this.contact = <Contact>contact;
            this.routeConfig.navModel.setTitle(this.contact.firstName);
            this.originalContact = JSON.parse(JSON.stringify(this.contact));
            // dispatch event contact ContactViewed
            this.ea.publish(new ContactViewed(this.contact));
        });
    }


    /**
     * HOOK : called before navigating away from the current component
     */
    canDeactivate(){
        if(!areEqual(this.originalContact, this.contact)){
            var res =  confirm("Unsaved changes, really quit ?");
            // user cancelled : stay on contact view
            !res && this.ea.publish(new ContactViewed(this.contact));
            return res;
        }
        return true;
    }

    /**
     * Computed!!!
     */
    get canSave(){
        return this.contact.firstName && this.contact.lastName && !this.api.isRequesting;
    }

    save(){
        this.api.saveContact(this.contact).then(contact => {
            this.contact = <Contact>contact;
            this.routeConfig.navModel.setTitle(this.contact.firstName);
            this.originalContact = JSON.parse(JSON.stringify(this.contact));
            this.ea.publish(new ContactUpdated(this.contact));
        });
    }

}