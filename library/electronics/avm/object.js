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
* Class Object is a part of JavaScript framework - Electronics.
*
* @package Electronics
* @author Selihov Sergei Stanislavovich <red331@mail.ru>
* @copyright Copyright (c) 2010-2013 Selihov Sergei Stanislavovich.
* @license http://www.gnu.org/licenses/gpl.html GNU GENERAL PUBLIC LICENSE (Version 3)
*
*/

define([
        'electronics/core/core'
        ],
        function() {

Electronics.avm = {};   
   
/**
 * Main constructor function of the class.
 * 
 * Function that creates object.
 * 
 * @access public   
 *
 * @param object usrConfig that contains configuration properties for the object
 *                        
 */     
  
Electronics.avm.Object = function(usrConfig)
{ 
    var self = this;
    
    this.loadingDeferredStack = new Array();
    
    this.createDeferred = this.jQuery.Deferred();  
    this.destroyDeferred = this.jQuery.Deferred();
    
    this.addLoadingDeferred(this.createDeferred);
    
    this.setConfig(usrConfig);
    
    // Callbacks set
    this.createDeferred.done(function(){
        self.sendEventToSelf('Create');    
    });
    
    this.createDeferred.fail(function(err){
        if (typeof err == 'object') {
            self.sendEventToSelf('Error', {force: true, error: err});
        }      
    });
}

/* Utility properties starts here */  

/**
 * @access public
 * @var object|null HTML container of the current object 
 */

Electronics.avm.Object.prototype.container = null;

/**
 * @access public
 * @var string type of the current object 
 */

Electronics.avm.Object.prototype.type = 'object';

/**
 * @access public
 * @var string|null type of the application for the current object 
 */

Electronics.avm.Object.prototype.appType = null;

/**
 * @access public
 * @var string|null version of the current object
 */

Electronics.avm.Object.prototype.version = null;

/**
 * @access public
 * @var string|null name of the class of the current object
 */

Electronics.avm.Object.prototype.className = null;

/**
 * @access public
 * @var string|null name of the current object
 */

Electronics.avm.Object.prototype.name = null;

/**
 * @access public
 * @var string|null language code for the current object
 */

Electronics.avm.Object.prototype.lang = null;

/**
 * @access public
 * @var object|null localisation strings (i18n) for the current object
 */

Electronics.avm.Object.prototype.langObj = null;

/**
 * @access public
 * @var bool indicates whether to replace object container or not
 */

Electronics.avm.Object.prototype.replaceCont = false;

/**
 * @access public
 * @var bool indicates whether to insert object html to object container on startup or not
 */

Electronics.avm.Object.prototype.insertHtml = false;

/**
 * @access public
 * @var string|null layout contents for the current object
 */

Electronics.avm.Object.prototype.layoutContents = null;

/**
 * @access public
 * @var object jQuery instance
 */

Electronics.avm.Object.prototype.jQuery = Electronics.core.jQuery;

/* Utility properties ends here */  

/* State properties starts here */

/**
 * @access public
 * @var array stack of deferred objects indicating the loading stance
 */

Electronics.avm.Object.prototype.loadingDeferredStack = null;

/**
 * @access public
 * @var object|null jQuery deferred object that works with object creation process
 */

Electronics.avm.Object.prototype.createDeferred = null;

/**
 * @access public
 * @var object|null jQuery deferred object that works with object destroy process
 */

Electronics.avm.Object.prototype.destroyDeferred = null;

/**
 * @access public
 * @var object|null jQuery deferred object that works with object loading process
 */

Electronics.avm.Object.prototype.loadingDeferred = null;

/**
 * @access public
 * @var object|null state object
 */

Electronics.avm.Object.prototype.state = null;

/**
 * @access public
 * @var bool indicates whether HTML of the element was inserted or not
 */

Electronics.avm.Object.prototype.isHTMLInserted = false;

/* State properties ends here */ 

/* Core methods starts here */

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

Electronics.avm.Object.prototype.loadClasses = function()
{
    var loadClasses = this.jQuery.Deferred();
    this.addLoadingDeferred(loadClasses.promise());
    loadClasses.resolve();    
    
    return loadClasses.promise();   
}
  
/**
 * Method that unbinds event handler methods from the current object.
 * 
 * Simple method that unbinds event handler methods from the current object.
 *
 * @access public   
 *
 */

Electronics.avm.Object.prototype.unBindEvents = function()
{
}

/**
 * Method that binds event handler methods to the current object.
 * 
 * Simple method that binds event handler methods to the current object.
 *
 * @access public   
 *
 */ 

Electronics.avm.Object.prototype.bindEvents = function()
{
}

/**
 * Method that adds localisation attribute to the HTML object.
 * 
 * User must provide HTML element in form of jQuery object and localisation string. After this attribute have been added, this object can be 
 * localised in future.
 *
 * @access public   
 * 
 * @param object usrCont HTML object.
 * @param string usrStr localisation string.
 * 
 * @throws Error on error  
 * 
 * @return object HTML object with added attribute  
 *                         
 */ 

Electronics.avm.Object.prototype.addLocAttr = function(usrCont, usrStr)
{
    var errorObj = null;
    
    if (typeof usrCont != 'object') {
        errorObj = new Error('Cannot add attribute');
        errorObj.number = 11114;
        errorObj.name = 'Object error';
        errorObj.description = 'Parameter is not an object'; 
        
        throw errorObj;
    }
    
    if (typeof usrStr != 'string' || usrStr.length <= 0) {
        return usrCont;
    }   
    
    usrCont.attr('data-electronics', 'true');
    usrCont.attr('data-type', 'local');
    usrCont.attr('data-locstring', usrStr); 
    usrCont.attr('data-locstringowner', this.name); 
    
    return usrCont;
}

/**
 * Method that localises provided array.
 * 
 * Simple method that localises array that was passed as a parameter for this method.
 *
 * @access public   
 * 
 * @param array usrArr array that must be localised.
 * 
 * @throws Error on error  
 * 
 * @return array localised array  
 *                         
 */ 

Electronics.avm.Object.prototype.translateArr = function(usrArr)
{ 
    var tmpNewArr = new Array();
    var tmpTransStr = null;
    var Counter1 = 0;
    
    var errorObj = null;
      
    if (typeof usrArr != 'object') {
        errorObj = new Error('Cannot localise array');
        errorObj.number = 11107;
        errorObj.name = 'Object error';
        errorObj.description = 'Parameter is not an object'; 
        
        throw errorObj;
    }  

    if (typeof this.langObj != 'object') {
        errorObj = new Error('Language object is not set');
        errorObj.number = 11104;
        errorObj.name = 'Object error';
        errorObj.description = 'Language object for the current object is not set'; 
        
        throw errorObj;
    }
    
    for (Counter1 = 0; Counter1 < usrArr.length; Counter1++) {
        tmpTransStr = this.translateStr(usrArr[Counter1]);
        
        if (tmpTransStr == false) {
            tmpNewArr.push(usrArr[Counter1]);
        } else {
            tmpNewArr.push(tmpTransStr);
        }
    }  
    
    return tmpNewArr;    
} 

/**
 * Method that localises provided string.
 * 
 * Simple method that localises string that was passed as a parameter for this method.
 *
 * @access public   
 * 
 * @param string usrStr string that must be localised.
 * 
 * @throws Error on error  
 * 
 * @return bool|string false if the string could not be localised and localised string if all goes well  
 *                         
 */  

Electronics.avm.Object.prototype.translateStr = function(usrStr)
{          
    var errorObj = null;
    
    if (typeof usrStr != 'string') {
        errorObj = new Error('Cannot localise a string');
        errorObj.number = 11106;
        errorObj.name = 'Object error';
        errorObj.description = 'Parameter is not a string'; 
        
        throw errorObj;
    }  
    
    if (typeof this.langObj != 'object') {
        errorObj = new Error('Language object is not set');
        errorObj.number = 11104;
        errorObj.name = 'Object error';
        errorObj.description = 'Language object for the current object is not set'; 
        
        throw errorObj;
    }
                                          
    if (this.langObj[this.lang] != undefined) {                      
        if (this.langObj[this.lang][usrStr] != undefined) {                    
            return  this.langObj[this.lang][usrStr]
        } else {
            return false;
        }
    } else {
        return false;
    } 
} 

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

Electronics.avm.Object.prototype.translate = function()
{               
    var tmpSelf = this;
    var tmpElms = null;
    var tmpStr = false;

    var errorObj = null;
      
    if (typeof this.container == null) {     
        errorObj = new Error('Container is not set');
        errorObj.number = 11103;
        errorObj.name = 'Object error';
        errorObj.description = 'Container for the current object is not set'; 
        
        throw errorObj;
    }  
    
    if (this.langObj == null) {
        errorObj = new Error('Language object is not set');
        errorObj.number = 11104;
        errorObj.name = 'Object error';
        errorObj.description = 'Language object for the current object is not set'; 
        
        throw errorObj;
    }  

    if (this.replaceCont == true) {
        tmpElms = this.container.find('*[data-electronics="true"][data-type~="local"][data-locstringowner="' + this.name + '"]').andSelf().filter('*[data-electronics="true"][data-type~="local"][data-locstringowner="' + this.name + '"]');
    } else {
        tmpElms = this.container.find('*[data-electronics="true"][data-type~="local"][data-locstringowner="' + this.name + '"]');
    }

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
  
    return true;
}

/**
 * Method that tries to load language object.
 * 
 * Simple method that tries to load language object that will be used in localisation process.
 *
 * @access public   
 * 
 * @return object deferred promise object   
 *                         
 */  

Electronics.avm.Object.prototype.loadLangObj = function()
{
    var tmpSelf = this;
    var loadLangObj = this.jQuery.Deferred();
    var langObjPath =  this.getAppType() + '/' + this.getVersion() + '/i18n/' + this.getType() + 's/' + this.getClassName().toLowerCase();
    var errorObj = null;

    this.addLoadingDeferred(loadLangObj.promise());

    require([
            'avm/' + langObjPath
            ],
            function(usrLangObj) 
            {
                tmpSelf.setLangObj(usrLangObj);                          
                loadLangObj.resolve();
            },
            function(err)
            {
                errorObj = new Error('Cannot load language object');
                errorObj.number = 11105;
                errorObj.name = 'Object error';
                errorObj.description = 'Layout: ' + langObjPath + ' cannot be loaded'; 
              
                loadLangObj.reject(errorObj);
            }); 
        
    return loadLangObj.promise();    
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

Electronics.avm.Object.prototype.deleteHTMLFromContainer = function()
{    
    if (this.isHTMLInserted == true) {
        if (this.replaceCont == true) {
            var self = this;
            var tmpCont = document.createElement("div");
            
            tmpCont = this.jQuery(tmpCont);
            this.container.first().before(tmpCont);
            
            this.jQuery.each(this.container, function(usrIndex, usrValue) { 
                self.jQuery(usrValue).remove();
            });

            this.container = tmpCont;   
        } else {
            this.container.empty();
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

Electronics.avm.Object.prototype.insertHTMLIntoContainer = function(usrContents)
{  
    var tmpCont = null;
    var contents = null;
    var layout = '';

    if (this.isHTMLInserted == true) {
        this.deleteHTMLFromContainer();
    }

    if (this.replaceCont == true) {    
        if (typeof usrContents == 'object') {
            this.container.last().after(usrContents.contents());          
            this.container.remove();
            this.container = this.jQuery(usrContents.contents());
        } else {        
            tmpCont = document.createElement('div');
            tmpCont = this.jQuery(tmpCont);
            this.container.last().after(tmpCont);

            if (typeof usrContents == 'string') {
                tmpCont.html(usrContents);
            } else {
                tmpCont.html(this.layoutContents);
            }
     
            contents = tmpCont.contents();
            this.container.after(contents);

            tmpCont.remove();
            this.container.remove();

            this.container = this.jQuery(contents);  
        }      
    } else {
        if (typeof usrContents != 'undefined') {
            this.container.append(usrContents);
        } else {
            this.container.append(this.layoutContents);           
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

Electronics.avm.Object.prototype.loadTemplateParts = function()
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

Electronics.avm.Object.prototype.addLocStringOwerAttr = function()
{
    var tmpSelf = this;
    var tmpParts = this.container.find('*[data-electronics="true"][data-type~="local"]').andSelf().filter('*[data-electronics="true"][data-type~="local"]');
  
    this.jQuery.each(tmpParts, function(usrIndex, usrValue) {
        var tmpElm = tmpSelf .jQuery(usrValue);    

        if (tmpElm.attr('data-locstringowner') == undefined) {         
            tmpElm.attr('data-locstringowner', tmpSelf.name)
        }

    }); 
}

/**
 * Method that loads layout contents from the file.
 * 
 * Method tries to load HTML layout for the current object and extract layout parts from it.
 *
 * @access public   
 * 
 * @param string usrLayout name of the layout file.
 * 
 * @return object deferred promise object   
 *                         
 */  

Electronics.avm.Object.prototype.loadLayout = function(usrLayout)
{
    var tmpSelf = this;    
    var loadLayoutPromise = this.jQuery.Deferred();
    var errorObj = null;

    this.addLoadingDeferred(loadLayoutPromise);
  
    if (typeof usrLayout != 'string') {
        
        errorObj = new Error('Cannot load layout');
        errorObj.number = 11101;
        errorObj.name = 'Object error';
        errorObj.description = 'Layout name is not string'; 
              
        loadLayoutPromise.reject(errorObj);
        return loadLayoutPromise.promise();
    }
    
    require([
            'requirejs/text!avm/' + usrLayout + '.html'
            ],
            function(usrLayout) 
            {
                tmpSelf.layoutContents = usrLayout;               
                tmpSelf.jQuery.when(tmpSelf.sendEventToSelf('BeforeInsertLayout', {force: true})).then(function(){
                    loadLayoutPromise.resolve();
                });                 
            },
            function(err)
            {
                errorObj = new Error('Cannot load layout file');
                errorObj.number = 11102;
                errorObj.name = 'Object error';
                errorObj.description = 'Layout: ' + usrLayout + ' cannot be loaded'; 
              
                loadLayoutPromise.reject(errorObj);
            }); 
   
    return loadLayoutPromise.promise();       
}

/**
 * Method that prepares HTML for the current object.
 * 
 * Method loads HTML layout and insert it into the page if necessary.
 *
 * @access public   
 * 
 * @return object deferred promise object   
 *                         
 */  

Electronics.avm.Object.prototype.prepareHTML = function()
{
    var tmpSelf = this;
    var layoutContents = '';
    var tmpLayoutName =  this.getAppType() + '/' + this.getVersion() + '/layouts/' + this.getType() + 's/' + this.getClassName().toLowerCase() + '/main';
    var prepareHTMLPromise = this.jQuery.Deferred();
  
    // Layout load
    var loadLayoutPromise = this.loadLayout(tmpLayoutName);
    this.addLoadingDeferred(loadLayoutPromise.promise());
    
    // When layout load
    this.jQuery.when(loadLayoutPromise).then(function(){         
        if (tmpSelf.layoutContents.length <= 0){
            tmpSelf.layoutContents = '<div></div>';
        }
        
        if (tmpSelf.insertHtml == false) {
            prepareHTMLPromise.resolve();
            return true;
        }    
        
        tmpSelf.insertHTMLIntoContainer(); 
        tmpSelf.addLocStringOwerAttr();
        tmpSelf.loadTemplateParts();
        
        prepareHTMLPromise.resolve();    
    }, function(err) {
        prepareHTMLPromise.reject(err);
    })
  
    return prepareHTMLPromise.promise();
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

Electronics.avm.Object.prototype.create = function()
{    
    var tmpSelf = this;
                    
    this.jQuery.when(this.sendEventToSelf('BeforeCreate', {force: true})).then(function(){       
        tmpSelf.jQuery.when(tmpSelf.prepareHTML(), tmpSelf.loadLangObj()).then(function(){    
            try {
                tmpSelf.sendEventToSelf('TranslateSelf', {force: true});
            } catch (err) {
                tmpSelf.createDeferred.reject();
                tmpSelf.sendEventToSelf('Error', {force: true, error: err});
            }
                                            
            tmpSelf.jQuery.when(tmpSelf.loadClasses()).then(function(){
                tmpSelf.bindEvents(); 
                tmpSelf.createDeferred.resolve();               
            }, function(err) {
                tmpSelf.createDeferred.reject(err);
            });          
        });         
    }, function(err){
        tmpSelf.createDeferred.reject(err);
    });               
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

Electronics.avm.Object.prototype.sendEventBroad = function()
{         
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

Electronics.avm.Object.prototype.sendEventToSiblings = function()
{
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

Electronics.avm.Object.prototype.sendEventToChildren = function()
{ 
}

/**
 * Method that sends event to the current object.
 * 
 * Simple method that sends event to the current object.
 * 
 * @access public 
 *    
 * @param string|object usrEvent event name or event object.
 * @param object usrParams user defined parameters if user event name is given.      
 *                         
 */  

Electronics.avm.Object.prototype.sendEventToSelf = function()
{
    var tmpEvent = null;
    var errorObj = null;
    
    if (arguments.length == 1) {
        if (typeof arguments[0] == 'string') {
            tmpEvent = this.createEventObj(arguments[0], {}, false, false);
        } else if (typeof arguments[0] == 'object') {
            tmpEvent = arguments[0];
        } else {
            errorObj = new Error('Cannot send event to self');
            errorObj.number = 11112;
            errorObj.name = 'Object error';
            errorObj.description = 'Invalid parameters'; 
        
            throw errorObj;
        }          
    } else if (arguments.length == 2){        
        tmpEvent = this.createEventObj(arguments[0], arguments[1], false, false);       
    } else {
        errorObj = new Error('Cannot send event to self');
        errorObj.number = 11112;
        errorObj.name = 'Object error';
        errorObj.description = 'Invalid parameters'; 
        
        throw errorObj;
    }      
   
    this.onEvent(tmpEvent); 
}

/**
 * Method that creates event object.
 * 
 * After creating event object - it can be used to pass it to different event handlers of various objects.
 * 
 * @access public 
 *    
 * @param string usrEvent event name.
 * @param object usrParams user defined parameters.
 * @param bool usrIsBub parameter that indicates whether current event must be bubbled.
 * @param bool usrIsProp parameter that indicates whether current event must be propagated.
 * 
 * @throws Error  
 * 
 * @return object event object.       
 *                         
 */  

Electronics.avm.Object.prototype.createEventObj = function(usrEvent, usrParams, usrIsBub, usrIsProp)
{
    var errorObj = null;
    
    // Parameter check
    if (typeof usrEvent != 'string') {
        errorObj = new Error('Cannot create event object');
        errorObj.number = 11108;
        errorObj.name = 'Object error';
        errorObj.description = 'Event name is not a string'; 
        
        throw errorObj;
    }  
    
    if (usrParams === undefined) {
        usrParams = {};
    }
    
    if (typeof usrParams != 'object') {
        errorObj = new Error('Cannot create event object');
        errorObj.number = 11109;
        errorObj.name = 'Object error';
        errorObj.description = 'User parameters is not an object'; 
        
        throw errorObj;
    }      
    
    if (typeof usrIsBub != 'boolean') {
        errorObj = new Error('Cannot create event object');
        errorObj.number = 11110;
        errorObj.name = 'Object error';
        errorObj.description = '"isBubble" parameter is not boolean'; 
        
        throw errorObj;
    }
    
    if (typeof usrIsProp != 'boolean') {
        errorObj = new Error('Cannot create event object');
        errorObj.number = 11111;
        errorObj.name = 'Object error';
        errorObj.description = '"isPropagate" parameter is not boolean'; 
        
        throw errorObj;
    }
    
    // Event object creation
    var tmpSelf = this;
    var tmpEvent = {};
  
    tmpEvent.event = usrEvent;

    tmpEvent.object = tmpSelf;
    tmpEvent.params = usrParams;
    tmpEvent.isBubble = usrIsBub;
    tmpEvent.isPropagate = usrIsProp;  
      
    return tmpEvent;    
}

/**
 * Method that adds deferred object to the 'loading' stack.
 * 
 * After adding deferred object to the stack - current object enters 'loading' state, thus all incoming events (except those with 'force' parameter) will 
 * be buffered and processed after all the objects in 'loading' stack will be resolved or rejected.
 * 
 * @access public 
 *    
 * @param object usrLoadingDeferred deferred object that will be added to the stack.
 * 
 * @throws Error    
 *                         
 */  

Electronics.avm.Object.prototype.addLoadingDeferred = function(usrLoadingDeferred)
{    
    var tmpSelf = this;
    var errorObj = null;
    var funcRes = function() {
        tmpSelf.checkLoadingDeferredsStack();
    };
    
    if (typeof usrLoadingDeferred != 'object') {
        errorObj = new Error('Cannot add deferred object to the stack');
        errorObj.number = 11113;
        errorObj.name = 'Object error';
        errorObj.description = 'Provided parameter is not an object'; 
              
        throw errorObj;
    }
    
    this.checkLoadingDeferredsStack();   
    if (this.loadingDeferred.state() == 'resolved') {
        this.loadingDeferred = this.jQuery.Deferred();
    }
    
    usrLoadingDeferred.done(funcRes);
    usrLoadingDeferred.fail(funcRes);
    
    this.loadingDeferredStack.push(usrLoadingDeferred);
}
 
/**
 * Method that checks stack of deferred objects which lead current object to the loading stance.
 * 
 * This method checks which deferred objects was resolved or rejected and delete them from the stack. If all all of the deferred objects were deleted, 
 * current object switches to 'loaded' stance.
 * 
 * @access public 
 * 
 * @return bool true if all deferred objects were resolved and false if not.       
 *                         
 */   
 
Electronics.avm.Object.prototype.checkLoadingDeferredsStack = function()
{
    var i = 0;
    var state = '';
    
    if (this.loadingDeferred === null) {
        this.loadingDeferred = this.jQuery.Deferred();
    }
    
    for (i = 0; i < this.loadingDeferredStack.length; i++) {
        state = this.loadingDeferredStack[i].state();
            
        if (state == 'rejected' || state == 'resolved') {
            this.loadingDeferredStack.splice(i, 1);
            i = -1;
        }
    }
        
    if (this.loadingDeferredStack.length == 0) {
        this.loadingDeferred.resolve();
        return true;
    }
     
    return false;
}   

/* Core methods ends here */

/* Event methods starts here */

/**
 * Event handler method that is invoked when the current object is fully created.
 *   
 * Event to this method must be send if the object is fully created (layouts loaded, classes loaded etc.).
 * 
 * @access public
 * 
 * @param object usrEvent event object.
 *                           
 */ 

Electronics.avm.Object.prototype.onCreate = function(usrEvent)
{
}

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

Electronics.avm.Object.prototype.onChangeLang = function(usrEvent) 
{
    this.setLang(usrEvent.params.lang);
    this.sendEventToSelf('TranslateSelf');
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
  
Electronics.avm.Object.prototype.onTranslate = function(usrEvent)
{             
    this.translate(); 
} 

/**
 * Event handler method that invokes the process of localisation only of the current object contents.
 *   
 * Event to this method must be send if only the contents of the current object (not children contents) must be localised.
 * 
 * @access public
 * 
 * @param object usrEvent event object.
 *                           
 */ 

Electronics.avm.Object.prototype.onTranslateSelf = function(usrEvent)
{
    this.translate();    
}

/**
 * Method that is called before insertion of template contents.
 *   
 * This method is called before insertion of template contents. When template is loaded successfully, but not yet inserted in the element container.
 * 
 * @access public
 * 
 * @param object usrEvent event object.
 * 
 * @return object deferred promise object  
 *                           
 */ 

Electronics.avm.Object.prototype.onBeforeInsertLayout = function(usrEvent)
{ 
    var beforeInsertLayout = this.jQuery.Deferred();
    beforeInsertLayout.resolve();    

    return beforeInsertLayout.promise();      
}

/**
 * Method that is called before creation of the current object.
 *   
 * This method is called before any other object preparation methods is called (like methods for loading layouts, class etc.). This method is also 
 * determines whether object will be created  or not (judging by the deferred promise object). 
 * 
 * @access public
 * 
 * @param object usrEvent event object.
 * 
 * @return object deferred promise object  
 *                           
 */ 

Electronics.avm.Object.prototype.onBeforeCreate = function(usrEvent)
{
    var beforeCreate = this.jQuery.Deferred();
    beforeCreate.resolve();    
    
    return beforeCreate.promise();       
}

/**
 * Event handler method that initialises current object.
 *   
 * Event to this method must be send right after the cretion of the object.
 * 
 * @access public
 * 
 * @param object usrEvent event object.
 *                           
 */ 

Electronics.avm.Object.prototype.onInit = function(usrEvent)
{        
    this.create();
}

/**
 * General error handling method for handling all kinds of error events.
 *   
 * Simple method for handling errors.
 * 
 * @access public
 * 
 * @param object usrEvent error event object.
 *                           
 */ 

Electronics.avm.Object.prototype.onError = function(usrEvent)
{    
    var error = usrEvent.params.error;
    var errorStr = '';
    
    if (error.name === undefined || error.number === undefined || error.description === undefined) {
        errorStr = 'Error: ' + error;
    } else {
        errorStr = 'Name: ' + error.name + '; Number: ' + error.number + '; Description: ' + error.description;
    }

    alert(errorStr);
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

Electronics.avm.Object.prototype.onEvent = function(usrEvent)
{    
    var tmpSelf = this;

    if (this['on' + usrEvent.event] != undefined) {   
        if (usrEvent.params.force !== undefined && usrEvent.params.force === true) {
            this.setState(usrEvent);
            this['on' + usrEvent.event](usrEvent);
            
            // Send event to children
            if (usrEvent.isPropagate == true) {
                this.sendEventToChildren(usrEvent);
            }               
        } else {
            this.getLoadingPromise().then(function(){
                tmpSelf.setState(usrEvent);
                tmpSelf['on' + usrEvent.event](usrEvent);
                
                // Send event to children
                if (usrEvent.isPropagate == true) {
                    tmpSelf.sendEventToChildren(usrEvent);
                }                  
            });
        }    
    } else {   
        this.getLoadingPromise().then(function(){
            // Send event to children
            if (usrEvent.isPropagate == true) {
                tmpSelf.sendEventToChildren(usrEvent);
            }                  
        });            
    }  
}

/* Event methods ends here */

/* Get methods starts here */

/**
 * Method that returns 'isHTMLInserted' parameter of the current object.
 *   
 * This parameter indicates whether HTML for current container was inserted or not.
 * 
 * @access public
 *      
 * @return bool 'true' if HTML was inserted and 'false' if not.     
 *                           
 */ 

Electronics.avm.Object.prototype.getIsHTMLInserted = function()
{
    return this.isHTMLInserted;
}

/**
 * Method that returns HTML container of the current object.
 *   
 * Simple method that returns HTML container of the current object.
 * 
 * @access public
 *      
 * @return object HTML container of the current object.     
 *                           
 */ 

Electronics.avm.Object.prototype.getContainer = function()
{   
    return this.container;  
}

/**
 * Method that returns current object type.
 *   
 * Simple method that returns current object type.
 * 
 * @access public
 *        
 * @return string object type.
 *                           
 */ 

Electronics.avm.Object.prototype.getType = function()
{   
    return this.type;
}

/**
 * Method that returns application type for the current object.
 *   
 * Simple method that returns application type for the current object.
 * 
 * @access public
 *        
 * @return string application type.
 *                           
 */ 

Electronics.avm.Object.prototype.getAppType = function()
{
    return this.appType;
}

/**
 * Method that returns version of the current object.
 *   
 * Simple method that returns version of the current object.
 * 
 * @access public
 *        
 * @return string version.
 *                           
 */ 

Electronics.avm.Object.prototype.getVersion = function()
{
    return this.version;
}

/**
 * Method that returns name of the class of the current object.
 *   
 * Simple method that returns name of the class of the current object.
 * 
 * @access public
 *        
 * @return string class name.
 *                           
 */ 

Electronics.avm.Object.prototype.getClassName = function()
{
    return this.className;
}

/**
 * Method that returns name of the current object.
 *   
 * Simple method that returns name of the current object.
 * 
 * @access public
 *        
 * @return string name.
 *                           
 */ 

Electronics.avm.Object.prototype.getName = function()
{
    return this.name;
}

/**
 * Method that returns language code of the current object.
 *   
 * Simple method that returns language code of the current object.
 * 
 * @access public
 *        
 * @return string language code.
 *                           
 */ 

Electronics.avm.Object.prototype.getLang = function()
{
    return this.lang;
}

/**
 * Method that returns localisation strings (i18n) for the current object.
 *   
 * Simple method that returns localisation strings (i18n) for the current object.
 * 
 * @access public
 *        
 * @return object language strings (object).
 *                           
 */ 

Electronics.avm.Object.prototype.getLangObj = function()
{
    return this.langObj;
}

/**
 * Method that returns parameter that indicates whether to replace object container or not.
 *   
 * Simple method that returns parameter that indicates whether to replace object container or not.
 * 
 * @access public
 *        
 * @return bool parameter that indicates whether to replace object container or not.
 *                           
 */ 

Electronics.avm.Object.prototype.getReplaceCont = function()
{
    return this.replaceCont;
}


/**
 * Method that returns parameter that indicates whether to insert object html to object container on startup or not.
 *   
 * Simple method that returns parameter that whether to insert object html to object container on startup or not.
 * 
 * @access public
 *        
 * @return bool parameter that indicates whether to insert object html to object container on startup or not.
 *                           
 */ 

Electronics.avm.Object.prototype.getInsertHtml = function()
{
    return this.insertHtml;
}

/**
 * Method that returns 'create' promise of the 'create' deferred object.
 *   
 * Simple method that returns 'create' promise of the 'create' deferred object.
 * 
 * @access public
 *        
 * @return object 'promise' object.
 *                           
 */ 

Electronics.avm.Object.prototype.getCreatePromise = function()
{
    return this.createDeferred.promise();
}

/**
 * Method that returns 'destroy' promise of the 'destroy' deferred object.
 *   
 * Simple method that returns 'destroy' promise of the 'destroy' deferred object.
 * 
 * @access public
 *        
 * @return object 'promise' object.
 *                           
 */ 

Electronics.avm.Object.prototype.getDestroyPromise = function()
{
    return this.destroyDeferred.promise();
}

/**
 * Method that returns 'loading' promise of the 'loading' deferred object.
 *   
 * Simple method that returns 'loading' promise of the 'loading' deferred object.
 * 
 * @access public
 *        
 * @return object 'loading' object.
 *                           
 */ 

Electronics.avm.Object.prototype.getLoadingPromise = function()
{    
    this.checkLoadingDeferredsStack();
    return this.loadingDeferred.promise();
}

/**
 * Method that returns state of the current object.
 *   
 * Simple method that returns state of the current object. State is a event object that corresponds to 
 * the event handler of the current object.
 * 
 * @access public
 *        
 * @return null|object event object.
 *                           
 */

Electronics.avm.Object.prototype.getState = function()
{
    return this.state;
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

Electronics.avm.Object.prototype.setContainer = function(usrContainer)
{   
    var errorObj = null;
    
    if (typeof usrContainer != 'object' || usrContainer == null) {
        errorObj = new Error('Cannot set object container');
        errorObj.number = 11116;
        errorObj.name = 'Object error';
        errorObj.description = 'Parameter is not an object'; 
        
        throw errorObj;
    }
      
    this.container = usrContainer;   
}

/**
 * Method that sets type for the current object.
 *   
 * Simple method that sets type for the current object.
 * 
 * @access public
 * 
 * @param string usrType type for the current object.
 *        
 * @throws Error        
 *                           
 */ 

Electronics.avm.Object.prototype.setType = function(usrType)
{   
    var errorObj = null;

    if (typeof usrType != 'string') {
        errorObj = new Error('Cannot set object type');
        errorObj.number = 11117;
        errorObj.name = 'Object error';
        errorObj.description = 'Parameter is not a string'; 
        
        throw errorObj;
    }

    this.type = usrType.toLowerCase();
}

/**
 * Method that sets application type for the current object.
 *   
 * Simple method that sets application type for the current object.
 * 
 * @access public
 * 
 * @param string usrAppType application type for the current object.
 *  
 * @throws Error               
 *                           
 */ 

Electronics.avm.Object.prototype.setAppType = function(usrAppType)
{
    var errorObj = null;
    
    if (typeof usrAppType != 'string') {
        errorObj = new Error('Cannot set object application type');
        errorObj.number = 11118;
        errorObj.name = 'Object error';
        errorObj.description = 'Parameter is not a string'; 
        
        throw errorObj;
    }
      
    this.appType = usrAppType.toLowerCase();    
}

/**
 * Method that sets version for the current object.
 *   
 * Simple method that sets version for the current object.
 * 
 * @access public
 *        
 * @param string usrVersion version for the current object.
 *  
 * @throws Error    
 *                           
 */ 

Electronics.avm.Object.prototype.setVersion = function(usrVersion)
{
    var errorObj = null;
    
    if (typeof usrVersion != 'string') {
        errorObj = new Error('Cannot set object version');
        errorObj.number = 11119;
        errorObj.name = 'Object error';
        errorObj.description = 'Parameter is not a string'; 
        
        throw errorObj;
    }
      
    this.version = usrVersion.toLowerCase();    
}

/**
 * Method that sets name of the class for the current object.
 *   
 * Simple method that sets name of the class for the current object.
 * 
 * @access public
 *        
 * @param string usrClassName class name for the current object.
 *  
 * @throws Error    
 *                           
 */ 

Electronics.avm.Object.prototype.setClassName = function(usrClassName)
{
    var errorObj = null;
    
    if (typeof usrClassName != 'string') {
        errorObj = new Error('Cannot set object class name');
        errorObj.number = 11120;
        errorObj.name = 'Object error';
        errorObj.description = 'Parameter is not a string'; 
        
        throw errorObj;
    }
      
    this.className = usrClassName.toLowerCase();    
}

/**
 * Method that sets name for the current object.
 *   
 * Simple method that sets name for the current object.
 * 
 * @access public
 *        
 * @param string usrName name for the current object.
 *  
 * @throws Error    
 *                           
 */ 

Electronics.avm.Object.prototype.setName = function(usrName)
{
    var errorObj = null;
    
    if (typeof usrName != 'string') {
        errorObj = new Error('Cannot set object name');
        errorObj.number = 11121;
        errorObj.name = 'Object error';
        errorObj.description = 'Parameter is not a string'; 
        
        throw errorObj;
    }
      
    this.name = usrName.toLowerCase();    
}

/**
 * Method that sets language code for the current object.
 *   
 * Simple method that sets language code for the current object.
 * 
 * @access public
 *        
 * @param string usrLang language code for the current object.
 * 
 * @throws Error  
 *                           
 */ 

Electronics.avm.Object.prototype.setLang = function(usrLang)
{
    var errorObj = null;
    
    if (typeof usrLang != 'string') {
        errorObj = new Error('Cannot set object language');
        errorObj.number = 11122;
        errorObj.name = 'Object error';
        errorObj.description = 'Parameter is not a string'; 
        
        throw errorObj;
    }
      
    this.lang = usrLang.toLowerCase();  
}

/**
 * Method that sets localisation strings (i18n) for the current object.
 *   
 * Simple method that sets localisation strings (i18n) for the current object.
 * 
 * @access public
 *        
 * @param object usrLangOb localisation strings (i18n) for the current object.
 * 
 * @throws Error  
 *                           
 */ 

Electronics.avm.Object.prototype.setLangObj = function(usrLangObj)
{
    var errorObj = null;
    
    if (typeof usrLangObj != 'object' || usrLangObj == null) {
        errorObj = new Error('Cannot set language object');
        errorObj.number = 11123;
        errorObj.name = 'Object error';
        errorObj.description = 'Parameter is not an object'; 

        throw errorObj;
    }
      
    this.langObj = usrLangObj;      
}

/**
 * Method that sets parameter that indicates whether to replace object container or not.
 *   
 * Simple method that sets parameter that indicates whether to replace object container or not.
 * 
 * @access public  
 * 
 * @param bool usrReplaceCont replace object container or not.
 * 
 * @throws Error     
 *                           
 */ 

Electronics.avm.Object.prototype.setReplaceCont = function(usrReplaceCont)
{
    var errorObj = null;
    
    if (typeof usrReplaceCont != 'boolean') {
        errorObj = new Error('Cannot set "replace container" parameter');
        errorObj.number = 11124;
        errorObj.name = 'Object error';
        errorObj.description = 'Parameter is not boolean'; 
        
        throw errorObj;
    }
    
    this.replaceCont = usrReplaceCont;
}

/**
 * Method that sets parameter that indicates whether to insert object html to object container on startup or not.
 *   
 * Simple method that sets parameter that whether to insert object html to object container on startup or not.
 * 
 * @access public
 * 
 * @param bool usrInsertHtml insert object html to object container on startup or not.
 * 
 * @throws Error 
 *                           
 */ 

Electronics.avm.Object.prototype.setInsertHtml = function(usrInsertHtml)
{
    var errorObj = null;    
    
    if (typeof usrInsertHtml != 'boolean') {
        errorObj = new Error('Cannot set "insert HTML" parameter');
        errorObj.number = 11125;
        errorObj.name = 'Object error';
        errorObj.description = 'Parameter is not boolean'; 
        
        throw errorObj;
    }    
    
    this.insertHtml = usrInsertHtml;
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

Electronics.avm.Object.prototype.setConfig = function(usrConfig)
{
    var errorObj = null; 
    
    if (typeof usrConfig != 'object' || usrConfig == null) {
        errorObj = new Error('Cannot set configuration options for the object');
        errorObj.number = 11126;
        errorObj.name = 'Object error';
        errorObj.description = 'Parameter is not an object'; 
        
        throw errorObj;
    }

    // Config set
    this.setContainer(usrConfig.container);
    this.setType(usrConfig.type);
    this.setAppType(usrConfig.appType);
    this.setVersion(usrConfig.version);
    this.setClassName(usrConfig.className);
    this.setName(usrConfig.name);
    this.setLang(usrConfig.lang);
    this.setReplaceCont(usrConfig.replaceCont);
    this.setInsertHtml(usrConfig.insertHtml); 
}

/**
 * Method that sets state of the current object.
 *   
 * Simple method that sets state of the current object. State is a event object that corresponds to 
 * the event handler of the current object.
 * 
 * @access public
 *        
 * @param object usrState event object object.
 * 
 * @throws Error 
 *                           
 */

Electronics.avm.Object.prototype.setState = function(usrState)
{
    var errorObj = null; 
    
    if (typeof usrState != 'object' || usrState == null) {
        errorObj = new Error('Cannot set state for the object');
        errorObj.number = 11127;
        errorObj.name = 'Object error';
        errorObj.description = 'Parameter is not an object'; 
        
        throw errorObj;
    }
    
    this.state = usrState;
}

/* Set methods ends here */         
});         