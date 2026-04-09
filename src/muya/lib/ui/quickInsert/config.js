import paragraphIcon from '../../assets/pngicon/paragraph/2.png'
import htmlIcon from '../../assets/pngicon/html/2.png'
import hrIcon from '../../assets/pngicon/horizontal_line/2.png'
import frontMatterIcon from '../../assets/pngicon/front_matter/2.png'
import header1Icon from '../../assets/pngicon/heading_1/2.png'
import header2Icon from '../../assets/pngicon/heading_2/2.png'
import header3Icon from '../../assets/pngicon/heading_3/2.png'
import header4Icon from '../../assets/pngicon/heading_4/2.png'
import header5Icon from '../../assets/pngicon/heading_5/2.png'
import header6Icon from '../../assets/pngicon/heading_6/2.png'
import newTableIcon from '../../assets/pngicon/new_table/2.png'
import bulletListIcon from '../../assets/pngicon/bullet_list/2.png'
import codeIcon from '../../assets/pngicon/code/2.png'
import quoteIcon from '../../assets/pngicon/quote_block/2.png'
import todoListIcon from '../../assets/pngicon/todolist/2.png'
import mathblockIcon from '../../assets/pngicon/math/2.png'
import orderListIcon from '../../assets/pngicon/order_list/2.png'
import flowchartIcon from '../../assets/pngicon/flowchart/2.png'
import sequenceIcon from '../../assets/pngicon/sequence/2.png'
import plantumlIcon from '../../assets/pngicon/plantuml/2.png'
import mermaidIcon from '../../assets/pngicon/mermaid/2.png'
import vegaIcon from '../../assets/pngicon/chart/2.png'
import { isOsx } from '../../config'
import { t } from '../../../../renderer/i18n'

const COMMAND_KEY = isOsx ? '⌘' : 'Ctrl'
const OPTION_KEY = isOsx ? '⌥' : 'Alt'
const SHIFT_KEY = isOsx ? '⇧' : 'Shift'

// Command (or Cmd) ⌘
// Shift ⇧
// Option (or Alt) ⌥
// Control (or Ctrl) ⌃
// Caps Lock ⇪
// Fn

export const quickInsertObj = {
  'basic block': [{
    title: t('muya.quickInsert.paragraph'),
    subTitle: 'Lorem Ipsum is simply dummy text',
    label: 'paragraph',
    shortCut: `${COMMAND_KEY}+0`,
    icon: paragraphIcon
  }, {
    title: t('muya.quickInsert.horizontalLine'),
    subTitle: '---',
    label: 'hr',
    shortCut: `${OPTION_KEY}+${COMMAND_KEY}+-`,
    icon: hrIcon
  }, {
    title: t('muya.quickInsert.frontMatter'),
    subTitle: '--- Lorem Ipsum ---',
    label: 'front-matter',
    shortCut: `${OPTION_KEY}+${COMMAND_KEY}+Y`,
    icon: frontMatterIcon
  }],
  header: [{
    title: t('muya.quickInsert.header1'),
    subTitle: '# Lorem Ipsum is simply ...',
    label: 'heading 1',
    shortCut: `${COMMAND_KEY}+1`,
    icon: header1Icon
  }, {
    title: t('muya.quickInsert.header2'),
    subTitle: '## Lorem Ipsum is simply ...',
    label: 'heading 2',
    shortCut: `${COMMAND_KEY}+2`,
    icon: header2Icon
  }, {
    title: t('muya.quickInsert.header3'),
    subTitle: '### Lorem Ipsum is simply ...',
    label: 'heading 3',
    shortCut: `${COMMAND_KEY}+3`,
    icon: header3Icon
  }, {
    title: t('muya.quickInsert.header4'),
    subTitle: '#### Lorem Ipsum is simply ...',
    label: 'heading 4',
    shortCut: `${COMMAND_KEY}+4`,
    icon: header4Icon
  }, {
    title: t('muya.quickInsert.header5'),
    subTitle: '##### Lorem Ipsum is simply ...',
    label: 'heading 5',
    shortCut: `${COMMAND_KEY}+5`,
    icon: header5Icon
  }, {
    title: t('muya.quickInsert.header6'),
    subTitle: '###### Lorem Ipsum is simply ...',
    label: 'heading 6',
    shortCut: `${COMMAND_KEY}+6`,
    icon: header6Icon
  }],
  'advanced block': [{
    title: t('muya.quickInsert.tableBlock'),
    subTitle: '|Lorem | Ipsum is simply |',
    label: 'table',
    shortCut: `${SHIFT_KEY}+${COMMAND_KEY}+T`,
    icon: newTableIcon
  }, {
    title: t('muya.quickInsert.displayMath'),
    subTitle: '$$ Lorem Ipsum is simply $$',
    label: 'mathblock',
    shortCut: `${OPTION_KEY}+${COMMAND_KEY}+M`,
    icon: mathblockIcon
  }, {
    title: t('muya.quickInsert.htmlBlock'),
    subTitle: '<div> Lorem Ipsum is simply </div>',
    label: 'html',
    shortCut: `${OPTION_KEY}+${COMMAND_KEY}+J`,
    icon: htmlIcon
  }, {
    title: t('muya.quickInsert.codeBlock'),
    subTitle: '```java Lorem Ipsum is simply ```',
    label: 'pre',
    shortCut: `${OPTION_KEY}+${COMMAND_KEY}+C`,
    icon: codeIcon
  }, {
    title: t('muya.quickInsert.quoteBlock'),
    subTitle: '>Lorem Ipsum is simply ...',
    label: 'blockquote',
    shortCut: `${OPTION_KEY}+${COMMAND_KEY}+Q`,
    icon: quoteIcon
  }],
  'list block': [{
    title: t('muya.quickInsert.orderList'),
    subTitle: '1. Lorem Ipsum is simply ...',
    label: 'ol-order',
    shortCut: `${OPTION_KEY}+${COMMAND_KEY}+O`,
    icon: orderListIcon
  }, {
    title: t('muya.quickInsert.bulletList'),
    subTitle: '- Lorem Ipsum is simply ...',
    label: 'ul-bullet',
    shortCut: `${OPTION_KEY}+${COMMAND_KEY}+U`,
    icon: bulletListIcon
  }, {
    title: t('muya.quickInsert.todoList'),
    subTitle: '- [x] Lorem Ipsum is simply ...',
    label: 'ul-task',
    shortCut: `${OPTION_KEY}+${COMMAND_KEY}+X`,
    icon: todoListIcon
  }],
  diagram: [{
    title: t('muya.quickInsert.vegaChart'),
    subTitle: t('muya.quickInsert.renderFlowChartByVegaLiteJs'),
    label: 'vega-lite',
    icon: vegaIcon
  }, {
    title: t('muya.quickInsert.flowChart'),
    subTitle: t('muya.quickInsert.renderFlowChartByFlowchartJs'),
    label: 'flowchart',
    icon: flowchartIcon
  }, {
    title: t('muya.quickInsert.sequenceDiagram'),
    subTitle: t('muya.quickInsert.renderSequenceDiagramByJsSequence'),
    label: 'sequence',
    icon: sequenceIcon
  }, {
    title: t('muya.quickInsert.plantUmlDiagram'),
    subTitle: t('muya.quickInsert.renderPlantUmlDiagrams'),
    label: 'plantuml',
    icon: plantumlIcon
  }, {
    title: t('muya.quickInsert.mermaid'),
    subTitle: t('muya.quickInsert.renderDiagramByMermaid'),
    label: 'mermaid',
    icon: mermaidIcon
  }]
}
