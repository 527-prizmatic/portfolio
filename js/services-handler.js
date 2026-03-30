function services_init() {
  $("#content-wrapper").load("services/index.html", function() {
    load_gallery([populate_img_fields_random]);
  });
}

function services_fade_in() { $("#content-wrapper:hidden").fadeIn(250); }

function services_show(page) {
  $("#content-wrapper").fadeOut(250, function() {
    $("#content-wrapper:hidden").load("services/" + page + ".html");
	services_fade_in();
  });
}

function services_show_index() {
  $("#content-wrapper").fadeOut(250, function() {
    $("#content-wrapper:hidden").load("services/index.html", function() {
      load_gallery([populate_img_fields_random]);
    });
	services_fade_in();
  });
}
