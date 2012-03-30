/**
*
*   a simple slide show plugin that takes a list of slides for init,
*   lazyload them and play the slideshow.
*
*   Usage:
*    $("#slideshow-container").slideshow({
*       caption_class: "class of div that will contain the caption of the slides",
*       heading_class: "class of div containing heading for the caption"
*       slides: [
*           {
*               'file_name': 'path/to/slide1.jpg',
*               'title': 'Slide 1 title',
*               'caption': 'Slide 1 caption'
*           },
*           ...
*        ],
*       lazyload: true;    //always true for now
*    });
*
*
*   TODOs:
*       - have more transition options than fadein / fadeout
*       - make lazyload none mandatory (slideshow div could already have
*           the images and this plugin would only play it)
*
 **/
(function ($, window, document, undefined) {

    // Create the defaults once
    var pluginName = 'slideshow',
        defaults = {
            caption_class: "ui-caption",
            heading_class: "ui-heading",
            lazyload: true,
            loading_icon: null,
            slides: [],
            transition: 'fade',
            time_interval: 5000
        };

    // The actual plugin constructor
    function Plugin(element, options) {
        if (!element) {
            return;
        }

        //class selectors
        this.$el = $(element);


        // jQuery has an extend method that merges the
        // contents of two or more objects, storing the
        // result in the first object. The first object
        // is generally empty because we don't want to alter
        // the default options for future instances of the plugin
        this.options = $.extend({}, defaults, options);
        this.slides = this.options.slides;
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype.init = function () {
        var self = this;

        if (this.options.lazyload) {
            self.load_slides();
        }
        self.play_slideshow();

        // TODO :: init transitions in and out (blur, slide ...)
        // see if we keep lazyload as an option
        // see if we need loading icons
        // overlay div on li element to display captions

    };

    Plugin.prototype.load_slides = function () {
        var self = this;
        var $ul_wrapper = $("<ul class='ui-slideshow-wrapper' />");
        self.$el.append($ul_wrapper);
        $.each(self.slides, function (i, elt) {
            //create element
            $new_slide = $("<li />").append(
                $("<img>").attr('src', this.src))
                    .addClass('ui-slideshow-slide')
                    .attr('id', 'ui-slideshow-' + i);
            $ul_wrapper.append($new_slide);
            //show first slide asap
            if (i === 0) {
                $new_slide.show();
                //remove background image from overlay
                self.$el.children().css("background-image", "none");
                self.$el.find("." + self.options.caption_class)
                        .html(self.slides[0].caption)
                        .fadeIn("fast");
                self.$el.find("." + self.options.heading_class)
                    .html(self.slides[0].heading)
                    .fadeIn("fast");
            }
            this.loaded = true;

        });
    };

    Plugin.prototype.play_slideshow = function () {
        var self = this;
        var current_slide = 0;
        var next_slide = null;
        setInterval(function () {
            next_slide = (current_slide + 1) % self.slides.length;
            if (self.slides[next_slide].loaded) {
                self.$el.css('background', 'none');
                //hide caption and heading
                self.$el.find("." + self.options.caption_class).fadeOut().html("");
                self.$el.find("." + self.options.heading_class).fadeOut().html("");
                //hide slide
                $("#ui-slideshow-" + current_slide).fadeOut(function () {
                    //show new caption and new header:
                    self.$el.find("." + self.options.caption_class)
                        .html(self.slides[next_slide].caption)
                        .fadeIn("fast");
                    self.$el.find("." + self.options.heading_class)
                        .html(self.slides[next_slide].heading)
                        .fadeIn("fast");
                    //show new slide
                    $("#ui-slideshow-" + next_slide).fadeIn(function () {
                        current_slide = next_slide;
                    });
                });
            }

        }, self.options.time_interval);
    };

    
    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new Plugin(this, options));
            }
        });
    };
}(jQuery, window, document));