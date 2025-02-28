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

import { EventEmitter } from 'events';

import type { Id } from '@tmagic/schema';
import { addClassName } from '@tmagic/utils';

import { CONTAINER_HIGHLIGHT_CLASS, DEFAULT_ZOOM, GHOST_EL_ID_PREFIX, PAGE_CLASS } from './const';
import StageDragResize from './StageDragResize';
import StageHighlight from './StageHighlight';
import StageMask from './StageMask';
import StageMultiDragResize from './StageMultiDragResize';
import StageRender from './StageRender';
import {
  CanSelect,
  ContainerHighlightType,
  GuidesEventData,
  IsContainer,
  RemoveData,
  Runtime,
  SortEventData,
  StageCoreConfig,
  StageDragStatus,
  UpdateData,
  UpdateEventData,
} from './types';
import { addSelectedClassName, removeSelectedClassName } from './util';

export default class StageCore extends EventEmitter {
  public container?: HTMLDivElement;
  // 当前选中的节点
  public selectedDom: HTMLElement | undefined;
  // 多选选中的节点组
  public selectedDomList: HTMLElement[] = [];
  public highlightedDom: Element | undefined;
  public renderer: StageRender;
  public mask: StageMask;
  public dr: StageDragResize;
  public multiDr: StageMultiDragResize;
  public highlightLayer: StageHighlight;
  public config: StageCoreConfig;
  public zoom = DEFAULT_ZOOM;
  public containerHighlightClassName: string;
  public containerHighlightDuration: number;
  public containerHighlightType?: ContainerHighlightType;
  public isContainer: IsContainer;

  private canSelect: CanSelect;
  private pageResizeObserver: ResizeObserver | null = null;

  constructor(config: StageCoreConfig) {
    super();

    this.config = config;

    this.setZoom(config.zoom);
    this.canSelect = config.canSelect || ((el: HTMLElement) => !!el.id);
    this.isContainer = config.isContainer;
    this.containerHighlightClassName = config.containerHighlightClassName || CONTAINER_HIGHLIGHT_CLASS;
    this.containerHighlightDuration = config.containerHighlightDuration || 800;
    this.containerHighlightType = config.containerHighlightType;

    this.renderer = new StageRender({ runtimeUrl: config.runtimeUrl, render: this.render.bind(this) });
    this.mask = new StageMask();
    this.dr = new StageDragResize({ core: this, container: this.mask.content, mask: this.mask });
    this.multiDr = new StageMultiDragResize({ core: this, container: this.mask.content, mask: this.mask });
    this.highlightLayer = new StageHighlight({ core: this, container: this.mask.wrapper });

    this.renderer.on('runtime-ready', (runtime: Runtime) => {
      this.emit('runtime-ready', runtime);
    });
    this.renderer.on('page-el-update', (el: HTMLElement) => {
      this.mask?.observe(el);
      this.observePageResize(el);
    });

    this.mask
      .on('beforeSelect', async (event: MouseEvent) => {
        this.clearSelectStatus('multiSelect');
        const el = await this.getElementFromPoint(event);
        if (!el) return;
        this.select(el, event);
      })
      .on('select', () => {
        this.emit('select', this.selectedDom);
      })
      .on('changeGuides', (data: GuidesEventData) => {
        this.dr.setGuidelines(data.type, data.guides);
        this.emit('changeGuides', data);
      })
      .on('highlight', async (event: MouseEvent) => {
        const el = await this.getElementFromPoint(event);
        if (!el) return;
        // 如果多选组件处于拖拽状态时不进行组件高亮
        if (this.multiDr.dragStatus === StageDragStatus.ING) return;
        await this.highlight(el);
        if (this.highlightedDom === this.selectedDom) {
          this.highlightLayer.clearHighlight();
          return;
        }
        this.emit('highlight', this.highlightedDom);
      })
      .on('clearHighlight', async () => {
        this.highlightLayer.clearHighlight();
      })
      .on('beforeMultiSelect', async (event: MouseEvent) => {
        const el = await this.getElementFromPoint(event);
        if (!el) return;
        // 如果已有单选选中元素，不是magic-ui-page就可以加入多选列表
        if (this.selectedDom && !this.selectedDom.className.includes(PAGE_CLASS)) {
          this.selectedDomList.push(this.selectedDom as HTMLElement);
          this.selectedDom = undefined;
        }
        // 判断元素是否已在多选列表
        const existIndex = this.selectedDomList.findIndex((selectedDom) => selectedDom.id === el.id);
        if (existIndex !== -1) {
          // 再次点击取消选中
          this.selectedDomList.splice(existIndex, 1);
        } else {
          this.selectedDomList.push(el);
        }
        this.multiSelect(this.selectedDomList);
        this.emit('multiSelect', this.selectedDomList);
      });

    // 要先触发select，在触发update
    this.dr
      .on('update', (data: UpdateEventData) => {
        console.log('更新节点布局1');
        setTimeout(() => this.emit('update', data));
      })
      .on('sort', (data: UpdateEventData) => {
        setTimeout(() => this.emit('sort', data));
      })
      .on('select-parent', () => {
        this.emit('select-parent');
      });

    this.multiDr
      .on('update', (data: UpdateEventData) => {
        console.log('更新节点布局2');
        setTimeout(() => this.emit('update', data));
      })
      .on('select', async (id: Id) => {
        const el = await this.getTargetElement(id);
        this.select(el); // 选中
        setTimeout(() => this.emit('select', el)); // set node
      });
  }

