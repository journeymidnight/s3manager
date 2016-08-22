import React from 'react';
import Page, { attach } from '../../shared/pages/Page';

import WebUtil from '../../shared/vendors/vnc/webutil';
import '../../shared/vendors/vnc/util';
import '../../shared/vendors/vnc/base64';
import '../../shared/vendors/vnc/websock';
import '../../shared/vendors/vnc/des';
import '../../shared/vendors/vnc/keysymdef';
import '../../shared/vendors/vnc/keyboard';
import '../../shared/vendors/vnc/input';
import '../../shared/vendors/vnc/display';
import inflator from '../../shared/vendors/vnc/inflator';
import RFB from '../../shared/vendors/vnc/rfb';
import '../../shared/vendors/vnc/keysym';

window.inflator = inflator;

class C extends Page {

  componentDidMount() {
    const $ = require('jquery');

    // Load supporting scripts
    // Util.load_scripts(['webutil.js', 'base64.js', 'websock.js', 'des.js', 'keysymdef.js', 'keyboard.js', 'input.js', 'display.js', 'inflator.js', 'rfb.js', 'keysym.js']);

    let rfb;
    let resizeTimeout;

    function resizeUI() {
      if (WebUtil.getConfigVar('resize', false)) {
        const innerW = window.innerWidth;
        const innerH = window.innerHeight;
        const controlbarH = $('#noVNC_status_bar')[0].offsetHeight;
        const padding = 5;
        if (innerW !== undefined && innerH !== undefined) {
          rfb.setDesktopSize(innerW, innerH - controlbarH - padding);
        }
      }
    }

    function FBUComplete(rfb2) {
      resizeUI();
      rfb2.set_onFBUComplete(() => {});
    }

    function passwordRequired() {
      let msg;
      msg = '<form onsubmit="return setPassword();"';
      msg += '  style="margin-bottom: 0px">';
      msg += 'Password Required: ';
      msg += '<input type=password size=10 id="password_input" class="noVNC_status">';
      msg += '</form>';

      $('#noVNC_status_bar')[0].setAttribute('class', 'noVNC_status_warn');
      $('#noVNC_status')[0].innerHTML = msg;
    }

    window.setPassword = () => {
      rfb.sendPassword($('#password_input')[0].value);
      return false;
    };

    function sendCtrlAltDel() {
      rfb.sendCtrlAltDel();
      return false;
    }

    function xvpShutdown() {
      rfb.xvpShutdown();
      return false;
    }

    function xvpReboot() {
      rfb.xvpReboot();
      return false;
    }

    function xvpReset() {
      rfb.xvpReset();
      return false;
    }

    function xvpInit(ver) {
      const xvpbuttons = $('#noVNC_xvp_buttons')[0];
      if (ver >= 1) {
        xvpbuttons.style.display = 'inline';
      } else {
        xvpbuttons.style.display = 'none';
      }
    }

    function updateState(rfb2, state, oldstate, msg) {
      let level;
      const s = $('#noVNC_status')[0];
      const sb = $('#noVNC_status_bar')[0];
      const cad = $('#sendCtrlAltDelButton')[0];
      switch (state) {
        case 'failed': level = 'error'; break;
        case 'fatal': level = 'error'; break;
        case 'normal': level = 'normal'; break;
        case 'disconnected': level = 'normal'; break;
        case 'loaded': level = 'normal'; break;
        default: level = 'warn'; break;
      }

      if (state === 'normal') {
        cad.disabled = false;
      } else {
        cad.disabled = true;
        xvpInit(0);
      }

      if (typeof(msg) !== 'undefined') {
        sb.setAttribute('class', `noVNC_status_${level}`);
        s.innerHTML = msg;
      }
    }

    window.onresize = () => {
      // When the window has been resized, wait until the size remains
      // the same for 0.5 seconds before sending the request for changing
      // the resolution of the session
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeUI();
      }, 500);
    };

    const host = this.props.params.host;
    const port = this.props.params.port;
    const token = this.props.params.token;

    if ((!host) || (!port) || (!token)) {
      return;
    }

    let path;

    $('#sendCtrlAltDelButton')[0].style.display = 'inline';
    $('#sendCtrlAltDelButton')[0].onclick = sendCtrlAltDel;
    $('#xvpShutdownButton')[0].onclick = xvpShutdown;
    $('#xvpRebootButton')[0].onclick = xvpReboot;
    $('#xvpResetButton')[0].onclick = xvpReset;

    WebUtil.init_logging(WebUtil.getConfigVar('logging', 'warn'));
    document.title = unescape(WebUtil.getConfigVar('title', 'noVNC'));

    const password = WebUtil.getConfigVar('password', '');
    path = WebUtil.getConfigVar('path', 'websockify');

    // If a token letiable is passed in, set the parameter in a cookie.
    // This is used by nova-novncproxy.
    if (token) {
      // if token is already present in the path we should use it
      path = WebUtil.injectParamIfMissing(path, 'token', token);

      WebUtil.createCookie('token', token, 1);
    }

    if ((!host) || (!port)) {
      updateState(null, 'fatal', null, 'Must specify host and port in URL');
      return;
    }

    try {
      rfb = new RFB({
        target: $('#noVNC_canvas')[0],
        encrypt: WebUtil.getConfigVar('encrypt', (window.location.protocol === 'https:')),
        repeaterID: WebUtil.getConfigVar('repeaterID', ''),
        true_color: WebUtil.getConfigVar('true_color', true),
        local_cursor: WebUtil.getConfigVar('cursor', true),
        shared: WebUtil.getConfigVar('shared', true),
        view_only: WebUtil.getConfigVar('view_only', false),
        onUpdateState: updateState,
        onXvpInit: xvpInit,
        onPasswordRequired: passwordRequired,
        onFBUComplete: FBUComplete,
      });
    } catch (exc) {
      updateState(null, 'fatal', null, `Unable to create RFB client -- ${exc}`);
      return;
    }

    rfb.connect(host, port, password, path);
  }

  render() {
    const { t } = this.props;
    return (
      <div id="noVNC_container">
        <div id="noVNC_status_bar" className="noVNC_status_bar" style={{ marginTop: '0px' }}>
          <table border="0" width="100%">
            <tbody>
              <tr>
                <td>
                  <div id="noVNC_status" style={{ position: 'relative', height: 'auto' }}>
                    Loading
                  </div>
                </td>
                <td width="1%">
                  <div id="noVNC_buttons">
                    <input
                      type="button"
                      className="btn btn-warning btn-xs"
                      value={t('pageVNC.sendCtrlAltDel')}
                      id="sendCtrlAltDelButton"
                    />
                    <span id="noVNC_xvp_buttons">
                      <input type="button" value="Shutdown" id="xvpShutdownButton" />
                      <input type="button" value="Reboot" id="xvpRebootButton" />
                      <input type="button" value="Reset" id="xvpResetButton" />
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <canvas id="noVNC_canvas" width="640px" height="20px">
          Canvas not supported.
        </canvas>
      </div>
    );
  }
}

export default attach(C);
