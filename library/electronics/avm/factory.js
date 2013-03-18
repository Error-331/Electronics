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
* Class Factory is a part of JavaScript framework - Electronics.
*
* @package Electronics
* @author Selihov Sergei Stanislavovich <red331@mail.ru>
* @copyright Copyright (c) 2010-2013 Selihov Sergei Stanislavovich.
* @license http://www.gnu.org/licenses/gpl.html GNU GENERAL PUBLIC LICENSE (Version 3)
*
*/

define([
        'electronics/avm/app',
        'electronics/avm/view',
        'electronics/avm/helper',
        'electronics/avm/model'
        ], 
        function() {
           
Electronics.avm.Factory = function()
{ 
}

/* Utility properties starts here */  

/**
 * @access public
 * @var object jQuery instance
 */

Electronics.avm.Factory.prototype.jQuery = Electronics.core.jQuery;

/* Utility properties ends here */ 

/* Core methods starts here */

/**
 * Method that loads models.
 *   
 * Method loads model classes, instantiates model objects and makes necessary preparations.
 * Note that this method does not initialises model objects.
 * 
 * @access public
 * 
 * @param object usrDep array of model configuration objects.
 * 
 * @return object promise object.
 *                           
 */ 
         
Electronics.avm.Factory.prototype.loadModels = function(usrDep)
{
    var self = this;  
    var dependency = null;
    var config = null;
    
    var models = new Array();
    var modelsConfigs = new Array();
    var modelsNames = new Array();
    var modelsPaths = new Array();
    
    var deferred = this.jQuery.Deferred(); 
    var errorObj = null;
    
    if (typeof usrDep != 'object') {
        deferred.resolve(models);
        return deferred.promise(); 
    } else if (usrDep.length == 0) {
        deferred.resolve(models);
        return deferred.promise(); 
    }
    
    // Traverse all dependencies
    for (dependency in usrDep) {
        config = this.prepConf(usrDep[dependency]);
        
        modelsConfigs.push(config);
        modelsNames.push(config.name);
        modelsPaths.push('avm/' + config.appType + '/' + config.version + '/models/' + config.className);    
    }

    // Models load
    if (modelsPaths.length != 0) {     
        require(modelsPaths, function() {            
            var i = 0;
            
            // Create apps
            for (i = 0; i < arguments.length; i++) {
                models[modelsNames[i]] = new arguments[i](modelsConfigs[i]); 
            }  

            deferred.resolve(models); 
        }, function(err){ 
            errorObj = new Error('Cannot load modles');
            errorObj.number = 11213;
            errorObj.name = 'Factory error';
            errorObj.description = 'Cannot load classes files: ' + err.requireModules.toString();     
        
            deferred.reject(errorObj);                    
        });  
    } else {
        deferred.resolve(models);    
    }     
    
    return deferred.promise();      
}

/**
 * Method that loads helpers.
 *   
 * Method loads helper classes, instantiates helper objects and makes necessary preparations.
 * Note that this method does not initialises helper objects.
 * 
 * @access public
 * 
 * @param object usrCont jQuery element or AVM object in which search for applications will be performed.
 * 
 * @return object promise object.
 *                           
 */ 

Electronics.avm.Factory.prototype.loadHelpers = function(usrCont)
{
    var tmpSelf = this;
    
    var helpersConts = null;
    var helpersFiltered = new Array();
    
    var helper = null;
    var helpers = new Array();
    var helpersConfigs = new Array();
    var helpersNames = new Array();
    var helpersPaths = new Array();    
      
    var deferred = this.jQuery.Deferred(); 
    var errorObj = null; 
    
    if (typeof usrCont == 'undefined') {
        errorObj = new Error('Cannot load helpers');
        errorObj.number = 11214;
        errorObj.name = 'Factory error';
        errorObj.description = 'Parent container is not set'; 
        
        deferred.reject(errorObj);   
    } else if (typeof usrCont == 'string') {
        helpersConts = this.jQuery(usrCont).find('*[data-electronics="true"][data-type="helper"]');
    } else if (typeof usrCont == 'object') {
        
        // if is AVM object
        if (typeof usrCont.replaceCont != 'undefined') {
            if (usrCont.replaceCont === true) {
                helpersConts = usrCont.getContainer().find('*[data-electronics="true"][data-type="helper"]').andSelf().filter('*[data-electronics="true"][data-type="helper"]');
            } else {
                helpersConts = usrCont.getContainer().find('*[data-electronics="true"][data-type="helper"]');
            }
        } else {
            helpersConts = usrCont.find('*[data-electronics="true"][data-type="helper"]');
        }                 
    } else {
        errorObj = new Error('Cannot load helpers');
        errorObj.number = 11215;
        errorObj.name = 'Factory error';
        errorObj.description = 'Helpers containers not found'; 
        
        deferred.reject(errorObj); 
    }
    
    // Iterate through helpers containers
    this.jQuery.each(helpersConts, function(usrIndex, usrValue) { 
        var tmpElm = tmpSelf.jQuery(usrValue);        
        var tmpConfig = tmpSelf.loadConfigsFromElm(tmpElm);

        // Save helper containers
        if (typeof helpersFiltered[tmpConfig.name] == 'undefined') {
            helpersFiltered[tmpConfig.name] = {
                conts: new Array(tmpElm),
                config: tmpConfig                                   
            }    
        } else {
            helpersFiltered[tmpConfig.name].conts.push(tmpElm);
        }                                    
    });  

    // Helpers preparation 
    for (helper in helpersFiltered) {   
        helpersFiltered[helper].config.containers = helpersFiltered[helper].conts;

        helpersConfigs.push(helpersFiltered[helper].config);
        helpersNames.push(helpersFiltered[helper].config.name);
        helpersPaths.push('avm/' + helpersFiltered[helper].config.appType + '/' + helpersFiltered[helper].config.version + '/helpers/' + helpersFiltered[helper].config.className);     
    }      
   
    // Views load
    if (helpersPaths.length != 0) {     
        require(helpersPaths, function() {   
            var i = 0;
            
            // Create views
            for (i = 0; i < arguments.length; i++) {
                helpers[helpersNames[i]] = new arguments[i](helpersConfigs[i]); 
            }  

            deferred.resolve(helpers); 
        }, function(err){ 
            errorObj = new Error('Cannot load helpers');
            errorObj.number = 11216;
            errorObj.name = 'Factory error';
            errorObj.description = 'Cannot load classes files: ' + err.requireModules.toString();     
        
            deferred.reject(errorObj);              
        });  
    } else {        
        deferred.resolve(helpers);
    }    
    
    return deferred.promise();      
}

/**
 * Method that loads views.
 *   
 * Method loads view classes, instantiates view objects and makes necessary preparations.
 * Note that this method does not initialises view objects.
 * 
 * @access public
 * 
 * @param object usrCont jQuery element or AVM object in which search for applications will be performed.
 * 
 * @return object promise object.
 *                           
 */ 

Electronics.avm.Factory.prototype.loadViews = function(usrCont)
{
    var tmpSelf = this;
    
    var views = new Array();
    var viewsConts = null;
    var viewsConfigs = new Array();
    var viewsNames = new Array();
    var viewsPaths = new Array();
    
    var deferred = this.jQuery.Deferred(); 
    var errorObj = null; 
    
    if (typeof usrCont == 'undefined') {
        errorObj = new Error('Cannot load views');
        errorObj.number = 11212;
        errorObj.name = 'Factory error';
        errorObj.description = 'Parent container is not set'; 
        
        deferred.reject(errorObj);   
    } else if (typeof usrCont == 'string') {
        viewsConts = this.jQuery(usrCont).find('*[data-electronics="true"][data-type="view"]');
    } else if (typeof usrCont == 'object') {
        
        // if is AVM object
        if (typeof usrCont.replaceCont != 'undefined') {
            if (usrCont.replaceCont === true) {
                viewsConts = usrCont.getContainer().find('*[data-electronics="true"][data-type="view"]').andSelf().filter('*[data-electronics="true"][data-type="view"]');
            } else {
                viewsConts = usrCont.getContainer().find('*[data-electronics="true"][data-type="view"]');
            }
        } else {
            viewsConts = usrCont.find('*[data-electronics="true"][data-type="view"]');
        }              
    } else {
        errorObj = new Error('Cannot load views');
        errorObj.number = 11208;
        errorObj.name = 'Factory error';
        errorObj.description = 'Views containers not found'; 
        
        deferred.reject(errorObj); 
    }

    // Iterate through views containers
    this.jQuery.each(viewsConts, function(usrIndex, usrValue) {    
        var tmpElm = tmpSelf.jQuery(usrValue);        
        var tmpConfig = tmpSelf.loadConfigsFromElm(tmpElm);
        
        if (viewsNames.indexOf(tmpConfig.name) != -1) {
            errorObj = new Error('Cannot load views');
            errorObj.number = 11209;
            errorObj.name = 'Factory error';
            errorObj.description = 'Duplicate view name: ' + tmpConfig.name; 
        
            deferred.reject(errorObj);  
        }         
                                   
        viewsConfigs.push(tmpConfig);
        viewsNames.push(tmpConfig.name);
        viewsPaths.push('avm/' + tmpConfig.appType + '/' + tmpConfig.version + '/views/' + tmpConfig.className);
    });  
    
    // Views load
    if (viewsPaths.length != 0) { 
        require(viewsPaths, function() {   
            var i = 0;
            
            // Create views
            for (i = 0; i < arguments.length; i++) {
                views[viewsNames[i]] = new arguments[i](viewsConfigs[i]); 
            }  
            deferred.resolve(views); 
        }, function(err){
            errorObj = new Error('Cannot load views');
            errorObj.number = 11211;
            errorObj.name = 'Factory error';
            errorObj.description = 'Cannot load classes files: ' + err.requireModules.toString();     
        
            deferred.reject(errorObj);              
        });  
    } else {        
        deferred.resolve(views);
    }    

    return deferred.promise();  
}

/**
 * Method that loads applications.
 *   
 * Method loads application classes, instantiates application objects and makes necessary preparations.
 * Note that this method does not initialises application objects.
 * 
 * @access public
 * 
 * @param object usrCont jQuery element or AVM object in which search for applications will be performed.
 * 
 * @return object promise object.
 *                           
 */ 

Electronics.avm.Factory.prototype.loadApps = function(usrCont)
{
    var tmpSelf = this;
    
    var apps = new Array();
    var appsConts = null;
    var appsConfigs = new Array();
    var appsNames = new Array();
    var appsPaths = new Array();
    
    var deferred = this.jQuery.Deferred(); 
    var errorObj = null; 
    
    if (typeof usrCont == 'undefined') {
        appsConts = this.jQuery('*[data-electronics="true"][data-type="app"]');    
    } else if (typeof usrCont == 'string') {
        appsConts = this.jQuery(usrCont).find('*[data-electronics="true"][data-type="app"]');
    } else if (typeof usrCont == 'object') {
        
        // if is AVM object
        if (typeof usrCont.replaceCont != 'undefined') {
            if (usrCont.replaceCont === true) {
                appsConts = usrCont.getContainer().find('*[data-electronics="true"][data-type="app"]').andSelf().filter('*[data-electronics="true"][data-type="app"]');
            } else {
                appsConts = usrCont.getContainer().find('*[data-electronics="true"][data-type="app"]');
            }
        } else {
            appsConts = usrCont.find('*[data-electronics="true"][data-type="app"]');
        }       
    } else {
        errorObj = new Error('Cannot load apps');
        errorObj.number = 11204;
        errorObj.name = 'Factory error';
        errorObj.description = 'Apps containers not found'; 
        
        deferred.reject(errorObj);    
    }
    
    // Iterate through apps containers
    this.jQuery.each(appsConts, function(usrIndex, usrValue) {    
        var tmpElm = tmpSelf.jQuery(usrValue);        
        var tmpConfig = tmpSelf.loadConfigsFromElm(tmpElm);
        
        if (appsNames.indexOf(tmpConfig.name) != -1) {
            errorObj = new Error('Cannot load apps');
            errorObj.number = 11205;
            errorObj.name = 'Factory error';
            errorObj.description = 'Duplicate app name: ' + tmpConfig.name; 
        
            deferred.reject(errorObj);  
        }         
                                       
        appsConfigs.push(tmpConfig);
        appsNames.push(tmpConfig.name);
        appsPaths.push('avm/' + tmpConfig.appType + '/' + tmpConfig.version + '/apps/' + tmpConfig.className);
    });

    // Apps load
    if (appsPaths.length != 0) {     
        require(appsPaths, function() {
            var siblingApps = null;
            
            var i = 0;
            var j = 0;
            
            // Create apps
            for (i = 0; i < arguments.length; i++) {
                apps[appsNames[i]] = new arguments[i](appsConfigs[i]); 
            }  
           
            // Sibling apps add
            for (i in apps) {
                siblingApps = new Array();
                
                for (j in apps) {
                    if (j == i) {
                        continue;
                    }
                    
                    siblingApps[j] = apps[j];
                }                
                
                apps[i].setSiblingApps(siblingApps);
            }
                                   
            deferred.resolve(apps); 
        }, function(err){ 
            errorObj = new Error('Cannot load apps');
            errorObj.number = 11207;
            errorObj.name = 'Factory error';
            errorObj.description = 'Cannot load classes files: ' + err.requireModules.toString();     
        
            deferred.reject(errorObj);             
        });  
    } else {
        errorObj = new Error('Cannot load apps');
        errorObj.number = 11206;
        errorObj.name = 'Factory error';
        errorObj.description = 'No file paths found';     
        
        deferred.reject(errorObj);    
    }
    
    return deferred.promise();
}   

/**
 * Method that prepares configuration options extracted from the HTML element.
 *   
 * Method prepares configuration options, if some otptions not present - this method will set default values instead. 
 * 
 * @access public
 * 
 * @param object usrConf configuration object.
 * 
 * @throws Error 
 * 
 * @return object with configuration options.
 *                           
 */ 

Electronics.avm.Factory.prototype.prepConf = function(usrConf)
{
    var errorObj = null; 
    
    if (typeof usrConf != 'object') {
        errorObj = new Error('Cannot prepare configuration properties');
        errorObj.number = 11202;
        errorObj.name = 'Factory error';
        errorObj.description = 'Parameter is not an object'; 
        
        throw errorObj;
    }
        
    if (typeof usrConf.appType != 'string') {
        usrConf.appType = 'js';
    }
    usrConf.appType = usrConf.appType.toLowerCase();

    if (typeof usrConf.version != 'string') {
        usrConf.version = '1.0';
    }
     
    if (typeof usrConf.className == 'string') {
        usrConf.className = usrConf.className.toLowerCase();
    }
    
    if (typeof usrConf.name == 'string') {
        usrConf.name = usrConf.name.toLowerCase();
    }
    
    if (usrConf.className == undefined && usrConf.name == undefined) {
        errorObj = new Error('Cannot prepare configuration properties');
        errorObj.number = 11203;
        errorObj.name = 'Factory error';
        errorObj.description = 'Class name and object name are not set'; 
        
        throw errorObj;
    } else if (usrConf.className != undefined && usrConf.name == undefined) {
        usrConf.name = usrConf.className;
    } else if (usrConf.className == undefined && usrConf.name != undefined) {
        usrConf.className = usrConf.name;
    }
                                    
    if (typeof usrConf.lang != 'string') {
        usrConf.lang = 'en';
    }   
    usrConf.lang = usrConf.lang.toLowerCase();
    
    if (typeof usrConf.replaceCont != 'string') {
        usrConf.replaceCont = 'false';
    }
    
    usrConf.replaceCont = usrConf.replaceCont.toLowerCase();
    if (usrConf.replaceCont == 'true') {
        usrConf.replaceCont = true;
    } else {
        usrConf.replaceCont = false;
    }
    
    if (typeof usrConf.insertHtml != 'string') {
        usrConf.insertHtml = 'false';
    }
    
    usrConf.insertHtml = usrConf.insertHtml.toLowerCase();
    if (usrConf.insertHtml == 'true') {
        usrConf.insertHtml = true;
    } else {
        usrConf.insertHtml = false;
    }      
    
    if (typeof usrConf.isSingle != 'string') {
        usrConf.isSingle = 'false';
    }    
    
    usrConf.isSingle = usrConf.isSingle.toLowerCase();
    if (usrConf.isSingle == 'true') {
        usrConf.isSingle = true;
    } else {
        usrConf.isSingle = false;
    }    
    
    return usrConf;
}

/**
 * Method that extracts configuration properties from the HTML element.
 *   
 * Simple method that extracts configuration properties from the HTML element. 
 * 
 * @access public
 * 
 * @param object usrElm jQuery object that represents HTML element.
 * 
 * @throws Error 
 * 
 * @return object with configuration options.
 *                           
 */ 

Electronics.avm.Factory.prototype.loadConfigsFromElm = function(usrElm)
{
    var configs = {};
    var errorObj = null; 
    
    if (typeof usrElm == 'undefined') {
        errorObj = new Error('Cannot extract configuration properties');
        errorObj.number = 11201;
        errorObj.name = 'Factory error';
        errorObj.description = 'Parameter is not an object'; 
        
        throw errorObj;
    }
    
    configs.container = usrElm;
    
    configs.type = usrElm.attr('data-type');
    configs.appType = usrElm.attr('data-apptype');
    configs.version = usrElm.attr('data-version');   
    configs.className = usrElm.attr('data-classname');
    configs.name = usrElm.attr('data-name'); 
    configs.lang = usrElm.attr('data-lang');    
    configs.replaceCont = usrElm.attr('data-replacecont');  
    configs.insertHtml = usrElm.attr('data-inserthtml');
    configs.isSingle = usrElm.attr('data-issingle');
    
    return this.prepConf(configs);
}

/* Core methods ends here */
          
}); 