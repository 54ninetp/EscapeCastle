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
// 記錄目前關卡
let currentStage = 1;

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

        // 記錄目前隊伍
        currentTeam = button.dataset.team;


        // 更新遊戲畫面資訊
        updateGameScreen();

        // 畫面切換
        teamPage.classList.add("hidden");
        gamePage.classList.remove("hidden");

        console.log("目前隊伍：", currentTeam);

    });

});