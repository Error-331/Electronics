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
* Class Model is a part of JavaScript framework - Electronics.
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
 * Function that creates model.
 * 
 * @access public   
 *
 * @param object usrConfig that contains configuration properties for the model
 *                        
 */    
  
Electronics.avm.Model = function(usrConfig)
{  
    Electronics.avm.Model.superClass.constructor.call(this, usrConfig);  
} 

// Extending class  
Electronics.core.extendClass(Electronics.avm.Model, Electronics.avm.Object);
  
/* Utility properties starts here */   

/**
 * @access public
 * @var object|null parent view
 */

Electronics.avm.Model.prototype.parent = null;

/**
 * @access public
 * @var object|null parent application 
 */

Electronics.avm.Model.prototype.parentApp = null;
    
/* Utility properties ends here */ 

/* State properties starts here */
/* State properties ends here */ 

/* Core methods starts here */

/**
 * Method that localises current object contents.
 * 
 * Simple method that localises current object contents.
 *
 * @access public   
 * 
 * @throws Error on error  
 * 
 * @return bool true if all goes well and false if not   
 *                         
 */  

Electronics.avm.Model.prototype.translate = function()
{ 
    
}

/**
 * Method that creates current object.
 * 
 * Method initialises the process of loading layout, language object and all the necessary objects. Whether all goes well or not, this method will set
 * correct status for 'createDeferred' object.
 * 
 * @access public      
 *                         
 */  

Electronics.avm.Model.prototype.create = function()
{    
    var tmpSelf = this;
                    
    this.jQuery.when(this.sendEventToSelf('BeforeCreate', {force: true})).then(function(){       
        tmpSelf.jQuery.when(tmpSelf.loadLangObj()).then(function(){    
            try {
                tmpSelf.sendEventToSelf('TranslateSelf', {force: true});
            } catch (err) {
                tmpSelf.createDeferred.reject();
                tmpSelf.sendEventToSelf('Error', {force: true, error: err});
            }
                                            
            tmpSelf.createDeferred.resolve(); 
            tmpSelf.bindEvents();           
        });         
    }, function(err){
        tmpSelf.createDeferred.reject(err);
    });             
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

Electronics.avm.Model.prototype.sendEventToModelsBroad = function()
{
    var tmpEvent = null;
    var errorObj = null;
    
    if (arguments.length == 1) {
        if (typeof arguments[0] == 'string') {
            tmpEvent = this.createEventObj(arguments[0], {}, false, false);
        } else if (typeof arguments[0] == 'object') {
            tmpEvent = arguments[0];
        } else {
            errorObj = new Error('Cannot send event to models broad');
            errorObj.number = 11505;
            errorObj.name = 'Model error';
            errorObj.description = 'Invalid parameters set'; 
        
            throw errorObj; 
        }       
    } else if (arguments.length == 2){        
        tmpEvent = this.createEventObj(arguments[0], arguments[1], false, false);       
    } else {
        errorObj = new Error('Cannot send event to models broad');
        errorObj.number = 11505;
        errorObj.name = 'Model error';
        errorObj.description = 'Invalid parameters set'; 
        
        throw errorObj;
    }  

    this.parentApp.sendEventToModelsBroad(tmpEvent);
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

Electronics.avm.Model.prototype.sendEventBroad = function()
{
    var tmpEvent = null;
    var errorObj = null;
    
    if (arguments.length == 1) {
        if (typeof arguments[0] == 'string') {
            tmpEvent = this.createEventObj(arguments[0], {}, false, true);
        } else if (typeof arguments[0] == 'object') {
            tmpEvent = arguments[0];
        } else {
            errorObj = new Error('Cannot send event broad');
            errorObj.number = 11503;
            errorObj.name = 'Model error';
            errorObj.description = 'Invalid parameters set'; 
        
            throw errorObj; 
        }       
    } else if (arguments.length == 2){        
        tmpEvent = this.createEventObj(arguments[0], arguments[1], false, true);       
    } else {
        errorObj = new Error('Cannot send event broad');
        errorObj.number = 11504;
        errorObj.name = 'Model error';
        errorObj.description = 'Invalid parameters set'; 
        
        throw errorObj;
    }  

    this.parentApp.sendEventToChildren(tmpEvent);     
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

Electronics.avm.Model.prototype.sendEventToParentApp = function()
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
            errorObj.number = 11506;
            errorObj.name = 'Model error';
            errorObj.description = 'Invalid parameters'; 
        
            throw errorObj;
        }          
    } else if (arguments.length == 2){        
        tmpEvent = this.createEventObj(arguments[0], arguments[1], false, false);       
    } else {
        errorObj = new Error('Cannot send event to parent application');
        errorObj.number = 11506;
        errorObj.name = 'Model error';
        errorObj.description = 'Invalid parameters'; 
        
        throw errorObj;
    }      
   
    this.parentApp.onEvent(tmpEvent);
}
 
/* Core methods ends here */

/* Event methods starts here */  
/* Event methods ends here */ 

/* Get methods starts here */

/**
 * Method that returns parent view of the current model.
 *   
 * Simple method that returns parent view of the current model.
 * 
 * @access public
 * 
 * @return object parent view.
 *                           
 */

Electronics.avm.Model.prototype.getParent = function()
{    
    return this.parent;
}

/**
 * Method that returns parent application of the current model.
 *   
 * Simple method that returns parent application of the current model.
 * 
 * @access public
 * 
 * @return object parent application.
 *                           
 */

Electronics.avm.Model.prototype.getParentApp = function()
{    
    return this.parentApp;
}

/* Get methods ends here */

/* Set methods starts here */

/**
 * Method that sets HTML container for the current object.
 *   
 * Simple method that sets HTML container for the current object.
 * 
 * @access public
 * 
 * @param object usrContainer HTML container for the current object.
 *        
 * @throws Error        
 *                           
 */ 

Electronics.avm.Model.prototype.setContainer = function(usrContainer)
{   
}

/**
 * Method that sets parent view of the current model.
 *   
 * Simple method that sets parent view of the current model.
 * 
 * @access public
 * 
 * @param object usrParent parent view.
 * 
 * @throws Error  
 *                           
 */

Electronics.avm.Model.prototype.setParent = function(usrParent)
{
    var errorObj = null; 
    
    if (typeof usrParent != 'object' || usrParent == null) {
        errorObj = new Error('Cannot set parent');
        errorObj.number = 11502;
        errorObj.name = 'Model error';
        errorObj.description = 'Parameter is not an object'; 
        
        throw errorObj;        
    }
    
    this.parent = usrParent;
}

/**
 * Method that sets parent application for the current model.
 *   
 * Simple method that sets parent application for the current model.
 * 
 * @access public
 *        
 * @param object usrApp parent application.
 * 
 * @throws Error 
 *                           
 */

Electronics.avm.Model.prototype.setParentApp = function(usrApp)
{
    var errorObj = null; 
    
    if (typeof usrApp != 'object' || usrApp == null) {
        errorObj = new Error('Cannot set parent app');
        errorObj.number = 11501;
        errorObj.name = 'Model error';
        errorObj.description = 'Parameter is not an object'; 
        
        throw errorObj;        
    }
    
    this.parentApp = usrApp;
}

/* Set methods ends here */

});