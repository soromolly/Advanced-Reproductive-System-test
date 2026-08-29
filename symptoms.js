import { EGG_SYMPTOMS, getEggStageData, getEggPathology } from './oviposition.js';

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
        ],
        ...EGG_SYMPTOMS.ru
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
        ],
        ...EGG_SYMPTOMS.en
    }
};

export const PREGNANCY_STAGES = {
    ru: {
        1: { size: "Размер клетки", weight: "Менее 0.01 г", belly: "Живот незаметен", desc: "1-я акушерская неделя. Фактической беременности еще нет." },
        2: { size: "Размер клетки", weight: "Менее 0.01 г", belly: "Живот незаметен", desc: "2-я акушерская неделя. Фактической беременности еще нет." },
        3: { size: "Крошечная песчинка", weight: "Менее 0.05 г", belly: "Живот незаметен", desc: "3-я акушерская неделя. Активная фаза имплантации в эндометрий." },
        4: { size: "Маковое зёрнышко", weight: "Менее 0.1 г", belly: "Живот незаметен", desc: "Эмбрион надежно закрепился в маточной полости." },
        5: { size: "Кунжутное семечко", weight: "Около 0.2 г", belly: "Живот незаметен", desc: "Начинает формироваться нервная трубка плода." },
        6: { size: "Чечевичное зёрнышко", weight: "Около 0.5 г", belly: "Живот незаметен", desc: "Сердцебиение плода фиксируется при ультразвуковом сканировании." },
        7: { size: "Ягода черники", weight: "Около 0.8 г", belly: "Живот незаметен", desc: "Стремительно развиваются полушария головного мозга." },
        8: { size: "Ягода малины", weight: "Около 1 г", belly: "Живот незаметен", desc: "Закладываются основные суставы и внутренние органы." },
        9: { size: "Ягода винограда", weight: "Около 2 г", belly: "Живот незаметен", desc: "Эмбриональный хвостик исчезает, лицо приобретает черты." },
        10: { size: "Ягода клубники", weight: "Около 4 г", belly: "Живот незаметен", desc: "Конец эмбрионального периода — теперь это плод." },
        11: { size: "Брюссельская капуста", weight: "Около 7 г", belly: "Живот незаметен", desc: "Плод активно глотает околоплодные воды." },
        12: { size: "Крупная слива", weight: "Около 15 г", belly: "Едва уловимая округлость", desc: "Конец 1-го триместра. Органы сформированы." },
        13: { size: "Королевский инжир", weight: "Около 23 г", belly: "Мягкий округлый низ живота", desc: "Начало 2-го триместра. Плацента полностью защищает малыша." },
        14: { size: "Спелый лимон", weight: "Около 43 г", belly: "Небольшой аккуратный бугорок", desc: "Почки плода начинают функционировать." },
        15: { size: "Крупное яблоко", weight: "Около 70 г", belly: "Заметный бугорок над лобком", desc: "Кожа тонкая, растет аппетит." },
        16: { size: "Крупный авокадо", weight: "Около 100 г", belly: "Заметный округлый животик", desc: "Первые нежные шевеления («эффект бабочек»)." },
        17: { size: "Сладкая репа", weight: "Около 140 г", belly: "Живот приподнимается к пупку", desc: "Слуховой аппарат развит, слышит звуки." },
        18: { size: "Болгарский перец", weight: "Около 190 г", belly: "Отчетливо виден под одеждой", desc: "Шевеления плода становятся регулярными." },
        19: { size: "Крупный манго", weight: "Около 240 г", belly: "Живот округляется вперед", desc: "Тело покрывается первородной смазкой." },
        20: { size: "Большой банан", weight: "Около 300 г", belly: "Округлый, выразительный живот", desc: "Экватор (20 недель). Скрининговое УЗИ анатомии плода." },
        21: { size: "Крупный грейпфрут", weight: "Около 360 г", belly: "Матка поднимается выше пупка", desc: "Пищеварительная система активно усваивает вещества." },
        22: { size: "Молодой кабачок", weight: "Около 430 г", belly: "Выпирает вперед", desc: "Плод активно двигает ручками и ножками." },
        23: { size: "Крупный баклажан", weight: "Около 500 г", belly: "Заметно стесняет движения", desc: "Плод периодически ритмично икает." },
        24: { size: "Початок кукурузы", weight: "Около 600 г", belly: "Округлый выпирающий живот", desc: "Формируется режим сна и бодрствования." },
        25: { size: "Средняя дыня", weight: "Около 700 г", belly: "Большой, высоко поднятый живот", desc: "Укрепляются кости и суставы." },
        26: { size: "Краснокочанная капуста", weight: "Около 800 г", belly: "Тяжелый плотный живот", desc: "Плод приоткрывает веки, толчки сильные." },
        27: { size: "Головка цветной капусты", weight: "Около 900 г", belly: "Сильно сковывает наклоны", desc: "Начало 3-го триместра. Появляется одышка." },
        28: { size: "Мускатная тыква", weight: "Около 1100 г", belly: "Огромный высоко поднятый живот", desc: "Толчки малыша видны снаружи сквозь одежду." },
        29: { size: "Бутылочная тыква", weight: "Около 1250 г", belly: "Живот подпирает грудную клетку", desc: "Плод учится регулировать температуру." },
        30: { size: "Крупный кочан капусты", weight: "Около 1400 г", belly: "Тяжелый, давит на тазовое ложе", desc: "Мозг плода стремительно развивается." },
        31: { size: "Свежий кокос", weight: "Около 1600 г", belly: "Максимально натянутая кожа", desc: "Зрачки плода чутко реагируют на свет." },
        32: { size: "Тыква сквош", weight: "Около 1800 г", belly: "Очень большой, мешает обуваться", desc: "Плод занимает положение головой вниз." },
        33: { size: "Спелый ананас", weight: "Около 2000 г", belly: "Живот мешает спать на боку", desc: "Иммунная система насыщается антителами." },
        34: { size: "Мускусная дыня", weight: "Около 2200 г", belly: "Живот сильно выпирает вперед", desc: "Пушок лануго начинает исчезать." },
        35: { size: "Дыня канталупа", weight: "Около 2400 г", belly: "Живот натянут до предела", desc: "Сильные медленные перекаты локтей и коленей." },
        36: { size: "Большой кочан капусты", weight: "Около 2600 г", belly: "Огромный, упирается в ребра", desc: "Организм плода созрел. Живот опускается." },
        37: { size: "Зимняя дыня", weight: "Около 2900 г", belly: "Опущен немного вниз", desc: "Беременность официально доношенная." },
        38: { size: "Стебель порея", weight: "Около 3100 г", belly: "Опущен, давит на кости таза", desc: "Легкие и печень созрели. Шейка матки готовится." },
        39: { size: "Небольшой арбуз", weight: "Около 3300 г", belly: "Низкий тяжелый живот", desc: "Плод затих и копит силы перед родами." },
        40: { size: "Большой арбуз", weight: "Около 3500 г", belly: "Максимальный размер, опущен вниз", desc: "Полная готовность к схваткам (40 недель)." }
    },
    en: {
        1: { size: "Cell size", weight: "Under 0.01 g", belly: "No visible belly", desc: "1st gestational week. Conception has not yet occurred." },
        2: { size: "Cell size", weight: "Under 0.01 g", belly: "No visible belly", desc: "2nd gestational week. Conception has not yet occurred." },
        3: { size: "Tiny sand grain", weight: "Under 0.05 g", belly: "No visible belly", desc: "3rd gestational week. Active implantation phase." },
        4: { size: "Poppy seed", weight: "Under 0.1 g", belly: "No visible belly", desc: "Embryo securely attached to uterine wall." },
        5: { size: "Sesame seed", weight: "About 0.2 g", belly: "No visible belly", desc: "Neural tube begins developing." },
        6: { size: "Lentil grain", weight: "About 0.5 g", belly: "No visible belly", desc: "Heartbeat detectable via ultrasound." },
        7: { size: "Blueberry", weight: "About 0.8 g", belly: "No visible belly", desc: "Brain hemispheres developing rapidly." },
        8: { size: "Raspberry", weight: "About 1 g", belly: "No visible belly", desc: "Major joints and internal organs forming." },
        9: { size: "Grape", weight: "About 2 g", belly: "No visible belly", desc: "Embryonic tail disappears." },
        10: { size: "Strawberry", weight: "About 4 g", belly: "No visible belly", desc: "End of embryonic stage; officially a fetus now." },
        11: { size: "Brussels sprout", weight: "About 7 g", belly: "No visible belly", desc: "Fetus swallows amniotic fluid." },
        12: { size: "Plum", weight: "About 15 g", belly: "Subtle slight roundness", desc: "End of 1st trimester. All systems functioning." },
        13: { size: "Fig", weight: "About 23 g", belly: "Soft lower belly curve", desc: "Start of 2nd trimester. Placenta nourishes baby." },
        14: { size: "Lemon", weight: "About 43 g", belly: "Small neat bump", desc: "Kidneys produce urine into amniotic sac." },
        15: { size: "Apple", weight: "About 70 g", belly: "Noticeable low bump", desc: "Skin remains translucent. Appetite increases." },
        16: { size: "Avocado", weight: "About 100 g", belly: "Distinct rounded belly", desc: "First gentle flutters (quickening) felt." },
        17: { size: "Turnip", weight: "About 140 g", belly: "Belly rises towards navel", desc: "Adipose tissue forms. Hearing is active." },
        18: { size: "Bell pepper", weight: "About 190 g", belly: "Clearly visible under clothes", desc: "Kicks and movements become distinct." },
        19: { size: "Mango", weight: "About 240 g", belly: "Belly rounds forward", desc: "Vernix caseosa coats skin for protection." },
        20: { size: "Banana", weight: "About 300 g", belly: "Pronounced, round belly", desc: "Halfway mark (20 weeks). Anatomy ultrasound." },
        21: { size: "Grapefruit", weight: "About 360 g", belly: "Uterus rises above navel", desc: "Digestive system absorbs nutrients." },
        22: { size: "Zucchini", weight: "About 430 g", belly: "Protrudes noticeably", desc: "Fetus explores the womb actively." },
        23: { size: "Eggplant", weight: "About 500 g", belly: "Restricts agile movement", desc: "Rhythmic hiccups can be felt as pulses." },
        24: { size: "Ear of corn", weight: "About 600 g", belly: "Prominent rounded bump", desc: "Sleep-wake cycles emerge." },
        25: { size: "Cantaloupe melon", weight: "About 700 g", belly: "High, prominent abdomen", desc: "Bones harden and spine strengthens." },
        26: { size: "Red cabbage", weight: "About 800 g", belly: "Heavy, firm abdomen", desc: "Fetal eyes open for the first time." },
        27: { size: "Cauliflower head", weight: "About 900 g", belly: "Significantly limits bending", desc: "Start of 3rd trimester. Breathlessness occurs." },
        28: { size: "Butternut squash", weight: "About 1100 g", belly: "Large, high-riding bump", desc: "Movements visible through clothing." },
        29: { size: "Acorn squash", weight: "About 1250 g", belly: "Presses against ribcage", desc: "Fetal thermoregulation begins." },
        30: { size: "Head of cabbage", weight: "About 1400 g", belly: "Heavy, low pelvic pressure", desc: "Brain surface furrows into complex folds." },
        31: { size: "Coconut", weight: "About 1600 g", belly: "Taut, stretched skin", desc: "Pupils react to external light." },
        32: { size: "Hubbard squash", weight: "About 1800 g", belly: "Very large, hinders shoes", desc: "Fetus settles into cephalic position." },
        33: { size: "Pineapple", weight: "About 2000 g", belly: "Crowds comfortable sleep", desc: "Maternal antibodies transfer steadily." },
        34: { size: "Honeydew melon", weight: "About 2200 g", belly: "Protrudes heavily forward", desc: "Lanugo hair sheds into amniotic fluid." },
        35: { size: "Large melon", weight: "About 2400 g", belly: "Tightly stretched to limit", desc: "Space in womb is tight; powerful rolling moves." },
        36: { size: "Large cabbage", weight: "About 2600 g", belly: "Huge, presses on ribs", desc: "Fetus is mature. Belly begins dropping." },
        37: { size: "Winter melon", weight: "About 2900 g", belly: "Noticeably lower/dropped", desc: "Pregnancy reaches early term." },
        38: { size: "Leek stalk", weight: "About 3100 g", belly: "Low, heavy pelvic pressure", desc: "Full lung and organ maturity achieved." },
        39: { size: "Small watermelon", weight: "About 3300 g", belly: "Low, heavy belly", desc: "Fetus rests and gathers strength." },
        40: { size: "Large watermelon", weight: "About 3500 g", belly: "Maximum size, fully dropped", desc: "Full term (40 weeks). Body primed for labor." }
    }
};

