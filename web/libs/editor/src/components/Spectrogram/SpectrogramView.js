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
      spec_plugin: null,
      isDrawing: false // New state to track drawing status
    };
    this.wsRef = React.createRef();
  }

  componentDidMount() {
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

    // Add event listeners for drawing
    const canvas = this.spec_plugin.canvas;
    canvas.addEventListener('mousedown', this.startDrawing);
    canvas.addEventListener('mouseup', this.draw);
    canvas.addEventListener('mouseleave', this.finishDrawing);
  }

  componentWillUnmount() {
    // Remove event listeners to prevent memory leaks
    const canvas = this.spec_plugin.canvas;
    canvas.removeEventListener('mousedown', this.startDrawing);
    canvas.removeEventListener('mouseup', this.draw);
    canvas.removeEventListener('mouseleave', this.finishDrawing);
  }

  startDrawing = (event) => {
    const canvas = this.spec_plugin.canvas;
    const boundingRect = canvas.getBoundingClientRect();
    this.startX = event.clientX - boundingRect.left;
    this.startY = event.clientY - boundingRect.top;

    this.setState({ isDrawing: true });
  };
  draw = (event) => {
    if (!this.state.isDrawing) return;

    const canvas = this.spec_plugin.canvas;
    const ctx = canvas.getContext('2d');
    const boundingRect = canvas.getBoundingClientRect();
    const x = event.clientX - boundingRect.left;
    const y = event.clientY - boundingRect.top;

    ctx.fillStyle = 'rgba(255, 255, 255, 0)';
    ctx.strokeStyle = 'white';

    ctx.beginPath();
    ctx.rect(this.startX, this.startY, x - this.startX, y - this.startY);
    ctx.fill();
    ctx.stroke();
  };

  finishDrawing = () => {
    this.setState({ isDrawing: false });
  };

  handleSpeedChange = (event) => {
    const newSpeed = parseFloat(event.target.value);
    this.setState({ playbackSpeed: newSpeed });
    if (this.wavesurfer) {
      this.wavesurfer.setPlaybackRate(newSpeed, false);
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
        <div id="wave" ref={this.wsRef} />
        <h1>Controls</h1>
        <div style={{ display: 'flex' }}>
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

          <div style={{ marginLeft: '200px' }}>
            <div>
              <span>Zoom</span>
            </div>
            <span>{zoomLevel}%</span>
            <div>
              <button onClick={this.handleZoomOut} style={{ marginRight: '5px' }}>-</button>
              <button onClick={this.handleZoomIn}>+</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

