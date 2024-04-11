// Copyright (c) 2024 FHNW, licensed under MIT License
// Based on ../Waveform/Waveform.js
import React, { Component } from 'react';
import SpectrogramPlugin from "wavesurfer.js/dist/plugins/spectrogram.esm";
import WaveSurfer from 'wavesurfer.js';

export default class SpectrogramView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playbackSpeed: 1.0,
      zoomLevel: 1000,
      spec_plugin: null
    };
    this.wsRef = React.createRef();
  }

  componentDidMount() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const colormap = require('colormap');
    const colors = colormap({
      colormap: 'hot',
      nshades: 256,
      format: 'float',
      alpha: 1,
    });

    this.spec_plugin = SpectrogramPlugin.create({
      labels: true,
      labelsColor: "white",
      labelsHzColor: "white",
      height: 256,
      splitChannels: true,
      colorMap: colors,
      frequencyMin: 0,
      frequencyMax: 125000,
      fftSamples: 1024,
    });


    this.wavesurfer = WaveSurfer.create({
      container: this.wsRef.current,
      waveColor: 'rgb(255, 255, 255)',
      progressColor: 'rgb(255, 255, 255)',
      url: this.props.src,
      mediaControls: true,
      sampleRate: 250000,
      height: 0,
      plugins: [
        this.spec_plugin
      ],
    });
    this.wavesurfer.on('ready', () => {
      this.wavesurfer.zoom(this.state.zoomLevel);
    });
  }

  handleSpeedChange = (event) => {
    const newSpeed = parseFloat(event.target.value);
    this.setState({ playbackSpeed: newSpeed });
    if (this.wavesurfer) {
      this.wavesurfer.setPlaybackRate(newSpeed,false);
    }
  };

  handleZoomIn = () => {
    const newZoomLevel = this.state.zoomLevel + 50;
    this.setState({ zoomLevel: newZoomLevel });
    if (this.wavesurfer) {
      this.wavesurfer.zoom(newZoomLevel);
    }
  };

  handleZoomOut = () => {
    const newZoomLevel = this.state.zoomLevel - 50;
    this.setState({ zoomLevel: newZoomLevel < 0 ? 0 : newZoomLevel });
    if (this.wavesurfer) {
      this.wavesurfer.zoom(newZoomLevel);
    }
  };

  render() {
    const { playbackSpeed, zoomLevel } = this.state;
    return (
    <div>
      <div id="wave" ref={this.wsRef}/>
      <h1>Controls</h1>
      <div style={{display: 'flex'}}>
        <div>
          <div>
            <div>
              <span>Playback Speed</span>
            </div>
            <span>{playbackSpeed}x</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.1"
            value={playbackSpeed}
            onChange={this.handleSpeedChange}
            onInput={this.handleSpeedChange}
          />
        </div>

        <div style={{marginLeft: '200px'}}>
          <div>
            <span>Zoom</span>
          </div>
          <span>{zoomLevel}%</span>
          <div>
            <button onClick={this.handleZoomOut} style={{marginRight: '5px'}}>-</button>
            <button onClick={this.handleZoomIn}>+</button>
          </div>
        </div>
      </div>
    </div>
  );
  }
}
