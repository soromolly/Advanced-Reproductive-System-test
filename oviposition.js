// База данных развития яиц, симптомов и патологий для режима Яйцекладки
export const EGG_STAGES = {
    ru: {
        1: { size: "5-7 см (Мягкая оболочка)", weight: "~80-120 г (каждое)", belly: "Живот плоский, мягкий", desc: "1-я неделя. Оплодотворенные клетки закрепились в верхнем отделе яйцевода. Начинается послойное отложение белка и кальция." },
        2: { size: "10-14 см (Кожистая структура)", weight: "~250-350 г (каждое)", belly: "Легкая плотность внизу живота", desc: "2-я неделя. Формируется эластичная первичная скорлупа. Повышается температура тела, появляется постоянное чувство приятного тепла внутри." },
        3: { size: "18-22 см (Плотный овал)", weight: "~600-800 г (каждое)", belly: "Округлый, при пальпации ощутимы яйца", desc: "3-я неделя. Скорлупа затвердевает. Яйца четко прощупываются сквозь брюшную стенку в виде гладких твердых овалов." },
        4: { size: "25-30 см (Кристаллический кальций)", weight: "~1.2-1.5 кг (каждое)", belly: "Заметно увеличен, яйца выпирают буграми", desc: "4-я неделя. Полноценная кристаллизация скорлупы. Брюшная полость растянута, движения замедляются, растет аппетит." },
        5: { size: "30-36 см (Зрелая кладка)", weight: "~1.8-2.3 кг (каждое)", belly: "Тяжелый, сильно раздутый живот", desc: "5-я неделя. Яйца занимают весь яйцевод. Ощущается постоянное распирающее давление. Возникает непреодолимый инстинкт обустройства гнезда." },
        6: { size: "35-40 см (Готовность к кладке)", weight: "~2.5-3.0 кг (каждое)", belly: "Максимальный объем, опущен к клоаке", desc: "6-я неделя (Полный срок). Кладка готова к выходу. Мышцы яйцевода ритмично сокращаются, железы клоаки выделяют обильную смазку." }
    },
    en: {
        1: { size: "5-7 cm (Soft Membrane)", weight: "~80-120 g (each)", belly: "Flat and soft abdomen", desc: "1st week. Fertilized cells anchored in upper oviduct. Layered deposition of protein and calcium begins." },
        2: { size: "10-14 cm (Leathery Shell)", weight: "~250-350 g (each)", belly: "Mild firmness in lower abdomen", desc: "2nd week. Elastic leathery shell develops. Internal body temperature rises, creating a soothing inner warmth." },
        3: { size: "18-22 cm (Firm Oval)", weight: "~600-800 g (each)", belly: "Rounded; eggs palpable through skin", desc: "3rd week. Shell hardens noticeably. Distinct firm ovals can easily be felt upon abdominal palpation." },
        4: { size: "25-30 cm (Crystalline Calcium)", weight: "~1.2-1.5 kg (each)", belly: "Heavily distended, visible egg contours", desc: "4th week. Full crystalline calcification. Abdomen expands to hold the clutch; agility drops, appetite surges." },
        5: { size: "30-36 cm (Mature Clutch)", weight: "~1.8-2.3 kg (each)", belly: "Heavy, taut, prominently swollen", desc: "5th week. Clutch occupies entire oviduct. Pronounced internal pressure and a powerful nesting urge emerge." },
        6: { size: "35-40 cm (Full Term / Ready to Lay)", weight: "~2.5-3.0 kg (each)", belly: "Maximum distension, dropped low", desc: "6th week (Full term). Clutch ready for oviposition. Rhythmic oviduct contractions and profuse cloacal lubrication." }
    }
};

export const OVIPOSITION_SYMPTOMS = {
    ru: {
        fertile_oviposition: [
            "Приливы внутреннего жара и повышение температуры тела",
            "Обильное выделение естественной смазки из клоаки",
            "Обостренная тактильная чувствительность рогов, хвоста и шеи",
            "Непреодолимая тяга к телесному теплу и физической близости",
            "Тянущее, пульсирующее ощущение у основания хвоста"
        ],
        gravid_early: [
            "Приятная пульсирующая тяжесть в глубине брюшной полости",
            "Ощущение перекатывания твердых округлых тел внутри тракта",
            "Повышенная потребность во сне и калорийной пище",
            "Обостренная тяга к физическому теплу и уюту"
        ],
        gravid_late: [
            "Сильное распирающее давление в области таза и основания хвоста",
            "Одышка и скованность движений из-за тяжести кладки",
            "Непреодолимый инстинкт гнездования (сбор мягких и теплых вещей)",
            "Периодические спазмы яйцевода (тренировочные сокращения)",
            "Повышенная сонливость и потребность в защите партнера"
        ],
        post_laying: [
            "Глубокое физическое облегчение, сменяющееся сильной мышечной слабостью",
            "Ноющая тянущая боль в яйцеводе и области клоаки",
            "Резкий скачок аппетита для восполнения запасов кальция и энергии",
            "Острая родительская тревожность и защита отложенных яиц в гнезде"
        ]
    },
    en: {
        fertile_oviposition: [
            "Intense internal heat waves and elevated body temperature",
            "Profuse natural lubrication from the cloacal opening",
            "Heightened tactile sensitivity around horns, tail base, and neck",
            "Compelling urge for warmth, bonding, and physical contact",
            "Dull pulsing sensation at the base of the tail"
        ],
        gravid_early: [
            "Pleasant pulsing heaviness deep inside the abdomen",
            "Sensations of firm rounded shapes settling in the oviduct",
            "Increased caloric appetite and need for deep sleep",
            "Heightened craving for thermal warmth and resting comfort"
        ],
        gravid_late: [
            "Intense stretching pressure in pelvis and tail base",
            "Restricted agility and breathlessness from clutch weight",
            "Overwhelming nesting urge (gathering blankets, building nest)",
            "Rhythmic oviduct cramps (pre-laying contractions)",
            "Pronounced lethargy and desire for mate's protection"
        ],
        post_laying: [
            "Profound physical relief shifting into deep muscular fatigue",
            "Dull aching soreness in the oviduct and cloacal tract",
            "Ravenous appetite to restore depleted calcium and energy reserves",
            "Intense protective attachment and vigilance over eggs in the nest"
        ]
    }
};

