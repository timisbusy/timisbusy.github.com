var timisbusy = timisbusy || {};

timisbusy.views = timisbusy.views || {};
timisbusy.models = timisbusy.models || {};

timisbusy.models.MarquisItem = Backbone.Model.extend({
  defaults: {
    headline: "Test",
    background: "/images/monkey.jpeg",
    url: "http://timisbusy.com",
    body: "Lorem ipsum.",
    buttonCopy: "Click Me"
  }
});

timisbusy.models.List = Backbone.Model.extend({
  defaults: {
    headline: "Test",
    image: "/images/monkey.jpeg",
    url: "http://timisbusy.com",
    text: "Lorem ipsum.",
    items: [],
    listNumber: 0
  }
});

timisbusy.views.MarquisItem = Backbone.View.extend({
  tagname: "div",
  initialize: function (options) {
    _.bindAll(this);
    this.render();
    this.hide();
  },
  template: Handlebars.compile(timisbusy.templates.marquisItemTemplate),
  render: function () {
    $(this.el).html(this.template(this.model.toJSON()));
  },
  hide: function () {
    $(this.el).addClass('hidden');
  },
  show: function () {
    $(this.el).removeClass('hidden');
    this.setBackground();
  },
  setBackground: function () {
    var self = this;
    $.backstretch(this.model.get('background'));
  }
});

timisbusy.views.List = Backbone.View.extend({
  addItem: function (options) {
    this.counter++;
    var testId = 'item' + this.counter;
    var newItem = $("<li/>", { class: testId }).appendTo($(this.el).children('ul'));
    _.extend(options, { el: newItem });
    var newItem = new timisbusy.views.ListItem(options);
    this.elements.push(newItem);
  },
  elements: [],
  tagname: "div",
  initialize: function (options) {
    this.counter = 0;
    this.model = options.model;
    this.listNumber = this.model.get('listNumber');
    this.itemType = options.itemType;
    this.render();
  },
  listCounter: 0,
  render: function () {
    $(this.el).html(this.template(this.model.toJSON()));
    if (this.listNumber % 2 === 0) {
      $(this.el).addClass('right');
    }
  },
  template: Handlebars.compile(timisbusy.templates.listTemplate)
});


timisbusy.views.ListItem = Backbone.View.extend({
  tagname: "li",
  initialize: function (options) {
    this.render();
  },
  render: function () {
    $(this.el).html("<a href = '" + this.model.url + "' target='_blank'>" + this.model.text + "</a>");
  }
});

timisbusy.views.Marquis = Backbone.View.extend({
  build: function (index) {
    if (index >= this.content.length) {
      index = 0;
    }
    if (index < 0) {
      index = this.content.length;
    }
    var itemContent = this.content[index];
    var itemModel = new timisbusy.models.MarquisItem(itemContent);
    var marquisItem = new timisbusy.views.MarquisItem({ el: this.newItem(), model: itemModel });
    this.currentActive = index;
    this.items.push(marquisItem);
    this.transition();
  },
  tagname: "div",
  initialize: function (options) {
    _.bindAll(this);
    this.options = options || {};
    this.content = this.options.content || [];
    this.default = this.options.default || 0;
    this.counter = 0;
    this.render();
  },
  items: [],
  next: function () {
    this.swap(this.currentActive + 1);
  },
  newItem: function () {
    var id = 'marquis' + this.counter;
    this.counter++;
    $("<div/>", { id: id}).appendTo(this.el);
    return '#' + id;
  },
  render: function () {
    this.build(this.default);
  },
  startSwapping: function () {
    this.swapping = setInterval(this.next, 6000);
  },
  killSwapping: function () {
    if (this.swapping) {
      clearInterval(timisbusy.swapping);
    }
  },
  swap: function (index) {
    this.build(index);
  },
  transition: function () {
    if (this.items.length > 1) {
      this.items[this.items.length - 2].hide();
    }
    this.items[this.items.length - 1].show();
  }
});

function buildLists (content) {
  content.forEach(function (list, index) {
    var listId = list.idName;
    $("<div/>", {
      id: listId,
      class: 'list'
    }).appendTo("#lists");
    var listModel = new timisbusy.models.List({ title: list.title, listNumber: index });
    var testList = new timisbusy.views.List({ el: '#' + listId, model: listModel, itemType: timisbusy.views.ListItem });
    list.items.forEach(function (item) {
      testList.addItem({ model: item });
    });
  });
}


$(function () {
  var marquis = new timisbusy.views.Marquis({ content: timisbusy.content.marquis, default: 0, el: "#marquis" });
  buildLists(timisbusy.content.lists);
  marquis.startSwapping();
});
