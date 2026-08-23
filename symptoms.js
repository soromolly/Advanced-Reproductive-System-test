// База данных симптомов цикла и беременности (RU / EN)
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
        3: { size: "Крошечная песчинка", weight: "Менее 0.05 г", belly: "Живот незаметен", desc: "3-я акушерская неделя. Активная фаза имплантации. Бластоциста внедряется в эндометрий матки. Возможны покалывания или розовые капли крови." },
        4: { size: "Маковое зёрнышко", weight: "Менее 0.1 г", belly: "Живот незаметен", desc: "Эмбрион надежно закрепился в маточной полости. Закладываются три зародышевых листка для будущих органов. Появляется обостренное обоняние." },
        5: { size: "Кунжутное семечко", weight: "Около 0.2 г", belly: "Живот незаметен", desc: "Начинает формироваться нервная трубка плода. Его крошечное сердце делает самые первые, едва заметные сокращения. Накатывает утренняя тошнота." },
        6: { size: "Чечевичное зёрнышко", weight: "Около 0.5 г", belly: "Живот незаметен", desc: "Сердцебиение плода уже можно четко зафиксировать при ультразвуковом сканировании. Формируются зачатки будущих ручек, ножек и глазных впадин." },
        7: { size: "Ягода черники", weight: "Около 0.8 г", belly: "Живот незаметен", desc: "Стремительно развиваются полушария головного мозга. На зачатках конечностей начинают намечаться микроскопические пальчики. Грудь сильно наливается." },
        8: { size: "Ягода малины", weight: "Около 1 г", belly: "Живот незаметен", desc: "Закладываются основные суставы и внутренние органы. Эмбрион начинает совершать первые хаотичные движения, неощутимые снаружи. Токсикоз на пике." },
        9: { size: "Ягода винограда", weight: "Около 2 г", belly: "Живот незаметен", desc: "Эмбриональный хвостик полностью исчезает. Лицо приобретает человеческие черты, формируются вкусовые сосочки на языке. Укрепляется костная ткань." },
        10: { size: "Ягода клубники", weight: "Около 4 г", belly: "Живот незаметен", desc: "Официальный конец эмбрионального периода — теперь это плод. Все базовые системы органов успешно заложены. Гормональный фон вызывает резкую плаксивость." },
        11: { size: "Брюссельская капуста", weight: "Около 7 г", belly: "Живот незаметен", desc: "Плод активно глотает околоплодные воды, тренируя пищеварительную систему. Начинают формироваться ногтевые пластины и глубокие зачатки зубов." },
        12: { size: "Крупная слива", weight: "Около 15 г", belly: "Едва уловимая округлость", desc: "Конец 1-го триместра. Органы сформированы, плод начинает шевелиться, но это еще не чувствуется." },
        13: { size: "Королевский инжир", weight: "Около 23 г", belly: "Мягкий округлый низ живота", desc: "Начало 2-го триместра. Формируются уникальные отпечатки пальцев и голосовые связки. Плацента полностью берет на себя питание и защиту малыша." },
        14: { size: "Спелый лимон", weight: "Около 43 г", belly: "Небольшой аккуратный бугорок", desc: "Почки плода начинают функционировать, выделяя мочу в амниотическую жидкость. Тело покрывается защитным пушком — лануго. Настроение стабилизируется." },
        15: { size: "Крупное яблоко", weight: "Около 70 г", belly: "Заметный бугорок над лобком", desc: "Кожа плода всё еще тонкая и прозрачная, сквозь неё видны сосуды. Крошечное сердце перекачивает до 23 литров крови в сутки. Растет аппетит." },
        16: { size: "Крупный авокадо", weight: "Около 100 г", belly: "Заметный округлый животик", desc: "Мышцы лица развиты: плод может зажмуриваться и открывать рот. У повторнородящих женщин возможны первые нежные шевеления плода («эффект бабочек»)." },
        17: { size: "Сладкая репа", weight: "Около 140 г", belly: "Живот приподнимается к пупку", desc: "Начинает откладываться подкожная жировая клетчатка плода. Слуховой аппарат развит — малыш вздрагивает внутри матки от резких и громких внешних звуков." },
        18: { size: "Болгарский перец", weight: "Около 190 г", belly: "Отчетливо виден под одеждой", desc: "Шевеления плода становятся регулярными и отчетливыми для всех. Сформировались фаланги пальцев. Матка продолжает активно увеличиваться в размерах." },
        19: { size: "Крупный манго", weight: "Около 240 г", belly: "Живот округляется вперед", desc: "Тело плода покрывается первородной жировой смазкой, защищающей кожу. Развиваются зоны головного мозга, отвечающие за осязание, вкус и зрение." },
        20: { size: "Большой банан", weight: "Около 300 г", belly: "Округлый, выразительный живот", desc: "Экватор (20 недель). Матка находится ровно на уровне пупка. Пинки становятся сильными. Проводится важное скрининговое УЗИ анатомии плода." },
        21: { size: "Крупный грейпфрут", weight: "Около 360 г", belly: "Матка поднимается выше пупка", desc: "Пищеварительная система плода активно усваивает питательные вещества из заглатываемых вод. Кожа живота сильно растягивается, вызывая легкий зуд." },
        22: { size: "Молодой кабачок", weight: "Около 430 г", belly: "Выпирает вперед при наклонах", desc: "Плод активно исследует маточное пространство руками, дергает за пуповину и упирается ножками. На его лице полностью сформировались брови." },
        23: { size: "Крупный баклажан", weight: "Около 500 г", belly: "Заметно стесняет движения", desc: "В легких плода начинает вырабатываться сурфактант для будущего дыхания. Плод может периодически икать, что ощущается как мерные ритмичные толчки." },
        24: { size: "Початок кукурузы", weight: "Около 600 г", belly: "Округлый выпирающий живот", desc: "У плода формируется индивидуальный режим сна и бодрствования. Вес матки начинает вызывать ноющую тяжесть в пояснице при долгой ходьбе." },
        25: { size: "Средняя дыня", weight: "Около 700 г", belly: "Большой, высоко поднятый живот", desc: "Укрепляются кости и суставы плода, расправляются альвеолы в легких. Из-за высокого положения матки у мамы может появляться изжога после еды." },
        26: { size: "Краснокочанная капуста", weight: "Около 800 г", belly: "Тяжелый плотный живот", desc: "Плод впервые приоткрывает веки, глаза полностью сформированы. Его толчки становятся настолько сильными, что могут доставлять дискомфорт ребрам." },
        27: { size: "Головка цветной капусты", weight: "Около 900 г", belly: "Сильно сковывает наклоны", desc: "Начало 3-го триместра. Малыш весит почти килограмм. Активно развивается сетчатка глаз. Появляется одышка при быстром подъеме по лестнице." },
        28: { size: "Мускатная тыква", weight: "Около 1100 г", belly: "Огромный высоко поднятый живот", desc: "Кожа плода постепенно разглаживается, теряя ярко-красный оттенок. Толчки и перемещения малыша видны снаружи невооруженным глазом сквозь одежду." },
        29: { size: "Бутылочная тыква", weight: "Около 1250 г", belly: "Живот подпирает грудную клетку", desc: "Плод учится самостоятельно регулировать температуру своего тела. Матка сильно давит на диафрагму, спать на спине становится тяжело и вредно." },
        30: { size: "Крупный кочан капусты", weight: "Около 1400 г", belly: "Тяжелый, давит на тазовое ложе", desc: "Мозг плода стремительно развивается, покрываясь характерными извилинами. К вечеру в ногах может появляться ощутимая отечность и тяжесть." },
        31: { size: "Свежий кокос", weight: "Около 1600 г", belly: "Максимально натянутая кожа", desc: "Зрачки плода чутко реагируют на свет и темноту сквозь брюшную стенку. Из груди мамы может начать выделяться первые капли густого молозива." },
        32: { size: "Тыква сквош", weight: "Около 1800 г", belly: "Очень большой, мешает обуваться", desc: "Плод занимает финальное положение головой вниз. Периодически возникают безболезненные тренировочные схватки Брэкстона-Хикса (живот каменеет)." },
        33: { size: "Спелый ананас", weight: "Около 2000 г", belly: "Живот мешает спать на боку", desc: "Иммунная система плода активно насыщается антителами от материнского организма. Становится трудно подолгу сидеть или стоять в одной позе." },
        34: { size: "Мускусная дыня", weight: "Около 2200 г", belly: "Живот сильно выпирает вперед", desc: "Защитный пушок лануго начинает постепенно исчезать с тела плода. Кости его черепа остаются мягкими и подвижными для безопасных родов." },
        35: { size: "Дыня канталупа", weight: "Около 2400 г", belly: "Живот натянут до предела", desc: "Малыш занял почти всё свободное место в матке. Вместо резких пинков теперь ощущаются сильные медленные перекаты коленей и локтей под кожей." },
        36: { size: "Большой кочан капусты", weight: "Около 2600 г", belly: "Огромный, упирается в ребра", desc: "Организм плода полностью созрел. Малыш готов к жизни вне матки. Живот может начать понемногу опускаться вниз, облегчая маме дыхание." },
        37: { size: "Зимняя дыня", weight: "Около 2900 г", belly: "Опущен немного вниз", desc: "Беременность считается официально доношенной. Плод делает регулярные тренировочные дыхательные движения грудной клеткой внутри матки." },
        38: { size: "Стебель порея", weight: "Около 3100 г", belly: "Опущен, давит на кости таза", desc: "Завершилось финальное созревание легких и печени плода. Тренировочные схватки становятся более частыми и ощутимыми. Шейка матки готовится." },
        39: { size: "Небольшой арбуз", weight: "Около 3300 г", belly: "Низкий тяжелый живот", desc: "Кишечник плода полностью заполнен первородным калом (меконием). Плод затих и копит силы. Ткани шейки матки интенсивно размягчаются перед родами." },
        40: { size: "Большой арбуз", weight: "Около 3500 г", belly: "Максимальный размер, опущен вниз", desc: "Срок родов подошел к концу (40 недель). Матка колоссально давит на мочевой пузырь, ходить тяжело. Организм находится в полной готовности к схваткам." }
    },
    en: {
        1: { size: "Cell size", weight: "Under 0.01 g", belly: "No visible belly", desc: "1st gestational week. Conception has not yet occurred." },
        2: { size: "Cell size", weight: "Under 0.01 g", belly: "No visible belly", desc: "2nd gestational week. Conception has not yet occurred." },
        3: { size: "Tiny sand grain", weight: "Under 0.05 g", belly: "No visible belly", desc: "3rd gestational week. Active implantation phase. Blastocyst embeds into the uterine lining. Light spotting possible." },
        4: { size: "Poppy seed", weight: "Under 0.1 g", belly: "No visible belly", desc: "Embryo securely attached to uterine wall. Germ layers developing. Olfactory sensitivity begins." },
        5: { size: "Sesame seed", weight: "About 0.2 g", belly: "No visible belly", desc: "Neural tube begins developing. Tiny heart starts its first subtle contractions. Early morning nausea emerges." },
        6: { size: "Lentil grain", weight: "About 0.5 g", belly: "No visible belly", desc: "Heartbeat detectable via ultrasound. Primitive limb buds and eye sockets begin to form." },
        7: { size: "Blueberry", weight: "About 0.8 g", belly: "No visible belly", desc: "Brain hemispheres developing rapidly. Microscopic fingers emerge on limb buds. Breasts swell." },
        8: { size: "Raspberry", weight: "About 1 g", belly: "No visible belly", desc: "Major joints and internal organs forming. Spontaneous, imperceptible movements begin. Morning sickness peaks." },
        9: { size: "Grape", weight: "About 2 g", belly: "No visible belly", desc: "Embryonic tail disappears. Facial features become distinctly human; taste buds start forming." },
        10: { size: "Strawberry", weight: "About 4 g", belly: "No visible belly", desc: "End of embryonic stage; officially a fetus now. All vital organs formed. Hormonal shifts cause mood swings." },
        11: { size: "Brussels sprout", weight: "About 7 g", belly: "No visible belly", desc: "Fetus swallows amniotic fluid, practicing digestion. Tooth buds and tiny nails start developing." },
        12: { size: "Plum", weight: "About 15 g", belly: "Subtle slight roundness", desc: "End of 1st trimester. All systems functioning. Movements remain imperceptible externally." },
        13: { size: "Fig", weight: "About 23 g", belly: "Soft lower belly curve", desc: "Start of 2nd trimester. Unique fingerprints and vocal cords form. Placenta takes over full nourishment." },
        14: { size: "Lemon", weight: "About 43 g", belly: "Small neat bump", desc: "Kidneys produce urine into amniotic sac. Body covered in fine lanugo hair. Mood stabilizes." },
        15: { size: "Apple", weight: "About 70 g", belly: "Noticeable low bump", desc: "Skin remains translucent. Heart pumps up to 23 liters of blood daily. Appetite increases." },
        16: { size: "Avocado", weight: "About 100 g", belly: "Distinct rounded belly", desc: "Facial muscles developed. First gentle flutters (quickening) may be felt. Fetus can squint and frown." },
        17: { size: "Turnip", weight: "About 140 g", belly: "Belly rises towards navel", desc: "Adipose tissue forms. Hearing is developed; fetus can startle at loud, sudden external noises." },
        18: { size: "Bell pepper", weight: "About 190 g", belly: "Clearly visible under clothes", desc: "Kicks and movements become distinct and regular. Uterus expands rapidly." },
        19: { size: "Mango", weight: "About 240 g", belly: "Belly rounds forward", desc: "Vernix caseosa coats skin for protection. Brain areas for senses develop rapidly." },
        20: { size: "Banana", weight: "About 300 g", belly: "Pronounced, round belly", desc: "Halfway mark (20 weeks). Top of uterus reaches navel. Anatomy ultrasound reveals anatomy & sex." },
        21: { size: "Grapefruit", weight: "About 360 g", belly: "Uterus rises above navel", desc: "Digestive system absorbs nutrients from amniotic fluid. Abdominal skin stretches, causing mild itchiness." },
        22: { size: "Zucchini", weight: "About 430 g", belly: "Protrudes noticeably", desc: "Fetus explores the womb, gripping the umbilical cord. Eyebrows and eyelids are fully formed." },
        23: { size: "Eggplant", weight: "About 500 g", belly: "Restricts agile movement", desc: "Surfactant production begins in lungs. Rhythmic hiccups can be felt as repetitive light pulses." },
        24: { size: "Ear of corn", weight: "About 600 g", belly: "Prominent rounded bump", desc: "Sleep-wake cycles emerge. Uterine weight starts causing lower back strain on long walks." },
        25: { size: "Cantaloupe melon", weight: "About 700 g", belly: "High, prominent abdomen", desc: "Bones harden and spine strengthens. Upward pressure causes occasional post-meal heartburn." },
        26: { size: "Red cabbage", weight: "About 800 g", belly: "Heavy, firm abdomen", desc: "Fetal eyes open for the first time. Strong kicks can reach the maternal ribcage." },
        27: { size: "Cauliflower head", weight: "About 900 g", belly: "Significantly limits bending", desc: "Start of 3rd trimester. Fetus reaches ~1kg. Breathlessness occurs on light exertion." },
        28: { size: "Butternut squash", weight: "About 1100 g", belly: "Large, high-riding bump", desc: "Fetal skin smooths out. Movements and rolling limbs are clearly visible through clothing." },
        29: { size: "Acorn squash", weight: "About 1250 g", belly: "Presses against ribcage", desc: "Fetal thermoregulation begins. Diaphragm pressure makes sleeping on back uncomfortable." },
        30: { size: "Head of cabbage", weight: "About 1400 g", belly: "Heavy, low pelvic pressure", desc: "Brain surface furrows into complex folds. Mild swelling and fatigue appear in legs." },
        31: { size: "Coconut", weight: "About 1600 g", belly: "Taut, stretched skin", desc: "Pupils react to external light through the belly wall. First drops of colostrum may leak." },
        32: { size: "Hubbard squash", weight: "About 1800 g", belly: "Very large, hinders shoes", desc: "Fetus usually settles into cephalic (head-down) position. Braxton Hicks tightenings increase." },
        33: { size: "Pineapple", weight: "About 2000 g", belly: "Crowds comfortable sleep", desc: "Maternal antibodies transfer steadily to fetal bloodstream. Prolonged sitting is tiring." },
        34: { size: "Honeydew melon", weight: "About 2200 g", belly: "Protrudes heavily forward", desc: "Lanugo hair sheds into amniotic fluid. Cranial bones remain pliable for birth." },
        35: { size: "Large melon", weight: "About 2400 g", belly: "Tightly stretched to limit", desc: "Space in womb is tight; kicks turn into slow, powerful rolling movements under the skin." },
        36: { size: "Large cabbage", weight: "About 2600 g", belly: "Huge, presses on ribs", desc: "Fetus is nearly mature. Belly may begin lightening (dropping), making breathing easier." },
        37: { size: "Winter melon", weight: "About 2900 g", belly: "Noticeably lower/dropped", desc: "Pregnancy reaches early term. Fetus practices rhythmic chest breathing motions in womb." },
        38: { size: "Leek stalk", weight: "About 3100 g", belly: "Low, heavy pelvic pressure", desc: "Full lung and organ maturity achieved. Pelvic pressure increases as cervix readies for labor." },
        39: { size: "Small watermelon", weight: "About 3300 g", belly: "Low, heavy belly", desc: "Meconium accumulates in bowel. Fetus rests and gathers strength. Cervix softens." },
        40: { size: "Large watermelon", weight: "About 3500 g", belly: "Maximum size, fully dropped", desc: "Full term (40 weeks). Intense pressure on pelvis and bladder. Body is primed for active labor." }
    }
};

