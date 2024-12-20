gallery = [];
gallery_titles = [];
gallery_size = 0;
gallery_used = [];
gallery_overlay_visible = false;
bg_list = [];

// Attempts to load the gallery from the dedicated JSON file
function load_gallery(_callback) {
  $.getJSON("media/gallery/gallery.json", function (data) {
    gallery.length = 0;
    gallery_used.length = 0;
    gallery_size = 0;
    $.each(data, function(key, val) {
      var url = "media/gallery/" + key;
      gallery.push(url);
	  gallery_titles.push(val);
      gallery_size++;
    });

    $.getJSON("media/wallpapers/wallpapers.json", function (data) {
      bg_list.length = 0;
      $.each(data, function(key, val) {
        var url = "media/wallpapers/" + val;
        bg_list.push(url);
      });

      load_bg_random();
    });

    for (let i = 0; i < gallery_size; i++) gallery_used.push(false);
    for (f of _callback) f();
  });
}

function populate_gallery() {
  var line = 2;
  var line1 = document.getElementById("gallery-line-1");
  var line2 = document.getElementById("gallery-line-2");
  while (line1.hasChildNodes()) line1.removeChild(line1.firstChild);
  while (line2.hasChildNodes()) line2.removeChild(line2.firstChild);

  for (let i = 0; i < gallery_size; i++) {
    var img_next = fetch_next();
//    img_next += "?t=" + (new Date().getTime());
    var title = img_next.title;

    document.getElementById("gallery-line-" + line).innerHTML += "<img class='img-field-gallery hover-brighten' onload='stretch_gallery();' src='" + img_next.url + "' title='" + title + "' onclick='gallery_overlay_fade_in(\"" + img_next.url + "\");'>";
    line = line == 1 ? 2 : 1;
  }
}

function stretch_gallery() {
    var wrapper = document.getElementById("gallery-wrapper");

    wrapper.parentNode.style.width = String(wrapper.parentNode.parentNode.offsetWidth) + "px";
    wrapper.style.width = String(wrapper.parentNode.parentNode.offsetHeight * 0.75) + "px";

    var line1 = document.getElementById("gallery-line-1");
    var line2 = document.getElementById("gallery-line-2");

    var lheight1 = wrapper.offsetWidth * 0.5 - 5;
    var lheight2 = wrapper.offsetWidth * 0.5 - 5;

    var llen1 = 0;
    var llen2 = 0;

    for (let i = 0; i < line1.children.length; i++) {
      var img = line1.children.item(i);
      var ratio = lheight1 / img.naturalHeight;
      img.style.height = String(lheight1) + "px";
      img.style.marginTop = String((img.offsetWidth - img.offsetHeight) * 0.5 + 5) + "px";
      img.style.marginBottom = String((img.offsetWidth - img.offsetHeight) * 0.5 + 5) + "px";
      llen1 += img.naturalWidth * ratio;
    }

    var llen2max = 0;
    for (let i = 0; i < line2.children.length; i++) {
      var img = line2.children.item(i);
      var ratio = lheight2 / img.naturalHeight;
      img.style.height = String(lheight2) + "px";
      img.style.marginTop = String((img.offsetWidth - img.offsetHeight) * 0.5 + 5) + "px";
      img.style.marginBottom = String((img.offsetWidth - img.offsetHeight) * 0.5 + 5) + "px";
      llen2 += img.naturalWidth * ratio;
    }

    line1.style.height = String(llen1 + (line1.children.length - 1) * 20) + "px";
    line2.style.height = String(llen2 + (line2.children.length - 1) * 20) + "px";
    wrapper.style.height = String(wrapper.parentNode.offsetWidth) + "px";
    wrapper.style.margin = String((Math.min(wrapper.offsetHeight, wrapper.offsetWidth) - Math.max(wrapper.offsetHeight, wrapper.offsetWidth)) * 0.5) + "px";
}

