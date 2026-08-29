export const TOOLTIPS = {
    ru: {
        secretConception: "При включении зачатие происходит тайно: кубик бросается скрыто без спойлерных уведомлений. В первые недели цикл отображается как обычно, симптомы и плод скрыты в UI и промпте. Беременность раскрывается при проведении теста/проверки на задержке или автоматически со временем.",
        irregularCycle: "Включает естественные колебания цикла (от -1 до +12 дней). Создает реалистичные задержки без беременности, имитируя гормональные сбои и стресс.",
        mode: "«Реализм» — стандартный женский цикл (40 акушерских недель, овуляция за 14 дней до месячных). «ОмегаВерс» — течка с 1-го дня цикла, пик фертильности, срок 36 недель и возможность мужской беременности. «Яйцекладка» — 6 недель вынашивания яиц в яйцеводе с последующей откладкой и инкубацией в гнезде.",
        physiology: "Биологическое строение персонажа. В Реализме — Женщина. В Омегаверсе — Женщина-Омега (вагинальное зачатие) и Мужчина-Омега (анальное со смазкой). В Яйцекладке — Женщина и Мужчина (оба обладают автономным яйцеводом и клоакой для вынашивания и кладки).",
        aiAwareness: "«Современность» — поэтапное раскрытие по клиническим скринингам (двойня/тройня на 12 нед., пол на 20 нед., патологии на 11–21 нед.; для яйцеклада — число яиц видно на УЗИ в яйцеводе, а пол и особенности раскрываются при инкубации/вылуплении). «Средневековье» — пол, число детей/яиц и пороки скрыты до родов или вылупления. «Всеведение» — боту сразу открыты все параметры плода/яиц с момента зачатия.",
        contraception: "Метод защиты от беременности. «Презерватив» снижает шанс до ~2%, «КОК (таблетки)» — до 0.1%, «ВМС (спираль)» — до 0.2%. Без защиты в фертильное окно шанс максимален.",
        fetalPathology: "Шанс возникновения врожденных патологий или замирания беременности (1-й трим: ~10%, 2-й: ~1.5%, 3-й: <0.5%) / дефектов скорлупы и угасания кладки. Данные скрыты от игрока и ИИ до момента их выявления на скрининге или выкидыша.",
        rpDate: "Текущая дата в сюжете ролевой игры. Поддерживает форматы ДД.ММ.ГГГГ, ISO и текстовые даты любого века.",
        cycleLength: "Базовая длительность цикла в днях (по умолчанию 28 для человека/омеги, 90 для яйцеклада). Овуляция рассчитывается автоматически.",
        periodDuration: "Количество дней кровотечения при менструации, длительность течки у омег или окна фертильности яйцеклада.",
        maxWeeks: "Максимальный акушерский срок вынашивания плода (40 недель для Реализма, 36 для Омегаверса, 6 для Яйцеклада), по достижении которого наступают роды / откладка."
    },
    en: {
        secretConception: "When enabled, conception occurs secretly: dice rolls are hidden without spoiler notifications. Early weeks show regular cycle, hiding symptoms and fetus from UI and AI prompt. Discovered via test/check or automatically over time.",
        irregularCycle: "Enables natural cycle fluctuations (-1 to +12 days). Simulates realistic pregnancy scares, hormonal delays, and stress.",
        mode: "«Realism» — human female cycle (40 obstetric weeks, ovulation 14 days before menses). «OmegaVerse» — Heat begins on Day 1, 36-week gestation, and male pregnancy support. «Oviposition» — 6-week internal oviduct egg gestation followed by nest incubation.",
        physiology: "Biological reproductive anatomy. In Realism: Female. In Omegaverse: Female Omega (vaginal) and Male Omega (anal self-lubricating). In Oviposition: Female and Male (both equipped with oviducts and cloaca for bearing).",
        aiAwareness: "«Modernity» — phased clinical discovery: multiples at 12 wks, fetal sex at 20 wks, anomalies at 11–21 wks (for oviposition: ultrasound counts eggs in oviduct; sexes and traits revealed during nest brooding/hatching). «Medieval» — sex, headcount, and pathologies hidden until delivery/hatching. «Omniscience» — AI is aware of all parameters from conception.",
        contraception: "Birth control method. «Condom» reduces chance to ~2%, «Oral Pills» to 0.1%, «IUD» to 0.2%. Unprotected intercourse during fertility peak carries the highest conception chance.",
        fetalPathology: "Enables congenital anomalies, missed miscarriages, or eggshell/embryonic defects. Kept completely secret from UI and AI until screening discovery or miscarriage.",
        rpDate: "In-character roleplay date. Supports DD.MM.YYYY, ISO, and natural textual dates across any era.",
        cycleLength: "Base menstrual cycle duration in days (default 28 for mammals, 90 for oviposition).",
        periodDuration: "Duration of menstrual bleeding in days (or heat / fertile window duration).",
        maxWeeks: "Total obstetric gestational duration (40 weeks for Realism, 36 for Omegaverse, 6 for Oviposition) before labor/laying begins."
    }
};

export function getTooltipHtml(key, lang = 'ru') {
    const l = (lang === 'en') ? 'en' : 'ru';
    const text = TOOLTIPS[l]?.[key] || TOOLTIPS['ru']?.[key] || '';
    return `<span class="repro-tooltip-btn repro-tooltip-icon" data-tip="${text.replace(/"/g, '&quot;')}" title="${text.replace(/"/g, '&quot;')}" style="display: inline-flex; align-items: center; justify-content: center; padding: 4px 7px; margin-left: 6px; cursor: pointer; color: #f472b6; opacity: 0.85; z-index: 5; position: relative; font-size: 0.9em; touch-action: manipulation; user-select: none;"><i class="fa-solid fa-circle-info" style="pointer-events: none;"></i></span>`;
}
