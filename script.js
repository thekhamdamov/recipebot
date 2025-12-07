const rowsEl = document.getElementById("rows");
const addRowBtn = document.getElementById("addRow");
const toast = document.getElementById("toast");
const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const themeBtn = document.getElementById("themeBtn");
const previewBtn = document.getElementById("previewBtn");
const exportBtn = document.getElementById("exportBtn");
const clearBtn = document.getElementById("clearBtn"); // YANGI
const copyPreviewBtn = document.getElementById("copyPreviewBtn"); // YANGI
const previewModal = document.getElementById("previewModal");
const previewBody = document.getElementById("previewBody");
const closePreview = document.getElementById("closePreview");
const hashtagsEl = document.getElementById("hashtags");

const langBtn = document.getElementById("langBtn");
const langMenu = document.getElementById("langMenu");

const translations = {
    uz: {
        title: "Retsept Hujjat",
        select_category: "Kategoriya tanlang",
        category_salad: "Salat",
        category_soup: "Sho'rva",
        category_sauce: "Sous",
        category_dessert: "Desert",
        category_main: "Asosiy taom",
        chat_soon: "Chat sahifasi tez kunda",
        settings_soon: "Sozlamalar sahifasi tez kunda",
        tab_document: "Hujjat",
        tab_chat: "Chat",
        tab_chart: "Grafik",
        tab_settings: "Sozlamalar",
        preview_title: "Retsept preview",
        toast_doc_name: "Docx fayl nomini kiriting",
        toast_recipe_name: "Retsept nomini kiriting",
        toast_ingredient: "Kamida bitta mahsulot kiriting",
        toast_hashtag_limit: "Faqat 3ta hashtag tanlash mumkin!",
        toast_photo_uploaded: "Rasm muvaffaqiyatli yuklandi",
        toast_photo_error: "Rasm formatida xatolik",
        toast_data_sending: "Ma'lumotlar botga yuborilmoqda...",
        toast_theme_changed: "Rejim almashtirildi",
        toast_lang_changed: "Til: ",
        toast_cleared: "Forma tozalandi",
        toast_copied: "Nusxalandi!"
    },
    ru: {
        title: "Рецепт Документ",
        select_category: "Выберите категорию",
        category_salad: "Салат",
        category_soup: "Суп",
        category_sauce: "Соус",
        category_dessert: "Десерт",
        category_main: "Основное блюдо",
        chat_soon: "Страница чата скоро",
        settings_soon: "Страница настроек скоро",
        tab_document: "Документ",
        tab_chat: "Чат",
        tab_chart: "График",
        tab_settings: "Настройки",
        preview_title: "Предварительный просмотр рецепта",
        toast_doc_name: "Введите имя файла Docx",
        toast_recipe_name: "Введите название рецепта",
        toast_ingredient: "Введите хотя бы один ингредиент",
        toast_hashtag_limit: "Можно выбрать только 3 хэштега!",
        toast_photo_uploaded: "Изображение успешно загружено",
        toast_photo_error: "Ошибка в формате изображения",
        toast_data_sending: "Данные отправляются в бота...",
        toast_theme_changed: "Режим изменен",
        toast_lang_changed: "Язык: ",
        toast_cleared: "Форма очищена",
        toast_copied: "Скопировано!"
    },
    en: {
        title: "Recipe Document",
        select_category: "Select category",
        category_salad: "Salad",
        category_soup: "Soup",
        category_sauce: "Sauce",
        category_dessert: "Dessert",
        category_main: "Main dish",
        chat_soon: "Chat page soon",
        settings_soon: "Settings page soon",
        tab_document: "Document",
        tab_chat: "Chat",
        tab_chart: "Chart",
        tab_settings: "Settings",
        preview_title: "Recipe preview",
        toast_doc_name: "Enter Docx file name",
        toast_recipe_name: "Enter recipe name",
        toast_ingredient: "Enter at least one ingredient",
        toast_hashtag_limit: "Only 3 hashtags allowed!",
        toast_photo_uploaded: "Image uploaded successfully",
        toast_photo_error: "Image format error",
        toast_data_sending: "Sending data to bot...",
        toast_theme_changed: "Mode changed",
        toast_lang_changed: "Language: ",
        toast_cleared: "Form cleared",
        toast_copied: "Copied!"
    }
};

