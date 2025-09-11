using CK.Core;
using CK.Ng.Zorro.BackOffice;
using CK.TS.Angular;

namespace CK.Ng.Zorro;

[NgComponent]
[Package<BackOfficePackage>]
[Requires<SideBarComponent, TopBarComponent, MobileBarComponent>]
public sealed class LayoutComponent : NgComponent
{
}
