const list = document.getElementById("list");
const log = document.getElementById("log");

const sortBubble = document.getElementById("sort-bubble");
const sortSelection = document.getElementById("sort-selection");
const sortMerge = document.getElementById("sort-merge");

sortBubble.addEventListener("click", bubbleSort);
sortSelection.addEventListener("click", selectionSort);
sortMerge.addEventListener("click", mergeSort);

const searchValue = document.getElementById("search-value");
const searchLinear = document.getElementById("search-linear");
const searchBinary = document.getElementById("search-binary");

searchLinear.addEventListener("click", linearSearch);
searchBinary.addEventListener("click", binarySearch);

const listReset = document.getElementById("list-reset");
const listAddValue = document.getElementById("list-add-value");
const listAdd = document.getElementById("list-add");
const listAddRandom = document.getElementById("list-add-random");
const listShuffle = document.getElementById("list-shuffle");

listAdd.addEventListener("click", () => {
    if (doingSomething) return;
    if (isNaN(listAddValue.value)) return;
    curList.push(parseInt(listAddValue.value));
    redrawList();
});

listAddRandom.addEventListener("click", () => {
    if (doingSomething) return;
    curList.push(Math.round(Math.random() * 99));
    redrawList();
});

listReset.addEventListener("click", () => {
    if (doingSomething) return;
    curList.splice(0, curList.length);
    redrawList();
});

listShuffle.addEventListener("click", () => {
    if (doingSomething) return;
    let i = curList.length, j, temp;

    while (--i > 0) {
        j = Math.floor(Math.random() * (i + 1));
        temp = curList[j];
        curList[j] = curList[i];
        curList[i] = temp;
    }

    redrawList();
});

const cursor1 = document.getElementById("cursor-1");
const cursor2 = document.getElementById("cursor-2");

const curList = [2, 9, 10, 3, 5, 6, 1, 8, 7, 4]

function redrawList() {
    list.replaceChildren();

    const maxValue = Math.max(...curList);

    for (let i = 0; i < curList.length; i++) {
        const value = curList[i];

        const item = document.createElement("div");
        item.classList.add("item");
        item.style.height = `${value / maxValue * 100}%`;
        item.innerHTML = `<span>${value}</span>`

        list.appendChild(item);
    }
}

redrawList();

let cursor1Item = null;
let cursor2Item = null;
let doingSomething = false;

async function linearSearch() {
    if (doingSomething) return;
    doingSomething = true;

    cursor1.style.display = null;
    cursor2.style.display = "none";

    let success = false;
    const search = parseInt(searchValue.value);

    for (let i = 0; i < curList.length; i++) {
        cursor1Item = list.children.item(i);
        await sleep(300);

        if (curList[i] === search) {
            log.innerHTML += `Linear search completed in ${i + 1} steps. Returned ${i}<br>`;
            success = true;
            break;
        }
    }

    if (!success) {
        log.innerHTML += `Linear search failed! ${search} does not exist in list. Returned -1<br>`;
    }

    doingSomething = false;
}

async function binarySearch() {
    if (doingSomething) return;
    doingSomething = true;

    cursor1.style.display = null;
    cursor2.style.display = "none";

    const search = parseInt(searchValue.value);

    for (let i = 1; i < curList.length; i++) {
        if (curList[i - 1] > curList[i]) {
            log.innerHTML += `Binary search failed! The list must be sorted first.<br>`;
            cursor1.style.display = "none";
            doingSomething = false;
            return;
        }
    }

    let low = 0;
    let high = curList.length - 1;
    let steps = 0;
    let result = -1;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        steps++;

        cursor1Item = list.children.item(mid);
        await sleep(300);

        if (curList[mid] === search) {
            result = mid;
            break;
        } else if (curList[mid] < search) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    if (result !== -1) {
        log.innerHTML += `Binary search completed in ${steps} steps. Returned ${result}<br>`;
    } else {
        log.innerHTML += `Binary search failed! ${search} does not exist in list. Returned -1<br>`;
    }

    doingSomething = false;
}

