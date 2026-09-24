# CK.Ng.Zorro.Breadcrumb

A breadcrumb trail whose items can carry a dropdown of children. One optional component, its item
component, and the pipe that truncates the trail.

```csharp
[NgComponent( IsOptional = true )]
[Package<ZorroPackage>]
[TypeScriptFile( "breadcrumb-item-model.ts", "BreadcrumbItem" )]
public sealed class BreadcrumbComponent : NgComponent
{
}
```

## Asking for the component

The component is optional, so referencing the package is not enough: put
`[Requires<BreadcrumbComponent>]` on your own package class. Then import `Breadcrumb` from
`@local/ck-gen` and place `<ck-backoffice-breadcrumb [breadcrumbItems]="..." (navItemClicked)="...">`.

There is no provider to register. `Breadcrumb` provides `BreadcrumbBase` itself, through its own
`providers` entry, and that is how each item reaches its parent's separator.

## The item model

[`BreadcrumbItem`](Res/breadcrumb-item-model.ts) is the only type `[TypeScriptFile]` declares -
`Breadcrumb` itself is declared by `[NgComponent]`. Only `name` is required; `icon`, `onClick`,
`children` and `disabled` are all optional.

`onClick` runs before `navItemClicked` is emitted, and a disabled item does neither.

## The separator icon

`separator` is an `IconDefinition`, defaulting to `faChevronRight` - not a string. It renders only
when the item has at least one child, or is not the last one; in the first case it doubles as the
dropdown trigger. An empty `children` array fails the first test, so an item carrying one falls
through to the second: a bare separator unless it is last, and none at all when it is.

## Truncating the trail

A positive `minItemsShow` limits how many items are rendered.
[`BreadcrumbItemShowPipe`](Res/breadcrumb-item-show-pipe.ts) slices the array in the template, from
the end, so the items kept are the last ones: the root is the first one dropped, and the shallowest
survivor renders at the head of the trail. Leave the input unset and the whole trail renders.

## Requirements

- `CK.Ng.Zorro`, for `ZorroPackage` and the LESS theme variables `variables.less` builds on.

- `CK.TS.Angular` for `NgComponent` and `[NgComponent]`, `CK.TypeScript` for `[TypeScriptFile]`, and
  `CK.ResourceSpace.Abstractions` for `[Package<>]` and `[Requires<>]`. All three arrive through
  `CK.Ng.Zorro`.

- `@angular/cdk/bidi` for the text direction, and `ng-zorro-antd`'s dropdown and menu on the
  TypeScript side. Three FontAwesome entry points: `@fortawesome/angular-fontawesome` for the
  rendering module, `@fortawesome/fontawesome-svg-core` for the `IconDefinition` type that both
  models use, and `@fortawesome/free-solid-svg-icons` for `faChevronRight`, the default separator.

Known defects of this package are listed in [docs/issues.md](docs/issues.md).
