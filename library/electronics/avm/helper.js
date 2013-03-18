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
* Class Helper is a part of JavaScript framework - Electronics.
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
 * Function that creates helper.
 * 
 * @access public   
 *
 * @param object usrConfig that contains configuration properties for the model
 *                        
 */  
  
Electronics.avm.Helper = function(usrConfig)
{ 
    Electronics.avm.Helper.superClass.constructor.call(this, usrConfig);  
} 

// Extending class  
Electronics.core.extendClass(Electronics.avm.Helper, Electronics.avm.Object);
  
/* Utility properties starts here */   

/**
 * @access public
 * @var object|null parent view
 */

Electronics.avm.Helper.prototype.parent = null;

/**
 * @access public
 * @var object|null parent application 
 */

Electronics.avm.Helper.prototype.parentApp = null;

/**
 * @access public
 * @var bool|null indicates whether current helper located in single container or not 
 */

Electronics.avm.Helper.prototype.isSingle = null;

/**
 * @access public
 * @var array|null helper containers
 */

Electronics.avm.Helper.prototype.containers = null;
    
/* Utility properties ends here */

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

Electronics.avm.Helper.prototype.translate = function()
{               
    var tmpSelf = this;
    var tmpElms = null;
    var tmpStr = false;
    var container = null;

    var errorObj = null;

    if (typeof this.containers == null) {     
        errorObj = new Error('Container is not set');
        errorObj.number = 11605;
        errorObj.name = 'Helper error';
        errorObj.description = 'Containers for the current object is not set'; 
        
        throw errorObj;
    }  
    
    if (this.langObj == null) {
        errorObj = new Error('Language object is not set');
        errorObj.number = 11606;
        errorObj.name = 'Helper error';
        errorObj.description = 'Language object for the current object is not set'; 
        
        throw errorObj;
    }  

    for (container in this.containers) {
        tmpElms = this.containers[container].find('*[data-electronics="true"][data-type~="local"][data-locstringowner="' + this.name + '"]');
       
        this.jQuery.each(tmpElms, function(tmpElms, usrValue) {     

            var tmpElm = tmpSelf.jQuery(usrValue);  
            var tmpLocString = tmpElm.attr('data-locstring');
            var tmpLocAtr = tmpElm.attr('data-locatr');
            var tmpIsHtmlAtr = tmpElm.attr('data-ishtml');
    
            if (typeof tmpLocString == undefined) {
                return true;
            }
        
            if (tmpIsHtmlAtr == undefined) {
                tmpIsHtmlAtr = 'false';
            }
                            
            tmpStr = tmpSelf.translateStr(tmpLocString);

            if (tmpStr == false) {
                return true;
            } else {
                if (tmpLocAtr != undefined) {
                    tmpElm.attr(tmpLocAtr, tmpStr);
                } else {
                    if (tmpIsHtmlAtr == 'true') {
                        tmpElm.html(tmpStr);
                    } else {                        
                        tmpElm.text(tmpStr);
                    }
                }      
            }
        });                   
    }

    return true;
}

/**
 * Method that removes HTML from the container.
 * 
 * Simple method that removes HTML from the container. This method also sets 'isHTMLInserted' 
 * (which indicates whether HTML was inserted or not) to 'false'.
 *
 * @access public  
 *                         
 */ 

Electronics.avm.Helper.prototype.deleteHTMLFromContainer = function()
{   
    var self = this;
    var tmpCont = null;    
    var container = null;
    
    if (this.isHTMLInserted == true) {
        if (this.replaceCont == true) {
            for (container in this.containers) {
                tmpCont = document.createElement("div");
            
                tmpCont = this.jQuery(tmpCont);
                this.containers[container].first().before(tmpCont);
            
                this.jQuery.each(this.containers[container], function(usrIndex, usrValue) { 
                    self.jQuery(usrValue).remove();
                });

                this.containers[container] = tmpCont;                                         
            }          
        } else {
            for (container in this.containers) {
                this.containers[container].empty();
            }           
        }
        
        this.isHTMLInserted = false;
    }
}

/**
 * Method that inserts HTML of the element to its container.
 * 
 * Simple method that inserts HTML of the element to its container. If object is passed - its contents will replace original object contents. If string is passed
 * it will be used instead of object layout contents. If nothing is passed - layout contents will be used.
 * This method also sets 'isHTMLInserted' (which indicates whether HTML was inserted or not) to 'true'.
 *
 * @access public  
 * 
 * @param string|object usrContents contents for the current object. 
 *                         
 */  

