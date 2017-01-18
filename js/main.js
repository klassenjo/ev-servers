/* main.js
 * John Klassen
 * 2014/05/29
 */

// JSLint directives
/*jslint browser: true */
/*jslint devel: true */
/*jslint vars: true */
/*global $, JQuery */
/*global jswin, jswin */

(function () {
    "use strict";
    
    // Get/read server list
    $.get("assets/servers.txt", function (data) {
        var servers = data.split("\n"),
            buildings = [];
        servers.sort();
        //console.log(servers);

        // Split elements a build list
        servers.forEach(function (e) {
            // Split string into name and ip
            var data = e.split(",");
            
            // Get building acronyms
            var b = data[0].split(" ");
            if ($.inArray(b[0], buildings) === -1) {
                buildings.push(b[0]);
            }

            // Build div for each item
            var label = document.createTextNode(data[0]);
            var div = document.createElement('div');
            div.className = "metroBtn outline-outward" + " " + b[0];
            div.appendChild(label);
            
            // Add tooltip for server IP
            div.title = data[1];
            
            // Attach click event
            var link = "http://" + $.trim(data[1]) + ":8080/index.html";
            $(div).click(function () {
//                window.open(link);
                // Construct jswindow
                var win = new jswin.JSWindow("jswin" + data[0].replace(/ /g, ''), data[0]
                                             + " - " + data[1], 640, 480, 1024, 768);
                win.Show("main");
                console.log(link);
                $("#" + win.body.id).load(link);
                return false;
            });
            
            // Attach to page
            var wrapper = document.getElementById("main");
            wrapper.appendChild(div);
        });
        
        // Initialize Isotope
        var container = $('#main');
        container.isotope({
            // main isotope options
            itemSelector: '.metroBtn',
            
            // options for masonry layout mode
            masonry: {
                gutter: 2
            }
        });
        container.isotope('reloadItems');
        container.isotope('layout');
        
        var sidebar = document.getElementById("sidebar");
        // Define "All" filter
        var btn = document.createElement("div");
        btn.className = "divbtnFilterAll";
        btn.innerHTML = "All";
        $(btn).click(function () {
            container.isotope({ filter: ""});
        });
        sidebar.appendChild(btn);
        
        // Define building filter options
        buildings.forEach(function (b) {
            var btn = document.createElement("div"),
                flipped = false;
            btn.className = "divbtnFilter";
            btn.innerHTML = b;
            
            // Filter on click
            $(btn).click(function () {
                container.isotope({ filter: "." + b});
            });
            sidebar.appendChild(btn);
        });
    });
}());


function run() {
    "use strict";
    
    // Size the main div
    $(window).resize(function () {
        var h = window.innerHeight;
        $("body").height(h);
        $("#wrapper").height(h);
        $("#main").height(h);
        $("sidebar").height(h);
        
//        console.log("Window height: " + h);
//        console.log("Body height: " + $("body").height());
//        console.log("Wrapper height: " + $("wrapper").height());
//        console.log("Main height: " + $("main").height());
//        console.log("Sidebar height: " + $("sidebar").height());
    });
}