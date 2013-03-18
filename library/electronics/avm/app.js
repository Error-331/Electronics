/**
* Electronics
*
* NOTICE OF LICENSE
*
* This source file is subject to the GNU GENERAL PUBLIC LICENSE (Version 3)
* that is bundled with this package in the file LICENSE.txt.
* It is also available through the world-wide-web at this URL:
* http://www.gnu.org/licenses/gpl.html
* If you did not receive a copy of the license and are unable to
* obtain it through the world-wide-web, please send an email
* to red331@mail.ru so we can send you a copy immediately.
*
* Class App is a part of JavaScript framework - Electronics.
*
* @package Electronics
* @author Selihov Sergei Stanislavovich <red331@mail.ru>
* @copyright Copyright (c) 2010-2013 Selihov Sergei Stanislavovich.
* @license http://www.gnu.org/licenses/gpl.html GNU GENERAL PUBLIC LICENSE (Version 3)
*
*/

define([
        'electronics/avm/object'
        ], 
        function() {
            
            
/**
 * Main constructor function of the class.
 * 
 * Function that creates application.
 * 
 * @access public   
 *
 * @param object usrConfig that contains configuration properties for the application
 *                        
 */   
  
Electronics.avm.App = function(usrConfig)
{   
    Electronics.avm.App.superClass.constructor.call(this, usrConfig);
    
    this.siblingApps = new Array();
    this.views = new Array();
}

// Extending class  
Electronics.core.extendClass(Electronics.avm.App, Electronics.avm.Object);

/* Utility properties starts here */

/**
 * @access public
 * @var array sibling applications 
 */

Electronics.avm.App.prototype.siblingApps = null;

/**
 * @access public
 * @var array child views 
 */

Electronics.avm.App.prototype.views = null;

/* Utility properties ends here */

/* Core methods starts here */

/**
 * Method that loads views.
 * 
 * Simple method that loads views objects and instantiates them.
 *
 * @access public   
 * 
 * @return object deferred promise object 
 *
 */

Electronics.avm.App.prototype.loadViews = function()
{
    var self = this;
    
    var loadClasses = this.jQuery.Deferred();
    var factory = new Electronics.avm.Factory();

    var view = null;
    var viewsCreatePromises = new Array();

    this.addLoadingDeferred(loadClasses.promise());         
    factory.loadViews(this).then(function(views){     
        self.views = views;
                   
        for (view in views) {
            viewsCreatePromises.push(views[view].getCreatePromise());
            views[view].setParentApp(self);
            views[view].sendEventToSelf('Init', {force: true});
        }

        self.jQuery.when.apply(self.jQuery, viewsCreatePromises).then(function(){
            loadClasses.resolve(); 
        }, function(){
            loadClasses.reject();
        });                             
    }, function(err){    
        loadClasses.reject(err);
    }); 
       
    return loadClasses.promise();      
}

/**
 * Method that loads all the necessary classes needed for the current object.
 * 
 * Simple method that loads all the necessary classes needed for the current object. Among this classes can be views, models, helpers etc.
 *
 * @access public   
 * 
 * @return object deferred promise object 
 *
 */

Electronics.avm.App.prototype.loadClasses = function()
{ 
    return this.loadViews();
}

/**
 * Method that sends event to all models of the current application.
 * 
 * Simple method that sends event to all models of the current application.
 * 
 * @access public 
 *    
 * @param string|object usrEvent event name or event object.
 * @param object usrParams user defined parameters if user event name is given.      
 *                         
 */ 

Electronics.avm.App.prototype.sendEventToModelsBroad = function()
{
    var tmpEvent = null;
    var obj = null;
    var errorObj = null;
    
    if (arguments.length == 1) {
        if (typeof arguments[0] == 'string') {
            tmpEvent = this.createEventObj(arguments[0], {}, false, false);
        } else if (typeof arguments[0] == 'object') {
            tmpEvent = arguments[0];
        } else {
            errorObj = new Error('Cannot send event to models broad');
            errorObj.number = 11305;
            errorObj.name = 'App error';
            errorObj.description = 'Invalid parameters set'; 
        
            throw errorObj; 
        }       
    } else if (arguments.length == 2){        
        tmpEvent = this.createEventObj(arguments[0], arguments[1], false, false);       
    } else {
        errorObj = new Error('Cannot send event to models broad');
        errorObj.number = 11305;
        errorObj.name = 'App error';
        errorObj.description = 'Invalid parameters set'; 
        
        throw errorObj;
    }  
    
    for (obj in this.views) {
        this.views[obj].sendEventToModelsBroad(tmpEvent);
    }    
}

/**
 * Method that sends event to all objects of the current application.
 * 
 * Simple method that sends event to all objects of the current application.
 * 
 * @access public 
 *    
 * @param string|object usrEvent event name or event object.
 * @param object usrParams user defined parameters if user event name is given.      
 *                         
 */ 

Electronics.avm.App.prototype.sendEventBroad = function()
{
    var tmpEvent = null;
    var obj = null;
    var errorObj = null; 
    
    if (arguments.length == 1) {
        if (typeof arguments[0] == 'string') {
            tmpEvent = this.createEventObj(arguments[0], {}, false, true);
        } else if (typeof arguments[0] == 'object') {
            tmpEvent = arguments[0];
        } else {
            errorObj = new Error('Cannot send event broad');
            errorObj.number = 11304;
            errorObj.name = 'App error';
            errorObj.description = 'Invalid parameters set'; 
        
            throw errorObj;
        }     
    } else if (arguments.length == 2){        
        tmpEvent = this.createEventObj(arguments[0], arguments[1], false, true);       
    } else {
        errorObj = new Error('Cannot send event broad');
        errorObj.number = 11304;
        errorObj.name = 'App error';
        errorObj.description = 'Invalid parameters set'; 
        
        throw errorObj;
    }      
   
    for (obj in this.views) {
        this.views[obj].onEvent(tmpEvent);
    }
} 

/**
 * Method that sends event to the siblings of the current object.
 * 
 * Simple method that sends event to the siblings of the current object.
 * 
 * @access public 
 *    
 * @param string|object usrEvent event name or event object.
 * @param object usrParams user defined parameters if user event name is given.      
 *                         
 */ 

Electronics.avm.App.prototype.sendEventToSiblings = function()
{ 
    var tmpEvent = null;
    var obj = null;
    var errorObj = null; 
    
    if (arguments.length == 1) {
        if (typeof arguments[0] == 'string') {
            tmpEvent = this.createEventObj(arguments[0], {}, false, false);
        } else if (typeof arguments[0] == 'object') {
            tmpEvent = arguments[0];
        } else {
            errorObj = new Error('Cannot send event to siblings');
            errorObj.number = 11303;
            errorObj.name = 'App error';
            errorObj.description = 'Invalid parameters set'; 
        
            throw errorObj;
        }      
    } else if (arguments.length == 2){        
        tmpEvent = this.createEventObj(arguments[0], arguments[1], false, false);       
    } else {
        errorObj = new Error('Cannot send event to siblings');
        errorObj.number = 11303;
        errorObj.name = 'App error';
        errorObj.description = 'Invalid parameters set'; 
        
        throw errorObj;
    }      
       
    for (obj in this.siblingApps) {
        this.siblingApps[obj].onEvent(tmpEvent);        
    }        
}

/**
 * Method that sends event to the children of the current object.
 * 
 * Simple method that sends event to the children of the current object.
 * 
 * @access public 
 *    
 * @param string|object usrEvent event name or event object.
 * @param object usrParams user defined parameters if user event name is given.      
 *                         
 */ 

Electronics.avm.App.prototype.sendEventToChildren = function()
{
    var tmpEvent = null;
    var obj = null;
    var errorObj = null; 
    
    if (arguments.length == 1) {
        if (typeof arguments[0] == 'string') {
            tmpEvent = this.createEventObj(arguments[0], {}, false, false);
        } else if (typeof arguments[0] == 'object') {
            tmpEvent = arguments[0];
        } else {
            errorObj = new Error('Cannot send event to children');
            errorObj.number = 11302;
            errorObj.name = 'App error';
            errorObj.description = 'Invalid parameters set'; 
        
            throw errorObj;
        }     
    } else if (arguments.length == 2){        
        tmpEvent = this.createEventObj(arguments[0], arguments[1], false, false);       
    } else {
        errorObj = new Error('Cannot send event to children');
        errorObj.number = 11302;
        errorObj.name = 'App error';
        errorObj.description = 'Invalid parameters set'; 
        
        throw errorObj;
    }
        
    for (obj in this.views) {    
        this.views[obj].onEvent(tmpEvent);      
    }  
}

/* Core methods ends here */

/* Event methods starts here */
/* Event methods ends here */

/* Get methods starts here */

/**
 * Method that returns sibling apps of the current object.
 *   
 * Simple method that returns sibling apps of the current object.
 * 
 * @access public
 * 
 * @return array with sibling apps.
 *                           
 */

Electronics.avm.App.prototype.getSiblingApps = function()
{    
    return this.siblingApps;
}

/* Get methods ends here */

/* Set methods starts here */

/**
 * Method that sets sibling apps for the current object.
 *   
 * Simple method that sets sibling apps for the current object.
 * 
 * @access public
 * 
 * @param object usrApps sibling apps.
 * 
 * @throws Error 
 *                           
 */

Electronics.avm.App.prototype.setSiblingApps = function(usrApps)
{
    var errorObj = null; 
    
    if (typeof usrApps != 'object' || usrApps == null) {
        errorObj = new Error('Cannot set sibling apps');
        errorObj.number = 11301;
        errorObj.name = 'App error';
        errorObj.description = 'Parameter is not an object'; 
        
        throw errorObj;
    }
    
    this.siblingApps = usrApps;
}

/* Set methods ends here */
            
}); 


