/**
 * Interface translations (EN / RU / KZ).
 *
 * Scope: navigation, hero, landing sections, CTAs, dashboard labels, the habit
 * planner and the emergency-focus flow. The English object is the source of
 * truth for the key set — `TranslationKey` is derived from it, and RU/KZ must
 * implement every key.
 */

export const LANGUAGES = [
  { code: "en", label: "EN", name: "English" },
  { code: "ru", label: "RU", name: "Русский" },
  { code: "kz", label: "KZ", name: "Қазақша" },
] as const;

export type Lang = (typeof LANGUAGES)[number]["code"];

const en = {
  /* ---------- header / navigation ---------- */
  "nav.home": "Home",
  "nav.dashboard": "My cabinet",
  "nav.install": "Chrome extension",
  "nav.features": "How it works",
  "nav.langLabel": "Interface language",
  "theme.label": "Theme",
  "theme.toLight": "Switch to light theme",
  "theme.toDark": "Switch to dark theme",

  /* ---------- auth (honest demo) ---------- */
  "auth.signIn": "Sign in",
  "auth.signInGoogle": "Continue with Google",
  "auth.googleButton": "Sign in with Google",
  "auth.orDemo": "or continue with the demo profile",
  "auth.signOut": "Sign out",
  "auth.dialogTitle": "Sign in to StayFocus",
  "auth.dialogSubtitle": "Choose an account to continue",
  "auth.demoBadge": "Demo sign-in",
  "auth.demoNote":
    "Your profile, streak and limits live only in this browser — nothing is uploaded. Without NEXT_PUBLIC_GOOGLE_CLIENT_ID the sign-in above is a demo, not a real Google account.",
  "auth.demoAccount": "Focus Friend",
  "auth.demoEmail": "focus.friend@gmail.com",
  "auth.cancel": "Cancel",
  "auth.gateTitle": "Your cabinet is one step away",
  "auth.gateText":
    "Sign in to open your streak, screen-time analytics, weekly planner and rescue mode. The demo profile is created locally in your browser.",
  "auth.gateCta": "Continue with Google",
  "auth.googleMissing":
    "Real Google sign-in is not configured. Add NEXT_PUBLIC_GOOGLE_CLIENT_ID and the button talks to Google.",
  "auth.googleFailed": "Google did not complete the sign-in. Try again.",
  "auth.googleLoading": "Contacting Google…",

  /* ---------- feed budget ---------- */
  "limits.eyebrow": "Feed budget",
  "limits.title": "How much feed is left today",
  "limits.desc":
    "Set a daily limit for each app. When the minutes run out, the only way back in is a set the camera can verify.",
  "limits.earned": "earned today",
  "limits.reset": "Reset day",
  "limits.limit": "Daily limit",
  "limits.mins": "min",
  "limits.locked": "Locked",
  "limits.remaining": "left",
  "limits.unlockCta": "Earn time with a workout",
  "limits.used": "Used today",
  "limits.note":
    "Real blocking needs the browser extension: a web page cannot read or stop another app's screen time. Here the limit, the lock and the earned minutes are real state, while usage is demo data.",

  /* ---------- workout gate ---------- */
  "workout.title": "The feed is locked",
  "workout.lockedFor": "The only way back is a set your camera can verify.",
  "workout.chooseHint":
    "Ten push-ups or twenty squats. The camera counts every rep and checks the form, so half-reps do not count.",
  "workout.pushup": "Push-ups",
  "workout.squat": "Squats",
  "workout.repsRequired": "reps",
  "workout.loadingModel": "Loading the pose model…",
  "workout.rejected": "not counted",
  "workout.fault.sagging": "Keep your body in one straight line",
  "workout.fault.piking": "Lower your chest — don't pike up",
  "workout.fault.shallow": "Go lower, this rep doesn't count",
  "workout.fault.notVisible": "Step back so your whole body is in frame",
  "workout.goUp": "Push back up",
  "workout.formOk": "Form looks good",
  "workout.cameraDenied": "Camera access is blocked",
  "workout.cameraError": "The camera or the model failed to start",
  "workout.cameraDeniedHelp":
    "Allow the camera for this site in the address bar, then try again.",
  "workout.cameraErrorHelp":
    "Close other apps that may hold the camera, then try again.",
  "workout.retry": "Try again",
  "workout.doneTitle": "Set complete",
  "workout.doneText": "Every rep was counted by the camera.",
  "workout.claim": "Unlock the feed",
  "workout.privacy":
    "Video is processed on this device only. Nothing is uploaded or stored.",
  "workout.leave": "Leave — the channel stays locked",

  /* ---------- hero ---------- */
  "hero.badge": "Anti-doomscroll hub · built for focus",
  "hero.title": "Your time is your greatest resource.",
  "hero.subtitle":
    "Stop the endless scrolling. Keep only the conversations that matter with the people you love, and pour that energy into your real goals.",
  "hero.cta": "Start your focus journey ⚡",
  "hero.ctaSecondary": "See the cabinet",
  "hero.status": "Free · no tracking · works in your browser",
  "hero.floatCard": "Reels blocked today",
  "hero.floatCard2": "Focus streak",

  /* ---------- landing stats ---------- */
  "stats.eyebrow": "What the community already did",
  "stats.hours.value": "120+",
  "stats.hours.label": "hours saved",
  "stats.hours.hint": "That is five full days of life given back to real things.",
  "stats.wins.value": "10,000+",
  "stats.wins.label": "wins over Reels",
  "stats.wins.hint": "Every skipped short video is a vote for your own attention.",
  "stats.control.value": "100%",
  "stats.control.label": "control",
  "stats.control.hint": "You decide when the feed opens. Never the other way round.",

  /* ---------- landing features ---------- */
  "home.features.eyebrow": "What is inside",
  "home.features.title": "A hub that makes focus feel like a win.",
  "home.features.desc":
    "Five tools that work together: a growing streak, honest analytics, a weekly plan, a rescue mode for the hard moments, and an extension that hides Reels and Shorts.",
  "feature.streak.title": "Focus streak",
  "feature.streak.desc":
    "A day counter with a progress bar, levels and a companion that levels up with you.",
  "feature.analytics.title": "Screen-time analytics",
  "feature.analytics.desc":
    "Instagram, TikTok and YouTube hours, day by day — and how much you already saved.",
  "feature.planner.title": "Weekly habit planner",
  "feature.planner.desc":
    "Plan sport, study, reading and projects into the slots Reels used to steal.",
  "feature.rescue.title": "Rescue mode",
  "feature.rescue.desc":
    "When the urge hits, a ten-second breathing timer and a motivational quote stand between you and the feed.",
  "feature.extension.title": "StayFocus Control",
  "feature.extension.desc":
    "A Chrome extension that removes the Reels and Shorts rails from your homepage and sidebar.",

  /* ---------- landing: how it works ---------- */
  "home.how.eyebrow": "Your first week",
  "home.how.title": "Three small moves, one changed day.",
  "home.how.step1.title": "Sign in",
  "home.how.step1.desc":
    "Create your local profile in one click and open the cabinet.",
  "home.how.step2.title": "Install the extension",
  "home.how.step2.desc":
    "Two minutes in Chrome and the infinite Reels rail is gone.",
  "home.how.step3.title": "Plan your week",
  "home.how.step3.desc":
    "Tick off real tasks daily and watch the streak grow on its own.",
  "home.how.quote":
    "The feed is designed to be endless. Your life is not. Choose the ending you want.",

  /* ---------- landing: extension install ---------- */
  "install.eyebrow": "StayFocus Control",
  "install.title": "Connect the extension in four steps.",
  "install.desc":
    "StayFocus Control hides Instagram Reels and YouTube Shorts and reports the time you reclaim back to this cabinet. It runs locally — nothing is uploaded.",
  "install.step1.title": "Download the folder",
  "install.step1.desc":
    "Get the extension folder and unzip it somewhere you will find again.",
  "install.step2.title": "Open chrome://extensions",
  "install.step2.desc":
    "Paste the address in Chrome and switch on Developer mode in the top-right corner.",
  "install.step3.title": "Load unpacked",
  "install.step3.desc":
    "Click “Load unpacked” and select the unzipped StayFocus Control folder.",
  "install.step4.title": "Sign in to link the cabinet",
  "install.step4.desc":
    "Log in once in the extension and your blocked-Reels counter starts syncing here.",
  "install.note":
    "Prototype packaging: the extension bundle is distributed with this project. Publishing to the Chrome Web Store is on the roadmap.",

  /* ---------- landing: closing CTA ---------- */
  "home.cta.title": "One scroll less today is one goal closer tomorrow.",
  "home.cta.desc":
    "Open your cabinet, set today's streak, and let the momentum do the rest.",
  "home.cta.button": "Open my cabinet",

  /* ---------- footer ---------- */
  "footer.tagline":
    "StayFocus is an anti-doomscrolling hub: fewer short videos, more real life, more time with the people you love.",
  "footer.product": "Product",
  "footer.legal": "About",
  "footer.demo":
    "Prototype notice: analytics, streaks and savings on this site are demo data. Nothing is uploaded to a server.",
  "footer.rights": "StayFocus. Built for attention that belongs to you.",

  /* ---------- dashboard: shell ---------- */
  "dash.demoBadge": "Demo data",
  "dash.hello": "Welcome back",
  "dash.subtitle": "Small wins, stacking daily.",
  "dash.today": "Today",
  "dash.of": "of",

  /* ---------- dashboard: streak ---------- */
  "dash.streak.eyebrow": "Focus streak",
  "dash.streak.title": "Days without doomscrolling",
  "dash.streak.days": "days",
  "dash.streak.dayOne": "day",
  "dash.streak.dayFew": "days",
  "dash.streak.best": "Personal best",
  "dash.streak.progress": "Progress to the next level",
  "dash.streak.next": "left to the next level",
  "dash.streak.today": "Mark today as won",
  "dash.streak.todayDone": "Today is already won",
  "dash.streak.reset": "Reset streak",
  "dash.level.1": "Level 1: Beginner",
  "dash.level.2": "Level 2: Apprentice",
  "dash.level.3": "Level 3: Warrior",
  "dash.level.4": "Level 4: Strategist",
  "dash.level.5": "Level 5: Focus Master",
  "dash.level.6": "Level 6: Legend",

  /* ---------- dashboard: focus pet ---------- */
  "dash.pet.title": "Focus companion",
  "dash.pet.desc":
    "Every day without Reels makes your companion stronger.",
  "dash.pet.stage.1": "Spark",
  "dash.pet.stage.2": "Little flame",
  "dash.pet.stage.3": "Steady flame",
  "dash.pet.stage.4": "Torch",
  "dash.pet.stage.5": "Beacon",
  "dash.pet.stage.6": "Supernova",
  "dash.pet.grow": "reaches the next form in",

  /* ---------- dashboard: analytics ---------- */
  "dash.screen.eyebrow": "Screen time",
  "dash.screen.title": "Where your hours go",
  "dash.screen.desc":
    "Last seven days, split by the three feeds you chose to tame.",
  "dash.screen.daily": "Daily split",
  "dash.screen.compare": "This week vs. before",
  "dash.screen.before": "Before StayFocus",
  "dash.screen.now": "This week",
  "dash.screen.saved": "Saved this week",
  "dash.screen.hoursShort": "h",
  "dash.screen.trend": "less than your own baseline",
  "dash.app.instagram": "Instagram",
  "dash.app.tiktok": "TikTok",
  "dash.app.youtube": "YouTube",

  /* ---------- dashboard: saved time ---------- */
  "dash.saved.eyebrow": "Saved time",
  "dash.saved.title": "What your saved hours become",
  "dash.saved.desc":
    "Drag the slider: hours you did not spend scrolling turn into real deeds.",
  "dash.saved.slider": "Hours saved today",
  "dash.saved.resultPrefix": "today =",
  "dash.saved.book": "pages of a book",
  "dash.saved.workout": "warm-up session",
  "dash.saved.lesson": "language lesson",
  "dash.saved.project": "project milestone",
  "dash.saved.family": "call with your family",
  "dash.saved.empty":
    "Raise the slider to see what those hours turn into.",

  /* ---------- dashboard: planner ---------- */
  "dash.planner.eyebrow": "Habit tracker",
  "dash.planner.title": "Your week, planned on purpose",
  "dash.planner.desc":
    "Instead of a feed, each slot holds something real. Tap a task when it is done.",
  "dash.planner.progress": "Week progress",
  "dash.planner.done": "done",
  "dash.planner.doneToday": "Today",
  "dash.planner.complete": "Perfect day. Your companion felt that.",
  "dash.planner.reset": "Clear week",
  "dash.habit.sport": "Sport",
  "dash.habit.study": "Study",
  "dash.habit.reading": "Reading",
  "dash.habit.project": "Own project",
  "dash.habit.walk": "Walk outside",
  "dash.habit.family": "Family time",
  "dash.habit.noReels": "No Reels",
  "dash.day.mon": "Mon",
  "dash.day.tue": "Tue",
  "dash.day.wed": "Wed",
  "dash.day.thu": "Thu",
  "dash.day.fri": "Fri",
  "dash.day.sat": "Sat",
  "dash.day.sun": "Sun",

  /* ---------- dashboard: emergency focus ---------- */
  "dash.emergency.eyebrow": "Rescue mode",
  "dash.emergency.title": "About to give in?",
  "dash.emergency.desc":
    "Ten seconds of breathing and one honest thought stand between you and the feed. Almost every urge fades in under a minute.",
  "dash.emergency.button": "I want to break",
  "dash.emergency.inhale": "Breathe in",
  "dash.emergency.exhale": "Breathe out",
  "dash.emergency.waiting": "Keep your eyes on the ring…",
  "dash.emergency.countdown": "seconds",
  "dash.emergency.quoteTitle": "While you breathe",
  "dash.emergency.abort": "Stop",
  "dash.emergency.unlockedTitle": "The urge passed",
  "dash.emergency.unlockedText":
    "You just won a minute back. Walk, drink water, or open your plan instead.",
  "dash.emergency.unlockedCta": "Back to my plan",
  "dash.emergency.again": "I still feel the pull",
  "dash.emergency.quote1":
    "You are not bored — you are being hunted by an algorithm. Look away.",
  "dash.emergency.quote2":
    "The feed will still be there in an hour. This moment will not.",
  "dash.emergency.quote3":
    "Every skipped Reel is a page of your own life that gets written.",
  "dash.emergency.quote4":
    "Nobody ever finished a dream while watching someone else's highlight reel.",
  "dash.emergency.quote5":
    "Breathe first. Decide after. Your future self is watching this moment.",

  /* ---------- dashboard: footer strip ---------- */
  "dash.install.title": "Link the extension",
  "dash.install.desc":
    "StayFocus Control removes Reels and Shorts and reports your reclaimed hours back here.",
} as const;

