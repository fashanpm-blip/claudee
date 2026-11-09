/* LevelUp English — extra practice data: placement test, situational dialogs, mascot lines.
   placement: tasks tagged with the level they check (lv).
   dialogs: steps are either {npc, ru} (the other person speaks) or {me: [[text, isRight, feedback], …]}. */
(function () {
  window.EXTRA = window.EXTRA || {};

  window.EXTRA.placement = [
    { lv: 'A1', t: 'choice', q: 'She ___ a student.', o: ['am', 'is', 'are'], a: 1, why: 'she → is' },
    { lv: 'A1', t: 'choice', q: 'I ___ two brothers.', o: ['have', 'has', 'am'], a: 0, why: 'I have, he/she has' },
    { lv: 'A1', t: 'choice', q: 'Where ___ you from?', o: ['is', 'are', 'do'], a: 1, why: 'you → are' },
    { lv: 'A1', t: 'choice', q: 'There ___ a park near my house.', o: ['is', 'are', 'have'], a: 0, why: 'один парк → there is' },
    { lv: 'A1', t: 'choice', q: 'He ___ football every Saturday.', o: ['play', 'plays', 'playing'], a: 1, why: 'he/she/it в Present Simple → +s' },
    { lv: 'A2', t: 'choice', q: 'We ___ to Kraków last summer.', o: ['go', 'went', 'have gone'], a: 1, why: 'last summer → Past Simple: went' },
    { lv: 'A2', t: 'choice', q: 'This test is ___ than the last one.', o: ['easy', 'easier', 'the easiest'], a: 1, why: 'сравнение двух → easier than' },
    { lv: 'A2', t: 'choice', q: 'Look! It ___.', o: ['rains', 'is raining', 'rained'], a: 1, why: 'Look! — прямо сейчас → Present Continuous' },
    { lv: 'A2', t: 'choice', q: 'I ___ visit my grandma tomorrow — I already have the tickets.', o: ['am going to', 'going to', 'go'], a: 0, why: 'план, решённый заранее → am going to' },
    { lv: 'A2', t: 'choice', q: 'There isn’t ___ milk in the fridge.', o: ['some', 'any', 'a'], a: 1, why: 'в отрицании → any' },
    { lv: 'B1', t: 'choice', q: 'I have never ___ sushi.', o: ['eat', 'ate', 'eaten'], a: 2, why: 'have + V3: eaten' },
    { lv: 'B1', t: 'choice', q: 'If it rains tomorrow, we ___ at home.', o: ['will stay', 'would stay', 'stayed'], a: 0, why: 'реальное условие: If + Present, will + V' },
    { lv: 'B1', t: 'choice', q: 'You ___ wear a seatbelt in a car. It’s the law.', o: ['must', 'might', 'can'], a: 0, why: 'обязанность по правилам → must' },
    { lv: 'B1', t: 'choice', q: 'This bridge ___ in 1990.', o: ['built', 'was built', 'has built'], a: 1, why: 'мост построили (пассив) → was built' },
    { lv: 'B1', t: 'choice', q: 'She said that she ___ tired.', o: ['is', 'was', 'be'], a: 1, why: 'косвенная речь после said → is превращается в was' },
    { lv: 'B2', t: 'choice', q: 'If I had known about the exam, I ___ harder.', o: ['would study', 'would have studied', 'will study'], a: 1, why: 'нереальное прошлое → would have + V3' },
    { lv: 'B2', t: 'choice', q: 'I wish I ___ more free time.', o: ['have', 'had', 'will have'], a: 1, why: 'сожаление о настоящем: wish + Past' },
    { lv: 'B2', t: 'choice', q: 'He isn’t answering his phone. He ___ be asleep.', o: ['must', 'mustn’t', 'has to'], a: 0, why: 'уверенный вывод → must be' },
    { lv: 'B2', t: 'choice', q: 'By next June, I ___ all my exams.', o: ['will finish', 'will have finished', 'finish'], a: 1, why: 'к моменту в будущем → Future Perfect' },
    { lv: 'B2', t: 'choice', q: 'I’m looking forward to ___ you.', o: ['see', 'seeing', 'have seen'], a: 1, why: 'look forward to + -ing' }
  ];

  window.EXTRA.dialogs = [
    {
      id: 'cafe', title: 'В кафе', en: 'At the café', lv: 'A1', icon: 'food', pal: 2, who: 'Бариста',
      intro: 'Ты в кафе в Лондоне. Закажи напиток и что-нибудь поесть.',
      steps: [
        { npc: 'Hi! What can I get you?', ru: 'Привет! Что вам предложить?' },
        { me: [['Can I have a cappuccino, please?', 1, 'Идеально: Can I have…, please? — вежливый заказ.'], ['I want coffee now.', 0, 'Звучит резко. В кафе говорят: Can I have… / I’d like…, please.'], ['I am a cappuccino.', 0, '«Я — капучино» :) Нужно: Can I have a cappuccino?']] },
        { npc: 'Sure. Small or large?', ru: 'Конечно. Маленький или большой?' },
        { me: [['Small, please.', 1, 'Коротко и вежливо.'], ['Yes, please.', 0, 'Тебе предложили выбор: small или large. «Yes» здесь не ответ.'], ['I am small.', 0, '«Я маленький» :) Скажи просто: Small, please.']] },
        { npc: 'Anything else?', ru: 'Что-нибудь ещё?' },
        { me: [['Yes, a chocolate muffin, please.', 1, 'Отлично: просто назови, что хочешь, + please.'], ['Anything, please.', 0, 'Anything — «что угодно». Назови, что хочешь: a muffin, please.'], ['Yes, I’d like eat a muffin.', 0, 'После would like нужно to: I’d like to eat… Но проще: A muffin, please.']] },
        { npc: 'That’s £5.40. Is that to eat in or to take away?', ru: 'С вас 5,40 фунта. Здесь или с собой?' },
        { me: [['To eat in, please.', 1, 'eat in — здесь, take away — с собой.'], ['To eat out, please.', 0, 'eat out — «есть в ресторане» вообще. Здесь: eat in или take away.'], ['Five forty, please.', 0, 'Это повтор цены. Тебя спросили: здесь или с собой?']] },
        { npc: 'Here you are. Enjoy!', ru: 'Пожалуйста. Приятного аппетита!' },
        { me: [['Thank you!', 1, 'Просто и тепло.'], ['You’re welcome!', 0, 'You’re welcome отвечают на «спасибо». Тут благодаришь ты: Thank you!'], ['Enjoy too!', 0, 'Так не говорят. Просто: Thank you! / Thanks!']] }
      ],
      phrases: [['Can I have …, please?', 'Можно мне …?'], ['Small or large?', 'Маленький или большой?'], ['Anything else?', 'Что-нибудь ещё?'], ['to eat in / to take away', 'здесь / с собой'], ['Here you are.', 'Вот, пожалуйста.']]
    },
    {
      id: 'friend', title: 'Новый знакомый', en: 'Meeting someone new', lv: 'A1', icon: 'wave', pal: 1, who: 'Том',
      intro: 'Ты на дне рождения у одноклассницы Ани. К тебе подходит парень, которого ты ещё не знаешь.',
      steps: [
        { npc: 'Hi! I’m Tom. What’s your name?', ru: 'Привет! Я Том. Как тебя зовут?' },
        { me: [['Hi, Tom! I’m Max. Nice to meet you.', 1, 'Идеально: имя + Nice to meet you.'], ['My name Max.', 0, 'Пропущен глагол: My name is Max.'], ['I have Max years.', 0, 'Так говорят о возрасте, и то неправильно :) Имя: I’m Max / My name is Max.']] },
        { npc: 'Nice to meet you too! Where are you from?', ru: 'Мне тоже приятно! Откуда ты?' },
        { me: [['I’m from Ukraine, but I live in Poland now.', 1, 'Отлично: I’m from… + where you live now.'], ['I am in Ukraine from.', 0, 'Порядок слов: I’m from Ukraine.'], ['From I Ukraine.', 0, 'Нужно: I’m from Ukraine.']] },
        { npc: 'Cool! How do you know Ania?', ru: 'Круто! Откуда ты знаешь Аню?' },
        { me: [['We’re classmates.', 1, 'Коротко и понятно.'], ['She is my classmates.', 0, 'Одна одноклассница — classmate: She is my classmate.'], ['I know Ania since 2023.', 0, 'С since нужно Present Perfect: I’ve known her since 2023. Проще: We’re classmates.']] },
        { npc: 'What do you do in your free time?', ru: 'Чем занимаешься в свободное время?' },
        { me: [['I play football and I love music.', 1, 'Present Simple для привычек — то, что нужно.'], ['I playing football.', 0, 'Нужно I play — это привычка, Present Simple.'], ['I free time football.', 0, 'Нет глагола: I play football in my free time.']] },
        { npc: 'Me too! Let’s play together sometime.', ru: 'Я тоже! Давай как-нибудь сыграем вместе.' },
        { me: [['Sure, sounds great!', 1, 'Так отвечают на предложение.'], ['No, thank you, I’m fine.', 0, 'I’m fine — ответ на «как дела». На предложение: Sounds great! / Sure!'], ['Yes, I am.', 0, 'Это не ответ на предложение. Скажи: Sure! / Sounds great!']] }
      ],
      phrases: [['Nice to meet you.', 'Приятно познакомиться.'], ['Where are you from?', 'Откуда ты?'], ['We’re classmates.', 'Мы одноклассники.'], ['in my free time', 'в свободное время'], ['Sounds great!', 'Звучит отлично!']]
    },
    {
      id: 'shop', title: 'В магазине одежды', en: 'Clothes shopping', lv: 'A1', icon: 'bag', pal: 9, who: 'Продавец',
      intro: 'Ты в магазине одежды и хочешь купить куртку.',
      steps: [
        { npc: 'Hello! Can I help you?', ru: 'Здравствуйте! Вам помочь?' },
        { me: [['Yes, I’m looking for a jacket.', 1, 'look for — искать; сейчас → I’m looking for…'], ['Yes, I look a jacket.', 0, 'Искать — look for, а сейчас — I’m looking for a jacket.'], ['No, I’m a jacket.', 0, '«Я куртка» :) Скажи: I’m looking for a jacket.']] },
        { npc: 'What size are you?', ru: 'Какой у вас размер?' },
        { me: [['Medium, I think.', 1, 'Размеры: small / medium / large.'], ['I’m seventeen years.', 0, 'Это возраст :) Размер: small / medium / large.'], ['Blue, please.', 0, 'Это цвет, а спросили размер.']] },
        { npc: 'Here you are. The fitting rooms are over there.', ru: 'Вот, пожалуйста. Примерочные — вон там.' },
        { me: [['Thanks. Can I try it on?', 1, 'try it on — примерить (it стоит в середине).'], ['Can I try on it?', 0, 'С местоимением: try it on.'], ['Can I fitting?', 0, 'Нужен глагол: Can I try it on?']] },
        { npc: 'Of course! So, how does it fit?', ru: 'Конечно! Ну как, подходит?' },
        { me: [['It’s a bit small. Do you have it in large?', 1, 'a bit small — маловат; спросить другой размер — Do you have it in…?'], ['It’s very smallest.', 0, 'smallest — «самый маленький». Скажи: It’s a bit small.'], ['It fits me small.', 0, 'Так не говорят. It’s too small / a bit small.']] },
        { npc: 'Yes, here’s a large. It’s £45.', ru: 'Да, вот большой. 45 фунтов.' },
        { me: [['Perfect, I’ll take it.', 1, 'Решение прямо сейчас → I’ll take it.'], ['Perfect, I take it tomorrow.', 0, 'Ты решаешь сейчас: I’ll take it.'], ['How many is it?', 0, 'Про цену — How much is it? Но цену уже назвали.']] }
      ],
      phrases: [['I’m looking for…', 'Я ищу…'], ['What size are you?', 'Какой у вас размер?'], ['Can I try it on?', 'Можно примерить?'], ['It’s a bit small.', 'Немного маловат.'], ['I’ll take it.', 'Я возьму.']]
    },
    {
      id: 'airport', title: 'В аэропорту', en: 'At the airport', lv: 'A2', icon: 'plane', pal: 7, who: 'Сотрудник аэропорта',
      intro: 'Ты летишь в Лондон. Регистрация на рейс у стойки авиакомпании.',
      steps: [
        { npc: 'Good morning! Can I see your passport, please?', ru: 'Доброе утро! Можно ваш паспорт?' },
        { me: [['Sure, here you are.', 1, 'Here you are — «вот, пожалуйста», когда что-то передаёшь.'], ['Yes, I can.', 0, 'Это просьба, а не вопрос о возможности. Ответ: Here you are.'], ['No problem, see.', 0, 'Так не говорят. Here you are.']] },
        { npc: 'Thank you. Are you checking in any bags?', ru: 'Спасибо. Будете сдавать багаж?' },
        { me: [['Just this one suitcase.', 1, 'Коротко и точно.'], ['I check one bag yesterday.', 0, 'Речь о сейчас, без yesterday: Just this one suitcase.'], ['Yes, I’m checking.', 0, 'Скажи, что именно сдаёшь: One suitcase.']] },
        { npc: 'Did you pack it yourself?', ru: 'Вы собирали его сами?' },
        { me: [['Yes, I did.', 1, 'Вопрос с Did → короткий ответ Yes, I did.'], ['Yes, I do.', 0, 'Вопрос в прошедшем (Did you…?) → Yes, I did.'], ['Yes, it packed.', 0, 'Нужно: Yes, I did / Yes, I packed it myself.']] },
        { npc: 'Would you like a window or an aisle seat?', ru: 'Вам место у окна или у прохода?' },
        { me: [['A window seat, please.', 1, 'Выбери вариант + please.'], ['I would like sit near window.', 0, 'would like + to: I’d like to sit… Проще: A window seat, please.'], ['Yes, I would.', 0, 'Это выбор из двух — назови вариант.']] },
        { npc: 'Here’s your boarding pass. Boarding starts at 10:15 at gate 12.', ru: 'Вот ваш посадочный. Посадка начинается в 10:15 у выхода 12.' },
        { me: [['Thank you. Where is gate 12?', 1, 'Вопрос: Where is…?'], ['Thank you. Where gate 12 is?', 0, 'В вопросе is идёт перед подлежащим: Where is gate 12?'], ['What time is boarding?', 0, 'Время уже назвали — 10:15.']] },
        { npc: 'Go straight on and turn left after the shops. Have a nice flight!', ru: 'Идите прямо и поверните налево после магазинов. Приятного полёта!' }
      ],
      phrases: [['Here you are.', 'Вот, пожалуйста.'], ['to check in a bag', 'сдать багаж'], ['a window / an aisle seat', 'место у окна / у прохода'], ['boarding pass', 'посадочный талон'], ['gate', 'выход на посадку']]
    },
    {
      id: 'hotel', title: 'В отеле', en: 'Hotel check-in', lv: 'A2', icon: 'home', pal: 5, who: 'Администратор',
      intro: 'Ты приехал в отель, где заранее забронировал номер.',
      steps: [
        { npc: 'Good evening. Welcome to the Riverside Hotel. How can I help?', ru: 'Добрый вечер. Добро пожаловать в отель «Риверсайд». Чем могу помочь?' },
        { me: [['Hi, I have a reservation. My name is Max Koval.', 1, 'I have a reservation — «у меня бронь».'], ['Hi, I want a key.', 0, 'Сначала скажи о брони: I have a reservation.'], ['Hi, I reservation a room.', 0, 'reservation — существительное: I have a reservation.']] },
        { npc: 'Yes, I’ve found it. A single room for two nights, is that right?', ru: 'Да, нашёл. Одноместный номер на две ночи, верно?' },
        { me: [['Yes, that’s right.', 1, 'Подтверждаем: Yes, that’s right.'], ['No, two nights.', 0, 'Ты подтверждаешь то же самое — значит Yes, that’s right.'], ['Yes, it’s right two.', 0, 'Скажи просто: Yes, that’s right.']] },
        { npc: 'Great. Breakfast is from 7 to 10 in the restaurant.', ru: 'Отлично. Завтрак с 7 до 10 в ресторане.' },
        { me: [['Is breakfast included?', 1, 'included — включён (в цену).'], ['Is breakfast include?', 0, 'Нужна форма V3: Is breakfast included?'], ['What is breakfast?', 0, 'Спроси, входит ли завтрак в цену: Is breakfast included?']] },
        { npc: 'Yes, it is. Here’s your key card. Your room is on the third floor.', ru: 'Да. Вот ваша карта-ключ. Ваш номер на третьем этаже.' },
        { me: [['Thanks. What’s the Wi-Fi password?', 1, 'Про пароль: What’s the password?'], ['Thanks. How is the Wi-Fi password?', 0, 'Про пароль спрашивают What’s…?, а не How.'], ['Thanks. Where is the third?', 0, 'Этаж уже назвали. Спроси что-то новое.']] },
        { npc: 'It’s on the card. Enjoy your stay!', ru: 'Он на карте. Приятного пребывания!' },
        { me: [['Thank you, have a good evening!', 1, 'Вежливое завершение разговора.'], ['You too stay!', 0, 'Так не говорят. Thank you! Have a good evening!'], ['Thank you, goodbye night!', 0, 'Скажи: Have a good evening! / Good night!']] }
      ],
      phrases: [['I have a reservation.', 'У меня бронь.'], ['a single / a double room', 'одноместный / двухместный номер'], ['Is breakfast included?', 'Завтрак включён?'], ['key card', 'карта-ключ'], ['Enjoy your stay!', 'Приятного пребывания!']]
    },
    {
      id: 'doctor', title: 'У врача', en: 'At the doctor’s', lv: 'A2', icon: 'heart', pal: 9, who: 'Врач',
      intro: 'Ты заболел и пришёл к врачу.',
      steps: [
        { npc: 'Hello, please sit down. What seems to be the problem?', ru: 'Здравствуйте, присаживайтесь. На что жалуетесь?' },
        { me: [['I’ve got a sore throat and a headache.', 1, 'sore throat — болит горло, headache — головная боль.'], ['I have pain in my all body very.', 0, 'Порядок слов: My whole body hurts. Лучше назвать симптомы.'], ['I’m a problem.', 0, '«Я — проблема» :) Назови симптомы: I’ve got a headache.']] },
        { npc: 'How long have you had it?', ru: 'Как давно это у вас?' },
        { me: [['Since Monday.', 1, 'since + момент: since Monday.'], ['For Monday.', 0, 'С моментом во времени — since. for — для периода: for three days.'], ['Two days ago I have.', 0, 'Скажи: Since Monday / For two days.']] },
        { npc: 'Do you have a temperature?', ru: 'У вас есть температура?' },
        { me: [['Yes, 38 degrees this morning.', 1, 'Температура: 38 degrees.'], ['Yes, I have 38 years.', 0, 'years — это возраст :) Температура: 38 degrees.'], ['Yes, it’s hot weather.', 0, 'Это про погоду, а не про тебя.']] },
        { npc: 'OK. It’s probably a cold. Drink plenty of water and take this medicine twice a day.', ru: 'Понятно. Скорее всего, простуда. Пейте много воды и принимайте это лекарство два раза в день.' },
        { me: [['Should I stay at home?', 1, 'should + глагол без to.'], ['Must I to stay at home?', 0, 'После must/should — без to: Should I stay at home?'], ['I stay home yes?', 0, 'Задай вопрос: Should I stay at home?']] },
        { npc: 'Yes, rest for two or three days. Get well soon!', ru: 'Да, отдохните два-три дня. Выздоравливайте!' },
        { me: [['Thank you, doctor.', 1, 'Вежливо.'], ['Thank you, you too!', 0, '«Выздоравливайте» говорят тебе — you too здесь не нужно.'], ['OK, bye soon doctor!', 0, 'Скажи просто: Thank you, doctor.']] }
      ],
      phrases: [['What seems to be the problem?', 'На что жалуетесь?'], ['I’ve got a sore throat.', 'У меня болит горло.'], ['since Monday / for two days', 'с понедельника / два дня'], ['twice a day', 'два раза в день'], ['Get well soon!', 'Выздоравливай!']]
    },
    {
      id: 'directions', title: 'Как пройти?', en: 'Asking for directions', lv: 'A2', icon: 'map', pal: 3, who: 'Прохожая',
      intro: 'Ты в незнакомом городе и ищешь вокзал.',
      steps: [
        { me: [['Excuse me, how do I get to the train station?', 1, 'Excuse me… — вежливое начало.'], ['Hey! Where train?', 0, 'Невежливо и без глагола. Начни с Excuse me…'], ['Excuse me, where is train station is?', 0, 'is дважды. Правильно: Where is the train station?']] },
        { npc: 'Go straight on and take the second turning on the left.', ru: 'Идите прямо и сверните на второй поворот налево.' },
        { me: [['The second on the left. Is it far?', 1, 'Повторить, чтобы запомнить, — хорошая привычка.'], ['Second left far?', 0, 'Нужен полный вопрос: Is it far?'], ['Is it a far?', 0, 'far — не существительное: Is it far?']] },
        { npc: 'No, it’s about five minutes on foot.', ru: 'Нет, минут пять пешком.' },
        { me: [['Great. Is there a café near the station?', 1, 'Is there a…? — есть ли…?'], ['Is there cafés near?', 0, 'Одно — Is there a café…? Много — Are there any cafés…?'], ['Has a café near station?', 0, '«Есть» = there is: Is there a café near the station?']] },
        { npc: 'Yes, there’s one opposite the entrance.', ru: 'Да, есть одно напротив входа.' },
        { me: [['Thank you so much!', 1, 'Тёплое «спасибо».'], ['Thank you so many!', 0, 'Правильно: Thank you so much!'], ['Please!', 0, 'please — это просьба. Благодарят: Thank you!']] },
        { npc: 'No problem. Have a good day!', ru: 'Не за что. Хорошего дня!' }
      ],
      phrases: [['Excuse me, how do I get to…?', 'Извините, как пройти к…?'], ['Go straight on.', 'Идите прямо.'], ['the second turning on the left', 'второй поворот налево'], ['on foot', 'пешком'], ['opposite', 'напротив']]
    },
    {
      id: 'interview', title: 'Собеседование', en: 'A job interview', lv: 'B1', icon: 'case', pal: 0, who: 'Менеджер',
      intro: 'Ты проходишь собеседование на летнюю работу в международном кафе.',
      steps: [
        { npc: 'Thanks for coming. Could you tell me a little about yourself?', ru: 'Спасибо, что пришли. Расскажите немного о себе.' },
        { me: [['Sure. I’m 17, I study at a lyceum and I’ve volunteered at a youth centre for two years.', 1, 'Про опыт, который длится до сих пор, — Present Perfect: I’ve volunteered for two years.'], ['Sure. I am study at lyceum and I volunteer two years.', 0, 'Ошибки: I study (без am); опыт до сих пор — I’ve volunteered for two years.'], ['Yes, I could.', 0, 'Это вежливая просьба рассказать о себе — не отвечай Yes, I could.']] },
        { npc: 'Why do you want to work here?', ru: 'Почему вы хотите работать у нас?' },
        { me: [['I enjoy working with people and I’d like to improve my English.', 1, 'enjoy + -ing, would like + to.'], ['I enjoy to work with people.', 0, 'После enjoy — -ing: I enjoy working.'], ['Because money.', 0, 'Слишком прямо и без глагола. Расскажи о своей мотивации.']] },
        { npc: 'Have you ever worked in a team?', ru: 'Вы когда-нибудь работали в команде?' },
        { me: [['Yes, I have. Last year I organised a charity event with my classmates.', 1, 'Yes, I have — ответ на Have you ever…? А детали с last year — в Past Simple.'], ['Yes, I have worked last year in a team.', 0, 'С last year — Past Simple: I worked in a team last year.'], ['Yes, I ever worked.', 0, 'ever — только в вопросах. Ответ: Yes, I have.']] },
        { npc: 'What would you do if a customer was rude to you?', ru: 'Что бы вы сделали, если бы клиент вам нагрубил?' },
        { me: [['I would stay calm and try to solve the problem politely.', 1, 'would + глагол без to — и отличный ответ для работодателя.'], ['I would to call the manager.', 0, 'После would — без to: I would call the manager.'], ['I will be rude too.', 0, 'Плохая идея для собеседования :) И в гипотезе нужно would.']] },
        { npc: 'Great answers. Do you have any questions for us?', ru: 'Отличные ответы. У вас есть вопросы к нам?' },
        { me: [['Yes — what would a typical day look like?', 1, 'Вопрос о работе показывает интерес.'], ['No. When I get money?', 0, 'Невежливо и с ошибкой (When will I get paid?). Лучше спроси о работе.'], ['Yes, how old are you?', 0, 'Неуместный вопрос :)']] },
        { npc: 'Good question! We’ll call you by Friday. Thank you for your time.', ru: 'Хороший вопрос! Мы позвоним вам до пятницы. Спасибо за ваше время.' }
      ],
      phrases: [['Could you tell me about yourself?', 'Расскажите о себе.'], ['I enjoy working with people.', 'Мне нравится работать с людьми.'], ['Have you ever…?', 'Вы когда-нибудь…?'], ['I would stay calm.', 'Я бы сохранял спокойствие.'], ['Do you have any questions for us?', 'У вас есть вопросы к нам?']]
    }
  ];

  /* what the mascot Lexi says */
  window.EXTRA.lexi = {
    ok: ['Супер!', 'Так держать!', 'Чётко!', 'Вот это да!', 'Ты лучший!', 'Красиво!'],
    bad: ['Не страшно — запомним!', 'Ошибка — это опыт.', 'Почти! Глянь правильный ответ.', 'Бывает. Дальше будет легче.'],
    daily: ['Пять заданий — и серия не сгорит!', 'Две минуты — и мозг в тонусе.', 'Сегодняшнее задание уже ждёт тебя!'],
    done: ['На сегодня всё! Возвращайся завтра.', 'Задание дня выполнено. Горжусь!', 'Серия продолжается — ты молодец!']
  };
})();
