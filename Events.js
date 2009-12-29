/** Events - bfults@gmail.com - 2006-09-22                                   **
 ** Code licensed under Creative Commons Attribution-ShareAlike License      **
 ** http://creativecommons.org/licenses/by-sa/2.5/                           **/
var Events = {};
Events.pageLoaded = false;
Events.eventStack = [];
Events.unloadStack = [];
Events.loadStack = [];
Events.addHandler = function(xEl, sEvt, fnCB)
{
  bCap = false;
  if (xEl == window)
  {
    if (sEvt == "load")
    {
      Events.loadStack.push(fnCB);
      return true;
    }
    else if (sEvt == "unload")
    {
      Events.unloadStack.push(fnCB);
      return true;
    }
  }

  Events.eventStack.push([!Events.pageLoaded, xEl, sEvt, fnCB, bCap]);

  if (Events.pageLoaded)
  {
    return Events._xbEventAddHandler(xEl, sEvt, fnCB, bCap);
  }
  return true;
}
Events.removeHandler = function(xEl, sEvt, fnCB)
{
  var oEl = (typeof (xEl) == "string") ? document.getElementById(xEl) : xEl;
  bCap = false;
  for (var i=0, el=null; i < Events.eventStack.length; i++)
  {
    el = Events.eventStack[i];
    if (el[1] == oEl && el[2] == sEvt && el[3] == fnCB && el[4] == bCap)
    {
      Events.eventStack.splice(i, 1);
      return _xbEventRemoveHandler(oEl, sEvt, fnCB, bCap);
    }
  }
  return false;
}
Events.getTargetElement = function(evt)
{
  if (!evt && window.event) evt = window.event;
  if (!evt) return null;
  return evt.target || evt.srcElement;
}
Events.stopPropagation = function(evt)
{
  if (!evt && window.event) evt = window.event;
  if (!evt) return false;
  if (evt.stopPropagation) evt.stopPropagation();
  evt.cancelBubble = true;
  return true;
}
Events.preventDefault = function(evt)
{
  if (!evt && window.event) evt = window.event;
  if (!evt) return false;
  if (evt.preventDefault) evt.preventDefault();
  evt.returnValue = false;
  return true;
}
// Private Functions
Events._setup = function()
{
  var el = null;
  Events.pageLoaded = true;

  try
  {
    if (Events.loadStack && Events.loadStack.length)
    {
      for (var i = Events.loadStack.length - 1; i >= 0; i--)
      {
        if (typeof Events.loadStack[i] == "function") Events.loadStack[i]();
        delete Events.loadStack[i];
      }
    }
  } catch(e) {}

  try
  {
    if (Events.eventStack && Events.eventStack.length)
    {
      for (i=0; i < Events.eventStack.length; i++)
      {
        el = Events.eventStack[i];
        if (el[0] == true)
        Events._xbEventAddHandler(el[1], el[2], el[3], el[4]);
      }
    }
  } catch(e) {}
  return true;
}
Events._cleanup = function()
{
  var el = null;
  try
  {
    if (Events.unloadStack && Events.unloadStack.length)
    {
      while (el = Events.unloadStack.pop())
      {
        if (typeof el == "function") el();
      }
    }
    if (Events.eventStack && Events.eventStack.length)
    {
      while (el = Events.eventStack.pop())
      Events._xbEventRemoveHandler(el[1], el[2], el[3], el[4]);
    }
    for (var i in Events) delete Events[i];
    delete window.Events;
  } catch (e) {}
  return true;
}
Events._xbEventRemoveHandler = function(oEl, sEvt, fnCB, bCap)
{
  if (oEl)
  {
    if (!bCap) bCap = false;
    if (oEl.removeEventListener)
    {
      oEl.removeEventListener(sEvt, fnCB, bCap);
      return true;
    }
    else if (oEl.detachEvent)
    {
      return oEl.detachEvent("on"+ sEvt, fnCB);
    }
  }
  return false;
}
Events._xbEventAddHandler = function(xEl, sEvt, fnCB, bCap)
{
  var oEl = (typeof (xEl) == "string") ? document.getElementById(xEl) : xEl;
  if (xEl === window && sEvt == "load")
  {
    // KHTML / WebKit
    if (/KHTML/i.test(navigator.userAgent))
    {
      window._load_timer = setInterval(function() {
        if (/loaded|complete/.test(document.readyState)) {
          clearInterval(window._load_timer);
          fnCB();
        }
      }, 10);
      return true;
    }
    // Gecko
    else if (document.addEventListener)
    {
      document.addEventListener("DOMContentLoaded", fnCB, false);
      return true;
    }
    else
    {
      // IE
      /*@cc_on @*/
      /*@if (@_win32)
      document.write("<script id='__ie_onload' defer src='javascript:void(0)'><\/script>");
      var ie_script = document.getElementById("__ie_onload");
      ie_script.onreadystatechange = function() {
        if (this.readyState == "complete") {
          fnCB();
        }
      };
      return true;
      /*@end @*/
    }
  }
  if (oEl)
  {
    if (!bCap) bCap = false;
    if (oEl.addEventListener)
    {
      oEl.addEventListener(sEvt, fnCB, bCap);
      return true;
    }
    else if (oEl.attachEvent)
    {
      return oEl.attachEvent("on"+ sEvt, fnCB);
    }
  }
  return false;
}
Events._xbEventAddHandler(window, "load", Events._setup, false);
Events._xbEventAddHandler(window, "unload", Events._cleanup, false);
/* End Events */