export const POSTPARTUM_STAGES = {
    ru: {
        natural: {
            7: { name: "Раннее восстановление (ЕР)", desc: "Тело ломит после колоссальной физической нагрузки. Наблюдаются обильные кровянистые выделения (лохии). Мышцы тазового дна истощены, сидеть и ходить может быть некомфортно из-за микротравм. На 3-5 день активно приходит молоко — грудь сильно наливается, становится горячей и крайне чувствительной." },
            20: { name: "Активное заживление тканей (ЕР)", desc: "Матка интенсивно уменьшается в размерах, вызывая тянущие спазмы (особенно во время кормления ребенка). Лохии становятся светлыми или серозными. Внутренние ткани и возможные швы активно стягиваются. Ощущается сильный дефицит сна и яркое проявление материнского инстинкта." },
            40: { name: "Завершение послеродового периода (ЕР)", desc: "Финал базовой реабилитации. Лохии полностью прекратились, матка вернулась к добеременным размерам. Гормональный фон стабилизировался в режиме лактации. Организм полностью готов к постепенному возвращению к физической активности." }
        },
        c_section: {
            7: { name: "Послеоперационный период (КС)", desc: "Острая боль в области нижней части живота. Каждое движение, кашель или попытка перевернуться задействуют разрезанные мышцы и вызывают резкие спазмы шва. Выделения (лохии) умеренные. Приход молока из-за оперативного вмешательства может задерживаться на 1-2 дня, сопровождаясь гормональным ознобом." },
            20: { name: "Формирование мышечного рубца (КС)", desc: "Внешний шов на коже затянулся, но глубокие слои брюшной стенки и матки все еще уязвимы. Возможен зуд или, наоборот, временное онемение кожи вокруг рубца. Матка сокращается медленнее, сохраняется общая слабость и повышенная утомляемость." },
            40: { name: "Консолидация внутренних швов (КС)", desc: "Рубец окреп и стабилизировался, но внутренние мышечные слои продолжают регенерацию. Острая боль ушла, уступая место редкому покалыванию при перемене погоды или нагрузках. Организм адаптировался, но подъем тяжестей всё еще под строгим ограничением." }
        },
        miscarriage: {
            7: { name: "Реабилитация после прерывания / замирания", desc: "Организм переживает резкий гормональный спад и физический шок. Наблюдаются сильные тянущие спазмы матки и умеренные кровянистые выделения. Ощущается общая слабость, озноб и эмоциональное опустошение. Требуется строгий покой." },
            14: { name: "Постгравидарное восстановление", desc: "Физическое заживление эндометрия завершается. Гормональный фон возвращается к базовому уровню, матка сократилась до нормы. Репродуктивная система готовится к перезапуску цикла." },
            40: { name: "Полное очищение и восстановление", desc: "Репродуктивная система полностью завершила цикл очищения и реабилитации. Организм готов к новому циклу." }
        }
    },
    en: {
        natural: {
            7: { name: "Early Recovery (Vaginal)", desc: "Aching body from intense physical labor. Heavy lochia (postpartum bleeding). Pelvic floor muscles tender and fatigued. Milk comes in around days 3-5, causing hot, sensitive, engorged breasts." },
            20: { name: "Active Tissue Healing (Vaginal)", desc: "Uterus contracts back to normal size with afterpains (especially during nursing). Lochia turns pinkish/white. Maternal bonding deepens despite sleep deprivation." },
            40: { name: "Recovery Completion (Vaginal)", desc: "End of initial recovery phase. Bleeding stopped, uterus back to pre-pregnancy size. Hormones balanced into steady lactation mode. Ready for gentle physical activity." }
        },
        c_section: {
            7: { name: "Postoperative Period (C-Section)", desc: "Sharp incision pain in lower abdomen. Moving, coughing, or rolling over triggers abdominal spasms. Moderate lochia. Milk onset may take 1-2 extra days." },
            20: { name: "Scar Tissue Remodeling (C-Section)", desc: "Outer skin incision healed; deep abdominal layers still recovering. Numbness or tingling around scar. Fatigue remains high." },
            40: { name: "Internal Stitch Consolidation (C-Section)", desc: "Incision stable and firm. Acute pain gone, occasional aching with strain. Heavy lifting still strictly prohibited." }
        },
        miscarriage: {
            7: { name: "Early Loss Recovery", desc: "Body experiences sudden hormonal crash and shock. Uterine cramping as it shrinks, moderate bleeding. Strict rest and gentle emotional care needed." },
            14: { name: "Postgravid Restoration", desc: "Endometrial physical healing nearly complete. Hormonal levels stabilizing, reproductive system ready to restart cycle." },
            40: { name: "Full Reproductive Reset", desc: "Reproductive system fully recovered and cleansed. Uterus healthy. Ready to restart natural menstrual cycle." }
        }
    }
};

