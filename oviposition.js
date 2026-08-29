// База данных яйцекладки, симптомов, стадий развития яиц и инкубации (нейтральная биология)
export const EGG_SYMPTOMS = {
    ru: {
        oviduct_calcification: [
            "Тянущее распирание глубоко внизу живота (формирование скорлупы)",
            "Повышенная потребность в минералах и кальции (специфический аппетит)",
            "Обильное выделение естественной смазки",
            "Повышение локальной температуры в области низа живота",
            "Легкая скованность при ходьбе"
        ],
        egg_maturation: [
            "Отчетливое ощущение перекатывания твердых яиц внутри яйцевода",
            "Выраженное вздутие и округление нижней части живота",
            "Тяжесть в брюшной полости, мешающая наклоняться",
            "Периодическое мышечное напряжение стенок яйцевода",
            "Быстрая утомляемость из-за веса кладки"
        ],
        pre_laying: [
            "Ритмичные тренировочные спазмы перед кладкой",
            "Сильный инстинкт гнездования (поиск укромного теплого места)",
            "Повышенная температура тела и жар в области живота",
            "Размягчение репродуктивных путей",
            "Отказ от активности, потребность в полном покое и тепле"
        ],
        incubation_care: [
            "Острая родительская привязанность к отложенной кладке",
            "Тревожность и защитная бдительность при приближении к гнезду",
            "Физическая потребность непрерывно согревать яйца теплом тела",
            "Чувствительность к любым перепадам температуры в помещении"
        ],
        oviposition_cycle_heat: [
            "Пульсирующее тепло глубоко внизу живота",
            "Обильная секреция естественной смазки",
            "Повышенная тактильная чувствительность кожи и бедер",
            "Сильное стремление к телесной близости"
        ]
    },
    en: {
        oviduct_calcification: [
            "Deep pelvic tightness and pressure (early shell crystallization)",
            "Strong cravings for calcium-rich food and minerals",
            "Profuse protective lubricating secretions",
            "Localized warmth and increased blood flow in lower abdomen",
            "Mild stiffness in gait and movement"
        ],
        egg_maturation: [
            "Distinct feeling of solid, calcified eggs shifting internally",
            "Noticeable abdominal distension and taut bulge",
            "Heavy abdominal fullness restricting agile bending",
            "Periodic muscular contractions along the oviduct walls",
            "Fatigue from the physical weight of the internal clutch"
        ],
        pre_laying: [
            "Rhythmic pre-oviposition contractions",
            "Overwhelming nesting urge (seeking a warm, safe sanctuary)",
            "Elevated body temperature and brooding warmth",
            "Softening and dilation of reproductive passages",
            "Lethargy and instinctive longing for nest rest"
        ],
        incubation_care: [
            "Intense parental attachment to the laid clutch",
            "Hyper-vigilance and protective care over the nest",
            "Deep physiological drive to brood and warm the eggs with body heat",
            "Acute sensitivity to ambient draft or temperature drops"
        ],
        oviposition_cycle_heat: [
            "Pulsing warmth and swelling sensation in lower abdomen",
            "Profuse natural lubrication",
            "Heightened tactile sensitivity across hips and skin",
            "Intense mating instinct and intimacy-seeking behavior"
        ]
    }
};

export const EGG_STAGES = {
    ru: {
        1: { size: "Мягкие ооциты (~2 см)", weight: "~20 г каждое", belly: "Живот плоский", desc: "1-я неделя. Оплодотворенные клетки опускаются в яйцевод. Начинается послойное формирование оболочки." },
        2: { size: "Формирующаяся скорлупа (~5 см)", weight: "~60 г каждое", belly: "Едва заметная плотность", desc: "2-я неделя. Вокруг зародышей нарастает полутвердая оболочка. На УЗИ четко различимо число яиц." },
        3: { size: "Плотные овалы (~10 см)", weight: "~150 г каждое", belly: "Легкое вздутие низа живота", desc: "3-я неделя. Скорлупа минерализуется и твердеет. Яйца начинают отчетливо прощупываться пальцами." },
        4: { size: "Твердые яйца (~18 см)", weight: "~300 г каждое", belly: "Заметно округленный плотный живот", desc: "4-я неделя. Яйца приобрели финальную твердость. Живот натянут, очертания яиц слегка выпирают." },
        5: { size: "Крупные яйца (~25 см)", weight: "~500 г каждое", belly: "Тяжелый, сильно натянутый живот", desc: "5-я неделя. Кладка занимает весь объем яйцевода. Появляется сильный инстинкт подготовки гнезда." },
        6: { size: "Зрелая кладка (25–35 см)", weight: "~700–900 г каждое", belly: "Огромный раздутый живот, готовый к кладке", desc: "6-я неделя. Вынашивание завершено. Мышцы расслаблены, организм готов к откладке яиц." }
    },
    en: {
        1: { size: "Soft Oocytes (~2 cm)", weight: "~20g each", belly: "Flat abdomen", desc: "Week 1. Fertilized cells enter oviduct. Initial shell deposition begins." },
        2: { size: "Forming Shells (~5 cm)", weight: "~60g each", belly: "Subtle firmness", desc: "Week 2. Semi-rigid shell forms. Ultrasound clearly detects exact egg count." },
        3: { size: "Firm Ovoids (~10 cm)", weight: "~150g each", belly: "Mild lower abdominal bulge", desc: "Week 3. Shell calcification hardens. Individual egg contours can be felt manually." },
        4: { size: "Hardened Eggs (~18 cm)", weight: "~300g each", belly: "Firm, rounded, visible bulge", desc: "Week 4. Shells reach full structural rigidity. Abdominal wall is noticeably taut and rounded." },
        5: { size: "Large Eggs (~25 cm)", weight: "~500g each", belly: "Heavy, visibly distended belly", desc: "Week 5. Full clutch fills pelvic space. Powerful brooding instincts emerge." },
        6: { size: "Mature Clutch (25–35 cm)", weight: "~700–900g each", belly: "Maximum distension, ready to lay", desc: "Week 6. Internal term complete. Body is primed for oviposition." }
    }
};

