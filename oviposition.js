// База данных стадий вынашивания в яйцеводе, внешней инкубации и патологий яиц (RU / EN)
export const OVIPOSITION_STAGES = {
    ru: {
        1: { size: "Формирование скорлупы (2-4 см)", weight: "Около 30 г (каждое)", belly: "Живот плоский / мягкий", desc: "1-я неделя гравидности. Оплодотворенные клетки покрываются первичными слоями белка и кристаллического кальция в верхнем отделе яйцевода." },
        2: { size: "Мягкое кожистое яйцо (~8 см)", weight: "Около 80 г", belly: "Легкая внутренняя плотность", desc: "2-я неделя. Оболочка яйца уплотняется. Яйцевод начинает вырабатывать естественный смазывающий секрет." },
        3: { size: "Оформленное яйцо (~15 см)", weight: "Около 200 г", belly: "Небольшой аккуратный бугорок", desc: "3-я неделя. Эмбрион внутри яйца начинает активное деление. Живот слегка округляется, появляется выраженная тяга к теплу." },
        4: { size: "Твердеющее яйцо (~22 см)", weight: "Около 400 г", belly: "Заметный округлый живот", desc: "4-я неделя. Скорлупа насыщается кальцием и начинает испускать слабое внутреннее свечение. Движения становятся более плавными." },
        5: { size: "Крупное яйцо (~30 см)", weight: "Около 700 г", belly: "Тяжелый, плотный живот", desc: "5-я неделя. Скорлупа полностью минерализована. Кладка отчетливо прощупывается через брюшную стенку. Походка замедляется." },
        6: { size: "Зрелое яйцо (35-40 см)", weight: "Около 1.1-1.4 кг", belly: "Максимально натянутый, опущенный живот", desc: "6-я неделя (финал вынашивания). Кладка готова к откладке. Мускулатура яйцевода готовится к выталкиванию яиц через клоаку в гнездо." }
    },
    en: {
        1: { size: "Shell Mineralization (2-4 cm)", weight: "About 30g (each)", belly: "Flat / soft abdomen", desc: "1st week of gravidity. Fertilized zygotes are coated in protein layers and calcium crystals in the upper oviduct." },
        2: { size: "Leathery Shell (~8 cm)", weight: "About 80g", belly: "Mild lower firmness", desc: "2nd week. Shell membrane thickens. Oviduct glands secrete protective natural lubricants." },
        3: { size: "Formed Egg (~15 cm)", weight: "About 200g", belly: "Small firm lower bump", desc: "3rd week. Embryonic blastodisc rapidly develops. Lower abdomen rounds outward; nesting warmth cravings begin." },
        4: { size: "Hardening Shell (~22 cm)", weight: "About 400g", belly: "Distinct rounded abdomen", desc: "4th week. Calcium matrix hardens; faint inner luminescent pulse appears under the shell." },
        5: { size: "Large Egg (~30 cm)", weight: "About 700g", belly: "Heavy, taut abdomen", desc: "5th week. Shell is fully mineralized. Eggs are clearly palpable through the abdominal wall. Movement slows." },
        6: { size: "Full-term Clutch (35-40 cm)", weight: "About 1.1-1.4 kg", belly: "Heavy, dropped abdomen", desc: "6th week (Full term). Clutch is primed for oviposition. Oviduct prepares to lay eggs through the cloaca into the nest." }
    }
};

export const INCUBATION_STAGES = {
    ru: {
        early: { name: "Ранняя инкубация (1-4 нед)", desc: "Яйца согреваются в гнезде родителем. Внутри скорлупы формируется сосудистая сеть желточного мешка. Свечение скорлупы равномерное и тихое." },
        mid: { name: "Активный эмбриогенез (5-8 нед)", desc: "Закладываются скелет, хвост и чешуйчатый покров зародышей. Яйца чувствительны к перепадам температур (требуется 30–34°C)." },
        late: { name: "Предвылупное созревание (9-12 нед)", desc: "Детеныши полностью сформированы. Сквозь скорлупу слышны тихие шорохи и постукивания клюва/яйцевого зуба. Скорлупа истончается изнутри." }
    },
    en: {
        early: { name: "Early Incubation (wks 1-4)", desc: "Eggs incubated in the nest by parental warmth (30–34°C). Vascular network spreads across the yolk sac under the pulsing shell." },
        mid: { name: "Active Embryogenesis (wks 5-8)", desc: "Skeletal structure, tail, and primordial scales develop. Constant thermal stability is vital to prevent embryonic arrest." },
        late: { name: "Pre-hatching Maturity (wks 9-12)", desc: "Hatchlings fully formed. Subtle scratching and internal tapping resonate through the thinning crystalline shell." }
    }
};

export const EGG_SPECIFIC_DISEASES = {
    ru: [
        { id: "egg_shell_brittle", type: "egg_incubation", discoveryWeek: 1, abortionIndicated: false, name: "Хрупкость кристаллической скорлупы", desc: "Недостаточная минерализация кальция. Требует предельно осторожного высиживания и минеральных ванн." },
        { id: "egg_mana_dimming", type: "egg_incubation", discoveryWeek: 3, abortionIndicated: true, name: "Угасание свечения зародыша", desc: "Критическое падение жизнеспособности эмбриона в яйце. Требуется интенсивный обогрев и контакт с родителем." },
        { id: "egg_yolk_adhesion", type: "egg_incubation", discoveryWeek: 4, abortionIndicated: false, name: "Спайка зародышевой оболочки", desc: "Эмбрион прилегает слишком близко к стенке скорлупы. Требует регулярного переворачивания кладки в гнезде." },
        { id: "draconic_heterochromia", type: "postnatal", discoveryWeek: 0, abortionIndicated: false, name: "Драконья гетерохромия", desc: "Глаза разного оттенка с вертикальным радужным зрачком. Безвредная родовая метка." },
        { id: "luminescent_scales", type: "postnatal", discoveryWeek: 0, abortionIndicated: false, name: "Фосфоресцирующая чешуя", desc: "Участки чешуи на хвосте и плечах мягко мерцают в темноте." }
    ],
    en: [
        { id: "egg_shell_brittle", type: "egg_incubation", discoveryWeek: 1, abortionIndicated: false, name: "Crystalline Shell Fragility", desc: "Deficient calcium mineral layer. Requires gentle nest handling and thermal mineral wraps." },
        { id: "egg_mana_dimming", type: "egg_incubation", discoveryWeek: 3, abortionIndicated: true, name: "Luminescent Pulse Dimming", desc: "Embryonic vitality decline. Demands intensive body-heat brooding and thermal nest stabilization." },
        { id: "egg_yolk_adhesion", type: "egg_incubation", discoveryWeek: 4, abortionIndicated: false, name: "Embryonic Membrane Adhesion", desc: "Embryo adhering to the inner shell wall. Regular clutch turning in nest is required." },
        { id: "draconic_heterochromia", type: "postnatal", discoveryWeek: 0, abortionIndicated: false, name: "Draconic Heterochromia", desc: "Differently colored reptilian slit-pupil eyes. Harmless hereditary beauty mark." },
        { id: "luminescent_scales", type: "postnatal", discoveryWeek: 0, abortionIndicated: false, name: "Phosphorescent Scale Patches", desc: "Patches of scales along the spine and tail glow softly in ambient darkness." }
    ]
};
