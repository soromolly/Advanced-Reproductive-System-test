import { OVIPOSITION_SYMPTOMS, EGG_PATHOLOGIES } from './oviposition.js';

export const SYMPTOMS = {
    ru: {
        menstruation: [
            "Тянущая боль внизу живота",
            "Легкая утомляемость и сонливость",
            "Повышенный аппетит (тяга к сладкому или соленому)",
            "Раздражительность и резкая смена настроения",
            "Легкая головная боль",
            "Повышенная чувствительность груди",
            "Отечность и ощущение тяжести в теле",
            "Апатия и нежелание активно двигаться"
        ],
        follicular: [
            "Ощутимый прилив бодрости и физической энергии",
            "Улучшение состояния кожи, свежий цвет лица",
            "Легкость во всем теле и высокая выносливость",
            "Стабильно позитивное и ровное настроение",
            "Повышение социальной активности и общительности",
            "Ускорение обмена веществ, легкий аппетит"
        ],
        ovulation: [
            "Внезапный прилив сил и энергии",
            "Заметное усиление либидо",
            "Легкое покалывание в боку (овуляторный синдром)",
            "Обострение обоняния (чувствительность к запахам)",
            "Улучшение настроения, уверенность в себе",
            "Легкое покалывание в области поясницы"
        ],
        luteal: [
            "Умеренное нагрубание и чувствительность молочных желез",
            "Тяга к сладкому и углеводам (проявления ПМС)",
            "Легкая отечность тканей и задержка жидкости",
            "Повышенная эмоциональная чувствительность и плаксивость",
            "Снижение общего тонуса, желание больше спать",
            "Внезапная быстрая утомляемость к концу дня"
        ],
        heat_female: [
            "Тянущая боль внизу живота и пояснице",
            "Повышенная температура тела (ощущение внутреннего жара)",
            "Обильное выделение естественной смазки на половых губах",
            "Острая восприимчивость к запахам (поиск феромонов Альфы)",
            "Приливы жара и повышенная чувствительность кожи",
            "Сильное, непреодолимое желание телесного контакта"
        ],
        heat_male: [
            "Тянущая боль внизу живота и пояснице",
            "Повышенная температура тела (ощущение внутреннего жара)",
            "Обильное выделение смазки (самосмазывание ануса)",
            "Острая восприимчивость к запахам (поиск феромонов Альфы)",
            "Приливы жара и повышенная чувствительность кожи",
            "Сильное, непреодолимое желание телесного контакта"
        ],
        rut_oviposition: OVIPOSITION_SYMPTOMS.ru.fertile_oviposition,
        gravid_oviposition_early: OVIPOSITION_SYMPTOMS.ru.gravid_early,
        gravid_oviposition_late: OVIPOSITION_SYMPTOMS.ru.gravid_late,
        preg_trimester_1: [
            "Утренняя тошнота (ранний токсикоз)",
            "Повышенная сонливость и быстрая утомляемость",
            "Острая чувствительность к резким запахам и духам",
            "Внезапная плаксивость и резкие перепады настроения",
            "Повышенная чувствительность и покалывание в груди",
            "Специфические вкусовые капризы (хочется странных сочетаний пищи)"
        ],
        preg_trimester_2: [
            "Внезапный прилив сил и энергии после раннего токсикоза",
            "Повышенный аппетит («надо есть за двоих»)",
            "Легкие, едва уловимые шевеления плода внутри живота",
            "Быстрое потемнение ареол сосков и линии на животе",
            "Периодические судороги в икроножных мышцах по ночам",
            "Легкая заложенность носа без простуды (ринит беременных)"
        ],
        preg_trimester_3: [
            "Тяжесть и ноющая боль в пояснице при долгой ходьбе",
            "Изжога после еды (плод сильно давит на желудок)",
            "Частые позывы к мочеиспусканию из-за давления матки",
            "Легкая одышка даже при медленном подъеме по лестнице",
            "Периодические тренировочные схватки (живот каменеет на пару секунд)",
            "Отечность лодыжек и стоп ближе к вечеру",
            "Трудности с поиском удобной позы для сна из-за размеров живота"
        ]
    },
    en: {
        menstruation: [
            "Dull pulling ache in lower abdomen",
            "Mild fatigue and sleepiness",
            "Increased appetite (cravings for sweet or salty foods)",
            "Irritability and sudden mood swings",
            "Mild headache",
            "Tender, sensitive breasts",
            "Bloating and heaviness in the body",
            "Lethargy and reluctance to engage in physical activity"
        ],
        follicular: [
            "Noticeable surge of vitality and physical energy",
            "Clearer skin and a fresh complexion",
            "Feeling of lightness and high stamina",
            "Consistently positive, balanced mood",
            "Increased sociability and openness",
            "Faster metabolism and moderate appetite"
        ],
        ovulation: [
            "Sudden burst of energy and strength",
            "Heightened libido and sexual drive",
            "Mild twinges in the lower side (mittelschmerz)",
            "Heightened sense of smell",
            "Elevated mood and self-confidence",
            "Slight tingling in the lower back"
        ],
        luteal: [
            "Moderate breast tenderness and swelling",
            "Cravings for sweets and carbs (PMS symptoms)",
            "Mild fluid retention and puffiness",
            "Heightened emotional sensitivity and tearfulness",
            "Lower energy levels and increased need for sleep",
            "Sudden fatigue towards the end of the day"
        ],
        heat_female: [
            "Dull aching in lower abdomen and lower back",
            "Elevated body temperature (intense internal heat)",
            "Profuse natural lubrication on labia",
            "Hyper-sensitive scent perception (seeking Alpha pheromones)",
            "Hot flashes and hyper-sensitive skin",
            "Intense, overwhelming craving for physical intimacy"
        ],
        heat_male: [
            "Dull aching in lower abdomen and lower back",
            "Elevated body temperature (intense internal heat)",
            "Profuse self-lubrication (anal self-lubrication)",
            "Hyper-sensitive scent perception (seeking Alpha pheromones)",
            "Hot flashes and hyper-sensitive skin",
            "Intense, overwhelming craving for physical intimacy"
        ],
        rut_oviposition: OVIPOSITION_SYMPTOMS.en.fertile_oviposition,
        gravid_oviposition_early: OVIPOSITION_SYMPTOMS.en.gravid_early,
        gravid_oviposition_late: OVIPOSITION_SYMPTOMS.en.gravid_late,
        preg_trimester_1: [
            "Morning sickness (early nausea)",
            "Excessive sleepiness and rapid fatigue",
            "Sharp sensitivity to strong smells and perfumes",
            "Sudden tearfulness and mood swings",
            "Breast tenderness and tingling sensations",
            "Unusual food cravings and strange taste preferences"
        ],
        preg_trimester_2: [
            "Burst of energy following relief of early nausea",
            "Increased appetite ('eating for two')",
            "Gentle, fluttering fetal movements (quickening)",
            "Darkening of areolas and appearance of linea nigra",
            "Occasional nighttime calf cramps",
            "Mild nasal congestion without a cold (pregnancy rhinitis)"
        ],
        preg_trimester_3: [
            "Heaviness and aching in lower back during long walks",
            "Heartburn after meals (fetal pressure on stomach)",
            "Frequent urination due to bladder pressure",
            "Shortness of breath even during slow stair climbing",
            "Occasional Braxton Hicks contractions (belly tightening briefly)",
            "Swelling in ankles and feet towards the evening",
            "Difficulty finding a comfortable sleeping position due to belly size"
        ]
    }
};