export const POSTPARTUM_STAGES = {
    ru: {
        natural: {
            7: { name: "Раннее восстановление", desc: "Тело ломит после физической нагрузки. Лохии и очищение путей. На 3-5 день активно приходит молоко." },
            20: { name: "Активное заживление тканей", desc: "Матка/яйцевод интенсивно сокращается до нормы. Внутренние ткани стягиваются." },
            40: { name: "Завершение периода реабилитации", desc: "Ткани полностью восстановились. Организм готов к новому циклу." }
        },
        oviposition_recovery: {
            3: { name: "Пост-кладковое облегчение", desc: "Мышцы яйцевода сокращаются после выталкивания кладки. Ощущается глубокая легкость и усталость." },
            7: { name: "Полное восстановление яйцевода", desc: "Стенки репродуктивного тракта вернулись в состояние покоя. Слизистая обновлена." }
        },
        c_section: {
            7: { name: "Послеоперационный период (КС)", desc: "Острая боль в области нижней части живота. Шов затягивается." },
            20: { name: "Формирование мышечного рубца (КС)", desc: "Внешний шов зажил, глубокие слои продолжают регенерацию." },
            40: { name: "Консолидация внутренних швов (КС)", desc: "Рубец окреп, организм полностью адаптировался." }
        },
        miscarriage: {
            7: { name: "Реабилитация после прерывания", desc: "Организм переживает гормональный спад. Требуется строгий покой." },
            14: { name: "Постгравидарное восстановление", desc: "Физическое заживление эндометрия завершается." },
            40: { name: "Полное очищение", desc: "Репродуктивная система готова к новому циклу." }
        }
    },
    en: {
        natural: {
            7: { name: "Early Recovery", desc: "Aching body, heavy lochia, pelvic floor tender. Milk comes in around days 3-5." },
            20: { name: "Active Tissue Healing", desc: "Reproductive tract contracting back to normal size." },
            40: { name: "Recovery Completion", desc: "Full tissue recovery. Ready for gentle activity." }
        },
        oviposition_recovery: {
            3: { name: "Post-Laying Relief", desc: "Oviduct muscular walls contract after expelling the clutch. Deep lightness and fatigue." },
            7: { name: "Oviduct Restoration", desc: "Reproductive channel fully rested and restored to basal state." }
        },
        c_section: {
            7: { name: "Postoperative Period (C-Section)", desc: "Incision pain, moving triggers abdominal spasms." },
            20: { name: "Scar Remodeling (C-Section)", desc: "Outer incision healed, deep layers recovering." },
            40: { name: "Stitch Consolidation (C-Section)", desc: "Incision stable and firm." }
        },
        miscarriage: {
            7: { name: "Early Loss Recovery", desc: "Hormonal crash, strict rest needed." },
            14: { name: "Postgravid Restoration", desc: "Endometrial healing nearly complete." },
            40: { name: "Full Reproductive Reset", desc: "Ready to restart natural cycle." }
        }
    }
};

