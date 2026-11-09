/* LevelUp English — level B2 (Upper-Intermediate): grammar lessons + 10 themed units.
   Same shapes as course.js (lessons) and units.js (units). Loaded after both. */
(function () {
  var T = ['Правда', 'Неправда'];
  function tf(q, isTrue, why) { return { q: q, o: T, a: isTrue ? 0 : 1, why: why || '' }; }

  var lessons = [
    {
      id: 'b2-1', title: 'Если бы тогда… (Third Conditional)', short: 'Нереальное прошлое и сожаления',
      rules: [
        { h: 'Нереальное прошлое', t: '**If + had + V3, would have + V3**: If I **had studied**, I **would have passed**. (Не учил — не сдал.)' },
        { h: 'Сожаление и упрёк', t: 'Говорим о том, что уже нельзя изменить: If you **had told** me, I **would have helped**.' },
        { h: 'Сокращения', t: 'После if **I’d** = I had, в главной части **I’d** = I would: If I’d known, I’d have come.' }
      ],
      formula: 'If + had + V3, would have + V3',
      ex: [['If I had known, I would have called you.', 'Если бы я знал, я бы тебе позвонил.'], ['If we had left earlier, we wouldn’t have missed the train.', 'Если бы мы вышли раньше, мы бы не опоздали на поезд.'], ['She would have won if she had trained more.', 'Она бы победила, если бы больше тренировалась.'], ['What would you have done if you had lost your passport?', 'Что бы ты сделал, если бы потерял паспорт?']],
      tip: 'После if — **had + V3**, а не would: If I **would have known** — ошибка. Правильно: If I **had known**.',
      vocab: [['miss / missed', 'пропустить, опоздать на'], ['pass / passed', 'сдать'], ['regret', 'сожалеть'], ['earlier', 'раньше'], ['notice / noticed', 'заметить']],
      tasks: [
        { t: 'choice', q: 'If I ___ about the party, I would have come.', o: ['knew', 'had known', 'would know'], a: 1, why: 'после if — had + V3' },
        { t: 'choice', q: 'If she had asked me, I ___ her.', o: ['would help', 'would have helped', 'had helped'], a: 1, why: 'вторая часть — would have + V3' },
        { t: 'input', q: 'If we ___ (leave) earlier, we wouldn’t have missed the bus.', a: ['had left'], why: 'had + left' },
        { t: 'choice', q: 'He would have passed the exam if he ___ harder.', o: ['studied', 'had studied', 'would study'], a: 1, why: 'после if — had studied' },
        { t: 'input', q: 'If you had told me, I ___ (help) you.', a: ['would have helped'], why: 'would have + V3' },
        { t: 'tr', ru: 'Если бы я знал, я бы пришёл.', a: ['If I had known I would have come', 'I would have come if I had known'], why: 'had known … would have come' },
        { t: 'order', ru: 'Если бы мы поторопились, мы бы успели.', a: 'If we had hurried we would have made it', x: ['will'], why: 'had hurried … would have made' },
        { t: 'tr', ru: 'Она бы не опоздала, если бы не проспала.', a: ['She would not have been late if she had not overslept', 'If she had not overslept she would not have been late'], why: 'wouldn’t have been … hadn’t overslept' }
      ]
    },
    {
      id: 'b2-2', title: 'Жаль, что… (I wish / If only)', short: 'Сожаления о настоящем и прошлом',
      rules: [
        { h: 'Сожаление о настоящем', t: '**wish + Past**: I **wish** I **had** more time. (Времени нет.) I wish I **were** taller.' },
        { h: 'Сожаление о прошлом', t: '**wish + had + V3**: I **wish** I **had studied** harder. (Не учил — жалею.)' },
        { h: 'Раздражение', t: '**wish + would**: I **wish** you **would** stop talking! **If only…** — то же, но эмоциональнее.' }
      ],
      formula: 'wish + Past (сейчас) · wish + had + V3 (прошлое)',
      ex: [['I wish I lived near the sea.', 'Жаль, что я не живу у моря.'], ['I wish I hadn’t said that.', 'Жаль, что я это сказал.'], ['If only I had more money!', 'Если бы только у меня было больше денег!'], ['I wish it would stop raining.', 'Хоть бы дождь перестал.']],
      tip: 'Русское «жаль, что я не…» — это **I wish + утверждение**: «Жаль, что я не умею плавать» = I wish I **could** swim.',
      vocab: [['wish', 'желать; жалеть, что'], ['if only', 'если бы только'], ['regret', 'сожаление'], ['afford', 'позволить себе (по деньгам)']],
      tasks: [
        { t: 'choice', q: 'I wish I ___ more free time.', o: ['have', 'had', 'will have'], a: 1, why: 'сейчас → wish + Past' },
        { t: 'choice', q: 'I wish I ___ to the party yesterday.', o: ['went', 'had gone', 'would go'], a: 1, why: 'прошлое → had + V3' },
        { t: 'input', q: 'I wish I ___ (can) swim.', a: ['could'], why: 'can → could' },
        { t: 'choice', q: 'I wish you ___ making that noise!', o: ['would stop', 'stopped', 'had stopped'], a: 0, why: 'раздражение → would' },
        { t: 'input', q: 'If only I ___ (not / say) that!', a: ['had not said'], why: 'прошлое → hadn’t said' },
        { t: 'tr', ru: 'Жаль, что я не живу в Лондоне.', a: ['I wish I lived in London'], why: 'wish + Past' },
        { t: 'order', ru: 'Жаль, что я не начал учить английский раньше.', a: 'I wish I had started learning English earlier', x: ['start'], why: 'wish + had + V3' },
        { t: 'tr', ru: 'Если бы только у меня было больше денег!', a: ['If only I had more money'], why: 'If only + Past' }
      ]
    },
    {
      id: 'b2-3', title: 'Должно быть, может быть', short: 'must / might / can’t — догадки',
      rules: [
        { h: 'О настоящем', t: '**must be** — почти уверен «да»; **can’t be** — уверен «нет»; **might / may / could be** — возможно.' },
        { h: 'О прошлом', t: '**must have + V3**: She **must have forgotten**. **can’t have + V3**: He **can’t have seen** us. **might have + V3** — возможно, было.' },
        { h: 'Не путай', t: 'Для вывода «не может быть» — **can’t**, а не mustn’t: It **can’t** be true. (mustn’t = «нельзя».)' }
      ],
      formula: 'must / might / can’t + be · must / might / can’t + have + V3',
      ex: [['He must be tired after the trip.', 'Он, должно быть, устал после поездки.'], ['That can’t be Anna — she’s in Spain.', 'Это не может быть Аня — она в Испании.'], ['They might have missed the bus.', 'Возможно, они опоздали на автобус.'], ['You must have been very happy!', 'Ты, наверное, был очень счастлив!']],
      tip: '«Не может быть» = **can’t be**, а не mustn’t be.',
      vocab: [['must have', 'должно быть, (сделал)'], ['might', 'возможно'], ['can’t be', 'не может быть'], ['evidence', 'доказательство'], ['clue', 'улика, подсказка']],
      tasks: [
        { t: 'choice', q: 'The lights are off. They ___ be at home.', o: ['must', 'can’t', 'mustn’t'], a: 1, why: 'уверены, что нет → can’t' },
        { t: 'choice', q: 'She’s been working all day. She ___ be exhausted.', o: ['must', 'can’t', 'might not'], a: 0, why: 'почти уверены → must' },
        { t: 'choice', q: 'I can’t find my keys. I ___ have left them at school.', o: ['might', 'can’t', 'mustn’t'], a: 0, why: 'возможно → might have' },
        { t: 'input', q: 'He ___ (must / forget) about the meeting — he didn’t come.', a: ['must have forgotten'], why: 'must have + V3' },
        { t: 'choice', q: 'That ___ be true! I saw him an hour ago.', o: ['can’t', 'mustn’t', 'must'], a: 0, why: 'не может быть → can’t' },
        { t: 'input', q: 'They ___ (can’t / see) us — it was too dark.', a: ['can’t have seen', 'cannot have seen'], why: 'can’t have + V3' },
        { t: 'tr', ru: 'Он, должно быть, устал.', a: ['He must be tired'], why: 'must be' },
        { t: 'tr', ru: 'Возможно, она опоздала на поезд.', a: ['She might have missed the train', 'She may have missed the train', 'She could have missed the train'], why: 'might have + V3' }
      ]
    },
    {
      id: 'b2-4', title: 'Который: who, which, whose', short: 'Придаточные определительные',
      rules: [
        { h: 'Кто / что', t: '**who** — о людях, **which** — о предметах, **that** — и то и другое: The girl **who** sings… The book **which / that** I read…' },
        { h: 'Чей и где', t: '**whose** — чей: a friend **whose** dad is a pilot. **where** — где: the town **where** I was born.' },
        { h: 'С запятыми', t: 'Дополнительная информация — в запятых и без that: My sister, **who** lives in Berlin, is a doctor.' }
      ],
      formula: 'who / which / that / whose / where',
      ex: [['The man who called you is my uncle.', 'Мужчина, который тебе звонил, — мой дядя.'], ['This is the phone which I bought yesterday.', 'Это телефон, который я купил вчера.'], ['I have a friend whose mum is a pilot.', 'У меня есть друг, чья мама — пилот.'], ['Kraków, which is in the south, is beautiful.', 'Краков, который находится на юге, красивый.']],
      tip: 'В части с запятыми **that** нельзя: My car, **which** is red… (не that).',
      vocab: [['who', 'который (о людях)'], ['which', 'который (о предметах)'], ['whose', 'чей'], ['where', 'где'], ['inventor', 'изобретатель']],
      tasks: [
        { t: 'choice', q: 'The woman ___ lives next door is a doctor.', o: ['who', 'which', 'whose'], a: 0, why: 'о человеке → who' },
        { t: 'choice', q: 'This is the book ___ changed my life.', o: ['who', 'which', 'where'], a: 1, why: 'о предмете → which' },
        { t: 'choice', q: 'I know a boy ___ father is a famous chef.', o: ['who', 'whose', 'which'], a: 1, why: 'чей → whose' },
        { t: 'choice', q: 'This is the café ___ we first met.', o: ['which', 'where', 'who'], a: 1, why: 'где → where' },
        { t: 'input', q: 'Marie Curie, ___ won two Nobel Prizes, was born in Warsaw.', a: ['who'], why: 'о человеке → who' },
        { t: 'choice', q: 'My phone, ___ I bought last year, is already broken.', o: ['that', 'which', 'who'], a: 1, why: 'с запятыми — which, не that' },
        { t: 'tr', ru: 'Это девушка, которая поёт в нашей группе.', a: ['This is the girl who sings in our band', 'This is the girl that sings in our band', 'This is the girl who sings in our group', 'This is the girl that sings in our group'], why: 'the girl who sings' },
        { t: 'order', ru: 'Я знаю место, где можно вкусно поесть.', a: 'I know a place where you can eat well', x: ['which'], why: 'место → where' }
      ]
    },
    {
      id: 'b2-5', title: 'Буду делать / уже сделаю', short: 'Future Continuous и Future Perfect',
      rules: [
        { h: 'Future Continuous', t: '**will be + -ing** — процесс в момент в будущем: This time tomorrow I **will be flying** to London.' },
        { h: 'Future Perfect', t: '**will have + V3** — будет сделано к моменту: By 2030 I **will have finished** university.' },
        { h: 'Слова-подсказки', t: 'Continuous: **this time tomorrow, at 8 pm tomorrow**. Perfect: **by Friday, by the time, by then**.' }
      ],
      formula: 'will be + V-ing · will have + V3',
      ex: [['At 9 tomorrow I will be writing my exam.', 'Завтра в 9 я буду писать экзамен.'], ['By June I will have saved enough money.', 'К июню я накоплю достаточно денег.'], ['Don’t call at 7 — we will be having dinner.', 'Не звони в 7 — мы будем ужинать.'], ['By the time you arrive, I will have cooked dinner.', 'К твоему приходу я уже приготовлю ужин.']],
      tip: 'После **by the time** — Present Simple: By the time you **arrive** (не will arrive).',
      vocab: [['by then', 'к тому времени'], ['this time tomorrow', 'завтра в это же время'], ['deadline', 'срок'], ['complete', 'завершить']],
      tasks: [
        { t: 'choice', q: 'This time tomorrow I ___ on a beach.', o: ['will lie', 'will be lying', 'will have lain'], a: 1, why: 'процесс в момент → will be lying' },
        { t: 'choice', q: 'By Friday, I ___ the whole book.', o: ['will read', 'will be reading', 'will have read'], a: 2, why: 'к моменту → will have read' },
        { t: 'input', q: 'At 8 pm tomorrow we ___ (watch) the final.', a: ['will be watching'], why: 'will be + -ing' },
        { t: 'input', q: 'By 2030 scientists ___ (find) a cure.', a: ['will have found'], why: 'will have + V3' },
        { t: 'choice', q: 'Don’t call me at 7 — I ___ dinner.', o: ['will have', 'will be having', 'will have had'], a: 1, why: 'процесс в 7 → will be having' },
        { t: 'choice', q: 'By the time you ___, I will have finished.', o: ['arrive', 'will arrive', 'arrived'], a: 0, why: 'после by the time — Present Simple' },
        { t: 'tr', ru: 'Завтра в это время я буду лететь в Лондон.', a: ['This time tomorrow I will be flying to London', 'At this time tomorrow I will be flying to London', 'Tomorrow at this time I will be flying to London'], why: 'will be flying' },
        { t: 'tr', ru: 'К июню я закончу школу.', a: ['By June I will have finished school', 'I will have finished school by June'], why: 'will have finished' }
      ]
    },
    {
      id: 'b2-6', title: '-ing или to?', short: 'Герундий и инфинитив',
      rules: [
        { h: 'После этих — -ing', t: '**enjoy, avoid, mind, finish, suggest, keep, can’t stand** + -ing: I **enjoy reading**. После предлогов тоже -ing: interested **in learning**.' },
        { h: 'После этих — to', t: '**want, decide, hope, plan, agree, refuse, would like** + to: I **decided to study** abroad.' },
        { h: 'Смысл меняется', t: '**stop doing** — перестать; **stop to do** — остановиться, чтобы. **remember doing** — помнить, что сделал; **remember to do** — не забыть сделать.' }
      ],
      formula: 'enjoy + -ing · decide + to + V',
      ex: [['I enjoy learning languages.', 'Мне нравится учить языки.'], ['She decided to become a doctor.', 'Она решила стать врачом.'], ['Remember to lock the door!', 'Не забудь запереть дверь!'], ['He stopped smoking last year.', 'Он бросил курить в прошлом году.']],
      tip: 'После **look forward to** — -ing: I look forward to **seeing** you (to здесь предлог!).',
      vocab: [['avoid', 'избегать'], ['refuse', 'отказываться'], ['suggest', 'предлагать'], ['look forward to', 'с нетерпением ждать'], ['can’t stand', 'терпеть не могу']],
      tasks: [
        { t: 'choice', q: 'I enjoy ___ in the mountains.', o: ['to hike', 'hiking', 'hike'], a: 1, why: 'enjoy + -ing' },
        { t: 'choice', q: 'She decided ___ abroad.', o: ['studying', 'to study', 'study'], a: 1, why: 'decide + to' },
        { t: 'choice', q: 'I’m looking forward to ___ you.', o: ['see', 'seeing', 'to see'], a: 1, why: 'look forward to + -ing' },
        { t: 'input', q: 'Would you mind ___ (open) the window?', a: ['opening'], why: 'mind + -ing' },
        { t: 'input', q: 'They refused ___ (pay) for the broken window.', a: ['to pay'], why: 'refuse + to' },
        { t: 'choice', q: 'Remember ___ milk on your way home!', o: ['buying', 'to buy', 'buy'], a: 1, why: 'не забудь сделать → remember to' },
        { t: 'tr', ru: 'Я терпеть не могу ждать.', a: ['I can’t stand waiting', 'I cannot stand waiting'], why: 'can’t stand + -ing' },
        { t: 'order', ru: 'Он перестал есть сладкое.', a: 'He stopped eating sweets', x: ['to'], why: 'stop + -ing = перестать' }
      ]
    },
    {
      id: 'b2-7', title: 'Мне сделали: have something done', short: 'Когда работу делает кто-то другой',
      rules: [
        { h: 'Форма', t: '**have + предмет + V3**: I **had my hair cut**. (Меня подстригли — не я сам.)' },
        { h: 'Когда', t: 'Работу делает другой человек, обычно за деньги: We **had** our flat **painted**. I need to **have** my phone **repaired**.' },
        { h: 'get — разговорно', t: '**get + предмет + V3** — то же, но проще: I **got** my bike **fixed**.' }
      ],
      formula: 'have / get + предмет + V3',
      ex: [['I had my hair cut yesterday.', 'Меня вчера подстригли.'], ['We are having our kitchen painted.', 'Нам сейчас красят кухню.'], ['She got her phone repaired.', 'Ей починили телефон.'], ['Where can I have my eyes tested?', 'Где можно проверить зрение?']],
      tip: '«Я подстригся (в парикмахерской)» = I **had my hair cut**, а не I cut my hair (так — сам себя).',
      vocab: [['repair', 'чинить'], ['deliver', 'доставлять'], ['hairdresser', 'парикмахер'], ['test / tested', 'проверять']],
      tasks: [
        { t: 'choice', q: 'I ___ my hair cut last week.', o: ['had', 'have', 'was'], a: 0, why: 'прошлое → had + hair + cut' },
        { t: 'choice', q: 'We need to have our car ___.', o: ['repair', 'repaired', 'repairing'], a: 1, why: 'have + предмет + V3' },
        { t: 'input', q: 'She ___ (have) her nails done every month.', a: ['has'], why: 'привычка, she → has' },
        { t: 'choice', q: 'They are having their house ___ next week.', o: ['painted', 'paint', 'to paint'], a: 0, why: 'V3: painted' },
        { t: 'input', q: 'I got my bike ___ (fix) for free.', a: ['fixed'], why: 'get + предмет + V3' },
        { t: 'tr', ru: 'Мне починили телефон.', a: ['I had my phone repaired', 'I got my phone repaired', 'I had my phone fixed', 'I got my phone fixed'], why: 'had + phone + repaired' },
        { t: 'order', ru: 'Нам покрасили квартиру.', a: 'We had our flat painted', x: ['painting'], why: 'had + flat + painted' },
        { t: 'tr', ru: 'Где можно проверить зрение?', a: ['Where can I have my eyes tested', 'Where can I get my eyes tested', 'Where can I have my eyes checked', 'Where can I get my eyes checked'], why: 'have my eyes tested' }
      ]
    },
    {
      id: 'b2-8', title: 'Связки: although, despite, however', short: 'Как связывать мысли',
      rules: [
        { h: 'Противопоставление', t: '**although + предложение**: **Although** it was cold, we swam. **despite / in spite of + существительное или -ing**: **Despite** the cold, we swam.' },
        { h: 'Между предложениями', t: '**However,** — однако (в начале нового предложения, с запятой). **Moreover / What’s more,** — более того.' },
        { h: 'Причина и цель', t: '**because of** + существительное: because of the rain. **so that** + цель: I left early **so that** I wouldn’t miss the bus.' }
      ],
      formula: 'although + предложение · despite + сущ. / -ing · However, …',
      ex: [['Although he was tired, he finished the project.', 'Хотя он устал, он закончил проект.'], ['Despite the rain, we went to the beach.', 'Несмотря на дождь, мы пошли на пляж.'], ['The plan is good. However, it is expensive.', 'План хороший. Однако он дорогой.'], ['The match was cancelled because of the storm.', 'Матч отменили из-за шторма.']],
      tip: 'После **despite** — без of и без целого предложения: despite **the rain** / despite **being** tired (не despite of, не despite it was).',
      vocab: [['although', 'хотя'], ['despite', 'несмотря на'], ['however', 'однако'], ['moreover', 'более того'], ['because of', 'из-за']],
      tasks: [
        { t: 'choice', q: '___ it was late, we kept working.', o: ['Although', 'Despite', 'However'], a: 0, why: 'перед предложением → although' },
        { t: 'choice', q: '___ the rain, the concert went on.', o: ['Although', 'Despite', 'Because'], a: 1, why: 'перед существительным → despite' },
        { t: 'choice', q: 'The phone is great. ___, it’s too expensive for me.', o: ['However', 'Although', 'Despite'], a: 0, why: 'новое предложение с запятой → However' },
        { t: 'input', q: 'We stayed inside ___ of the storm.', a: ['because'], why: 'because of + существительное' },
        { t: 'choice', q: 'She passed the exam despite ___ ill.', o: ['she was', 'being', 'be'], a: 1, why: 'despite + -ing' },
        { t: 'tr', ru: 'Хотя он устал, он закончил работу.', a: ['Although he was tired he finished the work', 'Although he was tired he finished his work', 'Although he was tired he finished the job', 'Although he was tired he finished his job'], why: 'Although + he was tired' },
        { t: 'order', ru: 'Несмотря на холод, мы пошли гулять.', a: 'Despite the cold we went for a walk', x: ['of'], why: 'Despite + the cold' },
        { t: 'tr', ru: 'Матч отменили из-за дождя.', a: ['The match was cancelled because of the rain', 'The match was canceled because of the rain', 'The game was cancelled because of the rain', 'The game was canceled because of the rain'], why: 'because of + the rain' }
      ]
    }
  ];
  var YT = { 'b2-1': 'third conditional', 'b2-2': 'I wish if only', 'b2-3': 'modals of deduction must might can\'t', 'b2-4': 'relative clauses who which whose', 'b2-5': 'future continuous future perfect', 'b2-6': 'gerund or infinitive', 'b2-7': 'have something done causative', 'b2-8': 'although despite however' };
  lessons.forEach(function (ls) { ls.videos = []; ls.yt = YT[ls.id] || ls.title; });
  window.COURSE.push({ id: 'b2', code: 'B2', name: 'Продвинутый', about: 'условия, wish, догадки, связки', lessons: lessons });

  window.BOOK.push({
    id: 'b2', code: 'B2', name: 'Upper-Intermediate', ru: 'Выше среднего', about: 'Карьера, технологии, экология, медиа и культура',
    units: [
      {
        id: 'b2-u1', title: 'Карьера мечты', en: 'Dream career', icon: 'case', grammar: ['b2-6'],
        vocab: [['career', 'карьера', 'She wants a career in medicine.', 'Она хочет сделать карьеру в медицине.'], ['skill', 'навык', 'Teamwork is an important skill.', 'Командная работа — важный навык.'], ['apply for', 'подавать заявку на', 'I applied for a summer job.', 'Я подал заявку на летнюю работу.'], ['salary', 'зарплата', 'The salary is good, but the hours are long.', 'Зарплата хорошая, но рабочий день длинный.'], ['qualification', 'квалификация, диплом', 'You need a qualification to work as a nurse.', 'Чтобы работать медсестрой, нужна квалификация.'], ['job interview', 'собеседование', 'My job interview is on Monday.', 'Моё собеседование в понедельник.'], ['ambition', 'мечта, стремление (о карьере)', 'Her ambition is to run her own company.', 'Её мечта — руководить собственной компанией.'], ['promotion', 'повышение (по работе)', 'He got a promotion after two years.', 'Через два года его повысили.'], ['employer', 'работодатель', 'Employers look for confident people.', 'Работодатели ищут уверенных людей.'], ['internship', 'стажировка', 'I did a summer internship at a bank.', 'Летом я проходил стажировку в банке.']],
        text: { title: 'Finding my path',
          en: ['Choosing a career is not easy.', 'When I was younger, I wanted to become a pilot.', 'Now I enjoy designing websites, so I am thinking about IT.', 'I have decided to improve my skills this year.', 'Last month I applied for an online course in web design.', 'My ambition is to find a job with an international company.', 'I know that employers value experience, so I am building my portfolio now.'],
          ru: ['Выбрать карьеру непросто.', 'Когда я был младше, я хотел стать пилотом.', 'Сейчас мне нравится создавать сайты, поэтому я думаю об IT.', 'Я решил в этом году прокачать свои навыки.', 'В прошлом месяце я подал заявку на онлайн-курс по веб-дизайну.', 'Моя мечта — найти работу в международной компании.', 'Я знаю, что работодатели ценят опыт, поэтому уже сейчас собираю портфолио.'] },
        quiz: [tf('The writer wanted to be a pilot when he was younger.', true), { q: 'What does the writer enjoy now?', o: ['flying planes', 'designing websites', 'teaching'], a: 1 }, tf('He applied for a course in medicine.', false, 'It was a course in web design.'), { q: 'Why is he building a portfolio?', o: ['because employers value experience', 'because it is fun', 'because his teacher said so'], a: 0 }],
        write: { task: 'Напиши о своей карьере мечты: кем хочешь работать, почему и что для этого уже делаешь.', min: 50, sent: 5,
          req: [['enjoy / love + -ing', '\\b(enjoy|love|like)\\s+\\w+ing\\b'], ['decide / want / plan + to', '\\b(decided?|want|plan|hope)\\s+to\\b'], ['because', '\\bbecause\\b'], ['goal / dream', '\\b(goal|dream)\\b']],
          model: 'My dream is to become a game designer. I love playing and creating games, and I enjoy drawing characters. I have decided to learn programming because every designer needs technical skills. Last year I made my first simple game with two friends. My goal is to work for an international studio and create games that people around the world will enjoy.' }
      },
      {
        id: 'b2-u2', title: 'Технологии будущего', en: 'Future technology', icon: 'bolt', grammar: ['b2-5'],
        vocab: [['artificial intelligence', 'искусственный интеллект', 'Artificial intelligence can translate texts in seconds.', 'Искусственный интеллект может переводить тексты за секунды.'], ['device', 'устройство', 'Smart devices are everywhere.', 'Умные устройства повсюду.'], ['robot', 'робот', 'Robots will be doing many boring jobs.', 'Роботы будут выполнять много скучной работы.'], ['invent', 'изобретать', 'Who invented the internet?', 'Кто изобрёл интернет?'], ['self-driving car', 'беспилотный автомобиль', 'Self-driving cars are already being tested.', 'Беспилотные автомобили уже тестируют.'], ['screen time', 'время у экрана', 'I try to reduce my screen time.', 'Я стараюсь меньше сидеть за экраном.'], ['data', 'данные', 'Apps collect a lot of data about us.', 'Приложения собирают о нас много данных.'], ['replace', 'заменять', 'Will robots replace teachers?', 'Заменят ли роботы учителей?'], ['predict', 'предсказывать', 'It is hard to predict the future.', 'Будущее трудно предсказать.'], ['virtual reality', 'виртуальная реальность', 'We visited a museum in virtual reality.', 'Мы побывали в музее в виртуальной реальности.']],
        text: { title: 'Life in 2040',
          en: ['What will life be like in 2040?', 'Many experts predict that robots will have replaced people in many boring jobs.', 'Self-driving cars will be taking us to school and work.', 'Doctors will be using artificial intelligence to find illnesses earlier.', 'We will probably be spending even more time online.', 'However, nobody can predict the future exactly.', 'One thing is clear: people who keep learning will always find work.'],
          ru: ['Какой будет жизнь в 2040 году?', 'Многие эксперты предсказывают, что роботы заменят людей на многих скучных работах.', 'Беспилотные машины будут возить нас в школу и на работу.', 'Врачи будут использовать искусственный интеллект, чтобы находить болезни раньше.', 'Мы, вероятно, будем проводить в интернете ещё больше времени.', 'Однако никто не может точно предсказать будущее.', 'Ясно одно: люди, которые продолжают учиться, всегда найдут работу.'] },
        quiz: [tf('Experts think robots will do many boring jobs.', true), { q: 'What will doctors use AI for?', o: ['to drive cars', 'to find illnesses earlier', 'to teach students'], a: 1 }, tf('According to the text, we know the future exactly.', false, 'Nobody can predict the future exactly.'), { q: 'Who will always find work?', o: ['people who keep learning', 'people with cars', 'robots'], a: 0 }],
        write: { task: 'Каким будет твой день в 2040 году? Опиши, что ты будешь делать и чего уже добьёшься к этому времени.', min: 50, sent: 5,
          req: [['will be + -ing', '\\bwill be \\w+ing\\b'], ['will have + V3', '\\bwill have \\w+(ed|en|ne|wn|un|ght)\\b'], ['by + время', '\\bby (20\\d\\d|then|the time)\\b']],
          model: 'In 2040 I will be thirty-two years old. By then I will have finished university and I will have travelled to many countries. On a normal morning I will be drinking coffee while my robot is cleaning the flat. At nine o\'clock I will be working from home with colleagues from three different countries. My self-driving car will take me to the gym in the evening.' }
      },
      {
        id: 'b2-u3', title: 'Окружающая среда', en: 'Our planet', icon: 'globe', grammar: ['b2-1'],
        vocab: [['environment', 'окружающая среда', 'We must protect the environment.', 'Мы должны защищать окружающую среду.'], ['pollution', 'загрязнение', 'Air pollution is a big problem in cities.', 'Загрязнение воздуха — большая проблема в городах.'], ['climate change', 'изменение климата', 'Climate change affects everyone.', 'Изменение климата касается всех.'], ['recycle', 'перерабатывать', 'We recycle paper and plastic.', 'Мы сдаём бумагу и пластик на переработку.'], ['waste', 'отходы; тратить впустую', 'Don\'t waste water.', 'Не трать воду впустую.'], ['renewable energy', 'возобновляемая энергия', 'Solar power is renewable energy.', 'Солнечная энергия — возобновляемая.'], ['species', 'вид (животных, растений)', 'Many species are in danger.', 'Многие виды под угрозой.'], ['flood', 'наводнение', 'The flood destroyed many homes.', 'Наводнение разрушило много домов.'], ['reduce', 'сокращать', 'We should reduce plastic.', 'Нам стоит сократить пластик.'], ['protect', 'защищать', 'Volunteers protect the forest.', 'Волонтёры защищают лес.']],
        text: { title: 'A lesson from the river',
          en: ['Ten years ago, a factory near our town dumped waste into the river.', 'Nobody did anything, and soon the fish disappeared.', 'If people had acted earlier, the river would have stayed clean.', 'Then a group of students started a campaign.', 'They collected rubbish, wrote to the local newspaper and talked to the mayor.', 'Today the river is clean again, and some species have come back.', 'Their story shows that young people can really change things.'],
          ru: ['Десять лет назад завод рядом с нашим городом сбрасывал отходы в реку.', 'Никто ничего не делал, и вскоре рыба исчезла.', 'Если бы люди начали действовать раньше, река осталась бы чистой.', 'Потом группа студентов начала кампанию.', 'Они собирали мусор, писали в местную газету и говорили с мэром.', 'Сегодня река снова чистая, и некоторые виды вернулись.', 'Их история показывает, что молодые люди действительно могут что-то изменить.'] },
        quiz: [tf('A factory dumped waste into the river.', true), { q: 'What happened to the fish?', o: ['They disappeared.', 'They got bigger.', 'They moved to the sea.'], a: 0 }, { q: 'Who started the campaign?', o: ['the mayor', 'a group of students', 'the factory'], a: 1 }, tf('The river is still dirty today.', false, 'Today the river is clean again.')],
        write: { task: 'Опиши экологическую проблему в твоём городе или стране: что было бы, если бы люди поступили по-другому?', min: 50, sent: 5,
          req: [['If + had + V3', '\\bif [a-z ]*\\bhad \\w+'], ['would have + V3', '\\bwould(n[’\']t| not)? have \\w+'], ['pollution / waste / recycle', '\\b(pollution|waste|recycl\\w*)\\b']],
          model: 'In my city there is a lot of air pollution because of old cars and factories. Ten years ago the city wanted to build a new tram line, but the plan was cancelled. If the city had built the tram, fewer people would have used their cars. The air would have been much cleaner. Now people are starting to recycle more, and I hope the city will invest in public transport.' }
      },
      {
        id: 'b2-u4', title: 'Сожаления и мечты', en: 'Regrets and wishes', icon: 'star', grammar: ['b2-2'],
        vocab: [['disappointed', 'разочарованный', 'I was disappointed with my results.', 'Я был разочарован своими результатами.'], ['hesitate', 'колебаться, сомневаться', 'Don\'t hesitate to ask for help.', 'Не стесняйся просить о помощи.'], ['opportunity', 'возможность', 'Don\'t miss this opportunity.', 'Не упусти эту возможность.'], ['mistake', 'ошибка', 'Everyone makes mistakes.', 'Все совершают ошибки.'], ['courage', 'смелость', 'It takes courage to change school.', 'Нужна смелость, чтобы сменить школу.'], ['give up', 'сдаваться, бросать', 'Never give up on your dreams.', 'Никогда не отказывайся от своей мечты.'], ['chance', 'шанс', 'I had a chance to study in Spain.', 'У меня был шанс поучиться в Испании.'], ['decision', 'решение', 'It was a difficult decision.', 'Это было трудное решение.'], ['embarrassed', 'смущённый', 'I felt embarrassed when I forgot the words.', 'Мне было неловко, когда я забыл слова.'], ['turning point', 'поворотный момент', 'That trip was a turning point in my life.', 'Та поездка стала поворотным моментом в моей жизни.']],
        text: { title: 'Letter to my younger self',
          en: ['Dear younger me,', 'I wish I had been braver at school.', 'You refused to join the drama club because you were shy, and I still regret it.', 'I also wish I had started learning English earlier.', 'But don\'t worry — mistakes are lessons, not the end of the world.', 'Today I wish I had more free time, but I am happy with my decisions.', 'So take every chance you get and never give up!'],
          ru: ['Дорогой я в детстве,', 'Жаль, что я не был смелее в школе.', 'Ты отказался пойти в театральный кружок, потому что стеснялся, и я до сих пор жалею об этом.', 'А ещё жаль, что я не начал учить английский раньше.', 'Но не волнуйся — ошибки это уроки, а не конец света.', 'Сегодня мне жаль, что у меня мало свободного времени, но я доволен своими решениями.', 'Так что используй каждый шанс и никогда не сдавайся!'] },
        quiz: [tf('The writer joined the drama club at school.', false, 'He refused because he was shy.'), { q: 'What does the writer regret?', o: ['not being braver', 'learning Spanish', 'changing school'], a: 0 }, tf('The writer thinks mistakes are lessons.', true), { q: 'What does he wish today?', o: ['that he had more free time', 'that he were younger', 'that he lived abroad'], a: 0 }],
        write: { task: 'Напиши письмо себе младшему: о чём ты жалеешь, чего хотел бы сейчас и какой совет дашь.', min: 50, sent: 5,
          req: [['wish + Past (о настоящем)', '\\bwish (i|you|we) (had|were|could|knew|lived|was)\\b'], ['wish + had + V3 (о прошлом)', '\\bwish (i|you) had(n[’\']t)? \\w+(ed|en|wn|ne|ght|t)\\b'], ['never / don’t — совет', '\\b(never|don[’\']t|do not)\\b']],
          model: 'Dear younger me, I wish I had listened to my teachers more carefully. I also wish I hadn\'t spent so many evenings playing video games. Today I wish I could speak three languages, so start learning now! Don\'t be afraid of mistakes, because they help you grow. Never give up when something is difficult, and always believe in yourself.' }
      },
      {
        id: 'b2-u5', title: 'Загадки и детективы', en: 'Mysteries', icon: 'search', grammar: ['b2-3'],
        vocab: [['mystery', 'загадка, тайна', 'The disappearance is still a mystery.', 'Исчезновение до сих пор загадка.'], ['clue', 'улика, подсказка', 'The detective found an important clue.', 'Детектив нашёл важную улику.'], ['evidence', 'доказательства', 'There isn\'t enough evidence.', 'Доказательств недостаточно.'], ['suspect', 'подозреваемый; подозревать', 'The police questioned the suspect.', 'Полиция допросила подозреваемого.'], ['witness', 'свидетель', 'A witness saw a man in a red coat.', 'Свидетель видел мужчину в красном пальто.'], ['thief', 'вор', 'The thief escaped through the window.', 'Вор сбежал через окно.'], ['solve', 'раскрыть, решить', 'She solved the case in two days.', 'Она раскрыла дело за два дня.'], ['footprint', 'след (ноги)', 'There were footprints in the snow.', 'На снегу были следы.'], ['disappear', 'исчезать', 'The cat disappeared last night.', 'Кот исчез прошлой ночью.'], ['detective', 'детектив, сыщик', 'The detective asked a lot of questions.', 'Детектив задал много вопросов.']],
        text: { title: 'The missing cake',
          en: ['When Mrs Novak came into the kitchen, the birthday cake had disappeared.', 'There were chocolate footprints on the floor.', 'The footprints were very small, so the thief must have been a child or an animal.', 'It can\'t have been the dog, because he was sleeping in the garden all morning.', 'Her son Tom might have taken it — he loves chocolate.', 'But Tom had been at school since eight o\'clock.', 'Then she heard a happy noise from the cupboard: the cat was finishing the last piece!'],
          ru: ['Когда миссис Новак вошла на кухню, праздничный торт исчез.', 'На полу были шоколадные следы.', 'Следы были очень маленькие, значит, вором, должно быть, был ребёнок или животное.', 'Это не могла быть собака, потому что она всё утро спала в саду.', 'Возможно, его взял её сын Том — он обожает шоколад.', 'Но Том был в школе с восьми часов.', 'Тут она услышала довольный звук из шкафа: кот доедал последний кусок!'] },
        quiz: [{ q: 'What was on the floor?', o: ['chocolate footprints', 'pieces of glass', 'water'], a: 0 }, tf('The dog ate the cake.', false, 'The dog was sleeping in the garden.'), tf('Tom was at school.', true), { q: 'Who took the cake?', o: ['Tom', 'the cat', 'Mrs Novak'], a: 1 }],
        write: { task: 'Придумай короткую загадочную историю: что случилось и кто мог это сделать? Используй must / might / can’t have.', min: 50, sent: 5,
          req: [['must have + V3', '\\bmust have \\w+'], ['might / may / could have + V3', '\\b(might|may|could) have \\w+'], ['can’t have + V3', '\\bcan[’\']?t have \\w+|\\bcannot have \\w+']],
          model: 'Yesterday my bike disappeared from the yard. The lock was on the ground, so someone must have cut it. It can\'t have been my neighbour, because he was on holiday. A boy from the next street might have taken it — he always looked at my bike. Later I found it near the school. Maybe the thief got scared and left it there.' }
      },
      {
        id: 'b2-u6', title: 'Услуги и сервисы', en: 'Getting things done', icon: 'refresh', grammar: ['b2-7'],
        vocab: [['hairdresser', 'парикмахер', 'I go to the hairdresser every month.', 'Я хожу к парикмахеру каждый месяц.'], ['repair', 'чинить; ремонт', 'The repair took two days.', 'Ремонт занял два дня.'], ['salon', 'салон', 'She works in a beauty salon.', 'Она работает в салоне красоты.'], ['deliver', 'доставлять', 'They delivered the sofa yesterday.', 'Диван доставили вчера.'], ['cracked', 'треснувший', 'The screen of my phone is cracked.', 'Экран моего телефона треснул.'], ['install', 'устанавливать', 'They installed a new boiler.', 'Нам установили новый бойлер.'], ['cost', 'стоить; стоимость', 'How much does it cost?', 'Сколько это стоит?'], ['service', 'обслуживание, услуга', 'The service was fast.', 'Обслуживание было быстрым.'], ['review', 'отзыв', 'I always read the reviews first.', 'Я всегда сначала читаю отзывы.'], ['guarantee', 'гарантия', 'The phone is still under guarantee.', 'На телефон ещё действует гарантия.']],
        text: { title: 'A busy Saturday',
          en: ['Saturday was my "getting things done" day.', 'First, I had my hair cut at a new hairdresser\'s near my house.', 'Then I took my phone to a repair shop, because the screen was cracked.', 'I had the screen replaced in only forty minutes.', 'Luckily, it cost less than I expected, because the phone was still under guarantee.', 'In the afternoon we had a new sofa delivered.', 'In the evening I was tired, but everything was done — and I didn\'t do any of it myself!'],
          ru: ['Суббота была моим днём «дел».', 'Сначала я подстригся в новой парикмахерской рядом с домом.', 'Потом я отнёс телефон в мастерскую, потому что треснул экран.', 'Экран мне заменили всего за сорок минут.', 'К счастью, это стоило меньше, чем я ожидал, потому что на телефон ещё действовала гарантия.', 'Днём нам доставили новый диван.', 'Вечером я устал, но всё было сделано — и ничего из этого я не делал сам!'] },
        quiz: [tf('The writer cut his own hair.', false, 'He had his hair cut at a hairdresser’s.'), { q: 'What was wrong with the phone?', o: ['The battery was dead.', 'The screen was cracked.', 'It was too old.'], a: 1 }, tf('The repair took forty minutes.', true), { q: 'What was delivered in the afternoon?', o: ['a sofa', 'a phone', 'a cake'], a: 0 }],
        write: { task: 'Расскажи, что тебе или твоей семье недавно сделали мастера: подстригли, починили, доставили… Используй have / get something done.', min: 45, sent: 5,
          req: [['have / had + предмет + V3', '\\b(have|had|has|having)\\s+(my|our|his|her|the|a)\\s+\\w+\\s+\\w+(ed|en|t|ne)\\b'], ['get / got + предмет + V3', '\\b(get|got|gets|getting)\\s+(my|our|his|her|the|a)\\s+\\w+\\s+\\w+(ed|en|t|ne)\\b']],
          model: 'Last week was very busy for my family. My dad had his car repaired because the brakes were making a strange noise. My mum got her laptop fixed at a small shop in the centre. I had my hair cut before my cousin\'s wedding. On Friday we also had our windows cleaned. It was expensive, but now everything looks perfect.' }
      },
      {
        id: 'b2-u7', title: 'Медиа и фейки', en: 'News and fake news', icon: 'news', grammar: ['b2-8'],
        vocab: [['misleading', 'вводящий в заблуждение', 'The title was misleading.', 'Название вводило в заблуждение.'], ['rumour', 'слух', 'It was only a rumour.', 'Это был всего лишь слух.'], ['go viral', 'стать вирусным', 'The video went viral overnight.', 'Видео стало вирусным за ночь.'], ['trustworthy', 'заслуживающий доверия', 'Is this website trustworthy?', 'Этому сайту можно доверять?'], ['spread', 'распространять(ся)', 'Rumours spread quickly online.', 'Слухи быстро распространяются в сети.'], ['bias', 'предвзятость', 'Every newspaper has some bias.', 'У каждой газеты есть доля предвзятости.'], ['verify', 'проверять, подтверждать', 'Verify the facts before you post anything.', 'Проверь факты, прежде чем что-то публиковать.'], ['influence', 'влиять; влияние', 'Social media influences young people.', 'Соцсети влияют на молодёжь.'], ['opinion', 'мнение', 'In my opinion, it is true.', 'По-моему, это правда.'], ['check the facts', 'проверять факты', 'Check the facts before you share.', 'Проверь факты, прежде чем делиться.']],
        text: { title: 'Before you share',
          en: ['Every day we see hundreds of headlines on our phones.', 'Although most of them are true, some are fake news.', 'Fake stories spread quickly because they are shocking or funny.', 'However, they can influence what people think and do.', 'Despite the risks, many people share articles without reading them.', 'Before you share something, check the source and look for the same news on a trustworthy website.', 'It takes one minute, but it can stop a lie.'],
          ru: ['Каждый день мы видим в телефонах сотни заголовков.', 'Хотя большинство из них правдивы, некоторые — фейки.', 'Фейковые истории быстро распространяются, потому что они шокируют или смешат.', 'Однако они могут влиять на то, что люди думают и делают.', 'Несмотря на риски, многие делятся статьями, не читая их.', 'Прежде чем чем-то поделиться, проверь источник и найди ту же новость на надёжном сайте.', 'Это займёт минуту, но может остановить ложь.'] },
        quiz: [tf('All headlines we see are fake.', false, 'Most of them are true.'), { q: 'Why do fake stories spread quickly?', o: ['because they are shocking or funny', 'because they are long', 'because journalists write them'], a: 0 }, tf('Many people share articles without reading them.', true), { q: 'What should you do before sharing?', o: ['check the source', 'add a comment', 'delete the app'], a: 0 }],
        write: { task: 'Как ты отличаешь правду от фейка? Напиши своё мнение и дай советы, используя although, despite и however.', min: 50, sent: 5,
          req: [['although', '\\balthough\\b'], ['despite / in spite of', '\\b(despite|in spite of)\\b'], ['However,', '\\bhowever\\b']],
          model: 'In my opinion, fake news is a serious problem. Although I use social media every day, I don\'t believe everything I see. Despite being careful, I once shared a fake story about a celebrity. However, after that I started checking the source of every article. I also compare the news with a reliable website before I share it with my friends.' }
      },
      {
        id: 'b2-u8', title: 'Люди, изменившие мир', en: 'People who changed the world', icon: 'users', grammar: ['b2-4'],
        vocab: [['scientist', 'учёный', 'She is a famous scientist.', 'Она известный учёный.'], ['discover', 'открывать (научно)', 'Marie Curie discovered radium.', 'Мария Кюри открыла радий.'], ['inventor', 'изобретатель', 'The inventor of the web is British.', 'Изобретатель веба — британец.'], ['equal rights', 'равные права', 'He fought for equal rights.', 'Он боролся за равные права.'], ['prize', 'премия, приз', 'She won the Nobel Prize twice.', 'Она дважды получила Нобелевскую премию.'], ['prison', 'тюрьма', 'He spent 27 years in prison.', 'Он провёл в тюрьме 27 лет.'], ['freedom', 'свобода', 'People fought for freedom.', 'Люди боролись за свободу.'], ['achievement', 'достижение', 'It was a great achievement.', 'Это было большое достижение.'], ['campaign', 'кампания (борьба за что-то)', 'She started a campaign for clean air.', 'Она начала кампанию за чистый воздух.'], ['research', 'исследование', 'She spent years on her research.', 'Она провела годы за исследованиями.']],
        text: { title: 'Three people who changed the world',
          en: ['Marie Curie, who was born in Warsaw, was the first person to win two Nobel Prizes.', 'Her research, which she did together with her husband Pierre, changed science forever.', 'Nelson Mandela was a man whose fight for equal rights inspired the whole world.', 'He spent 27 years in prison, but he never gave up.', 'In 1994 he became the first Black president of South Africa.', 'Tim Berners-Lee is the British scientist who invented the World Wide Web in 1989.', 'He decided not to patent it, so the web became free for everyone.'],
          ru: ['Мария Кюри, которая родилась в Варшаве, стала первым человеком, получившим две Нобелевские премии.', 'Её исследования, которые она вела вместе с мужем Пьером, навсегда изменили науку.', 'Нельсон Мандела — человек, чья борьба за равные права вдохновила весь мир.', 'Он провёл 27 лет в тюрьме, но так и не сдался.', 'В 1994 году он стал первым чернокожим президентом ЮАР.', 'Тим Бернерс-Ли — британский учёный, который изобрёл Всемирную паутину в 1989 году.', 'Он решил не патентовать её, поэтому веб стал бесплатным для всех.'] },
        quiz: [tf('Marie Curie was born in Paris.', false, 'She was born in Warsaw.'), { q: 'How many years did Mandela spend in prison?', o: ['7', '17', '27'], a: 2 }, { q: 'What did Tim Berners-Lee invent?', o: ['the telephone', 'the World Wide Web', 'the computer'], a: 1 }, tf('The web is free for everyone because it was not patented.', true)],
        write: { task: 'Напиши о человеке, который тебя вдохновляет: кто это, чего он добился и почему он важен для тебя. Используй who / which / whose.', min: 50, sent: 5,
          req: [['who', '\\bwho\\b'], ['which / that', '\\b(which|that)\\b'], ['whose', '\\bwhose\\b']],
          model: 'The person who inspires me most is my grandmother. She is a woman whose life was not easy. When she was young, she moved to a new country, which was very difficult for her. She learned a new language and became a teacher who helped hundreds of children. Her story shows me that hard work can change everything.' }
      },
      {
        id: 'b2-u9', title: 'Деньги и стартапы', en: 'Money and start-ups', icon: 'rocket', grammar: ['b2-6', 'b2-8'],
        vocab: [['business', 'бизнес, дело', 'She started her own business at nineteen.', 'Она открыла своё дело в девятнадцать лет.'], ['profit', 'прибыль', 'The company made a profit last year.', 'В прошлом году компания получила прибыль.'], ['invest', 'инвестировать, вкладывать', 'They invested money in a new app.', 'Они вложили деньги в новое приложение.'], ['loan', 'кредит, заём', 'He took a loan from the bank.', 'Он взял кредит в банке.'], ['risk', 'риск', 'Every business involves risk.', 'Любой бизнес связан с риском.'], ['budget', 'бюджет', 'We have a small budget.', 'У нас небольшой бюджет.'], ['advertise', 'рекламировать', 'We advertise on social media.', 'Мы рекламируемся в соцсетях.'], ['succeed', 'добиться успеха', 'If you work hard, you will succeed.', 'Если много работать, добьёшься успеха.'], ['competitor', 'конкурент', 'Our main competitor is cheaper.', 'Наш главный конкурент дешевле.'], ['launch', 'запускать (продукт)', 'They launched the app in May.', 'Они запустили приложение в мае.']],
        text: { title: 'From a hobby to a business',
          en: ['Lena started baking cakes as a hobby when she was sixteen.', 'Her friends loved them so much that they suggested selling them online.', 'Although she had a very small budget, she decided to try.', 'She advertised her cakes on social media instead of paying for expensive ads.', 'Despite a few mistakes at the beginning, the business grew quickly.', 'After two years she had made enough profit to rent a small café.', 'Her advice is simple: start small, avoid big loans and keep learning.'],
          ru: ['Лена начала печь торты как хобби, когда ей было шестнадцать.', 'Её друзьям они так нравились, что те предложили продавать их онлайн.', 'Хотя бюджет у неё был совсем маленький, она решила попробовать.', 'Она рекламировала свои торты в соцсетях вместо того, чтобы платить за дорогую рекламу.', 'Несмотря на несколько ошибок в начале, бизнес быстро рос.', 'Через два года она заработала достаточно прибыли, чтобы арендовать маленькое кафе.', 'Её совет прост: начинай с малого, избегай больших кредитов и продолжай учиться.'] },
        quiz: [tf('Lena started baking at sixteen.', true), { q: 'Where did she advertise?', o: ['on TV', 'on social media', 'in newspapers'], a: 1 }, tf('She took a big loan to start.', false, 'She had a very small budget and advises avoiding big loans.'), { q: 'What did she rent after two years?', o: ['a flat', 'a small café', 'a car'], a: 1 }],
        write: { task: 'Придумай свой маленький бизнес: что будешь продавать, кому и как будешь рекламировать. Используй связки и -ing / to.', min: 55, sent: 5,
          req: [['plan / decide / want + to', '\\b(plan|planning|decided?|want|hope)\\s+to\\b'], ['avoid / enjoy / start + -ing', '\\b(avoid|enjoy|start|keep|consider)\\s+\\w+ing\\b'], ['although / despite / however', '\\b(although|despite|however)\\b']],
          model: 'I want to start a small business selling handmade phone cases. I enjoy designing things, and many students at my school like unusual accessories. At first I plan to sell the cases online and advertise them on social media. Although the budget is small, I can avoid spending money on a shop. However, I will need to invest in good materials. If customers like my cases, I will open a small online store.' }
      },
      {
        id: 'b2-u10', title: 'Культурный шок', en: 'Culture shock', icon: 'plane', grammar: ['b2-4', 'b2-1'],
        vocab: [['culture shock', 'культурный шок', 'I had culture shock in my first month.', 'В первый месяц у меня был культурный шок.'], ['custom', 'обычай', 'Every country has its own customs.', 'У каждой страны свои обычаи.'], ['etiquette', 'этикет', 'Table etiquette is different in Japan.', 'Застольный этикет в Японии другой.'], ['misunderstanding', 'недоразумение', 'It was just a misunderstanding.', 'Это было просто недоразумение.'], ['tradition', 'традиция', 'It is an old family tradition.', 'Это старая семейная традиция.'], ['adapt', 'адаптироваться', 'It took me a year to adapt.', 'Мне понадобился год, чтобы адаптироваться.'], ['queue', 'очередь; стоять в очереди', 'People queue at the bus stop.', 'Люди стоят в очереди на остановке.'], ['stranger', 'незнакомец', 'Never get into a car with a stranger.', 'Никогда не садись в машину к незнакомцу.'], ['behave', 'вести себя', 'People behave differently here.', 'Здесь люди ведут себя по-другому.'], ['host family', 'принимающая семья', 'My host family was very kind.', 'Моя принимающая семья была очень доброй.']],
        text: { title: 'My first month in England',
          en: ['When I moved to England for a student exchange, everything felt different.', 'People who I had never met asked me "Are you all right?" — I thought they were worried about me!', 'Later I understood that it simply means "Hi, how are you?"', 'The thing which surprised me most was queuing: nobody ever pushes in.', 'If I had known more about British customs, I wouldn\'t have felt so confused.', 'I was homesick at first, but my host family, whose kindness I will never forget, helped me adapt.', 'Now I think that living abroad is the best way to learn a language.'],
          ru: ['Когда я переехал в Англию по программе обмена, всё казалось другим.', 'Люди, которых я никогда раньше не видел, спрашивали меня «Are you all right?» — я думал, что они за меня волнуются!', 'Позже я понял, что это просто значит «Привет, как дела?»', 'Больше всего меня удивили очереди: никто никогда не лезет вперёд.', 'Если бы я знал больше о британских обычаях, я бы не чувствовал себя таким растерянным.', 'Сначала я скучал по дому, но принимающая семья, чью доброту я никогда не забуду, помогла мне адаптироваться.', 'Теперь я думаю, что жить за границей — лучший способ выучить язык.'] },
        quiz: [tf('At first the writer thought people were worried about him.', true), { q: 'What does "Are you all right?" usually mean in England?', o: ['Are you ill?', 'Hi, how are you?', 'Do you need help?'], a: 1 }, { q: 'What surprised him most?', o: ['the weather', 'queuing', 'the food'], a: 1 }, tf('His host family did not help him.', false, 'They helped him adapt.')],
        write: { task: 'Опиши культурный шок: что удивило тебя в другой стране (или удивило бы иностранца в твоей)? Используй who / which и одно предложение с If + had.', min: 55, sent: 5,
          req: [['who / which / whose', '\\b(who|which|whose)\\b', 2], ['If + had + V3', '\\bif [a-z ]*\\bhad \\w+'], ['custom / tradition / polite', '\\b(customs?|traditions?|polite|rude)\\b']],
          model: 'When I moved to Poland, the thing which surprised me most was name days. My classmate, whose name is Anna, got flowers and presents on a day that was not her birthday! In Ukraine we don\'t celebrate name days so much. Another custom which I noticed is that people say hello in lifts. If I had known this before, I would have felt less shy. Now I really like these traditions.' }
      }
    ]
  });
})();
