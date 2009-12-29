/** Net - XMLHTTP Interface - bfults@gmail.com - 2006-08-29                 **
 ** Code licensed under Creative Commons Attribution-ShareAlike License     **
 ** http://creativecommons.org/licenses/by-sa/2.5/                          **/

/** Net asynchronous request library **/
Net = function()
{
  this.Request = Net._createRequestObject();
}

/** Net.get({
   url: [string] -- URL to make the request to,
   vars: [string|object] (optional) -- object or string of querystring vars,
   onsuccess: [function] -- function reference to call on success,
   onerror: [function] (optional) -- function reference to call on error
 }) -- make an HTTP GET request
 ** Returns true on successful request dispatch, false on error.
 **/
Net.get = function(oArgs)
{
  if (oArgs.url && oArgs.onsuccess)
  {
    if (typeof oArgs.vars == "object")
    {
      oArgs.vars = '?'+ Net._serializeObject(oArgs.vars);
    }
    else if (typeof oArgs.vars == "string"
             && oArgs.vars.length > 0
             && !/\?/.test(oArgs.vars))
    {
      oArgs.vars = '?' + oArgs.vars;
    }
    if (!oArgs.vars) oArgs.vars = '';
    oArgs.onerror = oArgs.onerror || Net._fnErrorDefault;
    try {
      var N = new Net();
      N.Request.open("GET", oArgs.url + oArgs.vars, true);
      N._setCallback(oArgs.onsuccess, oArgs.onerror);
      N.Request.send('');
    }
    catch (e)
    {
      oArgs.onerror("initialization");
      return false;
    }
  }
  else
  {
    return false;
  }
  return true;
}

/** Net.post({
   url: [string] -- URL to make the request to,
   vars: [string|object] (optional) -- object or string of post vars,
   onsuccess: [function] -- function reference to call on success,
   onerror: [function] (optional) -- function reference to call on error
 }) -- make an HTTP POST request
 ** Returns true on successful request dispatch, false on error.
 **/
Net.post = function(oArgs)
{
  if (oArgs.url && oArgs.onsuccess)
  {
    if (typeof oArgs.vars == "object")
    {
      oArgs.vars = Net._serializeObject(oArgs.vars);
    }
    if (!oArgs.vars) oArgs.vars = '';
    oArgs.onerror = oArgs.onerror || Net._fnErrorDefault;
    try {
      var N = new Net();
      N.Request.open("POST", oArgs.url, true);
      N._setCallback(oArgs.onsuccess, oArgs.onerror);
      N.Request.setRequestHeader("Method", "POST "+oArgs.url+" HTTP/1.1");
      N.Request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      N.Request.send(oArgs.vars);
    }
    catch (e)
    {
      oArgs.onerror("initialization");
      return false;
    }
  }
  else
  {
    return false;
  }
  return true;
}

// a default error function showing the structure (does nothing)
Net._fnErrorDefault = function(sType, Request)
{
  switch (sType)
  {
    case "timeout":
    // it was a timeout (Request undefined)
    alert("XMLHTTP timeout.");
    break;

    case "initialization":
    // initialization error (Request undefined)
    alert("XMLHTTP initialization failure.")
    break;

    default:
    // other error (HTTP status, etc.)
    alert("XMLHTTP error: ["+ Request.status +"] "+ Request.statusText);
  }
}

// a helper function to serialize an object
Net._serializeObject = function(oFrom)
{
  var aTemp = [];
  for (var i in oFrom)
  {
    aTemp.push(encodeURIComponent(i) +"="+ encodeURIComponent(oFrom[i]));
  }
  return aTemp.join('&');
}

/** Net._setCallback(fnCallback, fnError)
 ** Attaches (and wraps) a request object with a user-defined callback.
 ** Optional fnError: call upon erroneous HTTP status code or timeout.
 **/
Net.prototype._setCallback = function(fnCallback, fnError)
{
  this.Request.onreadystatechange = (function (oNet)
  {
    return function()
    {
      if (oNet.Request.readyState == 4)
      {
        window.clearTimeout(oNet.timeout);

        try {
          if (oNet.Request.status === undefined
            || oNet.Request.status === 0
            || (oNet.Request.status >= 200 && oNet.Request.status < 300)
            || oNet.Request.status == 304)
          {
            fnCallback(oNet.Request);
          }
          else
          {
            fnError("other", oNet.Request);
          }
        } catch (e) {
          fnError("other", oNet.Request);
        }
      }
    }
  })(this);

  this.timeout = window.setTimeout((function(oNet) {
    return function() {
      oNet.Request.onreadystatechange = function() {};
      oNet.Request = null;
      fnError("timeout"); }})(this), 20000);
}

/** Net._createRequestObject()
 ** Creates and returns an XMLHTTP element or null on failure.
 **/
Net._createRequestObject = function()
{
  var xmlhttp;
  if (window.XMLHttpRequest) { xmlhttp = new XMLHttpRequest(); }
  else if (window.ActiveXObject) {
    try { xmlhttp = new ActiveXObject("Msxml2.XMLHTTP"); }
    catch (e) { try { xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); }
    catch (e) { xmlhttp = null; }}
  }
  return xmlhttp;
}
/** End Net asynchronous request library */
