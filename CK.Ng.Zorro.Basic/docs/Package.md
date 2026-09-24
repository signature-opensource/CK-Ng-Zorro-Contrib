Twelve Angular components for ng-zorro applications: a table, a list view, filters, an action bar, a
form built from a description, a split view, and the small pieces around them.

Every component is optional. Referencing the package generates nothing; you ask for one by putting
`[Requires<TableComponent>]` on your own TypeScript package class, then import the class from
`@local/ck-gen` and place its selector. There is no provider to register.

`AdaptivePageLayout` is the exception that pulls its own: action bar, table, list view and filters.

The table's filter dropdown uses the `Button.Search` and `Button.Cancel` keys that `CK.Ng.Zorro`
defines.
