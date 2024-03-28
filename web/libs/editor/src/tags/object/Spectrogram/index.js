import Registry from '../../../core/Registry';
import * as SpecAudioModel from './model';
import { HtxSpecAudio } from './view';




// Fallback to the previos version
let _tagView = HtxSpecAudio;
let _model = SpecAudioModel.SpectrogramModel;


// Replacing both Audio and AudioPlus
// Must add a deprecation warning
Registry.addTag('spectrogram', _model, _tagView);
Registry.addObjectType(_model);

export { _model as SpectrogramModel, HtxSpecAudio };
