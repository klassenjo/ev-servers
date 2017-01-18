// @author: John Klassen
// @revision: 12/14/2013

// JSLint directives
/*jslint browser: true */
/*jslint devel: true */
/*jslint indent: 4 */
/*jslint white: true */
/*jslint vars: true */
/*global $, jQuery */

/*
* JSWindow "class"
* Generates a draggable/resizable window 
*/
var jswin = {};
var JSWindowClass = function () {
    // Function level JSLint directives
    "use strict";
    
	// JSWindow constructor
	this.JSWindow = function (id, headerText, minWidth, minHeight, maxWidth, maxHeight) {
		// Properties
		this.minHeight = (typeof minHeight === "undefined") ? 250 : minHeight;
		this.minWidth = (typeof minWidth === "undefined") ? 500 : minWidth;
		this.maxHeight = (typeof maxHeight === "undefined") ? 700 : maxHeight;
		this.maxWidth = (typeof maxWidth === "undefined") ? 750 : maxWidth;
		this.width = this.maxWidth;
		this.height = this.maxHeight;
		this.id = id;
		this.isMaximized = false;
        this.isMinimized = false;
		this.savedWidth = this.width;
		this.savedHeight = this.height;
		this.savedPosition = null;
        this.container = null;
        this.page = null;
        this.script = null;

		// Window pane attributes
		this.pane = document.createElement("div");
		this.pane.className = "ui-widget-content jswindow-pane";
		this.pane.id = this.id;
		this.pane.setAttribute("style", "width: " + this.width + "px; height:" + this.height + "px;");

		// Titlebar attributes
		this.header = document.createElement("div");
		this.header.className = "ui-widget-header jswindow-header";
		this.header.innerHTML = "<h4>" + headerText + "</h4>";

        // Titlebar buttons
        this.headerCloseButton = document.createElement("Button");
        this.headerCloseButton.className = "jswindow-header-button jswindow-header-close-button";
        this.headerCloseButton.id = this.id + "CloseButton";

        this.headerMaximizeButton = document.createElement("Button");
        this.headerMaximizeButton.className = "jswindow-header-button jswindow-header-maximize-button";
        this.headerMaximizeButton.id = this.id + "MaximizeButton";

//        this.headerMinimizeButton = document.createElement("Button");
//        this.headerMinimizeButton.className = "jswindow-header-button jswindow-header-minimize-button";
//        this.headerMinimizeButton.id = this.id + "MinimizeButton";

		this.body = document.createElement("div");
		this.body.className = "jswindow-body";
        this.body.id = id + "body";

		// Flag for window status
		this.built = null;
	};
    
	// JSWindow methods
	// Build the window, show it if it's built
	this.JSWindow.prototype.Show = function (container) {
		// Reveal the window if it was hidden
		if (this.built === true) {
			$("#" + this.pane.id).toggle(true);
			return;
		}

		// Attach the pieces and construct the window
		this.header.appendChild(this.headerCloseButton);
		this.header.appendChild(this.headerMaximizeButton);
//		this.header.appendChild(this.headerMinimizeButton);
		this.pane.appendChild(this.header);
		this.pane.appendChild(this.body);

		var parent = document.getElementById(container), 
            thisWindow;
		parent.appendChild(this.pane);
		thisWindow = this;

//        console.log(this.pane.id);
		// Window manipulation functionality
		$("#" + this.pane.id).draggable({ handle: "h4", appendTo: "parent",
			containment: parent, stack: ".ui-widget-content", snap: false, 
            drag: function () {
                // Cancel maximization on drag
//                if (thisWindow.isMaximized === true) {
//                    thisWindow.Maximize();
//                }
                // Maximize on drag to top
//                if (thisWindow.isMaximized === false) {
//                    $("#navbar").mouseover(function () {
//                        thisWindow.Maximize(); 
//                        return;
//                    });
//                }
            }
        });
		$("#" + this.pane.id).resizable({ minHeight: this.minHeight, minWidth: this.minWidth,
			maxHeight: this.maxHeight, maxWidth: this.maxWidth, animate: true, snap: false });
//		// Attach the window's taskbar button to the taskbar
//		$("#taskbar").append(this.taskbarButton);

		// Header and taskbar button click handlers
		$("#" + this.headerCloseButton.id).click(function () { thisWindow.Destroy(); });
		$("#" + this.headerMaximizeButton.id).click(function () { thisWindow.Maximize(); });
//		$("#" + this.headerMinimizeButton.id).click(function () { thisWindow.Hide(); });
//		$("#" + this.taskbarButton.id).click(function () { thisWindow.Hide(); });

        // Set variables for use with tiles
        this.container = container;
        
		// Listen for events
        this.Listen();

		// Reset window build status
		this.built = true;

		// Initialize visible
		$("#" + this.pane.id).toggle(true);
	};
    
    // Attach the associated taskbar button and button icon
    this.JSWindow.prototype.AttachTaskbarButton = function (container, graphic, text) {
        var btn = $("#" + this.id + "TaskbarButton");
        var thisWindow = this;
        if (this.built && btn.length === 0) {
            // Build taskbar button
            thisWindow.taskbarButton = document.createElement("Button");
            thisWindow.taskbarButton.className = "jswindow-taskbar-button";
            thisWindow.taskbarButton.id = thisWindow.id + "TaskbarButton";
            thisWindow.taskbarButton.innerHTML = '<img src="assets/icons/' + graphic + '"><h4>' + text + '</h4>';
            
            // Attach button to taskbar
            $("#" + container).append(this.taskbarButton);
            
            // Taskbar button listener
            $("#" + thisWindow.taskbarButton.id).click(function () {
                thisWindow.Hide();
            });
        }
    };
    
    // Link video to IFrame
    this.JSWindow.prototype.LinkVideo = function (iframeID, url) {
        if ($("#" + iframeID).length) {
            $("#" + iframeID).attr("src", url);
        }
    };

	// Load the window's HTML page and JS file
	this.JSWindow.prototype.LinkFiles = function (page, script) {
		var thisWindow = this;
        this.page = page;
        this.script = script;
        
        if (page !== null) {
            $.get("pages/" + page, function (data) {
                thisWindow.body.innerHTML = data;
            }).done(function () { 
                console.log(page + " loaded");
                // Load the underlying js script for the game
                if (script !== null) {
                    $.getScript(script, function (data, status) {

                    }).done(function () {console.log(script + " loaded"); });
                }
            }).fail(function () { console.log("Failed to load " + page); });
        }
	};
    
    // Set window container
    this.JSWindow.prototype.LinkContainer = function (container) {
        this.container = container;
    };
    
    // Set taskbar button container
    this.JSWindow.prototype.LinkTaskbar = function (container) {
        this.taskbarContainer = container;
    };

	// Toggle window visibility
	this.JSWindow.prototype.Hide = function () {
        $("#" + this.pane.id).toggle();
        this.isMinimized = !this.isMinimized;
    
        // Move window to foreground when restored
        var thisWindow = this;
        $("#" + thisWindow.pane.id).css({ "z-index": 99 });
	};

	// Maximize window or restore its pre-maximized proportions
	this.JSWindow.prototype.Maximize = function () {
        var thisWindow = $("#" + this.pane.id);
        
		if (this.isMaximized === false && this.isMinimized === false) {
            // Save width/height and position for restoration
			this.savedWidth = thisWindow.width();
			this.savedHeight = thisWindow.height();
            this.savedPosition = thisWindow.offset();
            
            // Get the width/height of the content area
            var width = $("#main").width(),
                height = $("#main").height();
            
            // Move the window to top-left position, maximize
            var contentAreaTop = $("#main").offset().top,
                contentAreaLeft = $("#main").offset().left;
            thisWindow.offset({ top: contentAreaTop, left: contentAreaLeft });
			thisWindow.width(width-2);
			thisWindow.height(height-1);
            this.isMaximized = true;
		} else {
            thisWindow.width(this.savedWidth);
            thisWindow.height(this.savedHeight);
            thisWindow.offset(this.savedPosition);
            this.isMaximized = false;
        }
    };
    
    // Event handler function
    this.JSWindow.prototype.Listen = function () {
        // Context of 'this' changes inside the handler, assign it early to use it
        var thisWindow = this;
        // Maximize on titlebar dblclick
        $(".jswindow-header").dblclick(function () {
            thisWindow.Maximize(); 
        });
    };

	// Destroy the window, its elements and unset the build status
	this.JSWindow.prototype.Destroy = function () {
		$("#" + this.id).remove();
//		$("#" + this.taskbarButton.id).remove();
		this.built = false;
	};
};
JSWindowClass.apply(jswin);



