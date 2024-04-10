import Registry from '../../../core/Registry';
import * as AudioModel from './model';
import { HtxAudio } from './view';
import { AudioRegionModel } from '../../../regions/AudioRegion';

// Fallback to the previos version
let _tagView = HtxAudio;
let _model = AudioModel.SpectrogramModel;


Registry.addTag('spectrogram', _model, _tagView);
Registry.addObjectType(_model);

export { AudioRegionModel, _model as SpectrogramModel, HtxAudio };
