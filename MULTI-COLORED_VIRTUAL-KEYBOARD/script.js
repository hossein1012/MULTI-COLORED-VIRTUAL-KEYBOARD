// آرایه‌ای که ترتیب و محتوای کلیدهای کیبورد را مشخص می‌کند
const keyboardLayout = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
    'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
    'Z', 'X', 'C', 'V', 'B', 'N', 'M',
    'Back', 'Space', 'Enter'
];

// گرفتن ارجاع به المنت‌های صفحه
const keyboardContainer = document.getElementById('keyboard'); // کانتینر کیبورد
const output = document.getElementById('output'); // textarea خروجی متن
const toggleButton = document.getElementById('toggleBackground'); // دکمه تغییر پس‌زمینه (اگر وجود داشته باشد)

let isBlackBackground = false; // وضعیت پس‌زمینه (استفاده نشده در کد فعلی)

// تابعی برای محاسبه رنگ میانی بین دو رنگ بر اساس ضریب factor (برای انیمیشن گرادیان)
function interpolateColor(color1, color2, factor) {
    const result = color1.map((c, i) => Math.round(c + factor * (color2[i] - c))); // محاسبه هر کانال رنگ
    return `rgb(${result[0]}, ${result[1]}, ${result[2]})`; // بازگرداندن رنگ به صورت رشته rgb
}

// تابعی برای تنظیم پس‌زمینه گرادیان رنگین‌کمانی متحرک روی کیبورد
function setGradientBackground() {
    const colors = [ // آرایه رنگ‌های اصلی برای انیمیشن
        [255, 0, 0],      // قرمز
        [0, 255, 0],      // سبز
        [0, 0, 255],      // آبی
        [255, 255, 0],    // زرد
        [255, 0, 255],    // بنفش
        [0, 255, 255]     // فیروزه‌ای
    ];
    
    let currentIndex = 0; // رنگ فعلی
    let nextIndex = 1;    // رنگ بعدی
    let step = 0;         // مقدار پیشرفت بین دو رنگ

    // تابع انیمیشن که به صورت بازگشتی با requestAnimationFrame اجرا می‌شود
    function animateGradient() {
        if (step >= 1) { // اگر به انتهای انتقال رسیدیم
            step = 0; // صفر کردن مرحله
            currentIndex = nextIndex; // رنگ فعلی را به رنگ بعدی تغییر می‌دهیم
            nextIndex = (nextIndex + 1) % colors.length; // رنگ بعدی را به رنگ بعدی در آرایه تغییر می‌دهیم (حلقه)
        }
        
        const color1 = colors[currentIndex]; // رنگ فعلی
        const color2 = colors[nextIndex];    // رنگ بعدی
        const gradientColor = interpolateColor(color1, color2, step); // محاسبه رنگ میانی
        
        // تنظیم پس‌زمینه گرادیان با زاویه ۴۵ درجه که از رنگ میانی شروع می‌شود و به رنگ معکوس آن ختم می‌شود
        keyboardContainer.style.background = `linear-gradient(45deg, ${gradientColor}, ${interpolateColor(color2, color1, step)})`;
        
        step += 0.006; // افزایش مرحله انتقال
        requestAnimationFrame(animateGradient); // اجرای دوباره تابع انیمیشن در فریم بعدی
    }

    animateGradient(); // شروع انیمیشن
}

setGradientBackground(); // فراخوانی تابع تنظیم پس‌زمینه

// ایجاد کلیدهای کیبورد بر اساس آرایه layout
keyboardLayout.forEach(key => {
    const keyElement = document.createElement('div'); // ساخت div برای هر کلید
    keyElement.classList.add('key'); // افزودن کلاس key برای استایل‌دهی
    keyElement.textContent = key;    // قرار دادن متن کلید

    // افزودن رویداد کلیک برای هر کلید
    keyElement.addEventListener('click', () => handleKeyPress(key));
    
    keyboardContainer.appendChild(keyElement); // افزودن کلید به کانتینر کیبورد
});

// تابع مدیریت کلیک روی کلیدها و افزودن متن به textarea
function handleKeyPress(key) {
    if (key === 'Back') { // اگر کلید Backspace بود
        output.value = output.value.slice(0, -1); // حذف آخرین کاراکتر
    } else if (key === 'Space') { // اگر کلید Space بود
        output.value += ' '; // افزودن فاصله
    } else if (key === 'Enter') { // اگر کلید Enter بود
        output.value += '\n'; // افزودن خط جدید
    } else {
        output.value += key; // در غیر این صورت افزودن متن کلید به خروجی
    }
}