export type TranslationKey = keyof typeof en;

const ru: Record<TranslationKey, string> = {
  "nav.home": "Главная",
  "nav.dashboard": "Мой кабинет",
  "nav.install": "Chrome-расширение",
  "nav.features": "Как это работает",
  "nav.langLabel": "Язык интерфейса",
  "theme.label": "Тема",
  "theme.toLight": "Включить светлую тему",
  "theme.toDark": "Включить тёмную тему",

  "auth.signIn": "Вход",
  "auth.signInGoogle": "Войти через Google",
  "auth.googleButton": "Войти через Google",
  "auth.orDemo": "или продолжите с демо-профилем",
  "auth.signOut": "Выйти",
  "auth.dialogTitle": "Вход в StayFocus",
  "auth.dialogSubtitle": "Выберите аккаунт, чтобы продолжить",
  "auth.demoBadge": "Демо-вход",
  "auth.demoNote":
    "Профиль, стрик и лимиты хранятся только в этом браузере — ничего не загружается. Без NEXT_PUBLIC_GOOGLE_CLIENT_ID вход выше — демо, а не настоящий аккаунт Google.",
  "auth.demoAccount": "Друг Фокуса",
  "auth.demoEmail": "focus.friend@gmail.com",
  "auth.cancel": "Отмена",
  "auth.gateTitle": "До личного кабинета один шаг",
  "auth.gateText":
    "Войдите, чтобы открыть стрик, аналитику экранного времени, планнер на неделю и режим спасения. Демо-профиль создаётся локально в браузере.",
  "auth.gateCta": "Войти через Google",
  "auth.googleMissing":
    "Настоящий вход через Google не настроен. Добавьте NEXT_PUBLIC_GOOGLE_CLIENT_ID — и кнопка пойдёт в Google.",
  "auth.googleFailed": "Google не завершил вход. Попробуйте ещё раз.",
  "auth.googleLoading": "Связываюсь с Google…",

  "limits.eyebrow": "Бюджет ленты",
  "limits.title": "Сколько ленты осталось сегодня",
  "limits.desc":
    "Задайте дневной лимит для каждого приложения. Когда минуты закончатся, вернуться можно только через подход, который проверит камера.",
  "limits.earned": "заработано",
  "limits.reset": "Сбросить день",
  "limits.limit": "Дневной лимит",
  "limits.mins": "мин",
  "limits.locked": "Заблокировано",
  "limits.remaining": "осталось",
  "limits.unlockCta": "Заработать время тренировкой",
  "limits.used": "Использовано",
  "limits.note":
    "Настоящая блокировка требует расширения для браузера: веб-страница не может считывать или останавливать экранное время другого приложения. Здесь лимит, блокировка и заработанные минуты — реальное состояние, а расход времени — демо-данные.",

  "workout.title": "Лента заблокирована",
  "workout.lockedFor": "Вернуться можно только через подход, который проверит камера.",
  "workout.chooseHint":
    "Десять отжиманий или двадцать приседаний. Камера считает каждый повтор и проверяет технику, поэтому недоделанные повторы не засчитываются.",
  "workout.pushup": "Отжимания",
  "workout.squat": "Приседания",
  "workout.repsRequired": "повторов",
  "workout.loadingModel": "Загружаю модель тела…",
  "workout.rejected": "не засчитано",
  "workout.fault.sagging": "Держите тело одной прямой линией",
  "workout.fault.piking": "Опускайте грудь, не поднимайте таз",
  "workout.fault.shallow": "Ниже — этот повтор не засчитан",
  "workout.fault.notVisible": "Отойдите назад, чтобы всё тело было в кадре",
  "workout.goUp": "Выжимайтесь обратно",
  "workout.formOk": "Техника в порядке",
  "workout.cameraDenied": "Доступ к камере запрещён",
  "workout.cameraError": "Камера или модель не запустились",
  "workout.cameraDeniedHelp":
    "Разрешите камеру для этого сайта в адресной строке и попробуйте снова.",
  "workout.cameraErrorHelp":
    "Закройте другие приложения, которые могут занимать камеру, и попробуйте снова.",
  "workout.retry": "Попробовать снова",
  "workout.doneTitle": "Подход выполнен",
  "workout.doneText": "Камера засчитала каждый повтор.",
  "workout.claim": "Разблокировать ленту",
  "workout.privacy":
    "Видео обрабатывается только на этом устройстве. Ничего не загружается и не сохраняется.",
  "workout.leave": "Выйти — канал останется заблокированным",

  "hero.badge": "Хаб против думскроллинга · создан для фокуса",
  "hero.title": "Твое время — твой главный ресурс.",
  "hero.subtitle":
    "Останови бесконечный скроллинг. Оставь только общение с близкими и направь энергию на свои реальные цели.",
  "hero.cta": "Начать путь к фокусу ⚡",
  "hero.ctaSecondary": "Посмотреть кабинет",
  "hero.status": "Бесплатно · без трекинга · работает в браузере",
  "hero.floatCard": "Reels заблокировано сегодня",
  "hero.floatCard2": "Стрик фокуса",

  "stats.eyebrow": "Что уже сделало сообщество",
  "stats.hours.value": "120+",
  "stats.hours.label": "часов сэкономлено",
  "stats.hours.hint": "Это пять полных дней жизни, отданных реальным делам.",
  "stats.wins.value": "10 000+",
  "stats.wins.label": "побед над Reels",
  "stats.wins.hint": "Каждое пропущенное короткое видео — голос за твоё внимание.",
  "stats.control.value": "100%",
  "stats.control.label": "контроля",
  "stats.control.hint": "Ты решаешь, когда открыть ленту. И никогда наоборот.",

  "home.features.eyebrow": "Что внутри",
  "home.features.title": "Хаб, который делает фокус победой.",
  "home.features.desc":
    "Пять инструментов, которые работают вместе: растущий стрик, честная аналитика, план на неделю, режим спасения для сложных моментов и расширение, скрывающее Reels и Shorts.",
  "feature.streak.title": "Стрик побед",
  "feature.streak.desc":
    "Счётчик дней с полосой прогресса, уровнями и спутником, который растёт вместе с тобой.",
  "feature.analytics.title": "Аналитика экранного времени",
  "feature.analytics.desc":
    "Часы в Instagram, TikTok и YouTube по дням — и сколько уже удалось сэкономить.",
  "feature.planner.title": "Трекер привычек на неделю",
  "feature.planner.desc":
    "Планируй спорт, учёбу, чтение и проекты в те слоты, которые раньше съедали Reels.",
  "feature.rescue.title": "Режим спасения",
  "feature.rescue.desc":
    "Когда хочется сорваться, между тобой и лентой встают десятисекундный дыхательный таймер и мотивирующая цитата.",
  "feature.extension.title": "StayFocus Control",
  "feature.extension.desc":
    "Chrome-расширение, которое убирает ленты Reels и Shorts с главной страницы и из боковой панели.",

  "home.how.eyebrow": "Твоя первая неделя",
  "home.how.title": "Три небольших шага — и один изменённый день.",
  "home.how.step1.title": "Войдите",
  "home.how.step1.desc": "Создайте локальный профиль в один клик и откройте кабинет.",
  "home.how.step2.title": "Установите расширение",
  "home.how.step2.desc":
    "Две минуты в Chrome — и бесконечная лента Reels исчезает.",
  "home.how.step3.title": "Спланируйте неделю",
  "home.how.step3.desc":
    "Отмечайте реальные задачи каждый день и смотрите, как растёт стрик.",
  "home.how.quote":
    "Лента задумана бесконечной. Твоя жизнь — нет. Выбери, какой у неё будет финал.",

  "install.eyebrow": "StayFocus Control",
  "install.title": "Подключите расширение за четыре шага.",
  "install.desc":
    "StayFocus Control скрывает Instagram Reels и YouTube Shorts и возвращает сэкономленное время в этот кабинет. Всё работает локально — ничего не загружается на сервер.",
  "install.step1.title": "Скачайте папку",
  "install.step1.desc":
    "Получите папку расширения и распакуйте её в место, которое найдёте снова.",
  "install.step2.title": "Откройте chrome://extensions",
  "install.step2.desc":
    "Вставьте адрес в Chrome и включите «Режим разработчика» в правом верхнем углу.",
  "install.step3.title": "Загрузите распакованное",
  "install.step3.desc":
    "Нажмите «Загрузить распакованное расширение» и выберите папку StayFocus Control.",
  "install.step4.title": "Войдите, чтобы связать кабинет",
  "install.step4.desc":
    "Войдите один раз в расширении — и счётчик заблокированных Reels начнёт синхронизироваться здесь.",
  "install.note":
    "Упаковка прототипа: сборка расширения распространяется вместе с проектом. Публикация в Chrome Web Store — в планах.",

  "home.cta.title": "На один скролл меньше сегодня — на одну цель ближе завтра.",
  "home.cta.desc":
    "Откройте кабинет, отметьте сегодняшний день и позвольте импульсу сделать остальное.",
  "home.cta.button": "Открыть кабинет",

  "footer.tagline":
    "StayFocus — хаб против думскроллинга: меньше коротких видео, больше реальной жизни и времени с близкими.",
  "footer.product": "Продукт",
  "footer.legal": "О проекте",
  "footer.demo":
    "Уведомление о прототипе: аналитика, стрики и экономия на этом сайте — демонстрационные данные. Ничего не отправляется на сервер.",
  "footer.rights": "StayFocus. Сделано для внимания, которое принадлежит тебе.",

  "dash.demoBadge": "Демо-данные",
  "dash.hello": "С возвращением",
  "dash.subtitle": "Маленькие победы складываются каждый день.",
  "dash.today": "Сегодня",
  "dash.of": "из",

  "dash.streak.eyebrow": "Стрик побед",
  "dash.streak.title": "Дней без думскроллинга",
  "dash.streak.days": "дней",
  "dash.streak.dayOne": "день",
  "dash.streak.dayFew": "дня",
  "dash.streak.best": "Личный рекорд",
  "dash.streak.progress": "Прогресс до нового уровня",
  "dash.streak.next": "до следующего уровня",
  "dash.streak.today": "Отметить день как победу",
  "dash.streak.todayDone": "Сегодняшний день уже выигран",
  "dash.streak.reset": "Сбросить стрик",
  "dash.level.1": "Уровень 1: Новичок",
  "dash.level.2": "Уровень 2: Ученик",
  "dash.level.3": "Уровень 3: Воин",
  "dash.level.4": "Уровень 4: Стратег",
  "dash.level.5": "Уровень 5: Мастер Фокуса",
  "dash.level.6": "Уровень 6: Легенда",

  "dash.pet.title": "Питомец Фокуса",
  "dash.pet.desc": "Каждый день без Reels делает твоего спутника сильнее.",
  "dash.pet.stage.1": "Искра",
  "dash.pet.stage.2": "Огонёк",
  "dash.pet.stage.3": "Уверенное пламя",
  "dash.pet.stage.4": "Факел",
  "dash.pet.stage.5": "Маяк",
  "dash.pet.stage.6": "Сверхновая",
  "dash.pet.grow": "до новой формы осталось",

  "dash.screen.eyebrow": "Экранное время",
  "dash.screen.title": "Куда уходят твои часы",
  "dash.screen.desc":
    "Последние семь дней в разбивке по трём лентам, которые ты решил приручить.",
  "dash.screen.daily": "Разбивка по дням",
  "dash.screen.compare": "Эта неделя против прошлой",
  "dash.screen.before": "До StayFocus",
  "dash.screen.now": "Эта неделя",
  "dash.screen.saved": "Сэкономлено за неделю",
  "dash.screen.hoursShort": "ч",
  "dash.screen.trend": "меньше твоего собственного базового уровня",
  "dash.app.instagram": "Instagram",
  "dash.app.tiktok": "TikTok",
  "dash.app.youtube": "YouTube",

  "dash.saved.eyebrow": "Сэкономленное время",
  "dash.saved.title": "Во что превращаются твои часы",
  "dash.saved.desc":
    "Подвигай ползунок: часы, которые ты не потратил на скроллинг, становятся реальными делами.",
  "dash.saved.slider": "Часов сэкономлено сегодня",
  "dash.saved.resultPrefix": "сегодня =",
  "dash.saved.book": "страниц книги",
  "dash.saved.workout": "разминка",
  "dash.saved.lesson": "урок языка",
  "dash.saved.project": "шаг в проекте",
  "dash.saved.family": "звонок близким",
  "dash.saved.empty": "Подними ползунок, чтобы увидеть, во что превращаются эти часы.",

  "dash.planner.eyebrow": "Трекер привычек",
  "dash.planner.title": "Твоя неделя, спланированная осознанно",
  "dash.planner.desc":
    "Вместо ленты в каждом слоте — что-то реальное. Нажми на задачу, когда она выполнена.",
  "dash.planner.progress": "Прогресс недели",
  "dash.planner.done": "выполнено",
  "dash.planner.doneToday": "Сегодня",
  "dash.planner.complete": "Идеальный день. Твой спутник это почувствовал.",
  "dash.planner.reset": "Очистить неделю",
  "dash.habit.sport": "Спорт",
  "dash.habit.study": "Учёба",
  "dash.habit.reading": "Чтение",
  "dash.habit.project": "Свой проект",
  "dash.habit.walk": "Прогулка",
  "dash.habit.family": "Время с семьёй",
  "dash.habit.noReels": "Без Reels",
  "dash.day.mon": "Пн",
  "dash.day.tue": "Вт",
  "dash.day.wed": "Ср",
  "dash.day.thu": "Чт",
  "dash.day.fri": "Пт",
  "dash.day.sat": "Сб",
  "dash.day.sun": "Вс",

  "dash.emergency.eyebrow": "Режим спасения",
  "dash.emergency.title": "Хочешь сорваться?",
  "dash.emergency.desc":
    "Десять секунд дыхания и одна честная мысль стоят между тобой и лентой. Почти любое желание угасает меньше чем за минуту.",
  "dash.emergency.button": "Хочу сорваться",
  "dash.emergency.inhale": "Вдох",
  "dash.emergency.exhale": "Выдох",
  "dash.emergency.waiting": "Не отводи взгляд от круга…",
  "dash.emergency.countdown": "секунд",
  "dash.emergency.quoteTitle": "Пока ты дышишь",
  "dash.emergency.abort": "Стоп",
  "dash.emergency.unlockedTitle": "Желание прошло",
  "dash.emergency.unlockedText":
    "Ты только что вернул себе минуту. Пройдись, выпей воды или открой свой план.",
  "dash.emergency.unlockedCta": "Вернуться к плану",
  "dash.emergency.again": "Всё ещё тянет",
  "dash.emergency.quote1":
    "Тебе не скучно — на тебя охотится алгоритм. Отведи взгляд.",
  "dash.emergency.quote2":
    "Лента останется на месте через час. А этот момент — нет.",
  "dash.emergency.quote3":
    "Каждый пропущенный Reels — это написанная страница твоей собственной жизни.",
  "dash.emergency.quote4":
    "Никто ещё не осуществил мечту, пока смотрел чужую подборку лучших моментов.",
  "dash.emergency.quote5":
    "Сначала дыхание. Решение — после. Твой будущий ты наблюдает за этим моментом.",

  "dash.install.title": "Связать расширение",
  "dash.install.desc":
    "StayFocus Control убирает Reels и Shorts и возвращает сэкономленные часы сюда.",
};