  public getElementsFromPoint(event: MouseEvent) {
    const { renderer, zoom } = this;

    let x = event.clientX;
    let y = event.clientY;

    if (renderer.iframe) {
      const rect = renderer.iframe.getClientRects()[0];
      if (rect) {
        x = x - rect.left;
        y = y - rect.top;
      }
    }

    return renderer.getDocument()?.elementsFromPoint(x / zoom, y / zoom) as HTMLElement[];
  }

  public async getElementFromPoint(event: MouseEvent) {
    const els = this.getElementsFromPoint(event);
    let stopped = false;
    const stop = () => (stopped = true);
    for (const el of els) {
      if (!el.id.startsWith(GHOST_EL_ID_PREFIX) && (await this.isElCanSelect(el, event, stop))) {
        if (stopped) break;
        return el;
      }
    }
  }

  public async isElCanSelect(el: HTMLElement, event: MouseEvent, stop: () => boolean): Promise<Boolean> {
    // 执行业务方传入的判断逻辑
    const canSelectByProp = await this.canSelect(el, event, stop);
    if (!canSelectByProp) return false;
    // 多选规则
    if (this.mask.isMultiSelectStatus) {
      return this.multiDr.canSelect(el, stop);
    }
    return true;
  }

  /**
   * 选中组件
   * @param idOrEl 组件Dom节点的id属性，或者Dom节点
   */
  public async select(idOrEl: Id | HTMLElement, event?: MouseEvent): Promise<void> {
    this.clearSelectStatus('multiSelect');
    const el = await this.getTargetElement(idOrEl);

    if (el === this.selectedDom) return;

    const runtime = await this.renderer.getRuntime();

    await runtime?.select?.(el.id);

    if (runtime?.beforeSelect) {
      await runtime.beforeSelect(el);
    }

    this.mask.setLayout(el);
    this.dr.select(el, event);

    if (this.config.autoScrollIntoView || el.dataset.autoScrollIntoView) {
      this.mask.observerIntersection(el);
    }

    this.selectedDom = el;

    const doc = this.renderer.getDocument();
    if (doc) {
      removeSelectedClassName(doc);
      if (this.selectedDom) {
        addSelectedClassName(this.selectedDom, doc);
      }
    }
  }

  /**
   * 多选
   * @param domList 多选节点
   */
  public async multiSelect(idOrElList: HTMLElement[] | Id[]): Promise<void> {
    this.clearSelectStatus('select');
    this.selectedDomList = await Promise.all(idOrElList.map(async (idOrEl) => await this.getTargetElement(idOrEl)));
    this.multiDr.multiSelect(this.selectedDomList);
  }

  /**
   * 更新选中的节点
   * @param data 更新的数据
   */
  public update(data: UpdateData): Promise<void> {
    console.log('更新选中的节点');
    console.log(data);
    const { config } = data;
    return this.renderer?.getRuntime().then((runtime) => {
      // runtime update 函数,是用来更新布局的接口
      runtime?.update?.(data);
      // 更新配置后，需要等组件渲染更新
      setTimeout(() => {
        const el = this.renderer.getDocument()?.getElementById(`${config.id}`);
        // 有可能dom已经重新渲染，不再是原来的dom了，所以这里判断id，而不是判断el === this.selectedDom
        if (el && el.id === this.selectedDom?.id) {
          this.selectedDom = el;
          // 更新了组件的布局，需要重新设置mask是否可以滚动
          this.mask.setLayout(el);
          this.dr.updateMoveable(el);
        }
      }, 0);
    });
  }