export const COMPLICATIONS_POOL = {
    ru: [
        { id: "toxicosis_severe", trimester: 1, name: "Тяжелый токсикоз", curable: true, desc: "Непрекращающаяся тошнота, рвота, сильная слабость." },
        { id: "miscarriage_threat_early", trimester: 1, name: "Угроза выкидыша (ранний срок)", curable: true, desc: "Тянущие боли внизу живота, мажущие выделения." },
        { id: "anemia_early", trimester: 1, name: "Железодефицитная анемия", curable: true, desc: "Сильная бледность, постоянное головокружение." },
        { id: "hypertonus", trimester: 2, name: "Гипертонус / спазм", curable: true, desc: "Живот становится каменным, сопровождается болью в пояснице." },
        { id: "preeclampsia", trimester: 3, name: "Преэклампсия (гестоз)", curable: true, desc: "Сильные отеки, головная боль, мушки перед глазами." }
    ],
    en: [
        { id: "toxicosis_severe", trimester: 1, name: "Severe Morning Sickness", curable: true, desc: "Persistent nausea and exhaustion." },
        { id: "miscarriage_threat_early", trimester: 1, name: "Threatened Miscarriage (Early)", curable: true, desc: "Lower abdominal cramping, spotting." },
        { id: "anemia_early", trimester: 1, name: "Iron Deficiency Anemia", curable: true, desc: "Pale skin, dizziness, fatigue." },
        { id: "hypertonus", trimester: 2, name: "Hypertonus / Muscle Spasm", curable: true, desc: "Abdomen hardens into a tight knot, lower back strain." },
        { id: "preeclampsia", trimester: 3, name: "Preeclampsia", curable: true, desc: "Severe swelling, blurred vision, high blood pressure." }
    ]
};

