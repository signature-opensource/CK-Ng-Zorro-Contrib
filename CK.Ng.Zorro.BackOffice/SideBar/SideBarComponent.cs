using CK.Core;
using CK.Ng.Zorro.BackOffice;
using CK.TS.Angular;
using CK.TypeScript;

namespace CK.Ng.Zorro;

[NgComponent]
[Package<BackOfficePackage>]
[TypeScriptFile( "navigation-model.ts", "NavigationSection", "NavigationItem" )]
[TypeScriptFile( "version-infos-model.ts", "VersionInfos" )]
public sealed class SideBarComponent : NgComponent
{
}
