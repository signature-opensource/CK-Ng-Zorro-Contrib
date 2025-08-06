using CK.Core;
using CK.TS.Angular;
using CK.TypeScript;

namespace CK.Ng.Zorro;

[NgComponent]
[Package<BackOfficePackage>]
[TypeScriptFile( "models/wcs-type.model.ts", "WCSType" )]
[Requires<INgUserInfoBoxComponent>]
public sealed class TopBarComponent : NgComponent
{
}
