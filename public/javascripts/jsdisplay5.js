var display = [], time = {}, f, sep;
//var url = 'http://kiosks.greenpowermonitor.com/current/recsolar/plant/elpaso/';
var url = 'getdata';
$(function() {
    for (var i = 0; i < 3; ++i) {
            display.push({
                h: new JSGadget.Display("#clock" + (i + 1) + " .hour", {
                    digits: 10,
                    color: i & 1 ? "lime" : "lime"
                    //,
                    //shadow: i & 1 ? {color: "gray"} : {}
                })
            })
    }
    sep = $(".sep, .seps");
    setInterval(function() {
        if (f = !f) {
            showTime();
            sep.removeClass("show");
            //sep.addClass("show");
        } else
            getGPM();
            sep.removeClass("show");
    }, 2000);
    showTime();
});
function showTime() {
    var t = new Date(),
        s = t.getSeconds(),
        m = t.getMinutes(),
        h = t.getHours(),
        s0 = t.getUTCSeconds(),
        m0 = t.getUTCMinutes(),
        h0 = t.getUTCHours();

            if (h !== time.h) {
                time.h = h;
                //display[0].h.setVal(int22dig(h));
                //display[0].h.setVal(198220.22);
                //display[1].h.setVal(int22dig(h));
                //display[1].h.setVal(11170030.784);
                //display[2].h.setVal(int22dig(h0));
                //display[2].h.setVal(678940000);
            }
}
function int22dig(v) {
    return v < 10 ? "0" + v : "" + v;
};

function getGPM(){
    $.get(url, function (data) {
        var d = $.parseJSON(data);
        console.log(d.currPower);
        console.log(d.totalEnergy);
        console.log(d.coSawing);
        display[0].h.setVal(d.currPower);
        display[1].h.setVal((d.totalEnergy*0.001).toFixed(0));
        display[2].h.setVal((d.coSawing*0.001).toFixed(0));
    });
}

