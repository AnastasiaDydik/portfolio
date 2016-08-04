var elements,
    i;
var Node = function(element) { 
  this.element = element; 
} 

var $ = function(selector) { 
  elements = document.querySelectorAll(selector); 
  return new Node(elements);
} 

window.$ = $;

Node.prototype.html = function () {
  var args = arguments[0];
  if (arguments.length === 0) {
    var content = this.element[0].innerHTML;
    return content;
  } else {
    this.each((index, element) => {
      element.innerHTML = args;
    });
    return this;
  }
}

Node.prototype.css = function (property) {
  var propertyName,
      namesArr;
  if (typeof property === 'string') {
  return this.element[0].style[property];
  } else {
  namesArr = Object.keys.call(property, property);
  for (var i = 0; i < namesArr.length; i++) {
    propertyName = namesArr[i];
    this.each((index, element) => {
    element.style[propertyName] = property[propertyName];
    });
  };
  return this;
  }
}

Node.prototype.data = function(newKey, newValue){
  elements = this.element;
  var length = elements.length,
      value,
      key; 
  if(!arguments.length){ 
    var obj = {}; 
    for(key in elements[0].dataset){ 
      obj[key] = elements[0].dataset[key]; 
    } 
    return obj; 
  } else if(arguments.length == 1){ 
    if(typeof newKey == 'string'){ 
      if(value = elements[0].dataset[newKey]){ 
        return value; 
      } 
    } else if( typeof newKey == 'object'){ 
      for(key in newKey) { 
        for(var i = 0; i < length; i++) { 
          elements[i].dataset[key] = newKey[key]; 
        } 
      } 
    } 
  } else { 
    if(typeof newKey == 'string' && typeof newValue !== 'undefined'){ 
      for(var i = 0; i < length; i++) { 
        elements[i].dataset[newKey] = newValue; 
      } 
    } 
  } 
  return elements; 
}

Node.prototype.one = function (type, handler) {
  this.element[0].addEventListener(type, function(e) {
    e.target.removeEventListener(e.type, arguments.callee);
    return handler(e);
  });
}

Node.prototype.on = function (type, selector, callback) {
  this.each((index, value) => {
    value.addEventListener(type, callback);
  });
  return this;
}

Node.prototype.addClass = function (arg) {
  var classNames;
  if (typeof arg === 'function') {
    this.each((index, value) => {
      var name = arg.call(value, index, value.className);
      if (name) {
        classNames = name.split(" ");
        for (var i = 0; i < classNames.length; i++) {
          value.classList.add(classNames[i]);
        }
      }
    });
  }
  if ( arg && typeof arg === 'string' ) {
    classNames = arg.split( " " );
    for (var i = 0; i < classNames.length; i++) {
      this.each((index, value) => {
        value.classList.add(classNames[i]);
      });
    }
  }
  return this;
}

Node.prototype.attr = function (attribute, value) {
  if (value === undefined) {
  return this.element[0].getAttribute(attribute);
 } else {
  this.each((index, element) => {
    element.setAttribute(attribute, value);
  });
  }
}

Node.prototype.each = function (callback) {
  elements = this.element;
  for (i = 0; i < elements.length; i++) {
    if ( callback.call( elements[i], i, elements[i] ) === false ) {
    break;
    }
  }
  return this;
}