const kz: Record<TranslationKey, string> = {
  "nav.home": "Басты бет",
  "nav.dashboard": "Менің кабинетім",
  "nav.install": "Chrome кеңейтімі",
  "nav.features": "Бұл қалай жұмыс істейді",
  "nav.langLabel": "Интерфейс тілі",
  "theme.label": "Тақырып",
  "theme.toLight": "Ашық тақырыпқа ауысу",
  "theme.toDark": "Қараңғы тақырыпқа ауысу",

  "auth.signIn": "Кіру",
  "auth.signInGoogle": "Google арқылы кіру",
  "auth.googleButton": "Google арқылы кіру",
  "auth.orDemo": "немесе демо-профильмен жалғастырыңыз",
  "auth.signOut": "Шығу",
  "auth.dialogTitle": "StayFocus-қа кіру",
  "auth.dialogSubtitle": "Жалғастыру үшін аккаунт таңдаңыз",
  "auth.demoBadge": "Демо-кіру",
  "auth.demoNote":
    "Профиль, стрик және шектеулер тек осы браузерде сақталады — ештеңе жүктелмейді. NEXT_PUBLIC_GOOGLE_CLIENT_ID болмаса, жоғарыдағы кіру — демо, нақты Google аккаунты емес.",
  "auth.demoAccount": "Фокус досы",
  "auth.demoEmail": "focus.friend@gmail.com",
  "auth.cancel": "Болдырмау",
  "auth.gateTitle": "Жеке кабинетке бір қадам қалды",
  "auth.gateText":
    "Стрик, экран уақытының аналитикасы, апталық жоспар және құтқару режимін ашу үшін кіріңіз. Демо-профиль браузерде жергілікті жасалады.",
  "auth.gateCta": "Google арқылы кіру",
  "auth.googleMissing":
    "Нақты Google кіруі бапталмаған. NEXT_PUBLIC_GOOGLE_CLIENT_ID қосыңыз — сонда түйме Google-ға жүгінеді.",
  "auth.googleFailed": "Google кіруді аяқтамады. Қайта көріңіз.",
  "auth.googleLoading": "Google-мен байланысып жатырмын…",

  "limits.eyebrow": "Лента бюджеті",
  "limits.title": "Бүгін лентадан қанша қалды",
  "limits.desc":
    "Әр қосымшаға күндік шектеу қойыңыз. Минуттар тауса, қайта кіру тек камера тексеретін жаттығу арқылы ғана мүмкін.",
  "limits.earned": "табылды",
  "limits.reset": "Күнді тазарту",
  "limits.limit": "Күндік шектеу",
  "limits.mins": "мин",
  "limits.locked": "Бұғатталды",
  "limits.remaining": "қалды",
  "limits.unlockCta": "Жаттығумен уақыт табу",
  "limits.used": "Пайдаланылды",
  "limits.note":
    "Нақты бұғаттау браузер кеңейтімін қажет етеді: веб-бет басқа қосымшаның экран уақытын оқи да, тоқтата да алмайды. Мұнда шектеу, бұғаттау және табылған минуттар — нақты күй, ал жұмсалған уақыт — демо-деректер.",

  "workout.title": "Лента бұғатталды",
  "workout.lockedFor": "Қайта кіру тек камера тексеретін жаттығу арқылы ғана.",
  "workout.chooseHint":
    "Он отжимание немесе жиырма приседание. Камера әр қайталауды санап, техниканы тексереді, сондықтан толық емес қайталау есептелмейді.",
  "workout.pushup": "Отжимание",
  "workout.squat": "Приседание",
  "workout.repsRequired": "қайталау",
  "workout.loadingModel": "Дене моделі жүктелуде…",
  "workout.rejected": "есептелмеді",
  "workout.fault.sagging": "Денені бір түзу сызықта ұстаңыз",
  "workout.fault.piking": "Кеудені түсіріңіз, жамбасты көтермеңіз",
  "workout.fault.shallow": "Төменірек — бұл қайталау есептелмеді",
  "workout.fault.notVisible": "Артқа шегініңіз, бүкіл дене кадрда болсын",
  "workout.goUp": "Қайта көтеріліңіз",
  "workout.formOk": "Техника дұрыс",
  "workout.cameraDenied": "Камераға рұқсат жоқ",
  "workout.cameraError": "Камера немесе модель іске қосылмады",
  "workout.cameraDeniedHelp":
    "Мекенжай жолағынан осы сайтқа камераға рұқсат беріп, қайта көріңіз.",
  "workout.cameraErrorHelp":
    "Камераны ұстап тұрған басқа қосымшаларды жауып, қайта көріңіз.",
  "workout.retry": "Қайта көру",
  "workout.doneTitle": "Жаттығу орындалды",
  "workout.doneText": "Камера әр қайталауды есептеді.",
  "workout.claim": "Лентаны ашу",
  "workout.privacy":
    "Видео тек осы құрылғыда өңделеді. Ештеңе жүктелмейді және сақталмайды.",
  "workout.leave": "Шығу — арна бұғатталған күйде қалады",

  "hero.badge": "Думскроллингке қарсы хаб · фокус үшін жасалған",
  "hero.title": "Уақытың — ең басты ресурсың.",
  "hero.subtitle":
    "Шексіз скроллды тоқтат. Тек жақындарыңмен қарым-қатынасты қалдыр және қуатыңды нақты мақсаттарыңа бағытта.",
  "hero.cta": "Фокус жолын бастау ⚡",
  "hero.ctaSecondary": "Кабинетті көру",
  "hero.status": "Тегін · трекингсіз · браузерде жұмыс істейді",
  "hero.floatCard": "Бүгін бұғатталған Reels",
  "hero.floatCard2": "Фокус стригі",

  "stats.eyebrow": "Қауымдастық не істеп үлгерді",
  "stats.hours.value": "120+",
  "stats.hours.label": "сағат үнемделді",
  "stats.hours.hint": "Бұл нақты істерге қайтарылған бес толық күн.",
  "stats.wins.value": "10 000+",
  "stats.wins.label": "Reels-тен жеңіс",
  "stats.wins.hint": "Әр өткізіп алған қысқа видео — өз назарың үшін берілген дауыс.",
  "stats.control.value": "100%",
  "stats.control.label": "бақылау",
  "stats.control.hint": "Лентаны қашан ашатыныңды өзің шешесің. Керісінше емес.",

  "home.features.eyebrow": "Ішінде не бар",
  "home.features.title": "Фокусты жеңіске айналдыратын хаб.",
  "home.features.desc":
    "Бірге жұмыс істейтін бес құрал: өсіп келе жатқан стрик, адал аналитика, апталық жоспар, қиын сәттерге құтқару режимі және Reels мен Shorts-ты жасыратын кеңейтім.",
  "feature.streak.title": "Жеңіс стригі",
  "feature.streak.desc":
    "Прогресс жолағы, деңгейлер және сенімен бірге өсетін серіктес бар күн санағышы.",
  "feature.analytics.title": "Экран уақытының аналитикасы",
  "feature.analytics.desc":
    "Instagram, TikTok және YouTube сағаттары күн сайын — және қанша үнемделгені.",
  "feature.planner.title": "Апталық әдет трекері",
  "feature.planner.desc":
    "Бұрын Reels алып кететін слоттарға спорт, оқу, кітап және жобаларды жоспарла.",
  "feature.rescue.title": "Құтқару режимі",
  "feature.rescue.desc":
    "Шыдамың таусылғанда, сен мен лентаның арасында он секундтық тыныс алу таймері мен мотивациялық дәйексөз тұрады.",
  "feature.extension.title": "StayFocus Control",
  "feature.extension.desc":
    "Басты бет пен бүйір панельден Reels және Shorts ленталарын аластайтын Chrome кеңейтімі.",

  "home.how.eyebrow": "Алғашқы аптаң",
  "home.how.title": "Үш кішкентай қадам — бір өзгерген күн.",
  "home.how.step1.title": "Кіріңіз",
  "home.how.step1.desc": "Бір басқанда жергілікті профиль жасап, кабинетті ашыңыз.",
  "home.how.step2.title": "Кеңейтімді орнатыңыз",
  "home.how.step2.desc": "Chrome-да екі минут — шексіз Reels лентасы жоғалады.",
  "home.how.step3.title": "Аптаңды жоспарлаңыз",
  "home.how.step3.desc":
    "Күн сайын нақты тапсырмаларды белгілеп, стриктің өсуін бақылаңыз.",
  "home.how.quote":
    "Лента шексіз болуға жасалған. Өмірің — жоқ. Қандай финал болатынын өзің таңда.",

  "install.eyebrow": "StayFocus Control",
  "install.title": "Кеңейтімді төрт қадаммен қосыңыз.",
  "install.desc":
    "StayFocus Control Instagram Reels пен YouTube Shorts-ты жасырады және үнемделген уақытты осы кабинетке қайтарады. Барлығы жергілікті — ештеңе серверге жіберілмейді.",
  "install.step1.title": "Қалтаны жүктеңіз",
  "install.step1.desc":
    "Кеңейтім қалтасын алып, кейін табатын жерге тарқатыңыз.",
  "install.step2.title": "chrome://extensions ашыңыз",
  "install.step2.desc":
    "Мекенжайды Chrome-ға қойып, жоғарғы оң жақтан «Әзірлеуші режимін» қосыңыз.",
  "install.step3.title": "Тарқатылғанын жүктеңіз",
  "install.step3.desc":
    "«Тарқатылған кеңейтімді жүктеу» түймесін басып, StayFocus Control қалтасын таңдаңыз.",
  "install.step4.title": "Кабинетті байланыстыру үшін кіріңіз",
  "install.step4.desc":
    "Кеңейтімде бір рет кіріңіз — бұғатталған Reels санағышы осында синхрондала бастайды.",
  "install.note":
    "Прототип қаптамасы: кеңейтім жинағы жобамен бірге таратылады. Chrome Web Store-ға жариялау — жоспарда.",

  "home.cta.title": "Бүгін бір скролл кем — ертең бір мақсат жақын.",
  "home.cta.desc":
    "Кабинетті ашып, бүгінгі күнді белгілеңіз — қалғанын серпін өзі жасайды.",
  "home.cta.button": "Кабинетімді ашу",

  "footer.tagline":
    "StayFocus — думскроллингке қарсы хаб: қысқа видеолар азайып, нақты өмір мен жақындармен уақыт көбейеді.",
  "footer.product": "Өнім",
  "footer.legal": "Жоба туралы",
  "footer.demo":
    "Прототип туралы ескерту: осы сайттағы аналитика, стриктер және үнемдеу — демо-деректер. Ештеңе серверге жіберілмейді.",
  "footer.rights": "StayFocus. Өзіңе тиесілі назар үшін жасалды.",

  "dash.demoBadge": "Демо-деректер",
  "dash.hello": "Қайта қош келдіңіз",
  "dash.subtitle": "Кішкентай жеңістер күн сайын қосылады.",
  "dash.today": "Бүгін",
  "dash.of": "/",

  "dash.streak.eyebrow": "Жеңіс стригі",
  "dash.streak.title": "Думскроллингсіз күндер",
  "dash.streak.days": "күн",
  "dash.streak.dayOne": "күн",
  "dash.streak.dayFew": "күн",
  "dash.streak.best": "Жеке рекорд",
  "dash.streak.progress": "Келесі деңгейге прогресс",
  "dash.streak.next": "келесі деңгейге дейін",
  "dash.streak.today": "Күнді жеңіс ретінде белгілеу",
  "dash.streak.todayDone": "Бүгінгі күн жеңілді",
  "dash.streak.reset": "Стрикті тазарту",
  "dash.level.1": "1-деңгей: Жаңадан бастаушы",
  "dash.level.2": "2-деңгей: Шәкірт",
  "dash.level.3": "3-деңгей: Жауынгер",
  "dash.level.4": "4-деңгей: Стратег",
  "dash.level.5": "5-деңгей: Фокус шебері",
  "dash.level.6": "6-деңгей: Аңыз",

  "dash.pet.title": "Фокус серігі",
  "dash.pet.desc": "Reels-сіз әр күн серігіңді күшейтеді.",
  "dash.pet.stage.1": "Ұшқын",
  "dash.pet.stage.2": "Кішкене жалын",
  "dash.pet.stage.3": "Тұрақты жалын",
  "dash.pet.stage.4": "Алау",
  "dash.pet.stage.5": "Шамшырақ",
  "dash.pet.stage.6": "Асқақ жұлдыз",
  "dash.pet.grow": "келесі формаға дейін",

  "dash.screen.eyebrow": "Экран уақыты",
  "dash.screen.title": "Сағаттарың қайда кетеді",
  "dash.screen.desc":
    "Соңғы жеті күн — қолға үйретуді таңдаған үш лента бойынша.",
  "dash.screen.daily": "Күндер бойынша бөлу",
  "dash.screen.compare": "Осы апта мен бұрынғы",
  "dash.screen.before": "StayFocus-қа дейін",
  "dash.screen.now": "Осы апта",
  "dash.screen.saved": "Апта ішінде үнемделді",
  "dash.screen.hoursShort": "сағ",
  "dash.screen.trend": "өз бастапқы деңгейіңнен аз",
  "dash.app.instagram": "Instagram",
  "dash.app.tiktok": "TikTok",
  "dash.app.youtube": "YouTube",

  "dash.saved.eyebrow": "Үнемделген уақыт",
  "dash.saved.title": "Сағаттарың неге айналады",
  "dash.saved.desc":
    "Жүгірткіні жылжыт: скроллға кетпеген сағаттар нақты істерге айналады.",
  "dash.saved.slider": "Бүгін үнемделген сағат",
  "dash.saved.resultPrefix": "бүгін =",
  "dash.saved.book": "кітап беті",
  "dash.saved.workout": "қыздыру жаттығуы",
  "dash.saved.lesson": "тіл сабағы",
  "dash.saved.project": "жоба қадамы",
  "dash.saved.family": "жақындарға қоңырау",
  "dash.saved.empty": "Осы сағаттар неге айналатынын көру үшін жүгірткіні көтер.",

  "dash.planner.eyebrow": "Әдет трекері",
  "dash.planner.title": "Мақсатпен жоспарланған апта",
  "dash.planner.desc":
    "Лентаның орнына әр слотта нақты іс. Орындалғанда тапсырмаға бас.",
  "dash.planner.progress": "Апта прогресі",
  "dash.planner.done": "орындалды",
  "dash.planner.doneToday": "Бүгін",
  "dash.planner.complete": "Мінсіз күн. Серігің мұны сезді.",
  "dash.planner.reset": "Аптаны тазарту",
  "dash.habit.sport": "Спорт",
  "dash.habit.study": "Оқу",
  "dash.habit.reading": "Кітап оқу",
  "dash.habit.project": "Өз жобам",
  "dash.habit.walk": "Серуендеу",
  "dash.habit.family": "Отбасымен уақыт",
  "dash.habit.noReels": "Reels жоқ",
  "dash.day.mon": "Дс",
  "dash.day.tue": "Сс",
  "dash.day.wed": "Ср",
  "dash.day.thu": "Бс",
  "dash.day.fri": "Жм",
  "dash.day.sat": "Сн",
  "dash.day.sun": "Жк",

  "dash.emergency.eyebrow": "Құтқару режимі",
  "dash.emergency.title": "Шыдамың таусылып бара ма?",
  "dash.emergency.desc":
    "Он секунд тыныс алу мен бір адал ой сен мен лентаның арасында тұр. Кез келген ұмтылыс бір минуттан аз уақытта басылады.",
  "dash.emergency.button": "Шыдамым таусылды",
  "dash.emergency.inhale": "Дем ал",
  "dash.emergency.exhale": "Дем шығар",
  "dash.emergency.waiting": "Көзіңді шеңберден алма…",
  "dash.emergency.countdown": "секунд",
  "dash.emergency.quoteTitle": "Сен тыныс алғанда",
  "dash.emergency.abort": "Тоқта",
  "dash.emergency.unlockedTitle": "Ұмтылыс басылды",
  "dash.emergency.unlockedText":
    "Сен бір минутты қайтарып алдың. Серуенде, су іш немесе жоспарыңды аш.",
  "dash.emergency.unlockedCta": "Жоспарыма қайту",
  "dash.emergency.again": "Әлі де тартады",
  "dash.emergency.quote1":
    "Сенің зерігуің емес — саған алгоритм аң аулап жатыр. Көзіңді бұр.",
  "dash.emergency.quote2":
    "Лента бір сағаттан кейін де осында болады. Ал осы сәт — жоқ.",
  "dash.emergency.quote3":
    "Әр өткізіп алған Reels — өз өміріңнің жазылған беті.",
  "dash.emergency.quote4":
    "Басқаның үздік сәттерін көре жүріп, ешкім арманын орындаған жоқ.",
  "dash.emergency.quote5":
    "Алдымен тыныс. Шешім — кейін. Болашақ өзің осы сәтті бақылап тұр.",

  "dash.install.title": "Кеңейтімді байланыстыру",
  "dash.install.desc":
    "StayFocus Control Reels мен Shorts-ты аластап, үнемделген сағаттарды осында қайтарады.",
};

