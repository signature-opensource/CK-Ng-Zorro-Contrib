A breadcrumb trail for ng-zorro applications, whose items can carry a dropdown of children.

The component is optional: put `[Requires<BreadcrumbComponent>]` on your own TypeScript package
class, import `Breadcrumb` from `@local/ck-gen` and place `<ck-backoffice-breadcrumb>`. No provider
to register.

Two things to know: the separator is an icon and not a string, and a positive `minItemsShow` keeps
the last items rather than the first.
