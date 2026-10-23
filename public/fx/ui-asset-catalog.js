import {UI_ICON_ASSET} from './ui-icon-assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {UI_EXTRA_ICON_ASSET} from './ui-extra-icon-assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// UI assets keep their own identities, separate from story/trading-event pools.
export const UI_ASSET_CATALOG=Object.freeze([Object.freeze({
 id:'pixel-interface-reference-atlas',path:'./pixel-assets/reference-atlas.png',
 purpose:'decorative-interface-sprites',kind:'approved-interface-reference',
 source:Object.freeze({sha256:'9fae0e93456bf34303cc3145a0fa5f449ade44424013ac485b2a75aca27d0b9c',dimensions:Object.freeze([1536,1024]),sourceCommit:'72f5d178e7cd4d1181e9199a24aedc0dd4af0928',metadataRefs:Object.freeze(['UI_ASSET_CATALOG:pixel-interface-reference-atlas'])}),
 consumer:Object.freeze({stylesheet:'./pixel-renderer.css',presentation:'small-css-sprite-windows',financialData:false}),
 review:Object.freeze({status:'pending',scope:'current-rendered-interface',reason:'Current-build browser visual acceptance remains required'})
}),
Object.freeze({"id":"life-menu-approved","path":"./pixel-assets/life-menu-approved.png","purpose":"decorative-interface-sprites","kind":"approved-interface-reference","source":{"sha256":"890b0d04378109dee693b08f1484af371dcef3029beb5b1e526c0b793cefe2bd","dimensions":[1536,1024],"metadataRefs":["UI_ASSET_CATALOG:life-menu-approved"]},"consumer":{"stylesheet":"./life-action-picker.css","presentation":"small-css-sprite-windows","financialData":false},"review":{"status":"pending","scope":"current-rendered-interface","reason":"Approved design; current-build browser visual acceptance remains required"}}),
Object.freeze({"id":"life-friends-approved","path":"./pixel-assets/life-friends-approved.png","purpose":"decorative-interface-sprites","kind":"approved-interface-reference","source":{"sha256":"b4472745c708dbb384548447c1c3b1bf7774db993cd3d1b38de08491d3d0228f","dimensions":[1536,1024],"metadataRefs":["UI_ASSET_CATALOG:life-friends-approved"]},"consumer":{"stylesheet":"./life-action-picker.css","presentation":"small-css-sprite-windows","financialData":false},"review":{"status":"pending","scope":"current-rendered-interface","reason":"Approved design; current-build browser visual acceptance remains required"}}),
Object.freeze({"id":"life-work-approved","path":"./pixel-assets/life-work-approved.png","purpose":"decorative-interface-sprites","kind":"approved-interface-reference","source":{"sha256":"530c248a9610005fb0f1fc3e25557b1d2e4965b4941eeca5acd88ba8d277273c","dimensions":[1536,1024],"metadataRefs":["UI_ASSET_CATALOG:life-work-approved"]},"consumer":{"stylesheet":"./life-action-picker.css","presentation":"small-css-sprite-windows","financialData":false},"review":{"status":"pending","scope":"current-rendered-interface","reason":"Approved design; current-build browser visual acceptance remains required"}}),
Object.freeze({"id":"life-relax-approved","path":"./pixel-assets/life-relax-approved.png","purpose":"decorative-interface-sprites","kind":"approved-interface-reference","source":{"sha256":"7dd0793836bf091e3f8401057d0eb9cfdef1cecc9d19c7945676484b12dda616","dimensions":[1536,1024],"metadataRefs":["UI_ASSET_CATALOG:life-relax-approved"]},"consumer":{"stylesheet":"./life-action-picker.css","presentation":"small-css-sprite-windows","financialData":false},"review":{"status":"pending","scope":"current-rendered-interface","reason":"Approved design; current-build browser visual acceptance remains required"}}),
Object.freeze({"id":"mobile-life-approved","path":"./pixel-assets/mobile-life-approved.png","purpose":"decorative-interface-sprites","kind":"approved-interface-reference","source":{"sha256":"85571e4385fbfd1d9bcbba8ba1cc773e465788276561742f3d3cb570771c07dc","dimensions":[854,1842],"metadataRefs":["UI_ASSET_CATALOG:mobile-life-approved"]},"consumer":{"stylesheet":"./life-action-picker.css","presentation":"small-css-sprite-windows","financialData":false},"review":{"status":"pending","scope":"current-rendered-interface","reason":"Approved mobile life design; current-build browser visual acceptance remains required"}}),
Object.freeze({
 id:'report-pixel-approved',path:'./pixel-assets/report-pixel-approved.png',
 purpose:'decorative-interface-sprites',kind:'approved-interface-reference',
 source:Object.freeze({sha256:'5e18682bd037ada7d4e2ad0e9232132c24937e7e476f22e9f1f20a7d883bac7f',dimensions:Object.freeze([852,1846]),metadataRefs:Object.freeze(['UI_ASSET_CATALOG:report-pixel-approved'])}),
 consumer:Object.freeze({module:'./share-card-pixel.js',presentation:'bounded-report-sprite-windows',financialData:false}),
 review:Object.freeze({status:'pending',scope:'current-rendered-interface',reason:'Approved pixel report design; current-build browser visual acceptance remains required'})
}),Object.freeze({
 id:'kurumi-default-user',path:'./expressions/kurumi-default-user.jpg',
 purpose:'user-selected-default-avatar',kind:'user-provided-image',
 source:Object.freeze({sha256:'3e2b88940445ca012fa4b72e6d39333cecda49b74a81b778844fe94a0442b23a',dimensions:Object.freeze([937,500]),sourceCommit:'98878f578e0b1c745851330569094c69a5441258',gitBlob:'1140416f540495da391e6306a0747a22d140ca80',metadataRefs:Object.freeze(['UI_ASSET_CATALOG:kurumi-default-user'])}),
 consumer:Object.freeze({module:'./final-portrait.js',displayModule:'./portrait-display.js',stylesheet:'./pixel-renderer.css',presentation:'whole-image-contain',preserveWholeImage:true,financialData:false}),
 review:Object.freeze({status:'pending',scope:'current-rendered-interface',reason:'Exact user image viewed and bytes verified; current-build browser visual acceptance remains required'})
}),Object.freeze({
 id:'ui-icons-transparent',path:UI_ICON_ASSET.path,purpose:'decorative-interface-sprites',kind:'generated-interface-derivative',
 source:Object.freeze({sha256:UI_ICON_ASSET.sha256,dimensions:Object.freeze([UI_ICON_ASSET.width,UI_ICON_ASSET.height]),metadataRefs:Object.freeze(['UI_ICON_ASSET','UI_ASSET_CATALOG:pixel-interface-reference-atlas','UI_ASSET_CATALOG:life-menu-approved','UI_ASSET_CATALOG:life-work-approved','UI_ASSET_CATALOG:life-relax-approved'])}),
 consumer:Object.freeze({stylesheet:'./ui-icons.css',presentation:'isolated-alpha-sprite-windows',financialData:false}),
 review:Object.freeze({status:'pending',scope:'current-rendered-interface',reason:'All twelve icon objects visually reviewed; current-build browser acceptance remains required'})
}),Object.freeze({
 id:'ui-icons-extra-transparent',path:UI_EXTRA_ICON_ASSET.path,purpose:'decorative-interface-sprites',kind:'generated-interface-derivative',
 source:Object.freeze({sha256:UI_EXTRA_ICON_ASSET.sha256,dimensions:Object.freeze([UI_EXTRA_ICON_ASSET.width,UI_EXTRA_ICON_ASSET.height]),metadataRefs:Object.freeze(['UI_EXTRA_ICON_ASSET','UI_ASSET_CATALOG:pixel-interface-reference-atlas'])}),
 consumer:Object.freeze({stylesheet:'./ui-icons.css',presentation:'isolated-alpha-pseudo-element-windows',financialData:false}),
 review:Object.freeze({status:'pending',scope:'current-rendered-interface',reason:'Trophy, medal and headphones visually reviewed; current-build browser acceptance remains required'})
})]);
