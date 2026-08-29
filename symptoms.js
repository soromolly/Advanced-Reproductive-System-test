import { OVIPOSITION_STAGES, INCUBATION_STAGES, EGG_SPECIFIC_DISEASES } from './oviposition.js';

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
        oviposition_fertile: [
            "Повышение температуры тела и ощущение глубокого тепла внизу живота",
            "Повышенная чувствительность основания хвоста и рогов",
            "Выделение железистой смазки клоакальным отверстием",
            "Выраженный инстинкт поиска безопасного и теплого места",
            "Острое желание тактильного контакта и наполнения тракта"
        ],
        oviposition_gravid_early: [
            "Ощущение плотной тяжести в нижнем отделе яйцевода",
            "Тяга к пище, богатой кальцием и минералами",
            "Повышенная сонливость и потребность в покое",
            "Легкое натяжение мышц брюшной стенки"
        ],
        oviposition_gravid_late: [
            "Выраженная тяжесть и распирание в брюшной полости",
            "Отчетливое перекатывание твердых яиц при изменении позы",
            "Сильный инстинкт гнездования (стремление обустроить теплое гнездо)",
            "Замедленная походка, необходимость частых остановок для отдыха",
            "Периодические ритмичные сокращения гладкой мускулатуры яйцевода"
        ],
        preg_trimester_1: [
            "Утренняя тошнота (ранний токсикоз)",
            "Повышенная сонливость и быстрая утомляемость",
            "Острая чувствительность к резким запахам и духам",
            "Внезапная плаксивость и резкие перепады настроения",
            "Повышенная чувствительность и покалывание в груди",
            "Специфические вкусовые капризы"
        ],
        preg_trimester_2: [
            "Внезапный прилив сил и энергии после раннего токсикоза",
            "Повышенный аппетит («надо есть за двоих»)",
            "Легкие, едва уловимые шевеления плода внутри живота",
            "Быстрое потемнение ареол сосков и линии на животе",
            "Периодические судороги в икроножных мышцах по ночам",
            "Легкая заложенность носа без простуды"
        ],
        preg_trimester_3: [
            "Тяжесть и ноющая боль в пояснице при долгой ходьбе",
            "Изжога после еды (плод сильно давит на желудок)",
            "Частые позывы к мочеиспусканию из-за давления матки",
            "Легкая одышка даже при медленном подъеме по лестнице",
            "Периодические тренировочные схватки",
            "Отечность лодыжек и стоп ближе к вечеру"
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
            "Bloating and heaviness in the body"
        ],
        follicular: [
            "Noticeable surge of vitality and physical energy",
            "Clearer skin and a fresh complexion",
            "Feeling of lightness and high stamina",
            "Consistently positive, balanced mood"
        ],
        ovulation: [
            "Sudden burst of energy and strength",
            "Heightened libido and sexual drive",
            "Mild twinges in the lower side",
            "Heightened sense of smell"
        ],
        luteal: [
            "Moderate breast tenderness and swelling",
            "Cravings for sweets and carbs",
            "Mild fluid retention and puffiness",
            "Heightened emotional sensitivity"
        ],
        heat_female: [
            "Dull aching in lower abdomen and lower back",
            "Elevated body temperature (intense internal heat)",
            "Profuse natural lubrication on labia",
            "Hyper-sensitive scent perception",
            "Intense craving for physical intimacy"
        ],
        heat_male: [
            "Dull aching in lower abdomen and lower back",
            "Elevated body temperature (intense internal heat)",
            "Profuse anal self-lubrication",
            "Hyper-sensitive scent perception",
            "Intense craving for physical intimacy"
        ],
        oviposition_fertile: [
            "Elevated body heat and deep warmth in lower pelvic cavity",
            "Acute sensitivity at tail-base and horn ridges",
            "Glandular lubrication secretion around cloacal vent",
            "Instinctive craving for warmth and tract fullness"
        ],
        oviposition_gravid_early: [
            "Dense fullness in the upper oviduct tract",
            "Cravings for calcium and mineral-rich nourishment",
            "Drowsiness and conservation of physical energy",
            "Mild abdominal wall distension"
        ],
        oviposition_gravid_late: [
            "Heavy distension and palpable pressure of hardened clutch",
            "Eggs shifting rhythmically inside the spiral canal",
            "Overwhelming nesting urge to prepare warm enclosure",
            "Slow, deliberate gait due to abdominal weight",
            "Rhythmic smooth muscle prep-contractions in oviduct"
        ],
        preg_trimester_1: [
            "Morning sickness (early nausea)",
            "Excessive sleepiness and rapid fatigue",
            "Sharp sensitivity to strong smells",
            "Sudden tearfulness and mood swings"
        ],
        preg_trimester_2: [
            "Burst of energy following relief of early nausea",
            "Increased appetite ('eating for two')",
            "Gentle, fluttering fetal movements",
            "Darkening of areolas and abdominal linea"
        ],
        preg_trimester_3: [
            "Heaviness and aching in lower back during long walks",
            "Heartburn after meals (fetal pressure on stomach)",
            "Frequent urination due to bladder pressure",
            "Shortness of breath on light exertion"
        ]
    }
};

