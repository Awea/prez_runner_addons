var conn = new WebSocket("ws://192.168.0.113:8080/ws");
var current_mode = 'prez';

var tabs_query = function(callback){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){ 
    typeof callback === 'function' && callback(tabs);
  });
}

var tab_send_message = function(tab_id, data, callback){
  chrome.tabs.sendMessage(tab_id, {data: data}, function(response){
    typeof callback === 'function' && callback(tab_id, response);
  });
}

var tab_is_selected = function(tab){
  return tab.selected
}

var get_current_tab = function(callback){
  get_tabs(function(tabs){ 
    tab = tabs.filter(tab_is_selected)[0];
    index = -1;
    tabs.forEach(function(t, i) {
      if (this.id == t.id) index=i;
    }, tab); 
    tab.index = index;

    callback(tab);
  });
}

var previous_tab = function(){
  get_current_tab(function(tab){
    index = tab.index - 1;
    change_tab(index);
  });
}

var next_tab = function(){
  get_current_tab(function(tab){
    index = tab.index + 1;
    change_tab(index);
  });
}

var change_tab = function(tab_index){
  chrome.tabs.highlight({tabs: [tab_index]}, function(){});
}

var get_tabs = function(callback){
  chrome.tabs.getAllInWindow(function(tabs){
    callback(tabs);
  });
}

var close_tab = function(){
  get_current_tab(function(tab){
    chrome.tabs.remove(tab.id);
  });
}

var is_tab_mode = function(){
  console.log(current_mode == 'tab');
  return current_mode == 'tab';
}

conn.onmessage = function(evt){
  switch(evt.data){
    case 'prez':
      current_mode = 'prez';
      break;
    case 'window':
      current_mode = 'window';
      break;
    case 'tab':
      current_mode = 'tab';
      break;
    case 'left':
      if (is_tab_mode()){
        previous_tab(); 
      }
      break;
    case 'right':
      if (is_tab_mode()){
        next_tab();
      }
      break;
    case 'B':
      if (is_tab_mode()){
        close_tab();
      }
      break;
    default:
      break;
  }
}