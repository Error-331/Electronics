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
        'electronics/core/core'
        ], 
        function() {

Electronics.validation = {};
 
/* Core methods starts here */ 
 
Electronics.validation.checkLengthLimits = function(usrLength, usrMin, usrMax)
{

    if (usrMin == 'nolimit' && usrMax == 'nolimit') {
        return true;
    } else if (usrMin == 'nolimit' && usrMax != 'nolimit') {
        if (usrLength > usrMax) {
            return false;
        } else {
            return true;
        }
    } else if (usrMin != 'nolimit' && usrMax == 'nolimit') {
        if (usrLength < usrMin) {
            return false;
        } else {
            return true;
        }
    } else if (usrMin != 'nolimit' && usrMax != 'nolimit') {
        if (usrLength > usrMax || usrLength < usrMin) {
            return false;
        } else {
            return true;
		}    
    } 
} 

Electronics.validation.checkTextNotEmpty = function(usrText)
{
    if (typeof usrText != 'string') {
        // throw error
    }
    
    if (usrText.length <= 0) {
        return false;
    } else {
        return true;
    }  
} 

// en, ru 
Electronics.validation.checkTextAlpha = function(usrText)
{
    if (typeof usrText != 'string') {
        // throw error
    }
    
    if (/[^a-zA-ZА-Яа-я]/.test(usrText) == true) {
        return false;
    } else {
        return true;
    }  
} 
  
Electronics.validation.checkTextNumeric = function(usrText)
{
    if (typeof usrText != 'string') {
        // throw error
    }
    
    if (/[^0-9]/.test(usrText) == true) {
        return false;
    } else {
        return true;
    }  
}   

// en, ru 
Electronics.validation.checkTextAlphaNumeric = function(usrText)
{
    if (typeof usrText != 'string') {
        // throw error
    }
    
    if (/[^a-zA-ZА-Яа-я0-9]/.test(usrText) == true) {
        return false;
    } else {
        return true;
    }  
} 

Electronics.validation.checkTextEmail = function(usrText)
{
    if (typeof usrText != 'string') {
        // throw error
    }
    
    if (/^[\w!#$%&'*+/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/.test(usrText) == false) {
        return false;
    } else {
        return true;
    }        
}  
     
Electronics.validation.checkTextElmLengthById = function(usrElmId, usrMin, usrMax)
{
    var tmpElmValue = Electronics.core.jQuery('#'+usrElmId).val();
    var tmpElmLength = tmpElmValue.length;
  
    return this.checkLengthLimits(tmpElmLength, usrMin, usrMax);
}
  
Electronics.validation.checkSelectElmLengthById = function(usrElmId, usrMin, usrMax)
{
    var tmpElmCount = Electronics.core.jQuery('#'+usrElmId+' option:selected').length;
    return this.checkLengthLimits(tmpElmCount, usrMin, usrMax);   
}  
  
/* Core methods ends here */    
}); 