export const PREGNANCY_STAGES = {
    ru: {
        1: { size: "Размер клетки", weight: "Менее 0.01 г", belly: "Живот незаметен", desc: "1-я акушерская неделя. Фактической беременности еще нет." },
        2: { size: "Размер клетки", weight: "Менее 0.01 г", belly: "Живот незаметен", desc: "2-я акушерская неделя. Фактической беременности еще нет." },
        3: { size: "Крошечная песчинка", weight: "Менее 0.05 г", belly: "Живот незаметен", desc: "3-я акушерская неделя. Активная фаза имплантации в эндометрий." },
        4: { size: "Маковое зёрнышко", weight: "Менее 0.1 г", belly: "Живот незаметен", desc: "Эмбрион надежно закрепился в маточной полости. Закладываются зародышевые листки." },
        5: { size: "Кунжутное семечко", weight: "Около 0.2 г", belly: "Живот незаметен", desc: "Формируется нервная трубка плода, появляются первые сокращения сердца." },
        6: { size: "Чечевичное зёрнышко", weight: "Около 0.5 г", belly: "Живот незаметен", desc: "Сердцебиение четко фиксируется. Формируются зачатки ручек и ножек." },
        8: { size: "Ягода малины", weight: "Около 1 г", belly: "Живот незаметен", desc: "Закладываются основные органы. Первые хаотичные движения плода." },
        12: { size: "Крупная слива", weight: "Около 15 г", belly: "Едва уловимая округлость", desc: "Конец 1-го триместра. Базовые органы сформированы." },
        16: { size: "Крупный авокадо", weight: "Около 100 г", belly: "Заметный округлый животик", desc: "Первые нежные шевеления плода («эффект бабочек»)." },
        20: { size: "Большой банан", weight: "Около 300 г", belly: "Округлый, выразительный живот", desc: "Экватор (20 недель). Скрининговое УЗИ анатомии и пола плода." },
        24: { size: "Початок кукурузы", weight: "Около 600 г", belly: "Округлый выпирающий живот", desc: "У плода формируется индивидуальный режим сна и бодрствования." },
        28: { size: "Мускатная тыква", weight: "Около 1100 г", belly: "Огромный высоко поднятый живот", desc: "Начало 3-го триместра. Толчки видны невооруженным глазом." },
        32: { size: "Тыква сквош", weight: "Около 1800 г", belly: "Очень большой, мешает обуваться", desc: "Плод занимает финальное положение головой вниз." },
        36: { size: "Большой кочан капусты", weight: "Около 2600 г", belly: "Огромный, упирается в ребра", desc: "Организм плода созрел. Доношенный срок в Омегаверсе." },
        40: { size: "Большой арбуз", weight: "Около 3500 г", belly: "Максимальный размер, опущен вниз", desc: "Полный доношенный срок (40 недель). Организм готов к родам." }
    },
    en: {
        1: { size: "Cell size", weight: "Under 0.01 g", belly: "No visible belly", desc: "1st gestational week. Conception has not yet occurred." },
        2: { size: "Cell size", weight: "Under 0.01 g", belly: "No visible belly", desc: "2nd gestational week. Conception has not yet occurred." },
        3: { size: "Tiny sand grain", weight: "Under 0.05 g", belly: "No visible belly", desc: "3rd gestational week. Implantation into uterine wall." },
        4: { size: "Poppy seed", weight: "Under 0.1 g", belly: "No visible belly", desc: "Embryo securely attached. Germ layers developing." },
        5: { size: "Sesame seed", weight: "About 0.2 g", belly: "No visible belly", desc: "Neural tube forming. Tiny primitive heart begins pulsing." },
        6: { size: "Lentil grain", weight: "About 0.5 g", belly: "No visible belly", desc: "Heartbeat detectable via ultrasound. Limb buds appear." },
        8: { size: "Raspberry", weight: "About 1 g", belly: "No visible belly", desc: "Major joints and organs forming. Morning sickness peaks." },
        12: { size: "Plum", weight: "About 15 g", belly: "Subtle slight roundness", desc: "End of 1st trimester. All organ systems functioning." },
        16: { size: "Avocado", weight: "About 100 g", belly: "Distinct rounded belly", desc: "First gentle quickening flutters can be felt." },
        20: { size: "Banana", weight: "About 300 g", belly: "Pronounced, round belly", desc: "Midpoint anatomy ultrasound reveals fetal anatomy & sex." },
        24: { size: "Ear of corn", weight: "About 600 g", belly: "Prominent rounded bump", desc: "Sleep-wake cycles emerge. Lower back strain." },
        28: { size: "Butternut squash", weight: "About 1100 g", belly: "Large, high-riding bump", desc: "3rd trimester. Movements visible through clothing." },
        32: { size: "Hubbard squash", weight: "About 1800 g", belly: "Very large, hinders bending", desc: "Settles into head-down position. Braxton Hicks tightenings." },
        36: { size: "Large cabbage", weight: "About 2600 g", belly: "Huge, presses on ribs", desc: "Full maturity reached for Omegaverse pregnancies." },
        40: { size: "Large watermelon", weight: "About 3500 g", belly: "Maximum size, fully dropped", desc: "Full term (40 weeks). Body primed for active delivery." }
    }
};

