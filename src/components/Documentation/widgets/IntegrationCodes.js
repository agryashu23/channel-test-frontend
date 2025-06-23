export const reactCode = `
<button className="launch-button" onClick={openChannels}>
  Open Channels
</button>

const openChannels = () => {
    window.openChannelsWidget({
      selectedChannel: "{CHANNEL_NAME}",
      selectedTopic: "{TOPIC_NAME}",
      channels:["CHANNEL_NAME1", "CHANNEL_NAME2"],
      theme: "{THEME}",
      email:"{USER_EMAIL}",
      autoLogin: true/false,
      width: {
        default: "450px",
        sm: "100%",
      },
      height: {
        default: "90%",
        sm: "80%",
      },
      position: "right",
    });
  };
`;

export const vueCode = `
<template>
  <button @click="openChannels">Open Channels</button>
</template>

<script>
export default {
  methods: {
    openChannels() {
        if (window.openChannelsWidget) {
           window.openChannelsWidget({
            selectedChannel: "{CHANNEL_NAME}",
            selectedTopic: "{TOPIC_NAME}",
            channels:["CHANNEL_NAME1", "CHANNEL_NAME2"],
            theme: "{THEME}",
            email:"{USER_EMAIL}",
            autoLogin: true/false,
            width: {
              default: "450px",
              sm: "100%",
            },
            height: {
              default: "90%",
              sm: "80%",
            },
            position: "right",
          });
        }
    },
  },
};
</script>
`;

export const nextjsCode = `
  const openChannels = () => {
      if (window.openChannelsWidget) {
          window.openChannelsWidget({
            selectedChannel: "{CHANNEL_NAME}",
            selectedTopic: "{TOPIC_NAME}",
            channels:["CHANNEL_NAME1", "CHANNEL_NAME2"],
            theme: "{THEME}",
            email:"{USER_EMAIL}",
            autoLogin: true/false,
            width: {
              default: "450px",
              sm: "100%",
            },
            height: {
              default: "90%",
              sm: "80%",
            },
            position: "right",
          });
      }
  };

  return (
    <>
      <button onClick={openChannels}>Open Channels</button>
    </>
  );
}
`;

export const flutterCode = `
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

class ChannelsEmbed extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return WebView(
      initialUrl: 'https://channels.social/embed/channels',
      javascriptMode: JavascriptMode.unrestricted,
    );
  }
}
`;

export const phpCode = `
<button onclick="openChannels()">Open Channels</button>

<script>
  function openChannels() {
      if (window.openChannelsWidget) {
          window.openChannelsWidget({
            selectedChannel: "{CHANNEL_NAME}",
            selectedTopic: "{TOPIC_NAME}",
            channels:["CHANNEL_NAME1", "CHANNEL_NAME2"],
            theme: "{THEME}",
            email:"{USER_EMAIL}",
            autoLogin: true/false,
            width: {
              default: "450px",
              sm: "100%",
            },
            height: {
              default: "90%",
              sm: "80%",
            },
            position: "right",
          });
      }
  }
</script>

`;
export const htmlJsCode = `
<button onclick="openChannels()">Open Channels</button>

<script>
  function openChannels() {
      if (window.openChannelsWidget) {
          window.openChannelsWidget({
            selectedChannel: "{CHANNEL_NAME}",
            selectedTopic: "{TOPIC_NAME}",
            channels:["CHANNEL_NAME1", "CHANNEL_NAME2"],
            theme: "{THEME}",
            email:"{USER_EMAIL}",
            autoLogin: true/false,
            width: {
              default: "450px",
              sm: "100%",
            },
            height: {
              default: "90%",
              sm: "80%",
            },
            position: "right",
          });
      } 
  }
</script>


`;
export const angularCode = `
<button (click)="openChannels()">Open Channels</button>


`;

export const angularTsCode = `
import { Component } from '@angular/core';

@Component({
  selector: 'app-channels-widget',
  templateUrl: './channels-widget.component.html'
})
export class ChannelsWidgetComponent {
  openChannels() {
    if (window.openChannelsWidget) {
      window.openChannelsWidget({
        selectedChannel: "{CHANNEL_NAME}",
        selectedTopic: "{TOPIC_NAME}",
        channels: ["CHANNEL_NAME1", "CHANNEL_NAME2"],
        theme: "{THEME}",
        email: "{USER_EMAIL}",
        autoLogin: true, // or false
        width: {
          default: "450px",
          sm: "100%",
        },
        height: {
          default: "90%",
          sm: "80%",
        },
        position: "right",
      });
    }
  }
}

`;
