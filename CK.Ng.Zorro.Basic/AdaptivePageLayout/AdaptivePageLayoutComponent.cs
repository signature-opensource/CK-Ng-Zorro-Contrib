using CK.Core;
using CK.TS.Angular;
using CK.TypeScript;

namespace CK.Ng.Zorro;

[NgComponent( IsOptional = true )]
[Package<ZorroPackage>]
[Requires<ActionBarComponent>]
[Requires<TableComponent>]
[Requires<ListViewComponent>]
[Requires<FiltersComponent>]
[TypeScriptFile( "adaptive-page-layout-model.ts", "LayoutRadioChoice" )]
public sealed class AdaptivePageLayoutComponent : NgComponent
{
}