export const POSTPARTUM_STAGES = {
    ru: {
        natural: {
            7: { name: "Раннее восстановление (ЕР)", desc: "Тело восстанавливается после родовой нагрузки. Наблюдаются кровянистые выделения (лохии). Мышцы тазового дна истощены." },
            20: { name: "Активное заживление тканей (ЕР)", desc: "Матка интенсивно сокращается до нормы. Лохии светлеют. Ткани активно стягиваются." },
            40: { name: "Завершение послеродового периода (ЕР)", desc: "Финал базовой реабилитации. Матка вернулась к добеременным размерам." }
        },
        c_section: {
            7: { name: "Послеоперационный период (КС)", desc: "Боль в области шва, ограничение подвижности. Матка сокращается под действием препаратов." },
            20: { name: "Формирование мышечного рубца (КС)", desc: "Внешний рубец окреп, глубокие слои продолжают регенерацию." },
            40: { name: "Консолидация внутренних швов (КС)", desc: "Швы полностью стабилизировались. Организм возвращается к активности." }
        },
        oviposition_laying: {
            7: { name: "Посткладочное восстановление", desc: "Спиральный яйцевод и клоака сужаются до состояния покоя. Ощущается легкая мышечная ломота внизу живота и у основания хвоста. Сильная тяга к теплу и гнезду." },
            20: { name: "Стабилизация яйцевода", desc: "Стенки репродуктивного тракта полностью восстановили эластичность. Гормональный фон находится в рефрактерном периоде заботы о кладке." },
            40: { name: "Готовность к новому циклу", desc: "Организм дракона полностью восстановил запас сил и готов к началу следующего репродуктивного цикла." }
        },
        miscarriage: {
            7: { name: "Реабилитация после прерывания", desc: "Организм переживает гормональный спад. Наблюдаются спазмы и слабость." },
            14: { name: "Постгравидарное восстановление", desc: "Физическое заживление завершается. Репродуктивная система готова к перезапуску." },
            40: { name: "Полное очищение и восстановление", desc: "Организм завершил цикл очищения." }
        }
    },
    en: {
        natural: {
            7: { name: "Early Recovery (Vaginal)", desc: "Pelvic floor muscles tender and fatigued. Lochia active. Uterus contracting." },
            20: { name: "Active Tissue Healing (Vaginal)", desc: "Uterus shrinks to normal size. Maternal bonding deepens." },
            40: { name: "Recovery Completion (Vaginal)", desc: "Lochia stopped, uterus back to pre-pregnancy baseline." }
        },
        c_section: {
            7: { name: "Postoperative Period (C-Section)", desc: "Incision tenderness, abdominal spasms upon sudden exertion." },
            20: { name: "Scar Tissue Remodeling (C-Section)", desc: "Outer incision healed, deep layers consolidating." },
            40: { name: "Internal Stitch Consolidation (C-Section)", desc: "Incision stable and firm. Normal activities resuming." }
        },
        oviposition_laying: {
            7: { name: "Post-laying Recovery", desc: "Spiral oviduct and cloacal vent contract back to resting state. Aching at tail-base; intense nesting/brooding instinct." },
            20: { name: "Oviduct Stabilization", desc: "Tract tissues fully recovered elasticity. Hormones stabilized in brooding mode." },
            40: { name: "Full Cycle Reset", desc: "Reproductive system fully recharged and ready for subsequent cycles." }
        },
        miscarriage: {
            7: { name: "Early Loss Recovery", desc: "Body experiences sudden hormonal crash. Strict rest required." },
            14: { name: "Postgravid Restoration", desc: "Physical healing nearly complete, hormones normalizing." },
            40: { name: "Full Reproductive Reset", desc: "System cleansed and primed for fresh cycle." }
        }
    }
};

