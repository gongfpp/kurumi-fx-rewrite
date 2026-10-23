// User-approved original game dialogue. These are not manga quotations.
// Every panel retains its own speakers and directions; silence is not dialogue.
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
const scene=(id,title,characters,dialoguePanels)=>({
 title,characters,people:characters.length,dialogueId:`approved-four-skits-20261010:${id}`,
 dialoguePanels,lines:dialoguePanels.flatMap(panel=>panel.lines),
});
export const APPROVED_FOUR_SKITS=freeze({
 'dinner-small':scene('dinner-small','请吃一顿饭',['久留美','萌智子'],[
  {lines:[['久留美','赚到了！今天我请你吃饭。'],['萌智子','好啊，我正好饿了。']]},
  {lines:[['久留美','两份咖喱，一千五。就这家？'],['萌智子','我要不辣的。']]},
  {lines:[['久留美','我就说能赚到吧。'],['萌智子','嗯，今天赚到了。']]},
  {action:'萌智子拿勺。',lines:[['久留美','等一下，我拍张照。'],['萌智子','那你快点。']]},
 ]),
 'holding-loss-companion':scene('holding-loss-companion','再等一下',['久留美','萌智子'],[
  {lines:[['久留美','跌一点很正常，马上就回去了。'],['萌智子','已经比刚才低了。']]},
  {lines:[['萌智子','还拿着？'],['久留美','再等一下。']]},
  {action:'报价又跌，萌智子沉默。',lines:[['久留美','等、等一下……']]},
  {action:'久留美拉住萌智子的袖子。',lines:[['久留美','……你先别走。'],['萌智子','我又没说要走。']]},
 ]),
 'mebuki-after-loan':scene('mebuki-after-loan','先吃',['芽吹','康子'],[
  {lines:[['芽吹','她答应借我了。'],['康子','还真让你借到了啊。']]},
  {lines:[['芽吹','这次赚回来，以后就不用上班了。'],['康子','你都借钱了，还惦记这个。']]},
  {action:'康子拆面包。',lines:[['芽吹','……我这次会小心的。'],['康子','你中午吃没吃？']]},
  {action:'康子递来一半面包。',lines:[['芽吹','还没。'],['康子','拿着，先吃。']]},
 ]),
 'shrine-walk':scene('shrine-walk','去神社走走',['久留美'],[
  {action:'久留美把手机塞进口袋。',lines:[['久留美','先不看了。']]},
  {action:'久留美合掌。',lines:[['久留美','明天顺利一点吧。']]},
  {action:'下台阶时，久留美摸出手机。',lines:[['久留美','就看一眼……']]},
  {action:'久留美把手机按回口袋。',lines:[['久留美','……出了神社再看。']]},
 ]),
});
