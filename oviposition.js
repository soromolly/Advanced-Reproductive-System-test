// База данных яйцекладки, симптомов, стадий развития яиц и инкубации
export const EGG_SYMPTOMS = {
    ru: {
        oviduct_calcification: [
            "Тянущее распирание глубоко внизу живота (формирование скорлупы)",
            "Повышенная потребность в минералах и кальции (специфический аппетит)",
            "Обильное выделение защитной смазки из клоаки",
            "Повышение локальной температуры в области таза",
            "Легкая скованность при широких шагах"
        ],
        egg_maturation: [
            "Отчетливое ощущение перекатывания твердых яиц внутри яйцевода",
            "Выраженное вздутие и визуальное округление нижней части живота",
            "Тяжесть в брюшной полости, мешающая наклоняться",
            "Периодическое мышечное напряжение стенок яйцевода",
            "Быстрая утомляемость при ходьбе из-за веса кладки"
        ],
        pre_laying: [
            "Ритмичные тренировочные спазмы яйцевода и клоаки",
            "Сильный инстинкт гнездования (поиск укромного теплого места)",
            "Повышенная температура тела и жар в области живота",
            "Размягчение и частое приоткрытие мышечной щели клоаки",
            "Отказ от активности, потребность в покое и тепле"
        ],
        incubation_care: [
            "Острая материнская привязанность к отложенной кладке",
            "Тревожность и защитная агрессия при приближении к гнезду",
            "Физическая потребность непрерывно согревать яйца теплом тела",
            "Чувствительность к любым перепадам температуры в помещении"
        ],
        oviposition_cycle_heat: [
            "Пульсирующее тепло и зуд в области клоаки",
            "Обильная секреция естественной клоакальной смазки",
            "Повышенная тактильная чувствительность рогов, хвоста и бедер",
            "Непреодолимая тяга к телесной близости и наполнению яйцевода"
        ]
    },
    en: {
        oviduct_calcification: [
            "Deep pelvic tightness and pressure (early shell crystallization)",
            "Strong cravings for calcium-rich and mineral food",
            "Profuse protective lubricating secretions from the cloaca",
            "Localized warmth and increased blood flow in lower abdomen",
            "Mild stiffness in gait and hip movements"
        ],
        egg_maturation: [
            "Distinct feeling of solid, calcified eggs shifting in oviduct",
            "Noticeable abdominal distension and taut pelvic bulge",
            "Heavy pelvic fullness restricting agile bending",
            "Periodic muscular contractions along the oviduct walls",
            "Fatigue from the physical ballast of the internal clutch"
        ],
        pre_laying: [
            "Rhythmic pre-oviposition contractions in the oviduct",
            "Overwhelming nesting urge (seeking warm secluded sanctuary)",
            "Elevated core body temperature and brooding warmth",
            "Softening and dilation of the cloacal muscular slit",
            "Lethargy and instinctive longing for nest rest"
        ],
        incubation_care: [
            "Intense parental attachment to the laid clutch",
            "Hyper-vigilance and protective territoriality over the nest",
            "Deep physiological drive to brood and warm the eggs with body heat",
            "Acute sensitivity to ambient draft or temperature drops"
        ],
        oviposition_cycle_heat: [
            "Pulsing warmth and swelling sensation around the cloaca",
            "Profuse cloacal self-lubrication",
            "Heightened tactile sensitivity across base of tail and hips",
            "Intense mating instinct and craving for oviduct filling"
        ]
    }
};

export const EGG_STAGES = {
    ru: {
        1: { size: "Мягкие ооциты (~2 см)", weight: "~20 г каждое", belly: "Живот плоский", desc: "1-я неделя. Оплодотворенные клетки опускаются в верхнюю треть яйцевода. Начинается послойное осаждение минералов." },
        2: { size: "Формирующаяся скорлупа (~5 см)", weight: "~60 г каждое", belly: "Едва заметная плотность", desc: "2-я неделя. Вокруг эмбрионов нарастает полутвердая кожистая оболочка. На УЗИ четко различимо число формирующихся яиц." },
        3: { size: "Плотные овалы (~10 см)", weight: "~150 г каждое", belly: "Легкое вздутие низа живота", desc: "3-я неделя. Скорлупа активно насыщается кальцием и отвердевает. Яйца начинают отчетливо прощупываться пальцами." },
        4: { size: "Кальцинированные яйца (~18 см)", weight: "~300 г каждое", belly: "Заметно округленный плотный живот", desc: "4-я неделя. Яйца приобрели финальную твердость. Живот натянут, очертания яиц слегка выпирают при наклонах." },
        5: { size: "Крупные яйца (~25 см)", weight: "~500 г каждое", belly: "Тяжелый, сильно натянутый живот", desc: "5-я неделя. Кладка занимает весь объем яйцевода. Появляется сильный инстинкт подготовки гнезда." },
        6: { size: "Зрелая кладка (25–35 см)", weight: "~700–900 г каждое", belly: "Огромный раздутый живот, готовый к кладке", desc: "6-я неделя. Финал вынашивания. Клоака размягчена, яйца сместились к выходу. Организм готов к откладке (овипозиции)." }
    },
    en: {
        1: { size: "Soft Oocytes (~2 cm)", weight: "~20g each", belly: "Flat abdomen", desc: "Week 1. Fertilized cells enter upper oviduct. Initial mineral deposition begins." },
        2: { size: "Leathery Shells (~5 cm)", weight: "~60g each", belly: "Subtle pelvic firmness", desc: "Week 2. Semi-rigid leathery matrix forms. Ultrasound clearly detects exact egg headcount." },
        3: { size: "Firm Ovoids (~10 cm)", weight: "~150g each", belly: "Mild lower abdominal bulge", desc: "Week 3. Shell calcification hardens. Distinct individual egg contours can be felt manually." },
        4: { size: "Calcified Eggs (~18 cm)", weight: "~300g each", belly: "Firm, rounded, visible bulge", desc: "Week 4. Shells reach full structural rigidity. Abdominal wall is noticeably taut and rounded." },
        5: { size: "Large Eggs (~25 cm)", weight: "~500g each", belly: "Heavy, visibly distended belly", desc: "Week 5. Full clutch fills pelvic cavity. Powerful brooding instincts take over." },
        6: { size: "Mature Clutch (25–35 cm)", weight: "~700–900g each", belly: "Maximum distension, ready to lay", desc: "Week 6. Internal term complete. Cloacal slit dilated; body primed for oviposition." }
    }
};

