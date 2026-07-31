/*
====================================
Escape Castle
Version : V2.0.2
====================================
*/

const homePage = document.getElementById("homePage");
const teamPage = document.getElementById("teamPage");
const startBtn = document.getElementById("startBtn");

const teamButtons = document.querySelectorAll(".teamButton");

const gamePage = document.getElementById("gamePage");
const teamTitle = document.getElementById("teamTitle");
const stageTitle = document.getElementById("stageTitle");
const stagePhoto = document.getElementById("stagePhoto");
const debugNextBtn = document.getElementById("debugNextBtn");

const loadingScreen = document.getElementById("loadingScreen");
const loadingText =
document.getElementById("loadingText");

const totemModal =
document.getElementById("totemModal");

const totemImage =
document.getElementById("totemImage");

const totemName =
document.getElementById("totemName");

const totemDescription =
document.getElementById("totemDescription");

const totemSlots = document.querySelectorAll(".totem");

let currentTeam = 0;

const savedTeam = localStorage.getItem("team");

if(savedTeam){

    currentTeam = savedTeam;

}

// 記錄目前關卡
let currentStage = 1;

/*==========================
讀取網址關卡參數
==========================*/

const params = new URLSearchParams(window.location.search);

const stageParam = parseInt(params.get("s"));

const totems = [

    {
        id: "black-faced-spoonbill",
        name: "黑面琵鷺",
        description: "寒冬，靜謐的巡守者。",
        image: "assets/images/totems/black-faced-spoonbill.png"
    },

    {
        id: "mangrove",
        name: "紅樹林",
        description: "深深扎根，孕育萬物。",
        image: "assets/images/totems/mangrove.png"
    },

    {
        id: "mudskipper",
        name: "彈塗魚",
        description: "勇敢跨越水與陸的界線。",
        image: "assets/images/totems/mudskipper.png"
    },

    {
        id: "wetland",
        name: "七股濕地",
        description: "所有生命共同的歸宿。",
        image: "assets/images/totems/wetland.png"
    },

    {
        id: "fiddler-crab",
        name: "招潮蟹",
        description: "高舉巨螯，守護家園。",
        image: "assets/images/totems/fiddler-crab.png"
    },

    {
        id: "salt-field",
        name: "七股鹽田",
        description: "日光淬鍊，沉澱歲月。",
        image: "assets/images/totems/salt-field.png"
    },

    {
        id: "oyster",
        name: "牡蠣",
        description: "沉默堅韌，孕育珍寶。",
        image: "assets/images/totems/oyster.png"
    }

];

const unlockedTotems = [];

// 更新遊戲資訊
function updateGameInfo() {

    // 更新隊伍資訊
    teamTitle.textContent = `第 ${currentTeam} 組`;

    // 更新關卡資訊
stageTitle.textContent = `第 ${currentStage} / 8 關`;

// 更新關卡照片
if (currentStage < 8) {

    stagePhoto.src = `assets/images/group${currentTeam}/${String(currentStage).padStart(2, "0")}.jpg`;

} else {

    stagePhoto.src = "assets/images/stage/exit.jpg";

}

}

// 更新遊戲畫面
function updateGameScreen() {

    updateGameInfo();

}

/*====================================
開始遊戲
====================================*/

function startGame(team, stage){

    currentTeam = team;

    currentStage = stage;

    localStorage.setItem("team", team);

    // 先切換畫面
    homePage.classList.add("hidden");
    teamPage.classList.add("hidden");
    gamePage.classList.remove("hidden");

    // 最後更新畫面
    updateGameScreen();

}

// 前往下一關
function nextStage() {

    currentStage++;

    updateGameScreen();

}

// 顯示圖騰視窗
function showModal() {

    totemModal.classList.remove("hidden");

    requestAnimationFrame(() => {

        totemModal.classList.add("show");

    });

}

// 隱藏圖騰視窗
function hideModal() {

    totemModal.classList.remove("show");

    setTimeout(() => {

        totemModal.classList.add("hidden");

    },300);

}

// 顯示圖騰
async function showTotem() {

    if (currentStage > 7) {
        return;
    }

    const currentTotem = totems[currentStage - 1];

    totemName.textContent =
    currentTotem.name;

    totemDescription.textContent =
    currentTotem.description;

    unlockedTotems.push(currentTotem.id);

    updateTotemCollection();

    totemImage.src = currentTotem.image;

    showModal();

    await new Promise(resolve => {

    setTimeout(resolve, 3000);

});

hideModal();

}

function updateTotemCollection() {

    for (const unlockedTotem of unlockedTotems) {

        const index = totems.findIndex(totem => {

            return totem.id === unlockedTotem;

        });

        totemSlots[index].classList.add("awake");

    }

}

// 完成目前關卡
async function completeStage() {

    if (currentStage < 8) {

        await showTotem();

        nextStage();

    } else {

        await playEnding();

    }

}

function showEnding(imageFile){

    const endingScene =
    document.getElementById("endingScene");

    const endingImage =
    document.getElementById("endingImage");

    // 先讓圖片透明
    endingImage.classList.remove("show");

    // 換圖
    endingImage.src =
    "assets/images/ending/" + imageFile;

    // 顯示黑幕
    endingScene.classList.add("show");

    // 等圖片載入完成，再淡入
    endingImage.onload = () => {

        requestAnimationFrame(() => {

            endingImage.classList.add("show");

        });

    };

}

