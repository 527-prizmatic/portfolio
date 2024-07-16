function services_init() {
  $("#content-wrapper").load("services/index.html", function() {
    load_gallery([populate_img_fields_random]);
  });
}

function services_fade_in() { $("#content-wrapper:hidden").fadeIn(250); }

function services_show_char_art() {
  $("#content-wrapper").fadeOut(250, function() {
    $("#content-wrapper:hidden").load("services/char.html"); services_fade_in();
  });
}

function services_show_illustration() {
  $("#content-wrapper").fadeOut(250, function() {
    $("#content-wrapper:hidden").load("services/illustration.html"); services_fade_in();
  });
}

function services_show_reference() {
  $("#content-wrapper").fadeOut(250, function() {
    $("#content-wrapper:hidden").load("services/reference.html"); services_fade_in();
  });
}

function services_show_icon() {
  $("#content-wrapper").fadeOut(250, function() {
    $("#content-wrapper:hidden").load("services/icon.html"); services_fade_in();
  });
}

function services_show_emote() {
  $("#content-wrapper").fadeOut(250, function() {
    $("#content-wrapper:hidden").load("services/emote.html"); services_fade_in();
  });
}

function services_show_index() {
  $("#content-wrapper").fadeOut(250, function() {
    $("#content-wrapper:hidden").load("services/index.html", function() {
      load_gallery([populate_img_fields_random]);
    }); services_fade_in();
  });
}
