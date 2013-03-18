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
* Object Electronics is a part of JavaScript framework - Electronics.
*
* @package Electronics
* @author Selihov Sergei Stanislavovich <red331@mail.ru>
* @copyright Copyright (c) 2010-2013 Selihov Sergei Stanislavovich.
* @license http://www.gnu.org/licenses/gpl.html GNU GENERAL PUBLIC LICENSE (Version 3)
*
*/

define([
       'jqueryui/jquery-ui-1.8.23.custom/js/jquery-1.8.0.min'
       ], 
        function($) {

Electronics = {};
Electronics.core = {};

/* Utility properties starts here */

/**
 * @access public
 * @var object jQuery 
 */

Electronics.core.jQuery = jQuery.noConflict();

/* Utility properties ends here */

/* Utility methods starts here */

/**
 * Method that extends class.
 * 
 * Simple method that extends class.
 * 
 * @access public   
 *
 * @param object usrSubClass class that must be extended
 * @param object usrSuperClass parent class
 *                        
 */     
  
Electronics.core.extendClass = function(usrSubClass, usrSuperClass) 
{
    var tmpDummyClass = function() {};

    tmpDummyClass.prototype = usrSuperClass.prototype;

    usrSubClass.prototype = new tmpDummyClass();
    usrSubClass.prototype.constructor = usrSubClass;
    usrSubClass.superClass = usrSuperClass.prototype;
  
    if(usrSuperClass.prototype.constructor == Object.prototype.constructor) {
        usrSuperClass.prototype.constructor = usrSuperClass;
    }
};
  
/**
 * Method that extends class after its definition has been already written.
 * 
 * Simple method that extends class after its definition has been already written.
 * 
 * @access public   
 *
 * @param object usrSubClass class that must be extended
 * @param object usrSuperClass parent class
 *                        
 */    
  
Electronics.core.extendClassAfter = function(usrSubClass, usrSuperClass) 
{
    var tmpDummyClass = function() {};
    tmpDummyClass.prototype = usrSubClass.prototype;
  
    Electronics.core.extendClass(usrSubClass, usrSuperClass);
  
    for (variable in tmpDummyClass.prototype) {
        usrSubClass.prototype[variable] = tmpDummyClass.prototype[variable]
    }
}; 
  
/* Utility methods ends here */
});
