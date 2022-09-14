# websocketirc
Widgetized Websocket Client for IRC

Using the term widgetized, even if people kinda overflow from what I see a widget. In this context we're going with a "lite version" of what would be otherwise full and more robust outside of a widgety situation. This isn't intended as a full IRC client but more of a way to get people into a chat without the complications of the IRC protocol. It's very lightweight yet still has things like themes, some basic IRC commands, ability to save those settings as well as mix and match theme settings. 

This has been tested on an IRC server running UnrealIRCd 6 with websocket module enabled, antirandom module dialed down and appropriate text websocket listening block.

IRCv3 CHATHISTORY support added. Only tested on UnrealIRCd v6+. Set your ircConfig block to accept ircv3 by changing the default value from false to true. Your channel that you wish to playback chat history you must set the channel mode +H like so:

/mode #channel +H 50:1440

This will accept 50 messages to be returned as playback and will hold the buffer of the last 24 hours. 50 played back messages is also the default in your ircConfig shown in the demo.html

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
