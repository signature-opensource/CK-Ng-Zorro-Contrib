# CK.Ng.Zorro.Basic

Twelve Angular components for ng-zorro applications: a table, a list view, filters, an action bar, a
form built from a description, and the small pieces around them. Every one is optional - referencing
the package generates none of them until you ask for one by name.

```csharp
[TypeScriptPackage]
[Requires<TableComponent>]
[Requires<FiltersComponent>]
public sealed class AppPackage : TypeScriptPackage
{
}
```

## Asking for a component

The package declares no `[TypeScriptPackage]` class of its own. Each component is an `[NgComponent]`
attached to `ZorroPackage`, and each carries `IsOptional = true`:

```csharp
[NgComponent( IsOptional = true )]
[Package<ZorroPackage>]
[TypeScriptFile( "table-action-model.ts", "TableAction" )]
[TypeScriptFile( "table-column-model.ts", "TableCellStyle", "TableCellContext", "TableColumn", "DefaultTableColumn", "ColumnFilter" )]
[TypeScriptFile( "search-debouncer.ts", "SearchDebouncer", "createSearchDebouncer" )]
public sealed class TableComponent : NgComponent
{
}
```

Optional means what it says: a component nobody requires is not generated into `ck-gen` at all. Put
`[Requires<XxxComponent>]` on your own package class, then import the class from `@local/ck-gen` and
place its selector in a template. There is no provider to register - the package declares none.

[`AdaptivePageLayoutComponent`](AdaptivePageLayout/AdaptivePageLayoutComponent.cs) is the exception
that brings its own requirements: it requires `ActionBarComponent`, `TableComponent`,
`ListViewComponent` and `FiltersComponent`, so asking for it is enough for all five.

`ListViewComponent` is the one to watch. Its component imports `createSearchDebouncer`,
`SearchDebouncer` and `TableAction` from `@local/ck-gen`, all three declared by `TableComponent` - and
it declares no requirement on it. Ask for the list view alone and the install hook that rewrites
`@local/ck-gen` imports has nothing to resolve them to: setup fails with *Failed to find a file for
type 'createSearchDebouncer' in import from '@local/ck-gen'*. Require `TableComponent` alongside it.

## The components and their selectors

| Selector | Class | What it is |
|----------|-------|------------|
| `ck-table` | `Table<T>` | sortable, filterable, selectable table over `nz-table` |
| `ck-list-view` | `ListView<T>` | the same data as a plain list, for narrow screens |
| `ck-adaptive-page-layout` | `AdaptivePageLayout<T>` | switches between the two, with the action bar and filters |
| `ck-filters` | `Filters<T>` | select, switch and date-range filter chips |
| `ck-action-bar` | `ActionBar<T>` | left and right button groups, aware of the selection |
| `ck-generic-form` | `GenericForm` | a reactive form built from a `GenericFormData` description |
| `ck-selectable-list` | `SelectableList<T>` | a list with selection and double-click |
| `ck-split-view` | `SplitView` | sidebar plus detail, with `[ckSplitSidebar]` and `[ckSplitDetail]` slots |
| `ck-inline-edit` | `InlineEdit` | edit a value in place, confirm or cancel |
| `ck-simple-info-box` | `SimpleInfoBox` | a label, a value, and an optional subtitle, icon and colour |
| `ck-blockquote` | `Blockquote` | a styled quote |
| `ck-loader` | `Loader` | a full-size loading overlay |

## Translation keys

[`Table`](Table/Res/table.ts) asks `TranslateService` for `Button.Search`, `Button.Cancel` and
`CK.Table.Column.Actions` in its constructor. Only the third is defined here; the first two come from
`CK.Ng.Zorro`'s own `ts-locales` - "Search"/"Cancel", "Rechercher"/"Annuler" - which are always
present, since every component of this package is anchored on `ZorroPackage`. A non-empty
`searchButtonTitle` or `cancelButtonTitle` wins, but not through the emptiness test that guards each
`set()`: that test runs in the constructor, where the input still holds its `''` default, so it
almost always passes. What decides is that the three labels are `linkedSignal`s over the inputs - the
moment Angular applies the binding, the source changes and the signal discards the value the
translation had set. The guard is the fallback for the other timing, when the first translation load
is still pending and the callback arrives after the inputs are in place.

Three components ship keys of their own, under `Res/ts-locales/`: `AdaptivePageLayout`, `Filters` and
`Table`. Note that `AdaptivePageLayout` uses unprefixed names - `Button.ActivateAll`,
`Button.DeactivateAll`, `Button.Filters`, `Filters.Instruction` - where `Table` prefixes with
`CK.Table.`. They are the only unprefixed keys any package in this repository ships - `CK.Ng.Zorro`'s
own catalogue, where `Button.Search` and `Button.Cancel` above come from, is unprefixed throughout.
An application defining a global `Button.ActivateAll` retargets that one: the override is matched key
by key, not per package.

## Requirements

- `CK.Ng.Zorro`, for `ZorroPackage` - the anchor all twelve components attach to - the
  `ResponsiveDirective` that `AdaptivePageLayout` applies and `SplitView` imports, the `Button.Search`
  and `Button.Cancel` translations, and the LESS theme variables. Seven of the twelve `variables.less`
  reference those variables; `Blockquote` and `Loader` declare literals only, and `InlineEdit`,
  `SelectableList` and `SplitView` declare none - though those three still reach for them in their
  component stylesheet: `@ck-border-radius`, `@grey` and `@light-grey` in `InlineEdit`,
  `@primary-color` in `SelectableList`, `@white` in `SplitView`. `Blockquote` uses no outside
  variable at all. Three of the variables those five components' stylesheets use come from
  ng-zorro-antd rather than from `CK.Ng.Zorro`: `@primary-color-outline` in `SelectableList`,
  `@screen-md-max` in `SplitView` and `@screen-md-min` in `Loader`. Those three are not the package's
  whole debt to ng-zorro: the generated stylesheet is one Less compilation unit, with
  `ng-zorro-antd.less` imported ahead of it by `ZorroPackage`, so its variables are in scope for every
  file here. Components outside that group reach for `@screen-md-max`, `@screen-md-min` and
  `@text-color-secondary` in their own stylesheets, and `Filters` builds two of its declared variables
  on ng-zorro's, `@border-color-base` and `@text-color-secondary`.

- `CK.TS.Angular` and `CK.TypeScript`, for `NgComponent`, `[NgComponent]` and `[TypeScriptFile]`.
  `[Package<>]` and `[Requires<>]` are `CK.Core` attributes, from `CK.ResourceSpace.Abstractions`. All
  of it arrives through `CK.Ng.Zorro`, the csproj's only package reference.

- `ng-zorro-antd` on the TypeScript side, plus `@fortawesome/angular-fontawesome`,
  `@fortawesome/fontawesome-svg-core`, `@fortawesome/free-solid-svg-icons`, `@ngx-translate/core`
  and `rxjs`.

Known defects of this package are listed in [docs/issues.md](docs/issues.md).
