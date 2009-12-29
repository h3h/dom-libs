/** XHForms - Submits forms via XMLHTTP. - brad@xkr.us - v0.2 - 2004-10-20   **
    Code licensed under Creative Commons Attribution-ShareAlike License
 ** http://creativecommons.org/licenses/by-sa/2.0/                           **/
var tError, hSubmitStrings={}, nXHId=0;
function AttachXHForms()
{
  if (document.getElementsByTagName)
  {
    var cForms = document.getElementsByTagName("form"), cSubmits=null, j=0,
      jlen=0;
    for (var i=0,len=cForms.length; i < len; i++)
    {
      if (HasClass(cForms[i], "xh-form"))
      {
        if (!cForms[i].id) cForms[i].id = "xh" + (nXHId++);
        cForms[i].onsubmit = function() { return !SendXHForm(this); };
        cSubmits = cForms[i].getElementsByTagName("input");
        for (j=0,jlen=cSubmits.length; j < jlen; j++)
          if (/^(?:submit|image)$/.test(cSubmits[j].type.toLowerCase()))
            AttachEvent(cSubmits[j], "click", fnHandleSubmit, false);
        cSubmits = cForms[i].getElementsByTagName("button");
        for (j=0,jlen=cSubmits.length; j < jlen; j++)
          if (!cSubmits[j].type || cSubmits[j].type.toLowerCase() == "submit")
            AttachEvent(cSubmits[j], "click", fnHandleSubmit, false);
      }
    }
  }
}
function SendXHForm(oForm)
{
  var conn = new XHConn(), sXHVars;
  if (!conn)
  {
    fnOnError();
    return false;
  }

  fnBeforeSubmit();
  sXHVars = FormCollect(oForm) +
    ((hSubmitStrings[oForm.id])?'&'+hSubmitStrings[oForm.id]:'');
  tError = setTimeout(function(){ fnOnError(oForm); }, 4500);
  conn.connect(oForm.action, oForm.method, sXHVars, fnAfterSubmit);
  return true;
}
function fnHandleSubmit(e)
{
  if (!e) e=event;
  var elt = e.target||e.srcElement;
  hSubmitStrings[elt.form.id] = encodeURIComponent(elt.name) + '=' +
    encodeURIComponent((elt.value)?elt.value:'');
}
if (fnBeforeSubmit && fnAfterSubmit && fnOnError && AttachEvent && FormCollect
    && XHConn)
  AttachEvent(window, "load", AttachXHForms, false);