export const COMPLICATIONS_POOL = {
    ru: [
        { id: "toxicosis_severe", trimester: 1, name: "Тяжелый токсикоз", curable: true, desc: "Непрекращающаяся тошнота, рвота от любой пищи, сильная слабость и истощение." },
        { id: "miscarriage_threat_early", trimester: 1, name: "Угроза выкидыша (ранний срок)", curable: true, desc: "Тянущие, спазматические боли внизу живота, мажущие кровянистые выделения. Требуется полный покой." },
        { id: "anemia_early", trimester: 1, name: "Железодефицитная анемия", curable: true, desc: "Сильная бледность, постоянное головокружение, потемнение в глазах при резком подъеме." },
        { id: "retrochorial_hematoma", trimester: 1, name: "Ретрохориальная гематома", curable: true, desc: "Частичная отслойка плодного яйца от стенки матки с образованием кровяного сгустка. Требует строгого постельного режима." },
        { id: "hyperemesis_gravidarum", trimester: 1, name: "Чрезмерная рвота беременных", curable: true, desc: "Тяжелая форма интоксикации, приводящая к сильному обезвоживанию организма, потере веса и ацетону в моче. Необходимы капельницы." },
        { id: "low_placentation_early", trimester: 1, name: "Низкое прикрепление хориона", curable: false, desc: "Будущая плацента формируется слишком близко к внутреннему зеву матки. Противопоказаны любые физические нагрузки и близость." },
        { id: "hypertonus", trimester: 2, name: "Гипертонус матки", curable: true, desc: "Живот периодически становится каменным на ощупь, сопровождается ноющей болью в пояснице." },
        { id: "gestational_diabetes", trimester: 2, name: "Гестационный диабет", curable: false, desc: "Постоянная неутолимая жажда, сухость во рту, быстрая утомляемость. Сохраняется до родов." },
        { id: "polyhydramnios", trimester: 2, name: "Многоводие", curable: false, desc: "Размер живота превышает норму для этого срока, ощущение сильного распирания и тяжести." },
        { id: "istmic_cervical_insufficiency", trimester: 2, name: "Истмико-цервикальная недостаточность (ИЦН)", curable: true, desc: "Преждевременное слабое раскрытие шейки матки под весом плода. Требует срочного медицинского наложения швов или установки пессария." },
        { id: "oligohydramnios", trimester: 2, name: "Маловодие", curable: false, desc: "Критический дефицит околоплодных вод. Движения и пинки плода становятся скованными и весьма болезненными для матери." },
        { id: "rh_conflict", trimester: 2, name: "Резус-конфликт плаценты", curable: true, desc: "Иммунологический конфликт между отрицательным резус-фактором матери и положительным резусом плода. Требует инъекции антирезусного иммуноглобулина." },
        { id: "preeclampsia", trimester: 3, name: "Преэклампсия (гестоз)", curable: true, desc: "Сильные отеки ног и лица, головная боль, мушки перед глазами. Опасное состояние." },
        { id: "premature_labor_threat", trimester: 3, name: "Угроза преждевременных родов", curable: true, desc: "Регулярные тянущие боли как при месячных, спазмы матки задолго до 40-й недели." },
        { id: "sciatica", trimester: 3, name: "Защемление седалищного нерва", curable: false, desc: "Острая простреливающая боль в ягодицу или ногу при ходьбе из-за давления веса матки." },
        { id: "symphysitis", trimester: 3, name: "Симфизит (расхождение лона)", curable: false, desc: "Сильное воспаление и расхождение лонного сочленения под влиянием гормона релаксина. Рождает резкую «утиную» походку и боль при подъеме ног." },
        { id: "gestational_pyelonephritis", trimester: 3, name: "Гестационный пиелонефрит", curable: true, desc: "Инфекционное воспаление почек из-за застоя мочи, вызванного сильным давлением тяжелой матки на мочеточники. Сопровождается высокой температурой." },
        { id: "placental_insufficiency", trimester: 3, name: "Фетоплацентарная недостаточность", curable: true, desc: "Нарушение маточно-плацентарного кровотока. Малышу временно не хватает кислорода (гипоксия), из-за чего его шевеления становятся хаотичными или затихают." }
    ],
    en: [
        { id: "toxicosis_severe", trimester: 1, name: "Severe Morning Sickness", curable: true, desc: "Persistent nausea and vomiting, severe fatigue and exhaustion." },
        { id: "miscarriage_threat_early", trimester: 1, name: "Threatened Miscarriage (Early)", curable: true, desc: "Lower abdominal cramping, light spotting. Strict bed rest required." },
        { id: "anemia_early", trimester: 1, name: "Iron Deficiency Anemia", curable: true, desc: "Pale skin, dizziness, dark spots in vision upon sudden standing." },
        { id: "retrochorial_hematoma", trimester: 1, name: "Retrochorial Hematoma", curable: true, desc: "Partial detachment of gestational sac with blood clot. Strict rest needed." },
        { id: "hyperemesis_gravidarum", trimester: 1, name: "Hyperemesis Gravidarum", curable: true, desc: "Severe intractable vomiting leading to dehydration and weight loss. Requires IV therapy." },
        { id: "low_placentation_early", trimester: 1, name: "Low-Lying Chorion", curable: false, desc: "Placenta developing too close to internal os. Physical strain and intimacy restricted." },
        { id: "hypertonus", trimester: 2, name: "Uterine Hypertonus", curable: true, desc: "Belly tightens into a hard knot, accompanied by lower back aches." },
        { id: "gestational_diabetes", trimester: 2, name: "Gestational Diabetes", curable: false, desc: "Constant unquenchable thirst, dry mouth, rapid fatigue until delivery." },
        { id: "polyhydramnios", trimester: 2, name: "Polyhydramnios (Excess Fluid)", curable: false, desc: "Abdomen larger than expected for gestational age, feeling of heavy distension." },
        { id: "istmic_cervical_insufficiency", trimester: 2, name: "Cervical Insufficiency (ICN)", curable: true, desc: "Premature weak opening of cervix under fetal weight. Requires emergency cerclage/pessary." },
        { id: "oligohydramnios", trimester: 2, name: "Oligohydramnios (Low Fluid)", curable: false, desc: "Critical deficit of amniotic fluid. Fetal kicks become stiff and painful." },
        { id: "rh_conflict", trimester: 2, name: "Rh Factor Incompatibility", curable: true, desc: "Immune conflict between Rh-negative mother and Rh-positive fetus. Requires anti-D immunoglobulin." },
        { id: "preeclampsia", trimester: 3, name: "Preeclampsia", curable: true, desc: "Severe swelling of feet and face, high blood pressure, headaches, blurred vision." },
        { id: "premature_labor_threat", trimester: 3, name: "Threatened Preterm Labor", curable: true, desc: "Regular menstrual-like cramps, uterine contractions well before week 40." },
        { id: "sciatica", trimester: 3, name: "Sciatica Nerve Compression", curable: false, desc: "Shooting sharp pain in buttock or leg when walking due to heavy uterine pressure." },
        { id: "symphysitis", trimester: 3, name: "Symphysis Pubis Dysfunction", curable: false, desc: "Painful inflammation and laxity of pubic joint under relaxin. Causes waddling gait." },
        { id: "gestational_pyelonephritis", trimester: 3, name: "Gestational Pyelonephritis", curable: true, desc: "Kidney infection due to urine stagnation from uterine compression. Causes fever and flank pain." },
        { id: "placental_insufficiency", trimester: 3, name: "Placental Insufficiency", curable: true, desc: "Impaired maternal-fetal blood flow. Fetal movements become frantic or quiet down." }
    ]
};

