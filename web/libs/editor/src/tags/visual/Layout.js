import React from 'react';
import {types} from 'mobx-state-tree';
import {observer} from 'mobx-react';

import Registry from '../../core/Registry';
import {guidGenerator} from '../../utils/unique';
import {sanitizeHtml} from '../../utils/html';
import Tree from '../../core/Tree';
import Types from "../../core/Types";

const LayoutModel = types.model(
  "LayoutModel",
  {
    type: 'layout',
    value: types.optional(types.string, ''),
    children: Types.unionArray([
      'view',
      'header',
      'labels',
      'label',
      'table',
      'taxonomy',
      'choices',
      'choice',
      'collapse',
      'datetime',
      'number',
      'rating',
      'ranker',
      'rectangle',
      'ellipse',
      'polygon',
      'keypoint',
      'brush',
      'magicwand',
      'rectanglelabels',
      'ellipselabels',
      'polygonlabels',
      'keypointlabels',
      'brushlabels',
      'hypertextlabels',
      'timeserieslabels',
      'text',
      'audio',
      'image',
      'hypertext',
      'richtext',
      'timeseries',
      'audioplus',
      'list',
      'dialog',
      'textarea',
      'pairwise',
      'style',
      'label',
      'relations',
      'filter',
      'timeseries',
      'timeserieslabels',
      'pagedview',
      'paragraphs',
      'paragraphlabels',
      'video',
      'videorectangle',
      'ranker',
    ]),
  });


const HtxStyle = observer(({item}) => {
  return (<div>
    <span>Test1</span>
    {Tree.renderChildren(item)}
  </div>);
});

Registry.addTag('layout', LayoutModel, HtxStyle);

export {HtxStyle, LayoutModel};
