# ev-servers

This is the code from an app I wrote several years ago, flaws and all, using jQuery and other libraries.

Belimo Energy Valves have built-in web servers used to adjust their settings and otherwise monitor their status. 
This is a very simple app I wrote fresh out of college to make my job of managing those servers easier.

Click any of the buttons on the left sidebar to filter by building code. Click any button in the main app area
to load a window that would normally connect to and display valve data. I no longer have access to the servers so 
the window will be empty.

If I were going to revisit this and improve it, I'd use more modern JS, turn that plain text server list into a proper 
database and improve my jswindows file, which I used to manage servers without leaving the app.

This was hosted on a server running [WAMP](http://www.wampserver.com/en/) to make it accessible to anyone on the appropriate intranet.