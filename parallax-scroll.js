var PS = {};

// List of parallax objects
PS.pobjs = $([]);

// Window object wrapped in $
PS.jqw = $(window);

// get parallax value for a PO.
// animation should be executed when it's between 0 and 1
// 0: beginning to appear at the bottom,
// 1: just disappeared at the top.
PS.getPV = function (po) {
    // The distance of the parallax element from the top of the page
    var top = po.element.offset().top;

    // The distance of the top of the visible region of the document
    // from the top of the page
    var visibleTop = PS.jqw.scrollTop();

    // The distance of the bottom of the visible region of the document
    // from the top of the page
    var visibleBottom = visibleTop + PS.jqw.height();

    // Return the parallax value.
    // Can be negative, and larger than 1. This means that the
    // element is out of the screen.
    return (visibleBottom - top) / (visibleBottom - visibleTop + po.height);
};

PS.getFreedom = function (po) {
    return po.img.height() - po.height;
};

PS.getMargin = function (po) {
    var pv = PS.getPV(po);

    if (po.reverse) {
        pv = 1 - pv;
    }

    return -Math.round(pv * PS.getFreedom(po))
};

PS.adjustBackgrounds = function () {
    PS.pobjs.each(function (i, po) {
        var pw = po.img.parent().width();

        if (pw > po.minWidth && po.img.width() != pw) {
            po.img.width(pw);
        }

        var pv = PS.getPV(po);

        if (pv <= 1 && pv >= 0) {
            po.margin = PS.getMargin(po, pv);
            po.img.css({"transform": "translate3d(0px," + po.margin + "px,0px)"});
        }
    });
};

PS.init = function () {

    $(".parallax-scroll").each(function (i, pelement) {
        var jqpelement = $(pelement);

        // Model object representing a parallax scrolling area
        var po = {
            "imgsrc": jqpelement.attr("data-image"),
            "height": parseInt(jqpelement.attr("data-height")),
            "minWidth": parseInt(jqpelement.attr("data-min-background-width")),
            "element": jqpelement,
            "img": null,
            "reverse": jqpelement.attr("data-reverse") != undefined,
            "margin": 0
        };

        jqpelement.height(po.height);

        var i = new Image();
        i.src = po.imgsrc;

        //po.img = $(document.createElement("img"));
        //po.img.attr("src", po.imgsrc);
        po.img = $(i);

        jqpelement.append(po.img);

        PS.pobjs.push(po);
    });

    PS.jqw.resize(PS.adjustBackgrounds);
    PS.jqw.scroll(function (e) {e.preventDefault(); PS.adjustBackgrounds()});
    
    PS.adjustBackgrounds();
};

$(document).ready(function () {
    PS.init();
});