let currentLang = "uz";

let Telegram = window.Telegram?.WebApp;
let userId, phoneNumber;

if (Telegram) {
    Telegram.ready();
    Telegram.expand();
    const user = Telegram.initDataUnsafe?.user;
    if (user) {
        userId = user.id;
        phoneNumber = user.phone_number || "N/A";
        if (user.language_code) {
            if (translations[user.language_code]) {
                currentLang = user.language_code;
            } else if (user.language_code.startsWith('ru')) {
                currentLang = 'ru';
            } else if (user.language_code.startsWith('en')) {
                currentLang = 'en';
            }
        }
    }
}

function translatePage(lang) {
    const elements = document.querySelectorAll('[data-i18n], [data-i18n-text]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n') || el.getAttribute('data-i18n-text');
        if (translations[lang] && translations[lang][key]) {
            if (el.tagName === 'OPTION' || el.tagName === 'BUTTON' || el.tagName === 'H2' || el.tagName === 'H3' || el.tagName === 'DIV' || el.tagName === 'TITLE') {
                el.textContent = translations[lang][key];
            } else {
                el.placeholder = translations[lang][key];
            }
        }
    });
}

langBtn.addEventListener("click", () => {
    langMenu.style.display = langMenu.style.display === "flex" ? "none" : "flex";
});

langMenu.querySelectorAll("button").forEach(b => {
    b.addEventListener("click", () => {
        currentLang = b.dataset.lang;
        showToast(translations[currentLang].toast_lang_changed + b.textContent);
        langMenu.style.display = "none";
        translatePage(currentLang); 
    });
});

const opts = ["Килограмм", "Литр", "Штук"];
const valueMap = {
    "Килограмм": "кг",
    "Литр": "лт",
    "Штук": "шт"
};

function makeSelect() {
    const wrapper = document.createElement("div");
    wrapper.className = "select-wrapper";
    wrapper.style.width = "100%";

    const sel = document.createElement("select");
    sel.className = "select";
    
    opts.forEach(o => {
        const op = document.createElement("option");
        op.textContent = o;       
        op.value = valueMap[o];   
        sel.appendChild(op);
    });

    const arrow = document.createElement("i");
    arrow.className = "bi bi-chevron-down select-arrow";

    wrapper.append(sel, arrow);
    return { wrapper, sel }; 
}

// ✅ YANGILANDI: Raqam kiritishni nazorat qilish
function formatAmount(e) {
    const input = e.target;
    let val = input.value;
    // Manfiy raqamni oldini olish
    if (val < 0) {
        input.value = Math.abs(val);
    }
}

function addRow() {
    const row = document.createElement("div");
    row.className = "row";

    const nameCell = document.createElement("div");
    nameCell.className = "cell";
    const name = document.createElement("input");
    name.className = "input";
    name.placeholder = "Mahsulot nomi";
    name.addEventListener("input", saveFormData);
    nameCell.appendChild(name);

    const unitCell = document.createElement("div");
    unitCell.className = "cell";
    const { wrapper, sel } = makeSelect(); 
    sel.addEventListener("change", saveFormData);
    unitCell.appendChild(wrapper);

    const amtCell = document.createElement("div");
    amtCell.className = "cell";
    const amt = document.createElement("input");
    
    amt.type = "number";
    amt.inputMode = "decimal"; 
    amt.pattern = "[0-9]*"; 
    amt.className = "amount";
    amt.placeholder = "0.000";
    amt.step = "0.001"; 
    amt.min = "0";
    amt.addEventListener("input", saveFormData);
    amt.addEventListener("input", formatAmount); // Funksiya ulandi

    amtCell.appendChild(amt);

    const delCell = document.createElement("div");
    delCell.className = "cell";
    const delBtn = document.createElement("button");
    delBtn.className = "del-btn";
    delBtn.innerHTML = '<i class="bi bi-trash"></i>';
    delBtn.addEventListener("click", () => {
        row.remove();
        saveFormData();
    });
    delCell.appendChild(delBtn);

    row.append(nameCell, unitCell, amtCell, delCell);
    rowsEl.appendChild(row);
}