export const PREGNANCY_STAGES = {
    ru: {
        1: { size: "Размер клетки", weight: "Менее 0.01 г", belly: "Живот незаметен", desc: "1-я акушерская неделя. Фактической беременности еще нет." },
        2: { size: "Размер клетки", weight: "Менее 0.01 г", belly: "Живот незаметен", desc: "2-я акушерская неделя. Фактической беременности еще нет." },
        3: { size: "Крошечная песчинка", weight: "Менее 0.05 г", belly: "Живот незаметен", desc: "3-я акушерская неделя. Активная фаза имплантации." },
        4: { size: "Маковое зёрнышко", weight: "Менее 0.1 г", belly: "Живот незаметен", desc: "Эмбрион надежно закрепился в маточной полости." },
        6: { size: "Чечевичное зёрнышко", weight: "Около 0.5 г", belly: "Живот незаметен", desc: "Сердцебиение плода фиксируется на УЗИ." },
        8: { size: "Ягода малины", weight: "Около 1 г", belly: "Живот незаметен", desc: "Закладываются основные органы, токсикоз на пике." },
        12: { size: "Крупная слива", weight: "Около 15 г", belly: "Едва уловимая округлость", desc: "Конец 1-го триместра. Органы сформированы." },
        16: { size: "Крупный авокадо", weight: "Около 100 г", belly: "Заметный округлый животик", desc: "Первые нежные шевеления плода." },
        20: { size: "Большой банан", weight: "Около 300 г", belly: "Округлый, выразительный живот", desc: "Экватор. Проводится скрининговое УЗИ анатомии плода." },
        28: { size: "Мускатная тыква", weight: "Около 1100 г", belly: "Огромный высоко поднятый живот", desc: "Начало 3-го триместра. Толчки видны снаружи." },
        36: { size: "Большой кочан капусты", weight: "Около 2600 г", belly: "Огромный, упирается в ребра", desc: "Организм плода созрел. Живот опускается вниз." },
        40: { size: "Большой арбуз", weight: "Около 3500 г", belly: "Максимальный размер, опущен вниз", desc: "Полная готовность к активным родам." }
    },
    en: {
        1: { size: "Cell size", weight: "Under 0.01 g", belly: "No visible belly", desc: "1st gestational week. Conception not yet occurred." },
        2: { size: "Cell size", weight: "Under 0.01 g", belly: "No visible belly", desc: "2nd gestational week. Conception not yet occurred." },
        3: { size: "Tiny sand grain", weight: "Under 0.05 g", belly: "No visible belly", desc: "3rd gestational week. Implantation phase." },
        4: { size: "Poppy seed", weight: "Under 0.1 g", belly: "No visible belly", desc: "Embryo securely attached to uterine wall." },
        6: { size: "Lentil grain", weight: "About 0.5 g", belly: "No visible belly", desc: "Heartbeat detectable via ultrasound." },
        8: { size: "Raspberry", weight: "About 1 g", belly: "No visible belly", desc: "Major organs forming, nausea peaks." },
        12: { size: "Plum", weight: "About 15 g", belly: "Subtle slight roundness", desc: "End of 1st trimester. All systems functioning." },
        16: { size: "Avocado", weight: "About 100 g", belly: "Distinct rounded belly", desc: "First gentle flutters (quickening)." },
        20: { size: "Banana", weight: "About 300 g", belly: "Pronounced, round belly", desc: "Midpoint (20 weeks). Anatomy ultrasound." },
        28: { size: "Butternut squash", weight: "About 1100 g", belly: "Large, high-riding bump", desc: "Start of 3rd trimester. Strong kicks visible." },
        36: { size: "Large cabbage", weight: "About 2600 g", belly: "Huge, presses on ribs", desc: "Nearly mature fetus. Belly drops." },
        40: { size: "Large watermelon", weight: "About 3500 g", belly: "Maximum size, fully dropped", desc: "Full term (40 weeks). Primed for labor." }
    }
};

