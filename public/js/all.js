// 透過AJAX取得旅遊資訊資料
// 透過const設定資料來源網址
const sourceUrl = 'https://data.kcg.gov.tw'
const initSourceUrl = '/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97'
// 先設定變數callbackData為空陣列，用以儲存所有旅遊資料
let callbackData = [];
// init帶入參數initSourceUrl執行function(getTravelData)取得資料
getTravelData(initSourceUrl)

// 透過XMLHttpRequest取得旅遊資料，參數為api網址
function getTravelData(nextSourceUrl) {
    // 建立新的XMLHTTPRequest物件取得更新資料
    let kTravelXhr = new XMLHttpRequest();
    // get網址為sourceUrl+API網址，組成完整網址
    // 設定open為false同步，等取得資料後才往下執行，避免所有需要資料的function出錯
    kTravelXhr.open('get', sourceUrl+nextSourceUrl , false);
    // 使用get方法時，send只需傳送null，表示只取得資料
    kTravelXhr.send(null);
    // 設定變數callback為轉object的responseText
    let callback = JSON.parse(kTravelXhr.responseText)
    // 透過.concat方式將資料中records的陣列與先前取得的資料callbackData相加
    callbackData = callbackData.concat(callback.result.records)
    // 執行function(checkMoreData)檢查是否有更多資料，參數帶入本次獲取資料callback
    checkMoreData(callback)
}

// function(checkMoreData)檢查是否有更多資料，參數帶入本次取得的資料
function checkMoreData(callback) {
    // 找出本次獲取資料長度
    let dataLength = callback.result.records.length
    // 找出本次獲取資料最後一筆的id(最後一筆資料位置為總長度-1，因位置起始為0非1)
    let dataLastId = callback.result.records[dataLength-1]._id
    // 找出callback的object資料中total的值(資料來源用以說明總資料數量)
    let dataTotal = callback.result.total
    // 透過if設定條件，當最後一筆的id小於總資料數量值，則表示仍有資料需要取得
    if (dataLastId < dataTotal) {
        // 符合條件時，從資料找到下一筆的連結
        let nextUrl = callback.result._links.next;
        // 將連結傳入取得資料function，再次取得資料，參數為連結後半段
        getTravelData(nextUrl);
        //不符合條件時，代表沒有更多資料，則return回getTravelData，使該function執行完畢
    }else{return}
}

// 使常數kTravelData為本次總取得資料，作為後續所有funciton執行運用
const kTravelData = callbackData;
// // 確認kTravelData資料型別，總旅遊資訊長度
// console.log('TypeOf:kTravelData：', typeof (kTravelData), 'Length:kTravelData', kTravelData.length,'kTravelData',kTravelData);

// 綁定變數chooseZone為使用者透過select選擇區域
let chooseZone = document.querySelector('#chooseZone');
// 綁定變數zoneTitle用於紀錄區域標題值變化
let zoneTitle = ''
// 綁定變數zoneTitleContent為區域標題內容
let zoneTitleContent = document.querySelector('.zone-title');
// 綁定變數travelItems為顯示空間.travel-items
let travelItems = document.querySelector('.travel-items');
// 綁定變數hotZone為使用者選擇的熱門行政區
let hotZone = document.querySelector('.hot-zone');
// 宣告選擇區域資料為空陣列
let zoneData = [];
// 宣告本頁資訊資料為空陣列
let pageData = [];
// 宣告頁面編號，init為1
let pageIndex = 1;
// 宣告頁面起始資料編號，init為空
let pageIndexStart = '';
// 宣告頁面結束資料編號，init為空
let pageIndexEnd = '';
// 宣告變數為pageNav頁面導航區空間
let pageNav = document.querySelector('.pageNav');
let pageNavLi = document.querySelector('.pageNavLi')
// 宣告pageNav起始編號，init為pageIndex
let pageNavStart = pageIndex;
// 宣告pageNav終止編號，init為空值
let pageNavEnd = ''

// init載入頁面資料
zoneTitle = '高雄市全區';
zoneData = kTravelData;
zoneListUpdate();
getPageData();
getPageNavEnd();
updatePageNav();

// 取得當前頁面資料 並存入pageData中
function getPageData(e) {
    // 執行updatePageIndex取得當前頁面資料，起始與結束編號
    updatePageIndex();
    let str = [];
    for (let i = pageIndexStart; i < pageIndexEnd; i++) {
        str.push(zoneData[i]);
    }
    pageData = str;
    updateItems(pageData);
}

