# CK.Ng.Zorro.BackOffice

The shell of a back-office application: a layout with a sidebar, a top bar and a mobile bar, the
content frame that goes inside it, and a search modal the sidebar opens. Unlike the components it
builds on, none of these six is optional - referencing the package generates all of them.

```csharp
[TypeScriptPackage]
[Requires<ZorroBackOfficePackage>]
public sealed class AppPackage : TypeScriptPackage
{
}
```

```html
<ck-backoffice-layout [navigationItems]="sections">
  <router-outlet />
</ck-backoffice-layout>
```

## Setting it up

Reference the package and require [`ZorroBackOfficePackage`](ZorroBackOfficePackage.cs). That is the
whole C# step. The six components carry no `IsOptional`, so all of them are generated and you pick
the ones you place.

Import `Layout` from `@local/ck-gen`, put `<ck-backoffice-layout>` in your application shell with
`<router-outlet />` as its projected content, and feed it `[navigationItems]` as an array of
`NavigationSection`. Per page, wrap the content in `<ck-backoffice-layout-content>`.

There is no provider and no route: the package declares neither.

## The six components

| Selector | Class | Where it goes |
|----------|-------|---------------|
| `ck-backoffice-layout` | `Layout` | the shell, once |
| `ck-backoffice-layout-content` | `LayoutContent<T>` | inside each page |
| `ck-backoffice-side-bar` | `SideBar` | placed by `Layout` on wide screens |
| `ck-backoffice-top-bar` | `TopBar` | placed by `Layout` on wide screens |
| `ck-backoffice-mobile-bar` | `MobileBar` | placed by `Layout` on narrow screens |
| `ck-search-modal` | `SearchModal` | never placed by you - see below |

`Layout` switches between the sidebar pair and the mobile bar with `*appResponsive` at 1024/1025px.
`LayoutContent` switches its filter surface between a popover and a drawer at 991px, through the CDK
breakpoint observer. Between 992 and 1024 pixels you therefore get the mobile bar with the desktop
filter popover.

## Creating the search modal

`SearchModal` injects `NzModalRef` and `NZ_MODAL_DATA` without `{ optional: true }`, so constructing
it outside a modal throws. `SideBar.openSearchModal()` is what creates it, through `NzModalService`,
and it always supplies a placeholder - a hand-rolled caller that omits one hits a null dereference.

`SideBar` reaches it by a deep generated path rather than the `@local/ck-gen` barrel, and
`SideBarComponent` declares no requirement on `SearchModalComponent`. The import resolves only
because that component is non-optional and therefore always generated.

## Two route-parameter helpers

[`Res/route-params.helper.ts`](Res/route-params.helper.ts) ships alongside the components. No
attribute declares it, so it is installed like any other resource but its exports stay out of the
`@local/ck-gen` barrel - a file is exported from the barrel only when it declares a TypeScript type,
which `[TypeScriptFile]` does for a model file and `[NgComponent]` does for a component's own `.ts`.
Reach the helpers by their generated path. `SideBar` writes that same deep form for the search modal,
but there it is a choice: `SearchModal` is a component and the barrel would have worked.

The file exports `injectNumberRouteParam( key )` and `injectStringRouteParam( key )`, each
returning a `Signal` fed by the current route's parameters. The number one parses the value and
falls back to `0`, on a missing key as on an unparsable one. The string one is declared
`Signal<string>` and yields `null` for a missing key, so treat it as nullable whatever the
signature says.

## Two application-wide effects

`Res/BackOffice.less` declares five `@ck-` variables - four of which the other stylesheets consume,
while `@ck-backoffice-search-bar-color` is read nowhere - and two unscoped rules over five `.ant-`
selectors. It sets a border radius on every `.ant-btn` and `.ant-modal-content`, and forces
`height: 100%` on `.ant-tabs`, `.ant-tabs-content` and `.ant-tabs-tabpane`. Referencing the package
is enough to get them.

`LayoutContent`'s filter methods mutate the `Filter` objects you passed in - they set `active` in
place - and then emit the same array instance back.

## The user info box transformer

`Layout/Res/top-bar.t` and `mobile-bar.t` are the only transformers here. Each one inserts
`UserInfoBox` into its component's `imports:` array by replacing the literal `"CommonModule"`:

```
create <ts> transformer
begin
    ensure import { UserInfoBox } from '@local/ck-gen';

    in after "@Component"
        in first {^braces}
            in after "imports:"
                in first {^[]}
                    replace "CommonModule" with "CommonModule, UserInfoBox";
end
```

Both templates render `<ck-user-info-box />` while neither component lists the import itself, so the
transformer is load-bearing. `replace` with no cardinality means exactly one match, so the array must
contain `CommonModule` once. Rename it or drop it and the transform fails with `Expected a single
match but got 0.`; list it twice and the count in that message becomes 2. Either way it fails - it
does not quietly skip the insertion.

## Requirements

- `CK.Ng.Zorro.Basic`, for the action bar and the filters that `LayoutContent` composes. It does not
  use the table.

- `CK.Ng.Zorro.Breadcrumb`, for the breadcrumb `LayoutContent` places.

- `CK.Ng.Zorro`, arriving through those two, for the `ResponsiveDirective` the layout switches on and
  the LESS theme variables. This package never names `ZorroPackage` itself: its own
  `ZorroBackOfficePackage` is a plain `[TypeScriptPackage]`.

- `CK.TS.Angular`, arriving through `CK.Ng.Zorro`, for `NgComponent` - the base class all six derive
  from - and for `INgUserInfoBoxComponent`, the abstraction the top bar and the mobile bar require.
  No implementation of it is named here; the application supplies one.

- `@angular/cdk/layout` for the breakpoint observer, `@angular/router` for the sidebar's and the
  mobile bar's navigation and active-item tracking and for the two route-parameter helpers, thirteen
  `ng-zorro-antd` entry points - layout, menu, modal, drawer, popover, badge, button, checkbox,
  divider, dropdown, input, select, tooltip - plus `@fortawesome/angular-fontawesome` with the
  free-solid and free-regular icon packages, and `@ngx-translate/core`.

Known defects of this package are listed in [docs/issues.md](docs/issues.md).
