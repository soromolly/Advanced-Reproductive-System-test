export const TOOLTIPS = {
    ru: {
        secretConception: "При включении зачатие происходит тайно без спойлеров. В режиме Яйцекладки скорлупа минерализуется скрытно в первые 2 недели, а затем яйца начинают отчетливо прощупываться в животе.",
        irregularCycle: "Включает естественные колебания цикла (задержки, ранние всплески фертильности). В яйцекладке создает реалистичные паузы между периодами фертильности.",
        mode: "«Реализм» — стандартный цикл человека (40 нед.). «ОмегаВерс» — течка и мужская беременность (36 нед.). «Яйцекладка» — созревание кладки из 2–7 яиц в яйцеводе (6 нед.), затем откладка в гнездо и высиживание (70 дней).",
        physiology: "Анатомия: в Реализме — Женщина. В Омегаверсе — Женщина/Мужчина Омега. В Яйцекладке — Женщина или Мужчина с эластичным яйцеводом и клоакой (оба пола способны вынашивать кладку).",
        aiAwareness: "«Современность» — УЗИ показывает число яиц с ранних сроков, но пол и детали закрыты скорлупой до овоскопии/вылупления. «Средневековье» — число яиц узнается при кладке, пол и пороки — только при вылуплении. «Всеведение» — ИИ знает всё сразу.",
        contraception: "Метод защиты от зачатия. Презерватив/барьер снижает шанс до ~2%, оральные блокаторы — до 0.1%, спираль/блокатор клоаки — до 0.2%.",
        fetalPathology: "Шанс возникновения дефектов скорлупы, замирания эмбриона от переохлаждения или врожденных особенностей детеныша.",
        rpDate: "Текущая дата сюжета. Поддерживает любые форматы (ДД.ММ.ГГГГ, текстовые даты).",
        cycleLength: "Базовая длительность цикла в днях (для яйцекладки рекомендуется 60–120 дней).",
        periodDuration: "Длительность фазы активного жара / течки / овуляции.",
        maxWeeks: "Срок вынашивания плода или яиц в теле (40 нед. для реализма, 36 для омегаверса, 6 нед. для яйцекладки)."
    },
    en: {
        secretConception: "When enabled, conception is hidden without spoilers. In Oviposition, eggs crystallize secretly for the first 2 weeks before becoming palpable.",
        irregularCycle: "Enables natural cycle fluctuations, simulating hormone shifts and delayed fertile windows.",
        mode: "«Realism» — human gestation (40 wks). «OmegaVerse» — heat cycles & male pregnancy (36 wks). «Oviposition» — clutch of 2-7 eggs forming in oviduct (6 wks), followed by nest brooding (70 days).",
        physiology: "Anatomy: Realism (Female), Omegaverse (F/M Omega), Oviposition (Female/Male with cloaca and oviduct, both can carry).",
        aiAwareness: "«Modernity» — scans detect egg count early, but sex is hidden by shell until candling/hatching. «Medieval» — egg count revealed at laying; sex/traits upon hatching. «Omniscience» — AI knows everything.",
        contraception: "Birth control method. Condom reduces chance to ~2%, pills to 0.1%, IUD/blocker to 0.2%.",
        fetalPathology: "Enables shell defects, thermal arrest risks in nest, and congenital traits.",
        rpDate: "In-character roleplay date. Supports all text and numeric date formats.",
        cycleLength: "Base reproductive cycle duration in days (default 60–120 for oviposition).",
        periodDuration: "Duration of the fertile heat / ovulation window.",
        maxWeeks: "Internal carrying term (40 wks Realism, 36 wks Omegaverse, 6 wks Oviposition)."
    }
};

export function getTooltipHtml(key, lang = 'ru') {
    const l = (lang === 'en') ? 'en' : 'ru';
    const text = TOOLTIPS[l]?.[key] || TOOLTIPS['ru']?.[key] || '';
    return `<span class="repro-tooltip-btn repro-tooltip-icon" data-tip="${text.replace(/"/g, '&quot;')}" title="${text.replace(/"/g, '&quot;')}" style="display: inline-flex; align-items: center; justify-content: center; padding: 4px 7px; margin-left: 6px; cursor: pointer; color: #f472b6; opacity: 0.85; z-index: 5; position: relative; font-size: 0.9em; touch-action: manipulation; user-select: none;"><i class="fa-solid fa-circle-info" style="pointer-events: none;"></i></span>`;
}
