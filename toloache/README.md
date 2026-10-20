# Toloache — website design concept

Unsolicited redesign concept for Toloache, 49 rue de Clignancourt, 75018 Paris.
Not the official website and not affiliated with the restaurant. Every page carries
that notice, uses `noindex`, and sends bookings to the restaurant's own booking page.

Pages: `index.html`, `menu.html`, `story.html`, `events.html`, `contact.html`.
They are generated from shared components: edit `build.py` (data at the top), then run
`python3 toloache/build.py`. Styles and behaviour live in `assets/`.

## To confirm with the restaurant before launch
- Opening hours (other listings differ from the restaurant's site; kitchen closing time).
- Phone number (+33 6 41 84 76 55 differs across listings).
- Full menu, current prices, dish descriptions, drinks, lunch formulas; spelling of "Arrachera".
- Founders' names, opening year, story behind the name.
- La Playita opening days (listings say Thursday–Sunday, but the restaurant is closed on Sunday).
- Upcoming event dates.
- Photography: every "Photo to come" frame lists the shot it needs.
- Whether a contact form should send messages (the concept form only validates and lets the user copy the text).
- Structured data omits hours and phone until they are confirmed.