function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

function saveFormData() {
    const data = {
        docName: document.getElementById("docName").value,
        recipeName: document.getElementById("recipeName").value,
        category: document.getElementById("category").value,
        tech: document.getElementById("tech").value,
        hashtags: Array.from(hashtagsEl.querySelectorAll(".hashtag.selected")).map(h => h.textContent),
        ingredients: [...rowsEl.querySelectorAll(".row")].map(row => {
            const inputs = row.querySelectorAll("input");
            const select = row.querySelector("select");
            return {
                name: inputs[0].value,
                unit: select.value,
                amount: inputs[1].value
            };
        })
    };
    localStorage.setItem("recipeData", JSON.stringify(data));
}

function loadFormData() {
    const saved = localStorage.getItem("recipeData");
    rowsEl.innerHTML = ''; 
    if (saved) {
        try {
            const data = JSON.parse(saved);
            document.getElementById("docName").value = data.docName || "";
            document.getElementById("recipeName").value = data.recipeName || "";
            document.getElementById("category").value = data.category || "";
            document.getElementById("tech").value = data.tech || "";
            
            data.hashtags?.forEach(tag => {
                const el = [...hashtagsEl.querySelectorAll(".hashtag")].find(h => h.textContent === tag);
                if (el) el.classList.add("selected");
            });

            if (data.ingredients && data.ingredients.length > 0) {
                data.ingredients.forEach(ing => {
                    addRow();
                    const rows = rowsEl.querySelectorAll(".row");
                    const lastRow = rows[rows.length - 1];
                    const inputs = lastRow.querySelectorAll("input");
                    const select = lastRow.querySelector("select");
                    
                    if(inputs[0]) inputs[0].value = ing.name;
                    if(select) select.value = ing.unit;
                    if(inputs[1]) inputs[1].value = ing.amount;
                });
            } else {
                 for (let i = 0; i < 3; i++) addRow();
            }
        } catch (e) {
            console.error("Data load error", e);
             for (let i = 0; i < 3; i++) addRow();
        }
    } else {
         for (let i = 0; i < 3; i++) addRow();
    }
}

function validateForm() {
    const docName = document.getElementById("docName").value.trim();
    const recipeName = document.getElementById("recipeName").value.trim();
    const ingredients = [...rowsEl.querySelectorAll(".row")].filter(row => {
        const inputs = row.querySelectorAll("input");
        return inputs[0].value.trim() !== '' && inputs[1].value.trim() !== '';
    });

    if (!docName) {
        showToast(translations[currentLang].toast_doc_name);
        return false;
    }
    if (!recipeName) {
        showToast(translations[currentLang].toast_recipe_name);
        return false;
    }
    if (ingredients.length === 0) {
        showToast(translations[currentLang].toast_ingredient);
        return false;
    }

    return true;
}

previewBtn.addEventListener("click", () => {
    const docName = document.getElementById("docName").value;
    const recipeName = document.getElementById("recipeName").value;
    const tech = document.getElementById("tech").value;
    const cat = document.getElementById("category").value;
    const tags = [...hashtagsEl.querySelectorAll(".hashtag.selected")].map(h => h.textContent).join(", ");

    let html = `<p><b>Doc nomi:</b> ${docName}</p>`;
    html += `<p><b>Retsept nomi:</b> ${recipeName}</p>`;
    html += `<p><b>Kategoriya:</b> ${cat}</p>`;
    html += `<p><b>Hash-tag:</b> ${tags}</p>`;
    html += `<p><b>Texnologiya:</b><br>${tech.replace(/\n/g, "<br>")}</p>`;
    html += "<h4>Mahsulotlar:</h4><ul>";

    [...rowsEl.children].forEach(r => {
        const inputs = r.querySelectorAll("input");
        const select = r.querySelector("select");
        if (inputs[0].value) {
            html += `<li>${inputs[0].value} — ${inputs[1].value} ${select.value}</li>`;
        }
    });

    html += "</ul>";
    previewBody.innerHTML = html;
    previewModal.style.display = "flex"; 
});

