var timisbusy = timisbusy || {};

timisbusy.templates = timisbusy.templates || {};

// ugly trailing slash is required to split template onto new lines

timisbusy.templates.marquisItemTemplate = 
  "<div class='marquisItem')'>\
    <div class='marquisContent'>\
      <h3>{{ headline }}</h3>\
      <p>{{ body }}</p>\
      <a href='{{ url }}' class='button'>{{ buttonCopy }}</a>\
    </div>\
  </div>";

timisbusy.templates.listTemplate = 
  "<h4>{{ title }}</h4>\
    <ul>\
  </ul>";