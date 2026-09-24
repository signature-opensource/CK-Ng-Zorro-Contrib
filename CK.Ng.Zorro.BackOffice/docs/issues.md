# CK.Ng.Zorro.BackOffice - known issues

Defects found in this package while writing its README. They are listed here
rather than in the README because they are problems to fix, not behaviour to rely on.

## Declared but unused members

`TopBar` declares `userName`, `selectedLanguage` and `displayThemeToggle`, and the outputs
`themeToggled`, `profileClicked`, `disconnectClicked` and `appIconClicked`. Its template references
none of them: it renders the WCS dropdown, the optional bell and the user info box. Binding any of
those inputs or listening to those outputs does nothing.

Two of the three translation keys the package ships for the top bar follow from that -
`CK.TopBar.Button.Logout` and `CK.TopBar.Button.Profile` appear in the locale files and nowhere in
the component. The flag images under its `ts-assets` are mapped and never rendered.

`Layout` has the same shape in three places. Its language API - `selectedLanguage`,
`languageChanged`, `selectLanguage()` - is never reached from its template. It binds `(searchCleared)`
on `TopBar`, which declares no such output, so `Layout.searchCleared` is emitted by nothing. And it
forwards neither `displayNotifIcon` nor `searchPlaceholder` to the mobile bar, so the notification
bell appears on wide screens only.

`LayoutContent.breadcrumbSeparator` is declared as a string and never forwarded; the breadcrumb's own
separator is an icon, so the two could not meet even if it were.