// ✅ YANGI: Nusxa olish funksiyasi
copyPreviewBtn.addEventListener("click", () => {
    const text = previewBody.innerText; // HTML emas, oddiy matnni olamiz
    navigator.clipboard.writeText(text).then(() => {
        showToast(translations[currentLang].toast_copied);
    });
});

closePreview.addEventListener("click", () => (previewModal.style.display = "none"));

previewModal.addEventListener("click", e => {
    if (e.target === previewModal) previewModal.style.display = "none";
});

// ✅ YANGI: Tozalash funksiyasi
if (clearBtn) {
    clearBtn.addEventListener("click", () => {
        if(confirm("Haqiqatan ham formani tozalaysizmi?")) {
            localStorage.removeItem("recipeData");
            document.getElementById("docName").value = "";
            document.getElementById("recipeName").value = "";
            document.getElementById("category").value = "";
            document.getElementById("tech").value = "";
            document.querySelectorAll(".hashtag.selected").forEach(h => h.classList.remove("selected"));
            userPhoto = null;
            
            // Ingredientlarni qayta yuklash (reset)
            rowsEl.innerHTML = '';
            for (let i = 0; i < 3; i++) addRow();
            
            showToast(translations[currentLang].toast_cleared);
        }
    });
}

exportBtn.addEventListener("click", () => {
    if (!validateForm()) return;

    const ingredients = [...rowsEl.querySelectorAll(".row")]
        .map(row => {
            const inputs = row.querySelectorAll("input");
            const select = row.querySelector("select");
            return {
                name: inputs[0].value.trim(),
                unit: select.value,
                amount: inputs[1].value.trim()
            };
        })
        .filter(ing => ing.name !== '' && ing.amount !== '');

    const data = {
        docName: document.getElementById("docName").value,
        recipeName: document.getElementById("recipeName").value,
        category: document.getElementById("category").value,
        hashtags: Array.from(hashtagsEl.querySelectorAll(".hashtag.selected")).map(h => h.textContent),
        ingredients: ingredients,
        tech: document.getElementById("tech").value,
        ...(userPhoto && { photo: userPhoto }),
        user: { id: userId, phone: phoneNumber }
    };

    if (Telegram) {
        Telegram.sendData(JSON.stringify(data));
    }
    showToast(translations[currentLang].toast_data_sending);
});

addRowBtn.addEventListener("click", () => addRow());
uploadBtn.addEventListener("click", () => fileInput.click());

let userPhoto = null;

fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                userPhoto = e.target.result.split(",")[1];
                showToast(translations[currentLang].toast_photo_uploaded);
            } catch (err) {
                showToast(translations[currentLang].toast_photo_error);
            }
        };
        reader.readAsDataURL(file);
    }
});

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light");
    showToast(translations[currentLang].toast_theme_changed);
});

hashtagsEl.querySelectorAll(".hashtag").forEach(h => {
    h.addEventListener("click", () => {
        if (h.classList.contains("selected")) {
            h.classList.remove("selected");
        } else {
            const selected = hashtagsEl.querySelectorAll(".hashtag.selected");
            if (selected.length >= 3) {
                showToast(translations[currentLang].toast_hashtag_limit);
                return;
            }
            h.classList.add("selected");
        }
        saveFormData();
    });
});

document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".card").forEach(card => card.style.display = "none");
        const tab = btn.dataset.tab;
        
        const targetSection = document.getElementById(tab + "-section");
        if(targetSection) targetSection.style.display = "block";
        
        document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    });
});

window.addEventListener("load", () => {
    translatePage(currentLang);
    loadFormData();
});

document.getElementById("docName").addEventListener("input", saveFormData);
document.getElementById("recipeName").addEventListener("input", saveFormData);
document.getElementById("category").addEventListener("change", saveFormData);
document.getElementById("tech").addEventListener("input", saveFormData);

window.addEventListener("load", () => {
    const ctx = document.getElementById('myChart');
    if(ctx) {
        new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Salat', 'Sho\'rva', 'Desert', 'Sous', 'Asosiy taom'],
                datasets: [{
                    label: 'Retseptlar soni',
                    data: [5, 10, 3, 2, 8],
                    backgroundColor: 'rgba(77, 163, 255, 0.7)',
                }]
            },
            options: { responsive: true }
        });
    }
});
