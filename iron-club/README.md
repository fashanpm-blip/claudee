# IRON CLUB — premium fitness website concept (EN / RU)

Seven pages in English (`iron-club/*.html`) and Russian (`iron-club/ru/*.html`):
Home, Training, Membership, Coaches, About, Contact, Free Trial. The RU/EN button
switches to the same page in the other language.

Pages are generated from shared components: edit copy in `build.py`
(every string is `L("English", "Русский")`), then run `python3 iron-club/build.py`.

## Sample content to replace
- Club address, phone, real opening hours (contact page placeholders are dashed).
- Prices (€29 / €49 / €89, yearly = 10 months), plan features.
- Coach names, roles and portraits; timetable.
- Photography: every "Photo slot" lists the shot it needs. Use your own or licensed photos.
- Forms only validate and show a demo confirmation; connect them to a real backend before launch.
- `hreflang` links are relative; switch to absolute URLs once the domain is known. Remove `noindex` at launch.
