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

export default {
  id: '75f0extui9d7yksklx27hff8xg',
  name: 'test',
  type: 'app',
  codeBlocks: {
    code_5336: {
      name: 'getData',
      // eslint-disable-next-line no-eval
      content: eval(`(vm) => {\n  console.log("this is getData function")\n}`),
      comps: {
        page_299: ['mounted', 'created'],
      },
    },
    code_5316: {
      name: 'getList',
      // eslint-disable-next-line no-eval
      content: eval(`(vm) => {\n  console.log("this is getList function")\n}`),
      comps: {
        text_9027: ['created'],
        page_299: ['created'],
      },
    },
  },
  items: [
    {
      type: 'page',
      id: 'page_299',
      name: 'index',
      title: '',
      layout: 'absolute',
      // layout: 'relative',
      style: {
        display: 'flex',
        position: 'absolute',
        left: 0,
        top: 0,
        right: '',
        bottom: '',
        width: '100%',
        height: '667',
        maxHeight: '2000',
        backgroundImage: '',
        backgroundColor: 'rgba(248, 249, 252, 1)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
        color: '',
        fontSize: '',
        fontWeight: '',
        paddingTop: '',
        flexDirection: 'column',
      },
      events: [],
      created: ['code_5316', 'code_5336'],
      mounted: ['code_5336'],
      items: [],
    },
  ],
};