export const COMPLICATIONS_POOL = {
    ru: [
        { id: "toxicosis_severe", trimester: 1, name: "Тяжелый токсикоз", curable: true, desc: "Непрекращающаяся тошнота, слабость и истощение." },
        { id: "miscarriage_threat_early", trimester: 1, name: "Угроза прерывания (ранний срок)", curable: true, desc: "Тянущие спазмы внизу живота, мажущие выделения." },
        { id: "anemia_early", trimester: 1, name: "Анемия", curable: true, desc: "Сильная бледность, головокружение и слабость." },
        { id: "hypertonus", trimester: 2, name: "Гипертонус матки / спазм яйцевода", curable: true, desc: "Живот периодически становится каменным на ощупь с ноющей болью." },
        { id: "gestational_diabetes", trimester: 2, name: "Гестационный диабет", curable: false, desc: "Постоянная жажда, сухость во рту, быстрая утомляемость." },
        { id: "preeclampsia", trimester: 3, name: "Преэклампсия", curable: true, desc: "Сильные отеки, головная боль, мушки перед глазами." }
    ],
    en: [
        { id: "toxicosis_severe", trimester: 1, name: "Severe Sickness", curable: true, desc: "Persistent nausea and vomiting, severe fatigue." },
        { id: "miscarriage_threat_early", trimester: 1, name: "Threatened Loss (Early)", curable: true, desc: "Lower abdominal cramping, spotting. Bed rest required." },
        { id: "anemia_early", trimester: 1, name: "Iron Deficiency Anemia", curable: true, desc: "Pale skin, dizziness, exhaustion." },
        { id: "hypertonus", trimester: 2, name: "Tract Hypertonus / Spasms", curable: true, desc: "Belly tightens into a hard knot, accompanied by aches." },
        { id: "gestational_diabetes", trimester: 2, name: "Gestational Diabetes", curable: false, desc: "Unquenchable thirst, fatigue until delivery." },
        { id: "preeclampsia", trimester: 3, name: "Preeclampsia", curable: true, desc: "Severe swelling, blood pressure spikes, blurred vision." }
    ]
};