export const INCUBATION_STAGES = {
    ru: {
        20: { stage: "Ранняя инкубация", desc: "Эмбрионы формируют кровеносную сеть внутри желтка. Кладка требует стабильного тепла (30–34°C)." },
        45: { stage: "Активное развитие", desc: "Сквозь скорлупу на просвет (овоскопия) видны контуры тела, движение эмбрионов и биение сердца." },
        70: { stage: "Финальная зрелость (Готовность к вылуплению)", desc: "Детеныши полностью развиты, поглотили желток и начинают пробивать скорлупу изнутри." }
    },
    en: {
        20: { stage: "Early Brooding", desc: "Embryos establish vascular networks inside yolk sacs. Requires steady thermal warmth (30–34°C)." },
        45: { stage: "Mid Incubation", desc: "Candling reveals developing silhouettes, embryo movements, and heartbeats." },
        70: { stage: "Full Maturity (Hatching Primed)", desc: "Hatchlings fully formed, yolk absorbed. First pips appear on shell surfaces." }
    }
};

export const EGG_PATHOLOGIES = {
    ru: [
        { id: "thin_shell", type: "prenatal", discoveryWeek: 2, name: "Хрупкая скорлупа (Гипоминерализация)", desc: "Дефицит минерализации: скорлупа хрупкая, высокий риск повреждения при вынашивании." },
        { id: "egg_binding", type: "prenatal", discoveryWeek: 5, name: "Дистоция (Застревание яйца)", desc: "Крупное яйцо спазмировало проход. Требуется помощь или ручное извлечение." },
        { id: "candling_dead_embryo", type: "incubation", discoveryWeek: 0, name: "Замерший зародыш (Остановка развития)", desc: "Замирание зародыша в яйце из-за переохлаждения или сбоя развития." },
        { id: "shell_microfracture", type: "incubation", discoveryWeek: 0, name: "Микротрещина скорлупы", desc: "Нарушение целостности скорлупы, требующее запечатывания." },
        { id: "weak_hatchling", type: "postnatal", discoveryWeek: 0, name: "Слабый эмбриональный тонус", desc: "Детеныш не может самостоятельно пробить скорлупу, требуется помощь при вылуплении." }
    ],
    en: [
        { id: "thin_shell", type: "prenatal", discoveryWeek: 2, name: "Fragile Shell (Hypomineralization)", desc: "Mineral deficiency resulting in brittle, vulnerable eggshell walls." },
        { id: "egg_binding", type: "prenatal", discoveryWeek: 5, name: "Egg Binding (Dystocia)", desc: "An oversized egg causes temporary spasm. Requires gentle manual assistance." },
        { id: "candling_dead_embryo", type: "incubation", discoveryWeek: 0, name: "Arrested Embryo", desc: "Embryonic developmental arrest from thermal deficit or biological failure." },
        { id: "shell_microfracture", type: "incubation", discoveryWeek: 0, name: "Shell Microfracture", desc: "Compromised shell integrity risking dehydration of the inner membrane." },
        { id: "weak_hatchling", type: "postnatal", discoveryWeek: 0, name: "Hatching Weakness", desc: "Hatchling lacks strength to crack through the shell unaided." }
    ]
};

export function getEggStageData(weeks, lang = 'ru') {
    const l = (lang === 'en') ? 'en' : 'ru';
    const pool = EGG_STAGES[l] || EGG_STAGES['ru'];
    const clampedWeek = Math.max(1, Math.min(6, weeks || 1));
    return pool[clampedWeek] || pool[1];
}

export function getIncubationStageData(days, lang = 'ru') {
    const l = (lang === 'en') ? 'en' : 'ru';
    const pool = INCUBATION_STAGES[l] || INCUBATION_STAGES['ru'];
    const milestones = Object.keys(pool).map(Number).sort((a, b) => a - b);
    for (const d of milestones) {
        if (days <= d) return pool[d];
    }
    return pool[70];
}

export function getEggPathology(id, lang = 'ru') {
    if (!id) return null;
    const l = (lang === 'en') ? 'en' : 'ru';
    const pool = EGG_PATHOLOGIES[l] || EGG_PATHOLOGIES['ru'];
    return pool.find(p => p.id === id) || null;
}