  /**
   * 高亮选中组件
   * @param el 页面Dom节点
   */
  public async highlight(idOrEl: HTMLElement | Id): Promise<void> {
    let el;
    try {
      el = await this.getTargetElement(idOrEl);
    } catch (error) {
      this.highlightLayer.clearHighlight();
      return;
    }
    if (el === this.highlightedDom || !el) return;
    this.highlightLayer.highlight(el);
    this.highlightedDom = el;
  }

  public sortNode(data: SortEventData): Promise<void> {
    return this.renderer?.getRuntime().then((runtime) => runtime?.sortNode?.(data));
  }

  public add(data: UpdateData): Promise<void> {
    console.log('添加节点2', data);
    return this.renderer?.getRuntime().then((runtime) => runtime?.add?.(data));
  }

  public remove(data: RemoveData): Promise<void> {
    return this.renderer?.getRuntime().then((runtime) => runtime?.remove?.(data));
  }

  public setZoom(zoom: number = DEFAULT_ZOOM): void {
    this.zoom = zoom;
  }

  /**
   * 用于在切换选择模式时清除上一次的状态
   * @param selectType 需要清理的选择模式 多选：multiSelect，单选：select
   */
  public clearSelectStatus(selectType: String) {
    if (selectType === 'multiSelect') {
      this.multiDr.clearSelectStatus();
      this.selectedDomList = [];
    } else {
      this.dr.clearSelectStatus();
    }
  }

  /**
   * 挂载Dom节点
   * @param el 将stage挂载到该Dom节点上
   */
  public async mount(el: HTMLDivElement) {
    this.container = el;
    const { mask, renderer } = this;

    await renderer.mount(el);
    mask.mount(el);

    this.emit('mounted');
  }

  /**
   * 清空所有参考线
   */
  public clearGuides() {
    this.mask.clearGuides();
    this.dr.clearGuides();
  }

  public async addContainerHighlightClassName(event: MouseEvent, exclude: Element[]) {
    const els = this.getElementsFromPoint(event);
    const { renderer } = this;
    const doc = renderer.getDocument();

    if (!doc) return;

    for (const el of els) {
      if (!el.id.startsWith(GHOST_EL_ID_PREFIX) && (await this.isContainer(el)) && !exclude.includes(el)) {
        addClassName(el, doc, this.containerHighlightClassName);
        break;
      }
    }
  }

  public getAddContainerHighlightClassNameTimeout(event: MouseEvent, exclude: Element[] = []): NodeJS.Timeout {
    return globalThis.setTimeout(() => {
      this.addContainerHighlightClassName(event, exclude);
    }, this.containerHighlightDuration);
  }

  /**
   * 销毁实例
   */
  public destroy(): void {
    const { mask, renderer, dr, highlightLayer, pageResizeObserver } = this;

    renderer.destroy();
    mask.destroy();
    dr.destroy();
    highlightLayer.destroy();
    pageResizeObserver?.disconnect();

    this.removeAllListeners();

    this.container = undefined;
  }

  /**
   * 监听页面大小变化
   */
  private observePageResize(page: HTMLElement): void {
    if (typeof ResizeObserver !== 'undefined') {
      this.pageResizeObserver = new ResizeObserver((entries) => {
        this.mask.pageResize(entries);

        if (this.dr.moveable) {
          this.dr.updateMoveable();
        }
      });

      this.pageResizeObserver.observe(page);
    }
  }

  /**
   * 传入stageRender供其回调，获取业务方自定义渲染画布页面渲染结果
   */
  private async render(): Promise<HTMLElement | null> {
    if (this.config?.render) {
      return await this.config.render(this);
    }
    return null;
  }

  private async getTargetElement(idOrEl: Id | HTMLElement): Promise<HTMLElement> {
    if (typeof idOrEl === 'string' || typeof idOrEl === 'number') {
      const el = this.renderer.getDocument()?.getElementById(`${idOrEl}`);
      if (!el) throw new Error(`不存在ID为${idOrEl}的元素`);
      return el;
    }
    return idOrEl;
  }
}
