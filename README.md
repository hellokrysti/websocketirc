# websocketirc
Widgetized Websocket Client for IRC

Using the term widgetized, even if people kinda overflow from what I see a widget. In this context we're going with a "lite version" of what would be otherwise full and more robust outside of a widgety situation. This isn't intended as a full IRC client but more of a way to get people into a chat without the complications of the IRC protocol. It's very lightweight yet still has things like themes, some basic IRC commands, ability to save those settings as well as mix and match theme settings. 

This has been tested on an IRC server running UnrealIRCd 6 with websocket module enabled, antirandom module dialed down and appropriate text websocket listening block.

In your conf/unrealircd.conf
```
listen {
    ip *;
    port 8000;
    options {
        tls;
        websocket { type text; } 
    };
    tls-options {
        certificate "/etc/letsencrypt/live/your.irc.server.host/fullchain.pem";
        key "/etc/letsencrypt/live/your.irc.server.host/privkey.pem";
        options { no-client-certificate; };
    };
}
```
Full instructions: https://krysti.engineer/websocketirc/
