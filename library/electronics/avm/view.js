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
* Class View is a part of JavaScript framework - Electronics.
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
 * Function that creates view.
 * 
 * @access public   
 *
 * @param object usrConfig that contains configuration properties for the view
 *                        
 */    
  
Electronics.avm.View = function(usrConfig)
{     
    Electronics.avm.View.superClass.constructor.call(this, usrConfig);  
    
    this.views = new Array();
    this.models = new Array();
    this.helpers = new Array();
    
    this.modelsDep = new Array();
}

// Extending class  
Electronics.core.extendClass(Electronics.avm.View, Electronics.avm.Object);
  
/* Utility properties starts here */ 

/**
 * @access public
 * @var object|null parent view
 */

Electronics.avm.View.prototype.parent = null;

/**
 * @access public
 * @var object|null parent application 
 */

Electronics.avm.View.prototype.parentApp = null;

/**
 * @access public
 * @var array children views
 */

Electronics.avm.View.prototype.views = null;

/**
 * @access public
 * @var array children models
 */

Electronics.avm.View.prototype.models = null;

/**
 * @access public
 * @var array children helpers
 */

Electronics.avm.View.prototype.helpers = null;

/**
 * @access public
 * @var array configuration objects for models
 */

Electronics.avm.View.prototype.modelsDep = null;
    
/* Utility properties ends here */

/* Core methods starts here */
        
Electronics.avm.View.prototype.clear = function()
{
    this.container.children().remove();
} 
  
Electronics.avm.View.prototype.destroy = function()
{
    var tmpSelf = this;
    var destroyPromises = null;
    
    this.sendEventToModels('Destroy');
    this.sendEventToHelpers('Destroy');
    this.sendEventToChildren('Destroy');
    
    destroyPromises = this.getAllDestroyPromise();
    
    if (destroyPromises.length == 0) {
        this.destroyDeferred.resolve();
    }
    
    this.jQuery.when.apply(this.jQuery, destroyPromises).then(function(){
        tmpSelf.destroyDeferred.resolve();
    });
       
    this.jQuery.when(this.destroyDeferred).then(function(){
        this.unBindEvents();
        this.clear();
  
        this.views = new Array();
        this.helpers = new Array();        
    })
}    
            
/**
 * Method that loads models.
 * 
 * Simple method that loads models objects and instantiates them.
 *
 * @access public   
 * 
 * @return object deferred promise object 
 *
 */  
  
Electronics.avm.View.prototype.loadModels = function()
{    
    var self = this;
    
    var loadClasses = this.jQuery.Deferred();
    var factory = new Electronics.avm.Factory();

    this.addLoadingDeferred(loadClasses.promise());        
    factory.loadModels(this.modelsDep).then(function(models){  
        self.models = models; 
        loadClasses.resolve(); 
    }, function(err){    
        loadClasses.reject(err);
    }); 
       
    return loadClasses.promise();   
}

/**
 * Method that loads helpers.
 * 
 * Simple method that loads helpers objects and instantiates them.
 *
 * @access public   
 * 
 * @param object usrContainer jQuery element or AVM object in which search for helpers will be performed.
 * 
 * @return object deferred promise object 
 *
 */

Electronics.avm.View.prototype.loadHelpers = function(usrContainer)
{
    var self = this;
    
    var loadClasses = this.jQuery.Deferred();
    var factory = new Electronics.avm.Factory();

    this.addLoadingDeferred(loadClasses.promise());         
    factory.loadHelpers(usrContainer).then(function(helpers){     
        self.helpers = helpers;           
        loadClasses.resolve(); 
    }, function(err){    
        loadClasses.reject(err);
    }); 
       
    return loadClasses.promise(); 
}

/**
 * Method that loads views.
 * 
 * Simple method that loads views objects and instantiates them.
 *
 * @access public   
 * 
 * @param object usrContainer jQuery element or AVM object in which search for views will be performed.
 * 
 * @return object deferred promise object 
 *
 */

