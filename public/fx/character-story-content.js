// Fixed manga chronology. This module never reads prices or changes a game.
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
export const CHARACTER_STORY_ASSETS=freeze({"89": {"record": 89, "path": "./manga/characters-v1/89.jpg", "sha256": "1ed11cca29b5f7ddcafc0817673b128958aaee097c33b6c8bcd7870e449fbf12", "dimensions": [786, 433]}, "95": {"record": 95, "path": "./manga/characters-v1/95.jpg", "sha256": "809bc596574817852c991deb94d8a244e77a1bff732fe0a27e6086438b4fa8ca", "dimensions": [786, 228]}, "175": {"record": 175, "path": "./manga/characters-v1/175.jpg", "sha256": "c4b09262c97b2a479dc06551b7fd6e48259175a19f532bf9764d96631549a92f", "dimensions": [568, 339]}, "178": {"record": 178, "path": "./manga/characters-v1/178.jpg", "sha256": "9039b3afdbcbd60e4dbcbae117e65d11dd592bb7e0693a5165a59bd803576153", "dimensions": [543, 450]}, "186": {"record": 186, "path": "./manga/characters-v1/186.jpg", "sha256": "40c63a4d72d5bb88e6a6e9cce6914cc3477b6bc969c1c11f25b066b03e4f897e", "dimensions": [661, 611]}, "185": {"record": 185, "path": "./manga/characters-v1/185.jpg", "sha256": "af18905df2c173a06742621099e61fc4edec2f849a84a8d4ac6306f54adf886e", "dimensions": [996, 288]}, "207": {"record": 207, "path": "./manga/characters-v1/207.jpg", "sha256": "091eda2055ad3db561dd173a80b0efffd9e1c62718b417a0741e9158bb64dd9a", "dimensions": [555, 358]}, "206": {"record": 206, "path": "./manga/characters-v1/206.jpg", "sha256": "52112bac2c953e50b175a36b9c6c19119f432d030c76dd44252951f44645f173", "dimensions": [904, 443]}, "45": {"record": 45, "path": "./manga/characters-v1/45.jpg", "sha256": "f519d3a918dadf9a1442de3d9b97f057a69f7a77f4568fe8ada49b1c0c1055c9", "dimensions": [452, 870]}, "172": {"record": 172, "path": "./manga/characters-v1/172.jpg", "sha256": "0689ce751c795eb7cd56b82c0792d24e24c5e4f5a856007c91fab590e7a62da2", "dimensions": [613, 414]}, "37": {"record": 37, "path": "./manga/context-stop-loss-uneasy.jpg", "sha256": "0bd856aacdaeaf4906f2dee8e80513562e56cd9ea530408fac556b9bba1e2958", "dimensions": [827, 446]}, "28": {"record": 28, "path": "./manga/context-long-profit.jpg", "sha256": "1c1b4ffc94318e6c41a9a1bc792ae02827c43387e0d1e57c554793d95f648699", "dimensions": [789, 739]}, "64": {"record": 64, "path": "./manga/context-despair.jpg", "sha256": "47d7bbda56abdf0f1cf6a683ecd584829ef7791cd0a451620af10c1afad3b983", "dimensions": [689, 622]}, "243": {"record": 243, "path": "./manga/context-calm.jpg", "sha256": "d7eea5118d9accd2ca1c796e434533dd486330a6f9d9644f8291ae0a22d9b53e", "dimensions": [348, 417]}, "35": {"record": 35, "path": "./manga/characters-v1/35.jpg", "sha256": "9236b6766367b430c54f67cd72ff70eb03baded10b4be465e9a00e0b393ec6c3", "dimensions": [665, 427]}, "60": {"record": 60, "path": "./manga/characters-v1/60.jpg", "sha256": "b9ee61f313e7b38ab5290564c8ed9c0440de92264771cbe23f7451bedcf27d81", "dimensions": [883, 757]}, "75": {"record": 75, "path": "./manga/characters-v1/75.jpg", "sha256": "af4e2d4382f4129f8241d77d94c5f1232e4116927cb06c38cdf317080c5b5bb9", "dimensions": [829, 294]}, "152": {"record": 152, "path": "./manga/characters-v1/152.jpg", "sha256": "b303270224ac96c2aec90d1f9878e33f2823d3a519fa6145d8cab787f4178a55", "dimensions": [809, 426]}, "202": {"record": 202, "path": "./manga/characters-v1/202.jpg", "sha256": "b0e6f6aa5c6202319fbc3258fdc2e56baa37cae04f106d303709f1d0c462a159", "dimensions": [942, 514]}, "204": {"record": 204, "path": "./manga/characters-v1/204.jpg", "sha256": "dea88db2d1a58bac2e473c15dc795b88919ee673f5d33cf225a162b13d8e1e42", "dimensions": [904, 410]}, "23": {"record": 23, "sha256": "45c93eff2fa480ee6fc02cdf1e241776f9ac3f109ed843f5be9cf6421f5d67bb", "dimensions": [799, 810], "path": "./manga/characters-v1/23.jpg"}, "24": {"record": 24, "sha256": "433d40bf1784a73f6e06b9b70cb4b007003c837e3589f04ee3bf3ccd1d657a9f", "dimensions": [455, 418], "path": "./manga/characters-v1/24.jpg"}, "25": {"record": 25, "sha256": "46bf8d41d1163a31cd4fe10cc4f84d76ed429bb6170ff31bac4ff694825e32c9", "dimensions": [786, 458], "path": "./manga/characters-v1/25.jpg"}, "26": {"record": 26, "sha256": "2dd504d62668a9d72dc8dd6aa4e21db48ae380aa902d4a1746c6db223e92003d", "dimensions": [445, 427], "path": "./manga/characters-v1/26.jpg"}, "32": {"record": 32, "sha256": "b13d09be1e9b368a3ecfaa297701bb5f970f200256772f0c4ac22ba9004eded0", "dimensions": [768, 446], "path": "./manga/characters-v1/32.jpg"}, "33": {"record": 33, "sha256": "1dd449071db5a53b26b5bb5c98f514b29b2ccbbbeb92298be014f6967c3021ce", "dimensions": [768, 386], "path": "./manga/characters-v1/33.jpg"}, "39": {"record": 39, "sha256": "c9e1a761b594d4e6dd5248f345a4f90dc97a8e0e30028d91a178d115d95a8cac", "dimensions": [789, 864], "path": "./manga/characters-v1/39.jpg"}, "40": {"record": 40, "sha256": "bfa60204db1e3c9755ace5b8c4be71d874ad46d70ca9ee8fad23d01a6e394fa3", "dimensions": [804, 557], "path": "./manga/characters-v1/40.jpg"}, "41": {"record": 41, "sha256": "3ac7499288f35d5bfc2b0020dbb5e7c5e375e7d5cb6764e60a8244fe7433dab9", "dimensions": [633, 772], "path": "./manga/characters-v1/41.jpg"}, "42": {"record": 42, "sha256": "2de9d490e0348bd2476bd7e929ff0fc21eb4f55a127b0f7fe7aa7d45d9712203", "dimensions": [808, 749], "path": "./manga/characters-v1/42.jpg"}, "43": {"record": 43, "sha256": "7e4d41fc852a8aee8fdf5f7feaa0a9d6972d84c09cc94992f9020592a3787c36", "dimensions": [762, 359], "path": "./manga/characters-v1/43.jpg"}, "53": {"record": 53, "sha256": "9564474167418e6e7f4a8fd0d7a51ea26bb925ae461a58743a4a8687f82f62b6", "dimensions": [449, 582], "path": "./manga/characters-v1/53.jpg"}, "54": {"record": 54, "sha256": "4b5c620e4fd12b636114c5e97cc33dce420288221aa1bf7587a15e48f251ad78", "dimensions": [879, 656], "path": "./manga/characters-v1/54.jpg"}, "55": {"record": 55, "sha256": "3ea42e76b8ca8682f431186332544c7857128e963ea6be552f178fac7a9c019d", "dimensions": [909, 382], "path": "./manga/characters-v1/55.jpg"}, "56": {"record": 56, "sha256": "39596cfba4916c9bc857e1c953ee1d63ff7bc1ea40d75ea3288668617ab6d9bc", "dimensions": [606, 492], "path": "./manga/characters-v1/56.jpg"}, "57": {"record": 57, "sha256": "8898032c4b2fde2059cdbefa77707cf2bd994d64f3207d2fb816fc86f2ee8bcf", "dimensions": [878, 460], "path": "./manga/characters-v1/57.jpg"}, "58": {"record": 58, "sha256": "a7007b23dcc4d4cbedc5c050dfa4461278554c3bfdd3a3a8c7ea27826f8e18cd", "dimensions": [669, 492], "path": "./manga/characters-v1/58.jpg"}, "61": {"record": 61, "sha256": "1f4dff31427ccb9b0ad7495878f3600470172ef58605559ee1acda3f236f8288", "dimensions": [870, 599], "path": "./manga/characters-v1/61.jpg"}, "63": {"record": 63, "sha256": "c1c7b424dfa62f63cf5a5ebfcceb4c0407c837bc72336a270e48549180bbc836", "dimensions": [883, 652], "path": "./manga/characters-v1/63.jpg"}, "31": {"record": 31, "path": "./manga/context-long-loss.jpg", "sha256": "0435b533eae72afb00cba7879c2be7ce0ee3b50f2fb10c6a244d5f9902eaf401", "dimensions": [773, 888]}});
export const CHARACTER_STORY_NODES=freeze([
 {"id": "funding-refusal", "chapter": 2, "title": "这笔钱不能借", "people": "萌智子与久留美", "pages": [15], "positionOwner": null, "before": "萌智子拿着饮料，笑着提议借给久留美三百万日元，让她拿去买入。", "panels": [{"record": 23, "alt": "萌智子拿着饮料杯，提出300万日元融资"}, {"record": 24, "alt": "久留美尴尬地笑着，拒绝向萌智子借钱"}], "after": "久留美有些尴尬，还是拒绝了她。", "arc": "friend-funding-refusal"},
 {"id": "entry-expectation", "chapter": 2, "title": "还没赚到的二十万", "people": "久留美", "pages": [18], "positionOwner": null, "before": "久留美看着澳元兑日元的走势，算起买入五十枚可能赚到的二十万日元。", "panels": [{"record": 25, "alt": "久留美看着AUD/JPY平板图表，预计买入50枚可能获益20万日元"}, {"record": 26, "alt": "久留美低头操作平板，喊着50枚买入"}], "after": "她知道风险不小，却还是想在年内达成目标。", "arc": "long-expectation-drawdown"},
 {id:'aud-yen-delight',chapter:2,title:'涨起来了',people:'久留美',pages:[22],positionOwner:'久留美 · AUD/JPY持仓损益评估',
  before:'澳元兑日元涨起来了。久留美看着屏幕，兴奋得叫出声。',
  panels:[{record:28,alt:'久留美兴奋地喊着涨了；AUD/JPY账户余额811,600日元，损益评估为正139,500日元'}],
  after:'账户里的浮盈，让她笑得合不拢嘴。'},
 {"id": "profit-fades", "chapter": 2, "title": "盈利跑哪去了", "people": "久留美", "pages": [28, 30], "positionOwner": null, "before": "先前的笑容没维持多久，澳元兑日元又跌了下来。", "panels": [{"record": 31, "alt": "久留美拿着手机冒汗，惊问盈利去了哪里"}, {"record": 32, "alt": "久留美冒汗睁大眼睛，想起自己买入澳元兑日元的位置"}], "after": "刚才还在的浮盈，已经不见了。", "arc": "long-expectation-drawdown"},
 {"id": "look-away", "chapter": 2, "title": "才一会儿没看", "people": "久留美", "pages": [31], "positionOwner": null, "before": "久留美盯着报价，惊得说不出话。", "panels": [{"record": 33, "alt": "久留美满脸汗，惊呼只是短时间没看，澳元兑日元已经跌到95.4日元附近"}], "after": "她没想到，自己离开屏幕的这段时间，行情会变成这样。", "arc": "long-expectation-drawdown"},
 {id:'first-negative-estimate',chapter:3,title:'笑不出来了',people:'久留美',pages:[1],positionOwner:'久留美（持仓损益评估；方向未确认）',
  before:'屏幕上的损益评估是负数。久留美睁大眼睛，额头冒汗。',
  panels:[{record:35,alt:'久留美惊惧地看着负105,000日元的损益评估'}],
  after:'她的表情僵住了。'},
 {id:'considering-stop',chapter:3,title:'及时止损会比较好吧',people:'久留美',pages:[3],positionOwner:'久留美（考虑止损；交易方向未确认）',
  before:'久留美坐在屏幕前，额头冒着汗。',
  panels:[{record:37,alt:'久留美不安地看着屏幕，犹豫是否及时止损'}],
  after:'及时止损，会比较好吧……？'},
 {"id": "refuse-to-stop", "chapter": 3, "title": "还不能就此收手", "people": "久留美", "pages": [6], "positionOwner": null, "before": "刚才还在犹豫要不要止损，久留美又摇摆了。", "panels": [{"record": 39, "alt": "久留美汗流满面，在键盘前交叉双手，喊着不能就此收手"}], "after": "她不甘心就这样结束。", "arc": "holding-loss-liquidation-risk"},
 {"id": "loss-deepens", "chapter": 3, "title": "数字还在往下", "people": "久留美", "pages": [11, 14], "positionOwner": null, "before": "久留美缩着肩膀，眼看着负损益评估越变越大。", "panels": [{"record": 40, "alt": "久留美抱住胳膊，损益评估负272,500日元"}, {"record": 41, "alt": "久留美呆立在房间中；AUD/JPY现价94.619日元，损益评估负495,500日元"}], "after": "澳元兑日元还在下跌，她的脸色也变了。", "arc": "holding-loss-liquidation-risk"},
 {"id": "support-and-margin", "chapter": 3, "title": "还没等到反弹", "people": "久留美", "pages": [15, 16], "positionOwner": null, "before": "久留美把九十三、九十四日元附近想成一道支撑墙，劝自己再忍一忍。", "panels": [{"record": 42, "alt": "久留美用93与94日元支撑墙的想象解释行情，认为不止损就能等到上涨"}, {"record": 43, "alt": "久留美捂住嘴，想起自己的强制平仓点就在94日元附近"}], "after": "可她忽然想起：自己的强平点，也在九十四日元附近。", "arc": "holding-loss-liquidation-risk"},
 {id:'unrealized-fear',chapter:3,title:'不想看见的数字',people:'久留美',pages:[20],positionOwner:'久留美（持仓损益评估；方向未确认）',
  before:'久留美看着账户里的负损益评估，慌了。',
  panels:[{record:45,alt:'久留美惊恐地喊着不要；账户余额与负损益评估分别列出'}],
  after:'她一遍遍喊着：不要。'},
 {"id": "rebound-hunch", "chapter": 4, "title": "这回会反弹吗", "people": "久留美", "pages": [10, 11], "positionOwner": null, "before": "走势在九十四日元附近徘徊，久留美又生出一点期待。", "panels": [{"record": 53, "alt": "蜡烛图标着94日元防卫线，内心独白预感这是真正的反弹"}, {"record": 54, "alt": "久留美看着电脑，试探地问成功了吗"}], "after": "她凑近屏幕，想看看自己的预感是否成真。", "arc": "rebound-add-long-rationalization"},
 {"id": "add-long-hunch", "chapter": 4, "title": "再买一百枚", "people": "久留美", "pages": [13, 14], "positionOwner": null, "before": "久留美冲着屏幕喊出追加一百枚买入。", "panels": [{"record": 55, "alt": "久留美喊着追加100枚买入"}, {"record": 56, "alt": "久留美回头发愣，心里想着要是反转的话"}], "after": "要是真的反转了呢？她还在这样想。", "arc": "rebound-add-long-rationalization"},
 {"id": "conditional-retreat", "chapter": 4, "title": "跌一点也很正常", "people": "久留美", "pages": [15], "positionOwner": null, "before": "行情又往下走。久留美先告诉自己，这只是正常波动。", "panels": [{"record": 57, "alt": "久留美冒汗，强调稍微跌一点很正常，不是奇怪的变动"}, {"record": 58, "alt": "久留美伏在电脑桌前，想着如果猛烈下跌就果断撤退"}], "after": "她给自己定了一个条件：如果这里猛烈跌下去，就撤退。", "arc": "rebound-add-long-rationalization"},
 {id:'blank-mind',chapter:4,title:'什么都没考虑',people:'久留美',pages:[18],positionOwner:null,
  before:'画面里的久留美仿佛漂在宇宙里，双眼发直。',
  panels:[{record:60,alt:'久留美置身宇宙般的幻想画面，文字写着什么都没有考虑'}],
  after:'脑子里一片空白。'},
 {"id": "rationalizing-buy", "chapter": 4, "title": "总能找到理由", "people": "久留美", "pages": [18], "positionOwner": null, "before": "脑子里一片空白，嘴上却还能替刚才的买入找理由。", "panels": [{"record": 61, "alt": "久留美冒汗说追加买入能降低平均买价；旁白指出她把冲动的高风险行为正常化"}], "after": "她说服自己：平均买价降低了，不在这里买才会后悔。", "arc": "rebound-add-long-rationalization"},
 {"id": "shaking-with-fear", "chapter": 4, "title": "已经怕得发抖", "people": "久留美", "pages": [20], "positionOwner": null, "before": "久留美蜷在椅子上，身体不停发抖。", "panels": [{"record": 63, "alt": "久留美坐在椅子上发抖，说这种东西不是人类可以触及的"}], "after": "那些用来安慰自己的理由，此刻已经压不住恐惧。", "arc": "rebound-add-long-rationalization"},
 {id:'overwhelmed',chapter:4,title:'已经不可能了',people:'久留美',pages:[25],positionOwner:null,
  before:'久留美双手抱住头，眼里含着泪。',
  panels:[{record:64,alt:'久留美流着汗和泪，双手抱头，喊着已经不可能了'}],
  after:'她已经承受不住了。'},
 {id:'aud-yen-realized',chapter:5,title:'这回真的赚到了',people:'久留美',pages:[26],positionOwner:'久留美 · AUD/JPY获利确定',
  before:'树荫下，久留美和另一人待在一起。这一回，画面列出了澳元兑日元的获利确定记录。',
  panels:[{record:75,alt:'树荫下的长椅旁有两个人；AUD/JPY记录写着获利确定正1,311,510日元'}],
  after:'属于久留美的这笔交易，利润落定了。'},
 {id:'entrusted',chapter:7,title:'萌智子的托付',people:'久留美、萌智子与芽吹',pages:[10,11,12,15],positionOwner:null,
  before:'萌智子请久留美教芽吹做FX。久留美有些犹豫，觉得自己还教不了别人。',
  panels:[{record:89,alt:'久留美回想读过的FX书籍，讲述自己的知识观'}],
  after:'萌智子又劝了劝。久留美答应，先教自己会的。'},
 {id:'first-lesson',chapter:7,title:'她想直接知道涨跌',people:'久留美与芽吹',pages:[16,20,24,25,26,27],positionOwner:'芽吹（入金；未在本段确认真实订单）',
  before:'芽吹不想工作，把助学贷款拿来入金。她更想知道的，是接下来到底会涨还是会跌。',
  panels:[{record:95,alt:'久留美向芽吹强调，投资决定的后果需要自己承担'}],
  after:'久留美先说清：最后要由芽吹自己决定，也要承担后果。芽吹答应后，两人才开始看英镑兑日元。'},
 {id:'mebuki-negative-estimate',chapter:12,title:'偏偏往上走',people:'芽吹',pages:[25],positionOwner:'芽吹（浮动盈亏；订单方向未在本格展示）',
  before:'美元行情与芽吹的预料相反，反而涨了差不多一日元。她低下头，盯着桌前。',
  panels:[{record:152,alt:'芽吹坐在桌前低着头；浮动盈亏为负92,200日元'}],
  after:'账面上的亏损，让她笑不出来。'},
 {id:'balance-delight',chapter:13,title:'这次赚了好多',people:'久留美',pages:[22],positionOwner:'久留美（阶段账户余额；交易方向未确认）',
  before:'久留美举起双手，比出两个V。起始资金涨了超过七成，她高兴得直笑。',
  panels:[{record:172,alt:'久留美笑着比出双V，账户框标出余额及73.5%的增长'}],
  after:'“这次赚了好多啊！”'},
 {id:'tuition',chapter:13,title:'追加进去的学费',people:'芽吹与萌智子',pages:[29,30,31,32],positionOwner:'芽吹',
  before:'后来，芽吹向萌智子诉苦：之前赚的钱亏光了，追加的次年学费也快保不住。',
  panels:[{record:175,alt:'芽吹背对镜头向萌智子诉说次年学费的困境'},
   {record:178,alt:'萌智子用行情可能一夜反转的话安抚芽吹',before:'萌智子却说，追加学费没有错，家里和学校总能想办法。她说美日迟早会跌，只是不知道要等多久。'}],
  after:'芽吹接受了她的说法，继续听她讲。'},
 {id:'held-short',chapter:15,title:'你早就持有空单了？',people:'康子与芽吹',pages:[2,3,4,5],positionOwner:'芽吹 · USD/JPY空头',
  before:'久留美发来美日做多的消息，芽吹却依然看跌。她告诉正在画画的康子，自己手里早有美日空单。',
  panels:[{record:186,alt:'芽吹站在康子的椅子后，明确说自己手上已有美日空单'},
   {record:185,alt:'康子惊讶地发现芽吹原来已经持有空头仓位'}],
  after:'康子这才发现，芽吹可能从上涨前就一直扛着空单。她劝芽吹止损，芽吹不肯。'},
 {id:'manga-fund-plan',chapter:17,title:'把钱用来画漫画',people:'康子与萌智子',pages:[13],positionOwner:'康子（FX账户余额；创作资金计划）',
  before:'康子举起手机，打算把FX账户里的余额投入漫画。',
  panels:[{record:202,alt:'康子举着手机，展示71,052日元的FX账户余额，说要全部投进漫画'},
   {record:204,alt:'萌智子问康子是否打算不碰FX，康子回答没错',before:'萌智子问：打算不碰FX了？康子说，没错。'}],
  after:'萌智子觉得，真能做到这个决定，确实厉害。她又提起了眼下的大行情。'},
 {id:'help-a-friend',chapter:17,title:'朋友能不能帮一把',people:'康子、萌智子与久留美',pages:[16,17,18,19],positionOwner:'芽吹（朋友讨论其处境，结果未确认）',
  before:'三人在街边谈起芽吹。康子担心，芽吹那笔空单可能已经出事。久留美也放心不下。',
  panels:[{record:206,alt:'康子站在街边向萌智子和久留美说起芽吹，担心她可能已经被强平'},
   {record:207,alt:'萌智子在街边以自负盈亏为由，表示她们帮不了芽吹'}],
  after:'康子不认同：朋友遇到困难，还是该帮忙。久留美也仍担心芽吹。'},
 {id:'caution-after-rise',chapter:19,title:'差不多该小心了',people:'久留美',pages:[21],positionOwner:null,
  before:'久留美托着下巴，盯着屏幕，想着眼下的涨势。',
  panels:[{record:243,alt:'久留美在屏幕前思考，说自己差不多要小心了'}],
  after:'她提醒自己：差不多要小心了。'}
]);
// Evidence of an event, not mere discovery, item availability, age of a run, or debt.
export function characterStoriesAvailable(state={}){
 if(state.mode==='endless')return false;
 return state.story?.seen?.includes('friendStudy')===true || state.story?.log?.some(row=>row?.id==='friendStudy')===true || state.itemsUsed?.mochiko===true || state.consumptionLedger?.some(row=>row?.kind==='item'&&/^item:[1-9]\d*:mochiko$/.test(row.id||''))===true;
}
export function createCharacterStorySession({getState,getContext,canOpen=()=>true,onPage=()=>{},onClose=()=>{},readOnlyPreview=false}){
 let context=null,index=0,active=false;
 const available=()=>readOnlyPreview||characterStoriesAvailable(getState());
 const valid=()=>context===getContext()&&available();
 const paint=()=>onPage({index,node:CHARACTER_STORY_NODES[index],total:CHARACTER_STORY_NODES.length});
 function close(){if(!active)return false;active=false;onClose();return true;}
 return {
  open(){if(active||!canOpen()||!available())return false;const next=getContext();if(next!==context){context=next;index=0;}active=true;paint();return true;},
  move(delta){if(!active)return false;if(!valid()){close();return false;}const next=Math.max(0,Math.min(CHARACTER_STORY_NODES.length-1,index+Math.sign(delta)));if(next===index)return false;index=next;paint();return true;},
  close,
  refresh(){if(active&&!valid())close();if(context!==getContext()){context=null;index=0;}return available();},
  get active(){return active;},get index(){return index;}
 };
}