// 將pageData資料組字串 並塞入.travel-items中顯示
function updateItems(e) {
    let str = '';
    for (let i = 0; i < pageData.length; i++) {
        str +=
            `<div class="col-6">
                <div class="travel-item">
                    <div class="item-img bg-cover" style="background-image: url('${pageData[i].Picture1}');">
                        <div class="img-cover"></div>
                        <div class="item-name">${pageData[i].Name}</div>
                        <div class="item-zone">${pageData[i].Zone}</div>
                    </div>
                    <div class="item-info">
                        <div class="item-row open-time">
                        <div class="icon"><img src="images/icons_clock.png" alt=""></div>
                        <div class="content">${pageData[i].Opentime}</div>
                    </div>
                    <div class="item-row item-add">
                        <div class="icon"><img src="images/icons_pin.png" alt=""></div>
                        <div class="content">${pageData[i].Add}</div>
                    </div>
                    <div class="row no-gutters">
                        <div class="col-9 item-tel d-inline-flex">
                            <div class="icon"><img src="images/icons_phone.png" alt=""></div>
                            <div class="content">${pageData[i].Tel}</div>
                        </div>
                        <div class="col-3 item-ticketinfo d-inline-flex">
                            <div class="icon"><img src="images/icons_tag.png" alt=""></div>
                            <div class="content">${pageData[i].Ticketinfo}</div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            `
    }
    // 插入顯示內容
    travelItems.innerHTML = str;
    // 插入顯示標題
    zoneTitleContent.innerHTML = zoneTitle;
}

// 取得使用者透過select選擇的區域，與該區域資料，存入zoneData
function chooseUpdate(e) {
    // 設定區域變數select為使用者選項的值
    let select = e.target.value;
    let str = [];
    // 選擇空值時則為高雄市全區資料
    if (select == '') {
        zoneData = kTravelData;
        zoneTitle = '高雄市全區';
    } else {
        for (var i = 0; i < kTravelData.length; i++) {
            // 選擇非空值，篩選出該區所有資料
            if (select == kTravelData[i].Zone) {
                str.push(kTravelData[i]);
            }
            // 將資料存入zoneData
            zoneData = str;
        }
        // 設定區域標題值
        zoneTitle = select;
    }
    // 更換選取時重設pageIndex
    pageIndex = 1;
    // 更換選取時重設pageNavStart
    pageNavStart = pageIndex;
    // 執行function取得當前頁面資料
    getPageData();
    // 更換選取時重新抓取pageNavEnd
    getPageNavEnd();
    // 更新pageNav頁面導航區畫面
    updatePageNav();
}
// 監聽select取得使用者選擇區域
chooseZone.addEventListener('change', chooseUpdate, false);

// 取得使用者透過hotZone按鈕選擇的區域，與該區域資料，存入zoneData
function hotZoneUpdate(e) {
    // 從父元素監聽，只執行點擊按鈕之事件
    if (e.target.nodeName !== "BUTTON") { return }
    let str = [];
    // 取得選擇區域之所有資料
    for (i = 0; i < kTravelData.length; i++) {
        if (e.target.dataset.zone == kTravelData[i].Zone) {
            str.push(kTravelData[i]);
        }
    }
    // 將資料存入zoneData
    zoneData = str;
    zoneTitle = e.target.dataset.zone;
    // 更換選取時重設pageIndex
    pageIndex = 1;
    // 更換選取時重設pageNavStart
    pageNavStart = pageIndex;
    // 執行function取得當前頁面資料
    getPageData();
    // 更換選取時重新抓取pageNavEnd
    getPageNavEnd();
    // 更新pageNav頁面導航區畫面
    updatePageNav();
}

// 監聽hotZone buttone取得使用者選擇區域
hotZone.addEventListener('click', hotZoneUpdate, false);

// 計算當前頁面起始與終止資料位置
function updatePageIndex(e) {
    // 將頁面編號帶入，計算得出頁面起始資料位置pageIndexStart
    pageIndexStart = (pageIndex - 1) * 10
    // 透過總資料扣除前一頁資料數量，計算剩餘資料長度
    let pageDatalength = zoneData.length - pageIndexStart;
    // 剩餘資料長度>10，則結束資料編號為起始資料後第10個資料
    if (pageDatalength > 10) {
        pageIndexEnd = pageIndexStart + 10;
    } else {
        //剩餘資料<=10，則結束資料編號即為總資料長度
        pageIndexEnd = zoneData.length;
    }
}


// 計算當前pageNav起始終止編號
function getPageNavEnd(e) {
    // 取得資料總頁面數量
    let pageNavNum = Math.ceil(zoneData.length / 10);
    // 取得pageNavEnd
    if (pageNavNum - pageNavStart > 5) {
        pageNavEnd = pageNavStart + 5
    } else {
        pageNavEnd = pageNavNum + 1
    }
    // 取得pageNavStart&End後，更新pageNav頁面導航區
    updatePageNav();
}

