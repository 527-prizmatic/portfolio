function setButtonSel(_btn_id) {
  var txt = "sidebar-button-" + _btn_id;
  var el = document.getElementById("iframe-sidebar").contentDocument.getElementById(txt);
  el.removeAttribute("href");
  var btn = el.getElementsByClassName("sidebar-button")[0];
  btn.setAttribute("class", "sidebar-button button-selected");
}
