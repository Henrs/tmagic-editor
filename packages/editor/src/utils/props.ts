/*
 * Tencent is pleased to support the open source community by making TMagicEditor available.
 *
 * Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { FormConfig, FormState } from '@tmagic/form';

// import editorService from '../services/editor';
// import eventsService from '../services/events';
// 这里是组件属性的的配置
/**
 * 统一为组件属性表单加上事件、高级、样式配置
 * @param config 组件属性配置
 * @returns Object
 */
// 这个类会根据传入的一些配置,生成一个完整的配置,返回给上层使用
export const fillConfig = (config: FormConfig = []) => [
  {
    type: 'tab',
    items: [
      {
        title: 'Flex布局',
        labelWidth: '80px',
        items: [
          {
            name: 'style',
            items: [
              {
                type: 'fieldset',
                legend: 'Flex',
                items: [
                  {
                    type: 'select',
                    text: 'direction',
                    name: 'direction',
                    defaultValue: 2,
                    options: [
                      {
                        text: 'inherit',
                        value: 1,
                      },
                      {
                        text: 'ltr',
                        value: 2,
                      },
                      {
                        text: 'rtr',
                        value: 3,
                      },
                    ],
                  },
                  {
                    type: 'select',
                    text: 'flexDirection',
                    name: 'flexDirection',
                    defaultValue: 'column',
                    options: [
                      {
                        text: 'row',
                        value: 'row',
                      },
                      {
                        text: 'rowReverse',
                        value: 'row-reverse',
                      },
                      {
                        text: 'column',
                        value: 'column',
                      },
                      {
                        text: 'columnReverse',
                        value: 'column-reverse',
                      },
                    ],
                  },
                  {
                    type: 'select',
                    text: 'flexWrap',
                    name: 'flexWrap',
                    defaultValue: 'nowrap',
                    options: [
                      {
                        text: 'noWrap',
                        value: 'nowrap',
                      },
                      {
                        text: 'wrap',
                        value: 'wrap',
                      },
                      {
                        text: 'wrapReverse',
                        value: 'wrap-reverse',
                      },
                    ],
                  },
                  {
                    text: 'flexBasis',
                    name: 'flexBasis',
                    defaultValue: '',
                  },
                  {
                    text: 'flexGrow',
                    name: 'flexGrow',
                    defaultValue: '',
                  },
                  {
                    text: 'flexShrink',
                    name: 'flexShrink',
                    defaultValue: '',
                  },
                  {
                    text: 'flex',
                    name: 'flex',
                    defaultValue: '',
                  },
                ],
              },
              {
                type: 'fieldset',
                legend: 'Alignment',
                items: [
                  {
                    type: 'select',
                    text: 'justifyContent',
                    name: 'justifyContent',
                    defaultValue: 'flex-start',
                    options: [
                      {
                        text: 'flex start',
                        value: 'flex-start',
                      },
                      {
                        text: 'center',
                        value: 'center',
                      },
                      {
                        text: 'flex end',
                        value: 'flex-end',
                      },
                      {
                        text: 'space between',
                        value: 'space-between',
                      },
                      {
                        text: 'space around',
                        value: 'space-around',
                      },
                      {
                        text: 'space evenly',
                        value: 'space-evenly',
                      },
                    ],
                  },
                  {
                    type: 'select',
                    text: 'alignItems',
                    name: 'alignItems',
                    defaultValue: 'initial',
                    options: [
                      {
                        text: 'auto',
                        value: 'initial',
                      },
                      {
                        text: 'flex start',
                        value: 'flex-start',
                      },
                      {
                        text: 'center',
                        value: 'center',
                      },
                      {
                        text: 'flex end',
                        value: 'flex-end',
                      },
                      {
                        text: 'stretch',
                        value: 'stretch',
                      },
                      {
                        text: 'baseline',
                        value: 'baseline',
                      },
                      {
                        text: 'space evenly',
                        value: 'space-evenly',
                      },
                      {
                        text: 'space around',
                        value: 'space-around',
                      },
                    ],
                  },
                  {
                    type: 'select',
                    text: 'alignSelf',
                    name: 'alignSelf',
                    defaultValue: 'initial',
                    options: [
                      {
                        text: 'auto',
                        value: 'initial',
                      },
                      {
                        text: 'flex start',
                        value: 'flex-start',
                      },
                      {
                        text: 'center',
                        value: 'center',
                      },
                      {
                        text: 'flex end',
                        value: 'flex-end',
                      },
                      {
                        text: 'stretch',
                        value: 'stretch',
                      },
                      {
                        text: 'baseline',
                        value: 'baseline',
                      },
                      {
                        text: 'space evenly',
                        value: 'space-evenly',
                      },
                      {
                        text: 'space around',
                        value: 'space-around',
                      },
                    ],
                  },
                  {
                    type: 'select',
                    text: 'alignContent',
                    name: 'alignContent',
                    defaultValue: 'initial',
                    options: [
                      {
                        text: 'auto',
                        value: 'initial',
                      },
                      {
                        text: 'flex start',
                        value: 'flex-start',
                      },
                      {
                        text: 'center',
                        value: 'center',
                      },
                      {
                        text: 'flex end',
                        value: 'flex-end',
                      },
                      {
                        text: 'stretch',
                        value: 'stretch',
                      },
                      {
                        text: 'baseline',
                        value: 'baseline',
                      },
                      {
                        text: 'space evenly',
                        value: 'space-evenly',
                      },
                      {
                        text: 'space around',
                        value: 'space-around',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'fieldset',
                legend: 'Size',
                items: [
                  {
                    text: 'width',
                    name: 'width',
                    defaultValue: '',
                  },
                  {
                    text: 'height',
                    name: 'height',
                    defaultValue: '',
                  },
                  {
                    text: 'maxWidth',
                    name: 'maxWidth',
                    defaultValue: '',
                  },
                  {
                    text: 'maxHeight',
                    name: 'maxHeight',
                    defaultValue: '',
                  },
                  {
                    text: 'minWidth',
                    name: 'minWidth',
                    defaultValue: '',
                  },
                  {
                    text: 'minHeight',
                    name: 'minHeight',
                    defaultValue: '',
                  },
                  {
                    text: 'aspectRatio',
                    name: 'aspectRatio',
                    defaultValue: '',
                  },
                ],
              },
              {
                type: 'fieldset',
                legend: 'Paddings',
                items: [
                  {
                    text: 'left',
                    name: 'paddingLeft',
                    defaultValue: '',
                  },
                  {
                    text: 'right',
                    name: 'paddingRight',
                    defaultValue: '',
                  },
                  {
                    text: 'top',
                    name: 'paddingTop',
                    defaultValue: '',
                  },
                  {
                    text: 'bottom',
                    name: 'paddingBottom',
                    defaultValue: '',
                  },
                ],
              },
              {
                type: 'fieldset',
                legend: 'Border',
                items: [
                  {
                    text: 'left',
                    name: 'borderLeft',
                    defaultValue: '',
                  },
                  {
                    text: 'right',
                    name: 'borderRight',
                    defaultValue: '',
                  },
                  {
                    text: 'top',
                    name: 'borderTop',
                    defaultValue: '',
                  },
                  {
                    text: 'bottom',
                    name: 'borderBottom',
                    defaultValue: '',
                  },
                ],
              },
              {
                type: 'fieldset',
                legend: 'Margin',
                items: [
                  {
                    text: 'left',
                    name: 'marginLeft',
                    defaultValue: '',
                  },
                  {
                    text: 'right',
                    name: 'marginRight',
                    defaultValue: '',
                  },
                  {
                    text: 'top',
                    name: 'marginTop',
                    defaultValue: '',
                  },
                  {
                    text: 'bottom',
                    name: 'marginBottom',
                    defaultValue: '',
                  },
                ],
              },
              {
                type: 'fieldset',
                legend: 'PositionType',
                items: [
                  {
                    type: 'select',
                    text: 'position',
                    name: 'position',
                    defaultValue: 'relative',
                    options: [
                      {
                        text: 'relative',
                        value: 'relative',
                      },
                      {
                        text: 'absolute',
                        value: 'absolute',
                      },
                    ],
                  },
                  {
                    text: 'left',
                    name: 'positionLeft',
                    defaultValue: '',
                  },
                  {
                    text: 'right',
                    name: 'positionRight',
                    defaultValue: '',
                  },
                  {
                    text: 'top',
                    name: 'positionTop',
                    defaultValue: '',
                  },
                  {
                    text: 'bottom',
                    name: 'positionBottom',
                    defaultValue: '',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: '样式',
        labelWidth: '80px',
        items: [
          {
            name: 'style',
            items: [
              {
                type: 'fieldset',
                legend: '位置',
                items: [
                  {
                    name: 'position',
                    type: 'checkbox',
                    activeValue: 'fixed',
                    inactiveValue: 'absolute',
                    defaultValue: 'absolute',
                    text: '固定定位',
                  },
                  {
                    name: 'left',
                    text: 'left',
                  },
                  {
                    name: 'top',
                    text: 'top',
                    disabled: (vm: FormState, { model }: any) =>
                      model.position === 'fixed' && model._magic_position === 'fixedBottom',
                  },
                  {
                    name: 'right',
                    text: 'right',
                  },
                  {
                    name: 'bottom',
                    text: 'bottom',
                    disabled: (vm: FormState, { model }: any) =>
                      model.position === 'fixed' && model._magic_position === 'fixedTop',
                  },
                ],
              },
              {
                type: 'fieldset',
                legend: '盒子',
                items: [
                  {
                    name: 'width',
                    text: '宽度',
                  },
                  {
                    name: 'height',
                    text: '高度',
                  },
                ],
              },
              {
                type: 'fieldset',
                legend: '背景',
                items: [
                  {
                    name: 'backgroundImage',
                    text: '背景图',
                  },
                  {
                    name: 'backgroundColor',
                    text: '背景颜色',
                    type: 'colorPicker',
                  },
                  {
                    name: 'backgroundRepeat',
                    text: '背景图重复',
                    type: 'select',
                    defaultValue: 'no-repeat',
                    options: [
                      { text: 'repeat', value: 'repeat' },
                      { text: 'repeat-x', value: 'repeat-x' },
                      { text: 'repeat-y', value: 'repeat-y' },
                      { text: 'no-repeat', value: 'no-repeat' },
                      { text: 'inherit', value: 'inherit' },
                    ],
                  },
                  {
                    name: 'backgroundSize',
                    text: '背景图大小',
                    defaultValue: '100% 100%',
                  },
                ],
              },
              {
                type: 'fieldset',
                legend: '字体',
                items: [
                  {
                    name: 'color',
                    text: '颜色',
                    type: 'colorPicker',
                  },
                  {
                    name: 'fontSize',
                    text: '大小',
                  },
                  {
                    name: 'fontWeight',
                    text: '粗细',
                  },
                ],
              },
              {
                type: 'fieldset',
                legend: '变形',
                name: 'transform',
                items: [
                  {
                    name: 'rotate',
                    text: '旋转角度',
                  },
                  {
                    name: 'scale',
                    text: '缩放',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: '属性',
        labelWidth: '80px',
        items: [
          // 组件类型，必须要有
          {
            text: 'type',
            name: 'type',
            type: 'hidden',
          },
          // 组件id，必须要有
          {
            name: 'id',
            type: 'display',
            text: 'id',
          },
          {
            name: 'name',
            text: '组件名称',
          },
          ...config,
        ],
      },
      // {
      //   title: '事件',
      //   items: [
      //     {
      //       type: 'table',
      //       name: 'events',
      //       items: [
      //         {
      //           name: 'name',
      //           label: '事件名',
      //           type: 'select',
      //           options: (mForm: FormState, { formValue }: any) =>
      //             eventsService.getEvent(formValue.type).map((option) => ({
      //               text: option.label,
      //               value: option.value,
      //             })),
      //         },
      //         {
      //           name: 'to',
      //           label: '联动组件',
      //           type: 'ui-select',
      //         },
      //         {
      //           name: 'method',
      //           label: '动作',
      //           type: 'select',
      //           options: (mForm: FormState, { model }: any) => {
      //             const node = editorService.getNodeById(model.to);
      //             if (!node?.type) return [];
      //
      //             return eventsService.getMethod(node.type).map((option) => ({
      //               text: option.label,
      //               value: option.value,
      //             }));
      //           },
      //         },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   title: '高级',
      //   lazy: true,
      //   items: [
      //     {
      //       name: 'created',
      //       text: 'created',
      //       type: 'code-select',
      //       labelWidth: '100px',
      //     },
      //     {
      //       name: 'mounted',
      //       text: 'mounted',
      //       type: 'code-select',
      //       labelWidth: '100px',
      //     },
      //   ],
      // },
    ],
  },
];