export const FETAL_DISEASES = {
    ru: [
        { id: "down_syndrome", type: "prenatal", discoveryWeek: 11, abortionIndicated: true, name: "Синдром Дауна (Трисомия 21)", desc: "Генетическая особенность (маркеры ТВП 11–13 нед)." },
        { id: "edwards_syndrome", type: "prenatal", discoveryWeek: 11, abortionIndicated: true, name: "Синдром Эдвардса (Трисомия 18)", desc: "Тяжелая хромосомная патология." },
        { id: "spina_bifida", type: "prenatal", discoveryWeek: 12, abortionIndicated: true, name: "Спина бифида (расщепление позвоночника)", desc: "Дефект позвоночного канала." },
        { id: "polydactyly", type: "prenatal", discoveryWeek: 14, abortionIndicated: false, name: "Полидактилия (дополнительные пальчики)", desc: "Легко оперируется." },
        { id: "heterochromia", type: "postnatal", discoveryWeek: 0, abortionIndicated: false, name: "Врождённая гетерохромия", desc: "Разный цвет радужки глаз. Безвредная изюминка." },
        { id: "albinism", type: "postnatal", discoveryWeek: 0, abortionIndicated: false, name: "Альбинизм", desc: "Белоснежная кожа и светлые глаза." }
    ],
    en: [
        { id: "down_syndrome", type: "prenatal", discoveryWeek: 11, abortionIndicated: true, name: "Down Syndrome (Trisomy 21)", desc: "Genetic condition." },
        { id: "edwards_syndrome", type: "prenatal", discoveryWeek: 11, abortionIndicated: true, name: "Edwards Syndrome (Trisomy 18)", desc: "Severe chromosomal disorder." },
        { id: "spina_bifida", type: "prenatal", discoveryWeek: 12, abortionIndicated: true, name: "Spina Bifida", desc: "Neural tube defect." },
        { id: "polydactyly", type: "prenatal", discoveryWeek: 14, abortionIndicated: false, name: "Polydactyly (Extra Digits)", desc: "Harmless extra digit." },
        { id: "heterochromia", type: "postnatal", discoveryWeek: 0, abortionIndicated: false, name: "Congenital Heterochromia", desc: "Striking multi-colored irises." },
        { id: "albinism", type: "postnatal", discoveryWeek: 0, abortionIndicated: false, name: "Albinism", desc: "Pure snow-white pigmentation." }
    ]
};

export function getFetusData(weeks, lang = 'ru', mode = 'realism') {
    if (mode === 'oviposition') {
        return getEggStageData(weeks, lang);
    }
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
    
    let startWeek = 4;
    if (trimester === 1) startWeek = Math.floor(Math.random() * 9) + 4;
    else if (trimester === 2) startWeek = Math.floor(Math.random() * 14) + 13;
    else if (trimester === 3) startWeek = Math.floor(Math.random() * 13) + 27;

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
    const eggPath = getEggPathology(id, lang);
    if (eggPath) return eggPath;
    const l = (lang === 'en') ? 'en' : 'ru';
    const pool = FETAL_DISEASES[l] || FETAL_DISEASES['ru'];
    return pool.find(d => d.id === id) || pool[0];
}