async function playEnding(){

    const endingText =
    document.getElementById("endingText");

    const flash =
    document.getElementById("flash");

    const guardianGlow =
    document.getElementById("guardianGlow");

    const endingImage =
    document.getElementById("endingImage");

    endingText.style.opacity = 0;

    flash.style.opacity = 0;

    endingImage.classList.remove("shake");

    /* 第一張 */

    showEnding("ending-01-sealed-gate.png");

    /* 第一張停留 */

    await new Promise(resolve => setTimeout(resolve,2000));

    // 第二張

    showEnding("ending-02-seals-awaken.png");

    requestAnimationFrame(()=>{

        guardianGlow.classList.add("guardian-awaken");

    });

    await new Promise(resolve => setTimeout(resolve,2000));

    guardianGlow.classList.remove("guardian-awaken");

    // 第三張
    showEnding("ending-03-final-seal-breaks.png");

    /* 安靜一秒 */

    await new Promise(resolve=>setTimeout(resolve,1000));

    /* 開始震 */

    endingImage.classList.add("shake");

    /* 再震兩秒 */

    await new Promise(resolve=>setTimeout(resolve,2000));

    /* 白光爆發 */

    endingImage.classList.remove("shake");
    flash.style.opacity = 1;

    await new Promise(resolve => setTimeout(resolve,180));

    /* 門打開 */

    showEnding("ending-04-beyond-the-castle.png");

    /* 白光消失 */

    flash.style.opacity = 0;

    /* 讓玩家欣賞畫面 */

    await new Promise(resolve => setTimeout(resolve,2000));

    /* Ending 文字 */

    endingText.style.opacity = 1;

}

// Debug 下一關
debugNextBtn.addEventListener("click", () => {

    completeStage();

});

// 開始冒險
startBtn.addEventListener("click", () => {

    homePage.classList.add("hidden");
    teamPage.classList.remove("hidden");

});

// 選擇隊伍
teamButtons.forEach(button => {

    button.addEventListener("click", () => {

        showLoading();

        preloadImages(button.dataset.team).then(()=>{

            hideLoading();

            startGame(button.dataset.team,1);

        });

        console.log("目前隊伍：", button.dataset.team);

    });

});

/*====================================
裝置方向偵測
====================================*/

function checkOrientation(){
    console.log(navigator.userAgent);
    console.log(window.innerWidth, window.innerHeight);

    const warning = document.getElementById("rotateWarning");

    const isDesktop =
        !/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);

    if(isDesktop){

        warning.style.display = "none";
        return;

    }

    // 後面保持不變……

    // 手機（不是平板）
    if(Math.min(window.innerWidth, window.innerHeight) < 700){

        warning.style.display = "flex";

        document.querySelector(".rotate-content h2").textContent =
            "請使用平板進行遊戲";

        document.querySelector(".rotate-content p").textContent =
            "Escape Castle 為營隊平板專用遊戲";

        return;

    }

    // 平板直向
    if(window.innerHeight > window.innerWidth){

        warning.style.display = "flex";

        document.querySelector(".rotate-content h2").textContent =
            "請將平板旋轉為橫向";

        document.querySelector(".rotate-content p").textContent =
            "旋轉後即可開始冒險";

    }else{

        // 平板橫向
        warning.style.display = "none";

    }

}

function loadStageFromUrl(){

    const params = new URLSearchParams(window.location.search);

    const stage = parseInt(params.get("s"));

    // 沒有 s，代表第一次進網站
    if(isNaN(stage)){
        return;
    }

    // 從 localStorage 取得隊伍
    const savedTeam = localStorage.getItem("team");

    // 沒有隊伍，代表不是正常遊戲流程
    if(!savedTeam){
        return;
    }

    // 直接開始指定關卡
    startGame(savedTeam, stage);

}

checkOrientation();

console.log("準備讀網址");

loadStageFromUrl();

console.log("網址讀取完成");

function showLoading(){

    loadingScreen.style.display = "flex";

}

function hideLoading(){

    loadingScreen.style.display = "none";

}

function preloadImages(team){

    return new Promise((resolve)=>{

        const imageList = [];

        // 本組第1~7關
        for(let i=1;i<=7;i++){

            imageList.push(
                `assets/images/group${team}/${String(i).padStart(2,"0")}.jpg`
            );

        }

        // 共用第8關
        imageList.push(
            "assets/images/stage/exit.jpg"
        );

        // Ending Artwork
        imageList.push("assets/images/ending/ending-01-sealed-gate.png");
        imageList.push("assets/images/ending/ending-02-seals-awaken.png");
        imageList.push("assets/images/ending/ending-03-final-seal-breaks.png");
        imageList.push("assets/images/ending/ending-04-beyond-the-castle.png");

        // 七個圖騰
        imageList.push("assets/images/totems/black-faced-spoonbill.png");
        imageList.push("assets/images/totems/fiddler-crab.png");
        imageList.push("assets/images/totems/mangrove.png");
        imageList.push("assets/images/totems/mudskipper.png");
        imageList.push("assets/images/totems/oyster.png");
        imageList.push("assets/images/totems/salt-field.png");
        imageList.push("assets/images/totems/wetland.png");

        let loaded = 0;

        function checkFinish(){

            loaded++;

            loadingText.textContent =
                `正在載入圖片 ${loaded}/${imageList.length}`;

            if(loaded === imageList.length){

                resolve();

            }

        }

        imageList.forEach(src=>{

            const img = new Image();

            img.onload = checkFinish;
            img.onerror = checkFinish;

            img.src = src;

        });

    });

}