// FIXME Look into why the first fadein is instantaneous
function gallery_overlay_fade_in(img_id) {
  if (!gallery_overlay_visible) {
    gallery_overlay_visible = true;
    gallery_overlay_change(img_id);
    document.getElementById("gallery-overlay").style.visibility = "visible";
    $("#gallery-overlay").fadeIn(250, function() { document.getElementById("gallery-overlay").style.visibility = "visible"; });
  }
}

function gallery_overlay_change(img_id) {
  var img = document.getElementById("gallery-overlay-img");
  img.src = img_id;
}

function gallery_overlay_change_prev() {
  var i;
  var img_id = document.getElementById("gallery-overlay-img").getAttribute("src").split('?')[0];
  for (i = 0; i < gallery_size; i++) {
    if (gallery[i] == img_id) break;
  }

  if (i == 0 || i >= gallery_size) return;
  $("#gallery-overlay-img").fadeOut(250, function() {
    gallery_overlay_change(gallery[i - 1]);
    $("#gallery-overlay-img").fadeIn(250);
  });
}

function gallery_overlay_change_next() {
  var i;
  var img_id = document.getElementById("gallery-overlay-img").getAttribute("src").split('?')[0];
  for (i = 0; i < gallery_size; i++) {
    if (gallery[i] == img_id) break;
  }

  if (i >= gallery_size - 1) return;
  $("#gallery-overlay-img").fadeOut(250, function() {
    gallery_overlay_change(gallery[i + 1]);
    $("#gallery-overlay-img").fadeIn(250);
  });
}

function gallery_overlay_fade_out() {
  if (!gallery_overlay_visible) return;
  gallery_overlay_visible = false;
  $("#gallery-overlay").fadeOut(250, function() { document.getElementById("gallery-overlay").style.visibility = "hidden"; });
}

// TODO Dissociate wallpapers from the main gallery
function load_bg_random() {
  document.body.style.backgroundImage = "linear-gradient(#000B, #000F), url(\"" + fetch_bg_random() + "\")";
}

function populate_img_fields_random() {
  var fields = document.getElementsByClassName("img-field-random");
  var style = "width: 100%; height: 100%;"
  for (let i = 0; i < fields.length; i++) {
  	var img = fetch_random();
    fields[i].src = img.url;
    fields[i].title = img.title;
    fields[i].setAttribute("style", style);
  }
}

// Gets the URL to the next unused element of the gallery, returning a placeholder error if no images are available
function fetch_next() {
  for (let i = 0; i < gallery_size; i++) {
    if (!gallery_used[i]) {
      gallery_used[i] = true;
      return { "url": gallery[i], "title": gallery_titles[i] };
    }
  }
  return { "url": "media/oops.png", "title": "An error occured loading this image" };
}

// Gets the URL to a random element of the gallery, returning a placeholder error if no images are available
function fetch_random() {
  // Checking if there are any free pictures left, returning an error if not
  // TODO Figure out a better system for this, probably by popping already-used elements
  var ctr = 0;
  for (let i = 0; i < gallery_size; i++) {
    if (gallery_used[i]) ctr++;
  }
  if (ctr >= gallery_size) return { "url": "media/oops.png", "title": "An error occured loading this image" };

  // Tries to get a random element of the gallery, trying again if its choice is already being unused
  // TODO Figure out a better system for this, probably by popping already-used elements
  while (1) {
    var r = Math.floor(Math.random() * gallery_size);
    if (!gallery_used[r]) {
      gallery_used[r] = true;
      return { "url": gallery[r], "title": gallery_titles[r] };
    }
  }
}

// Gets the URL to a random element of the gallery, returning a placeholder error if no images are available
function fetch_bg_random() {
  if (bg_list.length <= 0) return "media/oops.png";

  var r = Math.floor(Math.random() * bg_list.length);
  return bg_list[r];
}

function clear_used_list() {
  for (let i = 0; i < gallery_size; i++) gallery_used[i] = false;
}