export const EGG_PATHOLOGIES = {
    ru: [
        { id: "soft_shell", discoveryWeek: 3, name: "Хрупкость скорлупы (Гипокальциемия)", desc: "Недостаточная минерализация скорлупы. Яйца остаются мягкими, риск повреждения при кладке. Требуется усиленное питание." },
        { id: "egg_binding", discoveryWeek: 5, name: "Задержка яйца (Дистоция яйцевода)", desc: "Спазм яйцевода мешает продвижению кладки к клоаке. Требует согревающего массажа и покоя." },
        { id: "thermal_shock", discoveryWeek: 2, name: "Термический шок зародыша", desc: "Переохлаждение яйца внутри тракта. Приводит к замиранию развития одного из эмбрионов." },
        { id: "twin_egg", discoveryWeek: 4, name: "Сросшаяся скорлупа (Двойное яйцо)", desc: "Формирование одного гигантского яйца с двумя зародышами внутри. Увеличивает растяжение при кладке." }
    ],
    en: [
        { id: "soft_shell", discoveryWeek: 3, name: "Soft Shell Defect (Hypocalcemia)", desc: "Insufficient shell calcification. Eggs remain overly pliable, risking deformation during oviposition." },
        { id: "egg_binding", discoveryWeek: 5, name: "Egg Binding (Oviduct Dystocia)", desc: "Muscular oviduct spasm obstructing egg progression. Requires thermal comfort and relaxation." },
        { id: "thermal_shock", discoveryWeek: 2, name: "Embryonic Thermal Arrest", desc: "Prolonged core chill causing non-viability of one egg in the oviduct." },
        { id: "twin_egg", discoveryWeek: 4, name: "Fused Twin Egg", desc: "Two embryos enclosed within a single oversized shell. Causes extra distension during laying." }
    ]
};

export const POST_LAYING_RECOVERY = {
    ru: {
        3: { name: "Острая реабилитация (Дни 1-3)", desc: "Тракт истощен после откладки тяжелой кладки. Мышцы клоаки и яйцевода болезненно сокращаются, возвращаясь в форму. Особь неотлучно сидит на гнезде, обогревая яйца теплом своего тела." },
        7: { name: "Восстановление тонуса (Дни 4-7)", desc: "Болезненность в животе утихает, аппетит нормализуется. Родитель продолжает активное насиживание, покидая кладку лишь на короткое время." },
        28: { name: "Период инкубации кладки (Дни 8-28+)", desc: "Физическое тело полностью восстановилось. Гормональный фон находится в рефрактерном периоде, направленном исключительно на высиживание и обогрев яиц (30-34°C)." }
    },
    en: {
        3: { name: "Acute Post-Laying Recovery (Days 1-3)", desc: "Oviduct and cloaca exhausted from delivering large clutch. Muscle walls actively contracting. Parent remains tightly coiled over eggs for warmth." },
        7: { name: "Tissue Remodeling (Days 4-7)", desc: "Internal soreness subsides, appetite stabilizes. Parent continues vigilant brooding and incubation in the nest." },
        28: { name: "Clutch Brooding Phase (Days 8-28+)", desc: "Full physical recovery. Hormonal system in refractory pause, completely dedicated to clutch incubation (30-34°C)." }
    }
};

export function getEggData(weeks, count = 3, lang = 'ru') {
    const l = (lang === 'en') ? 'en' : 'ru';
    const pool = EGG_STAGES[l] || EGG_STAGES['ru'];
    const w = Math.max(1, Math.min(6, weeks));
    const base = pool[w] || pool[1];
    return {
        size: base.size,
        weight: base.weight,
        belly: `${base.belly} (${count} ${lang === 'en' ? 'eggs' : 'яиц'})`,
        desc: base.desc
    };
}

export function getPostLayingData(days, lang = 'ru') {
    const l = (lang === 'en') ? 'en' : 'ru';
    const pool = POST_LAYING_RECOVERY[l] || POST_LAYING_RECOVERY['ru'];
    const milestones = Object.keys(pool).map(Number).sort((a, b) => a - b);
    for (const d of milestones) {
        if (days <= d) return pool[d];
    }
    return pool[28];
}

export function rollEggPathology() {
    const pool = EGG_PATHOLOGIES['ru'];
    const sel = pool[Math.floor(Math.random() * pool.length)];
    return { id: sel.id, discoveryWeek: sel.discoveryWeek, isDiscovered: false };
}

export function getEggPathology(id, lang = 'ru') {
    if (!id) return null;
    const l = (lang === 'en') ? 'en' : 'ru';
    const pool = EGG_PATHOLOGIES[l] || EGG_PATHOLOGIES['ru'];
    return pool.find(p => p.id === id) || pool[0];
}