// 判定是否符合prev與next觸發條件，(更新pageNavStart、並重新取得End編號(同時會執行updatePageNav，更新頁面導航區))
function checkChangePageNav(e) {
    switch (e) {
        // 點擊為prev時，判斷當前pageNavStart是否>=6(排除第一頁PageNav)，是則執行
        case "prev":
            if (pageNavStart >= 6) {
                // 重設pageNavStart為當前開始編號-5(每組5頁)
                pageNavStart = pageNavStart - 5
                // 重設pageIndex用以重新載入往前五頁的第一頁資料
                pageIndex = pageNavStart
            } else { return }
            break;
        //點擊為next時，判斷資料總頁數扣除目前pageNavStart是否仍有後續頁數，有則執行
        case "next":
            // 計算總資料頁面數
            var pageNavNum = Math.ceil(zoneData.length / 10);
            // 判斷是否有後面頁數((總頁數-當前結束頁編號)>0代表後面還有資料)
            if ((pageNavNum - pageNavEnd) > 0) {
                // 重設pageNavStart為當前結束編號
                // (結束編號在getPageNavEnd迴圈中為顯示內容+1，是再往後頁面資料的開頭編號)
                pageNavStart = pageNavEnd
                // 重設pageIndex用以重新載入往後五頁的第一頁資料
                pageIndex = pageNavStart
            } else { return }
            break;
    }
    //再取得一次pageNav終止編號
    getPageNavEnd();
}

// 更新頁面導航區(組字串，並判斷處理樣式)
function updatePageNav(e) {
    let str = ''
    // 組導航內頁籤元件字串
    for (let i = pageNavStart; i < pageNavEnd; i++) {
        str += `<li><a href="#" data-navindex="${i}">${i}</a></li>`
    }
    // 插入頁面
    pageNavLi.innerHTML = str;
    // 更新導航區同時，判斷元素navindex與當前頁面index(pageIndex)相同，設為active
    // 因更新同時會移除active，故不需要移除
    for (let i = 0; i < document.querySelectorAll('.pageNavLi li a').length; i++) {
        let liA = document.querySelectorAll('.pageNavLi li a');
        if (liA[i].dataset.navindex == pageIndex) {
            liA[i].classList.add('active');
        }
    }
    // 更新導航區同時，判斷是否有前5頁，否則設定prev為disable，是則移除disable
    if (pageNavStart == 1) {
        document.querySelector('#pageNavPrev').classList.add('disable')
    } else {
        document.querySelector('#pageNavPrev').classList.remove('disable')
    }
    // 更新導航區同時，判斷是否有後面頁數，否則設定next為disable，是則移除disable
    let pageNavNum = Math.ceil(zoneData.length / 10);
    if ((pageNavNum - pageNavEnd) < 0) {
        document.querySelector('#pageNavNext').classList.add('disable')
    } else {
        document.querySelector('#pageNavNext').classList.remove('disable')
    }
}


// 取得使用者點擊pageNav項目，並更新頁面
function navUpdatePage(e) {
    // 取消預設連結事件
    e.preventDefault();
    // 若點擊非連結則不觸發
    if (e.target.nodeName !== "A") { return };
    // 點擊到前後頁時，執行頁面導航區完整更新
    if (e.target.dataset.nav == "prev" || e.target.dataset.nav == "next") {
        checkChangePageNav(e.target.dataset.nav);
    } else {
        // 如果點擊非前後頁按鈕時，設定pageIndex為數字格式的dataset.navindex
        pageIndex = parseInt(e.target.dataset.navindex);
    }
    // 利用新的pageIndex取得當前頁面資料
    getPageData();
    // 更新畫面
    updateItems();
    // 更新頁面導航區
    updatePageNav();
}

// 監聽頁面導航區，點擊時進行頁面重新更換
pageNav.addEventListener('click', navUpdatePage, false);

// 建立下拉式選單內容function(zoneListUpdate)，從資料中抽出不重複區域資料，並填入select的option中
function zoneListUpdate() {
    // 建立空陣列zonelist取出所有Zone值
    let zoneList = [];
    for (let i = 0; i < kTravelData.length; i++) {
        zoneList.push(kTravelData[i].Zone)
    }
    // 建立空陣列zone取出不重複的Zone值
    let zone = [];
    // 針對資料執行forEach，會只帶入該資料執行
    // 建立function帶入資料的value執行後續檢查
    zoneList.forEach(function (value) {
        // 用indexOf檢查，如果有相同資料時會回傳資料位置，沒有時則回傳-1
        // (取zoneList的value向zone的內容比對，沒有相同時回傳-1，代表沒有重複，則加入到zone的資料)
        if (zone.indexOf(value) == -1) {
            zone.push(value);
        }
    })
    // 組字串並填入chooseZone的select中
    let str = ''
    for (let i = 0; i < zone.length; i++) {
        str += `
        <option value="${zone[i]}">${zone[i]}</option>
        `
    }
    let zoneOption = str;
    chooseZone.innerHTML = `<option value="">- - 請選擇行政區- -</option>${zoneOption}`
}

// 利用jQuery製作點擊回到最上方功能，animate需載入完整版才做動
// 並透過 https://www.srihash.org/ 取得jq完整版cdn連結的integrity相關資訊
jQuery(document).ready(function ($) {
    $('.list-zone .btnGoTop').click(function (event) {
        event.preventDefault();
        $('html,body').animate({
            scrollTop: 0
        }, 1000)
    })
})