export const DICTIONARY: Record<Lang, Record<TranslationKey, string>> = {
  en,
  ru,
  kz,
};

export function translate(lang: Lang, key: TranslationKey): string {
  return DICTIONARY[lang][key] ?? DICTIONARY.en[key];
}

export function isLang(value: unknown): value is Lang {
  return value === "en" || value === "ru" || value === "kz";
}

/**
 * Correct word for a number of days.
 *
 * English and Kazakh use two forms, while Russian needs the 1 / 2–4 / 5+ rule
 * (with the 11–14 exception), so a single "days" string is not enough here.
 */
export function pluralDay(lang: Lang, count: number): string {
  const dict = DICTIONARY[lang];
  if (lang === "ru") {
    const hundreds = Math.abs(count) % 100;
    const last = hundreds % 10;
    // 11–14 always take the many-form: 11 дней, 12 дней, 14 дней.
    if (hundreds > 10 && hundreds < 20) return dict["dash.streak.days"];
    if (last === 1) return dict["dash.streak.dayOne"];
    if (last >= 2 && last <= 4) return dict["dash.streak.dayFew"];
    return dict["dash.streak.days"];
  }
  return Math.abs(count) === 1 ? dict["dash.streak.dayOne"] : dict["dash.streak.days"];
}

/** Locale used for date/number formatting per language. */
export const LOCALE_BY_LANG: Record<Lang, string> = {
  en: "en-GB",
  ru: "ru-RU",
  kz: "kk-KZ",
};