export const FETAL_DISEASES = {
    ru: [
        { id: "down_syndrome", type: "prenatal", discoveryWeek: 11, abortionIndicated: true, name: "Синдром Дауна (Трисомия 21)", desc: "Хромосомная особенность, выявляемая на УЗИ." },
        { id: "spina_bifida", type: "prenatal", discoveryWeek: 12, abortionIndicated: true, name: "Спина бифида (расщепление позвоночника)", desc: "Дефект позвоночного канала." },
        { id: "cleft_lip", type: "prenatal", discoveryWeek: 13, abortionIndicated: false, name: "Заячья губа (Хейлосхизис)", desc: "Несращение верхней губы. Успешно оперируется после рождения." },
        { id: "polydactyly", type: "prenatal", discoveryWeek: 14, abortionIndicated: false, name: "Полидактилия (шестипалость)", desc: "Дополнительный пальчик. Легко удаляется хирургически." },
        { id: "clubfoot", type: "prenatal", discoveryWeek: 16, abortionIndicated: false, name: "Косолапость", desc: "Подворот стопы. Выправляется массажем и фиксацией." },
        { id: "heterochromia", type: "postnatal", discoveryWeek: 0, abortionIndicated: false, name: "Врождённая гетерохромия", desc: "Разный цвет радужки глаз. Эстетическая особенность." },
        { id: "albinism", type: "postnatal", discoveryWeek: 0, abortionIndicated: false, name: "Альбинизм", desc: "Белоснежные волосы/чешуя и светлые глаза." },
        ...EGG_SPECIFIC_DISEASES.ru
    ],
    en: [
        { id: "down_syndrome", type: "prenatal", discoveryWeek: 11, abortionIndicated: true, name: "Down Syndrome", desc: "Genetic condition diagnosed on ultrasound/screening." },
        { id: "spina_bifida", type: "prenatal", discoveryWeek: 12, abortionIndicated: true, name: "Spina Bifida", desc: "Neural tube defect." },
        { id: "cleft_lip", type: "prenatal", discoveryWeek: 13, abortionIndicated: false, name: "Cleft Lip", desc: "Upper lip defect repaired easily in infancy." },
        { id: "polydactyly", type: "prenatal", discoveryWeek: 14, abortionIndicated: false, name: "Polydactyly (Extra Digits)", desc: "Extra finger or claw." },
        { id: "clubfoot", type: "prenatal", discoveryWeek: 16, abortionIndicated: false, name: "Clubfoot", desc: "Inward turned foot corrected postnatally." },
        { id: "heterochromia", type: "postnatal", discoveryWeek: 0, abortionIndicated: false, name: "Heterochromia", desc: "Different colored irises." },
        { id: "albinism", type: "postnatal", discoveryWeek: 0, abortionIndicated: false, name: "Albinism", desc: "Melanin absence in skin/scales." },
        ...EGG_SPECIFIC_DISEASES.en
    ]
};

export function getFetusData(weeks, mode = 'realism', lang = 'ru') {
    const l = (lang === 'en') ? 'en' : 'ru';
    if (mode === 'oviposition') {
        const pool = OVIPOSITION_STAGES[l] || OVIPOSITION_STAGES['ru'];
        const milestones = Object.keys(pool).map(Number).sort((a, b) => b - a);
        for (const week of milestones) {
            if (weeks >= week) return pool[week];
        }
        return pool[1];
    }
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
    
    let startWeek = 2;
    if (trimester === 1) startWeek = Math.floor(Math.random() * 3) + 1;
    else if (trimester === 2) startWeek = Math.floor(Math.random() * 3) + 3;
    else if (trimester === 3) startWeek = 5;

    return { id: selected.id, curable: selected.curable, triggerWeek: startWeek, isDiscovered: false };
}

export function getComplication(id, lang = 'ru') {
    const l = (lang === 'en') ? 'en' : 'ru';
    const pool = COMPLICATIONS_POOL[l] || COMPLICATIONS_POOL['ru'];
    return pool.find(c => c.id === id) || COMPLICATIONS_POOL['ru'].find(c => c.id === id);
}

export function getRandomFetalDiseaseId(isEgg = false) {
    const pool = isEgg ? EGG_SPECIFIC_DISEASES['ru'] : FETAL_DISEASES['ru'];
    const selected = pool[Math.floor(Math.random() * pool.length)];
    return selected.id;
}

export function getFetalDisease(id, lang = 'ru') {
    if (!id) return null;
    const l = (lang === 'en') ? 'en' : 'ru';
    const pool = FETAL_DISEASES[l] || FETAL_DISEASES['ru'];
    return pool.find(d => d.id === id) || pool[0];
}
