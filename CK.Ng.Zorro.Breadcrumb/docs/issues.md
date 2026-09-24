# CK.Ng.Zorro.Breadcrumb - known issues

Defects found in this package while writing its README. They are listed here
rather than in the README because they are problems to fix, not behaviour to rely on.

`minItemsShow` is named as a minimum and behaves as a maximum. Nothing in the component guarantees a
floor: the pipe slices, it never pads. A caller who reads the name and binds it to keep at least
three items gets at most three instead.

It is not a maximum over its whole domain either. The pipe computes
`value.slice(-(minItemShow ?? value.length))`, and `-0` is `0` in JavaScript, so a bound `0`
renders the entire trail instead of nothing. A negative value flips the slice and drops that many
items from the front. The input is declared `input<number>()` and nothing validates it before the
template passes it to the pipe.

`breadcrumb-item.less` carries an `.ant-dropdown-menu { ... }` block, and nothing scopes it - but
nothing loads it either. No component here declares `styleUrl` or `styles`, and the engine imports
only a package's primary stylesheet into the generated global one: the file named `styles`, or the
one named after the package folder. The folder is `breadcrumb` and there is no `breadcrumb.less`, so
`breadcrumb-item.less` is copied into `ck-gen` and imported by nothing. The item styling does not
reach the page either. Both components also set `ViewEncapsulation.None`; with no component styles to
encapsulate, it changes nothing.

`CKBreadcrumbItem` injects `BreadcrumbBase` without `{ optional: true }`. Placing
`<ck-breadcrumb-item>` outside a `<ck-backoffice-breadcrumb>` throws at injection.
