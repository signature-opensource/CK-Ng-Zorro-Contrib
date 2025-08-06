using CK.Core;
using CK.TS.Angular;

namespace CK.Ng.Zorro;

[NgComponent]
[Package<BackOfficePackage>]
[Requires<SideBarComponent, TopBarComponent, MobileBarComponent>]
public sealed class LayoutComponent : NgComponent
{
}