export const POSTPARTUM_STAGES = {
    ru: {
        natural: {
            7: { name: "Раннее восстановление (ЕР)", desc: "Тело ломит после колоссальной физической нагрузки. Наблюдаются кровянистые выделения. Мышцы тазового дна истощены." },
            20: { name: "Активное заживление тканей (ЕР)", desc: "Матка интенсивно уменьшается в размерах, вызывая тянущие спазмы. Ткани стягиваются." },
            40: { name: "Завершение послеродового периода (ЕР)", desc: "Лохии прекратились, матка вернулась к норме. Организм готов к активности." }
        },
        c_section: {
            7: { name: "Послеоперационный период (КС)", desc: "Острая боль в области нижней части живота. Мышцы разрезаны, требуется строгий покой." },
            20: { name: "Формирование мышечного рубца (КС)", desc: "Внешний шов затянулся, глубокие слои брюшной стенки восстанавливаются." },
            40: { name: "Консолидация внутренних швов (КС)", desc: "Рубец окреп, организм адаптировался." }
        },
        miscarriage: {
            7: { name: "Реабилитация после прерывания", desc: "Организм переживает гормональный спад. Требуется строгий покой." },
            14: { name: "Постгравидарное восстановление", desc: "Заживление эндометрия завершается. Цикл готовится к перезапуску." },
            40: { name: "Полное очищение и восстановление", desc: "Репродуктивная система готова к новому циклу." }
        }
    },
    en: {
        natural: {
            7: { name: "Early Recovery (Vaginal)", desc: "Aching body from intense labor. Lochia discharge. Pelvic floor recovering." },
            20: { name: "Active Tissue Healing (Vaginal)", desc: "Uterus contracts back to normal size. Internal tissues heal." },
            40: { name: "Recovery Completion (Vaginal)", desc: "Bleeding stopped, uterus restored. Ready for gentle activity." }
        },
        c_section: {
            7: { name: "Postoperative Period (C-Section)", desc: "Sharp incision pain. Strict rest required." },
            20: { name: "Scar Tissue Remodeling (C-Section)", desc: "Incision healing, deep layers regenerating." },
            40: { name: "Internal Stitch Consolidation (C-Section)", desc: "Incision firm, body adapted." }
        },
        miscarriage: {
            7: { name: "Early Loss Recovery", desc: "Hormonal crash, cramps. Emotional and physical rest needed." },
            14: { name: "Postgravid Restoration", desc: "Endometrial healing complete. System ready to restart." },
            40: { name: "Full Reproductive Reset", desc: "Fully recovered. Ready for natural cycle." }
        }
    }
};