/*
* JSMenu "class"
* Generates a dropdown menu
* Relies on a menu on the HTML side, should be generated here instead
*/
var jsmenu = {};
var JSMenuClass = function () {
    // Function level JSLint directives
    "use strict";
    
	// JSMenu constructor
	this.JSMenu = function () {
		this.headerItem = null;
		this.toplist = null;
		this.sublist = null;
	};

	// Use the elements from index.php to 
	this.JSMenu.prototype.BuildMenu = function (headerID, listID, sublistID) {
		this.headerItem = $("#" + headerID);
		this.toplist = $("#" + listID);
		this.sublist = $("#" + sublistID);

		// Set width of toplist to the width of the item representing the list (headerItem)
		$(this.toplist).width(($(this.headerItem).width()));

		// Hide the sublist
		this.sublist.toggle(false);

		// Menu mouse events
		this.toplist.hover(function () {
            // mouseover
            $("#" + sublistID).toggle(true);
        },
        function () {
            // mouseout
            $("#" + sublistID).toggle(false);
		});
	};

	// Window group manipulation methods
	this.JSMenu.prototype.MinimizeAll = function (winArray) {
		winArray.forEach(function (win) {
			if (win.built === true && win.isMinimized === false) {
                win.Hide(false);
            }
		});
	};
	
	this.JSMenu.prototype.MaximizeAll = function (winArray) {
		winArray.forEach(function (win) {
			if (win.built === true && win.isMinimized === false) {
				win.Maximize();
			}
		});
	};

	this.JSMenu.prototype.RestoreAll = function (winArray) {
		winArray.forEach(function (win) {
			if (win.built === true && win.isMinimized === true) {
                win.Hide(true);
            }
		});
	};

	this.JSMenu.prototype.CloseAll = function (winArray) {
		winArray.forEach(function (win) {
			if (win.built === true) {
                win.Destroy();
            }
		});
	};
};
JSMenuClass.apply(jsmenu);