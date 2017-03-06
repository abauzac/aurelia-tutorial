import {WebAPI} from './web-api';
import {inject} from 'aurelia-framework';

@inject(WebAPI)
/**
 * ContactList
 */
export class ContactList  {
    contacts;
    selectId = 0;

    /**
     * constructor
     * @param api from Dependency Injection 
     */
    constructor(private api:WebAPI) {  
    }
    /**
     * hook which gets called after both the view-model and the view are created
     */
    created(){
        this.api.getContactList().then(contacts => this.contacts = contacts)
    }

    /**
     * select click delegate 
     * @param contact the user has clicked on
     * @returns boolean true if we want the event to continue triggering
     */
    select(contact){
        this.selectId = contact.id;
        return true;
    }
}