using CK.Core;
using CK.TS.Angular;
using CK.TypeScript;

namespace CK.Ng.Zorro;

[NgComponent]
[Package<BackOfficePackage>]
[TypeScriptFile( "models/navigation.model.ts", "NavigationSection", "NavigationItem" )]
[TypeScriptFile( "models/version-infos.model.ts", "VersionInfos" )]
public sealed class SideBarComponent : NgComponent
{
}
