using CK.Core;
using CK.TS.Angular;

namespace CK.Ng.Zorro;

[NgComponent( IsOptional = true )]
[Package<ZorroPackage>]
[Requires<ActionBarComponent>]
[Requires<TableComponent>]
[Requires<ListViewComponent>]
[Requires<FiltersComponent>]
public sealed class AdaptivePageLayoutComponent : NgComponent
{
}
