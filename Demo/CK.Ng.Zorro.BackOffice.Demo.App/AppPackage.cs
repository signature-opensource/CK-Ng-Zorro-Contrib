using CK.Core;
using CK.TypeScript;

namespace CK.Ng.Zorro.BackOffice.Demo.App;

[TypeScriptPackage]
[Requires<ZorroBackOfficePackage>]
[Requires<BlockquoteComponent>]
[Requires<GenericFormComponent>]
[Requires<LoaderComponent>]
[Requires<TableComponent>]
[Requires<FiltersComponent>]
[Requires<SimpleInfoBoxComponent>]
[Requires<InlineEditComponent>]
[Requires<ListViewComponent>]
[Requires<AdaptivePageLayoutComponent>]
[Requires<SplitViewComponent>]
[Requires<SelectableListComponent>]
public sealed class AppPackage : TypeScriptPackage
{
}
