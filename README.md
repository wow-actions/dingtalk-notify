<h1 align="center">DingTalk Notify</h1>
<p align="center"><strong>Send DingTalk notify message</strong></p>

## Usage

**STEP 1**: Follow the [tutorial](https://developers.dingtalk.com/document/robots/custom-robot-access) to setup a DingTalk bot.

You will get a webhook url like this `https://oapi.dingtalk.com/robot/send?access_token=xxx`

**STEP 2**: Go to your repository settings page(`https://github.com/{{ USERNAME }}/{{ REPO }}/settings/secrets`) to create some secrets.

at least we need to create a secret named `"DINGTALK_TOKEN"` with value of `"access_token"` in the webhook url.

For singed bot we also need to create a secret named `"DINGTALK_SECRET"` with the value of secret-key.

<img src="https://github.com/wow-actions/dingtalk-notify/blob/master/screenshots/bot-settings.jpg?raw=true" alt="bot-settings" width="633"/>

**STEP 3**: Create a workflow file `.github/workflows/dingtalk-notify.yml` in your repository

```yml
name: DingTalk Notify
on:
  push:
    branches:
      - master
jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - uses: wow-actions/dingtalk-notify@v1
        with:
          token: ${{ secrets.DINGTALK_TOKEN }}
          secret: ${{ secrets.DINGTALK_SECRET }} # only for signed bot
          msgtype: text
          content: |
            {
              "content": "Hello DingTalk"
            }
```

## Inputs

Various inputs are defined to let you configure the action:

> Note: [Workflow command and parameter names are not case-sensitive](https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-commands-for-github-actions#about-workflow-commands).

| Name | Required | Description | Default |
| --- | :-: | --- | --- |
| `token` | ✔️ | Dingtalk bot token |  |
| `secret` |  | Dingtalk bot secret to [sign the request](https://developers.dingtalk.com/document/robots/customize-robot-security-settings) |  |
| `msgtype` |  | Dingtalk message type. Valid types are: `'text'`, `'markdown'`, `'link'`, `'actionCard'`, `'feedCard'`. | `'text'` |
| `content` | ✔️ | Dingtalk message content in [JSON type](https://developers.dingtalk.com/document/robots/custom-robot-access) |  |
| `at` |  | Users to at in JSON type, or set to `'all'` to at all users |  |
| `ignoreError` |  | If set true, will not fail action when sending message failed | `false` |

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE).
