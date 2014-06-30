var PS = {};

PS.objects = $([]);

PS.jqw = $(window);

PS.adjustBackgrounds = function () {
    PS.objects.each(function (i, e) {
        var pw = e.img.parent().width();

        if (pw > e.minWidth && e.img.width() != pw) {
            e.img.width(pw);
        }

        // The distance of the parallax element from the top of the page
        var top = e.element.offset().top;

        // The distance of the top of the visible region of the document
        // from the top of the page
        var visibleTop = PS.jqw.scrollTop();

        // The distance of the bottom of the visible region of the document
        // from the top of the page
        var visibleBottom = visibleTop + PS.jqw.height();

        if (top >= visibleTop - e.height && top <= visibleBottom) {
            // pv: "parallax value": [0.0,1.0] 
            // abstracts the progress of the animation
            var pv = Math.min(1, Math.max(0, (visibleBottom - top) / (visibleBottom - visibleTop + e.height)));

            if (e.reverse) {
                pv = 1 - pv;
            }

            // The amount of freedome the image has
            var freedom = e.img.height() - e.height;

            // The amount of margin we should have
            var margin = -Math.round(pv * freedom);

            e.img.css({"margin-top": margin});
        }
    });
};

PS.init = function () {
    $(".parallax-scroll").each(function (i, e) {
        var jqe = $(e);

        // Model object representing a parallax scrolling area
        var o = {
            "imgsrc": jqe.attr("data-image"),
            "height": parseInt(jqe.attr("data-height")),
            "minWidth": parseInt(jqe.attr("data-min-background-width")),
            "element": jqe,
            "img": null,
            "reverse": jqe.attr("data-reverse") != undefined,
            "prevPv": -1
        };

        jqe.height(o.height);

        o.img = $(document.createElement("img"));
        o.img.attr("src", o.imgsrc);
        jqe.append(o.img);

        PS.objects.push(o);
    });

    $(window).resize(PS.adjustBackgrounds);
    $(window).scroll(PS.adjustBackgrounds);

    //PS.adjustBackgrounds();
};

$(document).ready(function () {
    PS.init();
});