export const COMPLICATIONS_POOL = {
    ru: [
        { id: "toxicosis_severe", trimester: 1, name: "Тяжелый токсикоз", curable: true, desc: "Непрекращающаяся тошнота, рвота, сильная слабость." },
        { id: "miscarriage_threat_early", trimester: 1, name: "Угроза выкидыша (ранний срок)", curable: true, desc: "Тянущие боли внизу живота, мажущие выделения. Требуется покой." },
        { id: "hypertonus", trimester: 2, name: "Гипертонус матки", curable: true, desc: "Живот периодически каменеет, ноющая боль в пояснице." },
        { id: "preeclampsia", trimester: 3, name: "Преэклампсия (гестоз)", curable: true, desc: "Сильные отеки, головная боль, мушки перед глазами." }
    ],
    en: [
        { id: "toxicosis_severe", trimester: 1, name: "Severe Morning Sickness", curable: true, desc: "Persistent nausea and vomiting, severe fatigue." },
        { id: "miscarriage_threat_early", trimester: 1, name: "Threatened Miscarriage (Early)", curable: true, desc: "Lower abdominal cramping, light spotting. Strict rest needed." },
        { id: "hypertonus", trimester: 2, name: "Uterine Hypertonus", curable: true, desc: "Belly tightens into a hard knot, lower back aches." },
        { id: "preeclampsia", trimester: 3, name: "Preeclampsia", curable: true, desc: "Severe swelling, high blood pressure, headaches." }
    ]
};

