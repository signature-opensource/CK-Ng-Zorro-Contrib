# CK-Ng-Zorro-Contrib

[![Licence](https://img.shields.io/github/license/signature-opensource/CK-Ng-Zorro-Contrib.svg)](LICENSE)

Angular components for ng-zorro back-office applications: the page shell, and the pieces that go
inside it.

| Package | Description | Latest stable |
|---------|-------------|---------------|
| [CK.Ng.Zorro.Basic](CK.Ng.Zorro.Basic/README.md) | Twelve optional components: table, list view, filters, action bar, generic form, split view and the small ones around them. | [![nuget](https://img.shields.io/nuget/v/CK.Ng.Zorro.Basic.svg?label=CK.Ng.Zorro.Basic)](https://www.nuget.org/packages/CK.Ng.Zorro.Basic/) |
| [CK.Ng.Zorro.Breadcrumb](CK.Ng.Zorro.Breadcrumb/README.md) | A breadcrumb trail whose items can carry a dropdown of children. | [![nuget](https://img.shields.io/nuget/v/CK.Ng.Zorro.Breadcrumb.svg?label=CK.Ng.Zorro.Breadcrumb)](https://www.nuget.org/packages/CK.Ng.Zorro.Breadcrumb/) |
| [CK.Ng.Zorro.BackOffice](CK.Ng.Zorro.BackOffice/README.md) | The shell: layout, sidebar, top bar, mobile bar, content frame and search modal. | [![nuget](https://img.shields.io/nuget/v/CK.Ng.Zorro.BackOffice.svg?label=CK.Ng.Zorro.BackOffice)](https://www.nuget.org/packages/CK.Ng.Zorro.BackOffice/) |

Start with `CK.Ng.Zorro.BackOffice` if you are building a back office: it composes
`CK.Ng.Zorro.Basic` and `CK.Ng.Zorro.Breadcrumb`, and gives you the shell in one reference. Reach for
`CK.Ng.Zorro.Basic` on its own when you want a table or a form without the shell around it.

Everything here builds on `CK.Ng.Zorro`, which carries the theme variables, the responsive directive
and the notification service. The user info box the back-office bars render is required as
`INgUserInfoBoxComponent`, an abstraction of `CK.TS.Angular`: the application supplies the
implementation.