Electronics.avm.Helper.prototype.insertHTMLIntoContainer = function(usrContents)
{  
    var tmpCont = null;
    var contents = null;
    var layout = '';
    
    var container = null;

    if (this.isHTMLInserted == true) {
        this.deleteHTMLFromContainer();
    }

    if (this.replaceCont == true) {    
        if (typeof usrContents == 'object') {          
            for (container in this.containers) {
                this.containers[container].last().after(usrContents.contents());          
                this.containers[container].remove();
                this.containers[container] = this.jQuery(usrContents.contents());
            }                 
        } else {     
            for (container in this.containers) {
                tmpCont = document.createElement('div');
                tmpCont = this.jQuery(tmpCont);
                this.containers[container].last().after(tmpCont);

                if (typeof usrContents == 'string') {
                    tmpCont.html(usrContents);
                } else {
                    tmpCont.html(this.layoutContents);
                }
     
                contents = tmpCont.contents();
                this.containers[container].after(contents);

                tmpCont.remove();
                this.containers[container].remove();

                this.containers[container] = this.jQuery(contents);                        
            }                               
        }      
    } else {
        if (typeof usrContents != 'undefined') {
            for (container in this.containers) {
                this.containers[container].append(usrContents);
            }                                 
        } else {
            for (container in this.containers) {
                this.containers[container].append(this.layoutContents);  
            }                      
        }          
    }  
    
    this.isHTMLInserted = true;
}

/**
 * Method that extracts HTML layout parts from current layout.
 * 
 * Simple method that extracts layout prats from layout.
 *
 * @access public   
 *                         
 */  

Electronics.avm.Helper.prototype.loadTemplateParts = function()
{
    var tmpSelf = this; 
    var tmpParts = this.container.find('*[data-electronics="true"][data-type~="viewpart"]').andSelf().filter('*[data-electronics="true"][data-type~="viewpart"]');
    var tmpElm = null;
  
    this.jQuery.each(tmpParts, function(usrIndex, usrValue) {
        var tmpElm = tmpSelf .jQuery(usrValue);    
        var tmpPartName = tmpElm.attr('data-layoutpartname');
    
        tmpPartName = tmpPartName[0].toLowerCase() + tmpPartName.substr(1);
    
        if (tmpPartName == undefined) {
            return true;
        }  

        // Clear part
        tmpElm = tmpSelf.jQuery('<div>').append(tmpElm.clone());
        tmpSelf[tmpPartName] = tmpElm.html();
        tmpElm.remove();
    }); 
    
    tmpParts.remove();
}

/**
 * Method that adds 'data-locstringowner' attribute to corresponding elements.
 * 
 * Method that searches for the elements that must be localised and adds 'data-locstringowner' attribute which ensures that each 
 * element will be localised properly.
 *
 * @access public   
 *                         
 */  

Electronics.avm.Helper.prototype.addLocStringOwerAttr = function()
{
    var tmpSelf = this;
    var tmpParts = null;
    var container = null;
    
    for (container in this.containers) {
        var tmpParts = this.containers[container].find('*[data-electronics="true"][data-type~="local"]').andSelf().filter('*[data-electronics="true"][data-type~="local"]');
  
        this.jQuery.each(tmpParts, function(usrIndex, usrValue) {
            var tmpElm = tmpSelf .jQuery(usrValue);    

            if (tmpElm.attr('data-locstringowner') == undefined) {         
                tmpElm.attr('data-locstringowner', tmpSelf.name)
            }
        });              
    }      
}

/**
 * Method that sends event to the parent object.
 * 
 * Simple method that sends event to the parent object.
 * 
 * @access public 
 *    
 * @param string|object usrEvent event name or event object.
 * @param object usrParams user defined parameters if user event name is given.      
 *                         
 */  

Electronics.avm.Helper.prototype.sendEventToParent = function()
{
    var tmpEvent = null;
    var errorObj = null;
    
    if (arguments.length == 1) {
        if (typeof arguments[0] == 'string') {
            tmpEvent = this.createEventObj(arguments[0], {}, false, false);
        } else if (typeof arguments[0] == 'object') {
            tmpEvent = arguments[0];
        } else {
            errorObj = new Error('Cannot send event to parent');
            errorObj.number = 11607;
            errorObj.name = 'Helper error';
            errorObj.description = 'Invalid parameters'; 
        
            throw errorObj;
        }          
    } else if (arguments.length == 2){        
        tmpEvent = this.createEventObj(arguments[0], arguments[1], false, false);       
    } else {
        errorObj = new Error('Cannot send event to parent');
        errorObj.number = 11607;
        errorObj.name = 'Helper error';
        errorObj.description = 'Invalid parameters'; 
        
        throw errorObj;
    }      
   
    this.parent.onEvent(tmpEvent);
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

Electronics.avm.Helper.prototype.sendEventToParentApp = function()
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
            errorObj.number = 11608;
            errorObj.name = 'Helper error';
            errorObj.description = 'Invalid parameters'; 
        
            throw errorObj;
        }          
    } else if (arguments.length == 2){        
        tmpEvent = this.createEventObj(arguments[0], arguments[1], false, false);       
    } else {
        errorObj = new Error('Cannot send event to parent application');
        errorObj.number = 11608;
        errorObj.name = 'Helper error';
        errorObj.description = 'Invalid parameters'; 
        
        throw errorObj;
    }      
   
    this.parentApp.onEvent(tmpEvent);
}