Electronics.avm.View.prototype.loadViews = function(usrContainer)
{
    var self = this;
    
    var loadClasses = this.jQuery.Deferred();
    var factory = new Electronics.avm.Factory();

    this.addLoadingDeferred(loadClasses.promise());         
    factory.loadViews(usrContainer).then(function(views){  
        self.views = views;       
        loadClasses.resolve();
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

Electronics.avm.View.prototype.loadClasses = function()
{
    var tmpSelf = this;
    var obj = null;
    
    var loadClassesPromises = new Array();
    var loadClasses = this.jQuery.Deferred();
    var createPromises = null;
       
    loadClassesPromises.push(this.loadModels());
    loadClassesPromises.push(this.loadHelpers(this)); 
    loadClassesPromises.push(this.loadViews(this)); 

    this.jQuery.when.apply(this.jQuery, loadClassesPromises).then(function(){
        createPromises = tmpSelf.getAllCreatePromises();

        if (createPromises.length == 0) {
            loadClasses.resolve();
            return loadClasses.promise();
        }
        
        //Init models
        for (obj in tmpSelf.models) {
            tmpSelf.models[obj].setParentApp(tmpSelf.parentApp);
            tmpSelf.models[obj].setParent(tmpSelf);
            tmpSelf.models[obj].sendEventToSelf('Init', {force: true});
        }
        
        //Init helpers
        for (obj in tmpSelf.helpers) {
            tmpSelf.helpers[obj].setParentApp(tmpSelf.parentApp);
            tmpSelf.helpers[obj].setParent(tmpSelf);
            tmpSelf.helpers[obj].sendEventToSelf('Init', {force: true});
        }    
        
        //Init views
        for (obj in tmpSelf.views) {
            tmpSelf.views[obj].setParentApp(tmpSelf.parentApp);
            tmpSelf.views[obj].setParent(tmpSelf);
            tmpSelf.views[obj].sendEventToSelf('Init', {force: true});
        }    

        tmpSelf.jQuery.when.apply(tmpSelf.jQuery, createPromises).then(function(){
            loadClasses.resolve(); 
        });     
    }, function(err) {
        loadClasses.reject(err);
    });  
    
    return loadClasses.promise();
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

Electronics.avm.View.prototype.sendEventToModelsBroad = function()
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
            errorObj.number = 11411;
            errorObj.name = 'View error';
            errorObj.description = 'Invalid parameters set'; 
        
            throw errorObj; 
        }       
    } else if (arguments.length == 2){        
        tmpEvent = this.createEventObj(arguments[0], arguments[1], false, false);       
    } else {
        errorObj = new Error('Cannot send event to models broad');
        errorObj.number = 11411;
        errorObj.name = 'View error';
        errorObj.description = 'Invalid parameters set'; 
        
        throw errorObj;
    }  
    
    this.sendEventToModels(tmpEvent);
    
    for (obj in this.views) {
        this.views[obj].sendEventToModelsBroad(tmpEvent);
    }    
}

/**
 * Method that sends event to specific helper of the current object.
 * 
 * Simple method that sends event to specific helper of the current object.
 * 
 * @access public 
 *    
 * @param string helper name.   
 * @param string|object usrEvent event name or event object.
 * @param object usrParams user defined parameters if user event name is given.      
 *                         
 */ 

Electronics.avm.View.prototype.sendEventToHelper = function()
{
    var tmpEvent = null;
    var obj = null;
    var errorObj = null;
    
    if (typeof arguments[0] != 'string') {
        errorObj = new Error('Cannot send event to helper');
        errorObj.number = 11408;
        errorObj.name = 'View error';
        errorObj.description = 'Helper name is not specified'; 
        
        throw errorObj;
    }
    
    if (arguments.length == 2) {
        if (typeof arguments[1] == 'string') {
            tmpEvent = this.createEventObj(arguments[1], {}, false, false);
        } else if (typeof arguments[1] == 'object') {
            tmpEvent = arguments[1];
        } else {
            errorObj = new Error('Cannot send event to helper');
            errorObj.number = 11409;
            errorObj.name = 'View error';
            errorObj.description = 'Invalid parameters set'; 
        
            throw errorObj;
        }     
    } else if (arguments.length == 3){        
        tmpEvent = this.createEventObj(arguments[1], arguments[2], false, false);       
    } else {
        errorObj = new Error('Cannot send event to helper');
        errorObj.number = 11409;
        errorObj.name = 'View error';
        errorObj.description = 'Invalid parameters set'; 
        
        throw errorObj;
    }  

    if (this.helpers[arguments[0].toLowerCase()] === undefined) {
        errorObj = new Error('Cannot send event to helper');
        errorObj.number = 11410;
        errorObj.name = 'View error';
        errorObj.description = 'Helper with name "' + arguments[0].toLowerCase() + '" does not exist'; 
        
        throw errorObj;        
    } else {
        this.helpers[arguments[0].toLowerCase()].onEvent(tmpEvent);
    }     
}
 
/**
 * Method that sends event to all helpers of the current object.
 * 
 * Simple method that sends event to all helpers of the current object.
 * 
 * @access public 
 *    
 * @param string|object usrEvent event name or event object.
 * @param object usrParams user defined parameters if user event name is given.      
 *                         
 */ 
 
Electronics.avm.View.prototype.sendEventToHelpers = function()
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
            errorObj = new Error('Cannot send event to helpers');
            errorObj.number = 11407;
            errorObj.name = 'View error';
            errorObj.description = 'Invalid parameters set'; 
        
            throw errorObj;
        }     
    } else if (arguments.length == 2){        
        tmpEvent = this.createEventObj(arguments[0], arguments[1], false, false);       
    } else {
        errorObj = new Error('Cannot send event to helpers');
        errorObj.number = 11407;
        errorObj.name = 'View error';
        errorObj.description = 'Invalid parameters set'; 
        
        throw errorObj;
    }  

    for (obj in this.helpers) {
        this.helpers[obj].onEvent(tmpEvent);
    }       
}
 
