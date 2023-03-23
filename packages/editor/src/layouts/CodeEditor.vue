<template>
  <div ref="codeEditor" class="magic-code-editor"></div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { throttle } from 'lodash-es';
import * as monaco from 'monaco-editor';
import serialize from 'serialize-javascript';
import { languages } from 'monaco-editor';
import json = languages.json;

const props = withDefaults(
  defineProps<{
    initValues?: string | Object;
    modifiedValues?: string | Object;
    type?: string;
    language?: string;
    options?: {
      [key: string]: any;
    };
    autoSave?: boolean;
  }>(),
  {
    type: '',
    autoSave: true,
    language: 'javascript',
    options: () => ({
      tabSize: 2,
    }),
  },
);

const emit = defineEmits(['initd', 'save']);

const toString = (v: string | any, language: string): string => {
  let value = '';
  if (typeof v !== 'string') {
    value = serialize(v, {
      space: 2,
      unsafe: true,
    }).replace(/"(\w+)":\s/g, '$1: ');
  } else {
    value = v;
  }
  if (language === 'javascript' && value.startsWith('{') && value.endsWith('}')) {
    value = `(${value})`;
  }
  return value;
};

let vsEditor: monaco.editor.IStandaloneCodeEditor | null = null;
let vsDiffEditor: monaco.editor.IStandaloneDiffEditor | null = null;

const values = ref('');
const loading = ref(false);
const codeEditor = ref<HTMLDivElement>();

const resizeObserver = new globalThis.ResizeObserver(
  throttle((): void => {
    vsEditor?.layout();
    vsDiffEditor?.layout();
  }, 300),
);

const setEditorValue = (v: string | any, m: string | any) => {
  console.log("原始1" + v.items)
  if (props.language === "swift") {
    let jsonString = JSON.stringify(v)
    let jsonObject = JSON.parse(jsonString)
    return  generateSwiftCode(jsonObject)
  }else{
    values.value = toString(v, props.language);
    if (props.type === 'diff') {
      const originalModel = monaco.editor.createModel(values.value, 'text/javascript');
      const modifiedModel = monaco.editor.createModel(toString(m, props.language), 'text/javascript');

      return vsDiffEditor?.setModel({
        original: originalModel,
        modified: modifiedModel,
      });
    }

    console.log(values.value)
    return vsEditor?.setValue(values.value);
  }
};

var swiftCode = ""
let addCode = ""
let layoutCode = ""
const generateSwiftCode = (jsonObjects: any) => {
  swiftCode = ""
  addCode = ""
  layoutCode = ""
  generateSwiftCodeByNode(jsonObjects,null)
  swiftCode += addCode
  swiftCode += "\n"
  swiftCode += layoutCode
  return  vsEditor?.setValue(swiftCode);
};

