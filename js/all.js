$(document).ready(function() {
    $(".slidetop a").click(function(event) {
		/* Act on the event */
		event.preventDefault();
		$("html,body").animate({scrollTop: 0}, 500);
	});
});

const xhr = new XMLHttpRequest();
xhr.open("get","https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json",true);
xhr.send(null);
xhr.onload = function(){
    const data = JSON.parse(xhr.responseText);
    const records = data.result.records;
    //找出全部區域
    let zoneList = [];
    for(let i=0; i<records.length; i++){
        zoneList.push(records[i].Zone);
    }
    //過濾重複區域
    let zone = [];
    zoneList.forEach(function(value) {
        if (zone.indexOf(value) == -1) {
        zone.push(value);
        }
    });
    console.log(zone);
    let str = "";
    for(i=0; i<zone.length; i++){
        str += `<option>${zone[i]}</option>`;
    }
    const location = document.querySelector(".location");
    location.innerHTML += str;

    //匯入全部內容
    let listLi = "";
    let dataIndex = 1;
    for(let i=0; i<records.length; i++){
        listLi += `
        <li data-index="${[dataIndex]}">
            <div class="img-wrap" style="background-image: url(${records[i].Picture1})">
                <h3>${records[i].Picdescribe1}</h3>
                <h4>${records[i].Zone}</h4>
            </div>
            <p><img src="img/icons_clock.png" class="clock">${records[i].Opentime}</p>
            <p><img src="img/icons_pin.png" class="pin">${records[i].Add}</p>
            <p class="phone-wrap"><img src="img/icons_phone.png" class="phone">${records[i].Tel}</p> 
            <p class="tag-wrap"><img src="img/icons_tag.png">${records[i].Ticketinfo}</p>
        </li>`;
        dataIndex += 1;
        const list = document.querySelector(".list");
        list.innerHTML = listLi;
        document.querySelector(".content h2").innerHTML = "全部地區";
    }
    //更新分頁
    updatePage();

    //下拉選單變更內容
    location.addEventListener("change", function(e){
        console.log(e.target.value);
        let listLi = "";
        let dataIndex = 1;
        for(let i=0; i<records.length; i++){
            if(e.target.value == records[i].Zone){
                listLi += `
                <li data-index="${[dataIndex]}">
                    <div class="img-wrap" style="background-image: url(${records[i].Picture1})">
                        <h3>${records[i].Picdescribe1}</h3>
                        <h4>${records[i].Zone}</h4>
                    </div>
                    <p><img src="img/icons_clock.png" class="clock">${records[i].Opentime}</p>
                    <p><img src="img/icons_pin.png" class="pin">${records[i].Add}</p>
                    <p class="phone-wrap"><img src="img/icons_phone.png" class="phone">${records[i].Tel}</p> 
                    <p class="tag-wrap"><img src="img/icons_tag.png">${records[i].Ticketinfo}</p>
                </li>`;
                dataIndex += 1;
                const list = document.querySelector(".list");
                list.innerHTML = listLi;
                document.querySelector(".content h2").innerHTML = records[i].Zone;
            }else if(e.target.value == "全部地區"){
                listLi += `
                <li data-index="${[dataIndex]}">
                    <div class="img-wrap" style="background-image: url(${records[i].Picture1})">
                        <h3>${records[i].Picdescribe1}</h3>
                        <h4>${records[i].Zone}</h4>
                    </div>
                    <p><img src="img/icons_clock.png" class="clock">${records[i].Opentime}</p>
                    <p><img src="img/icons_pin.png" class="pin">${records[i].Add}</p>
                    <p class="phone-wrap"><img src="img/icons_phone.png" class="phone">${records[i].Tel}</p> 
                    <p class="tag-wrap"><img src="img/icons_tag.png">${records[i].Ticketinfo}</p>
                </li>`;
                dataIndex += 1;
                const list = document.querySelector(".list");
                list.innerHTML = listLi;
                document.querySelector(".content h2").innerHTML = "全部地區";
            }
        }
        //更新分頁
        updatePage();
    });

    //地區按鈕變更內容
    const districtBtn = document.querySelector(".districtBtn");
    districtBtn.addEventListener("click",function(e){
        e.preventDefault();
        let listLi = "";
        let dataIndex = 1;
        for(let i=0; i<records.length; i++){
            if(e.target.value == records[i].Zone){
                listLi += `
                <li data-index="${[dataIndex]}">
                    <div class="img-wrap" style="background-image: url(${records[i].Picture1})">
                        <h3>${records[i].Picdescribe1}</h3>
                        <h4>${records[i].Zone}</h4>
                    </div>
                    <p><img src="img/icons_clock.png" class="clock">${records[i].Opentime}</p>
                    <p><img src="img/icons_pin.png" class="pin">${records[i].Add}</p>
                    <p class="phone-wrap"><img src="img/icons_phone.png" class="phone">${records[i].Tel}</p> 
                    <p class="tag-wrap"><img src="img/icons_tag.png">${records[i].Ticketinfo}</p>
                </li>`;
                dataIndex += 1;
                const list = document.querySelector(".list");
                list.innerHTML = listLi;
                document.querySelector(".content h2").innerHTML = records[i].Zone;
            }
        }
        //更新分頁
        updatePage();
        //按下按鈕同步下拉選單
        const optionList = [...document.querySelectorAll("option")];
        //清空所有selected後再加上符合條件地區的selected
        optionList.forEach(dom => dom.removeAttribute("selected"));
        optionList.find(dom => e.target.value === dom.value).setAttribute("selected","");
        //觸發事件
        document.querySelector('.location').dispatchEvent(new Event('change'));
    });

    //渲染分頁標籤
    function renderPageList(dataLength){
        const fragment = document.createDocumentFragment();
        const prev = document.createElement("span");
        prev.classList.add("prev");
        prev.classList.add("disabled");
        prev.setAttribute("data-type","prev");
        prev.appendChild(document.createTextNode("<prev"));
        fragment.appendChild(prev);
        let pageNum = Math.ceil(dataLength / 10);
        for(let i=1; i<=pageNum; i++){
            const page = document.createElement("span");
            page.classList.add("page");
            if(i === 1){
                page.classList.add("current");
            };
            page.setAttribute("data-type",`${i}`);
            page.appendChild(document.createTextNode(`${i}`));
            fragment.appendChild(page);
        }
        const next = document.createElement("span");
        next.classList.add("next");
        next.setAttribute("data-type","next");
        next.appendChild(document.createTextNode("next>"));
        fragment.appendChild(next);
        document.querySelector(".page-list").appendChild(fragment);
    }
  
    //切換頁面
    function switchPage(container,type){
        //取得當前頁碼DOM與當前頁碼數字
        const currentPageDom = container.querySelector(".current");
        const currentPageNumber = Number(currentPageDom.getAttribute("data-type"));
        //移除當前頁碼DOM中current這個class
        currentPageDom.classList.remove("current");

        //使用的querySelector包裝
        const selectDom = selector => container.querySelector(`[data-type="${selector}"]`);
        let newPageDom = null;
        if(type === "prev"){
            newPageDom = selectDom(currentPageNumber - 1);
        }else if(type === "next"){
            newPageDom = selectDom(currentPageNumber + 1);
        }else{
            newPageDom = selectDom(type);
        }
        newPageDom.classList.add("current");
        
        //判斷第一頁或最後一頁給上下一頁加上disabled
        const pageList = container.querySelectorAll(".page");
        //移除上一頁或下一頁的disabled
        const disabled = container.querySelector(".disabled");
        if(disabled){
            disabled.classList.remove("disabled");
        }
        
        //判斷是否第一頁或最後頁再加上class
        if(newPageDom === pageList[0]){
            container.querySelector(".prev").classList.add("disabled");
        }else if(newPageDom === pageList[pageList.length - 1]){
            container.querySelector(".next").classList.add("disabled");
        }

        //切換單頁清單渲染(使用display:none)
        const newPageNum = Number(newPageDom.getAttribute("data-type"));
        const pageMin = (newPageNum - 1) * 10 + 1;
        const pageMax = newPageNum * 10;
        
        //先將所有清單隱藏
        document.querySelectorAll(".list li").forEach(item => item.style.display = "none");
        //渲染出符合頁碼的清單
        for(let i=pageMin; i<=pageMax; i++){
            const dom = document.querySelector(`li[data-index="${i}"]`);
            if(!dom) break;
            dom.style.display = "inline-block";
        }
    }

    //切換頁面點擊事件
    document.querySelector('.page-list').addEventListener('click',function(e){
        if(e.target.nodeName !== 'SPAN') return;
        const type = e.target.getAttribute('data-type');
        switchPage(this,type);
        $("html,body").animate({scrollTop: 500}, 500);
    });

    //更新頁碼
    function updatePage(){
        //顯示隱藏分頁標籤
        let listNum = document.querySelector(".list").getElementsByTagName("li").length;
            document.querySelector('.page-list').innerHTML = '';
            if(listNum > 10){
                renderPageList(listNum);
        }
        //隱藏所有清單
        document.querySelectorAll('.list li').forEach(item => item.style.display = 'none');
        //渲染出符合頁碼的清單
        for(let i=1; i<=10; i++){
            const dom = document.querySelector(`li[data-index='${i}']`);
            if(!dom) break;
            dom.style.display = 'inline-block';
        }
    }
}
