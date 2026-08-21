// База данных всплывающих подсказок и руководств (RU / EN)
export const TOOLTIPS = {
    ru: {
        secretConception: "При включении зачатие происходит тайно: кубик бросается скрыто без спойлерных уведомлений. В первые недели цикл отображается как обычно, симптомы и плод скрыты в UI и промпте. Беременность раскрывается при проведении теста на задержке или автоматически на 6-й акушерской неделе.",
        mode: "«Реализм» — стандартный женский цикл (28 дней, 40 акушерских недель, фолликулярная/лютеиновая фазы). «ОмегаВерс» — система альфа/омега физиологии, периоды течки с повышенной фертильностью, срок 36 недель и возможность мужской беременности.",
        physiology: "Биологическое строение персонажа. В Реализме доступна только Женщина. В Омегаверсе — Женщина-Омега (вагинальное зачатие) и Мужчина-Омега (анальное зачатие со смазкой).",
        aiAwareness: "«УЗИ (20 нед)» — бот узнает о двойне/тройне на 12 неделе, а пол и патологии плода на 20 неделе. «Средневековье» — пол и число детей строго скрыты до самих родов. «Знает всё» — боту сразу доступны все медицинские параметры плода.",
        contraception: "Метод защиты от беременности. «Презерватив» снижает шанс до ~2%, «КОК (таблетки)» — до 0.1%, «ВМС (спираль)» — до 0.2%. Без защиты в фертильное окно шанс максимален.",
        fetalPathology: "Шанс (~3% при зачатии) возникновения генетической или анатомической особенности плода (порок сердца, гетерохромия, синдром Дауна и др.), которая проявится на скрининге 20-й недели.",
        rpDate: "Текущая дата в сюжете ролевой игры. Поддерживает форматы ДД.ММ.ГГГГ, ISO и текстовые даты любого века (включая Средневековье и будущее).",
        cycleLength: "Индивидуальная длина менструального цикла в днях (по умолчанию 28 дней). На 14-й день приходится пик овуляции.",
        maxWeeks: "Максимальный акушерский срок вынашивания плода (40 недель для Реализма, 36 для Омегаверса), по достижении которого наступают роды."
    },
    en: {
        secretConception: "When enabled, conception occurs secretly: dice rolls are hidden without spoiler notifications. Early weeks show regular cycle, hiding symptoms and fetus from UI and AI prompt. Discovered via pregnancy test or automatically at 6 weeks missed period.",
        mode: "«Realism» — human female cycle (28 days, 40 obstetric weeks, follicular/luteal phases). «OmegaVerse» — Alpha/Omega physiology, heat cycles with extreme fertility, 36-week gestation, and male pregnancy support.",
        physiology: "Biological reproductive anatomy. In Realism, only Female is available. In Omegaverse, choose between Female Omega (vaginal conception) and Male Omega (anal self-lubricating conception).",
        aiAwareness: "«Ultrasound (20 wk)» — AI discovers multiples at week 12, sex & anomalies at week 20. «Medieval (Blind)» — sex and headcount hidden until delivery. «Knows Everything» — AI is aware of all fetal data from day one.",
        contraception: "Birth control method. «Condom» reduces chance to ~2%, «Oral Pills» to 0.1%, «IUD» to 0.2%. Unprotected intercourse during fertility peak carries the highest conception chance.",
        fetalPathology: "A ~3% chance at conception for a congenital or genetic fetal condition (heart defect, heterochromia, Down syndrome, etc.) to be diagnosed on week 20 anatomy ultrasound.",
        rpDate: "In-character roleplay date. Supports DD.MM.YYYY, ISO, and natural textual dates across any era (medieval to futuristic).",
        cycleLength: "Total menstrual cycle duration in days (default 28). Day 14 marks the peak fertility ovulation window.",
        maxWeeks: "Total obstetric gestational duration (40 weeks for Realism, 36 for Omegaverse) before full-term labor begins."
    }
};

export function getTooltipHtml(key, lang = 'ru') {
    const l = (lang === 'en') ? 'en' : 'ru';
    const text = TOOLTIPS[l]?.[key] || TOOLTIPS['ru']?.[key] || '';
    return `<i class="fa-solid fa-circle-info repro-tooltip-icon" title="${text}" style="cursor: pointer; opacity: 0.7; margin-left: 6px; font-size: 0.9em; color: #f472b6; transition: opacity 0.15s; vertical-align: middle;"></i>`;
}