export const FETAL_DISEASES = {
    ru: [
        { id: "down_syndrome", type: "prenatal", discoveryWeek: 11, abortionIndicated: true, name: "Синдром Дауна (Трисомия 21)", desc: "Генетическая особенность (маркеры ТВП 11–13 нед)." },
        { id: "spina_bifida", type: "prenatal", discoveryWeek: 12, abortionIndicated: true, name: "Спина бифида (расщепление позвоночника)", desc: "Дефект позвоночного канала (12–13 нед)." },
        { id: "cleft_lip", type: "prenatal", discoveryWeek: 13, abortionIndicated: false, name: "Заячья губа (Хейлосхизис)", desc: "Несращение верхней губы. Успешно оперируется." },
        { id: "heterochromia", type: "postnatal", discoveryWeek: 0, abortionIndicated: false, name: "Врождённая гетерохромия", desc: "Разный цвет радужки глаз. Эстетическая изюминка." }
    ],
    en: [
        { id: "down_syndrome", type: "prenatal", discoveryWeek: 11, abortionIndicated: true, name: "Down Syndrome (Trisomy 21)", desc: "Genetic condition (NT scan 11–13 wks)." },
        { id: "spina_bifida", type: "prenatal", discoveryWeek: 12, abortionIndicated: true, name: "Spina Bifida", desc: "Neural tube defect (12–13 wks)." },
        { id: "cleft_lip", type: "prenatal", discoveryWeek: 13, abortionIndicated: false, name: "Cleft Lip", desc: "Upper lip opening. Repaired after delivery." },
        { id: "heterochromia", type: "postnatal", discoveryWeek: 0, abortionIndicated: false, name: "Congenital Heterochromia", desc: "Different eye colors. Harmless trait." }
    ]
};

export function getFetusData(weeks, lang = 'ru') {
    const l = (lang === 'en') ? 'en' : 'ru';
    const pool = PREGNANCY_STAGES[l] || PREGNANCY_STAGES['ru'];
    const milestones = Object.keys(pool).map(Number).sort((a, b) => b - a);
    for (const week of milestones) {
        if (weeks >= week) return pool[week];
    }
    return pool[1];
}

export function getPostpartumData(days, method = 'natural', lang = 'ru') {
    const l = (lang === 'en') ? 'en' : 'ru';
    const langPool = POSTPARTUM_STAGES[l] || POSTPARTUM_STAGES['ru'];
    const pool = langPool[method] || langPool['natural'];
    const milestones = Object.keys(pool).map(Number).sort((a, b) => a - b);
    for (const day of milestones) {
        if (days <= day) return pool[day];
    }
    return pool[40] || pool[Object.keys(pool)[Object.keys(pool).length - 1]];
}

export function getRandomSymptomIndices(phase, maxCount = 3) {
    const list = SYMPTOMS['en'][phase] || SYMPTOMS['ru'][phase];
    if (!list || list.length === 0) return [];
    const indices = list.map((_, i) => i).sort(() => 0.5 - Math.random());
    const count = Math.floor(Math.random() * maxCount) + 1;
    return indices.slice(0, count);
}

export function getSymptomList(phase, indices, lang = 'ru') {
    const l = (lang === 'en') ? 'en' : 'ru';
    const list = SYMPTOMS[l]?.[phase] || SYMPTOMS['ru']?.[phase] || [];
    if (!indices || indices.length === 0) return [];
    return indices.map(i => list[i]).filter(Boolean);
}

export function rollComplication(trimester) {
    if (Math.random() * 100 > 20) return null;
    const pool = COMPLICATIONS_POOL['ru'].filter(c => c.trimester === trimester);
    if (!pool || pool.length === 0) return null;
    const selected = pool[Math.floor(Math.random() * pool.length)];
    let startWeek = trimester === 1 ? (Math.floor(Math.random() * 9) + 4) : (trimester === 2 ? (Math.floor(Math.random() * 14) + 13) : (Math.floor(Math.random() * 13) + 27));
    return { id: selected.id, curable: selected.curable, triggerWeek: startWeek, isDiscovered: false };
}

export function getComplication(id, lang = 'ru') {
    const l = (lang === 'en') ? 'en' : 'ru';
    const pool = COMPLICATIONS_POOL[l] || COMPLICATIONS_POOL['ru'];
    return pool.find(c => c.id === id) || COMPLICATIONS_POOL['ru'].find(c => c.id === id);
}

export function getRandomFetalDiseaseId() {
    const pool = FETAL_DISEASES['ru'];
    const selected = pool[Math.floor(Math.random() * pool.length)];
    return selected.id;
}

export function getFetalDisease(id, lang = 'ru') {
    if (!id) return null;
    const l = (lang === 'en') ? 'en' : 'ru';
    const pool = FETAL_DISEASES[l] || FETAL_DISEASES['ru'];
    return pool.find(d => d.id === id) || pool[0];
}
