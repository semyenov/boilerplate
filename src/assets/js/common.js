$.fn.serializeObject = function(){
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
    if (o[this.name] !== undefined) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || '');
    } else {
      o[this.name] = this.value || '';
    }
  });
  return o;
};
function showMessage(response) {
  var $message = $("#message");
  console.log(response);
  var title = response.responseJSON._error['message'];
  var text = ''
  if (typeof(response.responseJSON._issues['text']) != 'undefined') {
    text = response.responseJSON._issues['text'];
  }
  $message.find('h6').text(title+":");
  $message.find('p').text(text);
  $message.fadeIn('fast').delay(3000).fadeOut('fast');
}
(function ($) {
  var Question = Backbone.Model.extend({
    urlRoot: 'http://127.0.0.1:5001/questions',
    idAttribute: '_id',
    defaults:{
      'text': "",
      'groups': []
    }
  });

  var QuestionView = Backbone.View.extend({
    tagName:"div",
    className:"question",
    template:$("#questionTemplate").html(),
    events: {
      "click .close": "deleteQuestion"
    },
    render:function () {
      var tmpl = _.template(this.template); //tmpl is a function that takes a JSON object and returns html
      this.$el.html(tmpl(this.model.toJSON())); //this.el is what we defined in tagName. use $el to get access to jQuery html() function
      return this;
    },
    deleteQuestion:function () {
      var that = this;
      this.model.destroy({
        headers: {"If-Match": that.model.attributes['_etag']},
        success:function () {
          that.remove();
        },
        error: function (data,response) {
          showMessage(response);
        }
      });
    }
  });

  var QuestionCollection = Backbone.PageableCollection.extend({
    model: Question,
    url: 'http://127.0.0.1:5001/questions',
    parse: function(data) {
      return data._items;
    },
    state: {
      firstPage: 1
    },
    queryParams: {
      currentPage: "page",
      pageSize: "max_results",
    }
  });

  var QuestionCollectionView = Backbone.View.extend({
    el:$("#questions"),
    events: {
      "click #add": "addQuestion"
    },

    initialize:function(){
      this.collection = new QuestionCollection();
      this.collection.getFirstPage();
      this.render();
      console.log(this.collection);
      this.collection.on('add', this.renderQuestion, this);
      this.collection.on("reset", this.render, this);
    },

    render: function(){
      var that = this;
      _.each(this.collection.models, function(item){
        that.renderQuestion(item);
      }, this);
    },

    renderQuestion:function(item){
      var questionView = new QuestionView({
        model: item
      });
      this.$el.append(questionView.render().el);
    },

    addQuestion: function(e){
      e.preventDefault();
      var formData = $('#addQuestion').serializeObject();
      if (typeof(formData.groups) == 'string') {
        formData.groups = [formData.groups];
      }
      this.collection.create(new Question(formData), {
        error: function (data, response) {
          showMessage(response);
        }
      });
    }
  });

  var QuestionGroup = Backbone.Model.extend({
    urlRoot: 'http://127.0.0.1:5001/question_groups',
    idAttribute: '_id',
    defaults:{
      'title': ""
    }
  });

  var QuestionGroupCollection = Backbone.Collection.extend({
    model: QuestionGroup,
    url: 'http://127.0.0.1:5001/question_groups',
    parse: function(data) {
      return data._items;
    }
  });

  var QuestionGroupCollectionView = Backbone.View.extend({
    el:$("#question_groups"),
    template:$("#questionGroupTemplate").html(),

    initialize:function(){
      this.collection = new QuestionGroupCollection();
      var that = this;
      this.collection.fetch({
        success: function (data) {
          that.render();
        }
      });
      this.collection.on("reset", this.render, this);
    },

    render:function () {
      var tmpl = _.template(this.template); //tmpl is a function that takes a JSON object and returns html
      var o = [];
      o['models']=[]
      _.each(this.collection.models, function(item){
        o['models'].push(item.toJSON());
      }, this);
      console.log(o);
      this.$el.html(tmpl(o) ); //this.el is what we defined in tagName. use $el to get access to jQuery html() function
      return this;
    }
  });

  var questionCollectionView = new QuestionCollectionView;
  var questionGroupCollectionView = new QuestionGroupCollectionView;
})(jQuery);
