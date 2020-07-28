// window.onload = function(){


//1获取节点
const calendar = document.getElementById('calendar');

// 以下按钮被选择时会产生变化，所以用选择器
const moods = document.querySelectorAll('.mood');
const randomize = document.querySelector('#randomize');
const clear = document.querySelector('#clear');

// 创建日历所需的初始化变量
// 获取当前的年份
const currentYear = 2020;

// 创建一个星期数组
const weekDays = ['Sun', 'Mon', 'The', 'Wed', 'Thu', 'Fri', 'Sat'];

// 创建一个月份数组
const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'Octomber',
    'November',
    'December',
];


// 最初为空，让下面循环插入
let monthsHTML = '';

// 创建初始化心情日历变量
// 心情图标的颜色值
const colors = ['#28685b', '94ecbd', '#91c05c', '#e6ab78', '#ea3d36'];

// 默认的日历颜色
const defaultColor = '#888';

// 点击心情图标时的颜色值赋值给日期作为背景颜色
let activeColor = '';


// 渲染日历步骤
// 1.获取这一年的所有日期
const dates = getAllDays(currentYear);


// 2.对月份进行循环变量，插入对应的日期
months.forEach((month,index) => {
    // 由于每个月要更新，所以自增
  monthsHTML += `<div class="months month-${index}">
    <h3>${month}</h3>
    <div class="week-days-container">
    ${weekDays.map((day) => `<div class="week-days">${day}</div>`).
    join('')}
    </div>
    <div class="days-container"></div>
  </div>`;
})
// 将上值插入到calendar
calendar.innerHTML = monthsHTML;




// 3.每月日期渲染到对应的星期里面

dates.forEach((date) => {

    // 获取日期的月份
    const month = date.getMonth();
    // console.log(month);

    // 将获取的天数插入到days-container中
    // 获取对应月份的节点，如果月份是1，那上面的index就为0。然后在上面的days-container中插入1月的31天
    const monthEl = document.querySelector(`.month-${month} .days-container`);

    // 月份前的空白占位div
    // getDate返回的是1说明是这个月的第一天，且getDay不等于0，说明前面有空白天数
    // getDate的值是1-31
    // getDay的值是0-6，当不等于0时，说明不是这个月的星期天，周日是每个月的开始，因此要填补空白天数
    if(date.getDate() === 1 && date.getDay !== 0){
        // 当前getDay为月份的第一天，小于下标相当于下标-1的值往前都是空白天数
        for(let i = 0; i < date.getDay(); i++){
            // 创建变量来保存空的占位符
            const emptySpot = createEmptySpot();
            
            // 将空白天数插入到div里面
            monthEl.appendChild(emptySpot);

        }
    }



    // 插入的每一天
    const dateEl = createDateEl(date);

    // 在月份中插入存在的天数
    monthEl.appendChild(dateEl);

});



// 循环遍历心情图标
moods.forEach((mood) => {
    // 创建一个事件监听器
    mood.addEventListener('click', () => {
        // 判断图标是否被选中
        // 有的话清除类名
        if(mood.classList.contains('selected')){
            mood.classList.remove('selected');
            // 被选中的值移除掉后应该编程默认颜色
            activeColor = defaultColor;
        }else{
            moods.forEach((mood) => {
                mood.classList.remove('selected');
            });
        
        mood.classList.add('selected');

        // 获取选中图标的颜色值
        activeColor = getComputedStyle(mood).getPropertyValue('color');

        }
      
    });
});


// 给日期添加颜色
const circles = document.querySelectorAll('.circle');
circles.forEach((circle) => {
    circle.addEventListener('click', () => {
        circle.style.backgroundColor = activeColor;
    });
});

// 随机颜色
randomize.addEventListener('click', () => {
    circles.forEach((circle) => {
        circle.style.backgroundColor = getRandomColor();
    });
});

// 刷新功能,把颜色还原成默认值
clear.addEventListener('click',() => {
    circles.forEach((circle) => {
        circle.style.backgroundColor = defaultColor;
    });
});


// <-----------函数---------->
// getAllDays获取所有日期
function getAllDays(year){
    // 获取这一年的第一天
    const firstDay = new Date(`January 1 ${year}`);
    // console.log(firstDay);

    // 获取这一年的最后一天
    const lastDay = new Date(`December 31 ${year}`);
    // console.log(lastDay);

    // 2020年所有日期的数组返回到days里，但当前只获取到第一天，需要它自增。
    // 然后days返回给dates
    const days = [firstDay];

    // push剩下的365天，设置新的变量，用于追踪日期
    // 让数组从第一天开始，当数组等于lastDay时，说明一年结束，退出循环
    let lastDayInArray = firstDay;

    // 当数组的值不等于这一年的最后一天的话，我们让days里面的值进行递增。
    while(lastDayInArray.getTime() !== lastDay.getTime()){

        // push需要增加的天数，第一个参数为数组里的每一项，第二个值为递增1
        days.push(addDays(lastDayInArray, 1));

        // 日期在不断的变化，因此要更新lastDayInArray的值
        // 用days数组的长度-1获取新递增的天数，返回给lastDayInArray
        // 因为索引值从0开始，firstday的下标为0，第二天的下标就位1
        // 长度-1的值作为days的索引坐标去获取新的天数
        lastDayInArray = days[days.length - 1];

    }

    // console.log(days);
    return days;


}

// 日期递增函数
function addDays(date, days) {
    var result = new Date(date);

    // 让上一天的结果来设置下一天
    // +后面为我们递增的天数
    // result得到当前天数，然后获得Date进行递增
    result.setDate(result.getDate() + days);
    return result;
}


// 如何将月份插入到日历中？
// 对当前的月份进行循环遍历，需要遍历月份数组里的12项，遍历完后再去月份里插入日期


// createEmptyspot  创建空白占位
function createEmptySpot(){
    // 创建空的div
    const emptyEl = document.createElement('div');
    // 为这个空div添加类名
    emptyEl.classList.add('days');
    return emptyEl;
}


// createDateEl 创建日期
function createDateEl(date){
    // 得到每个月有多少天
    const day = date.getDate();
    // 给每一天创建div
    const dateEl = document.createElement('div');
    // 添加对应的class名
    dateEl.classList.add('days');

    // 插入里面的天数值
    dateEl.innerHTML = `<span class="circle">${day}</span>`;
    return dateEl;


}

// 随机颜色函数
function getRandomColor(){
    return colors[Math.floor(Math.random() * 5)];
}

// };