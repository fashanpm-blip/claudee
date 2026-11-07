/* LevelUp English — the tenses tab. Each tense: when to use it, form (+ / − / ?), time markers,
   a timeline picture (tl), examples, a typical mistake, a comparison and practice tasks. */
window.TENSES = [
  {
    id: 'ps', name: 'Present Simple', ru: 'Настоящее простое', level: 'A1', tl: 'habit',
    idea: 'Привычки, факты, расписание — то, что бывает регулярно или всегда правда.',
    uses: ['Привычки и регулярные действия: I **go** to the gym on Mondays.', 'Факты и общие истины: Water **boils** at 100°C.', 'Расписание: The train **leaves** at 6.'],
    form: [['+', 'I / you / we / they **work** · he / she / it **works**', 'She works in a bank.'], ['−', "**don't / doesn't** + V", "He doesn't like coffee."], ['?', '**Do / Does** + кто + V?', 'Do you speak English?']],
    markers: ['always', 'usually', 'often', 'sometimes', 'never', 'every day', 'on Mondays', 'twice a week'],
    ex: [['I usually get up at seven.', 'Я обычно встаю в семь.'], ['She doesn’t eat meat.', 'Она не ест мясо.'], ['Does he live here?', 'Он живёт здесь?']],
    mistake: 'He **like** music → He **likes** music. После does — без s: Does she **like**…?',
    vs: 'Present Continuous — то, что происходит прямо сейчас: I **work** in a bank, but today I**’m working** from home.',
    tasks: [
      { t: 'choice', q: 'She ___ to school by bus.', o: ['go', 'goes', 'is going'], a: 1, why: 'регулярно, she → goes' },
      { t: 'input', q: 'My brother ___ (watch) football every Sunday.', a: ['watches'], why: 'ch → es' },
      { t: 'input', q: 'They ___ (not / live) in Warsaw.', a: ["don't live", 'do not live'], why: 'they → don’t live' },
      { t: 'input', q: '___ your mum work in a hospital?', a: ['does'], why: 'your mum (she) → Does' },
      { t: 'choice', q: 'Water ___ at 100 degrees.', o: ['boil', 'boils', 'is boiling'], a: 1, why: 'факт → Present Simple' },
      { t: 'tr', ru: 'Я не говорю по-немецки.', a: ["I don't speak German", 'I do not speak German'], why: "don't speak" },
      { t: 'tr', ru: 'Во сколько начинаются уроки?', a: ['What time do lessons start', 'When do lessons start', 'What time do the lessons start', 'When do the lessons start', 'What time does school start', 'When does school start'], why: 'What time do lessons start?' },
      { t: 'order', ru: 'Он никогда не опаздывает.', a: 'He is never late', x: ['does'], why: 'never после is' }
    ]
  },
  {
    id: 'pc', name: 'Present Continuous', ru: 'Настоящее длительное', level: 'A1', tl: 'now',
    idea: 'То, что происходит прямо сейчас или временно, в этот период.',
    uses: ['Прямо сейчас: Look! It **is raining**.', 'Временно, в этот период: I**’m living** with my aunt this month.', 'Договорённости на ближайшее будущее: We**’re meeting** at six.'],
    form: [['+', '**am / is / are + V-ing**', 'They are playing.'], ['−', "**am not / isn't / aren't** + V-ing", "I'm not sleeping."], ['?', '**Am / Is / Are** + кто + V-ing?', 'Are you listening?']],
    markers: ['now', 'right now', 'at the moment', 'today', 'this week', 'Look!', 'Listen!'],
    ex: [['I am reading a book now.', 'Я сейчас читаю книгу.'], ['She isn’t working today.', 'Сегодня она не работает.'], ['What are you doing?', 'Что ты делаешь?']],
    mistake: 'I **reading** → I **am** reading. И без -ing у know, like, want: I **know** (не I’m knowing).',
    vs: 'Present Simple — обычно, всегда: He **plays** tennis (вообще). He**’s playing** tennis (сейчас).',
    tasks: [
      { t: 'choice', q: 'Look! The baby ___.', o: ['sleeps', 'is sleeping', 'sleep'], a: 1, why: 'Look! → сейчас' },
      { t: 'input', q: 'I ___ (write) an email at the moment.', a: ['am writing', "'m writing"], why: 'am + writing (e убираем)' },
      { t: 'input', q: 'They ___ (not / listen) to the teacher.', a: ["aren't listening", 'are not listening'], why: 'aren’t + listening' },
      { t: 'input', q: '___ you watching this film?', a: ['are'], why: 'you → Are' },
      { t: 'choice', q: 'I ___ the answer.', o: ['know', 'am knowing'], a: 0, why: 'know — глагол состояния' },
      { t: 'tr', ru: 'Что ты сейчас делаешь?', a: ['What are you doing now', 'What are you doing right now', 'What are you doing'], why: 'What are you doing?' },
      { t: 'tr', ru: 'Она сейчас бежит в парке.', a: ['She is running in the park now', "She's running in the park now", 'She is running in the park', "She's running in the park"], why: 'is running (удвоение n)' },
      { t: 'order', ru: 'Мы встречаемся в шесть.', a: "We're meeting at six", x: ['meet'], why: 'договорённость → Continuous' }
    ]
  },
  {
    id: 'pas', name: 'Past Simple', ru: 'Прошедшее простое', level: 'A2', tl: 'past',
    idea: 'Законченное действие в прошлом, обычно с понятным временем: вчера, в 2020, неделю назад.',
    uses: ['Законченное действие в прошлом: I **visited** Rome in 2023.', 'Цепочка событий: I **woke up**, **had** breakfast and **left**.'],
    form: [['+', 'правильные **V-ed** · неправильные — 2-я форма (went, saw)', 'We went to the sea.'], ['−', "**didn't** + V", "I didn't call him."], ['?', '**Did** + кто + V?', 'Did you see it?']],
    markers: ['yesterday', 'last week', 'two days ago', 'in 2020', 'when I was a child'],
    ex: [['I watched a film last night.', 'Вчера вечером я посмотрел фильм.'], ['She didn’t come to the party.', 'Она не пришла на вечеринку.'], ['Where did you go?', 'Куда ты ходил?']],
    mistake: 'Did you **went**? → Did you **go**? После did — первая форма.',
    vs: 'Present Perfect — если время не названо и важен результат: I **have lost** my keys (и сейчас их нет). I **lost** them yesterday.',
    tasks: [
      { t: 'input', q: 'We ___ (go) to the cinema yesterday.', a: ['went'], why: 'go → went' },
      { t: 'input', q: 'She ___ (study) all night.', a: ['studied'], why: 'y → ied' },
      { t: 'input', q: 'I ___ (not / see) him last week.', a: ["didn't see", 'did not see'], why: 'didn’t + see' },
      { t: 'choice', q: '___ you call your grandma?', o: ['Do', 'Did', 'Were'], a: 1, why: 'прошлое → Did' },
      { t: 'choice', q: 'Did you ___ my message?', o: ['read', 'readed', 'reads'], a: 0, why: 'после did — 1-я форма' },
      { t: 'tr', ru: 'Я купил это два дня назад.', a: ['I bought it two days ago', 'I bought this two days ago', 'I bought it 2 days ago'], why: 'buy → bought, ago' },
      { t: 'tr', ru: 'Где ты был вчера?', a: ['Where were you yesterday'], why: 'were + yesterday' },
      { t: 'order', ru: 'Мы не играли в футбол.', a: "We didn't play football", x: ['played'], why: 'didn’t + play' }
    ]
  },
  {
    id: 'pac', name: 'Past Continuous', ru: 'Прошедшее длительное', level: 'A2', tl: 'pastProg',
    idea: 'Действие было в процессе в какой-то момент в прошлом (часто его что-то прервало).',
    uses: ['В процессе в момент прошлого: At 8 pm I **was watching** TV.', 'Длинное действие, которое прервали: I **was walking** home **when** it **started** to rain.', 'Два действия одновременно: **While** she was cooking, I was reading.'],
    form: [['+', '**was / were + V-ing**', 'They were playing.'], ['−', "**wasn't / weren't** + V-ing", "It wasn't raining."], ['?', '**Was / Were** + кто + V-ing?', 'What were you doing?']],
    markers: ['at 8 pm yesterday', 'when', 'while', 'all evening', 'at that moment'],
    ex: [['At nine I was sleeping.', 'В девять я спал.'], ['The phone rang while I was having a shower.', 'Телефон зазвонил, пока я был в душе.'], ['What were you doing at six?', 'Что ты делал в шесть?']],
    mistake: 'When I **was arriving**, they left → When I **arrived**… Короткое действие — Past Simple.',
    vs: 'Past Simple — короткое законченное действие: I **was reading** (процесс), when he **called** (момент).',
    tasks: [
      { t: 'choice', q: 'At 7 pm we ___ dinner.', o: ['had', 'were having', 'have'], a: 1, why: 'в процессе в момент прошлого' },
      { t: 'input', q: 'It ___ (rain) when I left home.', a: ['was raining'], why: 'was + raining' },
      { t: 'input', q: 'They ___ (not / listen) when the teacher explained it.', a: ["weren't listening", 'were not listening'], why: 'weren’t + listening' },
      { t: 'choice', q: 'I was walking home ___ I saw an accident.', o: ['when', 'while'], a: 0, why: 'короткое действие → when' },
      { t: 'choice', q: 'While I ___, my brother was playing games.', o: ['studied', 'was studying'], a: 1, why: 'while + длинное действие' },
      { t: 'tr', ru: 'Что ты делал вчера в восемь?', a: ['What were you doing at eight yesterday', 'What were you doing yesterday at eight', 'What were you doing at 8 yesterday', 'What were you doing yesterday at 8'], why: 'What were you doing…?' },
      { t: 'tr', ru: 'Я спал, когда ты позвонил.', a: ['I was sleeping when you called'], why: 'was sleeping + called' },
      { t: 'order', ru: 'Пока она готовила, я читал.', a: 'While she was cooking I was reading', x: ['cooked'], why: 'while + was cooking' }
    ]
  },
  {
    id: 'fs', name: 'Future Simple (will)', ru: 'Будущее простое', level: 'A2', tl: 'will',
    idea: 'Решение в момент речи, обещание, прогноз-мнение о будущем.',
    uses: ['Спонтанное решение: The phone is ringing — I**’ll** answer it!', 'Обещание: I **will** help you.', 'Прогноз-мнение: I think it **will** rain.'],
    form: [['+', '**will + V** (для всех лиц)', 'She will call you.'], ['−', "**won't** + V", "I won't tell anyone."], ['?', '**Will** + кто + V?', 'Will you come?']],
    markers: ['tomorrow', 'next week', 'soon', 'I think', 'probably', 'in 2030'],
    ex: [['I’ll call you later.', 'Я позвоню тебе позже.'], ['It won’t be easy.', 'Будет непросто.'], ['Will you help me?', 'Ты мне поможешь?']],
    mistake: 'I will **to** go → I will **go**. После will нет to. И после if — не will: If it **rains** (не will rain).',
    vs: 'be going to — план, решённый заранее: I**’m going to** study medicine (решил давно).',
    tasks: [
      { t: 'choice', q: 'It’s cold. — I ___ close the window.', o: ['will', 'am going to'], a: 0, why: 'решение сейчас → will' },
      { t: 'input', q: 'I promise I ___ (not / be) late.', a: ["won't be", 'will not be'], why: 'won’t be' },
      { t: 'input', q: 'I think she ___ (win) the race.', a: ['will win', "'ll win"], why: 'прогноз-мнение → will' },
      { t: 'choice', q: '___ you help me with this box?', o: ['Will', 'Do', 'Are'], a: 0, why: 'просьба о будущем → Will you…?' },
      { t: 'choice', q: 'If it ___ tomorrow, we will stay home.', o: ['will rain', 'rains'], a: 1, why: 'после if — Present' },
      { t: 'tr', ru: 'Я позвоню тебе завтра.', a: ["I'll call you tomorrow", 'I will call you tomorrow'], why: 'will call' },
      { t: 'tr', ru: 'Думаю, будет дождь.', a: ['I think it will rain', "I think it'll rain"], why: 'I think + will' },
      { t: 'order', ru: 'Я никому не скажу.', a: "I won't tell anyone", x: ['to', 'will'], why: 'won’t + tell' }
    ]
  },
  {
    id: 'gt', name: 'be going to', ru: 'Собираюсь (план)', level: 'A2', tl: 'goingto',
    idea: 'План, решённый заранее, или прогноз по явным признакам.',
    uses: ['Намерение, план: I**’m going to** learn Spanish.', 'Видно по признакам: Look at the clouds — it**’s going to** rain.'],
    form: [['+', '**am / is / are going to + V**', "We're going to move."], ['−', "**am not / isn't / aren't going to** + V", "She isn't going to come."], ['?', '**Am / Is / Are** + кто + **going to** + V?', 'Are you going to buy it?']],
    markers: ['next year', 'tomorrow', 'this summer', 'soon', 'Look!'],
    ex: [['I’m going to study IT.', 'Я собираюсь изучать IT.'], ['They aren’t going to sell the house.', 'Они не собираются продавать дом.'], ['What are you going to do?', 'Что ты собираешься делать?']],
    mistake: 'I going to… → I **am** going to… Не забывай am / is / are.',
    vs: 'will — решение прямо сейчас: Oh, I forgot! I**’ll** buy milk now. А план — I**’m going to** buy a car.',
    tasks: [
      { t: 'choice', q: 'We bought tickets. We ___ fly to Rome.', o: ['will', 'are going to'], a: 1, why: 'план → going to' },
      { t: 'choice', q: 'Look at the sky! It ___ snow.', o: ['will', 'is going to'], a: 1, why: 'видно по признакам → going to' },
      { t: 'input', q: 'I ___ going to start a new course. (am)', a: ['am', "'m"], why: 'I am going to' },
      { t: 'input', q: 'She ___ going to come. (не)', a: ["isn't", 'is not'], why: 'isn’t going to' },
      { t: 'choice', q: 'What ___ you going to do this summer?', o: ['are', 'do', 'will'], a: 0, why: 'Are you going to…?' },
      { t: 'tr', ru: 'Я собираюсь выучить испанский.', a: ["I'm going to learn Spanish", 'I am going to learn Spanish'], why: 'am going to learn' },
      { t: 'tr', ru: 'Они собираются переехать.', a: ["They're going to move", 'They are going to move'], why: 'are going to move' },
      { t: 'order', ru: 'Ты собираешься это купить?', a: 'Are you going to buy it', x: ['will'], why: 'Are you going to…?' }
    ]
  },
  {
    id: 'pp', name: 'Present Perfect', ru: 'Настоящее совершённое', level: 'B1', tl: 'pp',
    idea: 'Прошлое, которое важно сейчас: опыт, результат, «уже / ещё не», период до сих пор.',
    uses: ['Опыт (когда — неважно): I**’ve been** to Paris.', 'Результат сейчас: I**’ve lost** my keys (их нет).', 'Период до сих пор с for / since: She**’s lived** here for two years.'],
    form: [['+', '**have / has + V3**', 'She has finished.'], ['−', "**haven't / hasn't** + V3", "I haven't seen it."], ['?', '**Have / Has** + кто + V3?', 'Have you ever tried sushi?']],
    markers: ['ever', 'never', 'already', 'just', 'yet', 'for', 'since', 'recently', 'so far'],
    ex: [['I have never been to Paris.', 'Я никогда не был в Париже.'], ['She has just arrived.', 'Она только что приехала.'], ['Have you finished yet?', 'Ты уже закончил?']],
    mistake: 'I **have seen** him yesterday → I **saw** him yesterday. Если время названо — Past Simple.',
    vs: 'Past Simple — законченное время в прошлом: I **have been** to Spain. I **went** there in 2023.',
    tasks: [
      { t: 'choice', q: 'I ___ this film three times.', o: ['saw', 'have seen'], a: 1, why: 'опыт, время не названо' },
      { t: 'choice', q: 'I ___ him yesterday.', o: ['have met', 'met'], a: 1, why: 'yesterday → Past Simple' },
      { t: 'input', q: 'She ___ (just / leave).', a: ['has just left', "'s just left"], why: 'has just + left' },
      { t: 'input', q: 'Have you ___ (be) to London?', a: ['been'], why: 'be – was – been' },
      { t: 'choice', q: 'We have lived here ___ 2022.', o: ['for', 'since'], a: 1, why: 'начало → since' },
      { t: 'tr', ru: 'Я никогда не пробовал суши.', a: ["I've never tried sushi", 'I have never tried sushi'], why: 'have never tried' },
      { t: 'tr', ru: 'Ты уже сделал домашку?', a: ['Have you done your homework yet', 'Have you already done your homework', 'Have you done the homework yet', 'Have you finished your homework yet'], why: 'Have you done… yet?' },
      { t: 'order', ru: 'Я знаю его пять лет.', a: 'I have known him for five years', x: ['since', 'know'], why: 'have known + for' }
    ]
  },
  {
    id: 'ppc', name: 'Present Perfect Continuous', ru: 'Настоящее совершённое длительное', level: 'B1', tl: 'ppc',
    idea: 'Действие началось в прошлом и всё ещё длится (или только что закончилось — видны последствия).',
    uses: ['Длится до сих пор: I**’ve been learning** English for two years.', 'Видны последствия: I’m tired — I**’ve been running**.', 'Вопрос «как долго»: How long **have** you **been waiting**?'],
    form: [['+', '**have / has been + V-ing**', 'It has been raining.'], ['−', "**haven't / hasn't been** + V-ing", "I haven't been sleeping well."], ['?', '**Have / Has** + кто + **been** + V-ing?', 'How long have you been working here?']],
    markers: ['for', 'since', 'how long', 'all day', 'lately', 'recently'],
    ex: [['I have been learning English for two years.', 'Я учу английский уже два года.'], ['It has been raining since morning.', 'Дождь идёт с утра.'], ['How long have you been waiting?', 'Сколько ты уже ждёшь?']],
    mistake: 'I **am learning** English for two years → I **have been learning**… «Уже столько-то времени» — только Perfect.',
    vs: 'Present Perfect — результат, сколько сделано: I**’ve read** 3 books. I**’ve been reading** all day (процесс).',
    tasks: [
      { t: 'choice', q: 'I ___ for an hour!', o: ['am waiting', 'have been waiting', 'wait'], a: 1, why: 'длится до сих пор + for' },
      { t: 'input', q: 'How long ___ you been learning English?', a: ['have'], why: 'you → have' },
      { t: 'input', q: 'It ___ been snowing since morning.', a: ['has'], why: 'it → has' },
      { t: 'choice', q: 'She is tired because she ___ all day.', o: ['has been working', 'works'], a: 0, why: 'видны последствия' },
      { t: 'choice', q: 'I ___ her since school.', o: ['have known', 'have been knowing'], a: 0, why: 'know — без -ing' },
      { t: 'tr', ru: 'Я жду уже час.', a: ['I have been waiting for an hour', "I've been waiting for an hour"], why: 'have been waiting for an hour' },
      { t: 'tr', ru: 'Как долго ты здесь работаешь?', a: ['How long have you been working here', 'How long have you worked here'], why: 'How long have you been working…?' },
      { t: 'order', ru: 'Весь день идёт дождь.', a: 'It has been raining all day', x: ['is'], why: 'has been raining' }
    ]
  },
  {
    id: 'pap', name: 'Past Perfect', ru: 'Прошедшее совершённое', level: 'B1', tl: 'pastperf',
    idea: '«Предпрошедшее»: что случилось раньше другого момента в прошлом.',
    uses: ['Раньше другого прошлого действия: When I arrived, the film **had** already **started**.', 'В косвенной речи: She said she **had seen** it.'],
    form: [['+', '**had + V3** (для всех лиц)', 'They had left.'], ['−', "**hadn't** + V3", "I hadn't eaten."], ['?', '**Had** + кто + V3?', 'Had you met him before?']],
    markers: ['already', 'before', 'by the time', 'after', 'just', 'never … before'],
    ex: [['When we got to the station, the train had left.', 'Когда мы пришли на вокзал, поезд уже ушёл.'], ['I had never seen the sea before that trip.', 'До той поездки я никогда не видел моря.'], ['Had you finished before he came?', 'Ты закончил до того, как он пришёл?']],
    mistake: 'When I came, he **already left** → he **had already left**. Если важно, что раньше, — had + V3.',
    vs: 'Past Simple — просто события по порядку: I came and he left (сначала пришёл я). I came — he **had left** (он ушёл раньше).',
    tasks: [
      { t: 'choice', q: 'When I arrived, the lesson ___ already ___.', o: ['has / started', 'had / started', 'was / starting'], a: 1, why: 'раньше другого прошлого → had started' },
      { t: 'input', q: 'She was hungry because she ___ (not / eat) all day.', a: ["hadn't eaten", 'had not eaten'], why: 'hadn’t + eaten' },
      { t: 'input', q: 'I ___ never seen snow before I moved here.', a: ['had'], why: 'had never seen' },
      { t: 'choice', q: 'By the time we got there, everybody ___.', o: ['left', 'had left', 'has left'], a: 1, why: 'by the time → had left' },
      { t: 'choice', q: '___ you met her before the party?', o: ['Have', 'Had', 'Did'], a: 1, why: 'до другого прошлого → Had' },
      { t: 'tr', ru: 'Когда мы пришли, поезд уже ушёл.', a: ['When we arrived, the train had already left', 'When we arrived the train had already left', 'When we came, the train had already left', 'When we came the train had already left', 'When we got there, the train had already left', 'When we got there the train had already left'], why: 'had already left' },
      { t: 'tr', ru: 'Она сказала, что видела этот фильм.', a: ['She said she had seen this film', 'She said that she had seen this film', 'She said she had seen the film', 'She said that she had seen the film', 'She said she had seen that film', 'She said that she had seen that film'], why: 'косвенная речь → had seen' },
      { t: 'order', ru: 'Я не ел весь день.', a: "I hadn't eaten all day", x: ["didn't"], why: 'hadn’t eaten' }
    ]
  },
  {
    id: 'fc', name: 'Future Continuous', ru: 'Будущее длительное', level: 'B2', tl: 'futcont',
    idea: 'Действие будет в процессе в определённый момент в будущем.',
    uses: ['В процессе в момент будущего: This time tomorrow I**’ll be flying** to Rome.', 'Вежливый вопрос о планах: **Will** you **be using** the car tonight?'],
    form: [['+', '**will be + V-ing**', 'I will be working.'], ['−', "**won't be** + V-ing", "She won't be sleeping."], ['?', '**Will** + кто + **be** + V-ing?', 'Will you be waiting for me?']],
    markers: ['this time tomorrow', 'at 8 pm tomorrow', 'all day tomorrow', 'next week at this time'],
    ex: [['At 10 tomorrow I’ll be taking my exam.', 'Завтра в 10 я буду сдавать экзамен.'], ['Don’t call at nine — we’ll be having dinner.', 'Не звони в девять — мы будем ужинать.'], ['Will you be using your laptop tonight?', 'Ты будешь пользоваться ноутбуком вечером?']],
    mistake: 'This time tomorrow I **will fly** → I **will be flying**. Процесс в момент будущего — с be + -ing.',
    vs: 'Future Simple — сам факт: I**’ll call** you. Future Continuous — процесс: I**’ll be working** at that time.',
    tasks: [
      { t: 'choice', q: 'This time tomorrow I ___ on the beach.', o: ['will lie', 'will be lying'], a: 1, why: 'процесс в момент будущего' },
      { t: 'input', q: "Don't call at 8 — I ___ (have) dinner.", a: ['will be having', "'ll be having"], why: 'will be + having' },
      { t: 'input', q: '___ you be using the car tonight?', a: ['will'], why: 'Will you be using…?' },
      { t: 'choice', q: 'At 3 pm tomorrow she ___ her exam.', o: ['will be taking', 'takes', 'is taken'], a: 0, why: 'will be taking' },
      { t: 'input', q: 'We ___ be sleeping at midnight. (не)', a: ["won't", 'will not'], why: 'won’t be' },
      { t: 'tr', ru: 'Завтра в это время я буду лететь в Рим.', a: ["This time tomorrow I'll be flying to Rome", 'This time tomorrow I will be flying to Rome', "Tomorrow at this time I'll be flying to Rome", 'Tomorrow at this time I will be flying to Rome', "I'll be flying to Rome this time tomorrow", 'I will be flying to Rome this time tomorrow'], why: 'will be flying' },
      { t: 'tr', ru: 'Ты будешь ждать меня?', a: ['Will you be waiting for me'], why: 'Will you be waiting…?' },
      { t: 'order', ru: 'В девять мы будем ужинать.', a: "We'll be having dinner at nine", x: ['have'], why: 'will be having' }
    ]
  },
  {
    id: 'fp', name: 'Future Perfect', ru: 'Будущее совершённое', level: 'B2', tl: 'futperf',
    idea: 'Действие будет завершено к определённому моменту в будущем.',
    uses: ['Завершится к сроку: By June I **will have finished** school.', 'Уверенность в результате к моменту: They**’ll have arrived** by now.'],
    form: [['+', '**will have + V3**', 'She will have left.'], ['−', "**won't have** + V3", "I won't have finished."], ['?', '**Will** + кто + **have** + V3?', 'Will you have done it by Friday?']],
    markers: ['by tomorrow', 'by the end of the year', 'by the time', 'by 2030', 'before'],
    ex: [['By 2030 I will have graduated.', 'К 2030 году я окончу университет.'], ['I won’t have finished the report by Monday.', 'Я не закончу отчёт к понедельнику.'], ['Will you have read the book by Friday?', 'Ты дочитаешь книгу к пятнице?']],
    mistake: 'By Friday I **will finish** → I **will have finished**. «К какому-то сроку» — will have + V3.',
    vs: 'Future Continuous — процесс в момент: At 5 I**’ll be writing**. Future Perfect — уже готово: By 5 I**’ll have written** it.',
    tasks: [
      { t: 'choice', q: 'By June I ___ school.', o: ['will finish', 'will have finished', 'finish'], a: 1, why: 'к сроку → will have finished' },
      { t: 'input', q: 'By the time you arrive, we ___ (eat).', a: ['will have eaten', "'ll have eaten"], why: 'will have + eaten' },
      { t: 'input', q: "I ___ have finished it by Monday. (не)", a: ["won't", 'will not'], why: 'won’t have finished' },
      { t: 'choice', q: 'Will you have ___ the book by Friday?', o: ['read', 'reading', 'reads'], a: 0, why: 'have + V3 (read)' },
      { t: 'choice', q: 'Какое слово — подсказка для Future Perfect?', o: ['by (к)', 'now', 'every day'], a: 0, why: 'by + срок' },
      { t: 'tr', ru: 'К 2030 году я окончу университет.', a: ['By 2030 I will have graduated', "By 2030 I'll have graduated", 'By 2030 I will have finished university', "By 2030 I'll have finished university", 'By 2030 I will have graduated from university', "By 2030 I'll have graduated from university"], why: 'will have graduated' },
      { t: 'tr', ru: 'Они уже уедут к тому времени.', a: ['They will have left by then', "They'll have left by then", 'They will have already left by then', "They'll have already left by then", 'They will have left by that time', "They'll have left by that time"], why: 'will have left' },
      { t: 'order', ru: 'Я закончу это к вечеру.', a: "I'll have finished it by the evening", x: ['finish'], why: 'will have finished by…' }
    ]
  },
  {
    id: 'papc', name: 'Past Perfect Continuous', ru: 'Прошедшее совершённое длительное', level: 'B2', tl: 'pastperfcont',
    idea: 'Действие длилось какое-то время до момента в прошлом.',
    uses: ['Длилось до момента в прошлом: I **had been waiting** for an hour when she finally came.', 'Причина состояния в прошлом: He was tired because he **had been working** all night.'],
    form: [['+', '**had been + V-ing**', 'They had been playing.'], ['−', "**hadn't been** + V-ing", "I hadn't been sleeping well."], ['?', '**Had** + кто + **been** + V-ing?', 'How long had you been living there?']],
    markers: ['for', 'since', 'how long', 'before', 'when', 'all day'],
    ex: [['I had been waiting for an hour when the bus came.', 'Я ждал уже час, когда пришёл автобус.'], ['She was tired because she had been studying all night.', 'Она устала, потому что всю ночь занималась.'], ['How long had they been living there?', 'Как долго они там прожили (к тому моменту)?']],
    mistake: 'I **was waiting** for an hour when… → I **had been waiting** for an hour. «Уже столько-то» в прошлом — had been + -ing.',
    vs: 'Present Perfect Continuous — до сейчас: I**’ve been waiting** for an hour. Past Perfect Continuous — до момента в прошлом.',
    tasks: [
      { t: 'choice', q: 'I ___ for an hour when she finally came.', o: ['have been waiting', 'had been waiting', 'was waited'], a: 1, why: 'до момента в прошлом' },
      { t: 'input', q: 'He was tired because he ___ (work) all night.', a: ['had been working'], why: 'had been + working' },
      { t: 'input', q: 'How long ___ they been living there?', a: ['had'], why: 'Had … been living' },
      { t: 'choice', q: 'Her eyes were red. She ___.', o: ['had been crying', 'has cried', 'cries'], a: 0, why: 'причина состояния в прошлом' },
      { t: 'input', q: 'We ___ been playing for long when it started to rain. (не)', a: ["hadn't", 'had not'], why: 'hadn’t been' },
      { t: 'tr', ru: 'Я ждал уже час, когда пришёл автобус.', a: ['I had been waiting for an hour when the bus came', "I'd been waiting for an hour when the bus came", 'I had been waiting for an hour when the bus arrived', "I'd been waiting for an hour when the bus arrived"], why: 'had been waiting' },
      { t: 'tr', ru: 'Она устала, потому что бегала.', a: ['She was tired because she had been running', "She was tired because she'd been running"], why: 'had been running' },
      { t: 'order', ru: 'Они жили там два года.', a: 'They had been living there for two years', x: ['since'], why: 'had been living + for' }
    ]
  },
  {
    id: 'fpc', name: 'Future Perfect Continuous', ru: 'Будущее совершённое длительное', level: 'B2', tl: 'futperfcont',
    idea: 'Сколько времени действие будет длиться к моменту в будущем.',
    uses: ['Длительность к моменту будущего: In June I **will have been studying** English for five years.'],
    form: [['+', '**will have been + V-ing**', 'She will have been working.'], ['−', "**won't have been** + V-ing", "I won't have been living here long."], ['?', '**Will** + кто + **have been** + V-ing?', 'How long will you have been working there?']],
    markers: ['for … by', 'by next year', 'by the time', 'in June … for'],
    ex: [['By June I will have been learning English for five years.', 'К июню я буду учить английский уже пять лет.'], ['Next month she will have been working here for a year.', 'В следующем месяце будет год, как она здесь работает.'], ['How long will you have been living in Poland by 2027?', 'Сколько ты будешь жить в Польше к 2027-му?']],
    mistake: 'Самое редкое время — в речи его часто заменяют Future Perfect или простыми фразами. Главное — узнавать его.',
    vs: 'Future Perfect — результат к сроку: I**’ll have written** 3 books. Future Perfect Continuous — длительность: I**’ll have been writing** for 3 years.',
    tasks: [
      { t: 'choice', q: 'By June I ___ English for five years.', o: ['will learn', 'will have been learning', 'am learning'], a: 1, why: 'длительность к сроку' },
      { t: 'input', q: 'Next month she ___ (work) here for a year.', a: ['will have been working', "'ll have been working"], why: 'will have been + working' },
      { t: 'input', q: 'How long will you have ___ living here by 2027?', a: ['been'], why: 'will have been living' },
      { t: 'choice', q: 'Какая часть есть в этом времени?', o: ['will have been + -ing', 'had been + -ing', 'will be + V3'], a: 0, why: 'will have been + V-ing' },
      { t: 'choice', q: 'В 2030 году будет 10 лет, как мы здесь живём. → In 2030 we ___ here for ten years.', o: ['will have been living', 'have lived', 'lived'], a: 0, why: 'длительность к будущему моменту' },
      { t: 'tr', ru: 'К июню я буду учить английский уже пять лет.', a: ['By June I will have been learning English for five years', "By June I'll have been learning English for five years", 'By June I will have been studying English for five years', "By June I'll have been studying English for five years"], why: 'will have been learning' },
      { t: 'tr', ru: 'К вечеру я буду работать уже 10 часов.', a: ['By the evening I will have been working for ten hours', "By the evening I'll have been working for ten hours", 'By evening I will have been working for ten hours', "By evening I'll have been working for ten hours", 'By the evening I will have been working for 10 hours', "By the evening I'll have been working for 10 hours"], why: 'will have been working' },
      { t: 'order', ru: 'В мае будет год, как он тренируется.', a: 'In May he will have been training for a year', x: ['since'], why: 'will have been training for' }
    ]
  }
];
