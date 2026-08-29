export const TOOLTIPS = {
    ru: {
        secretConception: "При включении зачатие происходит тайно: кубик бросается скрыто без спойлерных уведомлений. В первые недели цикл отображается как обычно, симптомы и плод/яйца скрыты в UI и промпте. Беременность раскрывается при проверке или автоматически со временем (для яиц — на 3-й неделе из-за их плотности).",
        irregularCycle: "Включает естественные колебания цикла (от -1 до +12 дней). Создает реалистичные задержки без беременности, имитируя гормональные колебания.",
        mode: "«Реализм» — стандартный человеческий женский цикл (40 акушерских недель). «ОмегаВерс» — течка с 1-го дня цикла, срок 36 недель и мужская беременность. «Яйцекладка» — бисексуальное драконье вынашивание 2–7 яиц в яйцеводе (6 недель), завершающееся кладкой и высиживанием.",
        physiology: "Биологическое строение персонажа. В Реализме — Женщина. В Омегаверсе — Женщина-Омега и Мужчина-Омега. В Яйцекладке — Женщина и Мужчина (оба имеют клоаку и яйцевод для вынашивания).",
        aiAwareness: "«Современность» — поэтапное раскрытие (УЗИ/пальпация). «Средневековье» — число детей/яиц и особенности скрыты до родов/кладки. «Всеведение» — боту сразу открыты все параметры с момента зачатия.",
        contraception: "Метод защиты. «Презерватив» снижает шанс до ~2%, «КОК» до 0.1%, «ВМС» до 0.2%. Без защиты в фертильное окно шанс максимален.",
        fetalPathology: "Включает шанс возникновения патологий развития, дефектов скорлупы или замирания.",
        rpDate: "Текущая дата в сюжете ролевой игры (форматы ДД.ММ.ГГГГ, ISO или текст).",
        cycleLength: "Базовая длительность цикла в днях (по умолчанию 28).",
        periodDuration: "Количество дней кровотечения при менструации, течки у омег или гона у драконидов.",
        maxWeeks: "Максимальный срок вынашивания плода/кладки (40 нед. для Реализма, 36 для Омегаверса, 6 для Яйцекладки)."
    },
    en: {
        secretConception: "When enabled, conception occurs secretly without spoiler notifications. Early weeks show regular cycle, hiding symptoms and fetus/eggs from UI and AI. Discovered via check or automatically over time (week 3 for eggs due to tactile firmness).",
        irregularCycle: "Enables natural cycle fluctuations (-1 to +12 days), simulating realistic cycle delays.",
        mode: "«Realism» — human female cycle (40 weeks). «OmegaVerse» — heat on day 1, 36-week term, male pregnancy. «Oviposition» — draconis egg gestation (6 weeks in oviduct, 2-7 eggs clutch), followed by laying and nest brooding.",
        physiology: "Biological anatomy. In Realism — Female. In Omegaverse — F-Omega/M-Omega. In Oviposition — Female/Male (both possess oviduct and cloaca for laying).",
        aiAwareness: "«Modernity» — phased discovery via scans/palpation. «Medieval (Blind)» — headcount and features hidden until birth/laying. «Omniscience» — AI knows all parameters immediately.",
        contraception: "Birth control method: Condom (~2%), Pills (0.1%), IUD (0.2%), None (highest chance).",
        fetalPathology: "Enables congenital anomalies, shell calcification defects, or embryonic arrest.",
        rpDate: "In-character roleplay date (supports DD.MM.YYYY, ISO, and natural text).",
        cycleLength: "Base cycle duration in days (default 28).",
        periodDuration: "Duration of menstrual bleeding, Omega heat, or Draconis rut window.",
        maxWeeks: "Full gestation term (40 wks for Realism, 36 for Omegaverse, 6 for Oviposition)."
    }
};

export function getTooltipHtml(key, lang = 'ru') {
    const l = (lang === 'en') ? 'en' : 'ru';
    const text = TOOLTIPS[l]?.[key] || TOOLTIPS['ru']?.[key] || '';
    return `<span class="repro-tooltip-btn repro-tooltip-icon" data-tip="${text.replace(/"/g, '&quot;')}" title="${text.replace(/"/g, '&quot;')}" style="display: inline-flex; align-items: center; justify-content: center; padding: 4px 7px; margin-left: 6px; cursor: pointer; color: #f472b6; opacity: 0.85; z-index: 5; position: relative; font-size: 0.9em; touch-action: manipulation; user-select: none;"><i class="fa-solid fa-circle-info" style="pointer-events: none;"></i></span>`;
}