// Полная база патологий плода и новорожденных (Group A - Пренатальные / Group B - Постнатальные)
export const FETAL_DISEASES = {
    ru: [
        // --- Group A: Выявляются на УЗИ (Пренатально с 20-й недели) ---
        { id: "down_syndrome", type: "prenatal", name: "Синдром Дауна (Трисомия 21)", desc: "Генетическая особенность, влияющая на анатомические маркеры лица, тонус мышц и темпы общего развития." },
        { id: "edwards_syndrome", type: "prenatal", name: "Синдром Эдвардса (Трисомия 18)", desc: "Тяжелая хромосомная патология с задержкой развития плода, аномалиями пальцев кистей и пороками сердца." },
        { id: "patau_syndrome", type: "prenatal", name: "Синдром Патау (Трисомия 13)", desc: "Хромосомное нарушение со сложными пороками развития центральной нервной системы, глаз и лицевого черепа." },
        { id: "turner_syndrome", type: "prenatal", name: "Синдром Шерешевского — Тёрнера", desc: "Хромосомная особенность у девочек (моносомия X), влияющая на формирование лимфатической и репродуктивной системы." },
        { id: "cleft_lip", type: "prenatal", name: "Заячья губа (Хейлосхизис)", desc: "Несращение тканей верхней губы. Легко и бесследно корректируется небольшой пластической операцией в первые месяцы жизни." },
        { id: "cleft_palate", type: "prenatal", name: "Волчья пасть (Палатосхизис)", desc: "Анатомическое расщепление верхнего нёба. Требует бережного вскармливания и хирургической коррекции в раннем возрасте." },
        { id: "polydactyly", type: "prenatal", name: "Полидактилия (шестипалость)", desc: "Формирование дополнительного пальчика на ручках или ножках. Абсолютно безвредно и легко удаляется хирургически." },
        { id: "syndactyly", type: "prenatal", name: "Синдактилия", desc: "Врождённое сращение двух или более соседних пальчиков на ручках или ножках." },
        { id: "clubfoot", type: "prenatal", name: "Косолапость (Talipes equinovarus)", desc: "Разворот стопы внутрь из-за натяжения связок. Успешно и мягко выправляется массажем и фиксацией с первых недель жизни." },
        { id: "achondroplasia", type: "prenatal", name: "Ахондроплазия (карликовость)", desc: "Особенность роста трубчатых костей: туловище развивается нормально, а ручки и ножки остаются аккуратно укороченными." },
        { id: "phocomelia", type: "prenatal", name: "Фокомелия", desc: "Редкая аномалия конечностей, при которой ручки или ножки развиваются укороченными («ластовидными»)." },
        { id: "spina_bifida", type: "prenatal", name: "Спина бифида (расщепление позвоночника)", desc: "Неполное закрытие позвоночного канала плода. Требует деликатного родоразрешения и контроля детских нейрохирургов." },
        { id: "anencephaly", type: "prenatal", name: "Анэнцефалия", desc: "Крайне тяжелый дефект нервной трубки с недоразвитием полушарий головного мозга и костей свода черепа." },
        { id: "omphalocele", type: "prenatal", name: "Омпфалоцеле", desc: "Выход части органов брюшной полости в прозрачный грыжевой мешок у основания пуповины. Вправляется операцией после родов." },
        { id: "gastroschisis", type: "prenatal", name: "Гастрошизис", desc: "Небольшой дефект брюшной стенки около пупка, при котором петли кишечника временно находятся снаружи. Корректируется сразу после рождения." },
        { id: "hydrocephalus", type: "prenatal", name: "Врожденная гидроцефалия", desc: "Избыточное скопление спинномозговой жидкости в желудочках мозга, увеличивающее объем головки." },
        { id: "tetralogy_of_fallot", type: "prenatal", name: "Тетрада Фалло", desc: "Сложный порок сердца, сочетающий четыре анатомические особенности. Успешно оперируется кардиохирургами на первом году жизни." },
        { id: "tga", type: "prenatal", name: "Транспозиция магистральных артерий (ТМА)", desc: "Анатомическое переключение главных сосудов сердца. Требует плановой хирургической коррекции в первые дни жизни." },
        { id: "hlhs", type: "prenatal", name: "Синдром гипоплазии левых отделов сердца (СГЛОС)", desc: "Недоразвитие левого желудочка сердца. Требует специализированной многоэтапной помощи детских кардиохирургов." },
        { id: "aortic_coarctation", type: "prenatal", name: "Коарктация аорты", desc: "Сужение главного артериального ствола, затрудняющее ток крови. Эффективно устраняется малоинвазивным вмешательством." },
        { id: "vsd", type: "prenatal", name: "Дефект межжелудочковой перегородки (ДМЖП)", desc: "Крошечное отверстие между желудочками сердца. Небольшие дефекты часто закрываются сами по мере роста малыша." },
        { id: "asd", type: "prenatal", name: "Дефект межпредсердной перегородки (ДМПП)", desc: "Небольшое окно в перегородке между предсердиями. Благоприятная особенность, часто протекающая бессимптомно." },
        { id: "ebstein_anomaly", type: "prenatal", name: "Аномалия Эбштейна", desc: "Смещение трехстворчатого клапана сердца в полость правого желудочка. Требует индивидуального контроля кардиолога." },
        { id: "renal_agenesis", type: "prenatal", name: "Агенезия почек (Синдром Поттера)", desc: "Врожденное отсутствие одной или обеих почек. Односторонняя позволяет жить полной жизнью без ограничений." },
        { id: "polycystic_kidneys", type: "prenatal", name: "Поликистоз почек", desc: "Формирование мелких жидкостных кист в ткани почек, требующее бережного наблюдения детских нефрологов." },
        { id: "hydronephrosis", type: "prenatal", name: "Врожденный гидронефроз", desc: "Расширение почечной лоханки из-за временного затруднения оттока мочи. Часто проходит самостоятельно или легко корректируется." },
        { id: "esophageal_atresia", type: "prenatal", name: "Атрезия пищевода / дуоденальная атрезия", desc: "Врожденная непроходимость верхних отделов ЖКТ. Успешно восстанавливается детскими хирургами в первые сутки." },
        { id: "diaphragmatic_hernia", type: "prenatal", name: "Диафрагмальная грыжа", desc: "Отверстие в диафрагме, через которое органы брюшной полости смещаются в грудную клетку. Вправляется операцией после рождения." },
        { id: "pulmonary_hypoplasia", type: "prenatal", name: "Гипоплазия легких", desc: "Неполный объем легочной ткани плода, требующий деликатной кислородной поддержки малыша в первые дни." },
        { id: "cpam", type: "prenatal", name: "Кистозно-аденоматозный порок легких (КАМЛ)", desc: "Доброкачественное кистозное образование в одном сегменте легкого, подлежащее наблюдению или удалению." },

        // --- Group B: Проявляются только после рождения (Постнатально) ---
        { id: "pda", type: "postnatal", name: "Открытый артериальный проток (ОАП)", desc: "Временный внутриутробный сосуд не закрылся сам после первых вдохов. Легко закрывается медикаментозно в роддоме." },
        { id: "hearing_loss", type: "postnatal", name: "Врожденная тугоухость / Глухота", desc: "Снижение слуха, определяемое неонатальным аудиотестом. Успешно компенсируется слуховыми аппаратами или имплантами." },
        { id: "congenital_cataract", type: "postnatal", name: "Врожденная катаракта / Анофтальмия", desc: "Помутнение хрусталика или особенность строения глаза. Требует ранней оптической или микрохирургической коррекции." },
        { id: "anal_atresia", type: "postnatal", name: "Атрезия ануса", desc: "Врожденное отсутствие естественного анального выхода. Полностью восстанавливается хирургами в первые дни жизни." },
        { id: "albinism", type: "postnatal", name: "Альбинизм (Глазо-кожный)", desc: "Отсутствие меланина: белоснежные волосики, очень светлая кожа и розовато-голубые глаза. Нуждается в защите от яркого солнца." },
        { id: "vitiligo", type: "postnatal", name: "Врождённое витилиго", desc: "Очаговое отсутствие пигмента на коже в виде молочно-белых пятнышек или островков. Полностью безвредно для здоровья." },
        { id: "heterochromia", type: "postnatal", name: "Врождённая гетерохромия", desc: "Разный цвет радужки правого и левого глаза (например, один карий, а другой небесно-голубой). Безвредная изюминка." },
        { id: "waardenburg", type: "postnatal", name: "Синдром Ваарденбурга", desc: "Генетическая особенность: белоснежная прядка волос надо лбом, необычайно яркие льдисто-синие глаза и чуткий слух." },
        { id: "marfan", type: "postnatal", name: "Синдром Марфана (ранние признаки)", desc: "Высокий рост, удлиненные изящные пальчики («паучьи пальцы») и повышенная гибкость суставов." },
        { id: "pku", type: "postnatal", name: "Фенилкетонурия (ФКУ)", desc: "Особенность расщепления аминокислоты фенилаланина (выявляется пяточным тестом). Малышу требуется специальная диета." },
        { id: "cystic_fibrosis", type: "postnatal", name: "Муковисцидоз", desc: "Наследственная особенность секреторных желез, требующая специального ферментного питания и ингаляций." },
        { id: "galactosemia", type: "postnatal", name: "Галактоземия", desc: "Врождённая непереносимость молочного сахара (галактозы). Требует перевода малыша на специальное безлактозное питание." }
    ],
    en: [
        { id: "down_syndrome", type: "prenatal", name: "Down Syndrome (Trisomy 21)", desc: "Genetic condition caused by extra chromosome 21, influencing muscle tone and developmental pace." },
        { id: "edwards_syndrome", type: "prenatal", name: "Edwards Syndrome (Trisomy 18)", desc: "Severe chromosomal disorder involving growth restriction, heart defects, and clenched fingers." },
        { id: "patau_syndrome", type: "prenatal", name: "Patau Syndrome (Trisomy 13)", desc: "Chromosomal abnormality associated with central nervous system, facial, and cardiac anomalies." },
        { id: "turner_syndrome", type: "prenatal", name: "Turner Syndrome (Monosomy X)", desc: "Chromosomal condition in females (single X chromosome), affecting lymphatic and reproductive development." },
        { id: "cleft_lip", type: "prenatal", name: "Cleft Lip (Cheiloschisis)", desc: "Congenital split in the upper lip. Easily and seamlessly repaired with minor pediatric surgery in early infancy." },
        { id: "cleft_palate", type: "prenatal", name: "Cleft Palate (Palatoschisis)", desc: "Opening in the roof of the mouth. Requires specialized feeding bottles and early surgical repair." },
        { id: "polydactyly", type: "prenatal", name: "Polydactyly (Extra Digits)", desc: "Presence of an extra finger or toe. Harmless anatomical feature, readily corrected surgically." },
        { id: "syndactyly", type: "prenatal", name: "Syndactyly (Webbed Digits)", desc: "Congenital fusion or webbing between adjacent fingers or toes." },
        { id: "clubfoot", type: "prenatal", name: "Clubfoot (Talipes equinovarus)", desc: "Inward turning of the foot due to shortened tendons. Gently corrected with physiotherapy and casting." },
        { id: "achondroplasia", type: "prenatal", name: "Achondroplasia (Dwarfism)", desc: "Disproportionate limb development: torso develops normally while limbs remain shortened." },
        { id: "phocomelia", type: "prenatal", name: "Phocomelia", desc: "Rare condition where limbs develop shortened or flipper-like." },
        { id: "spina_bifida", type: "prenatal", name: "Spina Bifida", desc: "Incomplete closure of the fetal neural tube/spine. Managed carefully via pediatric neurosurgery." },
        { id: "anencephaly", type: "prenatal", name: "Anencephaly", desc: "Severe neural tube defect involving absence of a major portion of the brain and cranial vault." },
        { id: "omphalocele", type: "prenatal", name: "Omphalocele", desc: "Protrusion of abdominal organs into the base of the umbilical cord within a protective sac. Surgically repaired." },
        { id: "gastroschisis", type: "prenatal", name: "Gastroschisis", desc: "Defect in the abdominal wall beside the navel where intestines protrude. Repaired immediately after birth." },
        { id: "hydrocephalus", type: "prenatal", name: "Congenital Hydrocephalus", desc: "Buildup of cerebrospinal fluid within brain ventricles, managed via shunt placement." },
        { id: "tetralogy_of_fallot", type: "prenatal", name: "Tetralogy of Fallot", desc: "Complex heart condition involving 4 anatomical features, surgically corrected during early infancy." },
        { id: "tga", type: "prenatal", name: "Transposition of the Great Arteries (TGA)", desc: "Switch of the two main heart arteries, corrected via arterial switch surgery in the first days of life." },
        { id: "hlhs", type: "prenatal", name: "Hypoplastic Left Heart Syndrome (HLHS)", desc: "Underdevelopment of the left side of the heart, managed via staged pediatric cardiac surgeries." },
        { id: "aortic_coarctation", type: "prenatal", name: "Coarctation of the Aorta", desc: "Narrowing of the aorta restricting blood flow, corrected via catheterization or minor surgery." },
        { id: "vsd", type: "prenatal", name: "Ventricular Septal Defect (VSD)", desc: "Small opening in the wall separating the ventricles. Frequently closes on its own as the baby grows." },
        { id: "asd", type: "prenatal", name: "Atrial Septal Defect (ASD)", desc: "Small opening between the heart's upper chambers. Usually benign and well-tolerated." },
        { id: "ebstein_anomaly", type: "prenatal", name: "Ebstein's Anomaly", desc: "Downward displacement of the tricuspid valve into the right ventricle, monitored by pediatric cardiologists." },
        { id: "renal_agenesis", type: "prenatal", name: "Renal Agenesis (Potter Syndrome)", desc: "Congenital absence of one or both kidneys. Single kidney allows a normal, healthy life." },
        { id: "polycystic_kidneys", type: "prenatal", name: "Polycystic Kidney Disease", desc: "Presence of small fluid-filled cysts in renal tissue, monitored by pediatric nephrologists." },
        { id: "hydronephrosis", type: "prenatal", name: "Congenital Hydronephrosis", desc: "Enlargement of the kidney pelvis due to fluid buildup. Often resolves spontaneously." },
        { id: "esophageal_atresia", type: "prenatal", name: "Esophageal / Duodenal Atresia", desc: "Congenital discontinuity of the upper gastrointestinal tract, repaired surgically in the first days." },
        { id: "diaphragmatic_hernia", type: "prenatal", name: "Diaphragmatic Hernia", desc: "Opening in the diaphragm allowing abdominal contents into the chest cavity, surgically repaired after birth." },
        { id: "pulmonary_hypoplasia", type: "prenatal", name: "Pulmonary Hypoplasia", desc: "Underdeveloped lung tissue volume requiring gentle respiratory support after delivery." },
        { id: "cpam", type: "prenatal", name: "Congenital Pulmonary Airway Malformation (CPAM)", desc: "Benign cystic lung mass monitored and electively treated if necessary." },

        // --- Group B: Postnatal ---
        { id: "pda", type: "postnatal", name: "Patent Ductus Arteriosus (PDA)", desc: "Fetal vessel fails to close naturally after birth. Easily managed with medication in the nursery." },
        { id: "hearing_loss", type: "postnatal", name: "Congenital Hearing Loss / Deafness", desc: "Hearing impairment diagnosed on newborn auditory screening, supported with hearing aids or implants." },
        { id: "congenital_cataract", type: "postnatal", name: "Congenital Cataract / Anophthalmia", desc: "Clouding of the ocular lens or eye structural feature, managed via early pediatric ophthalmology." },
        { id: "anal_atresia", type: "postnatal", name: "Imperforate Anus (Anal Atresia)", desc: "Congenital absence of normal anal opening, surgically restored in the first days of life." },
        { id: "albinism", type: "postnatal", name: "Albinism (Oculocutaneous)", desc: "Absence of melanin: pure white hair, delicate pale skin, and light blue/violet eyes. Requires UV protection." },
        { id: "vitiligo", type: "postnatal", name: "Congenital Vitiligo", desc: "Focal loss of skin pigmentation creating distinct white patches. Harmless cosmetic feature." },
        { id: "heterochromia", type: "postnatal", name: "Congenital Heterochromia", desc: "Different coloration in each iris (e.g. one hazel, one crystal blue). Harmless and striking genetic trait." },
        { id: "waardenburg", type: "postnatal", name: "Waardenburg Syndrome", desc: "Genetic feature causing a white forelock of hair, brilliant pale-blue eyes, and sensitive hearing." },
        { id: "marfan", type: "postnatal", name: "Marfan Syndrome (Early Signs)", desc: "Tall stature, elongated slender fingers (arachnodactyly), and hypermobile joints." },
        { id: "pku", type: "postnatal", name: "Phenylketonuria (PKU)", desc: "Inability to metabolize phenylalanine, diagnosed via newborn heel-prick blood test. Managed with strict diet." },
        { id: "cystic_fibrosis", type: "postnatal", name: "Cystic Fibrosis", desc: "Genetic disorder affecting mucus glands, causing thicker secretions in lungs and digestive tract." },
        { id: "galactosemia", type: "postnatal", name: "Galactosemia", desc: "Inability to process galactose (milk sugar), managed safely with lactose-free infant formula." }
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
    const l = (lang === 'en') ? 'en' : 'ru';
    const pool = FETAL_DISEASES[l] || FETAL_DISEASES['ru'];
    return pool.find(d => d.id === id) || pool[0];
}
