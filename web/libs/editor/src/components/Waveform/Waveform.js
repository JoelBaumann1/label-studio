import React from 'react';
import throttle from 'lodash.throttle';
import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm';
import SpectrogramPlugin from "wavesurfer.js/dist/plugins/spectrogram.esm";
import WaveSurfer from 'wavesurfer.js';
import styles from './Waveform.module.scss';
import globalStyles from '../../styles/global.module.scss';
import { Col, Row, Select, Slider } from 'antd';
import { SoundOutlined } from '@ant-design/icons';
import defaultMessages from '../../utils/messages';
import { Hotkey } from '../../core/Hotkey';
import { Tooltip } from '../../common/Tooltip/Tooltip';

const MIN_ZOOM_Y = 1;
const MAX_ZOOM_Y = 50;

/**
 * Use formatTimeCallback to style the notch labels as you wish, such
 * as with more detail as the number of pixels per second increases.
 *
 * Here we format as M:SS.frac, with M suppressed for times < 1 minute,
 * and frac having 0, 1, or 2 digits as the zoom increases.
 *
 * Note that if you override the default function, you'll almost
 * certainly want to override timeInterval, primaryLabelInterval and/or
 * secondaryLabelInterval so they all work together.
 *
 * @param: seconds
 * @param: pxPerSec
 */
function formatTimeCallback(seconds, pxPerSec) {
  seconds = Number(seconds);
  const minutes = Math.floor(seconds / 60);

  seconds = seconds % 60;

  // fill up seconds with zeroes
  let secondsStr = Math.round(seconds).toString();

  if (pxPerSec >= 25 * 10) {
    secondsStr = seconds.toFixed(2);
  } else if (pxPerSec >= 25 * 1) {
    secondsStr = seconds.toFixed(1);
  }

  if (minutes > 0) {
    if (seconds < 10) {
      secondsStr = '0' + secondsStr;
    }
    return `${minutes}:${secondsStr}`;
  }
  return secondsStr;
}

/**
 * Use timeInterval to set the period between notches, in seconds,
 * adding notches as the number of pixels per second increases.
 *
 * Note that if you override the default function, you'll almost
 * certainly want to override formatTimeCallback, primaryLabelInterval
 * and/or secondaryLabelInterval so they all work together.
 *
 * @param: pxPerSec
 */
function timeInterval(pxPerSec) {
  let retval = 1;

  if (pxPerSec >= 25 * 100) {
    retval = 0.01;
  } else if (pxPerSec >= 25 * 40) {
    retval = 0.025;
  } else if (pxPerSec >= 25 * 10) {
    retval = 0.1;
  } else if (pxPerSec >= 25 * 4) {
    retval = 0.25;
  } else if (pxPerSec >= 25) {
    retval = 1;
  } else if (pxPerSec * 5 >= 25) {
    retval = 5;
  } else if (pxPerSec * 15 >= 25) {
    retval = 15;
  } else {
    retval = Math.ceil(0.5 / pxPerSec) * 60;
  }
  return retval;
}

/**
 * Return the cadence of notches that get labels in the primary color.
 * EG, return 2 if every 2nd notch should be labeled,
 * return 10 if every 10th notch should be labeled, etc.
 *
 * Note that if you override the default function, you'll almost
 * certainly want to override formatTimeCallback, primaryLabelInterval
 * and/or secondaryLabelInterval so they all work together.
 *
 * @param pxPerSec
 */
function primaryLabelInterval(pxPerSec) {
  let retval = 1;

  if (pxPerSec >= 25 * 100) {
    retval = 10;
  } else if (pxPerSec >= 25 * 40) {
    retval = 4;
  } else if (pxPerSec >= 25 * 10) {
    retval = 10;
  } else if (pxPerSec >= 25 * 4) {
    retval = 4;
  } else if (pxPerSec >= 25) {
    retval = 1;
  } else if (pxPerSec * 5 >= 25) {
    retval = 5;
  } else if (pxPerSec * 15 >= 25) {
    retval = 15;
  } else {
    retval = Math.ceil(0.5 / pxPerSec) * 60;
  }
  return retval;
}

/**
 * Return the cadence of notches to get labels in the secondary color.
 * EG, return 2 if every 2nd notch should be labeled,
 * return 10 if every 10th notch should be labeled, etc.
 *
 * Secondary labels are drawn after primary labels, so if
 * you want to have labels every 10 seconds and another color labels
 * every 60 seconds, the 60 second labels should be the secondaries.
 *
 * Note that if you override the default function, you'll almost
 * certainly want to override formatTimeCallback, primaryLabelInterval
 * and/or secondaryLabelInterval so they all work together.
 *
 * @param pxPerSec
 */

export default class Waveform extends React.Component {
  constructor(props) {
    super(props);


    this.state = {
      src: this.props.src,
      pos: 0,
      colors: {
        waveColor: '#97A0AF',
        progressColor: '#52c41a',
      },
      zoom: 0,
      zoomY: MIN_ZOOM_Y,
      speed: 1,
      volume: props.muted ? 0 : 1,
    };
  }

  /**
   * Handle to change zoom of wave
   */

  componentDidMount() {
    const messages = this.props.messages || defaultMessages;

    /**
     * @type {import("wavesurfer.js/types/params").WaveSurferParams}
     */

    this.wavesurfer = WaveSurfer.create({
      container: this.$waveform,
      waveColor: 'rgb(255, 255, 255)',
      progressColor: 'rgb(255, 255, 255)',
      url: this.props.src,
      mediaControls: true,
      sampleRate: 250000,
      height: 50,
      plugins: [
        SpectrogramPlugin.create({
          labels: false,
          labelsColor: "white",
          labelsHzColor: "white",
          height: 256,
          splitChannels: true,
          frequencyMin: 0,
          frequencyMax: 125000,
          fftSamples: 1024,
        })
      ],
    });

  }


  setWaveformRef = node => {
    this.$waveform = node;
  };

  render() {

    return (
      <div>
        <h1>Wavesurfer Test</h1>
        <div id="wave" ref={this.setWaveformRef} />

        <div id="timeline" />


      </div>
    );
  }
}
