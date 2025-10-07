using CK.Core;
using CK.Ng.Zorro.BackOffice;
using CK.TS.Angular;

namespace CK.Ng.Zorro;

[NgComponent]
[Package<ZorroBackOfficePackage>]
[Requires<BreadcrumbComponent, FiltersComponent, ActionBarComponent>]
public sealed class LayoutContentComponent : NgComponent
{
}
