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

Electronics.air = {};

/* Utility methods starts here */

Electronics.air.loadFileContents = function(usrPath)
{
    var tmpPath = null;
    var tmpContents = null;
  
    var tmpStream = null;  
  
    if (typeof usrPath != 'string') {
        return false;
    }
  
    usrPath = air.File.applicationDirectory.resolvePath(usrPath);

    tmpStream = new air.FileStream();
    tmpStream.open(usrPath, air.FileMode.READ);   
    tmpContents = tmpStream.readUTFBytes(tmpStream.bytesAvailable); 
   
    tmpStream.close();
    return tmpContents;   
} 

/* Utility methods ends here */

}); 