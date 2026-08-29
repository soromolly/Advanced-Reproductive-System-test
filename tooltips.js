export const TOOLTIPS = {
    ru: {
        common: {
            rpDate: "Текущая дата в сюжете ролевой игры. Поддерживает форматы ДД.ММ.ГГГГ, ISO и текстовые даты любого века.",
            cycleLength: "Базовая длительность цикла в днях.",
            periodDuration: "Длительность фазы кровотечения / течки / овуляторного пика в днях.",
            maxWeeks: "Максимальный срок вынашивания в теле до родов или откладки яиц."
        },
        realism: {
            secretConception: "При включении зачатие происходит тайно: кубик бросается скрыто без спойлерных уведомлений. В первые недели цикл отображается как обычно, симптомы и плод скрыты в UI и промпте. Беременность раскрывается при проведении теста/проверки на задержке или автоматически со временем.",
            irregularCycle: "Включает естественные колебания цикла (от -1 до +12 дней). Создает реалистичные задержки без беременности, имитируя гормональные сбои и стресс.",
            mode: "«Реализм» — стандартный женский цикл (40 акушерских недель, овуляция за 14 дней до месячных). «ОмегаВерс» — течка с 1-го дня цикла, пик фертильности, срок 36 недель и мужская беременность. «Яйцекладка» — созревание яиц в теле (6 нед.) и высиживание в гнезде (70 дней).",
            physiology: "Биологическое строение персонажа. В Реализме доступна только Женщина (вагинальное зачатие).",
            aiAwareness: "«Современность» — поэтапное раскрытие по клиническим скринингам: двойня/тройня на 12 нед., пол на 20 нед., а патологии — по индивидуальным срокам их выявления (11–21 нед.). «Средневековье» — пол, число детей и пороки скрыты до родов, определение беременности позже, а аборт невозможен после 12 нед. «Всеведение» — боту сразу открыты все параметры плода с момента зачатия.",
            contraception: "Метод защиты от беременности. «Презерватив» снижает шанс до ~2%, «КОК (таблетки)» — до 0.1%, «ВМС (спираль)» — до 0.2%. Без защиты в фертильное окно шанс максимален.",
            fetalPathology: "Шанс возникновения врожденных патологий или замирания беременности (1-й трим: ~10%, 2-й: ~1.5%, 3-й: <0.5%). Данные скрыты от игрока и ИИ до момента их выявления на скрининге или выкидыша."
        },
        omegaverse: {
            secretConception: "При включении зачатие происходит тайно: кубик бросается скрыто без спойлерных уведомлений. В первые недели состояние отображается как обычно, симптомы раскрываются тестом или со временем.",
            irregularCycle: "Включает естественные колебания между циклами течки (от -1 до +12 дней), имитируя гормональные колебания.",
            mode: "«ОмегаВерс» — течка с 1-го дня цикла, пик фертильности, срок вынашивания 36 недель и возможность мужской беременности.",
            physiology: "Биологическое строение омеги: Женщина-Омега (вагинальное зачатие) и Мужчина-Омега (анальное зачатие с естественной обильной смазкой).",
            aiAwareness: "«Современность» — поэтапное раскрытие на скринингах (число на 12 нед, пол и вторичный статус Альфа/Бета/Омега на 20 нед). «Средневековье» — всё скрыто до родов. «Всеведение» — боту всё известно с момента зачатия.",
            contraception: "Метод защиты от беременности. «Презерватив» снижает шанс до ~2%, блокаторы течки — до 0.1%, барьерные спирали — до 0.2%.",
            fetalPathology: "Шанс возникновения врожденных особенностей или замирания плода в утробе."
        },
        oviposition: {
            secretConception: "При включении зачатие происходит тайно: оплодотворение и ранняя минерализация скорлупы протекают скрытно. Начиная со 2-й недели яйца отвердевают и становятся отчетливо прощупываемыми через живот.",
            irregularCycle: "Включает естественные колебания длительности цикла покоя и наступления фертильного периода.",
            mode: "«Яйцекладка» — созревание кладки из 2–7 яиц в теле (6 недель вынашивания), после чего происходит откладка яиц в гнездо и высиживание/инкубация до вылупления (70 дней).",
            physiology: "Анатомическое строение: как Женщина, так и Мужчина обладают эластичным яйцеводом и способны вынашивать и откладывать яйца.",
            aiAwareness: "«Современность» — на УЗИ со 2-й недели видно точное количество яиц, но пол и тонкие пороки закрыты скорлупой до поздней инкубации или вылупления. «Средневековье» — число яиц узнается только при кладке, пол и особенности — при вылуплении. «Всеведение» — ИИ знает все параметры кладки сразу.",
            contraception: "Метод защиты от оплодотворения яиц (барьерные средства, контрацептивы, блокаторы).",
            fetalPathology: "Шанс возникновения патологий скорлупы (хрупкость, дистоция), замирания зародышей при инкубации или врожденных особенностей детенышей."
        }
    },
    en: {
        common: {
            rpDate: "In-character roleplay date. Supports DD.MM.YYYY, ISO, and natural textual dates across any era.",
            cycleLength: "Base reproductive cycle duration in days.",
            periodDuration: "Duration of menstrual bleeding / heat / fertile window in days.",
            maxWeeks: "Maximum internal carrying duration in weeks before birth or oviposition."
        },
        realism: {
            secretConception: "When enabled, conception occurs secretly: dice rolls are hidden without spoiler notifications. Early weeks show regular cycle, hiding symptoms and fetus from UI and AI prompt. Discovered via test/check or automatically over time.",
            irregularCycle: "Enables natural cycle fluctuations (-1 to +12 days). Simulates realistic pregnancy scares, hormonal delays, and stress.",
            mode: "«Realism» — human female cycle (40 obstetric weeks, ovulation 14 days before menses). «OmegaVerse» — Heat begins on Day 1, 36-week gestation, and male pregnancy. «Oviposition» — internal clutch (6 wks) and nest incubation (70 days).",
            physiology: "Biological reproductive anatomy. In Realism, only Female is available (vaginal conception).",
            aiAwareness: "«Modernity» — phased clinical discovery: multiples at 12 wks, fetal sex at 20 wks, and anomalies at their clinical detection milestones (11–21 wks). «Medieval (Blind)» — sex, headcount, and pathologies hidden until delivery. «Omniscience» — AI is aware of all fetal parameters from conception.",
            contraception: "Birth control method. «Condom» reduces chance to ~2%, «Oral Pills» to 0.1%, «IUD» to 0.2%. Unprotected intercourse during fertility peak carries the highest conception chance.",
            fetalPathology: "Enables congenital anomalies and missed miscarriages (1st tri: ~10%, 2nd: ~1.5%, 3rd: <0.5%). Kept completely secret until screening discovery or loss."
        },
        omegaverse: {
            secretConception: "When enabled, conception is rolled secretly. Early gestation remains hidden until pregnancy test confirmation or physical discovery.",
            irregularCycle: "Enables natural fluctuations between heat cycles (-1 to +12 days).",
            mode: "«OmegaVerse» — Heat starts on Day 1, 36-week gestation, male pregnancy support, and Alpha/Beta/Omega dynamics.",
            physiology: "Omega anatomy: Female Omega (vaginal conception) and Male Omega (anal conception with profuse natural self-lubrication).",
            aiAwareness: "«Modernity» — phased ultrasound discovery (count at 12 wks, sex and dynamic rank at 20 wks). «Medieval» — hidden until delivery. «Omniscience» — AI knows everything from day one.",
            contraception: "Contraceptive method. Condom reduces chance to ~2%, heat suppressants/pills to 0.1%, IUD to 0.2%.",
            fetalPathology: "Enables congenital anomalies and pregnancy demise risks."
        },
        oviposition: {
            secretConception: "When enabled, conception is secret. Early shell calcification begins quietly. By week 2, hardened eggs become firmly palpable through the abdomen.",
            irregularCycle: "Enables natural cycle fluctuations between fertile oviduct windows.",
            mode: "«Oviposition» — clutch of 2-7 eggs forming internally (6 weeks gestation), followed by laying into a nest and brooding/incubation (70 days).",
            physiology: "Reproductive anatomy: both Female and Male possess an elastic internal oviduct and are capable of carrying and laying eggs.",
            aiAwareness: "«Modernity» — scans detect exact egg count early, but internal sex/details remain shielded by calcified shells until late incubation or hatching. «Medieval» — headcount confirmed at laying; sex and traits upon hatching. «Omniscience» — AI knows all clutch parameters immediately.",
            contraception: "Birth control method (barriers, oral suppressants, blockers).",
            fetalPathology: "Enables shell calcification defects, incubation cooling arrest risks, and congenital traits."
        }
    }
};

export function getTooltipHtml(key, lang = 'ru', mode = 'realism') {
    const l = (lang === 'en') ? 'en' : 'ru';
    const currentMode = mode || 'realism';
    const text = TOOLTIPS[l]?.[currentMode]?.[key] || TOOLTIPS[l]?.common?.[key] || TOOLTIPS[l]?.realism?.[key] || TOOLTIPS['ru']?.[currentMode]?.[key] || '';
    return `<span class="repro-tooltip-btn repro-tooltip-icon" data-tip="${text.replace(/"/g, '&quot;')}" title="${text.replace(/"/g, '&quot;')}" style="display: inline-flex; align-items: center; justify-content: center; padding: 4px 7px; margin-left: 6px; cursor: pointer; color: #f472b6; opacity: 0.85; z-index: 5; position: relative; font-size: 0.9em; touch-action: manipulation; user-select: none;"><i class="fa-solid fa-circle-info" style="pointer-events: none;"></i></span>`;
}
