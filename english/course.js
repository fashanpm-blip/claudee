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

/* ===================================================== EXTRA LESSONS (2 per level) */
(function () {
  var EXTRA = {
    a1: [
      {
        id: 'a1-5', title: 'Числа, время и даты', short: 'Который час и какое сегодня число',
        rules: [
          { h: 'Числа', t: '13–19 оканчиваются на **-teen** (thirteen), десятки — на **-ty** (thirty). В -teen ударение в конце, в -ty — в начале, иначе 13 и 30 путают.' },
          { h: 'Время', t: '7:00 — It’s seven **o’clock** · 7:15 — **quarter past** seven · 7:30 — **half past** seven · 7:45 — **quarter to** eight. Можно проще: seven fifteen, seven thirty.' },
          { h: 'Даты', t: 'Порядковые: **first**, **second**, **third**, fourth, fifth, twelfth, twentieth. Говорим: **on the third of March**. Год 2026 — twenty twenty-six.' }
        ],
        formula: 'It’s + o’clock / half past / quarter to',
        ex: [['What time is it? — It’s half past six.', 'Который час? — Половина седьмого.'], ['My birthday is on the third of March.', 'Мой день рождения третьего марта.'], ['There are thirty students in my class.', 'В моём классе тридцать учеников.'], ['See you at quarter to nine.', 'Увидимся без пятнадцати девять.']],
        tip: '«Без пятнадцати» = **quarter to**, «пятнадцать минут» после часа = **quarter past**.',
        vocab: [['o’clock', 'ровно (о часах)'], ['half past', 'половина (после часа)'], ['quarter', 'четверть'], ['first', 'первый'], ['second', 'второй'], ['third', 'третий'], ['twelfth', 'двенадцатый'], ['What time is it?', 'Который час?']],
        tasks: [
          { t: 'choice', q: '7:30 = ?', o: ['half past seven', 'half to seven', 'seven half'], a: 0, why: '7:30 — half past seven' },
          { t: 'choice', q: '8:45 = ?', o: ['quarter past eight', 'quarter to nine', 'quarter to eight'], a: 1, why: 'без пятнадцати девять → quarter to nine' },
          { t: 'input', q: '3 → third, 1 → ___', a: ['first'], why: '1 → first' },
          { t: 'input', q: '12 → ___ (порядковое)', a: ['twelfth'], why: '12 → twelfth' },
          { t: 'choice', q: '13 = ?', o: ['thirty', 'thirteen', 'three'], a: 1, why: '13 — thirteen (-teen)' },
          { t: 'tr', ru: 'Который час?', a: ['What time is it', "What's the time", 'What is the time'], why: 'What time is it?' },
          { t: 'order', ru: 'Мой день рождения третьего марта.', a: 'My birthday is on the third of March', x: ['in'], why: 'дата → on the third of March' },
          { t: 'tr', ru: 'Сейчас семь часов.', a: ["It's seven o'clock", "It is seven o'clock", "It's seven", 'It is seven', "It's 7 o'clock", "It is 7 o'clock"], why: "It's seven o'clock" }
        ]
      },
      {
        id: 'a1-6', title: 'Вопросительные слова', short: 'What, where, why, how much…',
        rules: [
          { h: 'Главные слова', t: '**What** — что/какой · **Where** — где/куда · **When** — когда · **Who** — кто · **Why** — почему (ответ: Because…) · **How** — как · **Which** — какой из.' },
          { h: 'Сколько', t: '**How many** + исчисляемые (books), **How much** + неисчисляемые (money) и цена. **How old** — сколько лет.' },
          { h: 'Порядок слов', t: 'Вопр. слово + **am/is/are** или **do/does** + кто + глагол: Where **do** you live? Но если Who — это подлежащее, do не нужен: **Who lives** here?' }
        ],
        formula: 'Вопр. слово + is/are или do/does + кто + V?',
        ex: [['Where are you from?', 'Откуда ты?'], ['How old is your brother?', 'Сколько лет твоему брату?'], ['Why do you study English? — Because I live in Poland.', 'Почему ты учишь английский? — Потому что живу в Польше.'], ['How much is this jacket?', 'Сколько стоит эта куртка?']],
        tip: '«Сколько тебе лет?» = **How old** are you? (не How many years…)',
        vocab: [['what', 'что, какой'], ['where', 'где, куда'], ['when', 'когда'], ['who', 'кто'], ['why', 'почему'], ['how', 'как'], ['how much', 'сколько (неисчисл., цена)'], ['how many', 'сколько (исчисл.)']],
        tasks: [
          { t: 'choice', q: '___ are you from? — From Ukraine.', o: ['What', 'Where', 'Who'], a: 1, why: 'откуда → Where' },
          { t: 'choice', q: '___ old are you?', o: ['How', 'What', 'Which'], a: 0, why: 'How old — сколько лет' },
          { t: 'choice', q: 'How ___ apples do you need?', o: ['much', 'many'], a: 1, why: 'apples — исчисляемые → many' },
          { t: 'choice', q: 'How ___ is this jacket? — 50 euros.', o: ['many', 'much'], a: 1, why: 'цена → How much' },
          { t: 'input', q: '___ do you study English? — Because I live in Poland.', a: ['why'], why: 'ответ Because → Why' },
          { t: 'tr', ru: 'Сколько тебе лет?', a: ['How old are you'], why: 'How old are you?' },
          { t: 'order', ru: 'Где ты живёшь?', a: 'Where do you live', x: ['are'], why: 'Where + do + you + live' },
          { t: 'tr', ru: 'Кто это?', a: ['Who is this', 'Who is that', "Who's this", "Who's that", 'Who is it'], why: 'Who is this?' }
        ]
      }
    ],
    a1p: [
      {
        id: 'a1p-5', title: 'Люблю делать, хочу сделать', short: 'like + -ing и want to',
        rules: [
          { h: 'Нравится делать', t: '**like / love / enjoy / hate + V-ing**: I love read**ing**. She hates get**ting** up early. **don’t mind** + -ing — не против.' },
          { h: 'Хочу сделать', t: '**want / would like + to V**: I want **to** sleep. I’d like **to** order.' }
        ],
        formula: 'like/love/hate + V-ing · want + to V',
        ex: [['I love reading.', 'Я люблю читать.'], ['She hates getting up early.', 'Она терпеть не может рано вставать.'], ['I want to learn English.', 'Я хочу выучить английский.'], ['Do you like cooking?', 'Ты любишь готовить?']],
        tip: 'После want — всегда **to**: I want **to** go (не I want go).',
        vocab: [['love', 'любить'], ['hate', 'ненавидеть'], ['enjoy', 'получать удовольствие'], ['don’t mind', 'не против'], ['want', 'хотеть'], ['dance', 'танцевать'], ['read', 'читать'], ['get up early', 'рано вставать']],
        tasks: [
          { t: 'choice', q: 'I love ___ books.', o: ['read', 'reading', 'to reads'], a: 1, why: 'love + -ing' },
          { t: 'choice', q: 'I want ___ a new phone.', o: ['buy', 'to buy', 'buying'], a: 1, why: 'want + to' },
          { t: 'choice', q: 'She hates ___ up early.', o: ['getting', 'get', 'to gets'], a: 0, why: 'hate + -ing' },
          { t: 'input', q: 'Do you enjoy ___ (cook)?', a: ['cooking'], why: 'enjoy + -ing' },
          { t: 'input', q: 'He wants ___ (go) home.', a: ['to go'], why: 'want + to go' },
          { t: 'tr', ru: 'Я люблю читать.', a: ['I love reading', 'I like reading', 'I love to read', 'I like to read'], why: 'love reading' },
          { t: 'order', ru: 'Я хочу выучить английский.', a: 'I want to learn English', x: ['learning'], why: 'want + to learn' },
          { t: 'tr', ru: 'Ты любишь танцевать?', a: ['Do you like dancing', 'Do you love dancing', 'Do you like to dance', 'Do you love to dance'], why: 'Do you like dancing?' }
        ]
      },
      {
        id: 'a1p-6', title: 'me, him, her, us, them', short: 'Кого? Кому? — объектные местоимения',
        rules: [
          { h: 'Формы', t: 'I → **me** · you → **you** · he → **him** · she → **her** · it → **it** · we → **us** · they → **them**.' },
          { h: 'Где ставить', t: 'После глагола и после предлога: Call **me**. I love **her**. Look at **them**. This is for **you**.' }
        ],
        formula: 'глагол / предлог + me, him, her, us, them',
        ex: [['Can you help me?', 'Можешь мне помочь?'], ['I love her.', 'Я люблю её.'], ['Look at them!', 'Посмотри на них!'], ['Come with us.', 'Пойдём с нами.']],
        tip: 'После предлога — только объектная форма: between you and **me** (не and I).',
        vocab: [['me', 'меня, мне'], ['him', 'его, ему'], ['her', 'её, ей'], ['us', 'нас, нам'], ['them', 'их, им'], ['call', 'звонить, звать'], ['give', 'давать'], ['with', 'с']],
        tasks: [
          { t: 'choice', q: 'Can you help ___?', o: ['I', 'me', 'my'], a: 1, why: 'кого? → me' },
          { t: 'choice', q: 'This present is for ___ (она).', o: ['she', 'her', 'hers'], a: 1, why: 'после for → her' },
          { t: 'choice', q: 'Look at ___ (они)!', o: ['they', 'their', 'them'], a: 2, why: 'после at → them' },
          { t: 'input', q: 'Call ___ (мы) tomorrow.', a: ['us'], why: 'we → us' },
          { t: 'input', q: 'I know ___ (он).', a: ['him'], why: 'he → him' },
          { t: 'tr', ru: 'Я люблю её.', a: ['I love her'], why: 'she → her' },
          { t: 'order', ru: 'Дай ему книгу.', a: 'Give him the book', x: ['he'], why: 'give + him' },
          { t: 'tr', ru: 'Пойдём с нами.', a: ['Come with us', 'Go with us'], why: 'with + us' }
        ]
      }
    ],
    a2: [
      {
        id: 'a2-5', title: 'much, many, a lot of', short: 'Сколько: исчисляемые и неисчисляемые',
        rules: [
          { h: 'Исчисляемые', t: 'То, что можно посчитать (apples, books, people): **many**, **a few** (несколько), How **many**?' },
          { h: 'Неисчисляемые', t: 'water, money, time, information, **advice**, **homework**, news: **much**, **a little** (немного), How **much**? Без -s и без a/an.' },
          { h: 'a lot of', t: 'Подходит для обоих, особенно в утверждениях: **a lot of** friends, **a lot of** time.' }
        ],
        formula: 'many / a few + исчисл. · much / a little + неисчисл.',
        ex: [['I don’t have much time.', 'У меня мало времени.'], ['There are many tourists here.', 'Здесь много туристов.'], ['She has a lot of friends.', 'У неё много друзей.'], ['I need a little help.', 'Мне нужна небольшая помощь.']],
        tip: 'advice, information, homework — неисчисляемые: **some advice** (не an advice, не advices).',
        vocab: [['money', 'деньги'], ['time', 'время'], ['information', 'информация'], ['advice', 'совет(ы)'], ['homework', 'домашнее задание'], ['a few', 'несколько'], ['a little', 'немного'], ['a lot of', 'много']],
        tasks: [
          { t: 'choice', q: 'I don’t have ___ money.', o: ['many', 'much'], a: 1, why: 'money — неисчисляемое → much' },
          { t: 'choice', q: 'How ___ books do you have?', o: ['much', 'many'], a: 1, why: 'books → many' },
          { t: 'choice', q: 'There are ___ people here.', o: ['much', 'a lot of'], a: 1, why: 'утверждение → a lot of' },
          { t: 'choice', q: 'Can you give me some ___?', o: ['advice', 'advices'], a: 0, why: 'advice без -s' },
          { t: 'choice', q: 'I need ___ help.', o: ['a few', 'a little'], a: 1, why: 'help — неисчисляемое → a little' },
          { t: 'input', q: 'We have ___ friends in Warsaw. (несколько: a …)', a: ['a few'], why: 'friends — исчисляемые → a few' },
          { t: 'tr', ru: 'У меня мало времени.', a: ["I don't have much time", 'I do not have much time', 'I have little time'], why: "don't have much time" },
          { t: 'order', ru: 'Сколько у тебя денег?', a: 'How much money do you have', x: ['many'], why: 'money → How much' }
        ]
      },
      {
        id: 'a2-6', title: 'Past Continuous', short: 'Что происходило в тот момент',
        rules: [
          { h: 'Форма', t: '**was / were + V-ing**: At 8 pm I **was watching** TV.' },
          { h: 'Прервали', t: 'Длинное действие (Past Continuous) + короткое (Past Simple): I **was walking** home **when** it **started** to rain.' },
          { h: 'while', t: '**while** + длинное действие: **While** she was cooking, I was reading.' }
        ],
        formula: 'was / were + V-ing',
        ex: [['At nine o’clock I was sleeping.', 'В девять я спал.'], ['They were playing when I came.', 'Они играли, когда я пришёл.'], ['What were you doing at six?', 'Что ты делал в шесть?'], ['It wasn’t raining.', 'Дождя не было.']],
        tip: '**when** + короткое действие, **while** + длинное.',
        vocab: [['while', 'пока, в то время как'], ['when', 'когда'], ['suddenly', 'вдруг'], ['ring / rang', 'звонить / зазвонил'], ['fall / fell', 'падать / упал'], ['at that moment', 'в тот момент'], ['happen', 'случаться'], ['go out', 'выходить']],
        tasks: [
          { t: 'choice', q: 'At 8 pm I ___ TV.', o: ['watched', 'was watching', 'were watching'], a: 1, why: 'в момент в прошлом → was watching' },
          { t: 'choice', q: 'They ___ football when it started to rain.', o: ['was playing', 'were playing', 'played'], a: 1, why: 'they → were playing' },
          { t: 'choice', q: 'I was walking home ___ I saw Tom.', o: ['when', 'while'], a: 0, why: 'короткое действие → when' },
          { t: 'choice', q: '___ she was cooking, I was reading.', o: ['While', 'During'], a: 0, why: 'while + длинное действие' },
          { t: 'input', q: 'What ___ you doing at six?', a: ['were'], why: 'you → were' },
          { t: 'tr', ru: 'В девять я спал.', a: ["At nine o'clock I was sleeping", 'At nine I was sleeping', 'At 9 I was sleeping', "I was sleeping at nine o'clock", 'I was sleeping at nine', 'I was sleeping at 9', "At 9 o'clock I was sleeping", "I was sleeping at 9 o'clock"], why: 'was sleeping' },
          { t: 'order', ru: 'Шёл дождь, когда я вышел.', a: 'It was raining when I went out', x: ['rained'], why: 'was raining + when + went out' },
          { t: 'input', q: 'The phone rang while I ___ (have) a shower.', a: ['was having'], why: 'while + was having' }
        ]
      }
    ],
    a2p: [
      {
        id: 'a2p-5', title: 'Наречия, too и enough', short: 'Как? Слишком? Достаточно?',
        rules: [
          { h: 'Как? → -ly', t: 'quick → quick**ly**, careful → careful**ly**, easy → eas**ily**. Исключения: good → **well**, fast → **fast**, hard → **hard**.' },
          { h: 'too — слишком', t: '**too** + прилагательное (обычно это плохо): It’s **too** cold.' },
          { h: 'enough — достаточно', t: 'прилагательное + **enough**: old **enough**. **enough** + существительное: **enough** money.' }
        ],
        formula: 'прил. + ly · too + прил. · прил. + enough',
        ex: [['She speaks English well.', 'Она хорошо говорит по-английски.'], ['Drive carefully!', 'Езжай осторожно!'], ['This coffee is too hot.', 'Этот кофе слишком горячий.'], ['I’m not old enough to drive.', 'Я недостаточно взрослый, чтобы водить.']],
        tip: 'enough — **после** прилагательного: tall **enough** (не enough tall).',
        vocab: [['quickly', 'быстро'], ['carefully', 'осторожно'], ['well', 'хорошо (как?)'], ['too', 'слишком'], ['enough', 'достаточно'], ['loud', 'громкий'], ['quietly', 'тихо'], ['hard', 'усердно; трудный']],
        tasks: [
          { t: 'choice', q: 'She sings very ___.', o: ['good', 'well'], a: 1, why: 'как? → well' },
          { t: 'input', q: 'Please drive ___ (careful).', a: ['carefully'], why: 'careful + ly' },
          { t: 'input', q: 'He runs very ___ (quick).', a: ['quickly'], why: 'quick + ly' },
          { t: 'choice', q: 'This tea is ___ hot. I can’t drink it.', o: ['too', 'enough', 'very much'], a: 0, why: 'слишком → too' },
          { t: 'choice', q: 'I’m not ___ to drive.', o: ['enough old', 'old enough'], a: 1, why: 'прил. + enough' },
          { t: 'choice', q: 'Do we have ___ chairs?', o: ['enough', 'too'], a: 0, why: 'enough + существительное' },
          { t: 'tr', ru: 'Ты хорошо говоришь по-английски.', a: ['You speak English well', 'You speak good English', 'You speak English very well'], why: 'speak English well' },
          { t: 'order', ru: 'Это слишком дорого.', a: 'It is too expensive', x: ['enough'], why: 'too + expensive' }
        ]
      },
      {
        id: 'a2p-6', title: 'Глагол + -ing или + to?', short: 'enjoy doing, decide to do',
        rules: [
          { h: '+ -ing', t: '**enjoy, finish, avoid, mind, stop, keep** + V-ing. И всегда после предлогов: good **at** draw**ing**, interested **in** learn**ing**.' },
          { h: '+ to', t: '**want, decide, plan, hope, need, learn, promise, would like** + to V.' },
          { h: '-ing как подлежащее', t: '**Swimming** is good for you. **Learning** languages is fun.' }
        ],
        formula: 'enjoy / finish / avoid + V-ing · decide / plan / hope + to V',
        ex: [['I enjoy listening to music.', 'Мне нравится слушать музыку.'], ['We decided to stay at home.', 'Мы решили остаться дома.'], ['She’s good at drawing.', 'Она хорошо рисует.'], ['I hope to see you soon.', 'Надеюсь скоро тебя увидеть.']],
        tip: 'После предлога всегда -ing: Thank you for **helping** me.',
        vocab: [['enjoy', 'наслаждаться, любить'], ['finish', 'заканчивать'], ['avoid', 'избегать'], ['decide', 'решать'], ['hope', 'надеяться'], ['plan', 'планировать'], ['be good at', 'хорошо уметь'], ['be interested in', 'интересоваться']],
        tasks: [
          { t: 'choice', q: 'I enjoy ___ to music.', o: ['listen', 'listening', 'to listen'], a: 1, why: 'enjoy + -ing' },
          { t: 'choice', q: 'We decided ___ at home.', o: ['stay', 'staying', 'to stay'], a: 2, why: 'decide + to' },
          { t: 'choice', q: 'She’s good at ___.', o: ['draw', 'drawing', 'to draw'], a: 1, why: 'после предлога at → -ing' },
          { t: 'input', q: 'Have you finished ___ (read) the book?', a: ['reading'], why: 'finish + -ing' },
          { t: 'input', q: 'I hope ___ (see) you soon.', a: ['to see'], why: 'hope + to' },
          { t: 'choice', q: 'Thank you for ___ me.', o: ['help', 'helping', 'to help'], a: 1, why: 'после for → -ing' },
          { t: 'tr', ru: 'Я решил выучить английский.', a: ['I decided to learn English'], why: 'decided + to learn' },
          { t: 'order', ru: 'Мне интересно изучать языки.', a: 'I am interested in learning languages', x: ['to'], why: 'interested in + -ing' }
        ]
      }
    ],
    b1: [
      {
        id: 'b1-5', title: 'who, which, where', short: 'Предложения со словом «который»',
        rules: [
          { h: 'Кто или что', t: '**who** — о людях (the girl **who** lives next door), **which** — о вещах и животных (the phone **which** I bought), **that** — и о людях, и о вещах (разговорно).' },
          { h: 'Место и «чей»', t: '**where** — о месте (the city **where** I was born), **whose** — чей (a friend **whose** father is a pilot).' }
        ],
        formula: 'who — люди · which — вещи · where — места · whose — чей',
        ex: [['The woman who called is my aunt.', 'Женщина, которая звонила, — моя тётя.'], ['This is the book which I told you about.', 'Это книга, о которой я тебе говорил.'], ['That’s the café where we met.', 'Это кафе, где мы познакомились.'], ['I have a friend whose father is a pilot.', 'У меня есть друг, чей отец пилот.']],
        tip: 'Не повторяй местоимение: The book which I bought **it** — ошибка.',
        vocab: [['who', 'который (о людях)'], ['which', 'который (о вещах)'], ['where', 'где (в котором)'], ['whose', 'чей'], ['neighbour', 'сосед'], ['aunt', 'тётя'], ['pilot', 'пилот'], ['be born', 'родиться']],
        tasks: [
          { t: 'choice', q: 'The girl ___ lives next door is my friend.', o: ['who', 'which', 'where'], a: 0, why: 'человек → who' },
          { t: 'choice', q: 'This is the phone ___ I bought yesterday.', o: ['who', 'which', 'where'], a: 1, why: 'вещь → which' },
          { t: 'choice', q: 'That’s the café ___ we met.', o: ['which', 'where', 'who'], a: 1, why: 'место → where' },
          { t: 'choice', q: 'I have a friend ___ father is a pilot.', o: ['who', 'whose', 'which'], a: 1, why: 'чей → whose' },
          { t: 'input', q: 'The city ___ I was born is small.', a: ['where'], why: 'место → where' },
          { t: 'tr', ru: 'Женщина, которая звонила, — моя тётя.', a: ['The woman who called is my aunt', 'The woman that called is my aunt'], why: 'The woman who called…' },
          { t: 'order', ru: 'Это книга, которую я купил.', a: 'This is the book which I bought', x: ['who', 'it'], why: 'вещь → which, без it' },
          { t: 'choice', q: 'Что не так: «The film which I watched it was good»?', o: ['лишнее it', 'нужно who', 'нужно where'], a: 0, why: 'which уже заменяет film — it лишнее' }
        ]
      },
      {
        id: 'b1-6', title: 'used to', short: 'Раньше было, а теперь нет',
        rules: [
          { h: 'Форма', t: '**used to + V**: I **used to** play football (раньше играл, сейчас нет). Отрицание: **didn’t use to** (без d). Вопрос: **Did** you **use to**…?' },
          { h: 'Не путать', t: '**be used to + -ing** — привык: I’m used to getting up early. А про сейчас просто: I **usually** get up at 7.' }
        ],
        formula: 'used to + V · didn’t use to · Did … use to?',
        ex: [['I used to live in Kyiv.', 'Раньше я жил в Киеве.'], ['She didn’t use to like coffee.', 'Раньше она не любила кофе.'], ['Did you use to play the piano?', 'Ты раньше играл на пианино?'], ['There used to be a cinema here.', 'Раньше здесь был кинотеатр.']],
        tip: 'used to — только о прошлом. «Я обычно…» = I **usually**… (не I use to).',
        vocab: [['used to', 'раньше (делал)'], ['childhood', 'детство'], ['piano', 'пианино'], ['grow up', 'расти, взрослеть'], ['cinema', 'кинотеатр'], ['change', 'менять(ся)'], ['anymore', 'больше не'], ['when I was a child', 'когда я был ребёнком']],
        tasks: [
          { t: 'choice', q: 'I ___ live in Kyiv. Now I live in Warsaw.', o: ['use to', 'used to', 'am used to'], a: 1, why: 'раньше → used to' },
          { t: 'choice', q: 'She didn’t ___ like coffee.', o: ['used to', 'use to'], a: 1, why: 'после didn’t → use to' },
          { t: 'choice', q: 'Did you ___ play the piano?', o: ['use to', 'used to'], a: 0, why: 'после did → use to' },
          { t: 'input', q: 'There ___ be a cinema here. (раньше был)', a: ['used to'], why: 'There used to be…' },
          { t: 'choice', q: '«Я обычно встаю в 7» — это:', o: ['I use to get up at 7.', 'I usually get up at 7.', 'I used to get up at 7.'], a: 1, why: 'сейчас, обычно → usually' },
          { t: 'tr', ru: 'Я раньше играл в футбол.', a: ['I used to play football'], why: 'used to play' },
          { t: 'order', ru: 'Раньше она не любила кофе.', a: "She didn't use to like coffee", x: ['used'], why: 'didn’t use to' },
          { t: 'tr', ru: 'Ты раньше жил в Киеве?', a: ['Did you use to live in Kyiv', 'Did you use to live in Kiev'], why: 'Did you use to…?' }
        ]
      }
    ],
    b1p: [
      {
        id: 'b1p-5', title: 'Косвенная речь', short: 'Он сказал, что…',
        rules: [
          { h: 'Время — на шаг назад', t: '“I **am** tired.” → She said (that) she **was** tired. am/is → **was**, do → **did**, will → **would**, can → **could**, have done → **had done**.' },
          { h: 'said или told', t: '**say** что-то: He **said** that… **tell** кому-то: He **told me** that…' },
          { h: 'Вопросы', t: 'She asked **if** I liked pizza. They asked **where I lived** — обычный порядок слов, без do.' }
        ],
        formula: 'said (that) + время на шаг назад · told + кому',
        ex: [['He said he was busy.', 'Он сказал, что занят.'], ['She told me she would call.', 'Она сказала мне, что позвонит.'], ['They asked where I lived.', 'Они спросили, где я живу.'], ['Tom said he could help.', 'Том сказал, что может помочь.']],
        tip: 'told — только с «кому»: He told **me**… А said — без: He said that…',
        vocab: [['say / said', 'говорить / сказал'], ['tell / told', 'сказать кому-то'], ['ask / asked', 'спрашивать'], ['that', 'что (союз)'], ['if', 'ли'], ['busy', 'занятой'], ['explain', 'объяснять'], ['answer', 'отвечать; ответ']],
        tasks: [
          { t: 'choice', q: '“I am tired.” → She said she ___ tired.', o: ['is', 'was', 'were'], a: 1, why: 'am → was' },
          { t: 'choice', q: '“I will call.” → He said he ___ call.', o: ['will', 'would'], a: 1, why: 'will → would' },
          { t: 'choice', q: 'He ___ me that he was busy.', o: ['said', 'told'], a: 1, why: 'кому (me) → told' },
          { t: 'choice', q: 'She ___ that she liked pizza.', o: ['said', 'told'], a: 0, why: 'без «кому» → said' },
          { t: 'input', q: '“I can swim.” → Tom said he ___ swim.', a: ['could'], why: 'can → could' },
          { t: 'choice', q: 'She asked me where ___.', o: ['do I live', 'I lived', 'did I live'], a: 1, why: 'обычный порядок: where I lived' },
          { t: 'tr', ru: 'Он сказал, что занят.', a: ['He said he was busy', 'He said that he was busy'], why: 'said + was' },
          { t: 'order', ru: 'Она сказала мне, что позвонит.', a: 'She told me she would call', x: ['said', 'will'], why: 'told me + would' }
        ]
      },
      {
        id: 'b1p-6', title: 'Present Perfect Continuous', short: 'Делаю уже долго — и до сих пор',
        rules: [
          { h: 'Форма', t: '**have / has been + V-ing**: I **have been learning** English for two years.' },
          { h: 'Когда', t: 'Действие началось в прошлом и **продолжается** (часто с for / since / How long). Или только что закончилось и видны последствия: I’m tired — I**’ve been running**.' }
        ],
        formula: 'have / has been + V-ing (+ for / since)',
        ex: [['I have been learning English for two years.', 'Я учу английский уже два года.'], ['How long have you been waiting?', 'Сколько ты уже ждёшь?'], ['It has been raining since morning.', 'Дождь идёт с утра.'], ['She’s tired because she’s been working all day.', 'Она устала, потому что работала весь день.']],
        tip: 'Глаголы состояния (know, like, want) — без -ing: I **have known** him for years.',
        vocab: [['how long', 'как долго'], ['all day', 'весь день'], ['since morning', 'с утра'], ['wait', 'ждать'], ['for ages', 'целую вечность'], ['recently', 'недавно, в последнее время'], ['lately', 'в последнее время'], ['tired', 'уставший']],
        tasks: [
          { t: 'choice', q: 'I ___ English for two years.', o: ['learn', 'have been learning', 'am learning'], a: 1, why: 'длится до сих пор + for → have been learning' },
          { t: 'choice', q: 'How long ___ you been waiting?', o: ['have', 'has', 'did'], a: 0, why: 'you → have' },
          { t: 'choice', q: 'It has been raining ___ morning.', o: ['for', 'since'], a: 1, why: 'начало → since' },
          { t: 'input', q: 'She ___ been working all day.', a: ['has'], why: 'she → has been' },
          { t: 'choice', q: 'I ___ him for ten years.', o: ['have known', 'have been knowing'], a: 0, why: 'know — без -ing' },
          { t: 'tr', ru: 'Я жду уже час.', a: ['I have been waiting for an hour', "I've been waiting for an hour", 'I have been waiting for one hour', "I've been waiting for one hour"], why: 'have been waiting for an hour' },
          { t: 'order', ru: 'Как долго ты учишь английский?', a: 'How long have you been learning English', x: ['did'], why: 'How long have you been…' },
          { t: 'tr', ru: 'Весь день идёт дождь.', a: ['It has been raining all day', "It's been raining all day"], why: 'has been raining all day' }
        ]
      }
    ]
  };
  window.COURSE.forEach(function (lv) { if (EXTRA[lv.id]) lv.lessons = lv.lessons.concat(EXTRA[lv.id]); });

  /* Videos: official BBC Learning English / British Council lessons on YouTube (free).
     q = topic for a YouTube search, so there is always "more on this topic", in English and in Russian. */
  var V = {
    'a1-1': { q: 'verb to be am is are' },
    'a1-2': { v: [['Articles — 6 Minute Grammar (BBC)', 'ryRu8zFCKZE']], q: 'articles a an the' },
    'a1-3': { v: [['This, that, these and those — BBC Learners’ Questions', 'RdwhKOhT0GI']], q: 'possessive adjectives my your his her' },
    'a1-4': { q: 'there is there are some any' },
    'a1-5': { q: 'telling the time in English quarter past half past' },
    'a1-6': { v: [['Asking Questions — 6 Minute Grammar (BBC)', 'j9b1CNN_rFU']], q: 'question words what where when why how' },
    'a1p-1': { v: [['How to use present tenses — 6 Minute Grammar (BBC)', 'X6LuWwb9whM']], q: 'present simple tense' },
    'a1p-2': { v: [['Asking Questions — 6 Minute Grammar (BBC)', 'j9b1CNN_rFU']], q: 'present simple questions negatives do does' },
    'a1p-3': { v: [['Adverbs of Frequency — 6 Minute Grammar (BBC)', 'voQLMgJE-QE'], ['Prepositions of time — Prepositions with Georgie (BBC)', 'UYjd9AU9jU8']], q: 'adverbs of frequency always usually often' },
    'a1p-4': { q: 'can can\'t ability requests' },
    'a1p-5': { v: [['Verb patterns — 6 Minute Grammar (BBC)', 'ohR163PgEK4']], q: 'like love hate verb ing' },
    'a1p-6': { q: 'object pronouns me him her us them' },
    'a2-1': { v: [['The past simple tense — 6 Minute Grammar (BBC)', 'PgsG98vByiw']], q: 'was were past simple' },
    'a2-2': { v: [['The past simple tense — 6 Minute Grammar (BBC)', 'PgsG98vByiw']], q: 'past simple regular verbs ed' },
    'a2-3': { v: [['How to use irregular verbs — 6 Minute Vocabulary (BBC)', '886JeoBoQ7g']], q: 'irregular verbs past simple' },
    'a2-4': { v: [['Prepositions of place — Prepositions with Georgie (BBC)', 'pCoefMybtYc'], ['in, on, at — 6 lessons in 20 minutes (BBC)', 'Y_2WPOJKZaI']], q: 'prepositions of place in on at' },
    'a2-5': { v: [['Uncountable nouns — 6 Minute Vocabulary (BBC)', '4D6JErWRS9k'], ['Countable and uncountable nouns — British Council', 'BTX8T2KP6uU']], q: 'much many a lot of countable uncountable' },
    'a2-6': { v: [['Past simple and past continuous — 6 Minute Grammar (BBC)', 'uTB5I8V9Eog']], q: 'past continuous tense' },
    'a2p-1': { v: [['Present Simple and Present Continuous — 6 Minute Grammar (BBC)', 'xFsYrTIndhI']], q: 'present continuous tense' },
    'a2p-2': { v: [['Present Simple and Present Continuous — 6 Minute Grammar (BBC)', 'xFsYrTIndhI']], q: 'present simple vs present continuous' },
    'a2p-3': { v: [['Talking about the future — 6 Minute Grammar (BBC)', 'jcAX1RtKq3U'], ['Present continuous and going to — 6 Minute Grammar (BBC)', '-8660VeIj4U']], q: 'will vs going to' },
    'a2p-4': { v: [['Comparatives and superlatives — 6 Minute Grammar', 'FAhpT7BH7GE']], q: 'comparatives and superlatives' },
    'a2p-5': { v: [['Too, very and enough — 6 Minute Grammar (BBC)', '5UxMyCxQThE'], ['Adjectives and adverbs — 6 Minute Grammar (BBC)', '1N1MpESNE6o']], q: 'too enough adverbs ly' },
    'a2p-6': { v: [['Verb patterns — 6 Minute Grammar (BBC)', 'ohR163PgEK4']], q: 'gerund or infinitive' },
    'b1-1': { v: [['Present perfect with ever and never — 6 Minute Grammar (BBC)', 'o-GWYDA4IQY'], ['Present perfect with just, already and yet — 6 Minute Grammar (BBC)', '8_nhtAwI0dA']], q: 'present perfect tense' },
    'b1-2': { v: [['Present perfect and past simple — 6 Minute Grammar (BBC)', 'jwmKjgwlMk8'], ['Present perfect with for and since — 6 Minute Grammar (BBC)', 'sSZcAh42qtI']], q: 'present perfect vs past simple' },
    'b1-3': { v: [['Have to and must — 6 Minute Grammar (BBC)', 'HUXXgVElADg']], q: 'must have to should' },
    'b1-4': { v: [['Zero and first conditional — 6 Minute Grammar (BBC)', 'K-MKAjvvcsw'], ['The first conditional — 6 Minute Grammar (BBC)', '8VETylIxyhw']], q: 'first conditional' },
    'b1-5': { v: [['Defining relative clauses — 6 Minute Grammar (BBC)', '1iC_rULeuZc']], q: 'relative clauses who which where' },
    'b1-6': { v: [['Used to — 6 Minute Grammar (BBC)', '3dA7P5arkyc'], ['Used to and would — 6 Minute Grammar (BBC)', 'V2quIYo41Ig']], q: 'used to' },
    'b1p-1': { v: [['Present and past passives — 6 Minute Grammar (BBC)', 'nI5zaB6QL-o']], q: 'passive voice' },
    'b1p-2': { v: [['The second conditional — 6 Minute Grammar (BBC)', '3OuqzHxlrHc']], q: 'second conditional' },
    'b1p-3': { v: [['Phrasal verbs types 1–4 — 6 Minute Grammar (BBC)', 'FBmjH6nh5-k']], q: 'common phrasal verbs' },
    'b1p-4': { v: [['Make polite requests — English at Work (BBC)', 'QWBwCoecvkM']], q: 'polite requests could you would you mind' },
    'b1p-5': { v: [['Reported speech — 6 Minute Grammar (BBC)', 'L-wTVCByxzk']], q: 'reported speech' },
    'b1p-6': { v: [['Present perfect continuous — 6 Minute Grammar (BBC)', '70w98yeKj74']], q: 'present perfect continuous' }
  };
  window.COURSE.forEach(function (lv) { lv.lessons.forEach(function (ls) { var x = V[ls.id] || {}; ls.videos = x.v || []; ls.yt = x.q || ls.title; }); });
})();