async function bubbleSort() {
    if (doingSomething) return;
    doingSomething = true;

    cursor1.style.display = "none";
    cursor2.style.display = "none";

    let totalSwaps = 0;
    let totalComparisons = 0;

    for (let end = curList.length - 1; end > 0; end--) {
        let swapped = false;
        for (let i = 0; i < end; i++) {
            const first = curList[i];
            const second = curList[i + 1];

            if (isNaN(first) || isNaN(second)) {
                continue;
            }

            if (first > second) {
                // swap
                const tempFirst = curList[i];
                curList[i] = second;
                curList[i + 1] = tempFirst;
                totalSwaps++;

                // animate the swap
                const firstItem = list.children.item(i);
                const secondItem = list.children.item(i + 1);
                firstItem.style.transform = `translateX(${firstItem.getBoundingClientRect().width + 8}px)`;
                secondItem.style.transform = `translateX(${-secondItem.getBoundingClientRect().width - 8}px)`;
                await sleep(300);
                redrawList();

                swapped = true;
            }

            totalComparisons++;
        }
        if (!swapped) break;
    }

    log.innerHTML += `Bubble sort complete! ${totalComparisons} comparisons and ${totalSwaps} swaps.<br>`;

    doingSomething = false;
}

async function selectionSort() {
    if (doingSomething) return;
    doingSomething = true;

    cursor1.style.display = "none";
    cursor2.style.display = "none";

    let totalSwaps = 0;

    for (let i = 0; i < curList.length; i++) {
        let minIndex = i;
        for (let j = i + 1; j < curList.length; j++) {
            if (curList[j] < curList[minIndex]) {
                minIndex = j;
            }
        }

        if (i === minIndex) continue;

        // swap
        const temp = curList[i];
        curList[i] = curList[minIndex];
        curList[minIndex] = temp;

        totalSwaps++;

        // animate swap
        const firstItem = list.children.item(i);
        const secondItem = list.children.item(minIndex);
        firstItem.style.transform = `translateX(${(firstItem.getBoundingClientRect().width + 8) * (minIndex - i)}px)`;
        secondItem.style.transform = `translateX(${-((secondItem.getBoundingClientRect().width + 8) * (minIndex - i))}px)`;
        await sleep(300);
        redrawList();

    }

    log.innerHTML += `Selection sort complete! ${totalSwaps} swaps.<br>`;
    doingSomething = false;
}

async function mergeSort() {
    if (doingSomething) return;
    doingSomething = true;

    cursor1.style.display = "none";
    cursor2.style.display = "none";

    let totalComparisons = 0;
    let totalMerges = 0;

    const focusRange = (start, end, dim = 0.25) => {
        for (let i = 0; i < list.children.length; i++) {
            list.children.item(i).style.opacity = (i >= start && i < end) ? 1 : dim;
        }
    };

    async function sortRange(start, end) {
        if (end - start < 2) return;

        const mid = Math.floor((start + end) / 2);
        await sortRange(start, mid);
        await sortRange(mid, end);

        focusRange(start, end);
        await sleep(300);

        const left = curList.slice(start, mid);
        const right = curList.slice(mid, end);
        let l = 0, r = 0, k = start;

        while (l < left.length && r < right.length) {
            totalComparisons++;
            if (left[l] <= right[r]) {
                curList[k++] = left[l++];
            } else {
                curList[k++] = right[r++];
            }
        }

        while (l < left.length) curList[k++] = left[l++];
        while (r < right.length) curList[k++] = right[r++];

        totalMerges++;

        redrawList();
        for (let i = start; i < end; i++) {
            list.children.item(i).style.opacity = 0.4;
        }
        list.offsetWidth;
        focusRange(start, end);
        await sleep(150);
    }

    await sortRange(0, curList.length);

    focusRange(0, curList.length);
    log.innerHTML += `Merge sort complete! ${totalComparisons} comparisons and ${totalMerges} merges.<br>`;
    doingSomething = false;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function update() {
    if (cursor1Item !== null) {
        const domRect = cursor1Item.getBoundingClientRect();
        const cursorRect = cursor1.getBoundingClientRect();

        const cursorX = domRect.x + (domRect.width - cursorRect.width) / 2;
        const cursorY = domRect.bottom + 8;
        cursor1.style.transform = `translate(${cursorX}px, ${cursorY}px)`;

        if (doingSomething) {
            cursor1.style.transition = null;
            await sleep(300);
        } else {
            cursor1.style.transition = "none";
        }
    }

    if (cursor2Item !== null) {
        const domRect = cursor2Item.getBoundingClientRect();
        const cursorRect = cursor2.getBoundingClientRect();

        const cursorX = domRect.x + (domRect.width - cursorRect.width) / 2;
        const cursorY = domRect.bottom + 8;
        cursor2.style.transform = `translate(${cursorX}px, ${cursorY}px)`;

        if (doingSomething) {
            cursor2.style.transition = null;
            await sleep(300);
        } else {
            cursor2.style.transition = "none";
        }
    }

    requestAnimationFrame(update);
}

update();