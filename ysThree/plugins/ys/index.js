/**
 * @author:跃焱邵隼
 * time:2019-11
 * site:www.wellyyss.cn
 */
// import "./css.css"
import $ from "./modules/jquery"
import {getTimestamp,getTime,getWeek,browser,mouseWheel,stopBubble,stopDefault,rightClick,getUrlParam,getUrlParams,getCurrentFileName,getCurrentJsPath,getHtmlEscape,getReplaceAllStr,getOperatingSystem,
    each,isON,fixPosition,ajax,listToTree,treeToList,ifPercent, getScrollBarWidth,device,getCirclePoints,getDirectionInClient} from "./modules/utils"
import {layer, $layer} from "./modules/layer"
import toolTips from "./modules/toolTips"
import drag from "./modules/drag"
import message from "./modules/message"
import messageBox from "./modules/messageBox"
import dialog from "./modules/dialog"
import advertising from "./modules/advertising"
import numberRun from "./modules/numberRun"
import form from "./modules/form"
import robot from "./modules/robot"
import sideNav from "./modules/sideNav"
import monitor from "./modules/monitor"
import roll from "./modules/roll"
import date from "./modules/date"
import popover from "./modules/popover"
import progress from "./modules/progress"
import dropdown from "./modules/dropdown"
import headerNav from "./modules/headerNav"
import driver from "./modules/driver"
import tab from "./modules/tab"
import collapse from  "./modules/collapse"
import tree from "./modules/tree"
import table from "./modules/table"
import paging from "./modules/pagination"
import swiper from "./modules/swiper"
import step from "./modules/step"
import transfer from "./modules/transfer"
import slide from "./modules/slide"
import rate from "./modules/rate"
import parallax from "./modules/parallax"
import colorPicker from "./modules/colorPicker"
import upload from "./modules/upload"
import scrollBox from "./modules/scrollBox"
import animateBox from "./modules/animateBox"
const ys = {
    $,
    getTimestamp,
    getTime,
    getWeek,
    browser,
    mouseWheel,
    stopBubble,
    stopDefault,
    rightClick,
    getUrlParam,
    getUrlParams,
    getCurrentFileName,
    getCurrentJsPath,
    getHtmlEscape,
    getReplaceAllStr,
    getOperatingSystem,
    ifPercent,
    listToTree,
    treeToList,
    each,
    isON,
    getScrollBarWidth,
    fixPosition,
    ajax,
    device,
    getCirclePoints,
    getDirectionInClient,
    layer,
    $layer,
    toolTips,
    message,
    messageBox,
    dialog,
    advertising,
    popover,
    numberRun,
    form,
    date,
    monitor,
    drag,
    robot,
    sideNav,
    progress,
    roll,
    dropdown,
    headerNav,
    driver,
    tab,
    collapse,
    tree,
    table,
    paging,
    swiper,
    step,
    transfer,
    slide,
    rate,
    parallax,
    colorPicker,
    upload,
    scrollBox,
    animateBox

}
window.ys = ys
window.$ = window.jQuery = $
popover()
toolTips()
export default ys