export const INCUBATION_STAGES = {
    ru: {
        20: { stage: "Ранняя инкубация", desc: "Эмбрионы формируют кровеносную сеть внутри желтка. Скорлупа требует стабильного обогрева (30–34°C)." },
        45: { stage: "Активный органогенез", desc: "Сквозь скорлупу на просвет (овоскопия) видны контуры тела, движение хвоста и биение сердца." },
        70: { stage: "Финальная зрелость (Готовность к вылуплению)", desc: "Детеныши полностью развиты, поглотили желток и начинают пробивать скорлупу изнутри." }
    },
    en: {
        20: { stage: "Early Brooding", desc: "Embryos establish vascular networks across yolk sacs. Requires steady thermal brooding (30–34°C)." },
        45: { stage: "Mid Incubation & Organogenesis", desc: "Candling reveals developing skeletal silhouette, tail movements, and cardiac rhythm." },
        70: { stage: "Full Maturity (Hatching Primed)", desc: "Hatchlings fully formed, yolk fully absorbed. First internal pips against shell surface." }
    }
};

export const EGG_PATHOLOGIES = {
    ru: [
        // Пренатальные (в утробе/яйцеводе)
        { id: "thin_shell", type: "prenatal", discoveryWeek: 2, name: "Гипокальциноз (Тонкая скорлупа)", desc: "Дефицит минерализации: скорлупа хрупкая, высокий риск раздавливания при вынашивании." },
        { id: "egg_binding", type: "prenatal", discoveryWeek: 5, name: "Дистоция (Застревание яйца)", desc: "Крупное яйцо спазмировало проход яйцевода. Требуется помощь или ручное извлечение." },
        // Инкубационные (выявляются при овоскопии/осмотре яиц)
        { id: "candling_dead_embryo", type: "incubation", discoveryWeek: 0, name: "Замерший эмбрион (Остановка развития)", desc: "Замирание зародыша в яйце из-за температурного сбоя. Свечение скорлупы угасло." },
        { id: "shell_microfracture", type: "incubation", discoveryWeek: 0, name: "Микротрещина скорлупы", desc: "Нарушение герметичности скорлупы, грозящее пересыханием желтка." },
        // При вылуплении
        { id: "weak_hatchling", type: "postnatal", discoveryWeek: 0, name: "Слабый эмбриональный тонус", desc: "Детеныш не может самостоятельно пробить скорлупу, требуется ручная помощь при вылуплении." }
    ],
    en: [
        { id: "thin_shell", type: "prenatal", discoveryWeek: 2, name: "Hypocalcification (Fragile Shell)", desc: "Mineral deficiency resulting in brittle, vulnerable eggshell walls." },
        { id: "egg_binding", type: "prenatal", discoveryWeek: 5, name: "Egg Binding (Oviduct Dystocia)", desc: "An oversized egg causes spasm in oviduct channel. Requires gentle extraction." },
        { id: "candling_dead_embryo", type: "incubation", discoveryWeek: 0, name: "Non-viable / Arrested Embryo", desc: "Embryonic developmental arrest from thermal deficit. Luminescence ceases." },
        { id: "shell_microfracture", type: "incubation", discoveryWeek: 0, name: "Shell Microfracture", desc: "Compromised shell integrity risking dehydration of inner amniotic membrane." },
        { id: "weak_hatchling", type: "postnatal", discoveryWeek: 0, name: "Hatching Weakness", desc: "Hatchling lacks muscular strength to pip through calcified shell unaided." }
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
