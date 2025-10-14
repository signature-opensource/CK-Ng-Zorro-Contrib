using CK.Core;
using CK.Ng.Zorro.BackOffice;
using CK.TS.Angular;
using CK.TypeScript;

namespace CK.Ng.Zorro;

[NgComponent]
[Package<ZorroBackOfficePackage>]
[TypeScriptFile( "wcs-type-model.ts", "WCSType" )]
[Requires<INgUserInfoBoxComponent>]
public sealed class TopBarComponent : NgComponent
{
}
