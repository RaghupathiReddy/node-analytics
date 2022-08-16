function removeWhitepaces(string){
  return string.replace(/\s/g, "");
}
function isFieldEmpty(field){
  if(field != undefined && field != null && field != "" && removeWhitepaces(field) != "")
      return false;
  return true;
}
function isFieldObject(field){
  if(field !== null && typeof field === "object"  && !Array.isArray(field))
      return true;
  return false;
}

  exports.isFieldObject = isFieldObject;
  exports.removeWhitepaces = removeWhitepaces; 
  exports.isFieldEmpty = isFieldEmpty; 