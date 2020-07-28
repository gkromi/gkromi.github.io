function jigsawMain() {
    this.version = '0.1';
    w = 600;
    h = 600;
    s = "";
    s += '<div style="margin:auto; display:block;">';
    s += '<div id="hdr" style="position:absolute; display:block; width:100px; height: 40px; z-index:100;">';
    s += '<button id="newBtn" style="width:120px; font-size: 18px; z-index:44;" class="togglebtn"  onclick="histPop()" >New</button>';
		s += '<button id="imageBtn1" style="width:120px; font-size: 14px; z-index:44;" class="togglebtn hi"  onclick="load1()" >Image 1</button>';
	s += '<button id="imageBtn2" style="width:120px; font-size: 14px; z-index:44;" class="togglebtn hi"  onclick="load2()" >Image 2</button>';
		s += '<button id="imageBtn3" style="width:120px; font-size: 14px; z-index:44;" class="togglebtn hi"  onclick="load3()" >Image 3</button>';
    s += '<button id="imageBtn" style="width:120px; font-size: 14px; z-index:44;" class="togglebtn hi"  onclick="toggleImg()" >Image Toggle</button>';
	s += getPopHTML();
    s += '</div>';
    s += '<div style="height: 40px;"></div>';
    s += '<canvas id="canvasId" style="display:block; margin:auto; z-index:1; text-align: center;"></canvas>';
    s += '<div id="jig" style="position:absolute; left:0; top:0; width:100px; height: 100px;"></div>';
    s += '<div id="copyrt" style="font: 10px Arial; color: white; position:absolute; right:0; top:0; text-align:center;">v' + this.version + '</div>';
    s += '</div>';
    document.write(s);
    el = document.getElementById('canvasId');
    el.style.border = "1px solid #888";
    el.width = 1000;
    el.height = 1000;
    g = el.getContext("2d");
    jig = document.getElementById('jig');
    var imgName = getQueryVariable('img');
    if (imgName) {
        imgName = decodeURIComponent(imgName);
        imgName = imgName.replace(/[^0-9A-Za-z\-\.]+/g, '');
        fileName = 'data/img/' + imgName;
    } else {
        fileName = 'data/img/image.JPG';
    }
    console.log("fileName", fileName);
    rows = 4;
    cols = 4;
    pWd = 100;
    pHt = 100;
    animNo = 0;
    animTp = 0;
    imgQ = true;
    p = [];
    window.addEventListener("mousedown", mouseDown, false);
    touchsel = null;
    touchmouse = null;
    jig.addEventListener("touchstart", ontouchstart, false);
    jig.addEventListener("touchmove", ontouchmove, false);
    jig.addEventListener("touchend", ontouchend, false);
    histPop();
}
function load1(){
	window.location.href='index.html';
}
function load2(){
	window.location.href='index.html?img=image2.JPG';
}
function load3(){
	window.location.href='index.html?img=image3.JPG';
}
function toggleImg() {
    imgQ = !imgQ;
    if (imgQ) {
        loadImg(0.5, false);
    } else {
        loadImg(0, false);
    }
    toggleBtn('imageBtn', imgQ)
}
function toggleBtn(btn, onq) {
    if (onq) {
        document.getElementById(btn).classList.add("hi");
        document.getElementById(btn).classList.remove("lo");
    } else {
        document.getElementById(btn).classList.add("lo");
        document.getElementById(btn).classList.remove("hi");
    }
}
function ontouchstart(evt) {
    evt.preventDefault();
    var touch = evt.targetTouches[0];
    startIt(touch.clientX, touch.clientY);
}
function ontouchmove(evt) {
    var touch = evt.targetTouches[0];
    touchsel.moveTo(touch.pageX - touchmouse.x, touch.pageY - touchmouse.y);
    touchmouse = new Point(touch.pageX,touch.pageY);
    evt.preventDefault();
}
function ontouchend(evt) {
    finishIt();
    evt.preventDefault();
}
function histPop() {
    console.log("editpop");
    var pop = document.getElementById('histpop');
    pop.style.transitionDuration = "0.3s";
    pop.style.opacity = 1;
    pop.style.zIndex = 12;
    pop.style.left = '100px';
}
function userUpdate() {}
function getPopHTML() {
    var s = '';
    s += '<div id="histpop" style="position:absolute; margin-left:100px; margin-top:-100px; width:300px; padding: 5px; border: 1px solid red; border-radius: 9px; background-color: #88aaff; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); transition: all linear 0.3s; opacity:0; ">';
    s += '<div style="display: inline-block; font: bold 16px Arial; text-align:center; " value="10">Rows (6 to 12): &nbsp;</div>';
    s += '<input id="rows" style="width:40px; font: bold 16px Arial; text-align:center; " value="9" onkeyup="userUpdate()" />';
    s += '<br>';
    s += '<div style="display: inline-block; font: bold 16px Arial; text-align:center; " value="10">Cols (6 to 12): &nbsp;</div>';
    s += '<input id="cols" style="width:40px; font: bold 16px Arial; text-align:center; " value="9" onkeyup="userUpdate()" />';
    s += '<div style="float:right; margin: 0 0 5px 10px;">';
    s += '<button onclick="editYes()" style="z-index:2; font: 22px Arial;" class="togglebtn" >&#x2714;</button>';
    s += '</div>';
    s += '</div>';
    return s;
}
function editYes() {
    var pop = document.getElementById('histpop');
    pop.style.opacity = 0;
    pop.style.zIndex = 1;
    pop.style.left = '-500px';
    rows = document.getElementById('rows').value;
    rows = Math.max(6, Math.min(rows >> 0, 12));
    cols = document.getElementById('cols').value;
    cols = Math.max(6, Math.min(cols >> 0, 12));
    if (imgQ) {
        loadImg(0.5, true);
    } else {
        loadImg(0, true);
    }
}
function doAnim() {
    var pc = p[animNo];
    if (animTp % 2 == 0) {
        pc.left = pc.canvas.style.left;
        var left = parseFloat(pc.canvas.style.left);
        pc.canvas.style.left = (left - (Math.random() - 0.5) * 60) + 'px';
        pc.top = pc.canvas.style.top;
        var top = parseFloat(pc.canvas.style.top);
        pc.canvas.style.top = (top - (Math.random() - 0.5) * 60) + 'px';
    } else {
        pc.canvas.style.left = pc.left;
        pc.canvas.style.top = pc.top;
    }
    animNo++;
    if (animNo < rows * cols) {
        requestAnimationFrame(doAnim);
    } else {
        animNo = 0;
        animTp++;
        if (animTp < 6)
            requestAnimationFrame(doAnim);
    }
}
function jiggle() {
    animNo = 0;
    animTp = 0;
    doAnim();
}
function loadImg(alpha, newQ) {
    if (newQ) {
        g.clearRect(0, 0, el.width, el.height);
        jig.innerHTML = '';
    }
    var me = this;
    this.image = new Image();
    this.image.onload = function() {
        me.wd = this.width;
        me.ht = this.height;
        console.log("image.onload", this, this.width, this.height);
        el.width = this.width;
        el.height = this.height;
        g.save();
        g.globalAlpha = alpha;
        g.drawImage(this, 0, 0);
        g.restore();
        g.fillStyle = 'rgba(255,255,255,' + alpha + ')';
        g.fillRect(0, 0, this.width, this.height);
        if (newQ)
            go(this);
    }
    ;
    this.image.src = fileName;
}
function getRandPts() {
    var rect = jig.getBoundingClientRect();
    var pts = [];
    var xCurr = -rect.left;
    var yCurr = 0;
    for (var i = 0; i < cols * rows; i++) {
        pts.push({
            x: xCurr + Math.random() * pWd,
            y: yCurr + Math.random() * pHt
        });
        xCurr += pWd * 1.5;
        if (xCurr >= (document.body.clientWidth - rect.left - pWd * 2)) {
            xCurr = -rect.left;
            yCurr += pHt * 1.5;
        }
    }
    return shuffle(pts);
}
function shuffle(array) {
    var tmp, current, top = array.length;
    if (top)
        while (--top) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = array[current];
            array[current] = array[top];
            array[top] = tmp;
        }
    return array;
}
function go(img) {
    pWd = img.width / cols;
    pHt = img.height / rows;
    console.log("go", img, pWd, pHt);
    var pts = getRandPts();
    var ptNo = 0;
    p = [];
    var count = 0;
    for (var l = 0; l < rows; l++) {
        for (var k = 0; k < cols; k++) {
            p.push(new puzzlePiece({
                "rotation": 0,
                "imgwidth": img.width,
                "imgheight": img.height,
                "width": pWd,
                "height": pHt,
                "image": img,
                "imagepoint": new Point(k * pWd,l * pHt),
                "top": {
                    "first": new Point(k * pWd,l * pHt),
                    "last": new Point(k * pWd + pWd,l * pHt)
                },
                "right": {
                    "first": new Point(k * pWd + pWd,l * pHt),
                    "last": new Point(k * pWd + pWd,l * pHt + pHt)
                },
                "bot": {
                    "first": new Point(k * pWd + pWd,l * pHt + pHt),
                    "last": new Point(k * pWd,l * pHt + pHt)
                },
                "left": {
                    "first": new Point(k * pWd,l * pHt + pHt),
                    "last": new Point(k * pWd,l * pHt)
                }
            }));
            p[p.length - 1].canvas.style.setProperty("left", pts[ptNo].x + "px");
            p[p.length - 1].canvas.style.setProperty("top", pts[ptNo].y + "px");
            ptNo++;
            if (k !== 0) {
                var temp = p[p.length - 2].right.points;
                p[p.length - 2].pieceright = p[p.length - 1];
                p[p.length - 1].pieceleft = p[p.length - 2];
                p[p.length - 1].left.points = [];
                for (var i = 0; i < temp.length; i++) {
                    p[p.length - 1].left.points.push(new Point(temp[i].x - p[p.length - 1].width,temp[i].y));
                }
                p[p.length - 1].left.points.reverse();
            }
            if (l !== 0) {
                var temp2 = p[count - cols].bot.points;
                p[count - cols].piecebot = p[p.length - 1];
                p[p.length - 1].piecetop = p[count - cols];
                p[count].top.points = [];
                for (i = 0; i < temp2.length; i++) {
                    p[count].top.points.push(new Point(temp2[i].x,temp2[i].y - p[count].height));
                }
                p[count].top.points.reverse();
            }
            count++;
        }
    }
    for (i = 0; i < p.length; i++) {
        p[i].canvas.style.zIndex = i;
        p[i].display();
        p[i].connected.push(p[i]);
        if (false) {
            for (var rotation = Math.floor(Math.random() * 4.0); rotation <= 4; rotation++) {
                p[i].rotate(p[i]);
            }
        }
    }
}
function clone(obj) {
    if (null === obj || "object" != typeof obj)
        return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr))
            copy[attr] = obj[attr];
    }
    return copy;
}
function Point(x, y) {
    this.x = x;
    this.y = y;
    this.d = Math.sqrt(x * x + y * y);
    return this;
}
Point.prototype = {};
var puzzlePiece = (function() {
    function puzzlePiece(obj) {
        this.imgtop = clone(obj.top);
        this.rotation = obj.rotation;
        this.image = obj.image;
        this.width = obj.width + 0;
        this.height = obj.height + 0;
        this.canvas = document.createElement("canvas");
        this.canvas.rotation = 0;
        this.connected = [];
        this.canvas.setAttribute("style", "position:absolute;");
        this.canvas.setAttribute("width", obj.width * 3);
        this.canvas.setAttribute("height", obj.height * 3);
        this.canvas.style.setProperty("top", this.imgtop.first.y + 1 + "px");
        this.canvas.style.setProperty("left", this.imgtop.first.x + 1 + "px");
        this.context = this.canvas.getContext('2d');
        jig.appendChild(this.canvas);
        var lt = obj.width;
        var tp = obj.height;
        this.top = {
            "first": new Point(lt - (obj.width / 2.0),tp - (obj.height / 2.0)),
            "last": new Point(lt + (obj.width / 2.0),tp - (obj.height / 2.0))
        };
        this.right = {
            "first": new Point(lt + (obj.width / 2.0),tp - (obj.height / 2.0)),
            "last": new Point(lt + (obj.width / 2.0),tp + (obj.height / 2.0))
        };
        this.bot = {
            "first": new Point(lt + (obj.width / 2.0),tp + (obj.height / 2.0)),
            "last": new Point(lt - (obj.width / 2.0),tp + (obj.height / 2.0))
        };
        this.left = {
            "first": new Point(lt - (obj.width / 2.0),tp + (obj.height / 2.0)),
            "last": new Point(lt - (obj.width / 2.0),tp - (obj.height / 2.0))
        };
        if (obj.left.first.x > 0) {
            this.left.points = this.makeSide(this.left);
        } else {
            this.left.points = [];
            this.left.points.push(this.left.first);
            this.left.points.push(this.left.last);
        }
        if (obj.top.first.y > 0) {
            this.top.points = this.makeSide(this.top);
        } else {
            this.top.points = [];
            this.top.points.push(this.top.first);
            this.top.points.push(this.top.last);
        }
        if (parseFloat(obj.right.first.x) >= parseFloat(obj.imgwidth) - 1) {
            this.right.points = [];
            this.right.points.push(this.right.first);
            this.right.points.push(this.right.last);
        } else {
            this.right.points = this.makeSide(this.right);
        }
        if (parseFloat(obj.bot.last.y) >= parseFloat(obj.imgheight) - 1) {
            this.bot.points = [];
            this.bot.points.push(this.bot.first);
            this.bot.points.push(this.bot.last);
        } else {
            this.bot.points = this.makeSide(this.bot);
        }
        this.display = function() {
            this.context.beginPath();
            this.dBezierCurve(this.top.points);
            this.dBezierCurve(this.right.points);
            this.dBezierCurve(this.bot.points);
            this.dBezierCurve(this.left.points);
            this.context.closePath();
            this.context.save();
            this.context.clip();
            this.context.drawImage(this.image, pWd / 2 - this.imgtop.first.x, pHt / 2 - this.imgtop.first.y);
            this.context.strokeStyle = "#333";
            this.context.lineWidth = 1;
            this.context.stroke();
        }
        ;
    }
    return puzzlePiece;
}
)();
puzzlePiece.prototype = {
    rotate: function(around) {
        this.connected.forEach(function(element) {
            var temptop = parseFloat(around.canvas.style.top) - (parseFloat(around.canvas.style.left) - parseFloat(element.canvas.style.left));
            var templeft = parseFloat(around.canvas.style.left) + (parseFloat(around.canvas.style.top) - parseFloat(element.canvas.style.top));
            element.canvas.style.setProperty("top", temptop + "px");
            element.canvas.style.setProperty("left", templeft + "px");
            element.canvas.getContext('2d').restore();
            element.canvas.getContext('2d').clearRect(0, 0, element.canvas.width, element.canvas.height);
            element.context.translate(element.canvas.width / 2.0, element.canvas.height / 2.0);
            element.canvas.getContext('2d').rotate(Math.PI / 2.0);
            element.rotation += 1;
            element.rotation %= 4;
            element.context.translate(-(element.canvas.width / 2.0), -(element.canvas.height / 2.0));
            element.display();
            var origtop = element.piecetop;
            var origright = element.pieceright;
            var origbot = element.piecebot;
            var origleft = element.pieceleft;
            element.piecetop = null;
            element.pieceright = null;
            element.piecebot = null;
            element.pieceleft = null;
            element.piecetop = origleft;
            element.pieceright = origtop;
            element.piecebot = origright;
            element.pieceleft = origbot;
        });
    },
    moveTo: function(x, y) {
        this.connected.forEach(function(element) {
            element.canvas.style.setProperty("left", parseFloat(element.canvas.style.left) + x + "px");
            element.canvas.style.setProperty("top", parseFloat(element.canvas.style.top) + y + "px");
        });
    },
    dBezierCurve: function() {
        var controlpoint = 3.5;
        var args = Array.prototype.slice.call(arguments);
        if (args[0].length > 1) {
            args = args[0];
        }
        if (args.length <= 2) {
            this.context.lineTo(args[0].x, args[0].y);
            this.context.lineTo(args[1].x, args[1].y);
            return;
        }
        var a = [];
        a.push(args[0]);
        for (var j = 0; j < args.length; j++) {
            a.push(args[j]);
        }
        a.push(args[args.length - 1]);
        args = a;
        for (var i = 2; i < args.length - 1; i++) {
            var before = new Point(args[(i + (args.length - 1)) % args.length].x,args[(i + (args.length - 1)) % args.length].y);
            var after = new Point(args[(i + (args.length + 1)) % args.length].x,args[(i + (args.length + 1)) % args.length].y);
            var current = new Point(args[(i + (args.length)) % args.length].x,args[(i + (args.length)) % args.length].y);
            var before2 = new Point(args[(i + (args.length - 2)) % args.length].x,args[(i + (args.length - 2)) % args.length].y);
            var mid1 = new Point(before.x - ((before2.x - current.x) / controlpoint),before.y - ((before2.y - current.y) / controlpoint));
            var mid2 = new Point(current.x + ((before.x - after.x) / controlpoint),current.y + ((before.y - after.y) / controlpoint));
            this.context.bezierCurveTo(mid1.x, mid1.y, mid2.x, mid2.y, current.x, current.y);
        }
    },
    makeSide: function(eobj) {
        var lp = [];
        var d = new Point(eobj.first.x - eobj.last.x,eobj.first.y - eobj.last.y)
          , midpoint = new Point((eobj.first.x + eobj.last.x) / 2.0,(eobj.first.y + eobj.last.y) / 2.0)
          , r = (Math.round(Math.random()) * 2.0) - 1
          , rd = new Point(d.x / 6.0 * (Math.random() * 0.5 + 0.7),d.y / 6.0 * (Math.random() * 0.5 + 0.7))
          , pt1 = new Point(midpoint.x + rd.x + (rd.y / 2.0 * Math.random()),midpoint.y + rd.y + (rd.x / 2.0 * Math.random()))
          , pt2 = new Point(midpoint.x - rd.x + (rd.y / 2.0 * Math.random()),midpoint.y - rd.y + (rd.x / 2.0 * Math.random()));
        lp.push(new Point(eobj.first.x,eobj.first.y));
        lp.push(pt1);
        lp.push(new Point(pt1.x + (rd.y * r),pt1.y + (rd.x * r)));
        lp.push(new Point(pt2.x + (rd.y * r),pt2.y + (rd.x * r)));
        lp.push(pt2);
        lp.push(new Point(eobj.last.x,eobj.last.y));
        return lp.splice(0);
    }
};
function mouseDown(event) {
    startIt(event.pageX, event.pageY);
}
function startIt(x, y) {
    for (var j = 0; j < p.length; j++) {
        p[j].canvas.style.zIndex = p.length - j;
    }
    for (var i = 0; i < p.length; i++) {
        var that = p[i].canvas;
        var rect = jig.getBoundingClientRect();
        if (that.getContext('2d').isPointInPath(x - parseInt(that.style.getPropertyValue("left"), 10), y - parseInt(that.style.getPropertyValue("top"), 10))) {
            document.selectedpiece = p[i];
            touchsel = document.selectedpiece;
            touchmouse = new Point(x,y);
            that = p.splice(i, 1)[0];
            p.unshift(that);
            that = that.canvas;
            that.style.zIndex = p.length + 1;
            that.mouse = new Point(x,y);
            document.selected = that;
            document.onmousemove = mousemove;
            document.onmouseup = mouseup;
            return;
        }
    }
}
function dblclick(event) {
    for (var i = 0; i < p.length; i++) {
        var that = p[i];
        if (that.canvas.getContext('2d').isPointInPath(event.pageX - parseInt(that.canvas.style.getPropertyValue("left"), 10), event.pageY - parseInt(that.canvas.style.getPropertyValue("top"), 10))) {
            that.rotate(that);
            return;
        }
    }
}
function mousemove(evt) {
    document.selectedpiece.moveTo(evt.pageX - document.selected.mouse.x, evt.pageY - document.selected.mouse.y);
    document.selected.mouse = new Point(evt.pageX,evt.pageY);
}
function mouseup(evt) {
    finishIt(evt.pageX, evt.pageY);
}
function finishIt(x, y) {
    document.selectedpiece.moveTo(x - document.selected.mouse.x, y - document.selected.mouse.y);
    document.selectedpiece.connected.forEach(function(element) {
        checkForMatches(element)
    });
    document.selectedpiece = null;
    document.onmouseup = '';
    document.onmousemove = '';
    document.selected.mouse = '';
    document.selected = null;
    checkDone();
}
function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}
Array.prototype.myUnique = function() {
    var r = [];
    o: for (var i = 0; i < this.length; i++) {
        for (var x = 0; x < r.length; x++) {
            if (r[x] === this[i]) {
                continue o;
            }
        }
        r[r.length] = this[i];
    }
    return r;
}
;
function checkForMatches(e) {
    var top = parseFloat(e.canvas.style.top);
    var left = parseFloat(e.canvas.style.left);
    var accuracy = 5.0;
    var topmatchmin = top - e.height / accuracy;
    var topmatchmax = top + e.height / accuracy;
    var leftmatchmin = left - e.width / accuracy;
    var leftmatchmax = left + e.width / accuracy;
    if (typeof e.piecetop !== 'undefined') {
        var toptop = parseFloat(e.piecetop.canvas.style.top);
        var topleft = parseFloat(e.piecetop.canvas.style.left);
        if (toptop + e.height > topmatchmin && toptop + e.height < topmatchmax && topleft > leftmatchmin && topleft < leftmatchmax && e.rotation == e.piecetop.rotation) {
            e.piecetop.moveTo(left - topleft, top - (toptop + e.height));
            var c = (e.connected.concat(e.piecetop.connected)).myUnique();
            c.forEach(function(element, index, array) {
                element.connected = array;
            });
        }
    }
    if (typeof e.pieceright !== 'undefined') {
        var righttop = parseFloat(e.pieceright.canvas.style.top);
        var rightleft = parseFloat(e.pieceright.canvas.style.left);
        if (righttop > topmatchmin && righttop < topmatchmax && rightleft - e.width > leftmatchmin && rightleft - e.width < leftmatchmax && e.rotation == e.pieceright.rotation) {
            e.pieceright.moveTo(left - (rightleft - e.width), top - righttop);
            var d = (e.connected.concat(e.pieceright.connected)).myUnique();
            d.forEach(function(element, index, array) {
                element.connected = array;
            });
        }
    }
    if (typeof e.pieceleft !== 'undefined') {
        var lefttop = parseFloat(e.pieceleft.canvas.style.top);
        var leftleft = parseFloat(e.pieceleft.canvas.style.left);
        if (lefttop > topmatchmin && lefttop < topmatchmax && leftleft + e.width > leftmatchmin && leftleft + e.width < leftmatchmax && e.rotation == e.pieceleft.rotation) {
            e.pieceleft.moveTo(left - (leftleft + e.width), top - lefttop);
            var f = (e.connected.concat(e.pieceleft.connected)).myUnique();
            f.forEach(function(element, index, array) {
                element.connected = array;
            });
        }
    }
    if (typeof e.piecebot !== 'undefined') {
        var bottop = parseFloat(e.piecebot.canvas.style.top);
        var botleft = parseFloat(e.piecebot.canvas.style.left);
        if (bottop - e.height > topmatchmin && bottop - e.height < topmatchmax && botleft > leftmatchmin && botleft < leftmatchmax && e.rotation == e.piecebot.rotation) {
            e.piecebot.moveTo(left - botleft, top - (bottop - e.height));
            var g = (e.connected.concat(e.piecebot.connected)).myUnique();
            g.forEach(function(element, index, array) {
                element.connected = array;
            });
        }
    }
}
function checkDone(conn) {
    conn = p[0].connected;
    if (conn.length == cols * rows) {
        jiggle();
    }
}
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return false;
}