/* Core methods ends here */ 

/* Event methods starts here */

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
  
Electronics.avm.Helper.prototype.onTranslate = function(usrEvent)
{             
    this.onTranslateSelf(usrEvent); 
} 

/* Event methods ends here */

/* Get methods starts here */

/**
 * Method that returns parent view of the current helper.
 *   
 * Simple method that returns parent view of the current helper.
 * 
 * @access public
 * 
 * @return object parent view.
 *                           
 */

Electronics.avm.Helper.prototype.getParent = function()
{    
    return this.parent;
}

/**
 * Method that returns parent application of the current helper.
 *   
 * Simple method that returns parent application of the current helper.
 * 
 * @access public
 * 
 * @return object parent application.
 *                           
 */

Electronics.avm.Helper.prototype.getParentApp = function()
{    
    return this.parentApp;
}

/**
 * Method that returns parameter that indicates whether current helper is located in one container or multiple.
 *   
 * Simple method that returns parameter that indicates whether current helper is located in one container or multiple.
 * 
 * @access public
 * 
 * @return bool true if single and false if multiple.
 *                           
 */

Electronics.avm.Helper.prototype.getIsSingle = function()
{    
    return this.isSingle;
}

/**
 * Method that returns helper containers.
 *   
 * Simple method that returns helper containers.
 * 
 * @access public
 *        
 * @return array helper containers.  
 *                                                
 */

Electronics.avm.Helper.prototype.getContainers = function(usrContainers)
{   
    return this.containers;
}

/* Get methods ends here */

/* Set methods starts here */

/**
 * Method that sets parameter that indicates whether current helper is located in one container or multiple.
 *   
 * Simple method that sets parameter that indicates whether current helper is located in one container or multiple.
 * 
 * @access public
 * 
 * @param bool usrIsSingle parameter.
 * 
 * @throws Error 
 *                           
 */

Electronics.avm.Helper.prototype.setIsSingle = function(usrIsSingle)
{    
    var errorObj = null; 

    if (typeof usrIsSingle != 'boolean') {
        errorObj = new Error('Cannot set "isSingle" parameter');
        errorObj.number = 11603;
        errorObj.name = 'Helper error';
        errorObj.description = 'Parameter is not boolean'; 
        
        throw errorObj;        
    }
    
    this.isSingle = usrIsSingle;    
}

/**
 * Method that sets parent view of the current helper.
 *   
 * Simple method that sets parent view of the current helper.
 * 
 * @access public
 * 
 * @param object usrParent parent view.
 * 
 * @throws Error  
 *                           
 */

Electronics.avm.Helper.prototype.setParent = function(usrParent)
{
    var errorObj = null; 
    
    if (typeof usrParent != 'object' || usrParent == null) {
        errorObj = new Error('Cannot set parent');
        errorObj.number = 11602;
        errorObj.name = 'Helper error';
        errorObj.description = 'Parameter is not an object'; 
        
        throw errorObj;        
    }
    
    this.parent = usrParent;
}

/**
 * Method that sets parent application for the current helper.
 *   
 * Simple method that sets parent application for the current helper.
 * 
 * @access public
 *        
 * @param object usrApp parent application.
 * 
 * @throws Error 
 *                           
 */

Electronics.avm.Helper.prototype.setParentApp = function(usrApp)
{
    var errorObj = null; 
    
    if (typeof usrApp != 'object' || usrApp == null) {
        errorObj = new Error('Cannot set parent app');
        errorObj.number = 11601;
        errorObj.name = 'Helper error';
        errorObj.description = 'Parameter is not an object'; 
        
        throw errorObj;        
    }
    
    this.parentApp = usrApp;
}

/**
 * Method that sets helper containers.
 *   
 * Simple method that sets helper containers.
 * 
 * @access public
 *        
 * @param object usrContainers containers.
 * 
 * @throws Error 
 *                           
 */

Electronics.avm.Helper.prototype.setContainers = function(usrContainers)
{
    var errorObj = null; 

    if (typeof usrContainers != 'object' || usrContainers == null) {
        errorObj = new Error('Cannot set containers');
        errorObj.number = 11604;
        errorObj.name = 'Helper error';
        errorObj.description = 'Parameter is not an object'; 
        
        throw errorObj;        
    }
    
    this.containers = usrContainers;
}

/**
 * Method that sets configuration options for the object.
 *   
 * Simple method that sets configuration options for the object.
 * 
 * @access public
 * 
 * @param object usrConfig configuration object.
 * 
 * @throws Error 
 *                           
 */ 

Electronics.avm.Helper.prototype.setConfig = function(usrConfig)
{
    Electronics.avm.Helper.superClass.setConfig.call(this, usrConfig);
    this.setIsSingle(usrConfig.isSingle); 
    this.setContainers(usrConfig.containers);
}

/* Set methods ends here */
}); 