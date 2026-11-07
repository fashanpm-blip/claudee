/* LevelUp English — course content.
   Exercise types:
     choice : {t, q, o:[options], a:index, why}
     input  : {t, q, a:[accepted answers], why}            — type the missing part
     tr     : {t, ru, a:[accepted translations], why}       — translate the whole sentence
     order  : {t, ru, a:'Sentence in correct order', x:[distractor words], why}
   Every lesson also gets a vocabulary "match" and a "listen" exercise built from its own data. */
window.COURSE = [
  /* ===================================================== LEVEL 1 */
  {
    id: 'a1', code: 'A1', name: 'Основа', about: 'to be, артикли, местоимения, there is/are',
    lessons: [
      {
        id: 'a1-1', title: 'to be: am / is / are', short: 'Глагол «быть» — основа любого предложения',
        rules: [
          { h: 'Формы', t: 'I **am** · he / she / it **is** · we / you / they **are**. В русском «быть» в настоящем часто пропускается, в английском — никогда: «Я студент» = I **am** a student.' },
          { h: 'Отрицание', t: 'Ставим **not** после глагола: I am **not**, he is **not** (isn’t), they are **not** (aren’t).' },
          { h: 'Вопрос', t: 'Глагол выходит вперёд: **Are** you ready? **Is** she at home?' }
        ],
        formula: 'Кто + am/is/are + кто/какой/где',
        ex: [['I am a student.', 'Я студент.'], ['She is tired.', 'Она устала.'], ['We are not late.', 'Мы не опаздываем.'], ['Is he your brother?', 'Он твой брат?']],
        tip: 'Не теряй глагол: «He happy» — ошибка. Правильно: He **is** happy.',
        vocab: [['student', 'студент'], ['teacher', 'учитель'], ['friend', 'друг'], ['tired', 'уставший'], ['happy', 'счастливый'], ['hungry', 'голодный'], ['ready', 'готовый'], ['late', 'поздно, опаздывающий']],
        tasks: [
          { t: 'choice', q: 'She ___ a teacher.', o: ['am', 'is', 'are'], a: 1, why: 'she → is' },
          { t: 'choice', q: 'We ___ friends.', o: ['is', 'am', 'are'], a: 2, why: 'we → are' },
          { t: 'input', q: 'I ___ hungry. (быть)', a: ['am', "'m"], why: 'I → am' },
          { t: 'input', q: 'They ___ at home. (не быть)', a: ["aren't", 'are not'], why: 'they → are not / aren’t' },
          { t: 'choice', q: '___ you ready?', o: ['Is', 'Are', 'Am'], a: 1, why: 'В вопросе глагол впереди: Are you…?' },
          { t: 'tr', ru: 'Я не голоден.', a: ["I am not hungry", "I'm not hungry"], why: 'I am not = I’m not' },
          { t: 'order', ru: 'Он мой друг.', a: 'He is my friend', x: ['are'], why: 'He + is + my friend' },
          { t: 'tr', ru: 'Ты готов?', a: ['Are you ready'], why: 'Вопрос: Are you…?' }
        ]
      },
      {
        id: 'a1-2', title: 'a / an / the и множественное число', short: 'Когда ставить артикль и как сделать «много»',
        rules: [
          { h: 'a / an — «один, какой-то»', t: '**a** перед согласным звуком (a book, a university), **an** — перед гласным звуком (an apple, an hour). Важно звучание, а не буква.' },
          { h: 'the — «тот самый»', t: 'Когда понятно, о чём речь, или предмет единственный: **the** sun, Close **the** door.' },
          { h: 'Множественное число', t: '+**s** (books), +**es** после s, sh, ch, x (buses, boxes), согласная + y → **ies** (city → cities). Исключения: man → **men**, woman → **women**, child → **children**, person → **people**, foot → **feet**, tooth → **teeth**.' }
        ],
        formula: 'a + согласный звук · an + гласный звук · the + известный предмет',
        ex: [['I have a cat and an umbrella.', 'У меня есть кошка и зонт.'], ['The sun is hot.', 'Солнце горячее.'], ['Two children and three men.', 'Двое детей и трое мужчин.'], ['She is an engineer.', 'Она инженер.']],
        tip: 'Профессия — всегда с a/an: She is **a** doctor. По-русски артикля нет, поэтому его легко забыть.',
        vocab: [['apple', 'яблоко'], ['umbrella', 'зонт'], ['hour', 'час'], ['city', 'город'], ['child / children', 'ребёнок / дети'], ['person / people', 'человек / люди'], ['box', 'коробка'], ['engineer', 'инженер']],
        tasks: [
          { t: 'choice', q: 'It is ___ apple.', o: ['a', 'an', 'the'], a: 1, why: 'apple начинается с гласного звука → an' },
          { t: 'choice', q: 'Wait ___ hour, please.', o: ['a', 'an'], a: 1, why: 'В hour «h» не читается: [ауэ] → an' },
          { t: 'choice', q: 'She studies at ___ university.', o: ['a', 'an'], a: 0, why: 'university звучит [ю] — это согласный звук → a' },
          { t: 'input', q: 'one child — two ___', a: ['children'], why: 'child → children (исключение)' },
          { t: 'input', q: 'one city — three ___', a: ['cities'], why: 'согласная + y → ies' },
          { t: 'input', q: 'one box — five ___', a: ['boxes'], why: 'после x → es' },
          { t: 'tr', ru: 'Он инженер.', a: ['He is an engineer', "He's an engineer"], why: 'Профессия с артиклем: an engineer' },
          { t: 'order', ru: 'Закрой дверь.', a: 'Close the door', x: ['a'], why: 'Понятно, какая дверь → the' }
        ]
      },
      {
        id: 'a1-3', title: 'Местоимения и чьё это', short: 'my / your / his… и Anna’s book',
        rules: [
          { h: 'Притяжательные', t: 'I → **my**, you → **your**, he → **his**, she → **her**, it → **its**, we → **our**, they → **their**.' },
          { h: '’s — «чей»', t: 'Имя + **’s**: Anna**’s** phone = телефон Анны. Во множественном числе после s — только апостроф: my parents**’** house.' },
          { h: 'this / that / these / those', t: '**this** — это (близко, 1), **these** — эти (близко, много), **that** — то (далеко, 1), **those** — те (далеко, много).' }
        ],
        formula: 'my/your/his/her/its/our/their + существительное',
        ex: [['This is my sister.', 'Это моя сестра.'], ['Their car is red.', 'Их машина красная.'], ['Is this Tom’s bag?', 'Это сумка Тома?'], ['Those shoes are new.', 'Те туфли новые.']],
        tip: '**its** (его — о предмете/животном) ≠ **it’s** (it is). The dog wants **its** food.',
        vocab: [['sister', 'сестра'], ['brother', 'брат'], ['parents', 'родители'], ['bag', 'сумка'], ['phone', 'телефон'], ['car', 'машина'], ['shoes', 'обувь, туфли'], ['new', 'новый']],
        tasks: [
          { t: 'choice', q: 'Kate and Tom love ___ dog.', o: ['they', 'their', 'there'], a: 1, why: 'их → their' },
          { t: 'choice', q: 'He is doing ___ homework.', o: ['his', 'her', 'he'], a: 0, why: 'его → his' },
          { t: 'choice', q: '___ books here are mine.', o: ['This', 'These', 'That'], a: 1, why: 'books — много и рядом → these' },
          { t: 'input', q: 'Это телефон Анны: This is ___ phone.', a: ["anna's"], why: 'Имя + ’s' },
          { t: 'choice', q: 'The cat is eating ___ food.', o: ["it's", 'its'], a: 1, why: 'its — притяжательное (его/её о животном)' },
          { t: 'tr', ru: 'Это моя сестра.', a: ['This is my sister'], why: 'This is + my sister' },
          { t: 'order', ru: 'Их машина новая.', a: 'Their car is new', x: ['they'], why: 'Their + car + is + new' },
          { t: 'tr', ru: 'Те туфли новые.', a: ['Those shoes are new'], why: 'далеко и много → those' }
        ]
      },
      {
        id: 'a1-4', title: 'there is / there are, some / any', short: 'Как сказать «есть, находится»',
        rules: [
          { h: 'Есть / имеется', t: '**There is** + один предмет, **there are** + много: There is a bank near here. There are two cafés.' },
          { h: 'Вопрос и отрицание', t: '**Is there** a shop? — Yes, there is. There **isn’t** any milk. **Are there** any chairs?' },
          { h: 'some / any', t: '**some** — в утверждениях (some water), **any** — в вопросах и отрицаниях (any water?).' }
        ],
        formula: 'There is + один · There are + много',
        ex: [['There is a park near my house.', 'Рядом с моим домом есть парк.'], ['There are some eggs in the fridge.', 'В холодильнике есть яйца.'], ['Is there any milk?', 'Молоко есть?'], ['There aren’t any chairs.', 'Стульев нет.']],
        tip: 'Русское «В комнате есть стол» начинаем с конца: **There is** a table in the room.',
        vocab: [['park', 'парк'], ['shop', 'магазин'], ['milk', 'молоко'], ['eggs', 'яйца'], ['fridge', 'холодильник'], ['chair', 'стул'], ['near', 'рядом с'], ['room', 'комната']],
        tasks: [
          { t: 'choice', q: 'There ___ two cafés in our street.', o: ['is', 'are'], a: 1, why: 'two cafés — много → are' },
          { t: 'choice', q: 'There ___ a bank near here.', o: ['is', 'are'], a: 0, why: 'a bank — один → is' },
          { t: 'choice', q: 'Is there ___ milk?', o: ['some', 'any'], a: 1, why: 'вопрос → any' },
          { t: 'choice', q: 'I have ___ apples.', o: ['some', 'any'], a: 0, why: 'утверждение → some' },
          { t: 'input', q: '___ there any chairs in the room?', a: ['are'], why: 'chairs — много → Are there…?' },
          { t: 'tr', ru: 'Рядом есть магазин.', a: ['There is a shop near here', "There's a shop near here", 'There is a shop nearby', "There's a shop nearby"], why: 'There is + a shop' },
          { t: 'order', ru: 'В холодильнике есть яйца.', a: 'There are some eggs in the fridge', x: ['is'], why: 'eggs — много → There are' },
          { t: 'tr', ru: 'Молока нет.', a: ["There isn't any milk", 'There is not any milk', 'There is no milk', "There's no milk"], why: 'отрицание: isn’t any / is no' }
        ]
      }
    ]
  },
  /* ===================================================== LEVEL 2 */
  {
    id: 'a1p', code: 'A1+', name: 'Каждый день', about: 'Present Simple, частота, can',
    lessons: [
      {
        id: 'a1p-1', title: 'Present Simple: утверждение', short: 'Привычки, факты, расписание',
        rules: [
          { h: 'Когда', t: 'То, что происходит **регулярно** или всегда правда: I **work** every day. Water **boils** at 100°C.' },
          { h: 'he / she / it + s', t: 'В 3-м лице ед. числа добавляем **-s**: she work**s**. После s, sh, ch, x, o → **-es** (watch**es**, go**es**). Согласная + y → **-ies** (stud**ies**). **have → has**.' }
        ],
        formula: 'I/you/we/they + V · he/she/it + V-s',
        ex: [['I get up at seven.', 'Я встаю в семь.'], ['She works in a bank.', 'Она работает в банке.'], ['He watches TV every evening.', 'Он смотрит телевизор каждый вечер.'], ['My brother has a bike.', 'У моего брата есть велосипед.']],
        tip: 'Самая частая ошибка — потерянная **-s**: He like**s** music, а не He like music.',
        vocab: [['get up', 'вставать'], ['work', 'работать'], ['study', 'учиться'], ['watch', 'смотреть'], ['every day', 'каждый день'], ['breakfast', 'завтрак'], ['bike', 'велосипед'], ['evening', 'вечер']],
        tasks: [
          { t: 'choice', q: 'She ___ in a bank.', o: ['work', 'works', 'working'], a: 1, why: 'she → works' },
          { t: 'input', q: 'He ___ (watch) TV every evening.', a: ['watches'], why: 'ch → es: watches' },
          { t: 'input', q: 'My sister ___ (study) English.', a: ['studies'], why: 'y → ies: studies' },
          { t: 'input', q: 'Tom ___ (have) a bike.', a: ['has'], why: 'have → has' },
          { t: 'choice', q: 'We ___ breakfast at eight.', o: ['have', 'has'], a: 0, why: 'we → have' },
          { t: 'tr', ru: 'Я встаю в семь.', a: ['I get up at seven', 'I get up at 7', "I get up at seven o'clock"], why: 'get up at seven' },
          { t: 'order', ru: 'Он учится каждый день.', a: 'He studies every day', x: ['study'], why: 'he → studies' },
          { t: 'tr', ru: 'Она любит музыку.', a: ['She likes music', 'She loves music'], why: 'she → likes' }
        ]
      },
      {
        id: 'a1p-2', title: 'Present Simple: вопрос и отрицание', short: 'do / does — помощники',
        rules: [
          { h: 'Отрицание', t: 'I/you/we/they **don’t** + V. He/she/it **doesn’t** + V. После doesn’t **s уже не нужна**: She doesn’t like**_** tea.' },
          { h: 'Вопрос', t: '**Do** you speak English? **Does** he live here? Короткий ответ: Yes, I do. / No, he doesn’t.' },
          { h: 'Вопросительные слова', t: 'Ставим впереди: **Where** do you live? **What** does she do?' }
        ],
        formula: 'Do/Does + кто + V? · don’t/doesn’t + V',
        ex: [['I don’t eat meat.', 'Я не ем мясо.'], ['Does she speak Polish?', 'Она говорит по-польски?'], ['Where do you live?', 'Где ты живёшь?'], ['He doesn’t drive.', 'Он не водит машину.']],
        tip: '«s» живёт только в одном месте: **does** или глагол. Does she **likes**? — ошибка. Правильно: Does she **like**?',
        vocab: [['speak', 'говорить (на языке)'], ['live', 'жить'], ['eat', 'есть'], ['meat', 'мясо'], ['drive', 'водить'], ['tea', 'чай'], ['understand', 'понимать'], ['know', 'знать']],
        tasks: [
          { t: 'choice', q: '___ she speak Polish?', o: ['Do', 'Does', 'Is'], a: 1, why: 'she → Does' },
          { t: 'choice', q: 'They ___ eat meat.', o: ["doesn't", "don't", 'not'], a: 1, why: 'they → don’t' },
          { t: 'choice', q: 'He doesn’t ___ tea.', o: ['like', 'likes'], a: 0, why: 'после doesn’t — без s' },
          { t: 'input', q: '___ do you live? (где)', a: ['where'], why: 'Где → Where' },
          { t: 'input', q: 'I ___ understand. (не)', a: ["don't", 'do not'], why: 'I → don’t' },
          { t: 'tr', ru: 'Ты говоришь по-английски?', a: ['Do you speak English'], why: 'Do + you + speak' },
          { t: 'order', ru: 'Она не водит машину.', a: "She doesn't drive", x: ['drives', "don't"], why: 'doesn’t + drive (без s)' },
          { t: 'tr', ru: 'Что он делает (по работе)?', a: ['What does he do'], why: 'What does he do?' }
        ]
      },
      {
        id: 'a1p-3', title: 'Как часто и когда', short: 'always / never и предлоги at / on / in',
        rules: [
          { h: 'Частота', t: '**always** (всегда) → **usually** (обычно) → **often** (часто) → **sometimes** (иногда) → **never** (никогда).' },
          { h: 'Место в предложении', t: '**Перед** основным глаголом: I **often** read. Но **после** am/is/are: She is **always** late.' },
          { h: 'Предлоги времени', t: '**at** + час (at 5 o’clock, at night), **on** + день/дата (on Monday, on 5 May), **in** + месяц/год/часть дня (in July, in 2026, in the morning).' }
        ],
        formula: 'кто + always/often… + глагол · be + always/often…',
        ex: [['I usually get up at seven.', 'Я обычно встаю в семь.'], ['She is never late.', 'Она никогда не опаздывает.'], ['We play football on Sundays.', 'Мы играем в футбол по воскресеньям.'], ['My birthday is in May.', 'Мой день рождения в мае.']],
        tip: 'После never не нужно not: I **never** eat fish (не «I don’t never…»).',
        vocab: [['always', 'всегда'], ['usually', 'обычно'], ['often', 'часто'], ['sometimes', 'иногда'], ['never', 'никогда'], ['Monday', 'понедельник'], ['weekend', 'выходные'], ['morning', 'утро']],
        tasks: [
          { t: 'choice', q: 'See you ___ Monday!', o: ['at', 'on', 'in'], a: 1, why: 'день недели → on' },
          { t: 'choice', q: 'The film starts ___ 8 o’clock.', o: ['at', 'on', 'in'], a: 0, why: 'час → at' },
          { t: 'choice', q: 'I was born ___ 2008.', o: ['at', 'on', 'in'], a: 2, why: 'год → in' },
          { t: 'order', ru: 'Я обычно читаю вечером.', a: 'I usually read in the evening', x: ['on'], why: 'usually перед глаголом; in the evening' },
          { t: 'order', ru: 'Она всегда опаздывает.', a: 'She is always late', x: ['does'], why: 'после is → always' },
          { t: 'input', q: 'I ___ eat fish. (никогда)', a: ['never'], why: 'never + глагол, без not' },
          { t: 'tr', ru: 'Мы играем в футбол по воскресеньям.', a: ['We play football on Sundays', 'We play football on Sunday'], why: 'on Sundays' },
          { t: 'choice', q: 'He ___ coffee in the morning.', o: ['drinks often', 'often drinks', 'often drink'], a: 1, why: 'often перед глаголом; he → drinks' }
        ]
      },
      {
        id: 'a1p-4', title: 'can / can’t и просьбы', short: 'Умею, могу, можно?',
        rules: [
          { h: 'Умение и возможность', t: 'can + глагол **без to**: I **can swim**. Для всех лиц одинаково: she **can** (не cans).' },
          { h: 'Отрицание и вопрос', t: 'can’t / cannot: I **can’t** drive. Вопрос: **Can** you help me?' },
          { h: 'Вежливо', t: '**Could** you…? — вежливее, чем Can you…? **Can I** have…? — можно мне…?' }
        ],
        formula: 'can + V (без to)',
        ex: [['I can play the guitar.', 'Я умею играть на гитаре.'], ['She can’t swim.', 'Она не умеет плавать.'], ['Can you help me?', 'Можешь мне помочь?'], ['Could you open the window, please?', 'Не могли бы вы открыть окно?']],
        tip: 'Не ставь to после can: I can **to** swim — ошибка.',
        vocab: [['swim', 'плавать'], ['help', 'помогать'], ['play the guitar', 'играть на гитаре'], ['open', 'открывать'], ['window', 'окно'], ['cook', 'готовить'], ['please', 'пожалуйста'], ['borrow', 'одолжить (взять)']],
        tasks: [
          { t: 'choice', q: 'She ___ swim very well.', o: ['can', 'cans', 'can to'], a: 0, why: 'can одинаково для всех, без to' },
          { t: 'choice', q: '___ you help me, please?', o: ['Do', 'Can', 'Are'], a: 1, why: 'просьба: Can you…?' },
          { t: 'input', q: 'I ___ drive. I’m only 15. (не уметь)', a: ["can't", 'cannot', 'can not'], why: 'can’t / cannot' },
          { t: 'tr', ru: 'Я умею готовить.', a: ['I can cook'], why: 'can + cook' },
          { t: 'order', ru: 'Можно мне воды?', a: 'Can I have some water', x: ['to'], why: 'Can I have…?' },
          { t: 'tr', ru: 'Ты можешь мне помочь?', a: ['Can you help me', 'Could you help me'], why: 'Can/Could you help me?' },
          { t: 'choice', q: 'Самая вежливая просьба:', o: ['Open the window.', 'Can you open the window?', 'Could you open the window, please?'], a: 2, why: 'Could + please — самый вежливый вариант' },
          { t: 'order', ru: 'Он не умеет плавать.', a: "He can't swim", x: ['to', "doesn't"], why: 'can’t + swim' }
        ]
      }
    ]
  },
  /* ===================================================== LEVEL 3 */
  {
    id: 'a2', code: 'A2', name: 'Прошлое', about: 'was/were, Past Simple, неправильные глаголы',
    lessons: [
      {
        id: 'a2-1', title: 'was / were', short: '«Был» в прошлом',
        rules: [
          { h: 'Формы', t: 'I / he / she / it **was** · we / you / they **were**.' },
          { h: 'Отрицание и вопрос', t: 'wasn’t / weren’t. **Were** you at school yesterday? — Yes, I was.' },
          { h: 'Слова прошлого', t: 'yesterday (вчера), last week (на прошлой неделе), two days **ago** (два дня назад).' }
        ],
        formula: 'I/he/she/it was · we/you/they were',
        ex: [['I was at home yesterday.', 'Вчера я был дома.'], ['They were very tired.', 'Они очень устали.'], ['Was the film good?', 'Фильм был хорошим?'], ['We weren’t late.', 'Мы не опоздали.']],
        tip: '**ago** ставится после срока: two days **ago**, а не «ago two days».',
        vocab: [['yesterday', 'вчера'], ['last week', 'на прошлой неделе'], ['ago', 'назад'], ['weather', 'погода'], ['party', 'вечеринка'], ['busy', 'занятой'], ['cold', 'холодный'], ['film', 'фильм']],
        tasks: [
          { t: 'choice', q: 'I ___ at home yesterday.', o: ['was', 'were'], a: 0, why: 'I → was' },
          { t: 'choice', q: 'They ___ at the party.', o: ['was', 'were'], a: 1, why: 'they → were' },
          { t: 'input', q: '___ you busy yesterday?', a: ['were'], why: 'you → Were you…?' },
          { t: 'input', q: 'The weather ___ good. (не был)', a: ["wasn't", 'was not'], why: 'weather (it) → wasn’t' },
          { t: 'order', ru: 'Я был там два дня назад.', a: 'I was there two days ago', x: ['were'], why: 'two days ago — в конце' },
          { t: 'tr', ru: 'Фильм был хорошим?', a: ['Was the film good', 'Was the movie good'], why: 'Was + the film + good?' },
          { t: 'tr', ru: 'Мы не опоздали.', a: ["We weren't late", 'We were not late'], why: 'we → weren’t' },
          { t: 'choice', q: 'Where ___ you last week?', o: ['was', 'were', 'did'], a: 1, why: 'you → were' }
        ]
      },
      {
        id: 'a2-2', title: 'Past Simple: правильные глаголы', short: '-ed и did',
        rules: [
          { h: 'Утверждение', t: 'Глагол + **-ed**: work → work**ed**. Оканчивается на e → **-d** (like**d**). Согласная + y → **-ied** (stud**ied**). Короткий слог → удваиваем (stop → sto**pp**ed). Форма одна для всех лиц.' },
          { h: 'Отрицание и вопрос', t: '**didn’t** + V (без -ed): I didn’t watch**_** it. **Did** you call him?' }
        ],
        formula: 'V-ed · didn’t + V · Did + кто + V?',
        ex: [['I watched a film last night.', 'Вчера вечером я посмотрел фильм.'], ['She studied for the test.', 'Она готовилась к тесту.'], ['We didn’t play football.', 'Мы не играли в футбол.'], ['Did you call your mum?', 'Ты позвонил маме?']],
        tip: 'После did/didn’t — обычная форма: Did you watch**ed**? — ошибка. Правильно: Did you **watch**?',
        vocab: [['call', 'звонить'], ['visit', 'навещать'], ['finish', 'заканчивать'], ['stop', 'останавливать(ся)'], ['try', 'пытаться'], ['travel', 'путешествовать'], ['last night', 'вчера вечером'], ['test', 'тест, контрольная']],
        tasks: [
          { t: 'input', q: 'She ___ (study) for the test.', a: ['studied'], why: 'y → ied' },
          { t: 'input', q: 'The bus ___ (stop) here.', a: ['stopped'], why: 'stop → stopped (удваиваем p)' },
          { t: 'input', q: 'I ___ (like) the film.', a: ['liked'], why: 'на -e → +d' },
          { t: 'choice', q: 'Did you ___ your grandma?', o: ['visit', 'visited'], a: 0, why: 'после did — без -ed' },
          { t: 'choice', q: 'We ___ finish the project.', o: ["didn't", "don't", "wasn't"], a: 0, why: 'прошлое отрицание → didn’t' },
          { t: 'tr', ru: 'Ты позвонил маме?', a: ['Did you call your mum', 'Did you call your mom', 'Did you call mum', 'Did you call mom', 'Did you call your mother'], why: 'Did + you + call' },
          { t: 'order', ru: 'Вчера вечером я посмотрел фильм.', a: 'I watched a film last night', x: ['watch', 'did'], why: 'watched + last night' },
          { t: 'tr', ru: 'Мы не играли.', a: ["We didn't play", 'We did not play'], why: 'didn’t + play' }
        ]
      },
      {
        id: 'a2-3', title: 'Неправильные глаголы — топ 20', short: 'Их нужно просто выучить',
        rules: [
          { h: 'Главные', t: 'go → **went** · have → **had** · see → **saw** · make → **made** · get → **got** · take → **took** · come → **came** · know → **knew** · think → **thought** · buy → **bought**' },
          { h: 'Ещё 10', t: 'eat → **ate** · drink → **drank** · write → **wrote** · say → **said** · find → **found** · give → **gave** · tell → **told** · leave → **left** · begin → **began** · speak → **spoke**' },
          { h: 'Важно', t: 'В вопросе и отрицании — снова обычная форма: I **went** → I didn’t **go**, Did you **go**?' }
        ],
        formula: 'Утверждение: 2-я форма · с did: 1-я форма',
        ex: [['We went to the sea last summer.', 'Прошлым летом мы ездили на море.'], ['I bought a new phone.', 'Я купил новый телефон.'], ['She said hello.', 'Она поздоровалась.'], ['Did you see that?', 'Ты это видел?']],
        tip: 'Учи тройками вслух: go-went-gone, see-saw-seen. Через неделю они станут автоматическими.',
        vocab: [['went', 'пошёл (go)'], ['saw', 'увидел (see)'], ['bought', 'купил (buy)'], ['thought', 'подумал (think)'], ['ate', 'съел (eat)'], ['wrote', 'написал (write)'], ['left', 'ушёл, уехал (leave)'], ['told', 'сказал, рассказал (tell)']],
        tasks: [
          { t: 'input', q: 'go → ___', a: ['went'], why: 'go – went' },
          { t: 'input', q: 'buy → ___', a: ['bought'], why: 'buy – bought' },
          { t: 'input', q: 'think → ___', a: ['thought'], why: 'think – thought' },
          { t: 'choice', q: 'We ___ pizza yesterday.', o: ['eated', 'ate', 'eat'], a: 1, why: 'eat – ate' },
          { t: 'choice', q: 'Did you ___ the email?', o: ['wrote', 'write', 'written'], a: 1, why: 'после did — 1-я форма' },
          { t: 'tr', ru: 'Я купил новый телефон.', a: ['I bought a new phone'], why: 'buy → bought' },
          { t: 'order', ru: 'Прошлым летом мы ездили на море.', a: 'We went to the sea last summer', x: ['goed', 'go'], why: 'go → went' },
          { t: 'tr', ru: 'Она ушла в 5.', a: ['She left at 5', 'She left at five', "She left at five o'clock"], why: 'leave → left' }
        ]
      },
      {
        id: 'a2-4', title: 'Где: in / on / at', short: 'Предлоги места',
        rules: [
          { h: 'in — внутри', t: '**in** the box, **in** the room, **in** Poland, **in** the city.' },
          { h: 'on — на поверхности', t: '**on** the table, **on** the wall, **on** the bus, **on** the second floor.' },
          { h: 'at — в точке, на месте событий', t: '**at** home, **at** school, **at** work, **at** the bus stop, **at** a party.' },
          { h: 'Рядом', t: 'next to (рядом с), between (между), under (под), behind (за), in front of (перед).' }
        ],
        formula: 'in — внутри · on — на · at — в точке',
        ex: [['The keys are on the table.', 'Ключи на столе.'], ['She is at work.', 'Она на работе.'], ['I live in Warsaw.', 'Я живу в Варшаве.'], ['The cat is under the bed.', 'Кошка под кроватью.']],
        tip: 'Устойчивые: **at** home, **at** school, **at** work — без the.',
        vocab: [['table', 'стол'], ['wall', 'стена'], ['floor', 'этаж; пол'], ['under', 'под'], ['behind', 'за, позади'], ['next to', 'рядом с'], ['between', 'между'], ['in front of', 'перед']],
        tasks: [
          { t: 'choice', q: 'The keys are ___ the table.', o: ['in', 'on', 'at'], a: 1, why: 'на поверхности → on' },
          { t: 'choice', q: 'I’m ___ home now.', o: ['in', 'on', 'at'], a: 2, why: 'устойчиво: at home' },
          { t: 'choice', q: 'She lives ___ Poland.', o: ['in', 'on', 'at'], a: 0, why: 'страна → in' },
          { t: 'choice', q: 'We met ___ the bus stop.', o: ['in', 'on', 'at'], a: 2, why: 'точка → at' },
          { t: 'input', q: 'The cat is ___ the bed. (под)', a: ['under'], why: 'под → under' },
          { t: 'tr', ru: 'Она на работе.', a: ['She is at work', "She's at work"], why: 'at work' },
          { t: 'order', ru: 'Банк рядом с кафе.', a: 'The bank is next to the cafe', x: ['on'], why: 'next to — рядом с' },
          { t: 'tr', ru: 'Я живу в Варшаве.', a: ['I live in Warsaw'], why: 'город → in' }
        ]
      }
    ]
  },
  /* ===================================================== LEVEL 4 */
  {
    id: 'a2p', code: 'A2+', name: 'Сейчас и будущее', about: 'Continuous, will / going to, сравнения',
    lessons: [
      {
        id: 'a2p-1', title: 'Present Continuous', short: 'Что происходит прямо сейчас',
        rules: [
          { h: 'Форма', t: '**am / is / are + V-ing**: I am reading. She is working. They are playing.' },
          { h: 'Правописание -ing', t: 'make → mak**ing** (e убираем), run → ru**nn**ing, swim → swi**mm**ing (удваиваем), lie → l**y**ing.' },
          { h: 'Когда', t: 'Сейчас, в этот момент: **now**, **at the moment**, Look! Listen! А также временное: I’m living with my aunt this month.' }
        ],
        formula: 'am/is/are + V-ing',
        ex: [['I am reading a book now.', 'Я сейчас читаю книгу.'], ['Look! It is raining.', 'Смотри! Идёт дождь.'], ['They aren’t listening.', 'Они не слушают.'], ['What are you doing?', 'Что ты делаешь?']],
        tip: 'Не забывай am/is/are: I **reading** — ошибка. I **am** reading.',
        vocab: [['now', 'сейчас'], ['at the moment', 'в данный момент'], ['rain', 'дождь; идти (о дожде)'], ['listen', 'слушать'], ['wait', 'ждать'], ['run', 'бежать'], ['wear', 'носить (одежду)'], ['look!', 'смотри!']],
        tasks: [
          { t: 'choice', q: 'Look! It ___.', o: ['rains', 'is raining', 'raining'], a: 1, why: 'сейчас → is raining' },
          { t: 'input', q: 'She ___ (run) in the park now.', a: ['is running', "'s running"], why: 'is + running (удвоение n)' },
          { t: 'input', q: 'I ___ (make) dinner at the moment.', a: ['am making', "'m making"], why: 'am + making (e убираем)' },
          { t: 'choice', q: 'What ___ you doing?', o: ['do', 'are', 'is'], a: 1, why: 'you → are' },
          { t: 'tr', ru: 'Я сейчас жду автобус.', a: ['I am waiting for the bus now', "I'm waiting for the bus now", 'I am waiting for a bus now', "I'm waiting for a bus now", "I'm waiting for the bus", 'I am waiting for the bus'], why: 'am waiting for' },
          { t: 'order', ru: 'Они не слушают.', a: "They aren't listening", x: ["don't", 'listen'], why: 'aren’t + listening' },
          { t: 'tr', ru: 'Что ты делаешь?', a: ['What are you doing'], why: 'What are you doing?' },
          { t: 'choice', q: 'He ___ a blue jacket today.', o: ['wears', 'is wearing', 'wear'], a: 1, why: 'сегодня, сейчас → is wearing' }
        ]
      },
      {
        id: 'a2p-2', title: 'Simple или Continuous?', short: 'Всегда vs. прямо сейчас',
        rules: [
          { h: 'Разница', t: '**Simple** — обычно, регулярно (I **work** in a shop). **Continuous** — сейчас, временно (Today I**’m working** at home).' },
          { h: 'Слова-подсказки', t: 'Simple: every day, usually, often, never. Continuous: now, at the moment, today, this week.' },
          { h: 'Глаголы состояния', t: 'know, like, love, want, need, understand, believe — **обычно без -ing**: I **know** (не I’m knowing).' }
        ],
        formula: 'обычно → Simple · сейчас → Continuous',
        ex: [['I usually walk to school, but today I’m taking the bus.', 'Обычно я хожу в школу пешком, но сегодня еду на автобусе.'], ['She doesn’t eat meat.', 'Она не ест мясо (вообще).'], ['I want a coffee.', 'Я хочу кофе.'], ['He is talking on the phone now.', 'Он сейчас говорит по телефону.']],
        tip: 'I **am wanting** — ошибка. Want, know, like — без -ing.',
        vocab: [['walk', 'ходить пешком'], ['take the bus', 'ехать на автобусе'], ['want', 'хотеть'], ['need', 'нуждаться'], ['believe', 'верить'], ['talk', 'разговаривать'], ['today', 'сегодня'], ['this week', 'на этой неделе']],
        tasks: [
          { t: 'choice', q: 'I usually ___ to school.', o: ['walk', 'am walking'], a: 0, why: 'usually → Simple' },
          { t: 'choice', q: 'Today I ___ the bus.', o: ['take', 'am taking'], a: 1, why: 'today, временно → Continuous' },
          { t: 'choice', q: 'I ___ the answer.', o: ['know', 'am knowing'], a: 0, why: 'know — глагол состояния' },
          { t: 'choice', q: 'Shh! The baby ___.', o: ['sleeps', 'is sleeping'], a: 1, why: 'прямо сейчас → is sleeping' },
          { t: 'input', q: 'She ___ (not / eat) meat. She’s a vegetarian.', a: ["doesn't eat", 'does not eat'], why: 'вообще, всегда → Simple' },
          { t: 'tr', ru: 'Я хочу кофе.', a: ['I want a coffee', 'I want coffee', 'I want some coffee'], why: 'want — без -ing' },
          { t: 'order', ru: 'Он сейчас говорит по телефону.', a: 'He is talking on the phone now', x: ['talks'], why: 'now → is talking' },
          { t: 'input', q: 'Water ___ (boil) at 100 degrees.', a: ['boils'], why: 'факт → Simple' }
        ]
      },
      {
        id: 'a2p-3', title: 'Будущее: will и going to', short: 'Решения, прогнозы и планы',
        rules: [
          { h: 'will', t: 'Решение **в момент речи** (I’ll help you!), обещание, прогноз-мнение (I think it **will** rain). will + V для всех лиц.' },
          { h: 'going to', t: '**План, решено заранее**: I’m **going to** study medicine. Или видно по признакам: Look at the clouds — it’s **going to** rain.' },
          { h: 'Формы', t: 'won’t = will not. Will you…? · I’m not going to… Are you going to…?' }
        ],
        formula: 'will + V · am/is/are going to + V',
        ex: [['I’ll call you later.', 'Я позвоню тебе позже.'], ['We are going to visit Kyiv in summer.', 'Летом мы собираемся поехать в Киев.'], ['I think she will win.', 'Думаю, она выиграет.'], ['I won’t tell anyone.', 'Я никому не скажу.']],
        tip: 'После will — без to: I will **to** go — ошибка.',
        vocab: [['later', 'позже'], ['tomorrow', 'завтра'], ['next year', 'в следующем году'], ['plan', 'план; планировать'], ['win', 'выигрывать'], ['promise', 'обещать'], ['clouds', 'тучи'], ['anyone', 'кто-нибудь; никому (с not)']],
        tasks: [
          { t: 'choice', q: 'The phone is ringing. — I ___ answer it!', o: ['will', 'am going to'], a: 0, why: 'решение в момент речи → will' },
          { t: 'choice', q: 'We bought tickets. We ___ fly to Rome.', o: ['will', 'are going to'], a: 1, why: 'план заранее → going to' },
          { t: 'choice', q: 'Look at those clouds! It ___ rain.', o: ['will', 'is going to'], a: 1, why: 'видно по признакам → going to' },
          { t: 'input', q: 'I promise I ___ tell anyone. (не)', a: ["won't", 'will not'], why: 'обещание → won’t' },
          { t: 'tr', ru: 'Я позвоню тебе завтра.', a: ["I'll call you tomorrow", 'I will call you tomorrow'], why: 'will + call' },
          { t: 'order', ru: 'Я собираюсь изучать медицину.', a: "I'm going to study medicine", x: ['will', 'studying'], why: 'going to + study' },
          { t: 'tr', ru: 'Думаю, она выиграет.', a: ['I think she will win', "I think she'll win"], why: 'прогноз-мнение → will' },
          { t: 'choice', q: 'What ___ you going to do tomorrow?', o: ['will', 'are', 'do'], a: 1, why: 'are you going to…?' }
        ]
      },
      {
        id: 'a2p-4', title: 'Сравнения', short: 'bigger, more interesting, the best',
        rules: [
          { h: 'Короткие слова', t: '+**er** / the +**est**: cheap → cheap**er** → the cheap**est**. big → bi**gg**er, happy → happ**ier**.' },
          { h: 'Длинные слова', t: '**more** / the **most**: interesting → **more** interesting → the **most** interesting.' },
          { h: 'Исключения', t: 'good → **better** → the **best** · bad → **worse** → the **worst** · far → **further**.' },
          { h: 'Сравнить', t: '**than** — чем: Tom is taller **than** me. **as … as** — такой же, как: as tall **as** you.' }
        ],
        formula: 'короткие: -er / the -est · длинные: more / the most',
        ex: [['My phone is cheaper than yours.', 'Мой телефон дешевле твоего.'], ['This is the best day of my life!', 'Это лучший день в моей жизни!'], ['English is easier than Polish.', 'Английский проще польского.'], ['She is as tall as her mum.', 'Она такая же высокая, как мама.']],
        tip: 'Не смешивай: more bigger — ошибка. Либо **bigger**, либо **more interesting**.',
        vocab: [['cheap', 'дешёвый'], ['expensive', 'дорогой'], ['easy', 'лёгкий'], ['difficult', 'трудный'], ['tall', 'высокий (рост)'], ['fast', 'быстрый'], ['interesting', 'интересный'], ['than', 'чем']],
        tasks: [
          { t: 'input', q: 'cheap → ___ (сравнительная)', a: ['cheaper'], why: 'cheap + er' },
          { t: 'input', q: 'big → ___ (сравнительная)', a: ['bigger'], why: 'удваиваем g' },
          { t: 'input', q: 'good → the ___', a: ['best'], why: 'good – better – best' },
          { t: 'choice', q: 'This book is ___ than that one.', o: ['interestinger', 'more interesting', 'most interesting'], a: 1, why: 'длинное слово → more' },
          { t: 'choice', q: 'Tom is taller ___ me.', o: ['that', 'than', 'then'], a: 1, why: 'чем → than' },
          { t: 'tr', ru: 'Английский проще польского.', a: ['English is easier than Polish'], why: 'easy → easier than' },
          { t: 'order', ru: 'Это самый дорогой телефон.', a: 'This is the most expensive phone', x: ['more'], why: 'длинное → the most' },
          { t: 'choice', q: 'Today is ___ than yesterday.', o: ['badder', 'worse', 'worst'], a: 1, why: 'bad – worse – worst' }
        ]
      }
    ]
  },
  /* ===================================================== LEVEL 5 */
  {
    id: 'b1', code: 'B1', name: 'Опыт и правила', about: 'Present Perfect, must/should, if',
    lessons: [
      {
        id: 'b1-1', title: 'Present Perfect', short: 'Опыт и результат к настоящему',
        rules: [
          { h: 'Форма', t: '**have / has + V3** (3-я форма): I **have seen**, she **has finished**. У правильных V3 = -ed, у неправильных — 3-я колонка (go → **gone**, see → **seen**, do → **done**).' },
          { h: 'Опыт', t: 'Когда — неважно: Have you **ever** been to London? I’ve **never** tried sushi.' },
          { h: 'Результат сейчас', t: 'I’ve **just** finished (только что). She has **already** left (уже). Have you done it **yet**? (уже? — в вопросе; ещё не — в отрицании)' }
        ],
        formula: 'have/has + V3',
        ex: [['I have never been to Paris.', 'Я никогда не был в Париже.'], ['She has just arrived.', 'Она только что приехала.'], ['Have you finished yet?', 'Ты уже закончил?'], ['We’ve lost our keys.', 'Мы потеряли ключи (и их сейчас нет).']],
        tip: 'been vs gone: She has **been** to Rome (была и вернулась). She has **gone** to Rome (уехала и сейчас там).',
        vocab: [['ever', 'когда-либо'], ['never', 'никогда'], ['just', 'только что'], ['already', 'уже'], ['yet', 'уже (вопрос) / ещё (отрицание)'], ['arrive', 'прибывать'], ['lose / lost', 'терять / потерял'], ['been', 'был (V3 от be)']],
        tasks: [
          { t: 'choice', q: 'I have ___ this film twice.', o: ['saw', 'seen', 'see'], a: 1, why: 'have + V3: see – saw – seen' },
          { t: 'choice', q: 'She ___ just arrived.', o: ['have', 'has', 'is'], a: 1, why: 'she → has' },
          { t: 'input', q: 'Have you ___ (be) to London?', a: ['been'], why: 'be – was – been' },
          { t: 'choice', q: 'Have you finished ___?', o: ['already', 'yet', 'just'], a: 1, why: 'в конце вопроса → yet' },
          { t: 'input', q: 'I ___ never tried sushi.', a: ['have', "'ve"], why: 'I have never…' },
          { t: 'tr', ru: 'Я никогда не был в Париже.', a: ['I have never been to Paris', "I've never been to Paris"], why: 'have never been to' },
          { t: 'order', ru: 'Она уже ушла.', a: 'She has already left', x: ['leaved', 'have'], why: 'has + already + left' },
          { t: 'tr', ru: 'Ты уже закончил?', a: ['Have you finished yet', 'Have you already finished'], why: 'Have you finished yet?' }
        ]
      },
      {
        id: 'b1-2', title: 'Present Perfect или Past Simple?', short: 'Когда — важно или нет',
        rules: [
          { h: 'Главное правило', t: 'Есть **конкретное прошлое время** (yesterday, in 2020, last week, ago, when…) → **Past Simple**. Время не названо / период до сих пор → **Present Perfect**.' },
          { h: 'for / since', t: '**for** + период (for two years), **since** + начало (since 2022, since Monday): I have lived here **since** 2022.' },
          { h: 'Вопрос When', t: '**When** всегда с Past Simple: When **did** you arrive? (не When have you arrived?)' }
        ],
        formula: 'время названо → Past Simple · не названо → Present Perfect',
        ex: [['I have been to Spain. I went there in 2023.', 'Я был в Испании. Ездил туда в 2023.'], ['She has lived in Poland for a year.', 'Она живёт в Польше уже год.'], ['I have known him since school.', 'Я знаю его со школы.'], ['When did you start?', 'Когда ты начал?']],
        tip: 'Русское «Я живу здесь два года» = I **have lived** here **for** two years (не I live here two years).',
        vocab: [['for', 'в течение'], ['since', 'с (момента)'], ['start', 'начинать'], ['move', 'переезжать'], ['meet / met', 'встречать / встретил'], ['school', 'школа'], ['year', 'год'], ['still', 'всё ещё']],
        tasks: [
          { t: 'choice', q: 'I ___ him yesterday.', o: ['have seen', 'saw'], a: 1, why: 'yesterday → Past Simple' },
          { t: 'choice', q: 'I ___ to Spain three times.', o: ['have been', 'was'], a: 0, why: 'время не названо, опыт → Present Perfect' },
          { t: 'choice', q: 'She has lived here ___ 2022.', o: ['for', 'since'], a: 1, why: 'начало → since' },
          { t: 'choice', q: 'We have known each other ___ ten years.', o: ['for', 'since'], a: 0, why: 'период → for' },
          { t: 'choice', q: 'When ___ you move to Poland?', o: ['have', 'did'], a: 1, why: 'When → Past Simple' },
          { t: 'tr', ru: 'Я живу здесь два года.', a: ['I have lived here for two years', "I've lived here for two years", 'I have been living here for two years', "I've been living here for two years", 'I have lived here for 2 years', "I've lived here for 2 years"], why: 'have lived + for two years' },
          { t: 'order', ru: 'Я знаю его со школы.', a: 'I have known him since school', x: ['for', 'know'], why: 'have known + since' },
          { t: 'input', q: 'I ___ (meet) her two days ago.', a: ['met'], why: 'ago → Past Simple: met' }
        ]
      },
      {
        id: 'b1-3', title: 'must, have to, should', short: 'Нужно, обязательно, стоит',
        rules: [
          { h: 'must / have to — нужно', t: '**must** — моё решение или правило (I must study more). **have to** — обстоятельства (I have to wake up early for work). Для прошлого — **had to**.' },
          { h: 'mustn’t ≠ don’t have to', t: '**mustn’t** — нельзя (You mustn’t smoke here). **don’t have to** — не обязательно (You don’t have to come).' },
          { h: 'should — стоит, советую', t: 'You **should** sleep more. You **shouldn’t** eat so much sugar.' }
        ],
        formula: 'must / have to / should + V (без to после must и should)',
        ex: [['You must wear a seatbelt.', 'Нужно пристёгиваться.'], ['I have to work on Saturday.', 'Мне приходится работать в субботу.'], ['You don’t have to pay. It’s free.', 'Платить не нужно. Это бесплатно.'], ['You should see a doctor.', 'Тебе стоит сходить к врачу.']],
        tip: 'He **has to** (не have to): he/she/it → has to. А must и should не меняются.',
        vocab: [['must', 'должен'], ['have to', 'приходится, нужно'], ['should', 'следует, стоит'], ['allowed', 'разрешено'], ['free', 'бесплатный; свободный'], ['rule', 'правило'], ['pay', 'платить'], ['advice', 'совет']],
        tasks: [
          { t: 'choice', q: 'You ___ smoke here. It’s forbidden.', o: ["mustn't", "don't have to"], a: 0, why: 'запрещено → mustn’t' },
          { t: 'choice', q: 'It’s Sunday, I ___ get up early.', o: ["mustn't", "don't have to"], a: 1, why: 'не обязательно → don’t have to' },
          { t: 'choice', q: 'You look tired. You ___ go to bed.', o: ['should', 'must to', 'have'], a: 0, why: 'совет → should' },
          { t: 'input', q: 'She ___ work on Saturdays. (приходится)', a: ['has to'], why: 'she → has to' },
          { t: 'input', q: 'Yesterday I ___ wait for an hour. (пришлось)', a: ['had to'], why: 'прошлое → had to' },
          { t: 'tr', ru: 'Тебе стоит сходить к врачу.', a: ['You should see a doctor', 'You should go to a doctor', 'You should go to the doctor', 'You should see the doctor'], why: 'should + see a doctor' },
          { t: 'order', ru: 'Платить не нужно.', a: "You don't have to pay", x: ["mustn't"], why: 'не обязательно → don’t have to' },
          { t: 'tr', ru: 'Я должен больше учиться.', a: ['I must study more', 'I have to study more', 'I should study more'], why: 'must + study more' }
        ]
      },
      {
        id: 'b1-4', title: 'Условия: if', short: 'Zero и First Conditional',
        rules: [
          { h: 'Zero — всегда так', t: '**If + Present, Present**: If you heat ice, it melts. (Факты, законы.)' },
          { h: 'First — реально в будущем', t: '**If + Present, will + V**: If it rains, I **will** stay home. После if — **не will**!' },
          { h: 'unless, when', t: '**unless** = if not: I won’t go unless you come. **when** — когда точно случится: When I finish, I’ll call you.' }
        ],
        formula: 'If + Present, will + V',
        ex: [['If it rains, we will stay at home.', 'Если пойдёт дождь, мы останемся дома.'], ['If you study, you will pass the exam.', 'Если будешь учиться, сдашь экзамен.'], ['If you mix red and blue, you get purple.', 'Если смешать красный и синий, получится фиолетовый.'], ['I’ll call you when I arrive.', 'Я позвоню, когда приеду.']],
        tip: 'If it **will rain** — ошибка. В части с if — Present: If it **rains**.',
        vocab: [['if', 'если'], ['unless', 'если не'], ['stay', 'оставаться'], ['pass an exam', 'сдать экзамен'], ['miss', 'пропустить, опоздать на'], ['hurry', 'спешить'], ['heat', 'нагревать'], ['melt', 'таять']],
        tasks: [
          { t: 'choice', q: 'If it ___, we will stay at home.', o: ['will rain', 'rains', 'rained'], a: 1, why: 'после if → Present' },
          { t: 'choice', q: 'If you study, you ___ the exam.', o: ['pass', 'will pass', 'passed'], a: 1, why: 'результат → will' },
          { t: 'choice', q: 'If you heat ice, it ___.', o: ['melts', 'will melt'], a: 0, why: 'факт → Zero: Present' },
          { t: 'input', q: 'If you don’t hurry, you ___ (miss) the bus.', a: ['will miss', "'ll miss"], why: 'will + miss' },
          { t: 'choice', q: 'I won’t go ___ you come with me.', o: ['if', 'unless'], a: 1, why: 'если не → unless' },
          { t: 'tr', ru: 'Если пойдёт дождь, я останусь дома.', a: ['If it rains, I will stay at home', "If it rains, I'll stay at home", 'If it rains, I will stay home', "If it rains, I'll stay home", 'If it rains I will stay at home', "If it rains I'll stay at home", 'If it rains I will stay home', "If it rains I'll stay home"], why: 'If + rains, will stay' },
          { t: 'order', ru: 'Я позвоню, когда приеду.', a: "I'll call you when I arrive", x: ['will', 'arrived'], why: 'when + Present' },
          { t: 'input', q: 'If she ___ (come), we will start.', a: ['comes'], why: 'после if → comes' }
        ]
      }
    ]
  },
  /* ===================================================== LEVEL 6 */
  {
    id: 'b1p', code: 'B1+', name: 'Свободнее', about: 'пассив, would, фразовые глаголы, вежливость',
    lessons: [
      {
        id: 'b1p-1', title: 'Пассивный залог', short: 'Что-то делается, сделано',
        rules: [
          { h: 'Форма', t: '**be + V3**. Present: is/are **made**. Past: was/were **built**.' },
          { h: 'Когда', t: 'Важно действие или результат, а не кто сделал: English **is spoken** here. The bridge **was built** in 1990.' },
          { h: 'by — кем', t: 'The book was written **by** J.K. Rowling.' }
        ],
        formula: 'am/is/are/was/were + V3',
        ex: [['Cars are made in this factory.', 'На этом заводе делают машины.'], ['The window was broken.', 'Окно было разбито.'], ['The film was directed by Nolan.', 'Фильм снял Нолан.'], ['Is English spoken here?', 'Здесь говорят по-английски?']],
        tip: 'Русское «Мне сказали» = I **was told**. «Его пригласили» = He **was invited**.',
        vocab: [['build / built', 'строить / построен'], ['make / made', 'делать / сделан'], ['write / written', 'писать / написан'], ['break / broken', 'ломать / сломан'], ['invite', 'приглашать'], ['steal / stolen', 'красть / украден'], ['factory', 'завод'], ['bridge', 'мост']],
        tasks: [
          { t: 'choice', q: 'English ___ in many countries.', o: ['speaks', 'is spoken', 'is speaking'], a: 1, why: 'на нём говорят → is spoken' },
          { t: 'choice', q: 'The bridge ___ in 1990.', o: ['was built', 'built', 'is built'], a: 0, why: 'прошлое → was built' },
          { t: 'input', q: 'My bike ___ (steal) yesterday.', a: ['was stolen'], why: 'was + stolen' },
          { t: 'choice', q: 'The book was written ___ a famous author.', o: ['from', 'by', 'with'], a: 1, why: 'кем → by' },
          { t: 'input', q: 'These phones ___ (make) in China.', a: ['are made'], why: 'are + made' },
          { t: 'tr', ru: 'Меня пригласили на вечеринку.', a: ['I was invited to a party', 'I was invited to the party'], why: 'was invited' },
          { t: 'order', ru: 'Окно было разбито.', a: 'The window was broken', x: ['broke'], why: 'was + broken' },
          { t: 'tr', ru: 'Здесь говорят по-английски?', a: ['Is English spoken here'], why: 'Is + English + spoken' }
        ]
      },
      {
        id: 'b1p-2', title: 'Если бы… (would)', short: 'Second Conditional и мечты',
        rules: [
          { h: 'Нереальное сейчас', t: '**If + Past, would + V**: If I **had** money, I **would** travel. (Денег нет — мечтаю.)' },
          { h: 'If I were you', t: 'Совет: **If I were you**, I would… (для всех лиц можно were).' },
          { h: 'would', t: 'I’d = I would. I **would like** = I’d like — вежливое «хотел бы».' }
        ],
        formula: 'If + Past, would + V',
        ex: [['If I had more time, I would learn Spanish.', 'Если бы у меня было больше времени, я бы выучил испанский.'], ['If I were you, I would call her.', 'На твоём месте я бы ей позвонил.'], ['What would you do if you won a million?', 'Что бы ты сделал, если бы выиграл миллион?'], ['I would like a glass of water.', 'Я бы хотел стакан воды.']],
        tip: 'После if — **не would**: If I **would have** — ошибка. If I **had**.',
        vocab: [['would', 'бы'], ['if I were you', 'на твоём месте'], ['million', 'миллион'], ['dream', 'мечта; мечтать'], ['rich', 'богатый'], ['glass', 'стакан'], ['abroad', 'за границей'], ['choose', 'выбирать']],
        tasks: [
          { t: 'choice', q: 'If I ___ rich, I would buy a house.', o: ['am', 'were', 'will be'], a: 1, why: 'нереальное → were' },
          { t: 'choice', q: 'If I had time, I ___ help you.', o: ['will', 'would', 'did'], a: 1, why: 'результат → would' },
          { t: 'input', q: 'If I ___ you, I would apologise.', a: ['were', 'was'], why: 'If I were you' },
          { t: 'input', q: 'What ___ you do if you won a million?', a: ['would'], why: 'What would you do…?' },
          { t: 'tr', ru: 'На твоём месте я бы ей позвонил.', a: ['If I were you, I would call her', "If I were you, I'd call her", 'If I were you I would call her', "If I were you I'd call her", 'If I was you, I would call her', "If I was you, I'd call her"], why: 'If I were you, I would…' },
          { t: 'order', ru: 'Я бы хотел стакан воды.', a: "I'd like a glass of water", x: ['will', 'want'], why: 'I’d like — вежливо' },
          { t: 'tr', ru: 'Если бы у меня были деньги, я бы путешествовал.', a: ['If I had money, I would travel', "If I had money, I'd travel", 'If I had money I would travel', "If I had money I'd travel", 'If I had the money, I would travel', "If I had the money, I'd travel"], why: 'If + had, would + travel' },
          { t: 'choice', q: 'If she ___ harder, she would pass.', o: ['studied', 'studies', 'would study'], a: 0, why: 'после if → Past' }
        ]
      },
      {
        id: 'b1p-3', title: 'Фразовые глаголы — топ', short: 'Глагол + маленькое слово = новый смысл',
        rules: [
          { h: 'Каждый день', t: '**get up** — вставать · **turn on / off** — включить / выключить · **put on / take off** — надеть / снять · **look for** — искать · **come back** — возвращаться' },
          { h: 'Важные', t: '**find out** — узнать · **give up** — бросить, сдаться · **look after** — присматривать · **run out of** — закончиться (о запасах) · **pick up** — подобрать, забрать' },
          { h: 'Местоимение — в середину', t: 'Turn **it** off (не turn off it). Put **them** on.' }
        ],
        formula: 'глагол + частица → новое значение',
        ex: [['Turn off the light, please.', 'Выключи свет, пожалуйста.'], ['I’m looking for my keys.', 'Я ищу ключи.'], ['Don’t give up!', 'Не сдавайся!'], ['We ran out of milk.', 'У нас закончилось молоко.']],
        tip: 'look **at** — смотреть на, look **for** — искать, look **after** — присматривать. Одно слово меняет всё.',
        vocab: [['turn on / off', 'включить / выключить'], ['put on', 'надеть'], ['take off', 'снять (одежду)'], ['look for', 'искать'], ['find out', 'узнать'], ['give up', 'сдаться, бросить'], ['look after', 'присматривать'], ['run out of', 'закончиться (запас)']],
        tasks: [
          { t: 'choice', q: 'It’s cold. ___ your jacket.', o: ['Put on', 'Take off', 'Give up'], a: 0, why: 'надеть → put on' },
          { t: 'choice', q: 'I’m looking ___ my phone. Have you seen it?', o: ['at', 'for', 'after'], a: 1, why: 'искать → look for' },
          { t: 'choice', q: 'Can you look ___ my cat this weekend?', o: ['for', 'after', 'up'], a: 1, why: 'присматривать → look after' },
          { t: 'input', q: 'Please turn ___ the TV. I want to sleep.', a: ['off'], why: 'выключить → turn off' },
          { t: 'input', q: 'Never give ___!', a: ['up'], why: 'сдаваться → give up' },
          { t: 'tr', ru: 'Я узнал правду.', a: ['I found out the truth'], why: 'find out → found out' },
          { t: 'order', ru: 'Выключи его.', a: 'Turn it off', x: ['on'], why: 'местоимение в середину: turn it off' },
          { t: 'tr', ru: 'У нас закончилось молоко.', a: ['We ran out of milk', 'We have run out of milk', "We've run out of milk"], why: 'run out of → ran out of' }
        ]
      },
      {
        id: 'b1p-4', title: 'Вежливый разговор', short: 'Фразы, которые нужны каждый день',
        rules: [
          { h: 'Просить', t: '**Could you** help me, please? **Would you mind** opening the window? (+ -ing) **Can I** ask you something?' },
          { h: 'Предлагать', t: '**Would you like** some tea? **Shall we** go? **How about** going to the cinema? (+ -ing)' },
          { h: 'Отвечать', t: '**Sure! / Of course.** · **I’m afraid I can’t.** (вежливый отказ) · **No worries.** (ничего страшного) · **Sorry?** (переспросить)' }
        ],
        formula: 'Could you… / Would you like… / How about + -ing',
        ex: [['Could you repeat that, please?', 'Не могли бы вы повторить?'], ['Would you like something to drink?', 'Хотите что-нибудь выпить?'], ['How about meeting on Friday?', 'Как насчёт встречи в пятницу?'], ['I’m afraid I can’t come.', 'Боюсь, я не смогу прийти.']],
        tip: 'Want в просьбах звучит грубо: I want… → **I’d like**…',
        vocab: [['Could you…?', 'Не могли бы вы…?'], ['Would you mind…?', 'Вы не против…?'], ['Would you like…?', 'Хотите…?'], ['How about…?', 'Как насчёт…?'], ['I’m afraid…', 'Боюсь, что… (вежливо)'], ['repeat', 'повторить'], ['No worries.', 'Ничего страшного.'], ['Of course.', 'Конечно.']],
        tasks: [
          { t: 'choice', q: 'Would you mind ___ the door?', o: ['close', 'closing', 'to close'], a: 1, why: 'Would you mind + -ing' },
          { t: 'choice', q: 'How about ___ to the cinema?', o: ['go', 'going', 'to go'], a: 1, why: 'How about + -ing' },
          { t: 'choice', q: 'Вежливый отказ:', o: ['No.', 'I don’t want.', 'I’m afraid I can’t.'], a: 2, why: 'I’m afraid I can’t — вежливо' },
          { t: 'input', q: '___ you like some tea? (хотите)', a: ['would'], why: 'Would you like…?' },
          { t: 'tr', ru: 'Не могли бы вы повторить, пожалуйста?', a: ['Could you repeat that, please', 'Could you repeat that please', 'Could you repeat, please', 'Could you repeat please', 'Could you repeat it, please', 'Could you please repeat that', 'Could you repeat that'], why: 'Could you repeat that, please?' },
          { t: 'order', ru: 'Я бы хотел кофе.', a: "I'd like a coffee", x: ['want'], why: 'I’d like — вежливо' },
          { t: 'tr', ru: 'Как насчёт встречи в пятницу?', a: ['How about meeting on Friday'], why: 'How about + meeting' },
          { t: 'choice', q: 'Ты не расслышал. Что сказать?', o: ['What?', 'Sorry?', 'Repeat!'], a: 1, why: 'Sorry? — вежливо переспросить' }
        ]
      }
    ]
  }
];