/**
 * Method that sends event to all models of the current object.
 * 
 * Simple method that sends event to all models of the current object.
 * 
 * @access public 
 *    
 * @param string|object usrEvent event name or event object.
 * @param object usrParams user defined parameters if user event name is given.      
 *                         
 */

Electronics.avm.View.prototype.sendEventToModels = function()
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
            errorObj = new Error('Cannot send event to models');
            errorObj.number = 11406;
            errorObj.name = 'View error';
            errorObj.description = 'Invalid parameters set'; 
        
            throw errorObj;
        }  
    } else if (arguments.length == 2){        
        tmpEvent = this.createEventObj(arguments[0], arguments[1], false, false);       
    } else {
        errorObj = new Error('Cannot send event to models');
        errorObj.number = 11406;
        errorObj.name = 'View error';
        errorObj.description = 'Invalid parameters set'; 
        
        throw errorObj;
    }  

    for (obj in this.models) {
        this.models[obj].onEvent(tmpEvent);
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

Electronics.avm.View.prototype.sendEventBroad = function()
{
    var tmpEvent = null;
    var errorObj = null;
    
    if (arguments.length == 1) {
        if (typeof arguments[0] == 'string') {
            tmpEvent = this.createEventObj(arguments[0], {}, false, false);
        } else if (typeof arguments[0] == 'object') {
            tmpEvent = arguments[0];
        } else {
            errorObj = new Error('Cannot send event broad');
            errorObj.number = 11405;
            errorObj.name = 'View error';
            errorObj.description = 'Invalid parameters set'; 
        
            throw errorObj; 
        }       
    } else if (arguments.length == 2){        
        tmpEvent = this.createEventObj(arguments[0], arguments[1], false, false);       
    } else {
        errorObj = new Error('Cannot send event broad');
        errorObj.number = 11405;
        errorObj.name = 'View error';
        errorObj.description = 'Invalid parameters set'; 
        
        throw errorObj;
    }  

    this.parentApp.sendEventToChildren(tmpEvent);
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

Electronics.avm.View.prototype.sendEventToSiblings = function()
{    
    var tmpEvent = null;
    var errorObj = null;
    
    if (arguments.length == 1) {
        if (typeof arguments[0] == 'string') {
            tmpEvent = this.createEventObj(arguments[0], {}, false, false);
        } else if (typeof arguments[0] == 'object') {
            tmpEvent = arguments[0];
        } else {
            errorObj = new Error('Cannot send event to siblings');
            errorObj.number = 11404;
            errorObj.name = 'View error';
            errorObj.description = 'Invalid parameters set'; 
        
            throw errorObj; 
        }     
    } else if (arguments.length == 2){        
        tmpEvent = this.createEventObj(arguments[0], arguments[1], false, false);       
    } else {
        errorObj = new Error('Cannot send event to siblings');
        errorObj.number = 11404;
        errorObj.name = 'View error';
        errorObj.description = 'Invalid parameters set'; 
        
        throw errorObj;   
    }    
             
    if (this.parent === null) {
        this.parentApp.sendEventToChildren(tmpEvent);
    } else {
        this.parent.sendEventToChildren(tmpEvent);
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

Electronics.avm.View.prototype.sendEventToChildren = function()
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
            errorObj.number = 11403;
            errorObj.name = 'View error';
            errorObj.description = 'Invalid parameters set'; 
        
            throw errorObj;   
        } 
    } else if (arguments.length == 2){        
        tmpEvent = this.createEventObj(arguments[0], arguments[1], false, false);       
    } else {
        errorObj = new Error('Cannot send event to children');
        errorObj.number = 11403;
        errorObj.name = 'View error';
        errorObj.description = 'Invalid parameters set'; 
        
        throw errorObj;   
    } 
   
    for (obj in this.models) {       
        this.models[obj].onEvent(tmpEvent);        
    }     
   
    for (obj in this.helpers) {       
        this.helpers[obj].onEvent(tmpEvent);        
    }     
   
    for (obj in this.views) {       
        this.views[obj].onEvent(tmpEvent);        
    }  
}

/**
 * Method that sends event to the parent application.
 * 
 * Simple method that sends event to the parent application.
 * 
 * @access public 
 *    
 * @param string|object usrEvent event name or event object.
 * @param object usrParams user defined parameters if user event name is given.      
 *                         
 */  

Electronics.avm.View.prototype.sendEventToParentApp = function()
{
    var tmpEvent = null;
    var errorObj = null;
    
    if (arguments.length == 1) {
        if (typeof arguments[0] == 'string') {
            tmpEvent = this.createEventObj(arguments[0], {}, false, false);
        } else if (typeof arguments[0] == 'object') {
            tmpEvent = arguments[0];
        } else {
            errorObj = new Error('Cannot send event to parent application');
            errorObj.number = 11412;
            errorObj.name = 'View error';
            errorObj.description = 'Invalid parameters'; 
        
            throw errorObj;
        }          
    } else if (arguments.length == 2){        
        tmpEvent = this.createEventObj(arguments[0], arguments[1], false, false);       
    } else {
        errorObj = new Error('Cannot send event to parent application');
        errorObj.number = 11412;
        errorObj.name = 'View error';
        errorObj.description = 'Invalid parameters'; 
        
        throw errorObj;
    }      
   
    this.parentApp.onEvent(tmpEvent);
}

/* Core methods ends here */ 

/* Event methods starts here */

/**
 * Event handler method that is invoked when language must be changed.
 *   
 * Event to this method must be send if the language of the current object must be changed.
 * 
 * @access public
 * 
 * @param object usrEvent event object.
 *                           
 */ 

Electronics.avm.View.prototype.onChangeLang = function(usrEvent) 
{
    Electronics.avm.View.superClass.onChangeLang.call(this, usrEvent); 
    
    this.sendEventToModels(usrEvent);
    this.sendEventToHelpers(usrEvent);
    this.sendEventToChildren(usrEvent);
}

/**
 * Event handler method that invokes the process of localisation of the current object.
 *   
 * Event to this method must be send if the contents of the current object and its children must be localised.
 * 
 * @access public
 * 
 * @param object usrEvent event object.
 *                           
 */  
  
Electronics.avm.View.prototype.onTranslate = function(usrEvent)
{             
    this.onTranslateSelf(usrEvent);
    
    this.sendEventToModels('Translate');
    this.sendEventToHelpers('Translate');
    this.sendEventToChildren('Translate');
} 
  
Electronics.avm.View.prototype.onDestroy = function(usrEvent)
{
    var tmpSelf = this;
    
    this.sendEventToSelf('BeforeDestroy');    
    this.jQuery.when(this.modelsCreateDeferred, this.helpersCreateDeferred, this.viewsCreateDeferred).then(function(){  
        tmpSelf.destroy();
    });
    
} 

/**
 * General event handler method that receives every incoming event.
 *   
 * Every event incoming to the current object is captured by this handler and preprocessed before sending event to corresponding event handler. 
 * If current object is in loading state, all events will be bufferd before loading is complete.
 * 
 * @access public
 * 
 * @param object usrEvent event object.
 *                           
 */ 

Electronics.avm.View.prototype.onEvent = function(usrEvent)
{     
    Electronics.avm.View.superClass.onEvent.call(this, usrEvent);     
    this.sendEventToModels(usrEvent);
}

/* Event methods ends here */

/* Get methods starts here */

/**
 * Method that returns all 'destroy' promise objects from all children objects.
 *   
 * Simple method that returns all 'destroy' promise objects from all children objects.
 * 
 * @access public
 * 
 * @return array children 'destroy' promises objects.
 *                           
 */

Electronics.avm.View.prototype.getAllDestroyPromise = function()
{
    var destroyPromises = new Array();
    var tmpObj = null;
    
    // Models promises get
    for (tmpObj in this.models) {
        destroyPromises.push(this.models[tmpObj].getDestroyPromise());
    }
    
    // Helpers promises get
    for (tmpObj in this.helpers) {
        destroyPromises.push(this.helpers[tmpObj].getDestroyPromise());
    }    
    
    // Views promises get
    for (tmpObj in this.views) {
        destroyPromises.push(this.views[tmpObj].getDestroyPromise());
    }
    
    return destroyPromises;
}

/**
 * Method that returns all 'create' promise objects from all children objects.
 *   
 * Simple method that returns all 'create' promise objects from all children objects.
 * 
 * @access public
 * 
 * @return array children 'create' promises objects.
 *                           
 */

Electronics.avm.View.prototype.getAllCreatePromises = function()
{
    var createPromises = new Array();
    var tmpObj = null;
       
    // Models promises get
    for (tmpObj in this.models) {
        createPromises.push(this.models[tmpObj].getCreatePromise());
    }
    
    // Helpers promises get
    for (tmpObj in this.helpers) {
        createPromises.push(this.helpers[tmpObj].getCreatePromise());
    }    
    
    // Views promises get
    for (tmpObj in this.views) {
        createPromises.push(this.views[tmpObj].getCreatePromise());
    }  

    return createPromises;
}

/**
 * Method that returns parent view of the current view.
 *   
 * Simple method that returns parent view of the current view.
 * 
 * @access public
 * 
 * @return object parent view.
 *                           
 */

Electronics.avm.View.prototype.getParent = function()
{    
    return this.parent;
}

/**
 * Method that returns parent application of the current view.
 *   
 * Simple method that returns parent application of the current view.
 * 
 * @access public
 * 
 * @return object parent application.
 *                           
 */

Electronics.avm.View.prototype.getParentApp = function()
{    
    return this.parentApp;
}

/* Get methods ends here */

/* Set methods starts here */

/**
 * Method that sets parent view of the current view.
 *   
 * Simple method that sets parent view of the current view.
 * 
 * @access public
 * 
 * @param object usrParent parent view.
 * 
 * @throws Error  
 *                           
 */

Electronics.avm.View.prototype.setParent = function(usrParent)
{
    var errorObj = null; 
    
    if (typeof usrParent != 'object' || usrParent == null) {
        errorObj = new Error('Cannot set parent');
        errorObj.number = 11402;
        errorObj.name = 'View error';
        errorObj.description = 'Parameter is not an object'; 
        
        throw errorObj;        
    }
    
    this.parent = usrParent;
}

/**
 * Method that sets parent application for the current view.
 *   
 * Simple method that sets parent application for the current view.
 * 
 * @access public
 *        
 * @param object usrApp parent application.
 * 
 * @throws Error 
 *                           
 */

Electronics.avm.View.prototype.setParentApp = function(usrApp)
{
    var errorObj = null; 
    
    if (typeof usrApp != 'object' || usrApp == null) {
        errorObj = new Error('Cannot set parent app');
        errorObj.number = 11401;
        errorObj.name = 'View error';
        errorObj.description = 'Parameter is not an object'; 
        
        throw errorObj;        
    }
    
    this.parentApp = usrApp;
}

/* Set methods ends here */

}); 