const generateSwiftCodeByNode = (jsonObjects: any, parent: any | null) => {
  for (const jsonObject of jsonObjects) {
    if (jsonObject.type === "view" || jsonObject === "container"){
      const createView = `
      private lazy var ${jsonObject.name}: UIView = {
        let view = UIView()
        view.backgroundColor = UIColor.white
        return view
      }()
      `
      if (parent != null) {
        const addSubView = `
      ${parent.name}.addSubview(${jsonObject.name})`
        addCode += addSubView
      }
      const items = jsonObject.items
      swiftCode += createView

      let layout = `
      ${jsonObject.name}.configureLayout { (make) in
        make.isEnabled = true`

      const style = jsonObject.style

      if (style.display !== "" && style.display !== undefined) {
        layout += `
        make.display = "${style.display}"`
      }
      if (style.width !== "" && style.width !== undefined) {
        layout += `
        make.width = ${style.width}`
      }
      if (style.height !== "" && style.height !== undefined) {
        layout += `
        make.height = ${style.height}`
      }
      if (style.position !== "" && style.position !== undefined) {
        layout += `
        make.position = "${style.position}"`
      }
      if (style.flexDirection !== "" && style.flexDirection !== undefined) {
        layout += `
        make.flexDirection = "${style.flexDirection}"`
      }
      if (style.top !== "" && style.top !== undefined) {
        layout += `
        make.top = ${style.top}`
      }
      if (style.left !== "" && style.left !== undefined) {
        layout += `
        make.left = ${style.left}`
      }
      if (style.direction !== "" && style.direction !== undefined) {
        layout += `
        make.direction = ${style.direction}`
      }
      if (style.flexWrap !== "" && style.flexWrap !== undefined) {
        layout += `
        make.flexWrap = "${style.flexWrap}"`
      }
      if (style.flexBasis !== "" && style.flexBasis !== undefined) {
        layout += `
        make.flexBasis = ${style.flexBasis}`
      }
      if (style.flexGrow !== "" && style.flexGrow !== undefined) {
        layout += `
        make.flexGrow = ${style.flexGrow}`
      }
      if (style.flexShrink !== "" && style.flexShrink !== undefined) {
        layout += `
        make.flexShrink = ${style.flexShrink}`
      }
      if (style.flex !== "" && style.flex !== undefined) {
        layout += `
        make.flex = ${style.flex}`
      }
      if (style.justifyContent !== "" && style.justifyContent !== undefined) {
        layout += `
        make.justifyContent = "${style.justifyContent}"`
      }
      if (style.alignItems !== "" && style.alignItems !== undefined) {
        layout += `
        make.alignItems = "${style.alignItems}"`
      }
      if (style.alignSelf !== "" && style.alignSelf !== undefined) {
        layout += `
        make.alignSelf = "${style.alignSelf}"`
      }
      if (style.alignContent !== "" && style.alignContent !== undefined) {
        layout += `
        make.alignContent = "${style.alignContent}"`
      }
      if (style.maxWidth !== "" && style.maxWidth !== undefined) {
        layout += `
        make.maxWidth = ${style.maxWidth}`
      }
      if (style.maxHeight !== "" && style.maxHeight !== undefined) {
        layout += `
        make.maxHeight = ${style.maxHeight}`
      }
      if (style.minWidth !== "" && style.minWidth !== undefined) {
        layout += `
        make.minWidth = ${style.minWidth}`
      }
      if (style.minHeight !== "" && style.minHeight !== undefined) {
        layout += `
        make.minHeight = ${style.minHeight}`
      }
      if (style.aspectRatio !== "" && style.aspectRatio !== undefined) {
        layout += `
        make.aspectRatio = ${style.aspectRatio}`
      }
      if (style.paddingLeft !== "" && style.paddingLeft !== undefined) {
        layout += `
        make.paddingLeft = ${style.paddingLeft}`
      }
      if (style.paddingRight !== "" && style.paddingRight !== undefined) {
        layout += `
        make.paddingRight = ${style.paddingRight}`
      }
      if (style.marginTop !== "" && style.marginTop !== undefined) {
        layout += `
        make.marginTop = ${style.marginTop}`
      }
      if (style.marginBottom !== "" && style.marginBottom !== undefined) {
        layout += `
        make.marginBottom = ${style.marginBottom}`
      }
      if (style.positionLeft !== "" && style.positionLeft !== undefined) {
        layout += `
        make.positionLeft = ${style.positionLeft}`
      }
      if (style.positionRight !== "" && style.positionRight !== undefined) {
        layout += `
        make.positionRight = ${style.positionRight}`
      }
      if (style.positionTop !== "" && style.positionTop !== undefined) {
        layout += `
        make.positionTop = ${style.positionTop}`
      }
      if (style.positionBottom !== "" && style.positionBottom !== undefined) {
        layout += `
        make.positionBottom = ${style.positionBottom}`
      }
      if (style.right !== "" && style.right !== undefined) {
        layout += `
        make.right = ${style.right}`
      }
      if (style.bottom !== "" && style.bottom !== undefined) {
        layout += `
        make.bottom = ${style.bottom}`
      }
      if (style.backgroundImage !== "" && style.backgroundImage !== undefined) {
        layout += `
        make.backgroundImage = "${style.backgroundImage}"`
      }
      if (style.backgroundColor !== "" && style.backgroundColor !== undefined) {
        layout += `
        make.backgroundColor = "${style.backgroundColor}"`
      }
      if (style.backgroundRepeat !== "" && style.backgroundRepeat !== undefined) {
        layout += `
        make.backgroundRepeat = "${style.backgroundRepeat}"`
      }
      if (style.backgroundSize !== "" && style.backgroundSize !== undefined) {
        layout += `
        make.backgroundSize = "${style.backgroundSize}"`
      }
      if (style.color !== "" && style.color !== undefined) {
        layout += `
        make.color = "${style.color}"`
      }
      if (style.fontSize !== "" && style.fontSize !== undefined) {
        layout += `
        make.fontSize = "${style.fontSize}"`
      }
      if (style.fontWeight !== "" && style.fontWeight !== undefined) {
        layout += `
        make.fontWeight = "${style.fontWeight}"`
      }
      layout += `
      }`
      layoutCode += layout
      generateSwiftCodeByNode(items,jsonObject)
    }
  }
}

const getEditorValue = () =>
  props.type === 'diff' ? vsDiffEditor?.getModifiedEditor().getValue() : vsEditor?.getValue();

const init = async () => {
  if (!codeEditor.value) return;

  const options = {
    value: values.value,
    language: props.language,
    theme: 'vs-dark',
    ...props.options,
  };

  if (props.type === 'diff') {
    vsDiffEditor = monaco.editor.createDiffEditor(codeEditor.value, options);
  } else {
    vsEditor = monaco.editor.create(codeEditor.value, options);
  }

  setEditorValue(props.initValues, props.modifiedValues);

  loading.value = false;

  emit('initd', vsEditor);

  codeEditor.value.addEventListener('keydown', (e) => {
    if (e.keyCode === 83 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
      e.preventDefault();
      e.stopPropagation();
      emit('save', getEditorValue());
    }
  });

  if (props.type !== 'diff' && props.autoSave) {
    vsEditor?.onDidBlurEditorWidget(() => {
      emit('save', getEditorValue());
    });
  }

  resizeObserver.observe(codeEditor.value);
};

watch(
  () => props.initValues,
  (v, preV) => {
    if (v !== preV) {
      setEditorValue(props.initValues, props.modifiedValues);
    }
  },
  {
    deep: true,
    immediate: true,
  },
);

onMounted(async () => {
  loading.value = true;

  init();
});

onUnmounted(() => {
  resizeObserver.disconnect();
});

defineExpose({
  getEditor() {
    return vsEditor || vsDiffEditor;
  },

  setEditorValue,

  focus() {
    vsEditor?.focus();
    vsDiffEditor?.focus();
  },
});
</script>
