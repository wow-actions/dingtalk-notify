import axios from 'axios'
import crypto from 'crypto'
import * as core from '@actions/core'

const VALID_TYPES = ['text', 'link', 'markdown', 'actionCard', 'feedCard']

export async function run() {
  try {
    const secret = core.getInput('secret')
    const token = core.getInput('token', { required: true })
    const msgtype = core.getInput('msgtype')
    const textContent = core.getInput('content', { required: true })
    const textAt = core.getInput('at')
    const ignoreError = core.getInput('ignoreError') === 'true'

    if (!VALID_TYPES.includes(msgtype)) {
      core.setFailed(
        `The input of "type" should be one of ${VALID_TYPES.join(',')}`,
      )
      return
    }

    let content
    let at

    try {
      content = JSON.parse(textContent)
    } catch (e) {
      core.setFailed(
        `The input of "content" should be valid JSON string, Check the input: ${textContent}`,
      )
      return
    }

    try {
      if (textAt === 'all') {
        at = {
          isAtAll: true,
        }
      } else if (textAt) {
        at = JSON.parse(textAt)
      } else {
        at = {}
      }
    } catch (e) {
      core.setFailed(
        `The input of "at" should be valid JSON string or "all" to at all users. Check the input ${textAt}`,
      )
      return
    }

    const payload = {
      at,
      msgtype,
      [msgtype]: content,
    }

    core.debug(`payload: ${JSON.stringify(payload, null, 2)}`)

    const url = new URL(
      `https://oapi.dingtalk.com/robot/send?access_token=${token}`,
    )

    // sign the request
    // https://developers.dingtalk.com/document/robots/customize-robot-security-settings
    if (secret) {
      const timestamp = Date.now()
      const stringToSign = `${timestamp}\n${secret}`
      const sign = crypto
        .createHmac('sha256', secret)
        .update(stringToSign)
        .digest('base64')
      url.searchParams.append('timestamp', `${timestamp}`)
      url.searchParams.append('sign', encodeURIComponent(sign))
    }

    try {
      core.debug(`webhook: ${url.toString()}`)
      const res = await axios.post(url.toString(), JSON.stringify(payload), {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      })

      core.debug(`response: ${JSON.stringify(res.data, null, 2)}`)

      if (res.data.errcode) {
        throw new Error(`[${res.data.errcode}] ${res.data.errmsg}`)
      }
    } catch (e) {
      if (ignoreError) {
        core.info(`Sending message error: ${e.message}`)
      } else {
        throw e
      }
    }
  } catch (e) {
    core.setFailed(e)
  }
}
