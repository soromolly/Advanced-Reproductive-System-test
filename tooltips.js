export const TOOLTIPS = {
    ru: {
        secretConception: "При включении зачатие происходит тайно: кубик бросается скрыто без спойлерных уведомлений. В первые недели цикл отображается как обычно, симптомы и плод/яйца скрыты в UI и промпте. Беременность раскрывается при проверке/тесте или автоматически со временем.",
        irregularCycle: "Включает естественные колебания цикла. Создает реалистичные задержки без зачатия, имитируя гормональные сбои и внешние факторы.",
        mode: "«Реализм» — стандартный женский цикл (40 недель). «ОмегаВерс» — течка, 36 недель и омеги. «Яйцекладка» — 6 недель внутреннего вынашивания яиц (2-7 шт.) в яйцеводе с последующей откладкой в гнездо и инкубацией.",
        physiology: "Анатомия персонажа. В Реализме — Женщина. В Омегаверсе — Женщина-Омега и Мужчина-Омега. В Яйцекладке — Женщина и Мужчина (оба имеют яйцевод и клоаку для вынашивания и откладки яиц).",
        aiAwareness: "«Современность» — поэтапное раскрытие на УЗИ (в яйцеводе видно количество яиц 2-7 шт., а пол и патологии раскрываются в гнезде/при вылуплении). «Средневековье» — число яиц видно только при откладке, пол и патологии — при вылуплении. «Всеведение» — все известно сразу.",
        contraception: "Метод защиты от зачатия. Презерватив (~2%), оральные блокаторы/КОК (~0.1%), внутриматочные спирали (~0.2%).",
        fetalPathology: "Шанс возникновения пороков плода, хрупкости скорлупы или замирания зародыша. Данные скрыты от игрока до момента диагностики на скрининге или вылупления.",
        rpDate: "Текущая дата в сюжете ролевой игры (ДД.ММ.ГГГГ, ISO или текст).",
        cycleLength: "Базовая длительность цикла в днях (28 для людей, 90-120 для яйцекладущих).",
        periodDuration: "Количество дней менструации, течки или активного окна яйцекладки.",
        maxWeeks: "Максимальный срок внутреннего вынашивания плода/яиц (40 нед для Реализма, 36 для Омегаверса, 6 для Яйцекладки)."
    },
    en: {
        secretConception: "When enabled, conception occurs secretly: dice rolls are hidden without spoiler notifications. Discovered via test/check or automatically over time.",
        irregularCycle: "Enables natural cycle fluctuations, simulating realistic delays, hormonal variance, and stress.",
        mode: "«Realism» — human female cycle (40 wks). «OmegaVerse» — Heat cycle, 36 wks, male pregnancy. «Oviposition» — 6-week internal oviduct egg gestation (2-7 eggs) followed by nest incubation.",
        physiology: "Reproductive anatomy. Realism: Female. Omegaverse: F-Omega / M-Omega. Oviposition: Female / Male (both have oviducts & cloaca for egg-bearing).",
        aiAwareness: "«Modernity» — phased discovery (ultrasound counts eggs in oviduct; sex and anomalies revealed during brooding/hatching). «Medieval» — headcount known at laying, sex/conditions at hatching. «Omniscience» — all known from conception.",
        contraception: "Birth control method. Condoms (~2%), Pills (~0.1%), IUD/Blockers (~0.2%).",
        fetalPathology: "Enables congenital anomalies, eggshell defects, and embryonic demise risks.",
        rpDate: "In-character roleplay date (DD.MM.YYYY, ISO, textual).",
        cycleLength: "Base reproductive cycle duration in days (28 for human, 90-120 for oviposition).",
        periodDuration: "Duration of menstrual bleeding, heat, or dragon fertile window.",
        maxWeeks: "Internal gestational duration before delivery or oviposition (40 wks Realism, 36 wks Omegaverse, 6 wks Oviposition)."
    }
};

export function getTooltipHtml(key, lang = 'ru') {
    const l = (lang === 'en') ? 'en' : 'ru';
    const text = TOOLTIPS[l]?.[key] || TOOLTIPS['ru']?.[key] || '';
    return `<span class="repro-tooltip-btn repro-tooltip-icon" data-tip="${text.replace(/"/g, '&quot;')}" title="${text.replace(/"/g, '&quot;')}" style="display: inline-flex; align-items: center; justify-content: center; padding: 4px 7px; margin-left: 6px; cursor: pointer; color: #f472b6; opacity: 0.85; z-index: 5; position: relative; font-size: 0.9em; touch-action: manipulation; user-select: none;"><i class="fa-solid fa-circle-info" style="pointer-events: none;"></i></span>`;
}
